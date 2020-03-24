import {
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  Body,
  ValidationPipe,
  Put,
  Delete,
  Query,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiCreatedResponse,
  ApiBody,
} from '@nestjs/swagger';

import { User } from 'src/auth/user.decorator';
import { OptionalAuthGuard } from 'src/auth/optional-auth.gaurd';
import {
  CreateCommentDTO,
  CommentResponse,
  CreateCommentBody,
} from 'src/models/comment.models';
import { UserEntity } from 'src/entities/user.entity';
import {
  CreateArticleDTO,
  UpdateArticleDTO,
  FindAllQuery,
  FindFeedQuery,
  ArticleResponse,
  CreateArticleBody,
  UpdateArticleBody,
} from 'src/models/article.models';
import { CommentsService } from './comments.service';
import { ArticleService } from './article.service';
import { ResponseObject } from 'src/models/response.model';

@Controller('articles')
export class ArticleController {
  constructor(
    private articleService: ArticleService,
    private commentService: CommentsService,
  ) {}

  @ApiOkResponse({ description: 'List all articles' })
  @Get()
  @UseGuards(new OptionalAuthGuard())
  async findAll(
    @User() user: UserEntity,
    @Query() query: FindAllQuery,
  ): Promise<
    ResponseObject<'articles', ArticleResponse[]> &
      ResponseObject<'articlesCount', number>
  > {
    const articles = await this.articleService.findAll(user, query);
    return {
      articles,
      articlesCount: articles.length,
    };
  }

  @ApiBearerAuth()
  @ApiOkResponse({ description: 'List all articles of users feed' })
  @ApiUnauthorizedResponse()
  @Get('/feed')
  @UseGuards(AuthGuard())
  async findFeed(
    @User() user: UserEntity,
    @Query() query: FindFeedQuery,
  ): Promise<
    ResponseObject<'articles', ArticleResponse[]> &
      ResponseObject<'articlesCount', number>
  > {
    const articles = await this.articleService.findFeed(user, query);
    return { articles, articlesCount: articles.length };
  }

  @ApiOkResponse({ description: 'Article with slug :slug' })
  @Get('/:slug')
  @UseGuards(new OptionalAuthGuard())
  async findBySlug(
    @Param('slug') slug: string,
    @User() user: UserEntity,
  ): Promise<ResponseObject<'article', ArticleResponse>> {
    const article = await this.articleService.findBySlug(slug);
    return { article: article.toArticle(user) };
  }

  @ApiBearerAuth()
  @ApiCreatedResponse({ description: 'Create article' })
  @ApiUnauthorizedResponse()
  @ApiBody({ type: CreateArticleBody })
  @Post()
  @UseGuards(AuthGuard())
  async createArticle(
    @User() user: UserEntity,
    @Body('article', ValidationPipe) data: CreateArticleDTO,
  ): Promise<ResponseObject<'article', ArticleResponse>> {
    const article = await this.articleService.createArticle(user, data);
    return { article };
  }

  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Update article' })
  @ApiUnauthorizedResponse()
  @ApiBody({ type: UpdateArticleBody })
  @Put('/:slug')
  @UseGuards(AuthGuard())
  async updateArticle(
    @Param('slug') slug: string,
    @User() user: UserEntity,
    @Body('article', ValidationPipe) data: UpdateArticleDTO,
  ): Promise<ResponseObject<'article', ArticleResponse>> {
    const article = await this.articleService.updateArticle(slug, user, data);
    return { article };
  }

  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Delete article' })
  @ApiUnauthorizedResponse()
  @Delete('/:slug')
  @UseGuards(AuthGuard())
  async deleteArticle(
    @Param() slug: string,
    @User() user: UserEntity,
  ): Promise<ResponseObject<'article', ArticleResponse>> {
    const article = await this.articleService.deleteArticle(slug, user);
    return { article };
  }

  @ApiOkResponse({ description: 'List article comments' })
  @Get('/:slug/comments')
  async findComments(
    @Param('slug') slug: string,
  ): Promise<ResponseObject<'comments', CommentResponse[]>> {
    const comments = await this.commentService.findByArticleSlug(slug);
    return { comments };
  }

  @ApiBearerAuth()
  @ApiCreatedResponse({ description: 'Create new comment' })
  @ApiUnauthorizedResponse()
  @ApiBody({ type: CreateCommentBody })
  @Post('/:slug/comments')
  async createComment(
    @User() user: UserEntity,
    @Body('comment', ValidationPipe) data: CreateCommentDTO,
  ): Promise<ResponseObject<'comment', CommentResponse>> {
    const comment = await this.commentService.createComment(user, data);
    return { comment };
  }

  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Delete comment' })
  @ApiUnauthorizedResponse()
  @Delete('/:slug/comments/:id')
  async deleteComment(
    @User() user: UserEntity,
    @Param('id') id: number,
  ): Promise<ResponseObject<'comment', CommentResponse>> {
    const comment = await this.commentService.deleteComment(user, id);
    return { comment };
  }

  @ApiBearerAuth()
  @ApiCreatedResponse({ description: 'Favorite article' })
  @ApiUnauthorizedResponse()
  @Post('/:slug/favorite')
  @UseGuards(AuthGuard())
  async favoriteArticle(
    @Param('slug') slug: string,
    @User() user: UserEntity,
  ): Promise<ResponseObject<'article', ArticleResponse>> {
    const article = await this.articleService.favoriteArticle(slug, user);
    return { article };
  }

  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Unfavorite article' })
  @ApiUnauthorizedResponse()
  @Delete('/:slug/favorite')
  @UseGuards(AuthGuard())
  async unfavoriteArticle(
    @Param('slug') slug: string,
    @User() user: UserEntity,
  ): Promise<ResponseObject<'article', ArticleResponse>> {
    const article = await this.articleService.unfavoriteArticle(slug, user);
    return { article };
  }
}
