import { prisma } from './prismaClient'

import { TransactionInputShape, TransactionType } from './TransactionInputShape'

export async function upsertTransactionAndBankAccount(
  transactionInput: TransactionType
) {
  TransactionInputShape.parse(transactionInput) // validate using zod

  const amountRoundedToCents = Math.round(transactionInput.amount.amount * 100)

  if (amountRoundedToCents <= 0) {
    throw new Error(
      'Transaction amount must be at least 1/100th of the base account unit'
    )
  }
  const numbers = transactionInput.to
  const bankAccount = await prisma.bankAccount.upsert({
    where: {
      routing_number_account_number: numbers
    },
    create: numbers,
    update: {}
  })

  const transaction = await prisma.transaction.upsert({
    where: {
      id: transactionInput.id
    },
    create: {
      id: transactionInput.id,
      to_id: bankAccount.id,
      currency: transactionInput.amount.currency,
      amount: amountRoundedToCents
    },
    update: {}
  })
  return transaction
}
