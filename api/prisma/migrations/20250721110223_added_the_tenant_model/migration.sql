-- CreateTable
CREATE TABLE "Tenant" (
    "id" TEXT NOT NULL,
    "schema_name" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "Tenant_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Tenant_schema_name_key" ON "Tenant"("schema_name");

-- CreateIndex
CREATE UNIQUE INDEX "Tenant_user_id_key" ON "Tenant"("user_id");

-- AddForeignKey
ALTER TABLE "Tenant" ADD CONSTRAINT "Tenant_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
