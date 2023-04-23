-- DropForeignKey
ALTER TABLE `Account` DROP FOREIGN KEY `Account_profileTypeId_fkey`;

-- AlterTable
ALTER TABLE `Account` ADD COLUMN `jobDescriptionId` INTEGER NULL,
    MODIFY `profileTypeId` INTEGER NULL;

-- AlterTable
ALTER TABLE `Interests` ADD COLUMN `panelId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Account` ADD CONSTRAINT `Account_profileTypeId_fkey` FOREIGN KEY (`profileTypeId`) REFERENCES `ProfileType`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Account` ADD CONSTRAINT `Account_jobDescriptionId_fkey` FOREIGN KEY (`jobDescriptionId`) REFERENCES `JobDescription`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Interests` ADD CONSTRAINT `Interests_panelId_fkey` FOREIGN KEY (`panelId`) REFERENCES `Panel`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
