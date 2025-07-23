-- DropForeignKey
ALTER TABLE "TaskHistory" DROP CONSTRAINT "TaskHistory_taskId_fkey";

-- AddForeignKey
ALTER TABLE "TaskHistory" ADD CONSTRAINT "TaskHistory_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;
