/*
  Warnings:

  - You are about to drop the `user_request` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."user_request" DROP CONSTRAINT "user_request_templateId_fkey";

-- DropForeignKey
ALTER TABLE "public"."user_request" DROP CONSTRAINT "user_request_userId_fkey";

-- AlterTable
ALTER TABLE "public"."user" ADD COLUMN     "documents_to_pay" TEXT NOT NULL DEFAULT '3';

-- DropTable
DROP TABLE "public"."user_request";
