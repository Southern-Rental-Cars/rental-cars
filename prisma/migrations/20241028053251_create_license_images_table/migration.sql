-- CreateEnum
CREATE TYPE "license_side" AS ENUM ('FRONT', 'BACK');

-- CreateTable
CREATE TABLE "license_images" (
    "id" SERIAL NOT NULL,
    "image_url" VARCHAR(255) NOT NULL,
    "user_id" INTEGER NOT NULL,
    "image_side" "license_side" NOT NULL,

    CONSTRAINT "license_images_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "license_images" ADD CONSTRAINT "license_images_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
