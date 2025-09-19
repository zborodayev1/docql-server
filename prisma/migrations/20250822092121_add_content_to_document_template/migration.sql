/*
  Warnings:

  - A unique constraint covering the columns `[content]` on the table `document_template` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `content` to the `document_template` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."document_template" ADD COLUMN     "content" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "document_template_content_key" ON "public"."document_template"("content");
