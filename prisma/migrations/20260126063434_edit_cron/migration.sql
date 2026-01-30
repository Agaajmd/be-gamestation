-- CreateTable
CREATE TABLE "FailedJob" (
    "id" TEXT NOT NULL,
    "jobType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "error" TEXT NOT NULL,
    "stackTrace" TEXT,
    "payload" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'failed',
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "resolvedAt" TIMESTAMP(3),

    CONSTRAINT "FailedJob_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "FailedJob_jobType_status_idx" ON "FailedJob"("jobType", "status");

-- CreateIndex
CREATE INDEX "FailedJob_createdAt_idx" ON "FailedJob"("createdAt");
