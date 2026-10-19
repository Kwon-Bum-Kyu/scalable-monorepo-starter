-- CreateEnum
CREATE TYPE "ExampleStatus" AS ENUM ('draft', 'published');

-- CreateTable
CREATE TABLE "examples" (
    "id" TEXT NOT NULL,
    "title" VARCHAR(120) NOT NULL,
    "description" VARCHAR(500),
    "status" "ExampleStatus" NOT NULL DEFAULT 'draft',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "examples_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "examples_status_createdAt_idx" ON "examples"("status", "createdAt");
