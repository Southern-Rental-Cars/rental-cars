/*
  Warnings:

  - You are about to drop the column `email_verified` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `VerificationToken` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "VerificationToken" DROP CONSTRAINT "VerificationToken_user_id_fkey";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "email_verified";

-- DropTable
DROP TABLE "VerificationToken";

-- CreateTable
CREATE TABLE "verification_codes" (
    "id" TEXT NOT NULL,
    "code" VARCHAR(6) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "verification_codes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "verification_codes_email_key" ON "verification_codes"("email");

-- CreateIndex
CREATE INDEX "verification_codes_email_code_expires_at_idx" ON "verification_codes"("email", "code", "expires_at");
