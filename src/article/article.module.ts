import { Module } from '@nestjs/common';
import { ArticleService } from './article.service';
import { ArticleController } from './article.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleEntity } from 'src/entities/article.entity';
import { UserEntity } from 'src/entities/user.entity';
import { AuthModule } from 'src/auth/auth.module';
import { CommentsService } from './comments.service';
import { CommentEntity } from 'src/entities/comment.entity';
import { TagEntity } from 'src/entities/tag.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ArticleEntity,
      UserEntity,
      CommentEntity,
      TagEntity,
    ]),
    AuthModule,
  ],
  providers: [ArticleService, CommentsService],
  controllers: [ArticleController],
})
export class ArticleModule {}
