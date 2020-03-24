import {
  Entity,
  Column,
  BeforeInsert,
  ManyToOne,
  ManyToMany,
  RelationCount,
  JoinTable,
  OneToMany,
} from 'typeorm';
import { classToPlain } from 'class-transformer';
import * as slugify from 'slug';

import { AbstractEntity } from './abstract-entity';
import { UserEntity } from './user.entity';
import { CommentEntity } from './comment.entity';
import { ArticleResponse } from 'src/models/article.models';

@Entity('articles')
export class ArticleEntity extends AbstractEntity {
  @Column()
  slug: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  body: string;

  @ManyToMany(
    type => UserEntity,
    user => user.favorites,
    { eager: true },
  )
  @JoinTable()
  favoritedBy: UserEntity[];

  @RelationCount((article: ArticleEntity) => article.favoritedBy)
  favoritesCount: number;

  @OneToMany(
    type => CommentEntity,
    comment => comment.article,
  )
  comments: CommentEntity[];

  @ManyToOne(
    type => UserEntity,
    user => user.articles,
    { eager: true },
  )
  author: UserEntity;

  @Column('simple-array')
  tagList: string[];

  @BeforeInsert()
  generateSlug() {
    this.slug =
      slugify(this.title, { lower: true }) +
      '-' +
      ((Math.random() * Math.pow(36, 6)) | 0).toString(36);
  }

  toJSON() {
    return classToPlain(this);
  }

  toArticle(user?: UserEntity): ArticleResponse {
    let favorited = null;
    if (user) {
      favorited = this.favoritedBy.map(user => user.id).includes(user.id);
    }
    const article: any = this.toJSON();
    delete article.favoritedBy;
    return { ...article, favorited };
  }
}
