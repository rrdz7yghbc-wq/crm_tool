-- AlterTable
ALTER TABLE `AppointmentServiceToken`
    ADD COLUMN `accessToken` TEXT NULL,
    ADD COLUMN `refreshToken` TEXT NULL,
    ADD COLUMN `expiresAt` DATETIME(3) NULL,
    ADD COLUMN `scope` VARCHAR(191) NULL,
    ADD COLUMN `tokenType` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `AppointmentServiceToken_source_key` ON `AppointmentServiceToken`(`source`);
