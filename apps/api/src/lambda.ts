import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import {
  ExpressAdapter,
  NestExpressApplication,
} from '@nestjs/platform-express';
import { apiReference } from '@scalar/nestjs-api-reference';
import { AppModule } from './app.module';

let cachedApp: NestExpressApplication;

async function createApp(): Promise<NestExpressApplication> {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    new ExpressAdapter(),
    { logger: ['error', 'warn', 'log'] },
  );

  // Enable CORS
  app.enableCors();

  // Enable validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // OpenAPI/Swagger setup
  const config = new DocumentBuilder()
    .setTitle('SearchFit API')
    .setDescription('The SearchFit API documentation')
    .setVersion('1.0')
    .addTag('workspaces', 'Workspace management endpoints')
    .addTag('brands', 'Brand management endpoints')
    .addTag('brand-members', 'Brand member management endpoints')
    .addTag('subscriptions', 'Subscription management endpoints')
    .addTag('tasks', 'Task management endpoints')
    .addTag('files', 'File management endpoints')
    .addTag('prompts', 'Prompt template management endpoints')
    .addTag('mcp', 'Model Context Protocol server endpoints')
    .addTag('health', 'Health check endpoints')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // Swagger UI at /docs
  SwaggerModule.setup('docs', app, document, {
    customCssUrl:
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.0/swagger-ui.min.css',
    customJs: [
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.0/swagger-ui-bundle.js',
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.0/swagger-ui-standalone-preset.js',
    ],
  });

  // Scalar API Reference at / (main homepage)
  app.use(
    '/',
    apiReference({
      spec: {
        content: document,
      },
      theme: 'kepler',
      layout: 'modern',
      darkMode: true,
      metaData: {
        title: 'SearchFit API Reference',
        description: 'Modern API documentation powered by Scalar',
      },
    }),
  );

  // Expose OpenAPI JSON at /openapi.json
  app.getHttpAdapter().get('/openapi.json', (req, res: { json: (data: unknown) => void }) => {
    res.json(document);
  });

  await app.init();

  return app;
}

// Serverless handler
export default async function handler(req: any, res: any) {
  if (!cachedApp) {
    cachedApp = await createApp();
  }
  const expressApp = cachedApp.getHttpAdapter().getInstance();
  return expressApp(req, res);
}
