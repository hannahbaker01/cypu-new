import config from "./env.ts";
import { connect } from "redis";

const host_and_port = config.REDIS_URI.split(":");

console.log("Connecting to Redis Database...");
const db = await connect({
  hostname: host_and_port[0],
  port: parseInt(host_and_port[1]),
  password: config.REDIS_PASSWORD,
});
console.log("Connected to Redis DB.");

export async function getChats() {
  const chats = await db.get("bot_chats");
  if (!chats) return [];
  return JSON.parse(chats);
}

export async function addChat(id: number) {
  const chats = await getChats();
  if (chats.includes(id)) return false;
  chats.push(id);
  await db.set("bot_chats", JSON.stringify(chats));
  return true;
}

export async function removeChat(id: number) {
  const chats = await getChats();
  if (!chats.includes(id)) return false;
  chats.splice(chats.indexOf(id), 1);
  await db.set("bot_chats", JSON.stringify(chats));
  return true;
}

export async function isChatAdded(id: number) {
  const chats = await getChats();
  return chats.includes(id);
}
