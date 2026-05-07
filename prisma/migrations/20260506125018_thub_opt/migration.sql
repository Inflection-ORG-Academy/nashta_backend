-- DropForeignKey
ALTER TABLE "Menu" DROP CONSTRAINT "Menu_created_by_fkey";

-- AlterTable
ALTER TABLE "Menu" ALTER COLUMN "thumbnail" DROP NOT NULL,
ALTER COLUMN "created_by" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Menu" ADD CONSTRAINT "Menu_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
