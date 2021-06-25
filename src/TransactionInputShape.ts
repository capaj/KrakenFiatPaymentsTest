import { z } from 'zod'

const AccountNumbers = z.object({
  routing_number: z.string(),
  account_number: z.string()
})

export const TransactionInputShape = z.object({
  id: z.string(),
  amount: z.object({
    amount: z.number().min(0).max(Number.MAX_SAFE_INTEGER),
    currency: z.string()
  }),
  to: AccountNumbers,
  from: AccountNumbers
})

export type TransactionType = z.infer<typeof TransactionInputShape>
