const Discord = require("discord.js")
const client = new Discord.Client(
    {intents: ["GUILDS", "GUILD_MEMBERS", "GUILD_MESSAGES"]}
)

var ruolo = "965547318009016330" //admin

//client.login(process.env.token)
client.login("OTY1MjYyOTEwNTc2Mjk1OTM2.YlwpIw.3g4joeLLpp_ykDY08MXmBspROkU")
client.on("ready", () => {
    console.log("Sono Online.")
})

client.on("messageCreate", (message) => {
    if(message.author.bot == false) {
        if (message.member.roles.cache.has(ruolo)) {
            message.reply("Ciao amministratore!");
        } else {
            message.channel.send("Non puoi scrivere qui, non sei admin.");
        }

        let myStr = message.content
        let firstWord = myStr.split(" ")[0]
        let secondWord = myStr.split(" ")[1]
        let thirdWord = myStr.split(" ")[2]
        console.log(firstWord)
        console.log(secondWord)
        console.log(thirdWord)
    }
})


