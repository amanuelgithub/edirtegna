import { LoggerService } from '@app/logger';
import { INestApplication, Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { json, urlencoded } from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as fs from 'fs/promises';
import helmet from 'helmet';
import { ExceptionsFilter } from '../interceptors';

export class AppUtil {
  static async initialize(app: INestApplication): Promise<{ port: number; host: string; address: string }> {
    const logger = new Logger('Initialization');
    ///////
    app.use(function (req, res, next) {
      res.header('Access-Control-Allow-Origin', req.headers.origin);
      res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
      next();
    });
    app.enableCors({
      preflightContinue: false,
      optionsSuccessStatus: 204,
      methods: 'GET,PUT,POST,DELETE,UPDATE,OPTIONS',
      credentials: true,
      origin: function (origin, callback) {
        if ([].indexOf(origin) !== -1) {
          Logger.log(`CORS... OK for, ${origin}`);
          callback(null, true);
        } else {
          Logger.log(`CORS... NOK for, ${origin}`);
          callback(null, true);
          // callback(new HttpException('FORBIDDEN', HttpStatus.FORBIDDEN));
        }
      },
    });
    ///////
    app.useLogger(app.get(LoggerService));
    app.flushLogs();

    const conf = app.get(ConfigService);

    const bodySizeLimit = conf.get('app.bodySizeLimit');
    app.use(
      json({
        limit: bodySizeLimit,
        // We need the raw body to verify webhook signatures.
        // Let's compute it only when hitting the Stripe webhook endpoint.
        // url /api/web/stripe/webhook
        verify: function (req, res, buf) {
          if (req.url.includes('/stripe/webhook')) {
            req['rawStripeBody'] = buf.toString();
          }
        },
      }),
    );
    app.use(urlencoded({ limit: bodySizeLimit, extended: true }));
    app.setGlobalPrefix('api');
    const expressApp = app as NestExpressApplication;
    if (conf.get('app.assetsEnabled') && expressApp.useStaticAssets) {
      expressApp.useStaticAssets(conf.get('app.assetsDir'), {
        prefix: conf.get('app.assetsPrefix'),
      });
    }

    app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });

    const env = conf.get('env');
    logger.log('App running in %s', env);

    const port = conf.get('app.port');
    const host = conf.get('app.host');
    const hostname = conf.get('app.hostname');

    const address = hostname.startsWith('http') ? hostname : `http://${hostname}:${port}`;

    if (conf.get('app.shutdownHooksEnabled')) {
      app.enableShutdownHooks();
      logger.log('Shutdown hooks enabled');
    }

    if (conf.get('app.helmetEnabled')) {
      app.use(
        helmet({
          contentSecurityPolicy: false,
          crossOriginEmbedderPolicy: false,
          crossOriginResourcePolicy: false,
        }),
      );
      logger.log('Helmet security rules enabled');
    }
    app.use(cookieParser());

    if (conf.get('cors.enabled')) {
      // app.enableCors({})
      // app.enableCors({
      //   origin: conf.get('cors.origin'),
      //   methods: conf.get('cors.methods'),
      //   allowedHeaders: conf.get('cors.allowedHeaders'),
      //   exposedHeaders: conf.get('cors.exposedHeaders'),
      //   maxAge: conf.get('cors.maxAge'),
      //   credentials: conf.get('cors.credentials'),
      // });
      // logger.log(`CORS is enabled for origin: ${conf.get('cors.origin')}`);
    }

    app.useGlobalPipes(new ValidationPipe({ transform: true, stopAtFirstError: true }));

    // Use Global Error Handler
    // app.useGlobalInterceptors(new ErrorsInterceptor());
    app.useGlobalFilters(new ExceptionsFilter(conf.get('app.appPrefix')));

    // Enable trust proxy
    if (conf.get('app.trustProxy')) {
      app.getHttpAdapter().getInstance().set('trust proxy', true);
      logger.log('Trust proxy enabled');
    }
    if (conf.get('app.debug')) {
      logger.warn('Debug mode activated');
    }

    if (conf.get('rest.enabled') && conf.get('rest.swagger') && env !== 'production') {
      const builder = new DocumentBuilder()
        .setTitle(conf.get('app.name'))
        .setDescription('<small><a href="/swagger-json" target="_blank">swagger.json</a></small>' + '<br><p>' + conf.get('app.description') + '</p>')
        .setVersion(conf.get('app.version'))
        .addServer(address, 'Default server')
        .addTag('1.Authentication', 'Manage user access and <code>permissions</code> to the system');

      if (conf.get('auth.jwt.enabled')) {
        builder.addBearerAuth();
      }
      if (conf.get('auth.basic.enabled')) {
        builder.addBasicAuth();
      }
      if (conf.get('auth.oauth2.enabled')) {
        builder.addOAuth2();
      }
      if (conf.get('auth.apikey.enabled')) {
        builder.addApiKey();
      }

      const config = builder.build();
      const document = SwaggerModule.createDocument(app, config);

      SwaggerModule.setup('swagger', app, document, {
        swaggerOptions: {
          tagsSorter: 'alpha',
          operationsSorter: 'alpha',
        },
      });

      const docsDir = `${process.cwd()}/swagger`;
      try {
        await fs.access(docsDir);
      } catch {
        await fs.mkdir(docsDir, { recursive: true });
      }
      await fs.writeFile(`${docsDir}/openapi.json`, JSON.stringify(document, null, 4));

      logger.log(`Swagger docs available on: ${address}/swagger`);
    }

    if (!conf.get('rest.enabled')) {
      app.use((req, res, next) => {
        if (req.path === '/graphql' || req.path.split('.').length > 1) {
          return next();
        }
        res.sendStatus(404);
      });
    }

    if (conf.get('docsOnly')) {
      await app.init();
      logger.log('Documentation generated, exiting...');
      await app.close();
      process.exit(0);
    }
    return { port, host, address };
  }
}
