const brokerUrl = "wss://broker.hivemq.com:8884/mqtt";

const commandTopic = "sidpico/commands";
const statusTopic = "sidpico/status";

const statusText = document.getElementById("connectionStatus");
const statusDot = document.getElementById("statusDot");

const sendBtn = document.getElementById("sendBtn");
const clearBtn = document.getElementById("clearBtn");
const commandInput = document.getElementById("commandInput");
const messageLog = document.getElementById("messageLog");

const client = mqtt.connect(brokerUrl);

/* ---------- LOG FUNCTION ---------- */
function addLog(msg) {
    const time = new Date().toLocaleTimeString();

    const div = document.createElement("div");
    div.className = "log-entry";
    div.innerText = `[${time}] ${msg}`;

    messageLog.prepend(div);
}

/* ---------- CONNECT ---------- */
client.on("connect", () => {
    statusText.innerText = "Connected";
    statusDot.style.background = "lime";
    statusDot.style.boxShadow = "0 0 12px lime";

    addLog("Connected to broker");

    // IMPORTANT: subscribe WITH callback
    client.subscribe(statusTopic, (err) => {
        if (err) {
            addLog("Subscribe failed: " + err.message);
        } else {
            addLog("Subscribed to " + statusTopic);
        }
    });
});

/* ---------- MESSAGE ---------- */
client.on("message", (topic, payload) => {
    const msg = payload.toString();

    addLog(`${topic} → ${msg}`);
});

/* ---------- DISCONNECT ---------- */
client.on("offline", () => {
    statusText.innerText = "Disconnected";
    statusDot.style.background = "red";
    statusDot.style.boxShadow = "0 0 12px red";

    addLog("Disconnected");
});

/* ---------- ERROR ---------- */
client.on("error", (err) => {
    addLog("ERROR: " + err.message);
});

/* ---------- SEND ---------- */
function sendMessage() {
    const msg = commandInput.value.trim();
    if (!msg) return;

    client.publish(commandTopic, msg);

    addLog(`Sent → ${msg}`);

    commandInput.value = "";
}

sendBtn.addEventListener("click", sendMessage);

commandInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage();
});

/* ---------- CLEAR ---------- */
clearBtn.addEventListener("click", () => {
    messageLog.innerHTML = "";
});
