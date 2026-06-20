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

const messageBox =
    document.getElementById("message");

const sendBtn =
    document.getElementById("sendBtn");

const commandInput =
    document.getElementById("commandInput");

console.log("Connecting...");

const client = mqtt.connect(brokerUrl);

client.on("connect", () => {

    console.log("Connected");

    statusText.innerText = "Connected";

    statusDot.style.background = "lime";

    statusDot.style.boxShadow =
        "0 0 12px lime";

    client.subscribe(statusTopic);

    messageBox.innerText =
        "Connected to MQTT Broker";
});

client.on("message",
    (topic, payload) => {

        const msg =
            payload.toString();

        console.log(msg);

        messageBox.innerText = msg;
    });

client.on("error", (err) => {

    console.error(err);

    statusText.innerText = "Error";
});

client.on("offline", () => {

    statusText.innerText =
        "Disconnected";

    statusDot.style.background =
        "red";

    statusDot.style.boxShadow =
        "0 0 12px red";
});

sendBtn.addEventListener(
    "click",
    sendMessage
);

commandInput.addEventListener(
    "keypress",
    function(event) {

        if(event.key === "Enter")
        {
            sendMessage();
        }
    }
);

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

    console.log(
        "Sent:",
        message
    );

    commandInput.value = "";
}
