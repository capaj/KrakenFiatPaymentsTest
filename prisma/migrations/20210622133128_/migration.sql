/*
  Warnings:

  - You are about to drop the column `holder_id` on the `BankAccount` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "BankAccount" DROP CONSTRAINT "BankAccount_holder_id_fkey";

-- AlterTable
ALTER TABLE "BankAccount" DROP COLUMN "holder_id",
ADD COLUMN     "user_id" INTEGER;

-- AddForeignKey
ALTER TABLE "BankAccount" ADD FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
