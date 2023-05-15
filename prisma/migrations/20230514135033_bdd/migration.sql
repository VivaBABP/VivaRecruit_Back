/*
  Warnings:

  - A unique constraint covering the columns `[labelInterest]` on the table `Interests` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Interests_labelInterest_key` ON `Interests`(`labelInterest`);
