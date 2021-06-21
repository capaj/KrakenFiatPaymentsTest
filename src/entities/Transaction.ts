import {
  Collection,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryKey,
  Property
} from '@mikro-orm/core'
import { BankAccount } from './BankAccount'

@Entity()
export class Transaction {
  @Property()
  amount!: number

  @Property()
  currency!: string
  @ManyToOne()
  from: BankAccount
  @ManyToOne()
  to: BankAccount
  @PrimaryKey({ columnType: 'uuid', length: 36 })
  id: string
}
