import { Entity, Column } from 'typeorm';

import { AbstractEntity } from './abstract-entity';

@Entity('tags')
export class TagEntity extends AbstractEntity {
  @Column()
  tag: string;
}
