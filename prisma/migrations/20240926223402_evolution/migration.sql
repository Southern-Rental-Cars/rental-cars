/*
  Warnings:

  - You are about to drop the `booking_extras` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `bookings` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "booking_extras" DROP CONSTRAINT "booking_extras_booking_id_fkey";

-- DropForeignKey
ALTER TABLE "booking_extras" DROP CONSTRAINT "booking_extras_extra_id_fkey";

-- DropForeignKey
ALTER TABLE "bookings" DROP CONSTRAINT "fk_car_id";

-- DropForeignKey
ALTER TABLE "bookings" DROP CONSTRAINT "fk_user_id";

-- DropForeignKey
ALTER TABLE "car_images" DROP CONSTRAINT "car_images_car_id_fkey";

-- AlterTable
ALTER TABLE "cars" ADD COLUMN     "deleted_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "deleted_at" TIMESTAMP(3);

-- DropTable
DROP TABLE "booking_extras";

-- DropTable
DROP TABLE "bookings";

-- CreateTable
CREATE TABLE "BookingExtra" (
    "id" SERIAL NOT NULL,
    "booking_id" INTEGER NOT NULL,
    "extra_id" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,

    CONSTRAINT "BookingExtra_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Booking" (
    "id" SERIAL NOT NULL,
    "car_id" INTEGER NOT NULL,
    "user_id" INTEGER,
    "start_date" TIMESTAMP(6) NOT NULL,
    "end_date" TIMESTAMP(6) NOT NULL,
    "status" VARCHAR(20) DEFAULT 'active',
    "total_price" DECIMAL(10,2),
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BookingExtra_booking_id_extra_id_key" ON "BookingExtra"("booking_id", "extra_id");

-- CreateIndex
CREATE INDEX "Booking_start_date_end_date_idx" ON "Booking"("start_date", "end_date");

-- AddForeignKey
ALTER TABLE "car_images" ADD CONSTRAINT "car_images_car_id_fkey" FOREIGN KEY ("car_id") REFERENCES "cars"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookingExtra" ADD CONSTRAINT "BookingExtra_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookingExtra" ADD CONSTRAINT "BookingExtra_extra_id_fkey" FOREIGN KEY ("extra_id") REFERENCES "extras"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_car_id_fkey" FOREIGN KEY ("car_id") REFERENCES "cars"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
