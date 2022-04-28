const Discord = require("discord.js")
//const { MongoClient } = require("mongodb")
//const MongoClient = require("mongodb").MongoClient
const mongoose = require('mongoose')
const client = new Discord.Client(
    {intents: ["GUILDS", "GUILD_MEMBERS", "GUILD_MESSAGES"]}
)

var amm = "Non sei admin."
var amm2 = "Non appartieni alla Land."
var att = "**Attenzione!**\nLa formula è"
var utente = "965706832758841364" //id ruolo utente land
var ruolo = "965547318009016330" //id ruolo admin
var canale = "965263672421277748" //id canale dove scrive il bot
var server = "965263672421277746" //id server
var pass = "cCgYya6YDwnGDH9h" //pass database

//client.login(process.env.token)
client.login("OTY1MjYyOTEwNTc2Mjk1OTM2.YlwpIw.3g4joeLLpp_ykDY08MXmBspROkU")

//var MongoClient = require("mongodb").MongoClient;
//var database;
var url = "mongodb+srv://botperdnd:"+pass+"@cluster0.kfhj7.mongodb.net/DnDBot?retryWrites=true&w=majority";
mongoose.connect(url);

client.on("ready", () => {
    console.log("ONLINE");
})

// crea collection
const tab1 = mongoose.model('Tab1',{
    id: String,
    nome: String,
    mo: Number,
    ms: Number,
    lvl: Number,
    tier: Number,
    date: Date
})

const tab2 = mongoose.model('Tab2',{
    id: String,
    type: String,
    date: Date
})

const tab3 = mongoose.model('Tab3',{
    id: String,
    nome: String,
    type: String,
    mo: Number,
    wght: Number,
    qnt: Number
})

client.on("messageCreate", async (message) => {
    if(message.author.bot == false && message.channel == canale) {

        //Dare MS ai giocatori  
        if (message.content.split(" ")[0] == "!givems"){
            if (message.member.roles.cache.has(ruolo)){

                // comando scritto
                var frase = " *'!givems [Tag_Player] [Milestones]'*."; 

                // dichiarazione valori
                var tag = message.content.split(" ")[1];
                var msv = parseInt(message.content.split(" ").slice(-1)[0]);

                if (tag.length > 1){
                    if(msv > 3 || msv == 0 || isNaN(msv) == true){

                        // errore valore
                        message.reply("Hai sbagliato le milestones."); 

                    } else {

                        var msi;
                        var lvli;
                        var camb;

                        tab1.findOne({id: tag}, async function (err, res){
                            if (res == null) {

                                // personaggio insesistente
                                message.reply("Il personaggio di " + tag +" non esiste.");
                            
                            } else {
                                
                                if (res.ms == 1) {
                                    b = ""
                                } else {
                                    b = "s"
                                }

                                if ((msv < 0) && ((res.ms + msv) < 0)) {

                                    message.reply("Nessun personaggio può avere meno di 0 milestone.\n"+
                                    "Il personaggio di " + tag + " ha " + res.ms + " milestone" + b + ".")
                                    
                                } else {
                                    // frase modificata se numero pari a 1 o meno
                                    // o se la ms viene tolta o aggiunta
                                    if (msv > 1 || msv < -1 || msv==0){
                                        var s = "s"
                                    } else if (msv > 0 || msv < 0){
                                        var s = ""
                                    }
                                    if (msv > 0){
                                        var a = "aggiunto"
                                    } else if (msv <= 0){
                                        var a = "tolto"
                                    }

                                    // risposta messaggio
                                    message.reply("Ho " + a + " " + Math.abs(msv) +
                                    " milestone" + s + " a " + tag + ".");

                                    msi = res.ms;
                                    lvli = res.lvl;
                                    tiei = res.tier;

                                    //variabili mostrate e assegnate
                                    msf = msi + msv;

                                    // determinazione livello
                                    lvlf = livello(msf);

                                    // determinazione tier
                                    tief = ttier(lvlf);

                                    // data sessione
                                    var today = new Date();
                                    var data = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();

                                    // aggiustare livello se cambiano ms                              
                                    await tab1.updateOne({id:tag}, {$set: {ms: msf, lvl: lvlf, date: data, tier: tief}}, function (err, res){
                                        
                                        if (res == null) {

                                            // personaggio insesistente
                                            console.log("pg inesistente")
                                        
                                        } else {

                                            if (lvlf != lvli){
                                                
                                                if (lvlf > lvli) {
                                                    camb = "salito"
                                                } else if (lvlf < lvli) {
                                                    camb = "sceso"
                                                }

                                                // frase cambiamento livello
                                                message.reply("Il personaggio di " + tag + 
                                                " è " + camb + " al livello " + lvlf + ".");

                                                if (tief != tiei){

                                                    if (tief > tiei) {
                                                        camb = "salito"
                                                    } else if (tief < tiei) {
                                                        camb = "sceso"
                                                    }

                                                    // frase cambiamento tier
                                                    message.reply("Il personaggio di " + tag + 
                                                    " è " + camb + " al tier " + tief + ".");
                                                }
                                            }
                                        }
                                    }).clone()
                                }
                            }
                        })
                    }
                } else {
                    // formula errata
                    message.reply(att+frase); 
                }
            } else {
                // messaggio non sei admin
                message.reply(amm); 
            }
        }


        // Dare denaro ai giocatori
        if (message.content.split(" ")[0] == "!givemo"){
            if (message.member.roles.cache.has(ruolo)){

                // comando scritto
                var frase = " *'!givemo [Tag_Player] [Denaro]'*."; 

                // dichiarazioni valori
                var tag = message.content.split(" ")[1];
                var num = Math.round(message.content.split(" ").slice(-1)[0] * 100) / 100; 
                
                if (tag.length>1){
                    if(num == 0 || isNaN(num) == true){

                        // errore valore
                        message.reply("Hai sbagliato il denaro."); 
                    } else {

                        // frase modificata se numero pari a 1 o meno
                        // o se viene tolto o aggiunto del denaro 
                        if (num > 1 || num < -1){
                            var s = "e"
                        } else if (num > 0 || num < 0){
                            var s = "a"
                        }
                        if (num > 0){
                            var a = "aggiunto"
                        } else if (num < 0){
                            var a = "tolto"
                        }
                        
                        tab1.findOne({id: tag}, async function (err, res){
                            if (!res){
                                message.reply("Il personaggio di " + res.id + " non esiste.")
                            } else {
                                tot = res.mo + num;
                                if (tot < 0){
                                    message.reply("Nessun personaggio può indebitarsi, correggi il valore.\n" +
                                    "Il denaro del personaggio di " + res.id + " ammonta a " + res.mo + " monet" +
                                    s + " d'oro.")
                                } else {
                                    await tab1.updateOne({id: tag}, {$set: {mo: tot}}, function (err, res){
                                        if (res == null) {
            
                                            // risposta
                                            message.reply("Il personaggio di " + tag + " non esiste.");
            
                                        } else {
            
                                            // risposta
                                            message.reply("Ho " + a + " " + Math.abs(num) +
                                            " monet" + s + " d'oro a " + tag + "."); 
            
                                        }
                                    }).clone()
                                }
                            }
                        })

                        
                        
                    }
                }
                else {

                    // formula errata
                    message.reply(att+frase); 
                }
            } else {

                // messaggio non sei admin
                message.reply(amm); 
            }
        }

        // mostra info pg
        if (message.content.split(" ")[0] == "!show"){
            if (message.member.roles.cache.has(ruolo)){
                // comando scritto
                var frase = " *'!show [Tag_Player]'*."; 
                var tag = message.content.split(" ").slice(-1)[0];

                if (tag.length > 1){
                    tab1.findOne({id: tag}, async function (err, res) {
                        if (!res) {
                            message.reply("Il personaggio di " + tag + " non esiste.");
                        } else {
                            message.reply("**INFO PERSONAGGIO**:\n\n" +
                            "**Tag**: " + tag + ",\n**Nome**: " + res.nome +
                            ",\n**Tier**: " + res.tier + ",\n**Livello**: " + res.lvl + 
                            ",\n**Denaro**: " + res.mo + ",\n**Milestones**: " + res.ms + 
                            ",\n**Ultima Sessione**: " + res.date.toDateString() + ".");
                        }
                    })
                } else {
                    message.reply(att+frase); // formula errata
                }
            } else {
                message.reply(amm); // messaggio non sei admin
            }
        }

        // mostra info di tutti i pg
        if (message.content.split(" ")[0] == "!showall"){
            if (message.member.roles.cache.has(ruolo)){
                // comando scritto
                var frase = " *'!showall'*.";
                mess = "**LISTA DEI PERSONAGGI**:\n";
                tab1.find().sort({date: "desc", ms : "desc", nome: "asc"}).exec(function (err, res){

                    if (!res){
                        message.channel.send("Qualcosa è andato storto.");
                    } else {
                        times = res.length;
                    }

                    function repeat(func, times) {
                        func();
                        times && --times && repeat(func, times);
                    }
                    
                    repeat(function () { mess = mess + "\n**Tag**: " + res[times-1].id + 
                    "\n**Nome**: " + res[times-1].nome + ",\n**Tier**: " + res[times-1].tier + 
                    ",\n**Livello**: " + res[times-1].lvl + ",\n**Denaro**: " + res[times-1].mo + 
                    ",\n**Milestones**: " + res[times-1].ms + ",\n**Ultima Sessione**: " + 
                    res[times-1].date.toDateString() + ".\n";
                    times = times-1 }, times);

                    message.channel.send(mess)
                })
            } else {
                message.reply(amm); // messaggio non sei admin
            }
        }

        // scambio monete tra PG da parte del master
        if (message.content.split(" ")[0] == "!trade"){
            if (message.member.roles.cache.has(ruolo)){
                // comando scritto
                var frase = " *'!trade [Tag_Player_Mittente] [Tag_Player_Destinatario] [Denaro]'*."; 
                
                // dichiarazioni valori
                var tag = message.content.split(" ")[1];
                var tag2 = message.content.split(" ")[2];
                var num = Math.abs(Math.round(message.content.split(" ").slice(-1)[0] * 100) / 100);
                var den;
                var den2;

                if (num == 1){
                    a = "a";
                }else {
                    a = "e";
                }

                if (tag.length > 1 && tag2.length > 1 ) {
                    if (num == 0 || isNaN(num) == true){
                        
                        // errore valore
                        message.reply("Hai sbagliato il denaro."); 
                    
                    } else if (tag == tag2) {
                        
                        // è inutile
                        message.reply("Non ha senso dare e togliere lo stesso quantitativo di denaro allo stesso personaggio.");

                    } else {

                        // togli soldi da chi scrive
                        tab1.find({id: {$in: [tag, tag2]}}, async function(err, res){
                            if (res.length == 2) {
                                if (res[0].id == tag){
                                    den = res[0].mo - num
                                    den2 = res[1].mo + num
                                    val = "a";
                                } else if (res[0].id == tag2) {
                                    den = res[1].mo - num
                                    den2 = res[0].mo + num
                                    val = "b";
                                }
                                if (den < 0 || den2 < 0) {
                                    if (val == "a") {
                                        message.reply("Nessun personaggio può indebitarsi, correggi il valore.\n"+
                                        "Il denaro del personaggio di " + tag + " ammonta a " + res[0].mo +
                                        " monet" + a + " d'oro.")
                                    } else if (val == "b") {
                                        message.reply("Nessun personaggio può indebitarsi, correggi il valore.\n"+
                                        "Il denaro del personaggio di " + tag + " ammonta a " + res[1].mo +
                                        " monet" + a + " d'oro.")
                                    }
                                } else {
                                    
                                    await tab1.updateOne({id: tag}, {$set: {mo: den}})
                                    await tab1.findOneAndUpdate({id: tag2}, {$set: {mo: den2}}, function (err, res){
                                        if (!res){
                                            message.reply("Il personaggio di "+ tag2 +" non esiste.");
                                        } else {
                                            message.reply("Il personaggio di "+ tag2 +" ha ricevuto "+ num +" monet"+ 
                                            a +" d'oro da parte del personaggio di "+ tag +".");
                                        }
                                    }).clone()
                                }
                            } else {
                                message.reply("Probabilmente uno dei due personaggi non esiste.");
                            }
                        })
                    }
                } else {
                    message.reply(att+frase); // formula errata
                }
            } else {
                message.reply(amm); // messaggio non sei admin
            }
        }


        // creare PG
        if (message.content.split(" ")[0] == "!creapg"){
            if (message.member.roles.cache.has(ruolo) || message.member.roles.cache.has(utente)){
               
                // comando scritto
                var frase = " *'!creapg [Tag_Player] [Nome_PG] [Denaro] [Livello]'*."; 
                
                // dichiarazioni valori
                var tag = message.content.split(" ")[1];
                var name = message.content.split(" ")[2];
                var num = Math.round(message.content.split(" ")[3] * 100) / 100;
                var level = message.content.split(" ").slice(-1)[0];

                // se il valore non è inserito, il pg è livello 1
                // se vuoi togliere sta cosa, basta togliere commento
                // nell'IF che sta qua sotto "|| isNaN(level) == true"
                if (isNaN(level) == true){ 
                    level = 1
                }
                
                if (tag.length > 1 && name.length > 1) {
                    if ((num <= 0 || isNaN(num) == true)||
                    (level < 1 /*|| isNaN(level) == true*/ || level > 20)){
                        
                        // errore valore
                        message.reply("Hai sbagliato il denaro o il livello."); 
                    
                    } else {

                        // controlla se il pg è nuovo
                        tab1.findOne({id:tag}, function (err, res) {
                            if (res == null) {
                                message.reply(tag+" ha creato un nuovo personaggio.");
                            } else {
                                message.reply("Il nuovo personaggio di " + tag + 
                                " ha sovrascritto '" + res.nome + "'.");
                            }
                        })

                        // valore delle milestones
                        var msv = 0;
                        msv = milestones(level);
                        tie = ttier(level);
                        var today = new Date();
                        var data = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
                                                
                        // plurale o singolare
                        await tab1.findOneAndUpdate({id: tag}, {id: tag, nome: name, mo: num, ms: msv, lvl: level, tier: tie, date: data}, {upsert: true})
                        if (num == 1){
                            var a = "a"
                            var b = "e"
                        } else {
                            var a = "e"
                            var b = "i"
                        }
                        if (msv == 1){
                            var s = ""
                        } else {
                            var s = "s"
                        }

                        // risposta
                        message.reply("Il personaggio di " + tag + " si chiama '" + name 
                        + "', è di "+ level +"° livello con "+ msv +" milestone"+ s
                        + " e ha " + num + " monet" + a + " d'oro inizial" + b + "."); 
                    }
                } else {
                    message.reply(att+frase); // formula errata
                }
            } else {
                message.reply(amm2); // messaggio non sei nella land
            }
        }


        // dai denaro
        if (message.content.split(" ")[0] == "!dai"){
            if (message.member.roles.cache.has(ruolo) || message.member.roles.cache.has(utente)){
                // comando scritto
                var frase = " *'!dai [Tag_Player_Beneficiario] [Denaro]'*."; 
                
                // dichiarazioni valori
                var tag2 = "<@"+message.author.id+">";
                var tag = message.content.split(" ")[1];
                var num = -Math.abs(Math.round(message.content.split(" ").slice(-1)[0] * 100) / 100);

                if (tag.length > 1) {
                    if (num == 0 || isNaN(num) == true){
                        
                        // errore valore
                        message.reply("Hai sbagliato il denaro."); 
                    
                    } else if (tag == tag2) {
                        
                        // è inutile
                        message.reply("Perché vuoi dare i **tuoi** soldi a ...*te stesso*?");

                    } else {

                        tab1.findOne({id: tag2}, async function (err, res){
                            
                            // singolare o plurale
                            if (Math.abs(num) == 1){
                                var a = "a"
                            } else {
                                var a = "e"
                            }
                            
                            if (!res) {
                                message.reply("Il personaggio di " + tag2 + " non esiste.");
                            } else if (res.mo < Math.abs(num)) {
                                message.reply("Nessun personaggio può indebitarsi.\n"+
                                "Attualmente disponi di " + res.mo + " monet" + a + " d'oro.");
                            } else {
                                await tab1.findOne({id: tag}, async function (err, res){
                                    if (!res) {
                                        message.reply("Il personaggio di " + tag + " non esiste.");
                                    } else {
                                        // togli soldi da chi scrive
                                        await tab1.findOneAndUpdate({id: tag2}, {$inc:{mo: num}})
                                        num = -num;
                                                                
                                        // plurale o singolare
                                        await tab1.findOneAndUpdate({id: tag}, {$inc:{mo: num}})

                                        // risposta
                                        message.reply("Il personaggio di " + tag + " ha ricevuto " +
                                        num + " monet" + a + " d'oro dal personaggio di " + tag2 + ".");
                                    }
                                }).clone()
                            }
                        })
                    }
                } else {
                    message.reply(att+frase); // formula errata
                }
            } else {
                message.reply(amm2); // messaggio non sei nella land
            }
        }


        // mostra info pg
        if (message.content.split(" ")[0] == "!infopg"){
            if (message.member.roles.cache.has(ruolo) || message.member.roles.cache.has(utente)){
                // comando scritto
                var frase = " *'!infopg'*."; 
                var tag = "<@"+message.author.id+">";

                tab1.findOne({id: tag}, async function (err, res) {
                    if (!res) {
                        message.reply("Il personaggio di " + tag + " non esiste.");
                    } else {
                        message.reply("**INFO PERSONAGGIO**:\n\n" +
                            "**Tag**: " + tag + ",\n**Nome**: " + res.nome +
                            ",\n**Tier**: " + res.tier + ",\n**Livello**: " + res.lvl + 
                            ",\n**Denaro**: " + res.mo + ",\n**Milestones**: " + res.ms + 
                            ",\n**Ultima Sessione**: " + res.date.toDateString() + ".");
                    }
                })

            } else {
                message.reply(amm2); // messaggio non sei nella land
            }
        }


        // Downtime
        if (message.content.split(" ")[0] == "!downtime"){
            if (message.member.roles.cache.has(ruolo) || message.member.roles.cache.has(utente)){
                // comando scritto
                var frase = " *'!downtime [Tipo_di_Downtime] [Giorni]'*.\n"
                + "Usa un'unica parola per il tipo di Downtime.";
                
                // dichiarazioni valori
                var tag = "<@"+message.author.id+">";
                var tipo = message.content.split(" ")[1];
                var num = Math.abs(Math.round(message.content.split(" ")[2]));
                giorno = new Date(oggi());

                if (message.content.split(" ").length > 3) {
                    message.reply(att+frase);
                } else {
                    if (tipo == "" || tipo == null) {
                        tab2.findOne({id: tag}, async function (err, res){
                            if (!res){
                                message.reply("Il personaggio di " + tag + " non ha un downtime attivo.")
                            } else {
                                if (res.date > giorno) {
                                    message.reply("Il downtime di " + tag + " non è ancora terminato.")
                                } else {
                                    message.reply("Il downtime di " + res.type + " effettuato da " + tag + 
                                    " è terminato.\nContattare un <@&" + ruolo + "> per ottenere i risultati.")
                                    await tab2.deleteOne({id: tag})
                                }
                            }
                        })
                    } else {
                        if (tipo.length > 1) {
                            if (num == null || num <= 0 || num == "" || isNaN(num)) {
                                // valore predefinito 7 giorni
                                num = 7;
                            }
                            data = addDays(giorno, num)
                            
                            tab2.findOne({id: tag}, function (err, res){
                                if (!res){
                                    if (num == 1) {
                                        a = "o"
                                    } else {
                                        a = "i"
                                    }
                                    const dt = new tab2({id: tag, type: tipo, date: data})
                                    dt.save()
                                    message.reply("Il downtime di " + tipo + " che verrà effettuato da " + tag +
                                    ", terminerà tra " + num + " giorn" + a + ".")
                                } else {
                                    if (giorno < res.date){
                                        message.reply("Il personaggio di " + tag + " non può avviare un secondo downtime " +
                                        "senza aver terminato quello in corso.\nIl downtime attuale termina il giorno: " 
                                        + res.date.toDateString() + ".")
                                    } else {
                                        message.reply("Devi prima concludere il downtime avviato.\n||Scrivi '!downtime' "+ 
                                        "così puoi riscattare il downtime concluso.||")
                                    }
                                }
                            })
                        }
                    }
                }
            } else {
                message.reply(amm2); // messaggio non sei nella land
            }
        }


        // Mercato 
        if (message.content.split(" ")[0] == "!mercato"){
            if (message.member.roles.cache.has(ruolo) || message.member.roles.cache.has(utente)){
                // comando scritto
                var frase = " *'!mercato [Tipo_Oggetto]'*.\n"+
                "All'interno del [Tipo_Oggetto] puoi scrivere una categoria tra queste:\n"+
                "'Armi' e anche 'Mischia', 'Distanza', 'Semplici', 'Guerra'\n"+
                "Proprietà come 'Lancio', 'Leggera', 'Pesante', 'Accurata', 'Due Mani', " +
                "'Gittata', 'Munizioni', 'Portata', 'Ricarica', 'Speciale', 'Versatile'.\n"+
                "'Armature' e anche 'Leggere', 'Medie', 'Pesanti', 'Scudi'\n"+
                "Proprietà come 'Svantaggio', 'Forza'\n"+
                ""
                //appunta tutti i tipi e proprietà
                //usa il match per capire se stanno dentro le proprietà
                //stila una lista di oggetti in funzione delle proprietà
                //poi fai compra e vendi come comandi
                //dove scrivono comando più oggetto
                //che per trovarlo basterà sempre usare il find + match(?)
                //aggiungici pure la cosa che se lo hanno acquistato il 
                //prezzo aumenta al doppio del numero negativo
                //-1 => +2% => 1.02
                //prezzo diminuisce al pari del numero positivo
                //1 => -1% => 1.01
                //Nel caso cambiamo la proporzione
                //O eventualmente aggiungiamo una scadenza entro la quale 
                //Viene rifornito il mercato o vengono rivendute le cose in eccesso
                //Comando vendita invece si ottiene la metà del valore dell'oggetto
                //maggiorato o diminuito in base al mercato in quel momento e dopo
                //la cosa aggiunta/tolta, il mercato varia il numeretto sull'oggetto

                // dichiarazioni valori
                sp = message.content.split(" ").length.toString();
                mess = message.content.replace("!mercato", "").replace(/\s+/g, '').toLowerCase();
                if (sp == 1)
                    message.reply(att+frase)

            } else {
                message.reply(amm2); // messaggio non sei nella land
            }
        }


        // help differenziato per ruolo admin e utente
        if (message.content.split(" ")[0] == "!help") {

            // help admin
            if (message.member.roles.cache.has(ruolo)) {
                message.reply("**COMANDI PER MASTER LAND**\n\n"
                +"**!givems**\n"+
                "*Il comando è '!givems [Tag_Player] [Milestones]'*\ne permette di assegnare le milestones al personaggio.\n\n"
                +"**!givemo**\n"+
                "*Il comando è '!givemo [Tag_Player] [Denaro]'*\ne permette di assegnare il denaro al personaggio.\n\n"
                +"**!show**\n"+
                "*Il comando è '!show [Tag_Player]'*\ne mostra i dati del personaggio.\n\n"
                +"**!showall**\n"+
                "*Il comando è '!showall'*\ne mostra i dati di tutti i personaggi.\n\n"
                +"**!trade**\n"+
                "*Il comando è '!trade [Tag_Player_Mittente] [Tag_Player_Destinatario] [Denaro]'*\n"+
                "e permette di far scambiare denaro dal primo personaggio al secondo.\n\n"
                );
            }

            // help giocatori
            if (message.member.roles.cache.has(utente)){
                message.reply("**COMANDI PER GIOCATORI LAND**\n\n"
                +"**!creapg**\n"+
                "*Il comando è '!creapg [Tag_Player] [Nome_PG] [Denaro] [Livello]'*\n"+
                "e permette di creare il personaggio inserendo nome, denaro in monete d'oro e livello.\n\n"
                +"**!dai**\n"+
                "*Il comando è '!dai [Tag_Player_Beneficiario] [Denaro]'*\n"+
                "e permette ad un giocatore di dare un ammontare di denaro al personaggio taggato.\n\n"
                +"**!infopg**\n"+
                "*Il comando è '!infopg'*\ne permette di visualizzare i dati del proprio personaggio.\n\n"
                +"**!downtime**\n"+
                "*Il comando è '!downtime [Tipo_di_Downtime] [Giorni]'*.\n"
                +"Usa un'unica parola per il tipo di Downtime.\n"
                +"Scrivendo solo '!downtime' puoi riscattare e/o controllare il DT concluso o attivo.\n"
                +"Ti permette di avviare un downtime di un tipo qualsiasi per la durata prestabilita (in giorni).\n"
                );
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


// Nuovo utente land

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
    && newMember.roles.cache.has(utente) 
    && !oldMember.roles.cache.has(utente)) {
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
        txtChannel.send("<@&" + utente + ">\nDate il benvenuto a <@" +
        newMember.id + "> tra i nuovi giocatori della land!");
    }
})

function livello(mss){
    var lvls = 0;
    if (mss < 2) {
        lvls = 1
    } else if (mss < 6) {
        lvls = 2
    } else if (mss < 12) {
        lvls = 3
    } else if (mss < 20) {
        lvls = 4
    } else if (mss < 30) {
        lvls = 5
    } else if (mss < 40) {
        lvls = 6
    } else if (mss < 50) {
        lvls = 7
    } else if (mss < 60) {
        lvls = 8
    } else if (mss < 72) {
        lvls = 9
    } else if (mss < 84) {
        lvls = 10
    } else if (mss < 96) {
        lvls = 11
    } else if (mss < 111) {
        lvls = 12
    } else if (mss < 126) {
        lvls = 13
    } else if (mss < 141) {
        lvls = 14
    } else if (mss < 156) {
        lvls = 15
    } else if (mss < 171) {
        lvls = 16
    } else if (mss < 186) {
        lvls = 17
    } else if (mss < 206) {
        lvls = 18
    } else if (mss < 226) {
        lvls = 19
    } else if (mss >= 226) {
        lvls = 20
    }
    return lvls
}

function milestones(level){
    var msv = 0;
    if (level <= 6) {
        msv = (level)*(level-1)
    } else if (level <= 9) {
        msv = (level-3)*10
    } else if (level <= 12) {
        msv = ((level-3)*10)+((level-9)*2)
    } else if (level <= 18) {
        msv = ((level-3)*10)+((level-9)*2)+((level-12)*3)
    } else if (level <= 20) {
        msv = ((level-3)*10)+((level-9)*2)+((level-12)*3)+((level-18)*5)
    }
    return msv
}

function ttier(level){
    var tier = 1;
    tier = Math.ceil(level/4);
    return tier;
}

function addDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

function oggi() {
    var today = new Date();
    var data = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    return data;
}