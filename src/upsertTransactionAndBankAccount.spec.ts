import { prisma } from './prismaClient'
import { upsertTransactionAndBankAccount } from './upsertTransactionAndBankAccount'

describe('upsertTransactionAndBankAccount', () => {
  it('should throw when there is no receiver', async () => {
    await expect(
      // @ts-expect-error
      upsertTransactionAndBankAccount({})
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"Transaction must have a receiver \\"to\\" account"`
    )
  })

  it('should add transaction with existing bank account', async () => {
    await prisma.transaction.deleteMany()
    await prisma.bankAccount.deleteMany()
    const bankAccount = await prisma.bankAccount.create({
      data: {
        account_number: '11',
        routing_number: '22',
        user: {
          create: {
            full_name: 'John Rambo'
          }
        }
      }
    })
    await upsertTransactionAndBankAccount({
      id: 'c910e278-1362-4d3a-b224-47d40eb6eb44',
      from: {
        account_number: '11',
        routing_number: '22'
      },
      amount: {
        currency: 'USD',
        amount: 34.32
      },
      to: {
        account_number: '11',
        routing_number: '22'
      }
    })
    const transactions = await prisma.transaction.findMany()
    expect(transactions[0].to_id).toBe(bankAccount.id)
  })
})
