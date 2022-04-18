const Discord = require("discord.js")
const client = new Discord.Client(
    {intents: ["GUILDS", "GUILD_MEMBERS", "GUILD_MESSAGES"]}
)

client.login(process.env.token)
//client.login("OTY1MjYyOTEwNTc2Mjk1OTM2.YlwpIw.3g4joeLLpp_ykDY08MXmBspROkU")
client.on("ready", () => {
    console.log("Sono Online.")
})

client.on("messageCreate", (message) => {
    if (message.content == "Ciao") {
        message.channel.send("Salutamelo");
    }
})


