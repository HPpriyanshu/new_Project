-- CreateTable
CREATE TABLE "Module" (
    "id" SERIAL NOT NULL,
    "data" TEXT[],
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Module_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Module" ADD CONSTRAINT "Module_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
