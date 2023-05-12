-- CreateTable
CREATE TABLE `ApplyJob` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `jobDescriptionId` INTEGER NOT NULL,
    `accountId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ApplyJob` ADD CONSTRAINT `ApplyJob_jobDescriptionId_fkey` FOREIGN KEY (`jobDescriptionId`) REFERENCES `JobDescription`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ApplyJob` ADD CONSTRAINT `ApplyJob_accountId_fkey` FOREIGN KEY (`accountId`) REFERENCES `Account`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
