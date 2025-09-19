import { NotFoundError, ValidationError } from "../errors-class.js";
import * as service from "../services/templates.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { idValidatorSchema } from "../validators/global.validator.js";
import { createTemplateSchema, updateTemplateSchema } from "../validators/templates.validator.js";

export const getAll = asyncHandler(async (req, res) => {
  const templates = await service.getAllTemplates();

  if (templates.length === 0) throw new NotFoundError("No templates found");

  res.status(200).json({ templates });
});

export const getById = asyncHandler(async (req, res) => {
  const parsedId = idValidatorSchema.safeParse(req.params);

  if (!parsedId.success) throw new ValidationError("Validation Error");

  const template = await service.getTemplateById(parsedId.data.id);

  if (!template) throw new NotFoundError("Template not found");
});

export const create = asyncHandler(async (req, res) => {
  const parsed = createTemplateSchema.safeParse(req.body);

  if (!parsed.success) throw new ValidationError("Validation Error");

  const newTemplate = await service.createTemplate(parsed.data);

  res.status(201).json({ message: "Template created", template: newTemplate });
});

export const update = asyncHandler(async (req, res) => {
  const parsed = updateTemplateSchema.safeParse(req.body);

  if (!parsed.success) throw new ValidationError("Validation Error");

  const parsedId = idValidatorSchema.safeParse(req.params);

  if (!parsedId.success) throw new ValidationError("Validation Error");

  const updated = await service.updateTemplate(parsedId.data.id, parsed.data);

  res.status(201).json({ message: "Template updated", template: updated });
});

export const deleteById = asyncHandler(async (req, res) => {
  const parsedId = idValidatorSchema.safeParse(req.params);

  if (!parsedId.success) throw new ValidationError("Validation Error");

  await service.deleteTemplate(parsedId.data.id);

  res.status(201).json({ message: "Template deleted" });
});
