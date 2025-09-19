import Mustache from "mustache";
import { pool, prisma } from "../app.js";
import { NotFoundError } from "../errors-class.js";
import { validateAndMapFields } from "../utils/fildValidate.js";

export const renderDocument = async (userId, templateName, data) => {
  const template = await prisma.document_template.findUnique({
    where: { name: templateName },
    include: { fields: true },
  });

  if (!template) throw new NotFoundError("Template not found");

  // const user = await prisma.user.findUnique({
  //   where: { id: userId },
  //   select: { documents_to_pay: true },
  // });

  // if (!user || user.documents_to_pay <= 0) {
  //   throw new ValidationError("Not enough document credits");
  // }

  const { validatedData, fieldValues } = validateAndMapFields(template.fields, data);

  const rendered = Mustache.render(template.content, validatedData);

  await prisma.$transaction([
    prisma.generated_document.create({
      data: {
        name: template.name,
        userId,
        templateId: template.id,
        content: rendered,
        fieldValues: { create: fieldValues },
      },
      include: { fieldValues: true },
    }),
    // prisma.user.update({
    //   where: { id: userId },
    //   data: { documents_to_pay: { decrement: 1 } },
    // }),
  ]);

  return {
    rendered: rendered,
  };
};

export const generateDocumentPdf = async (templateName, data, userId) => {
  const { rendered } = await renderDocument(userId, templateName, data);

  const pdfBuffer = await pool.run("generatePdf", {
    text: rendered.replace(/\\n/g, "\n"),
  });

  return { pdfBuffer };
};

export const restoreGeneratedDocument = async (documentId) => {
  const doc = await prisma.generated_document.findUnique({
    where: { id: documentId },
    include: {
      fieldValues: { include: { field: true } },
      template: true,
    },
  });

  if (!doc) throw new NotFoundError("Document not found");

  const data = {};
  for (const fv of doc.fieldValues) {
    data[fv.field.name] = fv.value;
  }

  const rendered = Mustache.render(doc.template.content, data);
  return { templateName: doc.template.name, rendered };
};
