-- AlterTable
ALTER TABLE "Business" ADD COLUMN     "rating" INTEGER,
ADD COLUMN     "topRating" BOOLEAN NOT NULL DEFAULT false;
