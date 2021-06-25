import { prisma } from './prismaClient'
import { upsertTransactionAndBankAccount } from './upsertTransactionAndBankAccount'
import { matchSnapshotWithoutMeta } from './matchSnapshotWithoutMeta'
import { clearDb } from './clearDb'

describe('upsertTransactionAndBankAccount', () => {
  beforeEach(clearDb)
  it('should validate the input', async () => {
    await expect(
      upsertTransactionAndBankAccount({
        amount: {
          amount: 1142,
          currency: 'USD'
        }
      })
    ).rejects.toThrowErrorMatchingInlineSnapshot(`
"[
  {
    \\"code\\": \\"invalid_type\\",
    \\"expected\\": \\"string\\",
    \\"received\\": \\"undefined\\",
    \\"path\\": [
      \\"id\\"
    ],
    \\"message\\": \\"Required\\"
  },
  {
    \\"code\\": \\"invalid_type\\",
    \\"expected\\": \\"object\\",
    \\"received\\": \\"undefined\\",
    \\"path\\": [
      \\"to\\"
    ],
    \\"message\\": \\"Required\\"
  },
  {
    \\"code\\": \\"invalid_type\\",
    \\"expected\\": \\"object\\",
    \\"received\\": \\"undefined\\",
    \\"path\\": [
      \\"from\\"
    ],
    \\"message\\": \\"Required\\"
  }
]"
`)

    await expect(
      upsertTransactionAndBankAccount({
        id: 'c910e278-1362-4d3a-b224-47d40eb6eb41',

        to: {
          account_number: '11',
          routing_number: '22'
        },

        amount: {
          // @ts-expect-error
          amount: '1142',
          currency: 'USD'
        }
      })
    ).rejects.toThrowErrorMatchingInlineSnapshot(`
      "[
        {
          \\"code\\": \\"invalid_type\\",
          \\"expected\\": \\"number\\",
          \\"received\\": \\"string\\",
          \\"path\\": [
            \\"amount\\",
            \\"amount\\"
          ],
          \\"message\\": \\"Expected number, received string\\"
        },
        {
          \\"code\\": \\"invalid_type\\",
          \\"expected\\": \\"object\\",
          \\"received\\": \\"undefined\\",
          \\"path\\": [
            \\"from\\"
          ],
          \\"message\\": \\"Required\\"
        }
      ]"
      `)
  })
  it('should throw when amount is less then 1 cent', async () => {
    await expect(
      upsertTransactionAndBankAccount({
        id: 'c910e278-1362-4d3a-b224-47d40eb6eb42',
        to: {
          account_number: '11',
          routing_number: '22'
        },

        from: {
          account_number: '11',
          routing_number: '22'
        },

        amount: {
          amount: 0.001,
          currency: 'USD'
        }
      })
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"Transaction amount must be at least 1/100th of the base account unit"`
    )
  })

  it('should add transaction with existing bank account', async () => {
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
    matchSnapshotWithoutMeta(transactions)
  })

  it('should add transaction with a new bank account', async () => {
    await upsertTransactionAndBankAccount({
      id: 'c910e278-1362-4d3a-b224-47d40eb6eb45',
      from: {
        account_number: '22',
        routing_number: '22'
      },
      amount: {
        currency: 'USD',
        amount: 11.32
      },
      to: {
        account_number: '23',
        routing_number: '22'
      }
    })

    const transactions = await prisma.transaction.findMany({
      include: {
        to: true
      }
    })

    matchSnapshotWithoutMeta(transactions)
  })

  it('should ignore the same transaction being added multiple times', async () => {
    await upsertTransactionAndBankAccount({
      id: 'c910e278-1362-4d3a-b224-47d40eb6eb46',
      from: {
        account_number: '22',
        routing_number: '22'
      },
      amount: {
        currency: 'USD',
        amount: 12.32
      },
      to: {
        account_number: '23',
        routing_number: '22'
      }
    })

    await upsertTransactionAndBankAccount({
      id: 'c910e278-1362-4d3a-b224-47d40eb6eb46',
      from: {
        account_number: '22',
        routing_number: '22'
      },
      amount: {
        currency: 'USD',
        amount: 13.32
      },
      to: {
        account_number: '23',
        routing_number: '22'
      }
    })

    const transactions = await prisma.transaction.findMany({
      include: {
        to: true
      }
    })
    expect(transactions[0].amount).toBe(1232)

    matchSnapshotWithoutMeta(transactions)
  })
})
