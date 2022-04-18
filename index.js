const Discord = require("discord.js")
const client = new Discord.Client(
    {intents: ["GUILDS", "GUILD_MEMBERS", "GUILD_MESSAGES"]}
)

var ruolo = "965547318009016330" //id ruolo admin
var canale = "965263672421277748" //id canale dove scrive il bot
var server = "965263672421277746" //id server

//client.login(process.env.token)
client.login("OTY1MjYyOTEwNTc2Mjk1OTM2.YlwpIw.3g4joeLLpp_ykDY08MXmBspROkU")
client.on("ready", () => {
    console.log("Sono Online.")
})

client.on("messageCreate", (message) => {
    if(message.author.bot == false && message.channel == canale) {
        if (message.content.split(" ")[0] == "!give"){
            if (message.member.roles.cache.has(ruolo)) {
                if (message.content.split(" ")[1].length>1){
                    if(message.content.split(" ").slice(-1)[0]>3 ||
                    message.content.split(" ").slice(-1)[0]<=0 ||
                    isNaN(message.content.split(" ").slice(-1)[0]) == true){
                        message.reply("Hai sbagliato le milestones.");
                    } else if (message.content.split(" ").slice(-1)[0]>1){
                        message.reply("Ho aggiunto " + 
                        message.content.split(" ").slice(-1) +
                        " milestones a " + message.content.split(" ")[1] + ".");
                    } else if (message.content.split(" ").slice(-1)[0]>0){
                        message.reply("Ho aggiunto " + 
                        message.content.split(" ").slice(-1) +
                        " milestone a " + message.content.split(" ")[1] + ".");
                    }
                }
                else {
                    message.reply("**Attenzione!**\nLa formula è *'!give" + 
                    " [Nome_PG] [Milestones]'*.");
                }
            } else {
                message.reply("Non sei admin.");
            }
        }
        let myStr = message.content
        let firstWord = myStr.split(" ")[0]
        let secondWord = myStr.split(" ")[1]
        let thirdWord = myStr.split(" ")[2]
        let lastword = myStr.split(" ").slice(-1)[0]
        let fcharfword = myStr.split(" ")[0][0]
        let a = myStr.split(" ").slice(0)
        //let fchar = thirdWord.split("")[0] //first char
        //let uchar = thirdWord.slice(-1) //last char
        console.log(firstWord)
        console.log(secondWord)
        console.log(thirdWord)
        console.log(lastword)
        console.log(fcharfword)
        console.log(a)
        //console.log(fchar)
        //console.log(uchar)
        //console.log(message)
    }
})


client.on('guildMemberUpdate', (oldMember, newMember) => {
    let txtChannel = client.channels.cache.get(canale); //my own text channel, you may want to specify your own
    let oldRoleIDs = [];
    oldMember.roles.cache.each(role => {
        console.log(role.name, role.id);
        oldRoleIDs.push(role.id);
    });
    let newRoleIDs = [];
    newMember.roles.cache.each(role => {
        console.log(role.name, role.id);
        newRoleIDs.push(role.id);
    });
    console.log("---")
    //check if the newRoleIDs had one more role, which means it added a new role
    if (newRoleIDs.length > oldRoleIDs.length) {
        function filterOutOld(id) {
            for (var i = 0; i < oldRoleIDs.length; i++) {
                if (id === oldRoleIDs[i]) {
                    return false;
                }
            }
            return true;
        }
        txtChannel.send("Benvenuto tra i risvegliati!");
    }
})
