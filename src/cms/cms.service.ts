import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

type Article = {
  id: number;
  documentId: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
};

@Injectable()
export class CmsService {
  constructor(private readonly http: HttpService) {}

  async getArticles(): Promise<Article[]> {
    const cmsUrl = process.env.CMS_URL;
    const { data } = await firstValueFrom(
      this.http.get<{ data: Article[] }>(`${cmsUrl}/api/articles`),
    );
    const articles = data.data;
    return articles;
  }
}
