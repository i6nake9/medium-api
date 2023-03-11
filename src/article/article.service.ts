import { Injectable } from '@nestjs/common';

@Injectable()
export class ArticleService {
  async getMessage() {
    return ' get message from sevice ';
  }

  async createArticle() {
    return '';
  }
}
