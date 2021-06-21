import {
  Collection,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryKey,
  Property
} from '@mikro-orm/core'
import { BankAccount } from './BankAccount'
import { Transaction } from './Transaction'

@Entity()
export class User {
  @PrimaryKey()
  id!: number

  @Property({ length: 512 })
  fullName!: string

  @OneToMany(() => BankAccount, (bankAccount) => bankAccount.holder)
  bankAccounts = new Collection<BankAccount>(this)

  //   @OneToMany({ mappedBy: (acc) => acc.holder })
  //   bankAccounts = new Collection<BankAccount>(this);

  @ManyToMany()
  transactions = new Collection<Transaction>(this)
}
