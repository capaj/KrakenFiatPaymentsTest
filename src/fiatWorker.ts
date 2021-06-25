import globby from 'globby'
import fs from 'fs-extra'
import { prisma } from './prismaClient'
import debug from 'debug'
import { upsertTransactionAndBankAccount } from './upsertTransactionAndBankAccount'
import { runAnalyticsForUsers } from './runAnalyticsForUsers'
import { TransactionType } from './TransactionInputShape'
import { seedDb } from './seedUsersAndBankAccounts'
const log = debug('fiatWorker')

export interface ITransactionJsonFile {
  transaction_count: number
  transactions: TransactionType[]
}

export interface Amount {
  amount: number
  currency: string
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * this can be retried in case of failures without any danger of creating any duplicates because transaction id is honored
 */
export async function fiatWorker() {
  await sleep(1000)
  const jsonFiles = await globby('data/*.json')
  await prisma.$connect()
  await seedDb()

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
