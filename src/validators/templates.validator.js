import { z } from "zod";

export const documentFieldSchema = z.object({
  name: z.string().min(1, "Имя поля обязательно"),
  label: z.string().min(1, "Метка поля обязательна"),
  type: z.enum(["text", "number", "date", "select"]),
  required: z.boolean().default(true),
});

export const createTemplateSchema = z.object({
  name: z.string().min(1, "Название шаблона обязательно"),
  content: z.string().min(1, "Контент шаблона обязателен"),
  fields: z.array(documentFieldSchema).optional(),
});

export const updateTemplateSchema = z.object({
  name: z.string().min(1, "Название шаблона обязательно").optional(),
  content: z.string().min(1, "Контент шаблона обязателен").optional(),
  fields: z.array(documentFieldSchema).optional(),
});
