import { prisma } from './prismaClient'

export const clearDb = async () => {
  await Promise.all([
    prisma.transaction.deleteMany(),
    prisma.bankAccount.deleteMany(),
    prisma.user.deleteMany()
  ])
}
