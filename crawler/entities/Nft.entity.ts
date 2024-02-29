import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity, Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('nfts')
export class Nfts extends BaseEntity {
  @ApiProperty({
    example: '1',
  })
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'category_id' })
  @ApiProperty({
    example: '1',
  })
  categoryId: number;

  @Column({ name: 'is_lock' })
  @ApiProperty({
    example: '1',
  })
  isLock: number;
}
