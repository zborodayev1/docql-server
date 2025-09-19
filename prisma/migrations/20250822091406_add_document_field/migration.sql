/*
  Warnings:

  - You are about to drop the column `content` on the `document_template` table. All the data in the column will be lost.
  - You are about to drop the column `schema` on the `document_template` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "public"."document_template_content_key";

-- AlterTable
ALTER TABLE "public"."document_template" DROP COLUMN "content",
DROP COLUMN "schema";

-- CreateTable
CREATE TABLE "public"."document_field" (
    "id" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "required" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "document_field_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."document_field" ADD CONSTRAINT "document_field_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "public"."document_template"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
