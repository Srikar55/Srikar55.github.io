const brokerUrl =
    "wss://broker.hivemq.com:8884/mqtt";

const commandTopic =
    "sidpico/commands";

const statusTopic =
    "sidpico/status";

const statusText =
    document.getElementById("connectionStatus");

const statusDot =
    document.getElementById("statusDot");

const sendBtn =
    document.getElementById("sendBtn");

const clearBtn =
    document.getElementById("clearBtn");

const commandInput =
    document.getElementById("commandInput");

const messageLog =
    document.getElementById("messageLog");

const client = mqtt.connect(brokerUrl);

function addLog(message)
{
    const time =
        new Date().toLocaleTimeString();

    const entry =
        document.createElement("div");

    entry.className = "log-entry";

    entry.innerHTML =
        `[${time}] ${message}`;

    messageLog.prepend(entry);
}

client.on("connect", () => {

    statusText.innerText =
        "Connected";

    statusDot.style.background =
        "lime";

    statusDot.style.boxShadow =
        "0 0 12px lime";

client.subscribe(statusTopic, (err) => {

    if (err)
    {
        console.error(err);

        addLog("Subscribe Failed");
    }
    else
    {
        console.log(
            "Subscribed to:",
            statusTopic
        );

        addLog(
            "Subscribed to " +
            statusTopic
        );
    }
});

addLog("Connected to MQTT Broker");
});

client.on("message",
    (topic, payload) => {

        console.log(
            "Message received"
        );

        console.log(
            "Topic:",
            topic
        );

        console.log(
            "Payload:",
            payload.toString()
        );

        addLog(
            topic +
            " -> " +
            payload.toString()
        );
    });

client.on("offline", () => {

    statusText.innerText =
        "Disconnected";

    statusDot.style.background =
        "red";

    statusDot.style.boxShadow =
        "0 0 12px red";

    addLog("Disconnected");
});

client.on("error", (err) => {

    addLog("ERROR: " + err.message);
});

function sendMessage()
{
    const message =
        commandInput.value.trim();

    if(message === "")
        return;

    client.publish(
        commandTopic,
        message
    );

    addLog("Sent → " + message);

    commandInput.value = "";
}

sendBtn.addEventListener(
    "click",
    sendMessage
);

commandInput.addEventListener(
    "keypress",
    (event) => {

        if(event.key === "Enter")
        {
            sendMessage();
        }
    }
);

clearBtn.addEventListener(
    "click",
    () => {

        messageLog.innerHTML = "";
    }
);
