/*
  Warnings:

  - The `documents_to_pay` column on the `user` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "public"."user" DROP COLUMN "documents_to_pay",
ADD COLUMN     "documents_to_pay" INTEGER NOT NULL DEFAULT 3;
