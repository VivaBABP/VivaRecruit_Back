/*
  Warnings:

  - You are about to drop the column `accountId` on the `Interests` table. All the data in the column will be lost.
  - You are about to drop the column `panelId` on the `Interests` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `Interests` DROP FOREIGN KEY `Interests_accountId_fkey`;

-- DropForeignKey
ALTER TABLE `Interests` DROP FOREIGN KEY `Interests_panelId_fkey`;

-- AlterTable
ALTER TABLE `Interests` DROP COLUMN `accountId`,
    DROP COLUMN `panelId`;

-- CreateTable
CREATE TABLE `HasInterest` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `accountId` INTEGER NULL,
    `panelId` INTEGER NULL,
    `isAccount` BOOLEAN NOT NULL,
    `interestsId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `HasInterest` ADD CONSTRAINT `HasInterest_accountId_fkey` FOREIGN KEY (`accountId`) REFERENCES `Account`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HasInterest` ADD CONSTRAINT `HasInterest_panelId_fkey` FOREIGN KEY (`panelId`) REFERENCES `Panel`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HasInterest` ADD CONSTRAINT `HasInterest_interestsId_fkey` FOREIGN KEY (`interestsId`) REFERENCES `Interests`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
