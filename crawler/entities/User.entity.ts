import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn
} from 'typeorm';

@Entity('users')
export class User extends BaseEntity{
  @PrimaryGeneratedColumn()
  id: number;

  @Column({length: 100})
  name: string;

  @Column()
  password: string;

  @Column({name: 'refer_code'})
  referCode: string;

  @Column()
  language: string;

  @Column()
  wallet: string;

  @Column('simple-array')
  roles: string[];

  @Column()
  isAccountDisabled: boolean;

  @Column({name: 'is_created_password'})
  isCreatedPassword: boolean;

  @Unique('email', ['email'])
  @Column({length: 200})
  email: string;

  @CreateDateColumn({name: 'created_at', nullable: true})
  createdAt: Date;

  @UpdateDateColumn({name: 'updated_at', nullable: true})
  updatedAt: Date;
}
