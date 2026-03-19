import fetch from "node-fetch";
import net from "net";

const WEBHOOK = "https://discord.com/api/webhooks/1484134516363890860/1z8uVzHLTue-OsLStUI2TGOltYdvQ9g0Tku2gsCIcbEMBN8Y7P0UoWJZnkilV6bXMWQK";
const HOST = "144.126.153.215";
const PORT = 32515;

let wasOnline = true;

// Send message
async function send(msg) {
  await fetch(WEBHOOK, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: "Last Step RP Server Status",
      avatar_url: "https://imgur.com/a/QxG6Pou",
    content: msg
    })
  });
}

// Check server
function checkServer() {
  const socket = new net.Socket();

  socket.setTimeout(3000);

  socket.connect(PORT, HOST, () => {
    if (!wasOnline) {
      send("✅ Server back online!");
    }
    wasOnline = true;
    socket.destroy();
  });

  socket.on("error", () => {
    if (wasOnline) {
      send("🔄 Server restarting...");
    }
    wasOnline = false;
  });

  socket.on("timeout", () => {
    socket.destroy();
  });
}

// Run every 30 seconds
setInterval(checkServer, 30000);

// Optional: Restart schedule messages
function scheduleRestartWarnings() {
  setInterval(() => {
    const now = new Date();

    // Example: restart at 6:00 AM
    if (now.getHours() === 5 && now.getMinutes() === 50) {
      send("⚠️ Restart in 10 minutes");
    }
    if (now.getHours() === 5 && now.getMinutes() === 55) {
      send("⚠️ Restart in 5 minutes");
    }
    if (now.getHours() === 5 && now.getMinutes() === 59) {
      send("⚠️ Restart in 1 minute");
    }
  }, 60000);
}

scheduleRestartWarnings();

import http from "http";

http.createServer((req, res) => {
  res.writeHead(200);
  res.end("Bot is running");
}).listen(3000);
