import globby from 'globby'
import fs from 'fs-extra'
import { prisma } from './prismaClient'
import debug from 'debug'
import { upsertTransactionAndBankAccount } from './upsertTransactionAndBankAccount'
import { runAnalyticsForUsers } from './runAnalyticsForUsers'

const log = debug('fiatWorker')

export interface ITransactionJsonFile {
  transaction_count: number
  transactions: Transaction[]
}

export interface Transaction {
  id: string
  to: IAccountNumbers
  from: IAccountNumbers
  amount: Amount
}

export interface Amount {
  amount: number
  currency: string
}

export interface IAccountNumbers {
  routing_number: string
  account_number: string
}

// const getSingleUserDeposits = (user) => {}

export function formatDecimalInt(int: number | null) {
  return (int ?? 0) / 100
}

export async function fiatWorker() {
  const jsonFiles = await globby('data/*.json')

  await prisma.transaction.deleteMany()

  for (const jsonFile of jsonFiles) {
    const data: ITransactionJsonFile = await fs.readJson(jsonFile)

    for (const transactionInput of data.transactions) {
      const transaction = await upsertTransactionAndBankAccount(
        transactionInput
      )

      log('transaction', transaction)
    }
  }

  const userIds = await prisma.user.findMany({
    select: { id: true, full_name: true }
  })

  return await runAnalyticsForUsers(userIds)
}

;(async () => {
  console.time('fiatWorker')
  await fiatWorker()
  console.timeEnd('fiatWorker')
})()
