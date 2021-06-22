import { prisma } from './prismaClient'
import { Transaction } from './fiatWorker'

export async function upsertTransactionAndBankAccount(
  transactionInput: Transaction
) {
  if (!transactionInput.to) {
    throw new TypeError('Transaction must have a receiver "to" account')
  }
  const numbers = transactionInput.to
  const bankAccount = await prisma.bankAccount.upsert({
    where: {
      routing_number_account_number: numbers
    },
    create: numbers,
    update: {}
  })

  const amountRoundedToCents = Math.round(transactionInput.amount.amount * 100)
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
