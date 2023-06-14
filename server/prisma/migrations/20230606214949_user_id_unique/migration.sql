/*
  Warnings:

  - A unique constraint covering the columns `[rolename,roleId,userId]` on the table `role` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "role_rolename_roleId_key";

-- CreateIndex
CREATE UNIQUE INDEX "role_rolename_roleId_userId_key" ON "role"("rolename", "roleId", "userId");
