import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import type { AxiosError } from 'axios';

export type Article = {
  id: number;
  documentId: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
};

export interface CmsResponse {
  data: Article[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

const USE_MOCK = false;
const MOCK_TOTAL_ARTICLES = 100;

@Injectable()
export class CmsService {
  constructor(private readonly http: HttpService) {}

  async getArticles(page = 1, pageSize = 15): Promise<CmsResponse> {
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
    const token = process.env.CMS_TOKEN;
    const headers = token ? { Authorization: `Bearer ${token}` } : undefined;

    try {
      const url = new URL(`/api/articles?${params}`, cmsUrl);
      const { data } = await firstValueFrom(
        this.http.get<CmsResponse>(url.toString(), { headers }),
      );

      return data;
    } catch (error) {
      const axiosErr = error as AxiosError;
      const status = axiosErr.response?.status;
      const hint =
        status === 403
          ? 'CMS returned 403. Check Public role permissions or set CMS_TOKEN.'
          : status === 401
            ? 'CMS returned 401. Provide CMS_TOKEN or open the endpoint.'
            : 'CMS unavailable or misconfigured.';

      console.error('❌ CMS fetch failed', {
        cmsUrl,
        status,
        message: axiosErr.message,
        data: axiosErr.response?.data,
      });

      throw new HttpException(
        {
          error: 'CMS_ERROR',
          status,
          message: status ? `CMS error ${status}` : 'CMS unavailable',
          hint,
        },
        HttpStatus.BAD_GATEWAY,
      );
    }
  }

  // 🧪 Genera artículos mock para testing (orden descendente: más nuevo primero)
  private getMockArticles(page: number, pageSize: number): CmsResponse {
    const startIndex = (page - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, MOCK_TOTAL_ARTICLES);

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

    if (startIndex < MOCK_TOTAL_ARTICLES) {
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
    }

    console.log(
      `🧪 MOCK: Returning ${articles.length} articles (page ${page}, pageSize ${pageSize})`,
    );

    return {
      data: articles,
      meta: {
        pagination: {
          page,
          pageSize,
          pageCount: Math.ceil(MOCK_TOTAL_ARTICLES / pageSize),
          total: MOCK_TOTAL_ARTICLES,
        },
      },
    };
  }
}
