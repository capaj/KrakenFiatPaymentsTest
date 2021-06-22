-- CreateTable
CREATE TABLE "BankAccount" (
    "id" SERIAL NOT NULL,
    "routing_number" VARCHAR(9) NOT NULL,
    "account_number" VARCHAR(10) NOT NULL,
    "holder_id" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transaction" (
    "id" UUID NOT NULL,
    "amount" INTEGER NOT NULL,
    "currency" VARCHAR(255) NOT NULL,
    "from_id" INTEGER NOT NULL,
    "to_id" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "full_name" VARCHAR(512) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BankAccount.routing_number_account_number_unique" ON "BankAccount"("routing_number", "account_number");

-- AddForeignKey
ALTER TABLE "BankAccount" ADD FOREIGN KEY ("holder_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction" ADD FOREIGN KEY ("from_id") REFERENCES "BankAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction" ADD FOREIGN KEY ("to_id") REFERENCES "BankAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;
