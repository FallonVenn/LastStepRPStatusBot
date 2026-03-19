import fetch from "node-fetch";
import net from "net";
import http from "http";

const WEBHOOK = process.env.WEBHOOK_URL;
const HOST = "144.126.153.215";
const PORT = 32516; // RCON port instead; Query Port is 32515

let wasOnline = true;

// Send message
async function send(msg) {
  try {
    await fetch(WEBHOOK, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: "Last Step RP Server Status",
        avatar_url: "https://i.imgur.com/4M34hi2.png", // ✅ direct image link only
        content: msg
      })
    });
  } catch (err) {
    console.error("Webhook error:", err);
  }
}

// Check server
let failCount = 0;
const FAIL_THRESHOLD = 2; // how many failed checks before calling it "down"

function checkServer() {
  const socket = new net.Socket();

  socket.setTimeout(2000);

  socket.connect(PORT, HOST, () => {
    // SUCCESS
    if (!wasOnline) {
      send("✅ Server back online!");
    }

    wasOnline = true;
    failCount = 0;
    socket.destroy();
  });

  socket.on("error", () => {
    failCount++;

    if (wasOnline && failCount >= FAIL_THRESHOLD) {
      send("🔄 Server restarting...");
      wasOnline = false;
    }
  });

  socket.on("timeout", () => {
    socket.destroy();
  });
}

// Run every 30 seconds
setInterval(checkServer, 10000);

// Restart schedule messages
function scheduleRestartWarnings() {
  setInterval(() => {
    const now = new Date();

    // ⚠️ Adjust to your restart time if needed
    if (now.getHours() === 5 && now.getMinutes() === 50) {
      send("⚠️ Server restart in 10 minutes");
    }
    if (now.getHours() === 5 && now.getMinutes() === 55) {
      send("⚠️ Server restart in 5 minutes");
    }
    if (now.getHours() === 5 && now.getMinutes() === 59) {
      send("⚠️ Server restart in 1 minute");
    }
  }, 60000);
}

scheduleRestartWarnings();

// REQUIRED for Render (dynamic port binding)
const PORT_WEB = process.env.PORT || 3000;

http.createServer((req, res) => {
  res.writeHead(200);
  res.end("Bot is running");
}).listen(PORT_WEB, () => {
  console.log(`Web server running on port ${PORT_WEB}`);
});

// Startup log
console.log("Last Step RP Server Status Bot is running...");
