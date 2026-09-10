-- DropForeignKey
ALTER TABLE "wishlist" DROP CONSTRAINT "wishlist_user_id_fkey";

-- AlterTable
ALTER TABLE "wishlist" ADD COLUMN     "session_id" TEXT,
ALTER COLUMN "user_id" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "wishlist_user_id_idx" ON "wishlist"("user_id");

-- CreateIndex
CREATE INDEX "wishlist_session_id_idx" ON "wishlist"("session_id");

-- CreateIndex
CREATE UNIQUE INDEX "wishlist_session_id_product_id_key" ON "wishlist"("session_id", "product_id");

-- AddForeignKey
ALTER TABLE "wishlist" ADD CONSTRAINT "wishlist_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

