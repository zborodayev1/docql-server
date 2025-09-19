/*
  Warnings:

  - Added the required column `schema` to the `document_template` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."document_template" ADD COLUMN     "schema" JSONB NOT NULL;
