import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { ArticleEntity } from 'src/entities/article.entity';
import { UserEntity } from 'src/entities/user.entity';
import {
  CreateArticleDTO,
  UpdateArticleDTO,
  FindAllQuery,
  FindFeedQuery,
} from 'src/models/article.models';
import { TagEntity } from 'src/entities/tag.entity';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(ArticleEntity)
    private articleRepo: Repository<ArticleEntity>,
    @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
    @InjectRepository(TagEntity) private tagRepo: Repository<TagEntity>,
  ) {}

  private async upsertTags(tagList: string[]) {
    const foundTags = await this.tagRepo.find({
      where: tagList.map(t => ({ tag: t })),
    });
    const newTags = tagList.filter(t => !foundTags.map(t => t.tag).includes(t));
    await Promise.all(
      this.tagRepo.create(newTags.map(t => ({ tag: t }))).map(t => t.save()),
    );
  }

  async findAll(user: UserEntity, query: FindAllQuery) {
    let findOptions: any = {
      where: {},
    };
    if (query.author) {
      findOptions.where['author.username'] = query.author;
    }
    if (query.favorited) {
      findOptions.where['favoritedBy.username'] = query.favorited;
    }
    if (query.tag) {
      findOptions.where.tagList = Like(`%${query.tag}%`);
    }
    if (query.offset) {
      findOptions.offset = query.offset;
    }
    if (query.limit) {
      findOptions.limit = query.limit;
    }
    return (await this.articleRepo.find(findOptions)).map(article =>
      article.toArticle(user),
    );
  }

  async findFeed(user: UserEntity, query: FindFeedQuery) {
    const { followee } = await this.userRepo.findOne({
      where: { id: user.id },
      relations: ['followee'],
    });
    const findOptions = {
      ...query,
      where: followee.map(follow => ({ author: follow.id })),
    };
    return (await this.articleRepo.find(findOptions)).map(article =>
      article.toArticle(user),
    );
  }

  findBySlug(slug: string) {
    return this.articleRepo.findOne({
      where: { slug },
    });
  }

  private ensureOwnership(user: UserEntity, article: ArticleEntity): boolean {
    return article.author.id === user.id;
  }

  async createArticle(user: UserEntity, data: CreateArticleDTO) {
    const article = this.articleRepo.create(data);
    article.author = user;
    await this.upsertTags(data.tagList);
    const { slug } = await article.save();
    return (await this.articleRepo.findOne({ slug })).toArticle(user);
  }

  async updateArticle(slug: string, user: UserEntity, data: UpdateArticleDTO) {
    const article = await this.findBySlug(slug);
    if (!this.ensureOwnership(user, article)) {
      throw new UnauthorizedException();
    }
    await this.articleRepo.update({ slug }, data);
    return article.toArticle(user);
  }

  async deleteArticle(slug: string, user: UserEntity) {
    const article = await this.findBySlug(slug);
    if (!this.ensureOwnership(user, article)) {
      throw new UnauthorizedException();
    }
    await this.articleRepo.remove(article);
  }

  async favoriteArticle(slug: string, user: UserEntity) {
    const article = await this.findBySlug(slug);
    article.favoritedBy.push(user);
    await article.save();
    console.log(article);
    return (await this.findBySlug(slug)).toArticle(user);
  }

  async unfavoriteArticle(slug: string, user: UserEntity) {
    const article = await this.findBySlug(slug);
    article.favoritedBy = article.favoritedBy.filter(fav => fav.id !== user.id);
    await article.save();
    return (await this.findBySlug(slug)).toArticle(user);
  }
}
