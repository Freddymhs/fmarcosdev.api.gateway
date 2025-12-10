import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import type { AxiosError } from 'axios';

type Article = {
  id: number;
  documentId: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
};

const USE_MOCK = false;
const MOCK_TOTAL_ARTICLES = 100;

@Injectable()
export class CmsService {
  constructor(private readonly http: HttpService) {}

  async getArticles(page = 1, pageSize = 15): Promise<Article[]> {
    // 🧪 MOCK MODE: Genera artículos fake para probar paginación y diseño
    if (USE_MOCK) {
      return this.getMockArticles(page, pageSize);
    }

    // 🚀 PRODUCTION: Consulta real a Strapi
    const rawCmsUrl = process.env.CMS_URL;
    const cmsUrl = rawCmsUrl?.startsWith('http')
      ? rawCmsUrl
      : `https://${rawCmsUrl}`;
    const params = new URLSearchParams({
      'pagination[page]': page.toString(),
      'pagination[pageSize]': pageSize.toString(),
      'sort[0]': 'publishedAt:desc',
    });

    try {
      const url = new URL(`/api/articles?${params}`, cmsUrl);
      const { data } = await firstValueFrom(
        this.http.get<{ data: Article[] }>(url.toString()),
      );

      return data.data;
    } catch (error) {
      const axiosErr = error as AxiosError;
      const status = axiosErr.response?.status;

      console.error('❌ CMS fetch failed', {
        cmsUrl,
        status,
        message: axiosErr.message,
      });

      throw new HttpException(
        status ? `CMS error ${status}` : 'CMS unavailable',
        HttpStatus.BAD_GATEWAY,
      );
    }
  }

  // 🧪 Genera artículos mock para testing (orden descendente: más nuevo primero)
  private getMockArticles(page: number, pageSize: number): Article[] {
    const startIndex = (page - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, MOCK_TOTAL_ARTICLES);

    if (startIndex >= MOCK_TOTAL_ARTICLES) {
      return [];
    }

    const mockTitles = [
      'Introducción a React Hooks',
      'TypeScript Best Practices',
      'Node.js Performance Tips',
      'Docker para Desarrolladores',
      'GraphQL vs REST API',
      'Testing con Jest y Cypress',
      'CI/CD con GitHub Actions',
      'Arquitectura de Microservicios',
      'Kubernetes para Principiantes',
      'Seguridad en APIs REST',
      'WebSockets en Tiempo Real',
      'MongoDB vs PostgreSQL',
      'Redis para Caching',
      'AWS Lambda Functions',
      'Patrones de Diseño en JS',
    ];

    const articles: Article[] = [];

    for (let i = startIndex; i < endIndex; i++) {
      // ID descendente: el más nuevo tiene ID más alto
      const articleId = MOCK_TOTAL_ARTICLES - i;
      const titleIndex = (articleId - 1) % mockTitles.length;
      const date = new Date();
      // Artículo más nuevo (ID 100) = fecha más reciente
      date.setDate(date.getDate() - (MOCK_TOTAL_ARTICLES - articleId));

      articles.push({
        id: articleId,
        documentId: `mock-doc-${articleId}`,
        title: `${mockTitles[titleIndex]} - Part ${Math.floor((articleId - 1) / mockTitles.length) + 1}`,
        content: `# ${mockTitles[titleIndex]}\n\nEste es el contenido del artículo ${articleId}.\n\n## Introducción\n\nLorem ipsum dolor sit amet...`,
        createdAt: date.toISOString(),
        updatedAt: date.toISOString(),
        publishedAt: date.toISOString(),
      });
    }

    console.log(
      `🧪 MOCK: Returning ${articles.length} articles (page ${page}, IDs: ${articles[0]?.id}-${articles[articles.length - 1]?.id})`,
    );
    return articles;
  }
}
