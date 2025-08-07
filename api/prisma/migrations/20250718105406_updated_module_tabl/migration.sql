/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `Module` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Module_userId_key" ON "Module"("userId");
