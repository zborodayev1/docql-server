export const validateAndMapFields = (templateFields, inputData) => {
  const validatedData = {};
  const fieldValues = [];

  for (const field of templateFields) {
    const value = inputData[field.name];

    if (field.required && (value === undefined || value === null || value === "")) {
      throw new ValidationError(`Field "${field.label}" is required`);
    }

    const finalValue = value ?? "";

    validatedData[field.name] = finalValue;
    fieldValues.push({ fieldId: field.id, value: finalValue });
  }

  return { validatedData, fieldValues };
};
