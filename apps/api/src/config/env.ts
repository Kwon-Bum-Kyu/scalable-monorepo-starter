import { config } from "dotenv";
import { bool, cleanEnv, num, str } from "envalid";
import path from "path";

config({ path: path.resolve(process.cwd(), "../../.env") });

export const env = cleanEnv(process.env, {
  NODE_ENV: str({
    choices: ["development", "test", "production"],
    default: "development",
  }),
  PORT: num({ default: 4000 }),
  DATABASE_URL: str(),
  LOG_LEVEL: str({ default: "info", devDefault: "debug" }),
  LOG_PRETTY: bool({ default: false, devDefault: true }),
  CORS_ALLOWED_ORIGINS: str({ default: "http://localhost:3000" }),
  RATE_LIMIT_WINDOW_MS: num({ default: 60000 }),
  RATE_LIMIT_MAX: num({ default: 100 }),
  ENABLE_EXAMPLES: bool({ default: false, devDefault: true }),
  HEALTH_DB_TIMEOUT_MS: num({ default: 2000 }),
});
