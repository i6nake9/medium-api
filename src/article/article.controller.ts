import {
  Controller,
  Post,
  UseGuards,
  Body,
  Get,
  Param,
  Delete,
  Put,
  UsePipes,
  ValidationPipe,
  Query,
} from '@nestjs/common';
import { ArticleService } from './article.service';
import { AuthGuard } from '@app/user/guards/auth.guard';
import { UserEntity } from '@app/user/user.entity';
import { User } from '@app/user/decorators/user.decorator';
import { CreateArticleDto } from './dto/createArticle.dto';
import { ArticleResponseInterface } from './types/articleResponse.interface';
import { UpdateArticleDto } from './dto/updateArticle.dto';
import { ArticlesResponseInterface } from './types/articlesResponse.interface';
import { BackendValidationPipe } from '@app/shared/pipes/backendValidation.pipe';

@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Get()
  async findAll(
    @User('id') currentUserId: number,
    @Query() query: any,
  ): Promise<ArticlesResponseInterface> {
    return await this.articleService.findAll(currentUserId, query);
  }

  @Post()
  @UseGuards(AuthGuard)
  @UsePipes(new BackendValidationPipe())
  async create(
    @User() currentUser: UserEntity,
    @Body('article') createArticleDto: CreateArticleDto,
  ): Promise<ArticleResponseInterface> {
    const article = await this.articleService.createArticle(
      currentUser,
      createArticleDto,
    );

    return this.articleService.buildArticleResponse(article);
  }

  @Get(':slug')
  async getSingleArticle(
    @Param() params: { slug: string },
  ): Promise<ArticleResponseInterface> {
    const article = await this.articleService.findBySlug(params.slug);
    return this.articleService.buildArticleResponse(article);
  }

  @Delete(':slug')
  @UseGuards(AuthGuard)
  async deleteArticle(
    @User('id') currentUserId: number,
    @Param('slug') slug: string,
  ) {
    return await this.articleService.deleteArticle(slug, currentUserId);
  }

  @Put(':slug')
  @UseGuards(AuthGuard)
  @UsePipes(new BackendValidationPipe())
  async updateArticle(
    @User('id') currentUserId: number,
    @Body('article') updateArticleDto: UpdateArticleDto,
    @Param('slug') slug: string,
  ): Promise<ArticleResponseInterface> {
    const updateArticle = await this.articleService.updateArticle(
      slug,
      updateArticleDto,
      currentUserId,
    );
    return this.articleService.buildArticleResponse(updateArticle);
  }

  @Post(':slug/favorites')
  @UseGuards(AuthGuard)
  async addArticleToFavorites(
    @User('id') currentUserdId: number,
    @Param('slug') slug: string,
  ): Promise<ArticleResponseInterface> {
    const article = await this.articleService.addArticleToFavorites(
      slug,
      currentUserdId,
    );
    return this.articleService.buildArticleResponse(article);
  }
  @Delete(':slug/favorites')
  @UseGuards(AuthGuard)
  async deleteArticleFromFavorites(
    @User('id') currentUserdId: number,
    @Param('slug') slug: string,
  ): Promise<ArticleResponseInterface> {
    const article = await this.articleService.deleteArticleFromFavorites(
      slug,
      currentUserdId,
    );
    return this.articleService.buildArticleResponse(article);
  }
}
