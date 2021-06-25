import { prisma } from './prismaClient'

export function formatDecimalInt(int: number | null) {
  return (int ?? 0) / 100
}

export interface IUser {
  id: number
  full_name: string
}

export async function runAnalyticsForUsers(userIds: IUser[]) {
  for (const { id, full_name } of userIds) {
    await sumAndCountForUser({ id, full_name })
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

export async function sumAndCountForUser({ id, full_name }: IUser) {
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

  return { sumForUser, countForUser }
}
