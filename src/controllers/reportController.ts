import { Request, Response } from "express";
import { generateMonthlySymptomsReport } from "../services/reportService";

export const monthlySymptomsReport = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.user_id);

    if (!userId) {
      return res.status(401).json({
        error: "Usuário não autenticado",
      });
    }

    const month = Number(req.query.month);
    const year = Number(req.query.year);

    if (!month || !year) {
      return res.status(400).json({
        error: "Mês e ano são obrigatórios",
      });
    }

    const pdfBuffer = await generateMonthlySymptomsReport({
      userId,
      month,
      year,
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=relatorio-sintomas-${month}-${year}.pdf`
    );

    return res.send(pdfBuffer);
  } catch (error) {
    return res.status(400).json({
      error: (error as Error).message,
    });
  }
};