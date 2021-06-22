import { prisma } from './prismaClient'
import { formatDecimalInt } from './fiatWorker'

export async function runAnalyticsForUsers(
  userIds: { id: number; full_name: string }[]
) {
  for (const { id, full_name } of userIds) {
    const sumForUser = await prisma.transaction.aggregate({
      _sum: { amount: true },
      where: { to: { user_id: id } }
    })

    const countForUser = await prisma.transaction.aggregate({
      _count: true,
      where: { to: { user_id: id } }
    })

    console.log(
      `Deposited for ${full_name}: count=${
        countForUser._count
      } sum=${formatDecimalInt(sumForUser._sum.amount)} USD`
    )
  }

  const sumWithNoKnownUser = await prisma.transaction.aggregate({
    _sum: { amount: true },
    where: { to: { user_id: null } }
  })
  const countWithNoKnownUser = await prisma.transaction.aggregate({
    _count: true,
    where: { to: { user_id: null } }
  })

  console.log(
    `Deposited without known user: count=${
      countWithNoKnownUser._count
    } sum=${formatDecimalInt(sumWithNoKnownUser._sum.amount)} USD`
  )
  const min = await prisma.transaction.aggregate({
    _min: { amount: true },
    where: {
      NOT: { to: { user_id: null } }
    }
  })
  const max = await prisma.transaction.aggregate({
    _max: { amount: true },
    where: { NOT: { to: { user_id: null } } }
  })

  console.log(
    `Smallest valid deposit: ${formatDecimalInt(min._min.amount)} USD`
  )
  console.log(`Largest valid deposit: ${formatDecimalInt(max._max.amount)} USD`)

  return {
    min,
    max,
    sumWithNoKnownUser,
    countWithNoKnownUser
  }
}
