import { Entity, Column, ManyToOne } from 'typeorm';
import { classToPlain } from 'class-transformer';

import { AbstractEntity } from './abstract-entity';
import { UserEntity } from './user.entity';
import { ArticleEntity } from './article.entity';
import { CommentResponse } from 'src/models/comment.models';

@Entity('comments')
export class CommentEntity extends AbstractEntity {
  @Column()
  body: string;

  @ManyToOne(
    type => UserEntity,
    user => user.comments,
    { eager: true },
  )
  author: UserEntity;

  @ManyToOne(
    type => ArticleEntity,
    article => article.comments,
  )
  article: ArticleEntity;

  toJSON() {
    return <CommentResponse>classToPlain(this);
  }
}
