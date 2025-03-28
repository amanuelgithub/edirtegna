import { instanceToPlain, plainToClass } from 'class-transformer';
import { Entity, Column, CreateDateColumn, UpdateDateColumn, PrimaryColumn } from 'typeorm';

@Entity({ name: 'global_configs' })
export class GlobalConfigEntity {
  @PrimaryColumn()
  key: string;

  @Column({ type: 'text' })
  value: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updatedAt: Date;

  toJSON() {
    return instanceToPlain(this);
  }
  toDto() {
    return plainToClass(GlobalConfigEntity, this);
  }
  constructor(partial: Partial<GlobalConfigEntity>) {
    return Object.assign(this, partial);
  }
}
