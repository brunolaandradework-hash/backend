import PDFDocument from "pdfkit";
import { prisma } from "../libs/prisma.config";
import { stopWords } from "../utils/stopWords";

interface GenerateMonthlyReport {
  userId: number;
  month: number;
  year: number;
}

function normalizeWord(word: string) {
  const dictionary: Record<string, string> = {
    dores: "dor",
    dolorido: "dor",
    dolorida: "dor",
    pernas: "perna",
    bracos: "braco",
    braços: "braco",
    costas: "costa",
    lombar: "costa",
    musculares: "muscular",
    musculos: "muscular",
    músculos: "muscular",
    cansada: "cansaco",
    cansado: "cansaco",
    cansaço: "cansaco",
    crises: "crise",
    dormi: "sono",
    dormir: "sono",
    descanso: "sono",
    reparador: "sono",
    melhor: "melhora",
    melhorou: "melhora",
    piorar: "piora",
    piorou: "piora",
  };

  return dictionary[word] || word;
}

function getMostUsedWords(notes: (string | null)[]) {
  const words = notes
    .filter(Boolean)
    .join(" ")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s]/g, "")
    .split(/\s+/)
    .map((word) => normalizeWord(word))
    .filter((word) => word.length > 2 && !stopWords.includes(word));

  const count: Record<string, number> = {};

  words.forEach((word) => {
    count[word] = (count[word] || 0) + 1;
  });

  return Object.entries(count)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
}

export const generateMonthlySymptomsReport = async ({
  userId,
  month,
  year,
}: GenerateMonthlyReport): Promise<Buffer> => {
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0, 23, 59, 59, 999);

  const symptoms = await prisma.symptom.findMany({
    where: {
      userId,
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    },
    orderBy: {
      createdAt: "asc",
    },
    select: {
      painLevel: true,
      fatigueLevel: true,
      sleepQuality: true,
      mood: true,
      notes: true,
      createdAt: true,
    },
  });

  if (symptoms.length === 0) {
    throw new Error("Nenhum registro encontrado para este mês");
  }

  const totalPain = symptoms.reduce((sum, item) => sum + item.painLevel, 0);
  const totalFatigue = symptoms.reduce(
    (sum, item) => sum + item.fatigueLevel,
    0,
  );
  const totalSleep = symptoms.reduce((sum, item) => sum + item.sleepQuality, 0);

  const averagePain = (totalPain / symptoms.length).toFixed(1);
  const averageFatigue = (totalFatigue / symptoms.length).toFixed(1);
  const averageSleep = (totalSleep / symptoms.length).toFixed(1);

  const maxPain = Math.max(...symptoms.map((item) => item.painLevel));
  const minPain = Math.min(...symptoms.map((item) => item.painLevel));

  const mostUsedWords = getMostUsedWords(
    symptoms.map((symptom) => symptom.notes || null),
  );

  const colors = {
    roseDark: "#4A001F",
    rose: "#E11D48",
    roseLight: "#FFF1F2",
    roseSoft: "#FFE4E6",
    roseBorder: "#FECDD3",
    muted: "#9F1239",
    white: "#FFFFFF",
  };

  const doc = new PDFDocument({
    margin: 50,
    size: "A4",
  });

  const buffers: Buffer[] = [];

  doc.on("data", (chunk) => buffers.push(chunk));

  function drawCard(title: string, value: string, x: number, y: number) {
    doc
      .roundedRect(x, y, 150, 75, 14)
      .fillAndStroke(colors.roseLight, colors.roseBorder);

    doc
      .fillColor(colors.muted)
      .fontSize(10)
      .text(title, x + 15, y + 15);

    doc
      .fillColor(colors.roseDark)
      .fontSize(24)
      .text(value, x + 15, y + 38);
  }

  doc.rect(0, 0, doc.page.width, 120).fill(colors.roseLight);

  doc.fillColor(colors.rose).fontSize(26).text("FibroLink", 50, 35);

  doc
    .fillColor(colors.roseDark)
    .fontSize(18)
    .text("Relatório mensal de sintomas", 50, 68);

  doc
    .fillColor(colors.muted)
    .fontSize(11)
    .text(`Período: ${String(month).padStart(2, "0")}/${year}`, 50, 95);

  doc
    .roundedRect(390, 42, 150, 42, 14)
    .fillAndStroke(colors.white, colors.roseBorder);

  doc.fillColor(colors.muted).fontSize(10).text("Registros no mês", 410, 51);

  doc
    .fillColor(colors.roseDark)
    .fontSize(18)
    .text(String(symptoms.length), 410, 66);

  doc.fillColor(colors.roseDark).fontSize(17).text("Resumo geral", 50, 155);

  drawCard("Média de dor", `${averagePain}/10`, 50, 190);
  drawCard("Média de fadiga", `${averageFatigue}/10`, 215, 190);
  drawCard("Média de sono", `${averageSleep}/10`, 380, 190);

  doc
    .roundedRect(50, 290, 240, 55, 14)
    .fillAndStroke(colors.roseSoft, colors.roseBorder);

  doc
    .fillColor(colors.muted)
    .fontSize(10)
    .text("Maior dor registrada", 70, 302);

  doc.fillColor(colors.roseDark).fontSize(20).text(`${maxPain}/10`, 70, 318);

  doc
    .roundedRect(310, 290, 240, 55, 14)
    .fillAndStroke(colors.roseSoft, colors.roseBorder);

  doc
    .fillColor(colors.muted)
    .fontSize(10)
    .text("Menor dor registrada", 330, 302);

  doc.fillColor(colors.roseDark).fontSize(20).text(`${minPain}/10`, 330, 318);

  doc
    .fillColor(colors.roseDark)
    .fontSize(17)
    .text("Palavras mais citadas nas observações", 50, 385);

  doc
    .fillColor(colors.muted)
    .fontSize(11)
    .text(
      "Análise textual simples baseada nas observações registradas no mês.",
      50,
      410,
    );

  let wordY = 445;

  if (mostUsedWords.length === 0) {
    doc
      .roundedRect(50, wordY, 500, 40, 12)
      .fillAndStroke(colors.roseLight, colors.roseBorder);

    doc
      .fillColor(colors.muted)
      .fontSize(12)
      .text("Nenhuma observação registrada neste mês.", 65, wordY + 13);
  } else {
    mostUsedWords.forEach(([word, quantity], index) => {
      doc
        .roundedRect(50, wordY, 500, 34, 12)
        .fillAndStroke(colors.roseLight, colors.roseBorder);

      doc
        .fillColor(colors.rose)
        .fontSize(13)
        .text(`${index + 1}.`, 65, wordY + 10);

      doc
        .fillColor(colors.roseDark)
        .fontSize(13)
        .text(word, 95, wordY + 10);

      doc
        .fillColor(colors.muted)
        .fontSize(11)
        .text(`${quantity} ocorrência(s)`, 420, wordY + 11);

      wordY += 44;
    });
  }

  doc.moveTo(50, 740).lineTo(545, 740).strokeColor(colors.roseBorder).stroke();

  doc
    .fillColor(colors.muted)
    .fontSize(9)
    .text(
      "Relatório gerado automaticamente pelo FibroLink. As informações são baseadas nos registros inseridos pela usuária.",
      50,
      755,
      {
        align: "center",
        width: 495,
      },
    );

  doc.end();

  return new Promise((resolve) => {
    doc.on("end", () => {
      resolve(Buffer.concat(buffers));
    });
  });
};
