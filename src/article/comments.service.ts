import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentEntity } from 'src/entities/comment.entity';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/entities/user.entity';
import { CreateCommentDTO } from 'src/models/comment.models';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(CommentEntity)
    private commentRepo: Repository<CommentEntity>,
  ) {}

  findByArticleSlug(slug: string) {
    return this.commentRepo.find({
      where: { 'article.slug': slug },
      relations: ['article'],
    });
  }

  findById(id: number) {
    return this.commentRepo.findOne({ where: { id } });
  }

  async createComment(user: UserEntity, data: CreateCommentDTO) {
    const comment = this.commentRepo.create(data);
    comment.author = user;
    await comment.save();
    return this.commentRepo.findOne({ where: { body: data.body } });
  }

  async deleteComment(user: UserEntity, id: number) {
    const comment = await this.commentRepo.findOne({
      where: { id, 'author.id': user.id },
    });
    await comment.remove();
    return comment;
  }
}
