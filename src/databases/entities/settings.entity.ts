import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

import { KEY_SETTING } from '../../settings/constants/key_setting'

@Entity('settings')
export class Settings extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  key: KEY_SETTING

  @Column()
  value: string
}
