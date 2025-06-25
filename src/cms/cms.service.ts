import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

type Article = {
  id: number;
  attributes: {
    title: string;
    content: string;
  };
};

@Injectable()
export class CmsService {
  constructor(private readonly http: HttpService) {}

  async getArticles(): Promise<Article[]> {
    const { data } = await firstValueFrom(
      this.http.get<{ data: Article[] }>('http://localhost:1337/api/Articles'),
    );
    return data.data;
  }
}
