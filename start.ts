import bot from "./bot.ts";

console.log(`Started bot as @${bot.botInfo.username}`);

bot.start({
  drop_pending_updates: true,
  allowed_updates: ["message"],
});

Deno.addSignalListener("SIGINT", () => bot.stop());
if (Deno.build.os != "windows") {
  Deno.addSignalListener("SIGTERM", () => bot.stop());
}
