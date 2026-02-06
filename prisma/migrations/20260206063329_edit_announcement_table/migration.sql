-- AddForeignKey
ALTER TABLE "announcements" ADD CONSTRAINT "announcements_for_branch_fkey" FOREIGN KEY ("for_branch") REFERENCES "branches"("id") ON DELETE CASCADE ON UPDATE CASCADE;
