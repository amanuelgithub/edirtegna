import { StringUtil } from '@app/shared';
//import { GenericMail } from 'resources/views/mail';

export default () => {
  const docsOnly = StringUtil.parseBool(process.env.DOCS_ONLY, false);
  const serverDns = process.env.APP_SERVER_DOMAIN;
  const serverIp = process.env.APP_SERVER_IP;
  return {
    env: process.env.NODE_ENV || 'production',
    docsOnly,
    app: {
      name: process.env.APP_NAME || 'Teleport',
      description: process.env.APP_DESCRIPTION || 'App API service',
      debug: StringUtil.parseBool(process.env.APP_DEBUG, false),
      trustProxy: StringUtil.parseBool(process.env.APP_TRUST_PROXY, false),
      version: process.env.npm_package_version || 'unknown',
      host: process.env.APP_HOST || '0.0.0.0',
      hostname: process.env.APP_HOSTNAME || '127.0.0.1',
      supportEmail: process.env.APP_SUPPORT_EMAIL || 'info@teleport.et',

      appPrefix: process.env.APP_PREFIX || 'api',
      serverDns,
      webAdminUrl: process.env.WEB_ADMIN_URL,
      webCustomerUrl: process.env.WEB_CUSTOMER_URL,
      webApiUrl: process.env.API_URL,
      timeZone: process.env.TZ || 'Africa/Addis_Ababa',
      runInit: parseInt(process.env.APP_RUN_INITIALIZATION, 10) || 0,
      whiteListedUrls: [
        `https://${serverDns}`,
        `https://api.${serverDns}`,
        `https://manage.${serverDns}`,
        `https://auth.${serverDns}`,
        `https://docs.${serverDns}`,
        `https://www.${serverDns}`,
        `https://${serverIp}`,
      ],

      port: StringUtil.parseInteger(process.env.API_PORT, 80),
      bodySizeLimit: process.env.APP_BODY_SIZE_LIMIT || '50mb',
      assetsEnabled: StringUtil.parseBool(process.env.APP_ASSETS_ENABLED, true),
      assetsDir: process.env.APP_ASSETS_DIR || './assets',
      assetsPrefix: process.env.APP_ASSETS_PREFIX || '/assets',
      shutdownHooksEnabled: StringUtil.parseBool(process.env.APP_SHUTDOWN_HOOKS_ENABLED, true),
      helmetEnabled: StringUtil.parseBool(process.env.APP_HELMET_ENABLED, true),
    },
    telebirrApi: {
      apiKey: process.env.TELEBIRR_MIDDLEWARE_API_KEY,
      baseUrl: process.env.TELEBIRR_MIDDLEWARE_BASE_URL,
    },
    log: {
      level: process.env.LOG_LEVEL || 'info',
      path: process.env.LOG_PATH === 'false' ? undefined : process.env.LOG_PATH || './logs',
      colorize: StringUtil.parseBool(process.env.LOG_COLORIZE, true),
      rotate: {
        enabled: StringUtil.parseBool(process.env.LOG_ROTATE_ENABLED, true),
        pattern: process.env.LOG_ROTATE_PATTERN || 'YYYY-MM-DD',
        maxSize: process.env.LOG_ROTATE_MAX_SIZE,
        maxFiles: process.env.LOG_ROTATE_MAX_FILES,
        zipArchive: StringUtil.parseBool(process.env.LOG_ROTATE_ZIP_ARCHIVE, false),
      },
    },

    sms: {
      smsApiUri: process.env.SMS_API_URI,
      smsApiKey: process.env.SMS_API_KEY,
    },
    mailman: {
      host: process.env.MAIL_HOST,
      port: +process.env.MAIL_PORT,
      username: process.env.MAIL_AUTH_USER,
      password: process.env.MAIL_AUTH_PASSWORD,
      from: `"Teleport VMS" <${process.env.MAIL_DEFAULT_FROM}>`,
      templateConfig: {
        //baseComponent: GenericMail,
        //templateOptions: {
        //socialMedia: [
        //{
        //name: 'youtube-noshare',
        //href: 'https://www.youtube.com/channel/UCh7GNMxYLW5EPPHKdumP2TQ',
        //},
        //{
        //name: 'facebook-noshare',
        //href: 'https://www.facebook.com/teleport.et/',
        //},
        //{
        //name: 'linkedin-noshare',
        //href: 'https://www.linkedin.com/company/teleport',
        //},
        //{
        //name: 'github-noshare',
        //href: 'https://repo.teleport.et',
        //},
        //],
        //appLogoSrc: 'https://teleportet.com/wp-content/uploads/2022/01/Teleport-ai.png',
        //appName: 'Teleport Voucher Management System',
        //contactEmail: 'info@teleportet.et',
        //},
      },
    },
    storage: {
      type: process.env.STORAGE_TYPE || 'filesystem',
      rootDir: process.env.STORAGE_ROOT_DIR || './storage',
      filesRoute: process.env.STORAGE_FILES_ROUTE || 'files',
      filesAccess: process.env.STORAGE_FILES_ACCESS || 'all',
      filesDirname: process.env.STORAGE_FILES_DIRNAME ?? 'files',
      filesDirPattern: process.env.STORAGE_FILES_DIR_PATTERN,
      filesNamePattern: process.env.STORAGE_FILES_NAME_PATTERN ?? '{{name}}_{{uuid}}.{{extension}}',
      tempDirname: process.env.STORAGE_TEMP_DIRNAME ?? 'temp',
      cacheDuration: StringUtil.parseInteger(process.env.STORAGE_CACHE_DURATION, 2592000),
    },
    db: {
      type: process.env.DB_TYPE || 'mariadb',
      host: process.env.DB_HOST || '127.0.0.1',
      port: StringUtil.parseInteger(process.env.DB_PORT, !process.env.DB_TYPE || process.env.DB_TYPE === 'mariadb' ? 3306 : 5432),
      name: process.env.DB_NAME || 'appdb',
      synchronize: true,

      // schema: process.env.DB_SCHEMA || 'public',
      // authSource: process.env.DB_AUTH_SOURCE || 'admin',
      // replicaSet: process.env.DB_REPLICA_SET,
      cache: {
        type: 'redis',
        duration: 30000, // 30 seconds
        options: {
          socket: {
            host: process.env.REDIS_HOST || '127.0.0.1',
            port: StringUtil.parseInteger(process.env.REDIS_PORT, 6379),
            user: process.env.REDIS_USER || 'default',
            password: process.env.REDIS_PASSWORD,
          },
        },
      },
      user: process.env.DB_USERNAME || 'admin',
      password: process.env.DB_PASSWORD,
      tlsEnabled: StringUtil.parseBool(process.env.DB_TLS_ENABLED, false),
      tlsCAPath: process.env.DB_TLS_CA_PATH,
      syncIndexes: StringUtil.parseBool(process.env.DB_SYNC_INDEXES, true),
      logging: process.env.DB_LOGGING !== 'false' ? (process.env.DB_LOGGING !== 'all' ? StringUtil.parseArray(process.env.DB_LOGGING, 'all') : 'all') : false,
      migration: {
        enabled: StringUtil.parseBool(process.env.DB_MIGRATION_ENABLED, true),
        autoRun: docsOnly ? false : StringUtil.parseBool(process.env.DB_MIGRATION_AUTORUN, true),
        table: process.env.DB_MIGRATION_TABLE || 'migration',
        dirname: process.env.DB_MIGRATION_DIRNAME || 'migrations',
        sourceRoot: process.env.DB_MIGRATION_SOURCE_ROOT || './src',
        distRoot: process.env.DB_MIGRATION_DIST_ROOT || './dist',
        extraEntities: StringUtil.parseArray(process.env.DB_MIGRATION_EXTRA_ENTITIES, [], ';'),
        extraSubscribers: StringUtil.parseArray(process.env.DB_MIGRATION_EXTRA_SUBSCRIBERS, [], ';'),
        extraMigrations: StringUtil.parseArray(process.env.DB_MIGRATION_EXTRA_MIGRATIONS, [], ';'),
      },
    },
    redis: {
      host: process.env.REDIS_HOST || '127.0.0.1',
      port: StringUtil.parseInteger(process.env.REDIS_PORT, 6379),
      db: process.env.REDIS_DB,
      user: process.env.REDIS_USER || 'default',
      password: process.env.REDIS_PASSWORD,
      keyPrefix: process.env.REDIS_KEY_PREFIX,
    },
    queue: {
      type: process.env.QUEUE_TYPE || 'redis',
      prefix: process.env.QUEUE_PREFIX,
      removeOnComplete: StringUtil.parseBool(process.env.QUEUE_REMOVE_ON_COMPLETE, true),
      removeOnFail: StringUtil.parseBool(process.env.QUEUE_REMOVE_ON_FAIL, false),
      retryAttempts: StringUtil.parseInteger(process.env.QUEUE_RETRY_ATTEMPTS, 3),
      retryBackoff: StringUtil.parseInteger(process.env.QUEUE_RETRY_BACKOFF, 3000),
    },
    cache: {
      type: process.env.CACHE_TYPE || 'redis',
      prefix: process.env.CACHE_PREFIX,
      ttl: StringUtil.parseInteger(process.env.CACHE_TTL, 5),
      maxItems: StringUtil.parseInteger(process.env.CACHE_MAX_ITEMS, 100),
      enabled: StringUtil.parseBool(process.env.CACHE_ENABLED, true),
      cleanStart: StringUtil.parseBool(process.env.CACHE_CLEAN_START, true),
      evictionStrategy: process.env.CACHE_EVICTION_STRATEGY || 'LRU',
      evictionDeferred: StringUtil.parseBool(process.env.CACHE_EVICTION_DEFERRED, false),
      changeStrategy: process.env.CACHE_CHANGE_STRATEGY || 'expire-related',
      changeDeferred: StringUtil.parseBool(process.env.CACHE_CHANGE_DEFERRED, false),
      filesystem: {
        rootDir: process.env.CACHE_FILESYSTEM_ROOT_DIR || './storage/cache',
        subdirsEnabled: StringUtil.parseBool(process.env.CACHE_FILESYSTEM_SUBDIRS_ENABLED, false),
        maxSize: StringUtil.parseInteger(process.env.CACHE_FILESYSTEM_MAX_SIZE, 0),
      },
    },
    template: {
      type: process.env.TEMPLATE_TYPE || 'handlebars',
      rootDir: process.env.TEMPLATE_ROOT_DIR || './templates',
      inlineCss: {
        url: process.env.TEMPLATE_INLINE_CSS_URL || '_',
        enabled: StringUtil.parseBool(process.env.TEMPLATE_INLINE_CSS_ENABLED, false),
      },
    },
    mail: {
      type: process.env.MAIL_TYPE || 'smtp',
      queueEnabled: StringUtil.parseBool(process.env.MAIL_QUEUE_ENABLED, true),
      templateEnabled: StringUtil.parseBool(process.env.MAIL_TEMPLATE_ENABLED, true),
      senderName: process.env.MAIL_SENDER_NAME,
      senderAddress: process.env.MAIL_SENDER_ADDRESS,
      smtp: {
        host: process.env.MAIL_SMTP_HOST || '127.0.0.1',
        port: StringUtil.parseInteger(process.env.MAIL_SMTP_PORT, 587),
        secure: StringUtil.parseBool(process.env.MAIL_SMTP_SECURE, false),
        user: process.env.MAIL_SMTP_USER,
        password: process.env.MAIL_SMTP_PASSWORD,
      },
      sendinblue: {
        apiKey: process.env.MAIL_SENDINBLUE_API_KEY,
      },
    },
    cors: {
      enabled: StringUtil.parseBool(process.env.CORS_ENABLED, true),
      origin: process.env.CORS_ORIGIN || '*',
      methods: StringUtil.parseArray(process.env.CORS_METHODS, ['*']),
      allowedHeaders: StringUtil.parseArray(process.env.CORS_ALLOWED_HEADERS, ['*']),
      exposedHeaders: StringUtil.parseArray(process.env.CORS_EXPOSED_HEADERS, ['*']),
      maxAge: StringUtil.parseInteger(process.env.CORS_MAX_AGE, 2592000),
      credentials: StringUtil.parseBool(process.env.CORS_CREDENTIALS, true),
    },
    jwt: {
      publicKey: process.env.AUTH_ACCESS_PUBLIC_KEY,
      privateKey: process.env.AUTH_ACCESS_PRIVATE_KEY,
      signOptions: {
        algorithm: 'ES256',
        keyid: '32214f1e-3315-40a3-b3db-f83d54c1ed3e',
      },
      verifyOptions: {
        algorithms: ['ES256'],
      },
    },
    jwtRefresh: {
      publicKey: process.env.AUTH_REFRESH_PUBLIC_KEY,
      privateKey: process.env.AUTH_REFRESH_PRIVATE_KEY,
      signOptions: {
        algorithm: 'ES256',
        keyid: '71f6f0cf-cd79-4347-9c91-387a0c4fa4da',
        jwtid: 'refreshjwt',
      },
      verifyOptions: {
        algorithms: ['ES256'],
      },
    },
    auth: {
      route: process.env.AUTH_ROUTE || 'auth',
      accountEnabled: StringUtil.parseBool(process.env.AUTH_ACCOUNT_ENABLED, true),
      login: {
        enabled: StringUtil.parseBool(process.env.AUTH_LOGIN_ENABLED, true),
        recaptcha: StringUtil.parseBool(process.env.AUTH_LOGIN_RECAPTCHA, false),
      },
      logout: {
        enabled: StringUtil.parseBool(process.env.AUTH_LOGOUT_ENABLED, true),
      },
      admin: {
        create: docsOnly ? false : StringUtil.parseBool(process.env.AUTH_ADMIN_CREATE, false),
        username: process.env.AUTH_ADMIN_USERNAME || 'admin@transfer.et',
        password: process.env.AUTH_ADMIN_PASSWORD,
      },
      jwt: {
        enabled: StringUtil.parseBool(process.env.AUTH_JWT_ENABLED, true),
        expiresIn: StringUtil.parseInteger(process.env.AUTH_JWT_EXPIRES_IN, 2592000),
        secret: process.env.AUTH_JWT_SECRET,
      },
      basic: {
        enabled: StringUtil.parseBool(process.env.AUTH_BASIC_ENABLED, false),
      },
      oauth2: {
        enabled: StringUtil.parseBool(process.env.AUTH_OAUTH2_ENABLED, false),
      },
      apikey: {
        enabled: StringUtil.parseBool(process.env.AUTH_APIKEY_ENABLED, false),
      },
      recaptcha: {
        enabled: StringUtil.parseBool(process.env.RECAPTCHA_ENABLED, false),
        siteSecret: process.env.RECAPTCHA_SITE_SECRET,
        deliveryHeader: process.env.RECAPTCHA_DELIVERY_HEADER || 'X-RECAPTCHA-TOKEN',
        deliveryQuery: process.env.RECAPTCHA_DELIVERY_QUERY || 'recaptcha_token',
        deliveryBody: process.env.RECAPTCHA_DELIVERY_BODY || 'recaptchaToken',
      },
      google: {
        enabled: StringUtil.parseBool(process.env.GOOGLE_ENABLED, false),
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        // urls
        authPageUrl: process.env.GOOGLE_AUTH_PAGE_URL || 'https://accounts.google.com/o/oauth2/v2/auth',
        tokenUrl: process.env.GOOGLE_TOKEN_URL || 'https://oauth2.googleapis.com/token',
        userInfoUrl: process.env.GOOGLE_USER_INFO_URL || 'https://www.googleapis.com/oauth2/v1/userinfo',
        scopes: StringUtil.parseArray(process.env.GOOGLE_SCOPES, ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email']),
        // client / frontend redirect uri
        redirectUri: process.env.GOOGLE_REDIRECT_URI || 'auth/google-callback',
      },
      facebook: {
        enabled: StringUtil.parseBool(process.env.FB_ENABLED, false),
        clientId: process.env.FB_CLIENT_ID,
        clientSecret: process.env.FB_CLIENT_SECRET,
        // urls
        authPageUrl: process.env.FB_AUTH_PAGE_URL || 'https://www.facebook.com/v18.0/dialog/oauth',
        tokenUrl: process.env.FB_TOKEN_URL || 'https://graph.facebook.com/v18.0/oauth/access_token',
        userInfoUrl: process.env.FB_USER_INFO_URL || 'https://graph.facebook.com/v18.0/me',
        scopes: StringUtil.parseArray(process.env.FB_SCOPES, ['email', 'public_profile']),
        // client / frontend redirect uri
        redirectUri: process.env.FB_REDIRECT_URI || 'auth/fb-callback',
      },
    },
    account: {
      route: process.env.ACCOUNT_ROUTE || 'account',
      verification: {
        enabled: StringUtil.parseBool(process.env.ACCOUNT_VERIFICATION_ENABLED, true),
        tokenType: process.env.ACCOUNT_VERIFICATION_TOKEN_TYPE || 'base62',
        tokenLength: StringUtil.parseInteger(process.env.ACCOUNT_VERIFICATION_TOKEN_LENGTH, 16),
        tokenPrefix: process.env.ACCOUNT_VERIFICATION_TOKEN_PREFIX,
      },
      registration: {
        enabled: StringUtil.parseBool(process.env.ACCOUNT_REGISTRATION_ENABLED, true),
        recaptcha: StringUtil.parseBool(process.env.ACCOUNT_REGISTRATION_RECAPTCHA, true),
        sendVerifyEmail: StringUtil.parseBool(process.env.ACCOUNT_REGISTRATION_SEND_VERIFY_EMAIL, true),
      },
      identifierAvailable: {
        enabled: StringUtil.parseBool(process.env.ACCOUNT_IDENTIFIER_AVAILABLE_ENABLED, true),
        recaptcha: StringUtil.parseBool(process.env.ACCOUNT_IDENTIFIER_AVAILABLE_RECAPTCHA, false),
      },
      sendVerifyEmail: {
        enabled: StringUtil.parseBool(process.env.ACCOUNT_SEND_VERIFY_EMAIL_ENABLED, true),
        recaptcha: StringUtil.parseBool(process.env.ACCOUNT_SEND_VERIFY_EMAIL_RECAPTCHA, false),
        expiresIn: StringUtil.parseInteger(process.env.ACCOUNT_SEND_VERIFY_EMAIL_EXPIRES_IN, 172800),
        linkUrl: process.env.ACCOUNT_SEND_VERIFY_EMAIL_LINK_URL,
        templateName: process.env.ACCOUNT_SEND_VERIFY_EMAIL_TEMPLATE_NAME,
      },
      verifyEmail: {
        enabled: StringUtil.parseBool(process.env.ACCOUNT_VERIFY_EMAIL_ENABLED, true),
        recaptcha: StringUtil.parseBool(process.env.ACCOUNT_VERIFY_EMAIL_RECAPTCHA, false),
      },
      sendResetPassword: {
        enabled: StringUtil.parseBool(process.env.ACCOUNT_SEND_RESET_PASSWORD_ENABLED, true),
        recaptcha: StringUtil.parseBool(process.env.ACCOUNT_SEND_RESET_PASSWORD_RECAPTCHA, false),
        expiresIn: StringUtil.parseInteger(process.env.ACCOUNT_SEND_RESET_PASSWORD_EXPIRES_IN, 7200),
        linkUrl: process.env.ACCOUNT_SEND_RESET_PASSWORD_LINK_URL,
        templateName: process.env.ACCOUNT_SEND_RESET_PASSWORD_TEMPLATE_NAME,
      },
      resetPassword: {
        enabled: StringUtil.parseBool(process.env.ACCOUNT_RESET_PASSWORD_ENABLED, true),
        recaptcha: StringUtil.parseBool(process.env.ACCOUNT_RESET_PASSWORD_RECAPTCHA, false),
      },
    },
    rest: {
      enabled: StringUtil.parseBool(process.env.REST_ENABLED, true),
      swagger: StringUtil.parseBool(process.env.REST_SWAGGER_ENABLED, true),
      queryMethod: process.env.REST_QUERY_METHOD || 'POST',
      aggregateMethod: process.env.REST_AGGREGATE_METHOD || 'POST',
    },
    pagination: {
      maxSize: StringUtil.parseInteger(process.env.PAGINATION_MAX_SIZE, 200),
      defaultSize: StringUtil.parseInteger(process.env.PAGINATION_DEFAULT_SIZE, 100),
      defaultSort: process.env.PAGINATION_DEFAULT_SORT,
    },
    bull: {
      redis: {
        port: parseInt(process.env.REDIS_PORT, 10),
        host: process.env.REDIS_HOST,
        password: process.env.REDIS_PASSWORD,
        username: 'default',
      },
    },
    health: {
      route: process.env.HEALTH_ROUTE || 'health',
      memoryThreshold: StringUtil.parseInteger(process.env.HEALTH_MEMORY_THRESHOLD, 1024),
      diskThreshold: StringUtil.parseFloat(process.env.HEALTH_DISK_THRESHOLD, 0.9),
    },
  };
};
