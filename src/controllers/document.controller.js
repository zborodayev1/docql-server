import { Readable, Transform } from "stream";
import { UnauthorizedError } from "../errors-class.js";
import * as service from "../services/document.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getDocumentHtml = asyncHandler(async (req, res) => {
  const { templateName, data } = req.body;

  const userId = req.userId || "dcaf842f-185c-4952-9cd2-61f019e11162";

  const result = await service.renderDocument(userId, templateName, data);

  res.json({ success: true, ...result });
});

export const getDocumentPdf = asyncHandler(async (req, res) => {
  const { templateName, data } = req.body;
  const userId = req.userId || "dcaf842f-185c-4952-9cd2-61f019e11162";

  if (!userId) {
    new UnauthorizedError("Unauthorized");
  }

  const pdfBuffer = await service.generateDocumentPdf(templateName, data, userId);

  res.setHeader("Content-Disposition", "attachment; filename=document.pdf");
  res.send(pdfBuffer);
});

export const restoreDocument = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const result = await service.restoreGeneratedDocument(id);
  res.json({ success: true, ...result });
});

export const test = asyncHandler(async (req, res) => {
  const upperCase = new Transform({
    transform(chunk, _, callback) {
      this.push(chunk.toString().toUpperCase());
      callback();
    },
  });

  const readStream = Readable.from([JSON.stringify(req.body)]);

  readStream
    .pipe(upperCase)
    .pipe(res)
    .on("finish", () => console.log("Готово ✅"));
});
