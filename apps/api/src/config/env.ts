import { config } from "dotenv";
import { cleanEnv, num, str } from "envalid";
import path from "path";

config({ path: path.resolve(process.cwd(), "../../.env") });

export const env = cleanEnv(process.env, {
  NODE_ENV: str({
    choices: ["development", "test", "production"],
    default: "development",
  }),
  PORT: num({ default: 4000 }),
  DATABASE_URL: str(),
});
