export default () => ({
  port: parseInt(process.env.API_PORT, 10) || 3000,
  cookie_secret: process.env.COOKIE_SECRET,
  env: process.env.APP_ENV || 'local',
  login_expires_seconds:
    parseInt(process.env.LOGIN_EXPIRES_SECONDS, 10) || 48 * 60 * 60, // Default 48hs
  api_domain: process.env.API_DOMAIN || 'localhost',
  postgres: {
    host: process.env.POSTGRES_HOST || '0.0.0.0',
    port: parseInt(process.env.POSTGRES_PORT, 10) || 5432,
    username: process.env.POSTGRES_USERNAME || 'postgres',
    password: process.env.POSTGRES_PASSWORD || 'password',
    database: process.env.POSTGRES_DB || 'acme',
    log_queries: process.env.POSTGRES_LOG_QUERIES === 'true',
  },
  auth0: {
    domain: process.env.AUTH0_DOMAIN,
    clientId: process.env.AUTH0_CLIENT_ID,
    clientSecret: process.env.AUTH0_CLIENT_SECRET,
    auth_audience: process.env.AUTH0_AUTH_AUDIENCE,
    management_audience: process.env.AUTH0_MANAGEMENT_AUDIENCE,
  },
  redis: {
    host: process.env.REDIS_HOST || '0.0.0.0',
    port: parseInt(process.env.REDIS_PORT, 10) || 6379,
    username: process.env.REDIS_USERNAME || 'default',
    password: process.env.REDIS_PASSWORD || 'password',
  },
});
