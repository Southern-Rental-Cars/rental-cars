-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "delivery_cost" DECIMAL(10,2),
ADD COLUMN     "delivery_required" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "delivery_type" VARCHAR(50);
