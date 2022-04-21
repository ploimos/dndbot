const Discord = require("discord.js")
const { MongoClient } = require("mongodb")
const client = new Discord.Client(
    {intents: ["GUILDS", "GUILD_MEMBERS", "GUILD_MESSAGES"]}
)

var amm = "Non sei admin."
var att = "**Attenzione!**\nLa formula è"
var utente = "965706832758841364" //id ruolo utente land
var ruolo = "965547318009016330" //id ruolo admin
var canale = "965263672421277748" //id canale dove scrive il bot
var server = "965263672421277746" //id server
var pass = "cCgYya6YDwnGDH9h" //pass database
var ndb = "DbDnD" //nome database
var col1 = "tab1" //nome collection 1

//client.login(process.env.token)
client.login("OTY1MjYyOTEwNTc2Mjk1OTM2.YlwpIw.3g4joeLLpp_ykDY08MXmBspROkU")

//var MongoClient = require("mongodb").MongoClient;
var database;
var url = "mongodb+srv://botperdnd:"+pass+"@cluster0.kfhj7.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";


client.on("ready", () => {
    console.log("ONLINE");

})


client.on("messageCreate", (message) => {
    if(message.author.bot == false && message.channel == canale) {
        

        //Dare MS ai giocatori  

        if (message.content.split(" ")[0] == "!givems"){
            if (message.member.roles.cache.has(ruolo)){
                var frase = " *'!givems [Tag_Player] [Milestones]'*."; // comando scritto
                if (message.content.split(" ")[1].length>1){
                    if(message.content.split(" ").slice(-1)[0]>3 ||
                    message.content.split(" ").slice(-1)[0]==0 ||
                    isNaN(message.content.split(" ").slice(-1)[0]) == true){
                        message.reply("Hai sbagliato le milestones."); // errore valore
                    } else {
                        if (message.content.split(" ").slice(-1)[0]>1){
                            var s = "s"
                        } else if (message.content.split(" ").slice(-1)[0]>0){
                            var s = ""
                        }
                        message.reply("Ho aggiunto " + 
                        message.content.split(" ").slice(-1) +
                        " milestone"+s+" a " + message.content.split(" ")[1] + "."); // messaggio risposta

                        var num = parseInt(message.content.split(" ").slice(-1)); // dichiarazione valori
                        var name = message.content.split(" ")[1];

                        MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, function (err, db){
                            var database = db.db(ndb);
                            database.collection(col1).updateOne({id: name},{$inc: {ms: num}}, {upsert: true})
                        })
                    }
                }
                else {
                    message.reply(att+frase); // formula errata
                }
            } else {
                message.reply(amm); // messaggio non sei admin
            }
        }


        // Dare denaro ai giocatori

        if (message.content.split(" ")[0] == "!givemo"){
            if (message.member.roles.cache.has(ruolo)){
                var frase = " *'!givemo [Tag_Player] [Denaro]'*."; // comando scritto
                if (message.content.split(" ")[1].length>1){
                    if(message.content.split(" ").slice(-1)[0]==0 ||
                    isNaN(message.content.split(" ").slice(-1)[0]) == true){
                        message.reply("Hai sbagliato il denaro."); // errore valore
                    } else {
                        if (message.content.split(" ").slice(-1)[0]>1){
                            var s = "e"
                        } else if (message.content.split(" ").slice(-1)[0]>0){
                            var s = "a"
                        }
                        message.reply("Ho aggiunto " + 
                        message.content.split(" ").slice(-1) +
                        " monet"+s+" d'oro a " + message.content.split(" ")[1] + "."); // risposta

                        var num = Math.round(message.content.split(" ").slice(-1) * 100) / 100; // dichiarazioni valori
                        var name = message.content.split(" ")[1];

                        MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, function (err, db){
                            var database = db.db(ndb);
                            database.collection(col1).updateOne({id: name},{$inc: {money: num}}, {upsert: true})
                        })
                    }
                }
                else {
                    message.reply(att+frase); // formula errata
                }
            } else {
                message.reply(amm); // messaggio non sei admin
            }
        }


        // creare PG

        if (message.content.split(" ")[0] == "!creapg"){
            if (message.member.roles.cache.has(ruolo) || message.member.roles.cache.has(utente)){
                var frase = " *'!creapg [Tag_Player] [Nome_PG] [Denaro]'*."; // comando scritto
                if (message.content.split(" ")[1].length>1 ||
                message.content.split(" ")[2].length>1){
                    if(message.content.split(" ").slice(-1)[0]<=0 ||
                    isNaN(message.content.split(" ").slice(-1)[0]) == true){
                        message.reply("Hai sbagliato il denaro."); // errore valore
                    } else {

                        message.reply("Ho aggiunto " + 
                        message.content.split(" ").slice(-1) +
                        " monete d'oro a " + message.content.split(" ")[1] + "."); // risposta

                        var num = parseFloat(message.content.split(" ").slice(-1)); // dichiarazioni valori
                        var tag = message.content.split(" ")[1];
                        var name = message.content.split(" ")[2];

                        MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, function (err, db){
                            var database = db.db(ndb);
                            database.collection(col1).inserteOne({id: tag, nome: name, money: num, exp: 0})
                        })
                    }
                }
                else {
                    message.reply(att+frase); // formula errata
                }
            } else {
                message.reply(amm); // messaggio non sei admin
            }
        }

        
        // help differenziato per ruolo admin e utente
        
        if (message.content.split(" ")[0] == "!help"){
            if (message.member.roles.cache.has(ruolo)){                     // help admin
                message.reply("!givems\n"+
                "*Il comando è '!givems [Tag_Player] [Milestones]'*.\n\n"+
                "!givemo\n"+
                "*Il comando è '!givemo [Tag_Player] [Denaro]'*.\n\n");
            } else if (message.member.roles.cache.has(utente)){              // help giocatori
                message.reply("!creapg\n"+
                "*Il comando è '!creapg ...'*.");
            }
        }

        /*let myStr = message.content
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
        //console.log(message)*/
    }
})


client.on('guildMemberUpdate', (oldMember, newMember) => {
    let txtChannel = client.channels.cache.get(canale); //my own text channel, you may want to specify your own
    let oldRoleIDs = [];
    oldMember.roles.cache.each(role => {
        //console.log(role.name, role.id);
        oldRoleIDs.push(role.id);
    });
    let newRoleIDs = [];
    newMember.roles.cache.each(role => {
        //console.log(role.name, role.id);
        newRoleIDs.push(role.id);
    });
    //console.log("---")
    //check if the newRoleIDs had one more role, which means it added a new role
    if (newRoleIDs.length > oldRoleIDs.length 
    && newMember.roles.cache.has(utente)) {
        function filterOutOld(id) {
            for (var i = 0; i < oldRoleIDs.length; i++) {
                if (id === oldRoleIDs[i]) {
                    return false;
                }
            }
            return true;
        }
        // decidere se inserire un messaggio variabile per dare il benvenuto ai giocatori
        // e se fare in modo che il messaggio sia più caloroso o comunque piacevole
        // chiedere agli altri master!!!
        txtChannel.send("<@&"+utente+">\nDate il benvenuto a <@" +
        newMember.id + "> tra i nuovi giocatori della land!");
    }
})
