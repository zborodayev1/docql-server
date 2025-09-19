-- DropIndex
DROP INDEX "public"."document_template_content_key";

-- CreateTable
CREATE TABLE "public"."generated_document" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "generated_document_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."generated_document_field_value" (
    "id" TEXT NOT NULL,
    "documentId" TEXT NOT NULL,
    "fieldId" TEXT NOT NULL,
    "value" JSONB NOT NULL,

    CONSTRAINT "generated_document_field_value_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."generated_document" ADD CONSTRAINT "generated_document_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."generated_document" ADD CONSTRAINT "generated_document_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "public"."document_template"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."generated_document_field_value" ADD CONSTRAINT "generated_document_field_value_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "public"."generated_document"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."generated_document_field_value" ADD CONSTRAINT "generated_document_field_value_fieldId_fkey" FOREIGN KEY ("fieldId") REFERENCES "public"."document_field"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
