/*
  Warnings:

  - You are about to drop the column `isAccount` on the `HasInterest` table. All the data in the column will be lost.
  - You are about to drop the column `panelId` on the `HasInterest` table. All the data in the column will be lost.
  - Made the column `accountId` on table `HasInterest` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `companyId` to the `Panel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `interestsId` to the `Panel` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `HasInterest` DROP FOREIGN KEY `HasInterest_accountId_fkey`;

-- DropForeignKey
ALTER TABLE `HasInterest` DROP FOREIGN KEY `HasInterest_panelId_fkey`;

-- AlterTable
ALTER TABLE `Account` ADD COLUMN `panelId` INTEGER NULL;

-- AlterTable
ALTER TABLE `HasInterest` DROP COLUMN `isAccount`,
    DROP COLUMN `panelId`,
    MODIFY `accountId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `Panel` ADD COLUMN `companyId` INTEGER NOT NULL,
    ADD COLUMN `interestsId` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `Company` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `companyName` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `websiteLink` VARCHAR(191) NOT NULL,
    `lineOfBusiness` VARCHAR(191) NOT NULL,
    `companyTypeId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CompanyType` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `labelCompanyType` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Account` ADD CONSTRAINT `Account_panelId_fkey` FOREIGN KEY (`panelId`) REFERENCES `Panel`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HasInterest` ADD CONSTRAINT `HasInterest_accountId_fkey` FOREIGN KEY (`accountId`) REFERENCES `Account`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Panel` ADD CONSTRAINT `Panel_interestsId_fkey` FOREIGN KEY (`interestsId`) REFERENCES `Interests`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Panel` ADD CONSTRAINT `Panel_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `Company`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Company` ADD CONSTRAINT `Company_companyTypeId_fkey` FOREIGN KEY (`companyTypeId`) REFERENCES `CompanyType`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
