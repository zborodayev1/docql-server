import { prisma } from "../app.js";

export const getAllTemplates = () => prisma.document_template.findMany();

export const getTemplateById = (id) => prisma.document_template.findUnique({ where: { id: id } });

export const createTemplate = (data) => {
  const { fields, ...rest } = data;

  return prisma.document_template.create({
    data: {
      ...rest,
      ...(fields ? { fields: { create: fields } } : {}),
    },
  });
};

export const updateTemplate = (id, data) => {
  const { fields, ...rest } = data;

  return prisma.document_template.update({
    where: { id },
    data: {
      ...rest,
      ...(fields
        ? {
            fields: {
              upsert: fields.map((f) => ({
                where: { id: f.id ?? "__fake_id__" },
                update: {
                  name: f.name,
                  label: f.label,
                  type: f.type,
                  required: f.required,
                },
                create: {
                  name: f.name,
                  label: f.label,
                  type: f.type,
                  required: f.required,
                },
              })),
            },
          }
        : {}),
    },
  });
};

export const deleteTemplate = (id) => prisma.document_template.delete({ where: { id: id } });

export const validate = (schema, params) => {
  const validateData = schema.safeParse(params);

  if (!validateData.success) {
    throw validateData.error;
  }

  return validateData.data;
};
