-- AddForeignKey
ALTER TABLE "ratings" ADD CONSTRAINT "ratings_qr_code_id_fkey" FOREIGN KEY ("qr_code_id") REFERENCES "qr_codes"("id") ON DELETE SET NULL ON UPDATE CASCADE;
