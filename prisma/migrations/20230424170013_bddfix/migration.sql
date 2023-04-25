-- AlterTable
ALTER TABLE `Account` MODIFY `name` VARCHAR(191) NULL,
    MODIFY `lastName` VARCHAR(191) NULL,
    MODIFY `phoneNumber` VARCHAR(191) NULL,
    MODIFY `lastDiploma` VARCHAR(191) NULL,
    MODIFY `cv` BLOB NULL;

-- AlterTable
ALTER TABLE `JobDescription` MODIFY `skills` VARCHAR(191) NULL;
