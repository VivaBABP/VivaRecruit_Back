/*
  Warnings:

  - You are about to drop the column `jobDescriptionId` on the `Account` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `Account` DROP FOREIGN KEY `Account_jobDescriptionId_fkey`;

-- AlterTable
ALTER TABLE `Account` DROP COLUMN `jobDescriptionId`;

-- AlterTable
ALTER TABLE `JobDescription` ADD COLUMN `accountId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `JobDescription` ADD CONSTRAINT `JobDescription_accountId_fkey` FOREIGN KEY (`accountId`) REFERENCES `Account`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
