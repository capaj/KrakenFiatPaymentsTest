import {
  Collection,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryKey,
  Property,
  Unique
} from '@mikro-orm/core'
import { Transaction } from './Transaction'
import { User } from './User'

@Entity()
@Unique({ properties: ['routing_number', 'account_number'] })
export class BankAccount {
  @PrimaryKey()
  id!: number
  @Property({ length: 9 })
  routing_number: string
  @Property({ length: 10 })
  account_number: string

  @ManyToOne()
  holder!: User
}
