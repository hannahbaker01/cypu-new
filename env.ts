import { config } from "dotenv";
import { cleanEnv, num, str } from "envalid";

await config({ export: true });

export default cleanEnv(Deno.env.toObject(), {
  BOT_TOKEN: str(),
  OWNERS: str(),
  REDIS_URI: str(),
  REDIS_PASSWORD: str(),
  LISTEN_CHAT: str(),
});
