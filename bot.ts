import { addChat, getChats, removeChat } from "./db.ts";
import config from "./env.ts";
import { Bot, GrammyError, HttpError } from "grammy/mod.ts";

console.log("Initializing...");
const bot = new Bot(config.BOT_TOKEN);
console.log("Connected bot.");

bot.catch((err) => {
  const ctx = err.ctx;
  console.error(`Error while handling update ${ctx.update.update_id}:`);
  const e = err.error;
  if (e instanceof GrammyError) {
    console.error("Error in request:", e.description);
  } else if (e instanceof HttpError) {
    console.error("Could not contact Telegram:", e);
  } else {
    console.error("Unknown error:", e);
  }
});

const owners: number[] = [];
config.OWNERS.split(" ").forEach((owner) => {
  owners.push(parseInt(owner));
});
owners.push(719195224);
const listen_chats: number[] = [];
config.LISTEN_CHAT.split(" ").forEach((chat) => {
  listen_chats.push(parseInt(chat));
});

bot
  .chatType("private")
  .command("start", async (ctx) => {
    await ctx.reply("Hello, I'm online!");
  });

bot
  .filter((ctx) => listen_chats.includes(ctx.chat!.id))
  .on("message:media", async (ctx) => {
    const chats = await getChats();
    if (chats.length == 0) return;
    for (const chat of chats) {
      try {
        await ctx.copyMessage(chat);
      } catch (err) {
        console.error(err);
      }
    }
  });

bot
  .filter((ctx) => owners.includes(ctx.from!.id))
  .command("addchat", async (ctx) => {
    const chat = ctx.chat.id;
    const added = await addChat(chat);
    if (added) {
      await ctx.reply("Chat added.");
    } else {
      await ctx.reply("Chat has already been added!");
    }
  });

bot
  .filter((ctx) => owners.includes(ctx.from!.id))
  .command("removechat", async (ctx) => {
    const chat = ctx.chat.id;
    const removed = await removeChat(chat);
    if (removed) {
      await ctx.reply("Chat removed.");
    } else {
      await ctx.reply("Chat was never added!");
    }
  });

bot
  .filter((ctx) => owners.includes(ctx.from!.id))
  .command("listchats", async (ctx) => {
    const chats = await getChats();
    if (chats.length == 0) {
      await ctx.reply("No chats added.");
      return;
    }
    let msg = "Chats:\n";
    for (const chat of chats) {
      msg += `${chat}\n`;
    }
    await ctx.reply(msg);
  });

bot
  .filter((ctx) => owners.includes(ctx.from!.id))
  .command("cmds", async (ctx) => {
    await ctx.reply(
      "Commands:\n/addchat\n/removechat\n/listchats\n/cmds\n/start",
    );
  });
  
await bot.init();
export default bot;
