import {
  IUser,
  runAnalyticsForUsers,
  sumAndCountForUser
} from './runAnalyticsForUsers'
import { prisma } from './prismaClient'
import { upsertTransactionAndBankAccount } from './upsertTransactionAndBankAccount'
import { clearDb } from './clearDb'
import { BankAccount, User } from '.prisma/client'

describe('runAnalyticsForUsers', () => {
  let bankAccount: BankAccount & { user: User }

  beforeEach(async () => {
    await clearDb()

    bankAccount = await prisma.bankAccount.create({
      data: {
        account_number: '11',
        routing_number: '22',
        user: {
          create: {
            full_name: 'John Rambo'
          }
        }
      },
      include: {
        user: true
      }
    })

    await upsertTransactionAndBankAccount({
      id: 'c910e278-1362-4d3a-b224-47d40eb6eb47',
      from: {
        account_number: '12',
        routing_number: '22'
      },
      amount: {
        currency: 'USD',
        amount: 64.32
      },
      to: {
        account_number: '11',
        routing_number: '22'
      }
    })
  })

  it('should count sums for user John', async () => {
    const res = await sumAndCountForUser(bankAccount.user as IUser)

    expect(res).toMatchInlineSnapshot(`
Object {
  "countForUser": Object {
    "_count": 1,
  },
  "sumForUser": Object {
    "_sum": Object {
      "amount": 6432,
    },
  },
}
`)
  })

  it('should count and sum for all users', async () => {
    const res = await runAnalyticsForUsers([bankAccount.user])
    expect(res).toMatchInlineSnapshot(`
Object {
  "countWithNoKnownUser": Object {
    "_count": 0,
  },
  "max": Object {
    "_max": Object {
      "amount": 6432,
    },
  },
  "min": Object {
    "_min": Object {
      "amount": 6432,
    },
  },
  "sumWithNoKnownUser": Object {
    "_sum": Object {
      "amount": null,
    },
  },
}
`)
  })
})
