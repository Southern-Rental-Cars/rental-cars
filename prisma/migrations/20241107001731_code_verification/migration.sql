/*
  Warnings:

  - You are about to drop the column `token` on the `VerificationToken` table. All the data in the column will be lost.
  - Added the required column `code` to the `VerificationToken` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "VerificationToken_token_expires_at_idx";

-- DropIndex
DROP INDEX "VerificationToken_token_key";

-- AlterTable
ALTER TABLE "VerificationToken" DROP COLUMN "token",
ADD COLUMN     "code" VARCHAR(6) NOT NULL;

-- CreateIndex
CREATE INDEX "VerificationToken_code_expires_at_idx" ON "VerificationToken"("code", "expires_at");
