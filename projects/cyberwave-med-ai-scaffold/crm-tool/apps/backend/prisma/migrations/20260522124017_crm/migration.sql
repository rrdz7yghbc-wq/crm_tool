-- CreateTable
CREATE TABLE `AppointmentServiceToken` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `dateRetrieved` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `source` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
