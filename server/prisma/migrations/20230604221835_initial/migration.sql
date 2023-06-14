-- CreateEnum
CREATE TYPE "role_type" AS ENUM ('USER', 'ADMIN', 'EDITOR');
-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);
-- CreateTable
CREATE TABLE "role" (
    "id" SERIAL NOT NULL,
    "rolename" "role_type" NOT NULL DEFAULT 'USER',
    "roleId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "role_pkey" PRIMARY KEY ("id")
);
-- CreateTable
CREATE TABLE "refresh_token" (
    "id" SERIAL NOT NULL,
    "token" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "refresh_token_pkey" PRIMARY KEY ("id")
);
-- CreateIndex
CREATE UNIQUE INDEX "user_username_key" ON "user"("username");
-- CreateIndex
CREATE UNIQUE INDEX "role_rolename_roleId_key" ON "role"("rolename", "roleId");
-- AddForeignKey
ALTER TABLE "role"
ADD CONSTRAINT "role_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "refresh_token"
ADD CONSTRAINT "refresh_token_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
-- AddConstraint
ALTER TABLE "role"
ADD CONSTRAINT chk_rolename_roleid CHECK (
        (
            rolename = 'ADMIN'
            AND "roleId" = 5150
        )
        OR (
            rolename = 'USER'
            AND "roleId" = 2001
        )
        OR (
            rolename = 'EDITOR'
            AND "roleId" = 1984
        )
    );