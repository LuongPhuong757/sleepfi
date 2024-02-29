import { ApiProperty } from '@nestjs/swagger'
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn
} from 'typeorm'

import { Article } from './article.entity'
import { NftAttributes } from './nft_attributes.entity'

@Entity('users')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ length: 100 })
  name: string

  @Column()
  password: string

  @Column({ name: 'refer_code' })
  referCode: string

  @Column()
  language: string

  @Column()
  sex: string

  @Column()
  birthday: number

  @Column({name: 'wallet'})
  wallet: string

  @Column('simple-array')
  roles: string[]

  @Column()
  isAccountDisabled: boolean

  @Column({ name: 'isNotification' })
  isNotification: boolean

  @Column({ name: 'isNewLetter' })
  isNewLetter: boolean

  @Column({ name: 'is_created_password' })
  isCreatedPassword: boolean

  @Unique('email', ['email'])
  @Column({ length: 200 })
  email: string

  @CreateDateColumn({ name: 'created_at', nullable: true })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at', nullable: true })
  updatedAt: Date

  @OneToMany(() => Article, (article) => article.author)
  articles: Article[]

  @OneToMany(() => NftAttributes, (nftAttribute) => nftAttribute.author)
  @JoinColumn({name: 'refer_code', referencedColumnName: 'refer_code'})
  attributes: NftAttributes[]
}
