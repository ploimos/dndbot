require("dotenv").config();
const Discord = require("discord.js")
const client = new Discord.Client(
    {
        intents: ["GUILDS", "GUILD_MEMBERS", "GUILD_MESSAGES", "DIRECT_MESSAGES"],
        partials: ["CHANNEL", "MESSAGE"]
    }
)
const mongoose = require('mongoose')

let symb = ".";
let mess_err = "Qualcosa è andato storto.\n" +
    "Controllare la riga: " + trovaNumCod() + ".";
let amm = "Non sei admin.";
let amm2 = "Non appartieni alla Land.";
let laf = "Il comando è ";
let att = "**Attenzione!**\n";
//---
let utente = "965706832758841364" //id ruolo utente land
let ruolo = "965547318009016330" //id ruolo admin
let canalemarket = "1031752963821150228" //id canale mercato
let canaledt = "973174174501728276" //id canale downtime
let canalegilda = "1004386326067560551" //id canale gilda
let canalebot = "965263672421277748" //id canale dove scrive il bot
let canalebot2 = "965263672421277748" //id canale dove scrive il bot
let canaleBenv = "965263672421277748" //id canale di benvenuto
//---
// let utente = "996969152797495306" //id ruolo utente land
// let ruolo = "1025229682603462727" //id ruolo admin
// let canalemarket = "1000814075246280765" //id canale mercato
// let canaledt = "1021309866649854052" //id canale downtime
// let canalegilda = "1021311298719469578" //id canale gilda
// let canalebot = "1025451804600848454" //id canale dove scrive il bot
// let canaleBenv = "996968228704239706" //id canale di benvenuto
// let canalebot2 = "1021309640975335434" //id canale dove scrive il bot
//---
const mainChan = [canaleBenv, canalebot, canalebot2, canaledt, canalemarket, canalegilda];
let lista = [];
let listaCanali = [];
let serverbannati = [];
let marketchan = [];
let downtimechan = [];
let guildchan = [];
let listaRuoli = [];
let utenti = [];
let moderatori = [];

client.login(process.env.TOKEN)

let url = "mongodb+srv://botperdnd:" + process.env.PSW + "@cluster0.kfhj7.mongodb.net/DnDBot?retryWrites=true&w=majority";
mongoose.connect(url);

/////////////////////
// crea collection //
/////////////////////

// riassunto pg
const tab1 = mongoose.model('Tab1', {
    id: String,
    nome: String,
    mo: Number,
    ms: Number,
    msw: Number,
    lvl: Number,
    tier: Number,
    pdt: Number,
    pdtt: Number,
    date: Date,
    index: String
})

// DT
const tab2 = mongoose.model('Tab2', {
    id: String,
    type: String,
    date: Date
})

// mercato
const tab3 = mongoose.model('Tab3', {
    id: String,
    name: String,
    type: String,
    mo: Number,
})

// inventario
const tab4 = mongoose.model('Tab4', {
    id_pl: String,
    id_obj: String,
    name: String,
    mo: Number,
    num: Number
})

// canali DT, Mercato riferiti al personaggio
const tab5 = mongoose.model('Tab5', {
    id_pl: String,
    name_pl: String,
    id_chan: String,
    type: String
})

// gilde
const tab6 = mongoose.model('Tab6', {
    id_guild: String,
    name_guild: String,
    id_pl: String,
    n_m: Number,
    n_member: Number,
    fame: Number,
    inf: Number,
    status: Number,
    gold: Number,
    goldtot: Number,
    rankup_gold: Number,
    level: Number,
    rendita: Number,
    index: String
})

// membri gilda
const tab7 = mongoose.model('Tab7', {
    id_g: String,
    id_p: String,
    capo: Boolean
})

// entità
const tab8 = mongoose.model('Tab8', {
    id: String,
    type: String,
    server: String,
    index: String
})

// start server
client.on("ready", () => {
    console.log("Sono operativo.");
})

// Quando scrivi un messaggio
client.on("messageCreate", async (message) => {
    // appena scrivi un messaggio, aggiorna i canali utilizzabili
    canali()
        .then(ris =>
            lista = ris)
        .then(async () => {
            // lista seleziona array e decide canali
            let flag;
            for (j = 0; j < lista.length; j++) {
                flag = lista[j].length;
                if (flag == 0) {
                    flag = 1;
                }
                for (i = 0; i < flag; i++) {
                    if (j == 0) {
                        serverbannati[i] = lista[j][i];
                    } else if (j == 1) {
                        marketchan[i] = lista[j][i];
                    } else if (j == 2) {
                        downtimechan[i] = lista[j][i];
                    } else if (j == 3) {
                        guildchan[i] = lista[j][i];
                    }
                }
            }
            listaCanali = [marketchan, downtimechan, guildchan];
            //listaRuoli = [utenti, moderatori]

            // controlla immediatamente se il server è bannato
            if (!message.author.bot && message.content[0] == symb) {

                // controlla che il server non sia stato bannato
                if (!serverbannati.includes(message.guild.id)) {

                    // variabile globale messaggio senza spazi extra
                    let msg = message.content.replace(/\s\s+/g, ' ');

                    // variabile globale per indicare il server id
                    let srv = message.guild.id;

                    // nascondi la funzione uguale a questa
                    if (msg.split(" ")[0].toLowerCase() == symb + "test") {
                        message.reply("Sto funzionando...")
                    }

                    // controlla se il canale è all'interno del database
                    if ((mainChan.includes(message.channel.id) == true ||
                        include(listaCanali, message.channel.id) /*|| message.channel.type == "DM"*/)) {

                        //Dare MS ai giocatori
                        c_givems = symb + "givems";
                        f_givems = "*'" + c_givems + " [Tag_Player] [Milestones]'*";
                        mswMax = 6; // massimo valore totale di ms per settimana
                        msxs = 3; // massimo valore di ms per sessione
                        if (msg.split(" ")[0].toLowerCase() == c_givems) {
                            try {
                                if (message.member.roles.cache.has(ruolo)) {
                                    // comando scritto
                                    let frase = laf + f_givems + ".";
                                    // dichiarazione valori
                                    let tag = msg.split(" ")[1];
                                    let msv = Math.floor(parseInt(msg.split(" ")[2]));
                                    // controlla comando e formattazione
                                    if (msg.split(" ").length == 1) {
                                        // formula errata
                                        message.reply(att + frase);
                                    } else if (tag.length > 1 && msg.split(" ").length == 3) {
                                        if (Math.abs(msv) > msxs || msv == 0 || isNaN(msv) == true) {
                                            // errore valore
                                            message.reply("Hai sbagliato le milestones.");
                                        } else {
                                            // dichiarazione
                                            let msi;
                                            let lvli;
                                            let camb;
                                            tab8.findOne({ id: tag }, async function (err, res) {
                                                if (!res) {
                                                    // personaggio insesistente
                                                    message.reply("Il personaggio di " + tag + " non esiste.");
                                                } else {
                                                    if (res.type == "PG") {
                                                        if (res.ms == 1) {
                                                            b = ""
                                                        } else {
                                                            b = "s"
                                                        }
                                                        if ((msv < 0) && ((res.ms + msv) < 0)) {
                                                            message.reply("Nessun personaggio può avere meno di 0 milestone.\n" +
                                                                "Il personaggio di " + tag + " ha " + res.ms + " milestone" + b + ".")
                                                        } else {
                                                            // frase modificata se numero pari a 1 o meno
                                                            // o se la ms viene tolta o aggiunta
                                                            if (msv > 1 || msv < -1 || msv == 0) {
                                                                s = "s"
                                                            } else if (msv > 0 || msv < 0) {
                                                                s = ""
                                                            }
                                                            if (msv > 0) {
                                                                a = "aggiunto"
                                                            } else if (msv <= 0) {
                                                                a = "tolto"
                                                            }
                                                            // aggiustare livello se cambiano ms                              
                                                            tab1.findOne({ id: tag }, async function (err, res) {
                                                                if (!res) {
                                                                    // personaggio insesistente
                                                                    message.reply("Il personaggio di " + tag + " non esiste.");
                                                                } else {
                                                                    // dichiarazione variabili
                                                                    let today = new Date();
                                                                    let date = res.date;
                                                                    startDate = new Date(date.getFullYear(), 0, 1);
                                                                    var days = Math.floor((today - startDate) / (24 * 60 * 60 * 1000));
                                                                    var dayss = Math.floor((date - startDate) / (24 * 60 * 60 * 1000));
                                                                    var weektd = Math.ceil(days / 7);
                                                                    var weekdt = Math.ceil(dayss / 7);
                                                                    // data sessione
                                                                    let data = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
                                                                    // dichiarazione variabili
                                                                    msi = res.ms;
                                                                    lvli = res.lvl;
                                                                    tiei = res.tier;
                                                                    if (weekdt < weektd) {
                                                                        if (msv < 0) {
                                                                            msw = 0;
                                                                            msf = msi + msv;
                                                                        } else {
                                                                            if (res.msw + msv > mswMax) {
                                                                                msw = mswMax;
                                                                                msf = msi + mswMax - res.msw;
                                                                            } else {
                                                                                msw = msv;
                                                                                msf = msi + msv;
                                                                            }
                                                                        }
                                                                    } else {
                                                                        if (msv < 0 && res.msw + msv < 0) {
                                                                            msw = 0;
                                                                            msf = msi + msv;
                                                                        } else {
                                                                            if (res.msw + msv > mswMax) {
                                                                                msw = mswMax;
                                                                                msf = msi + mswMax - res.msw;
                                                                            } else {
                                                                                msw = res.msw + msv;
                                                                                msf = msi + msv;
                                                                            }
                                                                        }
                                                                    }
                                                                    if (res.msw >= mswMax && msw >= mswMax) {
                                                                        message.reply("Hai già ottenuto il massimo delle milestones settimanali (" + mswMax + " MS).\n" +
                                                                            "Non otterrai milestones in questa sessione, ma spero che ti sia divertito ugualmente.");
                                                                    } else {
                                                                        diff = mswMax - res.msw;
                                                                        // restituire gli MS giusti
                                                                        if (res.msw < mswMax && msv + res.msw > mswMax) {
                                                                            message.reply("Hai appena superato il massimo delle milestones settimanali (" + mswMax + " MS).\n" +
                                                                                "Oggi otterrai " + diff + " MS piuttosto che " + msv + " MS.\n" +
                                                                                "Le prossime missioni che svolgerai non ti daranno milestones.");
                                                                        } else if (res.msw < mswMax && msv + res.msw == mswMax) {
                                                                            message.reply("Hai appena raggiunto il massimo delle milestones settimanali (" + mswMax + " MS).\n" +
                                                                                "Le prossime missioni che svolgerai non ti daranno milestones.");
                                                                        } else {
                                                                            // risposta messaggio
                                                                            message.reply("Ho " + a + " " + Math.abs(msv) +
                                                                                " milestone" + s + " a " + tag + ".");
                                                                        }
                                                                    }
                                                                    // determinazione livello
                                                                    lvlf = livello(msf);
                                                                    // determinazione tier
                                                                    tief = ttier(lvlf);
                                                                    await tab1.updateOne({ id: tag }, { ms: msf, msw: msw, lvl: lvlf, date: data, tier: tief })
                                                                    if (lvlf != lvli) {
                                                                        if (lvlf > lvli) {
                                                                            camb = "salito"
                                                                        } else if (lvlf < lvli) {
                                                                            camb = "sceso"
                                                                        }
                                                                        // frase cambiamento livello
                                                                        message.reply("Il personaggio di " + tag +
                                                                            " è " + camb + " al livello " + lvlf + ".");
                                                                        if (tief != tiei) {
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
                                                            })
                                                        }
                                                    } else {
                                                        message.reply("Il tag utilizzato non appartiene ad un personaggio.")
                                                    }
                                                }
                                            })
                                        }
                                    } else {
                                        // formula errata
                                        message.reply(mess_err);
                                    }
                                } else {
                                    // messaggio non sei admin
                                    message.reply(amm);
                                }
                            } catch (err) {
                                message.reply(mess_err);
                            }
                        }

                        // Dare denaro player/gilda
                        c_givemo = symb + "givemo";
                        f_givemo = "*'" + c_givemo + " [Tag] [Denaro]'*";
                        if (msg.split(" ")[0].toLowerCase() == c_givemo) {
                            try {
                                if (message.member.roles.cache.has(ruolo)) {
                                    // comando scritto
                                    let frase = laf + f_givemo + ".";
                                    // dichiarazioni valori
                                    let tag = msg.split(" ")[1];
                                    let num = Math.round(msg.split(" ")[2] * 100) / 100;
                                    if (msg.split(" ").length == 1) {
                                        // formula errata
                                        message.reply(att + frase);
                                    } else if (tag.length > 1 && message.length == 3) {
                                        if (num == 0 || isNaN(num) == true) {
                                            // errore valore
                                            message.reply("Hai sbagliato il denaro.");
                                        } else {
                                            // frase modificata se numero pari a 1 o meno
                                            // o se viene tolto o aggiunto del denaro 
                                            if (num == 1 || num == -1) {
                                                s = "a"
                                            } else {
                                                s = "e"
                                            }
                                            if (num > 0) {
                                                a = "aggiunto"
                                            } else if (num < 0) {
                                                a = "sottratto"
                                            }
                                            // riconoscere il tipo di entità e modificare il denaro di conseguenza
                                            tab8.findOne({ id: tag }, async function (err, res) {
                                                if (!res) {
                                                    message.reply("Il personaggio di " + res.id + " non esiste.")
                                                } else {
                                                    if (res.type == "PG") {
                                                        tab1.findOne({ id: tag }, async function (err, res) {
                                                            tot = res.mo + num;
                                                            if (tot < 0) {
                                                                message.reply("Nessun personaggio può indebitarsi, correggi il valore.\n" +
                                                                    "Il denaro del personaggio di " + res.id + " ammonta a " + res.mo + " monet" +
                                                                    s + " d'oro.")
                                                            } else {
                                                                await tab1.updateOne({ id: tag }, { $set: { mo: tot } })
                                                                message.reply("Ho " + a + " " + Math.abs(num) +
                                                                    " monet" + s + " d'oro a " + tag + ".");
                                                            }
                                                        })
                                                    } else if (res.type == "GILDA") {
                                                        tab6.findOne({ id_guild: tag }, async function (err, res) {
                                                            tot = res.gold + num;
                                                            if (res.gold == 1) {
                                                                ss = "a"
                                                            } else {
                                                                ss = "e"
                                                            }
                                                            if (tot < 0) {
                                                                message.reply("Nessuna gilda può indebitarsi, correggi il valore.\n" +
                                                                    "Il denaro della gilda '" + res.name_guild + "' ammonta a " +
                                                                    res.mo + " monet" + ss + " d'oro.")
                                                            } else if (tot > res.goldtot) {
                                                                message.reply("La gilda '" + res.name_guild + "' possiede " +
                                                                    res.gold + " monet" + ss + " d'oro e non può possederne più di " +
                                                                    res.goldtot + ".")
                                                            } else {
                                                                await tab6.updateOne({ id_guild: tag }, { $set: { gold: tot } })
                                                                message.reply("Ho " + a + " " + Math.abs(num) +
                                                                    " monet" + ss + " d'oro alla gilda '" + res.name_guild + "'.");
                                                            }
                                                        })
                                                    } else {
                                                        message.reply("Il tag utilizzato non è idoneo.")
                                                    }
                                                }
                                            })
                                        }
                                    } else {
                                        // formula errata
                                        message.reply(mess_err);
                                    }
                                } else {
                                    // messaggio non sei admin
                                    message.reply(amm);
                                }
                            } catch (err) {
                                message.reply(mess_err);
                            }
                        }

                        // Settare Milestones ai giocatori
                        c_setms = symb + "setms";
                        f_setms = "*'" + c_setms + " [Tag_Player] [Milestones]'*";
                        if (msg.split(" ")[0].toLowerCase() == c_setms) {
                            try {
                                if (message.member.roles.cache.has(ruolo)) {
                                    // comando scritto
                                    let frase = laf + f_setms + ".";
                                    // dichiarazioni valori
                                    let tag = msg.split(" ")[1];
                                    let num = Math.floor(Math.abs(parseInt(msg.split(" ")[2])));
                                    // condizioni generali
                                    if (msg.split(" ").length == 1) {
                                        // formula errata
                                        message.reply(att + frase);
                                    } else if (tag.length > 1 && msg.split(" ").length == 3) {
                                        if (isNaN(num) == true) {
                                            // errore valore
                                            message.reply("Hai sbagliato le milestones.");
                                        } else {
                                            // determinazione livello
                                            liv = livello(num);
                                            // determinazione tier
                                            tie = ttier(liv);
                                            tab8.findOne({ id: tag }, function (err, res) {
                                                if (!res) {
                                                    // personaggio insesistente
                                                    message.reply("Non esistono entità appartenenti a " + tag + ".");
                                                } else {
                                                    if (res.type == "PG") {
                                                        tab1.findOneAndUpdate({ id: tag }, { $set: { ms: num, lvl: liv, tier: tie } }, async function (err, res) {
                                                            if (!res) {
                                                                // personaggio insesistente
                                                                message.reply("Il personaggio di " + tag + " non esiste.");
                                                            } else {
                                                                if (num == 1) {
                                                                    a = "d"
                                                                    b = ""
                                                                } else {
                                                                    a = ""
                                                                    b = "s"
                                                                }
                                                                // risposta messaggio
                                                                message.reply("Il personaggio di "
                                                                    + tag + " ha " + num + " milestone" + b +
                                                                    " è al " + liv + "° livello ed " +
                                                                    "al tier " + tie + ".");
                                                            }
                                                        })
                                                    } else {
                                                        message.reply("L'entità che hai taggato non è un personaggio.");
                                                    }
                                                }
                                            })
                                        }
                                    } else {
                                        // formula errata
                                        message.reply(mess_err);
                                    }
                                } else {
                                    // messaggio non sei admin
                                    message.reply(amm);
                                }
                            } catch (err) {
                                message.reply(mess_err);
                            }
                        }

                        // set money player/gilda
                        c_setmo = symb + "setmo";
                        f_setmo = "*'" + c_setmo + " [Tag] [Denaro]'*";
                        if (msg.split(" ")[0].toLowerCase() == c_setmo) {
                            try {
                                if (message.member.roles.cache.has(ruolo)) {
                                    // comando scritto
                                    let frase = laf + f_setmo + ".";
                                    // dichiarazioni valori
                                    let tag = msg.split(" ")[1];
                                    let num = Math.abs(parseInt(Math.round(msg.split(" ")[2] * 100) / 100));
                                    let val;
                                    let tagg;
                                    if (msg.split(" ").length == 1) {
                                        // formula errata
                                        message.reply(att + frase);
                                    } else if (tag.length > 1 && msg.split(" ").length == 3) {
                                        if (isNaN(num) == true) {
                                            // errore valore
                                            message.reply("Non hai inserito un numero per il denaro.");
                                        } else {
                                            num = Math.floor(num * 100) / 100;
                                            if (num == 1) {
                                                a = "a";
                                            } else {
                                                a = "e";
                                            }
                                            tab8.findOne({ id: tag }, async function (err, res) {
                                                if (!res) {
                                                    // entità insesistente
                                                    message.reply(tag + " non esiste.");
                                                } else {
                                                    if (res.type == "PG") {
                                                        await tab1.findOneAndUpdate({ id: tag }, { mo: num });
                                                        message.reply("Il personaggio di " + tag + " ora possiede " + num +
                                                            " monet" + a + " d'oro.");
                                                    } else if (res.type == "GILDA") {
                                                        await tab6.findOne({ id: tag }, async function (err, res2) {
                                                            if (!res2) {
                                                                // entità insesistente
                                                                message.reply(tag + " non esiste.");
                                                            } else {
                                                                tagg = res2.name_guild;
                                                                if (res2.goldtot < num) {
                                                                    val = res2.goldtot;
                                                                    message.reply("La gilda **" + tagg + "** non può possiedere " +
                                                                        "più di " + res2.goldtot + " monete d'oro.\nSono state assegnate " +
                                                                        val + " monete d'oro.");
                                                                } else {
                                                                    val = num;
                                                                    message.reply("La gilda **" + tagg + "** ora possiede " + num +
                                                                        " monet" + a + " d'oro.");
                                                                }
                                                                await tab6.updateOne({ id_guild: tag }, { gold: val });
                                                            }
                                                        }).clone();
                                                    } else {
                                                        message.reply("Il tag inserito non è stato inserito nel database.");
                                                    }
                                                }
                                            })
                                        }
                                    } else {
                                        // formula errata
                                        message.reply(mess_err);
                                    }
                                } else {
                                    // messaggio non sei admin
                                    message.reply(amm);
                                }
                            } catch (err) {
                                message.reply(mess_err);
                            }
                        }

                        // mostra info pg
                        c_show = symb + "mostrascheda";
                        f_show = "*'" + c_show + " [Tag]'*";
                        f_infopg = "*'" + c_show + "'*";
                        if (msg.split(" ")[0].toLowerCase() == c_show) {
                            try {
                                if (message.member.roles.cache.has(ruolo) ||
                                    message.member.roles.cache.has(utente)) {
                                    let tag;
                                    if (msg.split(" ").length == 1 && message.member.roles.cache.has(utente)) {
                                        // comando scritto
                                        let frase = laf + f_infopg + ".";
                                        tag = "<@" + message.author.id + ">";
                                        if (msg.split(" ").length > 1) {
                                            // formula errata
                                            message.reply(att + frase);
                                        }
                                    } else if (msg.split(" ").length == 2 && message.member.roles.cache.has(ruolo)) {
                                        // comando scritto
                                        let frase = laf + f_show + ".";
                                        tag = msg.split(" ")[1];
                                        if (msg.split(" ").length == 1) {
                                            // formula errata
                                            message.reply(att + frase);
                                        }
                                    } else {
                                        tag = "<@" + message.author.id + ">";
                                    }
                                    // controlla che il tag possa essere realistico
                                    if (tag.length > 1) {
                                        tab1.findOne({ id: tag }, async function (err, res) {
                                            if (!res) {
                                                message.reply("Il personaggio di " + tag + " non esiste.");
                                            } else {
                                                message.author.send("**INFO PERSONAGGIO**:\n" +
                                                    "**Tag**: " + tag +
                                                    ",\n**Nome**: " + res.nome +
                                                    ",\n**Tier**: " + res.tier +
                                                    ",\n**Livello**: " + res.lvl +
                                                    ",\n**Denaro**: " + res.mo +
                                                    " MO,\n**Milestones**: " + res.ms +
                                                    " (" + res.msw + "/" + mswMax + ")" +
                                                    ",\n**Punti DT**: " + res.pdt + "/" + res.pdtt +
                                                    ",\n**Ultima Sessione**: " + trad(res.date.toDateString()) + ".");
                                            }
                                        })
                                    } else {
                                        // formula errata
                                        message.reply(att + frase);
                                    }
                                } else {
                                    // messaggio non sei della land
                                    message.reply(amm2);
                                }
                            } catch (err) {
                                message.reply(mess_err);
                            }
                        }

                        // mostra info di tutti i pg
                        c_showall = symb + "mostraschede";
                        f_showall = "*'" + c_showall + "'*";
                        if (msg.split(" ")[0].toLowerCase() == c_showall) {
                            try {
                                if (message.member.roles.cache.has(ruolo)) {
                                    // comando scritto
                                    let frase = laf + f_showall + ".";
                                    mex = msg.split(" ");
                                    mess = "**LISTA DEI PERSONAGGI**:\n";
                                    if (mex.length > 1) {
                                        message.reply(att + frase);
                                    } else {
                                        tab1.find().sort({ date: "desc", ms: "desc", nome: "desc" }).exec(function (err, res) {
                                            if (!res) {
                                                message.channel.send("Qualcosa è andato storto.");
                                            } else {
                                                // dichiaro massimo
                                                times = res.length;
                                                // decrescente
                                                try {
                                                    repeat(function () {
                                                        mess = mess + "**Tag**: " + res[times - 1].id +
                                                            "\n**Nome**: " + res[times - 1].nome +
                                                            ",\n**Tier**: " + res[times - 1].tier +
                                                            ",\n**Livello**: " + res[times - 1].lvl +
                                                            ",\n**Denaro**: " + res[times - 1].mo +
                                                            " MO,\n**Milestones**: " + res[times - 1].ms +
                                                            " (" + res[times - 1].msw + "/" + mswMax + ")" +
                                                            ",\n**Punti DT**: " + res[times - 1].pdt + "/" + res[times - 1].pdtt +
                                                            ",\n**Ultima Sessione**: " + trad(res[times - 1].date.toDateString()) + ".\n---\n";
                                                        times = times - 1
                                                    }, times);
                                                    message.author.send(mess)
                                                } catch (err) {
                                                    message.reply(mess_err);
                                                }
                                            }
                                        })
                                    }
                                } else {
                                    // messaggio non sei admin
                                    message.reply(amm);
                                }
                            } catch (err) {
                                message.reply(mess_err);
                            }
                        }

                        // Vedere il Mercato in base alla categoria 
                        c_mercato = symb + "mostramercato";
                        f_mercato = "*'" + c_mercato + " [Tipo_Oggetto]'*";
                        if (msg.split(" ")[0].toLowerCase() == c_mercato) {
                            if (message.member.roles.cache.has(ruolo) || message.member.roles.cache.has(utente)) {
                                try {
                                    // comando scritto
                                    let frase = laf + f_mercato + ".\n" +
                                        "All'interno di *[Tipo_Oggetto]* puoi scrivere una categoria tra queste:\n" +
                                        "*'Armi'* e anche *'Mischia'*, *'Distanza'*, *'Semplici'*, *'Guerra'*\n" +
                                        "Proprietà come *'Lancio'*, *'Leggera'*, *'Pesante'*, *'Accurata'*, *'Due Mani*', " +
                                        "*'Gittata'*, *'Munizioni'*, *'Portata'*, *'Ricarica'*, *'Speciale'*, *'Versatile'*.\n" +
                                        "*'Armature'* e anche *'Leggere'*, *'Medie'*, *'Pesanti'*, *'Scudi'*\n" +
                                        "Proprietà come *'Svantaggio'*, *'Forza'*\n" +
                                        "*'Equipaggiamento'* e anche *'Focus'*, *'Munizioni'*, *'Simbolo'*, *'Dotazioni'*.\n" +
                                        "*'Strumenti'* e anche *'Giochi'*, *'Artigiano'*, *'Musicali'*.\n" +
                                        "*'Cavalcature'* e anche *'Animali'*, 'Servizi*'.\n" +
                                        "*'Finimenti'* e anche *'Sella'*.\n" +
                                        "*'Veicoli'* e anche *'Tiro'*, *'Imbarcazioni'*, *'Volanti'*.\n" +
                                        "*'Merci'* e anche *'Alimenti*', *'Materiali'*, *'Animali'*.\n" +
                                        "*'Spese'* e anche *'Vitto'* e *'Alloggio'*.\n" +
                                        "*'Servizi'* e anche *'Carrozza'*, '*Gregario'* e *'Nave'*.";

                                    // dichiarazioni valori
                                    let mex = msg.split(" ");
                                    let re = msg.split(" ")[0].length + 1;
                                    let mess = msg.slice(re).toUpperCase();

                                    let mep = "```**LISTA DI OGGETTI '" + mess;
                                    let times;

                                    if (mex.length == 1) {
                                        message.reply(att + frase)
                                    } else {
                                        if (mess == "ARMA") {
                                            message.channel.send("Scrivi 'Armi', altrimenti ottieni la " +
                                                "lista delle armature.");
                                        } else {
                                            y = '.*' + mess.split(" ")[0] + '.*'
                                            for (let i = 1; i < (mess.split(" ").length); i++) {
                                                y = y + '.*' + mess.split(" ")[i] + '.*'
                                            }
                                            tab3.find({ type: { $regex: y } }).exec(function (err, res) {
                                                try {
                                                    if (!res) {
                                                        message.channel.send("Ciò che hai cercato non è presente nel mercato.");
                                                    } else {

                                                        //controlla se è uniforme
                                                        if (res[0].type != mess) {
                                                            mep = mep + "-";
                                                        };

                                                        // parte finale titolo
                                                        mep = mep + "'**\n";

                                                        // dichiaro massimo
                                                        times = res.length;

                                                        // crescente
                                                        i = 0
                                                        try {
                                                            repeat(function () {
                                                                mep = mep + res[i].name + ", " + res[i].mo + " MO.\n";
                                                                i = i + 1
                                                            }, times);
                                                        } catch (err) {
                                                            message.reply(mess_err);
                                                        }

                                                        // inserire una condizione tale che se supera i 4k caratteri
                                                        // ti divide il messaggio in più parti.
                                                        message.channel.send(mep + "```")
                                                    }
                                                } catch {
                                                    message.channel.send("Prova ad utilizzare meno attributi o provare ad invertirli.");
                                                }
                                            })
                                        }
                                    }
                                } catch (err) {
                                    message.channel.send(mess_err)
                                }

                            } else {
                                // messaggio non sei nella land
                                message.reply(amm2);
                            }
                        }

                        // ottieni punti downtime
                        c_pdt = symb + "ottienipdt";
                        f_pdt = "*'" + c_pdt + "'*";
                        if (msg.split(" ")[0].toLowerCase() == c_pdt) {
                            try {
                                if (message.member.roles.cache.has(ruolo) || message.member.roles.cache.has(utente)) {
                                    // dichiarazioni valori
                                    let tag = "<@" + message.author.id + ">";
                                    giorno = new Date(oggi());
                                    frase = laf + f_pdt + ".";

                                    if (msg.split(" ").length > 1) {
                                        // messaggio di aiuto
                                        message.reply(att + frase)
                                    } else {
                                        tab1.findOne({ id: tag }, async function (err, res) {
                                            if (!res) {
                                                message.reply("Il personaggio di " + tag + " non esiste.")
                                            } else {
                                                tipo = "pdt";
                                                num = 7;
                                                data = addDays(giorno, num);
                                                tab2.findOne({ id: tag, type: tipo }, async function (err, res) {
                                                    if (!res) {
                                                        if (num == 1) {
                                                            a = "o"
                                                        } else {
                                                            a = "i"
                                                        }
                                                        const dt = new tab2({ id: tag, type: tipo, date: data });
                                                        dt.save();
                                                        await tab1.findOneAndUpdate({ id: tag }, { $inc: { pdt: 2, pdtt: 2 } })
                                                        message.reply("Ti sono stati assegnati due punti downtime " +
                                                            "bonus come benvenuto nella Land.\n" +
                                                            "Potrai ottenere i prossmi punti downtime tra " + num + " giorn" + a + ".");
                                                    } else {
                                                        if (giorno < res.date) {
                                                            message.reply("Potrai ottenere i punti downtime il giorno: "
                                                                + trad(res.date.toDateString()) + ".")
                                                        } else {
                                                            await tab1.findOneAndUpdate({ id: tag }, { $inc: { pdt: 2, pdtt: 2 } })
                                                            await tab2.findOneAndUpdate({ id: tag, type: tipo }, { $set: { date: data } })
                                                            message.reply("Hai appena ottenuto 2 punti downtime.\n"
                                                                + "Potrai ottenere i prossimi punti downtime il giorno: "
                                                                + trad(data.toDateString()) + ".")
                                                        }
                                                    }
                                                })
                                            }
                                        })
                                    }
                                } else {
                                    // messaggio non sei nella land
                                    message.reply(amm2);
                                }
                            } catch (err) {
                                message.channel.send(mess_err)
                            }
                        }

                        // creare PG
                        c_creapg = symb + "creapg";
                        f_creapg = "*'" + c_creapg + " [Tag_Player] [Nome_PG] [Denaro] [Livello]'*";
                        if (msg.split(" ")[0].toLowerCase() == c_creapg) {
                            // try {
                            if (message.member.roles.cache.has(ruolo)) {
                                // comando scritto
                                let frase = laf + f_creapg + ".";
                                // dichiarazioni valori
                                let tag = msg.split(" ")[1];
                                let name = msg.split(" ")[2];
                                let num = parseInt(Math.abs(Math.round(msg.split(" ")[3] * 100) / 100));
                                let level = parseInt(Math.abs(Math.floor(msg.split(" ")[4])));
                                const channela = message.guild.channels.cache.get(canalemarket);
                                const channelb = message.guild.channels.cache.get(canaledt);
                                let idA;
                                let idB;
                                let Text;
                                // se il valore non è inserito, il pg è livello 1
                                // se vuoi togliere sta cosa, basta togliere commento
                                // nell'IF che sta qua sotto "|| isNaN(level) == true"
                                if (isNaN(level) == true) {
                                    level = 1
                                }
                                if (msg.split(" ").length == 1) {
                                    // formula errata
                                    message.reply(att + frase);
                                } else if (tag.length > 1 && name.length > 1) {
                                    if (isNaN(num) == true) {
                                        // errore valore
                                        message.reply("Hai sbagliato il denaro.");
                                    } else if (level == 0 /*|| isNaN(level) == true*/ || level > 20) {
                                        // errore valore
                                        message.reply("Hai sbagliato il livello.");
                                    } else {
                                        // controlla se il pg è nuovo
                                        tab1.findOne({ id: tag }, function (err, res) {
                                            if (res == null) {
                                                message.reply(tag + " ha creato un nuovo personaggio.");
                                            } else {
                                                message.reply("Il nuovo personaggio di " + tag +
                                                    " ha sovrascritto '" + res.nome + "'.");
                                            }
                                        })
                                        // crea thread mercato
                                        await channela.threads
                                            .create({
                                                name: 'Mercato ' + name,
                                                autoArchiveDuration: 10080
                                            })
                                            .then(res => idA = res.id)
                                            .catch(console.error);
                                        TextA = message.guild.channels.cache.get(idA)
                                        await TextA.send("Ciao " + tag + "," + "\nquesto thread sarà dedicato " +
                                            "ad ogni tuo acquisto all'interno della Land.\n" +
                                            "Utilizza il comando '" + c_mercato + "' per controllare cosa puoi " +
                                            "acquistare in Land in completa autonomia.\n" +
                                            "Se dovessi avere qualche problema, usa il tag <@&" + ruolo + ">.");
                                        // crea thread dt
                                        await channelb.threads
                                            .create({
                                                name: 'Downtime ' + name,
                                                autoArchiveDuration: 10080
                                            })
                                            .then(res => idB = res.id)
                                            .catch(console.error);
                                        TextB = message.guild.channels.cache.get(idB)
                                        await TextB.send("Ciao " + tag + "," + "\nquesto thread sarà dedicato " +
                                            "ad ogni tuo downtime all'interno della Land.\n" +
                                            "Utilizza il comando '" + c_pdt + "' per ottenere i tuoi primi " +
                                            "Punti Donwtime.\nNon sai cosa cosa siano i Punti Donwtime?\n" +
                                            "Usa il tag <@&" + ruolo + ">.");
                                        // controlla se ci sono thread vecchi del PG
                                        tab5.find({ id_pl: tag }, async function (err, res) {
                                            if (!res) {
                                                console.log("Nuovo PG");
                                            } else {
                                                for (let i = 0; i < res.length; i++) {
                                                    Text = message.guild.channels.cache.get(res[i].id_chan)
                                                    try {
                                                        await Text.delete()
                                                            .then(deletedThread => console.log("Ho cancellato il thread " + deletedThread.id))
                                                            .catch(console.error);
                                                    } catch {
                                                        console.log("Qualcosa è andato storto.")
                                                    }
                                                }
                                                await tab5.deleteMany({ id_pl: tag })
                                                //inserimento nel DB
                                                const g = new tab5({ id_pl: tag, name_pl: name, id_chan: idA, type: "Mercato" });
                                                g.save();
                                                const f = new tab5({ id_pl: tag, name_pl: name, id_chan: idB, type: "Downtime" });
                                                f.save();
                                            }
                                        })

                                        // controlla se sta in una gilda e se è un capogilda
                                        tab7.findOne({ id_p: tag }, async function (err, res2) {
                                            if (!res2) {
                                                console.log("Non era in una gilda.");
                                            } else {
                                                if (res2.capo == true) {
                                                    tab6.findOne({ id_guild: res2.id_g }, async function (err, res4) {
                                                        if (!res4) {
                                                            console.log("La gilda non esiste.");
                                                        } else {
                                                            if (res4.n_m == 1) {
                                                                tab8.deleteOne({ id: res2.id_g });
                                                                tab6.deleteOne({ id_guild: res2.id_g });
                                                                tab2.deleteOne({ id: res2.id_g });
                                                                tab5.findOne({ id_pl: res2.id_g }, async function (err, res3) {
                                                                    Text = message.guild.channels.cache.get(res3.id_chan)
                                                                    try {
                                                                        await Text.delete()
                                                                            .then(deletedThread => console.log("Ho cancellato il thread " +
                                                                                deletedThread.id))
                                                                            .catch(console.error);
                                                                    } catch {
                                                                        console.log("Qualcosa è andato storto.");
                                                                    }
                                                                });
                                                                await tab5.deleteMany({ id_pl: res2.id_g });
                                                                message.author.send("La gilda " + res2.id_g + " è stata cancellata.")
                                                            } else {
                                                                // correggere questa parte
                                                                // comprendere bene cosa fare quando
                                                                // hai più di un membro nella gilda
                                                                await tab7.find({ id_g: res2.id_g }, async function (err, res5) {
                                                                    if (!res5) {
                                                                        console.log("Qualcosa è andato storto.");
                                                                    } else {
                                                                        // capogilda nuovo
                                                                        let y = "";
                                                                        let i = 0;
                                                                        do {
                                                                            if (res5[i].capo == false) {
                                                                                y = res5[i].id_p;
                                                                                console.log("Nuovo cga " + y)
                                                                            }
                                                                            i++;
                                                                        } while ((y == "") || (i == res5.length - 1));
                                                                        await tab6.findOneAndUpdate({ id_guild: res2.id_g },
                                                                            { id_pl: y });
                                                                        await tab7.updateOne({ id_p: y }, { capo: true });
                                                                        message.author.send("Il nuovo capogilda è " + y + ".")
                                                                    }
                                                                }).clone()
                                                            }
                                                        }
                                                    })
                                                }
                                                await tab6.findOneAndUpdate({ id_guild: res2.id_g }, { $inc: { n_m: -1 } });
                                            }
                                        });

                                        // aggiornamento variabile
                                        listaCanali = canali()

                                        // valore delle milestones
                                        let numb = 0;
                                        numb = milestones(level);
                                        tie = ttier(level);
                                        let today = new Date();
                                        let data = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
                                        let settimana = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7);

                                        // plurale o singolare
                                        await tab1.findOneAndUpdate({ id: tag }, {
                                            id: tag, nome: name, mo: num, ms: numb, msw: 0,
                                            lvl: level, tier: tie, pdt: 0, pdtt: 0, date: data
                                        }, { upsert: true })
                                        await tab2.findOneAndDelete({ id: tag })
                                        await tab4.deleteMany({ id_pl: tag })
                                        // inserimento PG nella tab8
                                        await tab8.deleteOne({ id: tag })
                                        const g = new tab8({ id: tag, type: "PG" })
                                        g.save();

                                        // // inserimento PDT all'interno dei DT
                                        // const h = new tab2({ id: tag, type: "pdt", date: settimana })
                                        // h.save();

                                        if (num == 1) {
                                            a = "a"
                                            b = "e"
                                        } else {
                                            a = "e"
                                            b = "i"
                                        }
                                        if (num == 1) {
                                            s = ""
                                        } else {
                                            s = "s"
                                        }

                                        // risposta
                                        message.author.send("Il personaggio di " + tag + " si chiama '" + name
                                            + "', è di " + level + "° livello con " + numb + " milestone" + s
                                            + " e ha " + num + " monet" + a + " d'oro inizial" + b + ".");
                                    }
                                } else {
                                    // formula errata
                                    message.reply(att + frase);
                                }
                            } else {
                                // messaggio non sei nella land
                                message.reply(amm);
                            }
                            // } catch (err) {
                            //     message.reply(mess_err);
                            // }
                        }

                        // cancellare PG/gilda
                        c_deletepg = symb + "cancella";
                        f_deletepg = "*'" + c_deletepg + " [Tag]'*";
                        if (msg.split(" ")[0].toLowerCase() == c_deletepg) {
                            try {
                                if (message.member.roles.cache.has(ruolo)) {
                                    // comando scritto
                                    let frase = laf + f_deletepg + ".";
                                    // dichiarazioni valori
                                    let tag = msg.split(" ")[1];
                                    if (msg.split(" ").length == 1) {
                                        // formula errata
                                        message.reply(att + frase);
                                    } else if (msg.split(" ").length == 2 && tag.length > 1) {
                                        tab8.findOne({ id: tag }, async function (err, res) {
                                            if (!res) {
                                                message.reply(tag + " non esiste.");
                                                console.log(trovaNumCod())
                                            } else {
                                                // se l'entità è un PG
                                                if (res.type == "PG") {
                                                    // cerca se il PG esiste
                                                    tab1.findOne({ id: tag }, async function (err, res) {
                                                        if (!res) {
                                                            message.reply(tag + " non esiste.");
                                                        } else {
                                                            // controlla se sta in una gilda e se è un capogilda
                                                            tab7.findOne({ id_p: tag }, async function (err, res2) {
                                                                if (!res2) {
                                                                    console.log("Non era in una gilda.");
                                                                } else {
                                                                    if (res2.capo == true) {
                                                                        tab6.findOne({ id_guild: res2.id_g }, async function (err, res4) {
                                                                            if (!res4) {
                                                                                console.log("La gilda non esiste.");
                                                                            } else {
                                                                                if (res4.n_m == 1) {
                                                                                    tab8.deleteOne({ id: res2.id_g });
                                                                                    tab6.deleteOne({ id_guild: res2.id_g });
                                                                                    tab2.deleteOne({ id: res2.id_g });
                                                                                    tab5.findOne({ id_pl: res2.id_g }, async function (err, res3) {
                                                                                        Text = message.guild.channels.cache.get(res3.id_chan)
                                                                                        try {
                                                                                            await Text.delete()
                                                                                                .then(deletedThread => console.log("Ho cancellato il thread " +
                                                                                                    deletedThread.id))
                                                                                                .catch(console.error);
                                                                                        } catch {
                                                                                            console.log("Qualcosa è andato storto.");
                                                                                        }
                                                                                    });
                                                                                    await tab5.deleteMany({ id_pl: res2.id_g });
                                                                                    message.author.send("La gilda " + res2.id_g + " è stata cancellata.")
                                                                                } else {
                                                                                    // correggere questa parte
                                                                                    // comprendere bene cosa fare quando
                                                                                    // hai più di un membro nella gilda
                                                                                    await tab7.find({ id_g: res2.id_g }, async function (err, res5) {
                                                                                        if (!res5) {
                                                                                            console.log("Qualcosa è andato storto.");
                                                                                        } else {
                                                                                            // capogilda nuovo
                                                                                            let y = "";
                                                                                            let i = 0;
                                                                                            do {
                                                                                                if (res5[i].capo == false) {
                                                                                                    y = res5[i].id_p;
                                                                                                    console.log("Nuovo cga " + y)
                                                                                                }
                                                                                                i++;
                                                                                            } while ((y == "") || (i == res5.length - 1));
                                                                                            await tab6.findOneAndUpdate({ id_guild: res2.id_g },
                                                                                                { id_pl: y });
                                                                                            await tab7.updateOne({ id_p: y }, { capo: true });
                                                                                            message.author.send("Il nuovo capogilda è " + y + ".")
                                                                                        }
                                                                                    }).clone()
                                                                                }
                                                                            }
                                                                        })
                                                                    }
                                                                    await tab6.findOneAndUpdate({ id_guild: res2.id_g }, { $inc: { n_m: -1 } });
                                                                }
                                                            });
                                                            // controlla se ci sono thread vecchi del PG
                                                            tab5.find({ id_pl: tag }, async function (err, res) {
                                                                if (res == null) {
                                                                    console.log("Non ci sono.")
                                                                } else {
                                                                    for (let i = 0; i < res.length; i++) {
                                                                        Text = message.guild.channels.cache.get(res[i].id_chan)
                                                                        try {
                                                                            await Text.delete()
                                                                                .then(deletedThread => console.log("Ho cancellato il thread " + deletedThread.id))
                                                                                .catch(console.error);
                                                                        } catch {
                                                                            console.log("Qualcosa è andato storto.")
                                                                        }
                                                                    }
                                                                    await tab5.deleteMany({ id_pl: tag })
                                                                }
                                                            })
                                                            await tab1.deleteOne({ id: tag })
                                                            await tab2.deleteOne({ id: tag })
                                                            await tab4.deleteMany({ id_pl: tag })
                                                            await tab7.deleteOne({ id_p: tag })
                                                            await tab8.deleteOne({ id: tag })
                                                            // aggiornamento variabile
                                                            listaCanali = canali()
                                                            message.author.send("Il personaggio di " + tag +
                                                                " è stato cancellato.");
                                                        }
                                                    })
                                                } else if (res.type == "GILDA") {
                                                    // cerca se la gilda esiste
                                                    tab6.findOneAndDelete({ id_guild: tag }, async function (err, res) {
                                                        if (!res) {
                                                            message.reply("La gilda " + tag + " non esiste.");
                                                        } else {
                                                            await tab2.deleteOne({ id: tag })
                                                            await tab4.deleteMany({ id_pl: tag })
                                                            await tab7.deleteMany({ id_g: tag })
                                                            await tab8.deleteOne({ id: tag })
                                                            // controlla se ci sono thread vecchi della gilda
                                                            tab5.find({ id_pl: tag }, async function (err, res) {
                                                                if (!res) {
                                                                    console.log("Non ci sono.")
                                                                } else {
                                                                    for (let i = 0; i < res.length; i++) {
                                                                        Text = message.guild.channels.cache.get(res[i].id_chan)
                                                                        try {
                                                                            await Text.delete()
                                                                                .then(deletedThread => console.log("Ho cancellato il thread " + deletedThread.id))
                                                                                .catch(console.error);
                                                                        } catch {
                                                                            console.log("Qualcosa è andato storto.")
                                                                        }
                                                                    }
                                                                    await tab5.deleteMany({ id_pl: tag })
                                                                }
                                                            })
                                                            // aggiornamento variabile
                                                            listaCanali = canali()
                                                            // messaggio
                                                            message.reply("La gilda **" + res.name_guild + "** è stata cancellata.");
                                                        }
                                                    })
                                                }
                                            }
                                        })
                                    } else {
                                        message.reply(mess_err);
                                    }
                                } else {
                                    // messaggio non sei nella land
                                    message.reply(amm);
                                }
                            } catch (err) {
                                message.reply(mess_err);
                            }
                        }

                        // dai denaro
                        c_dai = symb + "regaladenaro";
                        f_dai = "*'" + c_dai + " [Tag_Player_Beneficiario] [Denaro]'*";
                        if (msg.split(" ")[0].toLowerCase() == c_dai) {
                            try {
                                if (message.member.roles.cache.has(ruolo) || message.member.roles.cache.has(utente)) {
                                    // comando scritto
                                    let frase = laf + f_dai + ".";
                                    // dichiarazioni valori
                                    let tag2 = "<@" + message.author.id + ">";
                                    let tag = msg.split(" ")[1];
                                    let num = parseInt(-Math.abs(Math.round(msg.split(" ")[2] * 100) / 100));
                                    // condizioni
                                    if (msg.split(" ").length == 1) {
                                        // formula errata
                                        message.reply(att + frase);
                                    } else if (tag.length > 1 && msg.split(" ").length == 3) {
                                        if (isNaN(num) == true) {
                                            // errore valore
                                            message.reply("Hai sbagliato il denaro.");
                                        } else if (num == 0) {
                                            // è inutile
                                            message.reply("Perchè dovresti donare *zero* monete d'oro?");
                                        } else if (tag == tag2) {
                                            // è inutile
                                            message.reply("Perché vuoi dare i **tuoi** soldi a ...*te stesso*?");
                                        } else {
                                            tab1.findOne({ id: tag2 }, async function (err, res) {
                                                // singolare o plurale
                                                if (Math.abs(num) == 1) {
                                                    a = "a"
                                                } else {
                                                    a = "e"
                                                }
                                                // condizioni esistenza
                                                if (!res) {
                                                    message.reply("Il personaggio di " + tag2 + " non esiste.");
                                                } else if (res.mo < Math.abs(num)) {
                                                    message.reply("Nessun personaggio può indebitarsi.\n" +
                                                        "Attualmente disponi di " + res.mo + " monet" + a + " d'oro.");
                                                } else {
                                                    await tab1.findOne({ id: tag }, async function (err, res) {
                                                        if (!res) {
                                                            message.reply("Il personaggio di " + tag + " non esiste.");
                                                        } else {
                                                            // togli soldi da chi scrive
                                                            await tab1.findOneAndUpdate({ id: tag2 }, { $inc: { mo: num } })
                                                            num = -num;
                                                            // plurale o singolare
                                                            await tab1.findOneAndUpdate({ id: tag }, { $inc: { mo: num } })
                                                            // risposta
                                                            message.reply("Il personaggio di " + tag + " ha ricevuto " +
                                                                num + " monet" + a + " d'oro dal personaggio di " + tag2 + ".");
                                                        }
                                                    }).clone()
                                                }
                                            })
                                        }
                                    } else {
                                        // formula errata
                                        message.reply(att + frase);
                                    }
                                } else {
                                    // messaggio non sei nella land
                                    message.reply(amm2);
                                }
                            } catch (err) {
                                message.reply(mess_err);
                            }
                        }

                        // Downtime
                        c_downtime = symb + "downtime";
                        f_downtime = "*'" + c_downtime + " [Tipo_di_Downtime] [Giorni]'*";
                        if (msg.split(" ")[0].toLowerCase() == c_downtime) {
                            try {
                                if (message.member.roles.cache.has(ruolo) || message.member.roles.cache.has(utente)) {
                                    // comando scritto
                                    let frase = laf + f_downtime + ".\n"
                                        + "Usa un'unica parola per il tipo di Downtime.";
                                    // dichiarazioni valori
                                    let tag = "<@" + message.author.id + ">";
                                    let tipo = msg.split(" ")[1];
                                    let num = parseInt(Math.abs(Math.floor(msg.split(" ")[2])));
                                    let giorno = new Date(oggi());
                                    // condizioni
                                    if (msg.split(" ").length == 1) {
                                        message.reply(att + frase);
                                    } else if (msg.split(" ").length == 2 || msg.split(" ").length == 3) {
                                        tab1.findOne({ id: tag }, async function (err, res) {
                                            if (!res) {
                                                message.reply("Il personaggio di " + tag + " non esiste.")
                                            } else {
                                                if (tipo == "" || tipo == null) {
                                                    tab2.findOne({ id: tag, type: { $ne: "pdt" } }, async function (err, res) {
                                                        if (!res) {
                                                            message.reply("Il personaggio di " + tag + " non ha un downtime attivo.")
                                                        } else {
                                                            if (res.date > giorno) {
                                                                message.reply("Il downtime di " + tag + " non è ancora terminato.")
                                                            } else {
                                                                message.reply("Il downtime di " + res.type + " effettuato da " + tag +
                                                                    " è terminato.\nContattare un <@&" + ruolo + "> per ottenere i risultati.")
                                                                await tab2.deleteOne({ id: tag })
                                                            }
                                                        }
                                                    })
                                                } else {
                                                    if (tipo.length > 1) {
                                                        if (num == null || num <= 0 || num == "" || isNaN(num)) {
                                                            // valore predefinito 7 giorni
                                                            num = 7;
                                                            message.reply("Il valore inserito non rispetta i criteri.\n" +
                                                                "Verrà utilizzato il valore predefinito dei downtime, nonché sette giorni.");
                                                        }
                                                        data = addDays(giorno, num);
                                                        tab2.findOne({ id: tag, type: { $ne: "pdt" } }, function (err, res) {
                                                            if (!res) {
                                                                if (num == 1) {
                                                                    a = "o"
                                                                } else {
                                                                    a = "i"
                                                                }
                                                                const dt = new tab2({ id: tag, type: tipo, date: data })
                                                                dt.save()
                                                                message.reply("Il downtime di " + tipo + " che verrà effettuato da " + tag +
                                                                    ", terminerà tra " + num + " giorn" + a + ".")
                                                            } else {
                                                                if (giorno < res.date) {
                                                                    message.reply("Il personaggio di " + tag + " non può avviare un secondo downtime " +
                                                                        "senza aver terminato quello in corso.\nIl downtime '" + res.type + "' termina il giorno: "
                                                                        + trad(res.date.toDateString()) + ".")
                                                                } else {
                                                                    message.reply("Devi prima riscuotere il downtime che hai concluso.\n||Scrivi '" + c_downtime + "' " +
                                                                        "così puoi riscattare il downtime concluso.||")
                                                                }
                                                            }
                                                        })
                                                    }
                                                }
                                            }
                                        })
                                    } else {
                                        message.reply(mess_err);
                                    }
                                } else {
                                    // messaggio non sei nella land
                                    message.reply(amm2);
                                }
                            } catch (err) {
                                message.reply(mess_err);
                            }
                        }

                        // Butta oggetto
                        c_butta = symb + "butta";
                        f_butta = "*'" + c_butta + " [Oggetto] [Quantità]'*";
                        if (msg.split(" ")[0].toLowerCase() == c_butta) {
                            try {
                                if (message.member.roles.cache.has(ruolo) || message.member.roles.cache.has(utente)) {
                                    // comando scritto
                                    let frase = laf + f_butta + ".\n" +
                                        "Se hai bisogno di leggere gli oggetti, utilizza il comando '" + c_mercato + "'.";
                                    let mess = msg.split(" ");
                                    let nome = "";
                                    let tag = "<@" + message.author.id + ">";
                                    let count = Math.floor(Math.abs(parseInt(mess.slice(-1)[0])));
                                    // condizioni
                                    if (mess.length == 1) {
                                        // messaggio di aiuto
                                        message.reply(att + frase)
                                    } else {
                                        tab1.findOne({ id: tag }, async function (err, res) {
                                            if (!res) {
                                                // esistenza personaggio autore
                                                message.reply("Il personaggio di " + tag + " non esiste.")
                                            } else {
                                                if (mess.length == 1) {
                                                    // messaggio di aiuto
                                                    message.reply(att + frase)
                                                } else {
                                                    // generazione nome
                                                    if (isNaN(count) == true) {
                                                        count = 1;
                                                        max = mess.length;
                                                    } else {
                                                        count = Math.abs(count);
                                                        max = mess.length - 1;
                                                    }
                                                    for (let j = 1; j < max; j++) {
                                                        if (j == 1) {
                                                            nome = nome + mess[j];
                                                        } else {
                                                            nome = nome + " " + mess[j];
                                                        }
                                                    }
                                                    nome = nome.toUpperCase();
                                                    // cerco nome nell'inventario del giocatore
                                                    if (count == 1) {
                                                        c = "L'"
                                                        d = "o"
                                                        e = ""
                                                    } else {
                                                        c = "Gli "
                                                        d = "i"
                                                        e = "no"
                                                    }
                                                    await tab4.findOne({ id_pl: tag, name: nome }, async function (err, res) {
                                                        if (!res) {
                                                            message.reply("Il personaggio di " + tag + " non possiede " +
                                                                c.toLowerCase() + "oggett" + d + " chiamat" + d + " '" + nome + "'.")
                                                        } else {
                                                            tot = res.num - count;
                                                            if (tot > 0) {
                                                                await tab4.updateOne({ id_pl: tag, name: nome }, { $set: { num: tot } }, { upsert: true })
                                                                message.reply("Il personaggio di " + tag + " ha buttato " +
                                                                    count + " oggett" + d + " chiamat" + d + " '" + nome + "'.")
                                                            } else if (tot <= 0) {
                                                                await tab4.deleteOne({ id_pl: tag, name: nome })
                                                                message.reply("Il personaggio di " + tag + " ha buttato " +
                                                                    "tutti gli oggetti chiamati '" + nome + "'.")
                                                            }
                                                        }
                                                    }).clone()
                                                }
                                            }
                                        })
                                    }
                                } else {
                                    // messaggio non sei nella land
                                    message.reply(amm2);
                                }
                            } catch (err) {
                                message.reply(mess_err);
                            }
                        }

                        // Spendi
                        c_spendi = symb + "spendi";
                        f_spendi = "*'" + c_spendi + " [Denaro]'*";
                        if (msg.split(" ")[0].toLowerCase() == c_spendi) {
                            try {
                                if (message.member.roles.cache.has(ruolo) || message.member.roles.cache.has(utente)) {
                                    // comando scritto
                                    let frase = laf + f_spendi + ".";
                                    let tag = "<@" + message.author.id + ">";
                                    let num = parseInt(Math.abs(Math.round(msg.split(" ")[1] * 100) / 100));
                                    let tot;
                                    if (msg.split(" ").length == 1) {
                                        // messaggio errore
                                        message.reply(att + frase);
                                    } else if (isNaN(num) == true) {
                                        // messaggio errore
                                        message.reply("Controlla bene il valore che intendi spendere.");
                                    } else if (num == 0) {
                                        // messaggio errore
                                        message.reply("Perché dovresti spendere *zero* monete d'oro?");
                                    } else if (msg.split(" ").length == 2) {
                                        tab1.findOne({ id: tag }, async function (err, res) {
                                            if (!res) {
                                                message.reply("Non hai un personaggio all'interno della Land.")
                                            } else {
                                                if (num == 1) {
                                                    a = "a"
                                                } else {
                                                    a = "e"
                                                }
                                                if (res.mo >= num) {
                                                    tot = res.mo - num;
                                                    await tab1.updateOne({ id: tag }, { $set: { mo: tot } }, { upsert: true })
                                                    message.reply("Hai speso " + Math.abs(num) + " monet" + a + " d'oro.")
                                                } else {
                                                    message.reply("Non puoi indebitarti.")
                                                }
                                            }
                                        })
                                    } else {
                                        message.reply(mess_err);
                                    }
                                } else {
                                    // messaggio non sei nella land
                                    message.reply(amm2);
                                }
                            } catch (err) {
                                message.reply(mess_err);
                            }
                        }

                        // Aggiungere oggetti nel mercato
                        c_additem = symb + "inseriscioggetto";
                        f_additem = "*'" + c_additem + " [Nome_Oggetto] [Prezzo_MO] [Tipo] [Proprietà_Oggetto]'*";
                        if (msg.split(" ")[0].toLowerCase() == c_additem) {
                            try {
                                if (message.member.roles.cache.has(ruolo)) {
                                    // comando scritto
                                    let frase = laf + f_additem + ".\n" +
                                        "Per esempio: '" + c_additem + " Spada Corta 10 Armi Accurata Leggera*.\n" +
                                        "Cerca di non sbagliare il campo del prezzo.";
                                    let i = 1;
                                    let mess = msg.split(" ");
                                    let idd = "";
                                    let nome = "";
                                    let tipo = "";
                                    let denaro = "";

                                    if (mess.length == 1) {
                                        // messaggio di aiuto
                                        message.reply(att + frase)
                                    } else {
                                        // trova indice prezzo
                                        while (isNaN(mess[i]) && i < mess.length) {
                                            i = i + 1;
                                        }
                                        denaro = math.round(mess[i] * 100) / 100;

                                        if (isNaN(denaro) == false && isNaN(mess.slice(-1)[0]) == true) {
                                            if (denaro == 1) {
                                                a = "a"
                                            } else {
                                                a = "e"
                                            }

                                            // compone nome
                                            if (i > 2) {
                                                // se nome composto da più parole
                                                for (let j = 1; j < i; j++) {
                                                    if (j == 1) {
                                                        nome = nome + mess[j];
                                                    } else {
                                                        nome = nome + " " + mess[j];
                                                    }
                                                }
                                            } else {
                                                //nome singolo
                                                nome = mess[1];
                                            }
                                            nome = nome.toUpperCase();

                                            // compone id parte 1
                                            idd = createid(mess[i + 1]).toUpperCase();

                                            // compone tipo
                                            for (let j = (i + 1); j < mess.length; j++) {
                                                if (j == (i + 1)) {
                                                    tipo = tipo + mess[j];
                                                } else {
                                                    tipo = tipo + " " + mess[j];
                                                }
                                            }
                                            tipo = tipo.toUpperCase();

                                            tab3.find({ id: { $regex: '.*' + idd + '.*' } }, function (err, res) {
                                                if (!res) {
                                                    idd = idd + "001"
                                                } else if (res.length > 1000) {
                                                    message.reply("Il valore è andato oltre.")
                                                } else {
                                                    if (res.length + 1 <= 9) {
                                                        idd = idd + "00" + (res.length + 1).toString()
                                                    } else if (res.length + 1 <= 99) {
                                                        idd = idd + "0" + (res.length + 1).toString()
                                                    } else if (res.length + 1 <= 999) {
                                                        idd = idd + (res.length + 1).toString()
                                                    }
                                                    idd.toUpperCase();
                                                    const ogg = new tab3({ id: idd, name: nome, type: tipo, mo: denaro })
                                                    ogg.save()
                                                    message.reply("L'oggetto '" + nome + "' del tipo '" + tipo.split(" ")[0] + "' che " +
                                                        "costa " + denaro + " monet" + a + " d'oro, è stato inserito con successo.")
                                                }
                                            })
                                        } else {
                                            // messaggio di aiuto
                                            message.reply(att + frase)
                                        }
                                    }
                                } else {
                                    // messaggio non sei admin
                                    message.reply(amm);
                                }
                            } catch (err) {
                                message.reply(mess_err);
                            }
                        }

                        // Compra oggetti
                        c_compra = symb + "compra";
                        f_compra = "*'" + c_compra + " [Nome_Oggetto] [Quantità]'*";
                        if (msg.split(" ")[0].toLowerCase() == c_compra) {
                            try {
                                if (message.member.roles.cache.has(ruolo) || message.member.roles.cache.has(utente)) {
                                    // comando scritto
                                    let frase = laf + f_compra + ".\n" +
                                        "Se hai bisogno di leggere gli oggetti, utilizza il comando '" + c_mercato + "'.";
                                    let mess = msg.split(" ");
                                    let nome = "";
                                    let tag = "<@" + message.author.id + ">";
                                    let count = Math.floor(Math.abs(parseInt(mess.slice(-1)[0])));
                                    let monete = 0;
                                    let costo;

                                    if (mess.length == 1) {
                                        // messaggio di aiuto
                                        message.reply(att + frase)
                                    } else {
                                        tab1.findOne({ id: tag }, async function (err, res) {
                                            if (!res) {
                                                // esistenza personaggio autore
                                                message.reply("Il personaggio di " + tag + " non esiste.")
                                            } else {
                                                monete = res.mo;
                                                if (mess.length == 1) {
                                                    // messaggio di aiuto
                                                    message.reply(att + frase)
                                                } else {
                                                    // generazione nome
                                                    if (isNaN(count) == true) {
                                                        count = 1;
                                                        max = mess.length
                                                    } else {
                                                        count = Math.abs(count);
                                                        max = mess.length - 1
                                                    }
                                                    for (let j = 1; j < max; j++) {
                                                        if (j == 1) {
                                                            nome = nome + mess[j];
                                                        } else {
                                                            nome = nome + " " + mess[j];
                                                        }
                                                    }
                                                    nome = nome.toUpperCase();

                                                    // cerco nome nella tabella mercato
                                                    await tab3.findOne({ name: nome }, async function (err, res) {
                                                        if (!res) {
                                                            message.reply("Controlla se hai scritto bene il messaggio.\n" +
                                                                "Altrimenti è possibile che l'oggetto cercato non sia ancora " +
                                                                "disponibile nel mercato.")
                                                        } else {
                                                            costo = res.mo;
                                                            idobj = res.id;
                                                            monete = monete - (costo * count);
                                                            if (res.mo == 1) {
                                                                a = "a"
                                                            } else {
                                                                a = "e"
                                                            }
                                                            if ((monete + (res.mo * count)) == 1) {
                                                                b = "a"
                                                            } else {
                                                                b = "e"
                                                            }
                                                            if (count == 1) {
                                                                c = "L'"
                                                                d = "o"
                                                                e = ""
                                                            } else {
                                                                c = "Gli "
                                                                d = "i"
                                                                e = "no"
                                                            }
                                                            if (monete >= 0) {
                                                                await tab1.updateOne({ id: tag }, { $set: { mo: monete } })
                                                                await tab4.findOne({ id_pl: tag, id_obj: idobj }, async function (err, res) {
                                                                    if (!res) {
                                                                        const g = await new tab4({ id_pl: tag, id_obj: idobj, name: nome, mo: costo, num: count })
                                                                        g.save();
                                                                    } else {
                                                                        tot = res.num + count
                                                                        await tab4.updateOne({ id_pl: tag, id_obj: idobj }, { $set: { num: tot } }, { upsert: true })
                                                                    }
                                                                    message.reply("Il personaggio di " + tag + " ha comprato " +
                                                                        count + " oggett" + d + " chiamat" + d + " '" + nome + "'.")
                                                                }).clone()
                                                            } else {
                                                                message.reply("Non puoi indebitarti.\n" + c + "oggett" + d + " '" +
                                                                    res.name + "' costa" + e + " " + (res.mo * count) + " monet" + a + " d'oro.\n" +
                                                                    "Il personaggio di " + tag + " ha " + (monete + res.mo) +
                                                                    " monet" + b + " d'oro.")
                                                            }
                                                        }
                                                    }).clone()
                                                }
                                            }
                                        })
                                    }
                                } else {
                                    // messaggio non sei nella land
                                    message.reply(amm2);
                                }
                            } catch (err) {
                                message.reply(mess_err);
                            }
                        }

                        // Stop Downtime
                        c_fermadowntime = symb + "fermadowntime";
                        f_fermadowntime = "*'" + c_fermadowntime + "'*";
                        if (msg.split(" ")[0].toLowerCase() == c_fermadowntime) {
                            try {
                                if (message.member.roles.cache.has(ruolo) || message.member.roles.cache.has(utente)) {
                                    // comando scritto
                                    let frase = laf + f_fermadowntime;
                                    let mess = msg.split(" ");
                                    let tag = "<@" + message.author.id + ">";
                                    let x = "pdt";

                                    if (mess.length > 1) {
                                        message.reply(att + frase)
                                    } else {
                                        tab1.findOne({ id: tag }, async function (err, res) {
                                            if (!res) {
                                                message.reply("Il personaggio di " + tag + " non esiste.")
                                            } else {
                                                tab2.findOne({ id: tag, type: { $ne: x } }, async function (err, res) {
                                                    if (!res) {
                                                        message.reply("Il personaggio di " + tag + " non ha un downtime attivo.")
                                                    } else {
                                                        await tab2.deleteOne({ id: tag })
                                                        message.reply("Il downtime del personaggio di " + tag + " è stato cancellato.")
                                                    }
                                                })
                                            }
                                        })
                                    }
                                } else {
                                    // messaggio non sei nella land
                                    message.reply(amm2);
                                }
                            } catch (err) {
                                message.reply(mess_err);
                            }
                        }

                        // Vendi oggetti
                        c_vendi = symb + "vendi";
                        f_vendi = "*'" + c_vendi + " [Nome_Oggetto] [Quantità]'*";
                        if (msg.split(" ")[0].toLowerCase() == c_vendi) {
                            try {
                                if (message.member.roles.cache.has(ruolo) || message.member.roles.cache.has(utente)) {
                                    // comando scritto
                                    let frase = laf + f_vendi + ".\n" +
                                        "Se hai bisogno di leggere gli oggetti, utilizza il comando '" + c_mercato + "'.\n" +
                                        "Invece se vuoi controllare il tuo inventario scrivi '" + c_inventario + "'.";
                                    let mess = msg.split(" ");
                                    let nome = "";
                                    let tag = "<@" + message.author.id + ">";
                                    let count = Math.floor(Math.abs(parseInt(mess.slice(-1)[0])));
                                    let monete = 0;
                                    let costo;

                                    if (mess.length == 1) {
                                        // messaggio di aiuto
                                        message.reply(att + frase)
                                    } else {
                                        tab1.findOne({ id: tag }, async function (err, res) {
                                            if (!res) {
                                                // esistenza personaggio autore
                                                message.reply("Il personaggio di " + tag + " non esiste.")
                                            } else {
                                                monete = res.mo;
                                                if (mess.length == 1) {
                                                    // messaggio di aiuto
                                                    message.reply(att + frase)
                                                } else {
                                                    // generazione nome
                                                    if (isNaN(count) == true) {
                                                        count = 1;
                                                        max = mess.length
                                                    } else {
                                                        count = Math.abs(count);
                                                        max = mess.length - 1
                                                    }
                                                    for (let j = 1; j < max; j++) {
                                                        if (j == 1) {
                                                            nome = nome + mess[j];
                                                        } else {
                                                            nome = nome + " " + mess[j];
                                                        }
                                                    }
                                                    nome = nome.toUpperCase();

                                                    // cerco nome nella tabella mercato
                                                    await tab3.findOne({ name: nome }, async function (err, res) {
                                                        if (!res) {
                                                            message.reply("Controlla se hai scritto bene il messaggio.\n" +
                                                                "Altrimenti è possibile che l'oggetto cercato non sia ancora " +
                                                                "disponibile nel mercato.")
                                                        } else {
                                                            costo = Math.round((res.mo / 2) * 100) / 100;
                                                            idobj = res.id;
                                                            monete = monete + (costo * count);
                                                            if (res.mo == 1) {
                                                                a = "a"
                                                            } else {
                                                                a = "e"
                                                            }
                                                            if ((monete + (res.mo * count)) == 1) {
                                                                b = "a"
                                                            } else {
                                                                b = "e"
                                                            }
                                                            if (count == 1) {
                                                                c = "L'"
                                                                d = "o"
                                                                e = ""
                                                            } else {
                                                                c = "Gli "
                                                                d = "i"
                                                                e = "no"
                                                            }
                                                            if (monete >= 0) {
                                                                await tab4.findOne({ id_pl: tag, id_obj: idobj }, async function (err, res) {
                                                                    if (!res) {
                                                                        message.reply("Non hai questo oggetto nell'inventario oppure hai scritto" +
                                                                            " male il nome dell'oggetto.")
                                                                    } else {
                                                                        tot = res.num - count
                                                                        if (tot >= 0) {
                                                                            if (tot == 0) {
                                                                                //cancellare valore nell'inventario
                                                                                await tab4.deleteOne({ id_pl: tag, id_obj: idobj })
                                                                            } else {
                                                                                //positivo
                                                                                await tab4.updateOne({ id_pl: tag, id_obj: idobj }, { $set: { num: tot } }, { upsert: true })
                                                                            }
                                                                            await tab1.updateOne({ id: tag }, { $set: { mo: monete } })
                                                                            message.reply("Il personaggio di " + tag + " ha comprato " +
                                                                                count + " oggett" + d + " chiamat" + d + " '" + nome + "'.")
                                                                        } else {
                                                                            //negativo
                                                                            message.reply("Non possiedi il numero di oggetti che stai cercando di vendere.")
                                                                        }
                                                                    }
                                                                }).clone()
                                                            } else {
                                                                message.reply("Devi controllare il denaro, il valore è negativo.")
                                                            }
                                                        }
                                                    }).clone()
                                                }
                                            }
                                        })
                                    }
                                } else {
                                    // messaggio non sei nella land
                                    message.reply(amm2);
                                }
                            } catch (err) {
                                message.reply(mess_err);
                            }
                        }

                        // dare oggetto mercato da master a giocatore
                        c_giveitem = symb + "assegnaoggetto";
                        f_giveitem = "*'" + c_giveitem + " [Tag_Player] [Nome_Oggetto] [Quantità]'*";
                        if (msg.split(" ")[0].toLowerCase() == c_giveitem) {
                            try {
                                if (message.member.roles.cache.has(ruolo)) {
                                    // comando scritto
                                    let frase = laf + f_giveitem + ".\n" +
                                        "*Ricordate che l'oggetto viene assegnato senza detrarre denaro al giocatore.*";
                                    let mess = msg.split(" ");
                                    let tag = mess[1];
                                    let nome = "";
                                    let count = Math.floor(Math.abs(parseInt(mess.slice(-1)[0])));
                                    let costo, idobj;

                                    if (mess.length == 1) {
                                        // messaggio di aiuto
                                        message.reply(att + frase)
                                    } else {
                                        tab1.findOne({ id: tag }, async function (err, res) {
                                            if (!res) {
                                                // esistenza personaggio autore
                                                message.reply("Il personaggio di " + tag + " non esiste.")
                                            } else {
                                                if (mess.length == 1) {
                                                    // messaggio di aiuto
                                                    message.reply(att + frase)
                                                } else {
                                                    // generazione nome
                                                    if (isNaN(count) == true) {
                                                        count = 1;
                                                        max = mess.length
                                                    } else {
                                                        count = Math.abs(count);
                                                        max = mess.length - 1
                                                    }
                                                    for (let j = 2; j < max; j++) {
                                                        if (j == 2) {
                                                            nome = nome + mess[j];
                                                        } else {
                                                            nome = nome + " " + mess[j];
                                                        }
                                                    }
                                                    nome = nome.toUpperCase();

                                                    // cerco nome nella tabella mercato
                                                    await tab3.findOne({ name: nome }, async function (err, res) {
                                                        if (!res) {
                                                            message.reply("**Attenzione:** stai assegnando un oggetto " +
                                                                "*non presente* all'interno del mercato.")
                                                            idobj = "XYZHB";
                                                            costo = 0;
                                                        } else {
                                                            costo = res.mo;
                                                            idobj = res.id;
                                                        }
                                                    }).clone()

                                                    // coordinazione singolare o plurale
                                                    if (count == 1) {
                                                        c = "L'"
                                                        d = "o"
                                                        e = ""
                                                    } else {
                                                        c = "Gli "
                                                        d = "i"
                                                        e = "no"
                                                    }

                                                    // assegnazione oggetto
                                                    await tab4.findOne({ id_pl: tag, id_obj: idobj }, async function (err, res) {
                                                        if (!res) {
                                                            const g = await new tab4({ id_pl: tag, id_obj: idobj, name: nome, mo: costo, num: count })
                                                            g.save();
                                                        } else {
                                                            tot = res.num + count
                                                            await tab4.updateOne({ id_pl: tag, id_obj: idobj }, { $set: { num: tot } }, { upsert: true })
                                                        }
                                                        message.reply("Il personaggio di " + tag + " ha ottenuto " +
                                                            count + " oggett" + d + " chiamat" + d + " '" + nome + "'.")
                                                    }).clone()
                                                }
                                            }
                                        }).clone()
                                    }
                                } else {
                                    // messaggio non sei admin
                                    message.reply(amm);
                                }
                            } catch (err) {
                                message.reply(mess_err);
                            }
                        }

                        // dare oggetto ad un altro giocatore
                        c_regala = symb + "regalaoggetto";
                        f_regala = "*'" + c_regala + " [Tag_Player] [Nome_Oggetto] [Quantità]'*";
                        if (msg.split(" ")[0].toLowerCase() == c_regala) {
                            try {
                                if (message.member.roles.cache.has(ruolo)) {
                                    // comando scritto
                                    let frase = f_regala + ".\n" +
                                        "Se hai bisogno di leggere gli oggetti, utilizza il comando '" + c_mercato + "'.";
                                    let mess = msg.split(" ");
                                    let tag = mess[1];
                                    let tag2 = "<@" + message.author.id + ">";
                                    let nome = "";
                                    let count = Math.floor(Math.abs(parseInt(mess.slice(-1)[0])));

                                    if (mess.length == 1) {
                                        // messaggio di aiuto
                                        message.reply(att + frase)
                                    } else {
                                        tab1.findOne({ id: tag }, function (err, res) {
                                            if (!res) {
                                                // esistenza personaggio autore
                                                message.reply("Il personaggio di " + tag + " non esiste.")
                                            } else {
                                                tab1.findOne({ id: tag2 }, async function (err, res) {
                                                    if (!res) {
                                                        message.reply("Il personaggio di " + tag2 + " non esiste.")
                                                    } else {
                                                        // generazione nome
                                                        if (isNaN(count) == true) {
                                                            count = 1;
                                                            max = mess.length
                                                        } else {
                                                            count = Math.abs(count);
                                                            max = mess.length - 1
                                                        }
                                                        for (let j = 2; j < max; j++) {
                                                            if (j == 2) {
                                                                nome = nome + mess[j];
                                                            } else {
                                                                nome = nome + " " + mess[j];
                                                            }
                                                        }
                                                        nome = nome.toUpperCase();

                                                        // cerco nome nella tabella mercato
                                                        await tab3.findOne({ name: nome }, async function (err, res) {
                                                            if (!res) {
                                                                message.reply("Controlla se hai scritto bene il messaggio.\n" +
                                                                    "Altrimenti è possibile che l'oggetto cercato non sia ancora " +
                                                                    "disponibile nel mercato.")
                                                            } else {
                                                                idobj = res.id;
                                                                costo = res.mo;
                                                                if (res.mo == 1) {
                                                                    a = "a"
                                                                } else {
                                                                    a = "e"
                                                                }
                                                                if (count == 1) {
                                                                    c = "L'"
                                                                    d = "o"
                                                                    e = ""
                                                                } else {
                                                                    c = "Gli "
                                                                    d = "i"
                                                                    e = "no"
                                                                }

                                                                await tab4.findOne({ id_pl: tag2, id_obj: idobj }, async function (err, res) {
                                                                    if (!res) {
                                                                        message.reply("Il personaggio di " + tag2 + " non ha " +
                                                                            c.toLowerCase() + "oggett" + d + " chiamat" + d + " '" + nome + "'.")
                                                                    } else {
                                                                        tot2 = res.num - count;
                                                                        if (count > res.num) {
                                                                            message.reply("Non puoi regalare un numero di oggetti maggiore dei quali possiedi.");
                                                                        } else {
                                                                            if (count == res.num) {
                                                                                await tab4.deleteOne({ id_pl: tag2, id_obj: idobj });
                                                                            } else {
                                                                                await tab4.updateOne({ id_pl: tag2, id_obj: idobj }, { $set: { num: tot2 } });
                                                                            }
                                                                            await tab4.findOne({ id_pl: tag, id_obj: idobj }, async function (err, res) {
                                                                                if (!res) {
                                                                                    const g = await new tab4({ id_pl: tag, id_obj: idobj, name: nome, mo: costo, num: count })
                                                                                    g.save();
                                                                                } else {
                                                                                    tot = res.num + count;
                                                                                    await tab4.updateOne({ id_pl: tag, id_obj: idobj }, { $set: { num: tot } }, { upsert: true })
                                                                                }
                                                                                message.reply("Il personaggio di " + tag + " ha ottenuto " +
                                                                                    count + " oggett" + d + " chiamat" + d + " '" + nome + "'.")
                                                                            }).clone()
                                                                        }
                                                                    }
                                                                }).clone()
                                                            }
                                                        }).clone()
                                                    }
                                                })
                                            }
                                        })
                                    }
                                } else {
                                    // messaggio non sei admin
                                    message.reply(amm);
                                }
                            } catch (err) {
                                message.reply(mess_err);
                            }
                        }

                        // inventario utente
                        c_inv = symb + "mostrainventario";
                        f_inv = "*'" + c_inv + " [Tag_Player]'*";
                        f_inventario = "*'" + c_inv + "'*";
                        if (msg.split(" ")[0].toLowerCase() == c_inv) {
                            try {
                                let tag;
                                let frase;
                                if (message.member.roles.cache.has(ruolo) ||
                                    message.member.roles.cache.has(utente)) {
                                    if (msg.split(" ").length == 2 && message.member.roles.cache.has(ruolo)) {
                                        // comando scritto
                                        frase = laf + f_inv + ".";
                                        // Dichiarazioni valori
                                        tag = msg.split(" ")[1];
                                    } else if (msg.split(" ").length == 1 && message.member.roles.cache.has(utente)) {
                                        // comando scritto
                                        frase = laf + f_inventario + ".";
                                        // Dichiarazioni valori
                                        tag = "<@" + message.author.id + ">";
                                    } else {
                                        tag = "<@" + message.author.id + ">";
                                    }

                                    mess = "**INVENTARIO DI " + tag + "**";
                                    if (tag.length > 1) {
                                        tab1.findOne({ id: tag }, async function (err, res) {
                                            if (!res) {
                                                message.reply("Il personaggio di " + tag + " non esiste.")
                                            } else {
                                                tab4.find({ id_pl: tag }).sort({ name: "asc" }).exec(function (err, res) {
                                                    if (res == [] || !res || res == null) {
                                                        // inventario vuoto
                                                        message.author.send("L'inventario di " + tag + " è vuoto.");
                                                    } else {
                                                        // dichiaro massimo
                                                        times = res.length;
                                                        // decrescente
                                                        try {
                                                            repeat(function () {
                                                                mess = mess + "\n*" + res[times - 1].name +
                                                                    " (" + res[times - 1].mo + " MO), x" + res[times - 1].num + "*";
                                                                times = times - 1;
                                                            }, times);
                                                            message.author.send(mess);
                                                        } catch (err) {
                                                            message.reply("L'inventario di " + tag + " è vuoto.");
                                                        }
                                                    }
                                                })
                                            }
                                        })
                                    } else {
                                        // messaggio di aiuto
                                        message.reply(att + frase)
                                    }
                                } else {
                                    // messaggio non sei della land
                                    message.reply(amm2);
                                }
                            } catch (err) {
                                message.reply(mess_err);
                            }
                        }

                        // spendi punti downtime
                        c_spdt = symb + "spendipdt";
                        f_spdt = "*'" + c_spdt + " [Numero_PDT]'*";
                        if (msg.split(" ")[0].toLowerCase() == c_spdt) {
                            try {
                                if (message.member.roles.cache.has(ruolo) || message.member.roles.cache.has(utente)) {
                                    // dichiarazioni valori
                                    let tag = "<@" + message.author.id + ">";
                                    let num = Math.floor(parseInt(Math.abs(msg.split(" ")[1])));
                                    frase = laf + f_spdt + ".";

                                    if (msg.split(" ").length == 1) {
                                        // messaggio di aiuto
                                        message.reply(att + frase);
                                    } else if (msg.split(" ").length == 2) {
                                        tab1.findOne({ id: tag }, async function (err, res) {
                                            if (!res) {
                                                message.reply("Il personaggio di " + tag + " non esiste.");
                                            } else {
                                                if (isNaN(num) == true) {
                                                    // messaggio errore
                                                    message.reply("Hai sbagliato a scrivere il numero di punti" +
                                                        " downtime che vuoi spendere.");
                                                } else {
                                                    if (num > res.pdt) {
                                                        message.reply("Non puoi spendere più punti downtime di quanti ne possiedi.");
                                                    } else {
                                                        if (num > 8) {
                                                            message.reply("Non puoi spendere più di otto punti downtime.");
                                                        } else {
                                                            await tab1.findOneAndUpdate({ id: tag }, { $inc: { pdt: -num } })
                                                            messaggio = "Hai speso " + num + " punti downtime, ";
                                                            if (res.pdt - num > 0) {
                                                                messaggio = messaggio + "ne puoi spendere ancora " + (res.pdt - num) + ".";
                                                            } else {
                                                                messaggio = messaggio + "non hai più punti downtime disponibili.";
                                                            }
                                                            message.reply(messaggio);
                                                        }
                                                    }
                                                }
                                            }
                                        })
                                    }
                                } else {
                                    // messaggio non sei nella land
                                    message.reply(amm2);
                                }
                            } catch (err) {
                                message.channel.send(mess_err)
                            }
                        }

                        // crea gilda
                        c_creagilda = symb + "creagilda";
                        f_creagilda = "*'" + c_creagilda + " [ID_Gilda] [Nome_Gilda] [Tag_Capogilda]'*";
                        if (msg.split(" ")[0].toLowerCase() == c_creagilda) {
                            // try {
                            if (message.member.roles.cache.has(ruolo)) {
                                // comando scritto
                                let frase = laf + f_creagilda + ".";
                                if (msg.split(" ").length == 1) {
                                    // formula errata
                                    message.reply(att + frase);
                                } else {
                                    // dichiarazioni valori
                                    let id_gilda = msg.split(" ")[1].toUpperCase();
                                    let name = msg.split(" ")[2].toUpperCase();
                                    let tag = msg.split(" ")[3];
                                    const channela = message.guild.channels.cache.get(canalegilda);
                                    let idA;
                                    let Text;

                                    if (msg.split(" ").length == 1) {
                                        // formula errata
                                        message.reply(att + frase);
                                    } else if (tag.length > 1 && name.length > 1 && msg.split(" ").length == 4) {
                                        tab1.findOne({ id: tag }, async function (err, res) {
                                            if (!res) {
                                                message.reply("Non esiste il capogilda!\n" +
                                                    "Non puoi formare una gilda senza capogilda!");
                                            } else {
                                                if (res.mo >= 150) {
                                                    tab7.findOne({ id_p: tag }, async function (err, res2) {
                                                        if (!res2 || res2.capo == true) {
                                                            // controlla se la gilda è nuova
                                                            tab6.findOne({ id_pl: tag }, async function (err, res) {
                                                                if (!res) {
                                                                    const g = new tab6({
                                                                        id_guild: id_gilda, name_guild: name, id_pl: tag,
                                                                        n_m: 1, n_member: 5, fame: 1, inf: 1, status: 1,
                                                                        gold: 0, goldtot: 250, rankup_gold: 750,
                                                                        level: 1, rendita: 50
                                                                    })
                                                                    g.save();
                                                                } else {
                                                                    old_id = res.id_guild;
                                                                    await tab8.deleteOne({ id: old_id });
                                                                    await tab6.findOneAndUpdate({ id_pl: tag }, {
                                                                        id_guild: id_gilda, name_guild: name, n_m: 1, n_member: 5,
                                                                        fame: 1, inf: 1, status: 1, gold: 0, goldtot: 250,
                                                                        rankup_gold: 750, level: 1, rendita: 50
                                                                    })
                                                                    // controlla se ci sono thread vecchi della gilda
                                                                    tab5.find({ id_pl: old_id }, async function (err, res1) {
                                                                        if (!res1) {
                                                                            console.log("Nuova Gilda");
                                                                        } else {
                                                                            for (let i = 0; i < res1.length; i++) {
                                                                                Text = message.guild.channels.cache.get(res1[i].id_chan)
                                                                                try {
                                                                                    await Text.delete()
                                                                                        .then(deletedThread => console.log("Ho cancellato il thread " + deletedThread.id))
                                                                                        .catch(console.error);
                                                                                } catch {
                                                                                    console.log("Qualcosa è andato storto.")
                                                                                }
                                                                            }
                                                                            await tab5.deleteMany({ id_pl: old_id });
                                                                            // cancella oggetti della gilda
                                                                            await tab4.deleteMany({ id_pl: old_id });
                                                                        }
                                                                    })

                                                                    // rendita mensile gilda
                                                                    tab2.find({ id: old_id }, async function (err, res2) {
                                                                        if (!res2) {
                                                                            console.log("Non la trovo.");
                                                                        } else {
                                                                            await tab2.deleteOne({ id: old_id });
                                                                        }
                                                                    });

                                                                    // capogilda nella lista della gilda
                                                                    tab7.find({ id_g: old_id }, async function (err, res3) {
                                                                        if (!res3) {
                                                                            console.log("Non lo trovo.");
                                                                        } else {
                                                                            await tab7.deleteMany({ id: old_id });
                                                                        }
                                                                    });
                                                                }

                                                                // crea thread gilda
                                                                await channela.threads
                                                                    .create({
                                                                        name: 'Gilda: ' + name,
                                                                        autoArchiveDuration: 10080
                                                                    })
                                                                    .then(res => idA = res.id)
                                                                    .catch(console.error);
                                                                TextA = message.guild.channels.cache.get(idA)
                                                                await TextA.send("Ciao " + tag + "," + "\nquesto thread sarà dedicato " +
                                                                    "ad ogni attività della gilda.\nSarai a capo della gilda, " +
                                                                    "a te è stato dato l'oneroso compito di gestirla e dovrai essere l'anello del gruppo.\n" +
                                                                    "Che possiate divertirvi e mettetervi alla prova!" +
                                                                    "Se hai bisogno, usa il tag <@&" + ruolo + ">.");

                                                                // valore delle milestones
                                                                let rendm = new Date();
                                                                rendm.setMonth(rendm.getMonth() + 1);
                                                                rendm.setHours(0, 0, 0, 0);
                                                                // inserimento nel DB
                                                                const i = new tab2({ id: id_gilda, type: "pdt", date: rendm });
                                                                i.save();
                                                                // canale gilda
                                                                const f = new tab5({ id_pl: id_gilda, name_pl: name, id_chan: idA, type: "Gilda" });
                                                                f.save();
                                                                // coppia PG-gilda (in questo caso capogilda)
                                                                const m = new tab7({ id_g: id_gilda, id_p: tag, capo: true });
                                                                m.save();
                                                                // gilda
                                                                const h = new tab8({ id: id_gilda, type: "GILDA" })
                                                                h.save();
                                                                // messaggio di buon fine
                                                                message.reply(tag + " ha fondato una gilda!\n" +
                                                                    "Diamo il benvenuto alla gilda **" + name + "**!");
                                                            })

                                                            // aggiornamento variabile
                                                            listaCanali = canali();

                                                            //scalo denaro
                                                            await tab1.findOneAndUpdate({ id: tag }, { $set: { mo: res.mo - 150 } });
                                                        } else {
                                                            message.reply(tag + " è un membro di una gilda già esistente.\n" +
                                                                "Non può fondare una nuova gilda finché non esce dalla Gilda in cui si trova.")
                                                        }
                                                    })
                                                } else {
                                                    manc = Math.abs(150 - res.mo);
                                                    if (manc == 1) {
                                                        des = " ";
                                                        a = "a ";
                                                    } else {
                                                        des = "no ";
                                                        a = "e ";
                                                    }
                                                    message.reply(tag + " non hai abbastanza denaro per fondare una gilda.\n" +
                                                        "Ti manca" + des + manc + " monet" + a + "d'oro.")
                                                }
                                            }
                                        });
                                    } else {
                                        // formula errata
                                        message.reply(att + frase);
                                    }
                                }
                            } else {
                                // messaggio non sei nella land
                                message.reply(amm);
                            }
                            // } catch (err) {
                            //     message.reply(mess_err);
                            // }
                        }

                        // levelup gilda
                        c_levelupgilda = symb + "livellagilda";
                        f_levelupgilda = "*'" + c_levelupgilda + " [ID_Gilda] [Attributo]'*";
                        if (msg.split(" ")[0].toLowerCase() == c_levelupgilda) {
                            try {
                                if (message.member.roles.cache.has(ruolo)) {
                                    // comando scritto
                                    let frase = laf + f_levelupgilda + ".\n" +
                                        "All'interno del campo attributo puoi inserire uno di questi tre valori:\n" +
                                        "1) Fama,\n2) Influenza,\n3) Status.";
                                    // dichiarazioni valori
                                    let tag = msg.split(" ")[1].toUpperCase();
                                    let attr = msg.split(" ")[2].toUpperCase();
                                    let arr = [];
                                    let lvl;
                                    let val;
                                    let gold_p;
                                    let mog;
                                    let rnk;
                                    // condizioni
                                    if (msg.split(" ").length == 1) {
                                        // formula errata
                                        message.reply(att + frase);
                                    } else if (tag.length > 1 && attr.length > 1 && msg.split(" ").length == 3) {
                                        // cerca se la gilda esiste
                                        tab6.findOne({ id_guild: tag }, async function (err, res) {
                                            if (!res) {
                                                message.reply("Non puoi livellare una gilda che non esiste.");
                                            } else {
                                                // definizione livello gilda
                                                lvl = res.level;
                                                if (attr == "FAMA") {
                                                    val = 0;
                                                } else if (attr == "INFLUENZA") {
                                                    val = 1;
                                                } else if (attr == "STATUS") {
                                                    val = 2;
                                                } else {
                                                    val = 3;
                                                    message.reply("Hai sbagliato l'attributo.");
                                                }
                                                // se non ha sbagliato l'attributo
                                                if (val >= 0 && val < 3) {
                                                    // definizione max e min attributi
                                                    arr = [res.fame, res.inf, res.status];
                                                    // arr.push(res.fame, res.inf, res.status);
                                                    max = Math.max(...arr);
                                                    min = Math.min(...arr);
                                                    index_max = arr.indexOf(max);
                                                    index_min = arr.indexOf(min);
                                                    // condizione minima per livellare
                                                    if (val == index_max && (max - min) >= 2) {
                                                        message.reply("Non puoi livellare un attributo con più di due punti " +
                                                            " di scarto dal valore più inferiore.\nLivella un altro attributo.");
                                                    } else {
                                                        // funzione aumento livello gilda
                                                        if (lvl >= 10) {
                                                            message.reply("La gilda ha già raggiunto il livello massimo.");
                                                        } else {
                                                            // tag del capogilda
                                                            tag_p = res.id_pl;
                                                            tab1.findOne({ id: tag_p }, async function (err, res2) {
                                                                if (!res2) {
                                                                    message.reply("Il capogilda non esiste.");
                                                                } else {
                                                                    //denaro player
                                                                    gold_p = res2.mo;
                                                                    // rank up gilda
                                                                    rnk = res.rankup_gold;
                                                                    // cassaforte attuali gilda
                                                                    mog = res.gold;
                                                                    if (mog + gold_p >= rnk) {
                                                                        if (mog <= rnk) {
                                                                            rnk = rnk - mog;
                                                                            mog = 0;
                                                                            if (rnk > 0) {
                                                                                gold_p = gold_p - rnk;
                                                                            }
                                                                        } else {
                                                                            mog = mog - rnk;
                                                                        }
                                                                    }
                                                                    // livello successivo
                                                                    w = lvl + 1;
                                                                    // livello
                                                                    let a0 = lvl;
                                                                    // rendita mensile
                                                                    let a1 = rendita(lvl);
                                                                    // membri
                                                                    let a2 = members(lvl);
                                                                    // costo upgrade
                                                                    let a3 = rendita(w) * members(lvl);
                                                                    // cassaforte, max gold gilda
                                                                    let a4 = cassaforte(lvl);
                                                                    // level up
                                                                    a0 = a0 + 1;
                                                                    // 0 = fama, 1 = influenza, 2 = status
                                                                    if (val == 0) {
                                                                        await tab6.findOneAndUpdate({ id: tag }, {
                                                                            n_member: a2, fame: res.fame + 1, gold: mog, goldtot: a4,
                                                                            rankup_gold: a3, level: a0, rendita: a1
                                                                        })
                                                                    } else if (val == 1) {
                                                                        await tab6.findOneAndUpdate({ id: tag }, {
                                                                            n_member: a2, inf: res.inf + 1, gold: mog, goldtot: a4,
                                                                            rankup_gold: a3, level: a0, rendita: a1
                                                                        })
                                                                    } else if (val == 2) {
                                                                        await tab6.findOneAndUpdate({ id: tag }, {
                                                                            n_member: a2, status: res.status + 1, gold: mog, goldtot: a4,
                                                                            rankup_gold: a3, level: a0, rendita: a1
                                                                        })
                                                                    }
                                                                    await tab1.findOneAndUpdate({ id: tag_p }, { $set: { mo: gold_p } });
                                                                    message.reply("La gilda **" + res.name_guild + "** è salita al **livello " +
                                                                        a0 + "** incrementando l'attributo **" + attr + "**.\n" +
                                                                        "Ora può ospitare **" + a2 + " membri**, può conservare fino a **" + a4 +
                                                                        " monete d'oro** e la sua rendita mensile è di **" + a1 + " monete d'oro**.");
                                                                }
                                                            });
                                                        }
                                                    }
                                                }
                                            }
                                        })
                                    } else {
                                        message.reply(mess_err);
                                    }
                                } else {
                                    // messaggio non sei nella land
                                    message.reply(amm);
                                }
                            } catch (err) {
                                message.reply(mess_err);
                            }
                        }

                        // mostra info gilda
                        c_infogilda = symb + "mostragilda";
                        f_infogildamas = "*'" + c_infogilda + " [ID_Gilda]'*";
                        f_infogilda = "*'" + c_infogilda + "'*";
                        if (msg.split(" ")[0].toLowerCase() == c_infogilda) {
                            try {
                                let tag;
                                let frase;
                                let mess = "**INFO GILDA**:\n";
                                if (message.member.roles.cache.has(ruolo)
                                    || message.member.roles.cache.has(utente)) {
                                    if (msg.split(" ").length == 2 && message.member.roles.cache.has(ruolo)) {
                                        // comando scritto
                                        frase = laf + f_infogildamas + ".";
                                        // Dichiarazioni valori
                                        tag = msg.split(" ")[1];
                                    } else if (msg.split(" ").length == 1 && message.member.roles.cache.has(utente)) {
                                        // comando scritto
                                        frase = laf + f_infogildamas + ".";
                                        // Dichiarazioni valori
                                        tag = "<@" + message.author.id + ">";
                                    } else {
                                        tag = "<@" + message.author.id + ">";
                                    }
                                    // condizioni
                                    if (msg.split(" ").length == 1 && tag.length > 1) {
                                        tab1.findOne({ id: tag }, async function (err, res) {
                                            if (!res) {
                                                message.reply("La gilda " + tag + " non esiste.");
                                            } else {
                                                tab7.findOne({ id_p: tag }, async function (err, res2) {
                                                    if (!res2) {
                                                        message.reply("La gilda " + tag + " non esiste.");
                                                    } else {
                                                        tab6.findOne({ id_guild: res2.id_g }, async function (err, res) {
                                                            if (!res) {
                                                                message.reply("La gilda " + tag + " non esiste.");
                                                            } else {
                                                                mess = mess + gilda(res);
                                                                message.author.send(mess);
                                                            }
                                                        });
                                                    }
                                                });
                                            }
                                        });
                                    } else if (msg.split(" ").length == 2 && tag.length > 1) {
                                        tab6.findOne({ id_guild: tag }, async function (err, res) {
                                            if (!res) {
                                                message.reply("La gilda " + tag + " non esiste.");
                                            } else {
                                                mess = mess + gilda(res);
                                                message.author.send(mess);
                                            }
                                        });
                                    } else {
                                        // formula errata
                                        message.reply(att + frase);
                                    }
                                } else {
                                    // messaggio non sei nella land
                                    message.reply(amm2);
                                }
                            } catch (err) {
                                message.reply(mess_err);
                            }
                        }

                        // -controllare .creapg rispetto alla questione del cancellare
                        //  un pg all'interno della gilda quando è l'unico componente
                        // -controllare .mostramercato e imporre un limite di 4k caratteri
                        //  al messaggio che esce fuori (inserire una variabile esterna)
                        //  così se dovesse cambiare, basterà cambiare la variabile
                        // -ciò che sta VVV qui sotto VVV potrebbe cambiare perché
                        //  hai aggiunto nuove variabili nelle tabelle!!!
                        // -cambiare il valore dei canali e dei ruoli in base al server:
                        //  -id_pl: id server
                        //  -name_pl: nome server codificato (immutabile)
                        //  -id_chan: id canale/ruolo/capo/capo
                        //  -type: canale/ruolo/capo/bannato
                        // -inserire per ogni creazione gilda/pg il server di riferimento
                        //  così la stessa persona/gilda possono operare su altri server
                        // -inserire un comando per l'help e costruzione guidata
                        //  di quello che ti potrebbe servire
                        // -".setnewserver" un comando che, appena dopo aver creato un server,
                        //  ti permette di rendere il server immediatamente attivo
                        //  bisogna creare un server e aver inserito un ruolo di admin e utente
                        //  e lui farà il resto, bisogna vedere come farlo
                        // -inserire un processo di protezione per tutti i server che vuoi
                        //  bannare dall'utilizzo del bot

                        // mostra info tutte le gilde
                        c_infogilde = symb + "mostragilde";
                        f_infogilde = "*'" + c_infogilde + "'*";
                        if (msg.split(" ")[0].toLowerCase() == c_infogilde) {
                            try {
                                if (message.member.roles.cache.has(ruolo)) {
                                    // comando scritto
                                    let frase = laf + f_infogilde + ".";
                                    let tag = "<@" + message.author.id + ">";
                                    mess = "**LISTA DELLE GILDE**:\n";
                                    // condizioni
                                    if (msg.split(" ").length > 1) {
                                        // formula errata
                                        message.reply(att + frase);
                                    } else {
                                        tab6.find().sort({ level: "desc" }).exec(function (err, res) {
                                            if (!res) {
                                                message.channel.send("Qualcosa è andato storto.");
                                            } else {
                                                // dichiaro massimo
                                                times = res.length;
                                                // decrescente
                                                try {
                                                    repeat(function () {
                                                        mess = mess +
                                                            gilda(res[times - 1]) +
                                                            "\n---\n";
                                                        times = times - 1;
                                                    }, times);
                                                    message.author.send(mess)
                                                } catch (err) {
                                                    message.reply(mess_err);
                                                }
                                            }
                                        });
                                    }
                                } else {
                                    // messaggio non sei master
                                    message.reply(amm);
                                }
                            } catch (err) {
                                message.reply(mess_err);
                            }
                        }

                        // capogilda nuovo
                        c_nuovocapogilda = symb + "nuovocapogilda";
                        f_nuovocapogilda = "*'" + c_nuovocapogilda + " [Tag_Vecchio_Capogilda] [Tag_Nuovo_Capogilda]'*";
                        if (msg.split(" ")[0].toLowerCase() == c_nuovocapogilda) {
                            try {
                                //dichiarazione capogilda attuale
                                let tag1 = msg.split(" ")[1];
                                // comando scritto
                                let frase = laf + f_nuovocapogilda + ".";
                                if (msg.split(" ").length == 1) {
                                    // formula errata
                                    message.reply(att + frase);
                                } else if (message.member.roles.cache.has(ruolo) || "<@" + message.author.id + ">" == tag1) {
                                    let tag2 = msg.split(" ")[2];
                                    // condizione
                                    if (msg.split(" ").length == 1) {
                                        // formula errata
                                        message.reply(att + frase);
                                    } else {
                                        tab1.findOne({ id: tag1 }, async function (err, res) {
                                            if (!res) {
                                                message.reply("L'attuale capogilda non esiste!");
                                            } else {
                                                tab1.findOne({ id: tag2 }, async function (err, res) {
                                                    if (!res) {
                                                        message.reply("Il nuovo capogilda non esiste!");
                                                    } else {
                                                        tab6.findOne({ id_pl: tag1 }, async function (err, res3) {
                                                            if (!res3) {
                                                                message.reply("Non sei a capo di nessuna gilda.");
                                                            } else {
                                                                tab7.findOne({ id_g: res3.id_guild, id_p: tag2 }, async function (err, res4) {
                                                                    if (!res4) {
                                                                        message.reply(tag2 + " non fa parte della gilda.");
                                                                    } else {
                                                                        await tab6.findOneAndUpdate({ id_pl: tag1 }, { id_pl: tag2 });
                                                                        await tab7.findOneAndUpdate({ id_p: tag1 }, { capo: false });
                                                                        await tab7.findOneAndUpdate({ id_p: tag2 }, { capo: true });
                                                                        tab5.findOne({ id_pl: res3.id_guild }, async function (err, res) {
                                                                            if (!res) {
                                                                                message.reply("C'è stato un errore imprevisto.");
                                                                            } else {
                                                                                client.channels.cache.get(res.id_chan).send(
                                                                                    "Il nuovo capo della gilda **" + res.name_pl +
                                                                                    "** è " + tag2 + ".")
                                                                            }
                                                                        });
                                                                    }
                                                                });
                                                            }
                                                        });
                                                    }
                                                })
                                            }
                                        })
                                    }
                                } else {
                                    // messaggio non sei nella land
                                    message.reply("Non hai i permessi per farlo.");
                                }
                            } catch (err) {
                                message.reply(mess_err);
                            }
                        }

                        // aggiungi membro
                        c_addmember = symb + "aggiungimembro";
                        f_addmember = "*'" + c_addmember + " [Tag_Gilda] [Tag_Nuovo_Membro]'*";
                        if (msg.split(" ")[0].toLowerCase() == c_addmember) {
                            try {
                                if (message.member.roles.cache.has(ruolo) || message.member.roles.cache.has(utente)) {
                                    // comando scritto
                                    let frase = laf + f_addmember + ".";
                                    let autore = "<@" + message.author.id + ">";
                                    let tag_g = msg.split(" ")[1];
                                    let tag_p = msg.split(" ")[2];
                                    // condizione
                                    if (msg.split(" ").length != 3) {
                                        // formula errata
                                        message.reply(att + frase);
                                    } else {
                                        tab7.findOne({ id_p: autore, id_g: tag_g, capo: true }, async function (err, res5) {
                                            if (!res5 && !message.member.roles.cache.has(ruolo)) {
                                                // evitare che persone a caso possano aggiungere membri in altre gilde
                                                message.reply("Non hai il permesso per fare questa operazione.");
                                            } else {
                                                tab6.findOne({ id_guild: tag_g }, async function (err, res) {
                                                    if (!res) {
                                                        message.reply("La gilda non esiste!");
                                                    } else {
                                                        if (res.n_m >= res.n_member) {
                                                            message.reply("La gilda è già al completo.");
                                                        } else {
                                                            tab1.findOne({ id: tag_p }, async function (err, res1) {
                                                                if (!res1) {
                                                                    message.reply("Il nuovo membro non esiste!");
                                                                } else {
                                                                    await tab7.findOne({ id_p: tag_p }, async function (err, res2) {
                                                                        if (!res2) {
                                                                            const h = new tab7({ id_g: tag_g, id_p: tag_p, capo: false })
                                                                            h.save();
                                                                            await tab6.findOneAndUpdate({ id_guild: tag_g }, { $inc: { n_m: 1 } });
                                                                            message.reply(tag_p + " è un nuovo membro della gilda " +
                                                                                res.name_guild + ".");
                                                                        } else {
                                                                            message.reply(tag_p + " è già all'interno di una gilda.");
                                                                        }
                                                                    }).clone();
                                                                }
                                                            });
                                                        }
                                                    }
                                                });
                                            }
                                        });
                                    }
                                } else {
                                    // messaggio non sei nella land
                                    message.reply(amm2);
                                }
                            } catch (err) {
                                message.reply(mess_err);
                            }
                        }

                        // rendita gilda
                        c_renditag = symb + "renditagilda";
                        f_renditag = "*'" + c_renditag + "'*";
                        if (msg.split(" ")[0].toLowerCase() == c_renditag) {
                            try {
                                if (message.member.roles.cache.has(ruolo) || message.member.roles.cache.has(utente)) {
                                    // dichiarazioni valori
                                    let tag = "<@" + message.author.id + ">";
                                    giorno = new Date(oggi());
                                    frase = laf + f_renditag + ".";
                                    let val;
                                    // condizioni
                                    if (msg.split(" ").length > 1) {
                                        // messaggio di aiuto
                                        message.reply(att + frase)
                                    } else {
                                        tab1.findOne({ id: tag }, async function (err, res) {
                                            if (!res) {
                                                message.reply("Il personaggio di " + tag + " non esiste.")
                                            } else {
                                                tipo = "pdt";
                                                num = 30;
                                                data = addDays(giorno, num);
                                                tab7.findOne({ id_p: tag }, async function (err, res) {
                                                    if (!res) {
                                                        // messaggio di errore
                                                        message.reply(tag + " non sei all'interno di alcuna gilda.")
                                                    } else {
                                                        gilda = res.id_g;
                                                        tab6.findOne({ id_guild: gilda }, async function (err, res2) {
                                                            if (!res2) {
                                                                // messaggio di errore critico
                                                                message.reply(mess_err);
                                                            } else {
                                                                capo = res2.id_pl;
                                                                tab2.findOne({ id: gilda, type: tipo }, async function (err, res) {
                                                                    if (!res) {
                                                                        if (num == 1) {
                                                                            a = "o"
                                                                        } else {
                                                                            a = "i"
                                                                        }
                                                                        const dt = new tab2({ id: gilda, type: tipo, date: data });
                                                                        dt.save();
                                                                        val = true;
                                                                    } else {
                                                                        if (giorno < res.date) {
                                                                            message.reply("La rendita mensile potrà essere riscattata il giorno: "
                                                                                + trad(res.date.toDateString()) + ".");
                                                                            val = false;
                                                                        } else {
                                                                            await tab2.findOneAndUpdate({ id: gilda, type: tipo }, { $set: { date: data } })
                                                                            val = true;
                                                                        }
                                                                    }
                                                                    if (val == true) {
                                                                        tab6.findOne({ id_guild: gilda }, async function (err, res) {
                                                                            tot = res.gold + res.rendita;
                                                                            if (res.gold == 1) {
                                                                                ss = "a"
                                                                            } else {
                                                                                ss = "e"
                                                                            }
                                                                            if (tot < 0) {
                                                                                message.reply("Nessuna gilda può indebitarsi, correggi il valore.\n" +
                                                                                    "Il denaro della gilda '" + res.name_guild + "' ammonta a " +
                                                                                    res.mo + " monet" + ss + " d'oro.")
                                                                            } else {
                                                                                if (res.goldtot - tot >= 0) {
                                                                                    x = tot;
                                                                                    y = 0;
                                                                                } else {
                                                                                    x = res.goldtot;
                                                                                    y = tot - res.goldtot;
                                                                                }
                                                                                z = res.rendita - y;
                                                                                if (y == 0) {
                                                                                    message.reply("La gilda '" + res.name_guild + "' ha riscattato la " +
                                                                                        "rendita di " + res.rendita + " monete d'oro.\n" +
                                                                                        "Potrai richiederla nuovamente il giorno: "
                                                                                        + trad(data.toDateString()) + ".");
                                                                                } else {
                                                                                    await tab1.findOneAndUpdate({ id: capo }, { $inc: { mo: y } });
                                                                                    message.reply("La gilda '" + res.name_guild + "' possiede " +
                                                                                        res.gold + " monet" + ss + " d'oro e non può possederne più di " +
                                                                                        res.goldtot + ", la rendita è di " + res.rendita + " monete d'oro, " +
                                                                                        "ne verranno accreditate " + z + " alla gilda e " + y +
                                                                                        " al capogilda " + capo + ".\n" +
                                                                                        "Potrai richiederla nuovamente il giorno: "
                                                                                        + trad(data.toDateString()) + ".");
                                                                                }
                                                                                await tab6.updateOne({ id_guild: gilda }, { $set: { gold: x } });
                                                                            }
                                                                        })
                                                                    }
                                                                });
                                                            }
                                                        });
                                                    }
                                                });
                                            }
                                        });
                                    }
                                } else {
                                    // messaggio non sei nella land
                                    message.reply(amm2);
                                }
                            } catch (err) {
                                message.channel.send(mess_err)
                            }
                        }

                        // meteo
                        c_meteo = symb + "meteo";
                        f_meteo = "*'" + c_meteo + "'*";
                        if (msg.split(" ")[0].toLowerCase() == c_meteo) {
                            if (message.member.roles.cache.has(ruolo) || message.member.roles.cache.has(utente)) {
                                try {
                                    message.reply(meteo());
                                } catch (err) {
                                    message.reply(mess_err);
                                }
                            } else {
                                // messaggio non sei nella land
                                message.reply(amm2);
                            }
                        }
                    } else {
                        console.log("Canale non riconosciuto.")
                    }
                } else {
                    // il server è stato bannato
                    message.reply("Questo server è stato bannato dal proprietario del bot.")
                }
            }
        })
})

// Nuovo utente land
client.on('guildMemberUpdate', (oldMember, newMember) => {
    let txtChannel = client.channels.cache.get(canaleBenv); //my own text channel, you may want to specify your own
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
            for (let i = 0; i < oldRoleIDs.length; i++) {
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

function livello(mss) {
    try {
        let lvls = 0;
        if (mss < 2) {
            lvls = 1;
        } else if (mss < 6) {
            lvls = 2;
        } else if (mss < 12) {
            lvls = 3;
        } else if (mss < 20) {
            lvls = 4;
        } else if (mss < 30) {
            lvls = 5;
        } else if (mss < 40) {
            lvls = 6;
        } else if (mss < 50) {
            lvls = 7;
        } else if (mss < 60) {
            lvls = 8;
        } else if (mss < 72) {
            lvls = 9;
        } else if (mss < 84) {
            lvls = 10;
        } else if (mss < 96) {
            lvls = 11;
        } else if (mss < 111) {
            lvls = 12;
        } else if (mss < 126) {
            lvls = 13;
        } else if (mss < 141) {
            lvls = 14;
        } else if (mss < 156) {
            lvls = 15;
        } else if (mss < 171) {
            lvls = 16;
        } else if (mss < 186) {
            lvls = 17;
        } else if (mss < 206) {
            lvls = 18;
        } else if (mss < 226) {
            lvls = 19;
        } else if (mss < 246) {
            lvls = 20;
        } else {
            mss = mss - 246;
            lvls = 20 + Math.floor(mss / 30);
        }
        return lvls
    } catch (err) {
        console.log(mess_err)
    }
}

function milestones(level) {
    try {
        let msv = 0;
        if (level <= 6) {
            msv = (level) * (level - 1)
        } else if (level <= 9) {
            msv = (level - 3) * 10
        } else if (level <= 12) {
            msv = ((level - 3) * 10) + ((level - 9) * 2)
        } else if (level <= 18) {
            msv = ((level - 3) * 10) + ((level - 9) * 2) + ((level - 12) * 3)
        } else if (level <= 20) {
            msv = ((level - 3) * 10) + ((level - 9) * 2) + ((level - 12) * 3) + ((level - 18) * 5)
        }
        return msv
    } catch (err) {
        console.log(mess_err)
    }
}

function ttier(level) {
    try {
        let tier = 1;
        tier = Math.ceil(level / 4);
        return tier;
    } catch (err) {
        console.log(mess_err)
    }
}

function addDays(date, days) {
    try {
        let result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    } catch (err) {
        console.log(mess_err)
    }
}

function oggi() {
    try {
        let today = new Date();
        let data = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        return data;
    } catch (err) {
        console.log(mess_err)
    }
}

function createid(x) {
    try {
        x = x.toLowerCase();
        y = "";
        w = "";
        z = "";
        // composizione
        for (let i = 0; i < x.split("").length; i++) {
            // se non vocale
            if (x.split("")[i] != "a" &&
                x.split("")[i] != "e" &&
                x.split("")[i] != "i" &&
                x.split("")[i] != "o" &&
                x.split("")[i] != "u" &&
                x.split("")[i] != "à" &&
                x.split("")[i] != "è" &&
                x.split("")[i] != "é" &&
                x.split("")[i] != "ì" &&
                x.split("")[i] != "ò" &&
                x.split("")[i] != "ù") {
                y = y + x.split("")[i]
            } else {
                w = w + x.split("")[i]
            }
        }
        // dichiarazione
        i = 0;
        do {
            while (i != y.length && z.length != 3) {
                if (y.split("")[i] != z.split("").slice(-1)[0]) {
                    z = z + y.split("")[i]
                }
                i = i + 1
            }
            i = 0;
            while (i != w.length && z.length != 3) {
                if (w.split("")[i] != z.split("").slice(-1)[0]) {
                    z = z + w.split("")[i]
                }
                i = i + 1
            }
            while (z.length != 3) {
                z = z + "X"
            }
        }
        while (z.length != 3);
        return z.toUpperCase()
    } catch (err) {
        console.log(mess_err)
    }
}

function repeat(func, times) {
    try {
        func();
        times && --times && repeat(func, times);
    } catch (err) {
        console.log(mess_err)
    }
}

function canali() {
    try {
        const a = [];
        const j = [];
        let k;
        let m;
        // ATTENZIONE!!!
        // Inserire valori da trovare
        // ATTENZIONE!!!
        let c = ["BANNATO", "MERCATO", "DOWNTIME", "GILDA"/*, "MASTER", "PLAYER"*/];
        for (let i = 0; i < c.length + 1; i++) {
            a[i] = [];
            j[i] = 0;
        }
        return new Promise((resolve, reject) => {
            tab5.find().exec(function (err, res) {
                if (!res) {
                    console.log("Non c'è nulla.")
                } else {
                    // costruzione array per tipologia
                    for (let i = 0; i < res.length; i++) {
                        tipo = res[i].type.toUpperCase();
                        if (c.includes(tipo)) {
                            m = c.indexOf(tipo);
                        } else {
                            m = c.length;
                        }
                        k = j[m];
                        a[m][k] = res[i].id_chan;
                        k++;
                        j[m] = k;
                    }
                }
                resolve(a);
            })
        })
    } catch (err) {
        console.log(mess_err)
    }
}

function trad(x) {
    try {
        //giorni settimana
        a = x.split(" ")[0]
        if (a == "Mon") {
            a = "Lunedì"
        } else if (a == "Tue") {
            a = "Martedì"
        } else if (a == "Wed") {
            a = "Mercoledì"
        } else if (a == "Thu") {
            a = "Giovedì"
        } else if (a == "Fri") {
            a = "Venerdì"
        } else if (a == "Sat") {
            a = "Sabato"
        } else if (a == "Sun") {
            a = "Domenica"
        }

        //mesi
        b = x.split(" ")[1]
        if (b == "Jan") {
            b = "Gennaio"
        } else if (b == "Feb") {
            b = "Febbraio"
        } else if (b == "Mar") {
            b = "Marzo"
        } else if (b == "Apr") {
            b = "Aprile"
        } else if (b == "May") {
            b = "Maggio"
        } else if (b == "Jun") {
            b = "Giugno"
        } else if (b == "Jul") {
            b = "Luglio"
        } else if (b == "Aug") {
            b = "Agosto"
        } else if (b == "Sep") {
            b = "Settembre"
        } else if (b == "Oct") {
            b = "Ottobre"
        } else if (b == "Nov") {
            b = "Novembre"
        } else if (b == "Dec") {
            b = "Dicembre"
        }

        //numero giorni con 0 davanti
        c = x.split(" ")[2]
        if (c == "01") {
            c = "1"
        } else if (c == "02") {
            c = "2"
        } else if (c == "03") {
            c = "3"
        } else if (c == "04") {
            c = "4"
        } else if (c == "05") {
            c = "5"
        } else if (c == "06") {
            c = "6"
        } else if (c == "07") {
            c = "7"
        } else if (c == "08") {
            c = "8"
        } else if (c == "09") {
            c = "9"
        }

        //anno
        d = x.split(" ")[3]

        //composizione completa 
        y = a + " " + c + " " + b + " " + d

        //restituzione valore
        return y
    } catch (err) {
        console.log(mess_err)
    }
}

function meteo() {
    try {
        //definizione oggi ed anno associato
        let td = new Date();
        //let td = new Date('07/23/2022');
        let y1 = td.getFullYear();
        if (y1 % 4 == 0) {
            md = new Date('12/22/' + y1);
            if (td > md) {
                y1 = y1 + 1;
                md = new Date('12/22/' + y1)
            }
            b = true;
        } else {
            md = new Date('12/21/' + y1);
            if (td > md) {
                y1 = y1 + 1;
                md = new Date('12/21/' + y1)
            }
            b = false;
        }

        y2 = y1 - 1;
        if (y2 % 4 == 0) {
            //definizione (mm/dd/yyyy)
            nd = new Date('12/22/' + y2);
        } else {
            nd = new Date('12/21/' + y2);
        }

        //differenza in millisecondi
        dif = td.getTime() - nd.getTime();
        dif2 = md.getTime() - nd.getTime();
        //conversione in giorni
        //dall'inizio dell'anno (inv) ad oggi
        tot = Math.ceil(dif / (1000 * 3600 * 24));
        //giorni totali nell'anno
        tot2 = Math.ceil(dif2 / (1000 * 3600 * 24));

        //temperatura media in quel giorno dell'anno (oggi)
        nt = Math.round((-Math.cos(2 * Math.PI * tot / tot2) + 1.5) * 100) / 10;

        //alba
        if (b == true) {
            fd = new Date('06/20/' + y1);
        } else {
            fd = new Date('06/21/' + y1);
        }
        //differenza tra sost. inverno(nd) ed estate(fd)
        dif3 = fd.getTime() - nd.getTime();
        //in giorni
        tot3 = Math.ceil(dif3 / (1000 * 3600 * 24));
        //totale giorni - int. tra sost. inverno ed estate
        tot4 = tot2 - tot3;
        //v alba e w tramonto
        if (tot <= tot3) {
            v = 453 - 180 * tot / tot3;
            v2 = 453 - 180 * (tot + 1) / tot3;
            w = 1013 + 180 * tot / tot3;
        } else {
            tot = tot - tot3;
            v = 273 + 180 * tot / tot4;
            v2 = 273 + 180 * (tot + 1) / tot4;
            w = 1193 - 180 * tot / tot4;
        }

        //temperatura
        alba = Math.round(v / 60 * 100) / 100;
        alba2 = Math.round(v2 / 60 * 100) / 100;
        tram = Math.round(w / 60 * 100) / 100;
        orario = td.getHours() + Math.round(td.getMinutes() / 60 * 100) / 100;
        picco = 14;
        media = (picco - alba) / 2 + alba;
        min = Math.round((nt - media + alba) * 10) / 10;
        max = Math.round((nt + picco - alba) * 10) / 10;
        if (orario >= alba && orario <= picco) {
            tmp = Math.round((min + ((max - min) * (orario - alba) / (picco - alba))) * 10) / 10;
        } else {
            if (orario < alba) {
                orario = orario + 24;
            }
            tmp = Math.round((max - ((max - min) * (orario - picco) / (24 - picco + alba))) * 10) / 10;
        }

        //ciclo lunare
        ld = new Date('7/27/2022');
        ore = td.getHours() * 60 + td.getMinutes;
        dif4 = td.getTime() - ld.getTime();
        if (ore < alba) {
            dif4 = dif4 - 1;
        }
        tot5 = Math.ceil(dif4 / (1000 * 3600 * 24));
        cl = 29;
        gl = (tot5 % cl) + 1;
        if (gl == 1) {
            fluna = "la luna nuova"; //novilunio
        } else if (gl > 1 && gl < 7) {
            fluna = "una luna crescente";
        } else if (gl == 7) {
            fluna = "un primo quarto della luna";
        } else if (gl > 7 && gl < 15) {
            fluna = "una gibbosa crescente";
        } else if (gl == 15) {
            fluna = "la luna piena"; //plenilunio
        } else if (gl > 15 && gl < 23) {
            fluna = "una gibbosa calante";
        } else if (gl == 23) {
            fluna = "un ultimo quarto della luna";
        } else if (gl > 23 && gl < 30) {
            fluna = "una luna calante";
        }

        //mese e quarto d'anno + tempo
        mese = td.getMonth();
        int = 0;
        if (mese == 11 || mese < 2) {
            qrt = 1;
            prec = 5;
            stg = "inverno";
            if (tot % 5 == 0) {
                tempo = "à una pioggia intensa";
                acq = true;
                int = 3;
            } else if (tot % 5 == 1) {
                tempo = "anno nubi con schiarite";
                acq = false;
            } else if (tot % 5 == 2) {
                tempo = "à sole";
                acq = false;
            } else if (tot % 5 == 3) {
                tempo = "anno nuvoloni scuri carichi di pioggia";
                acq = false;
            } else if (tot % 5 == 4) {
                tempo = "à una pioggia con tuoni e fulmini";
                acq = true;
                int = 4;
            }
        } else if (mese >= 2 && mese < 5) {
            qrt = 2;
            prec = 7;
            stg = "primavera";
            if (tot % 7 == 0) {
                tempo = "à una leggera pioggia";
                acq = true;
                int = 1;
            } else if (tot % 7 == 1) {
                tempo = "anno nubi con schiarite";
                acq = false;
            } else if (tot % 7 == 2) {
                tempo = "à il sole con nuvole chiare";
                acq = false;
            } else if (tot % 7 == 3) {
                tempo = "à il sole";
                acq = false;
            } else if (tot % 7 == 4) {
                tempo = "à il sole variabile";
                acq = false;
            } else if (tot % 7 == 5) {
                tempo = "à il sole completamente coperto dalle nuvole";
                acq = false;
            } else if (tot % 7 == 6) {
                tempo = "à pioggia";
                acq = true;
                int = 2;
            }
        } else if (mese >= 5 && mese < 8) {
            qrt = 3;
            prec = 12;
            stg = "estate";
            if (tot % 12 == 0) {
                tempo = "à una leggera pioggia";
                acq = true;
                int = 1;
            } else if (tot % 2 == 1) {
                tempo = "à un sole molto forte";
                acq = false;
            } else if (tot % 2 == 0) {
                tempo = "à il sole coperto da nuvole chiare";
                acq = false;
            }
        } else if (mese >= 8 && mese < 11) {
            qrt = 4;
            prec = 7;
            stg = "autunno";
            if (tot % 7 == 0) {
                tempo = "à pioggia";
                acq = true;
                int = 2;
            } else if (tot % 7 == 1) {
                tempo = "anno nubi con schiarite";
                acq = false;
            } else if (tot % 7 == 2) {
                tempo = "à un sole parzialmente coperto";
                acq = false;
            } else if (tot % 7 == 3) {
                tempo = "à il sole";
                acq = false;
            } else if (tot % 7 == 4) {
                tempo = "à un sole completamente coperto";
                acq = false;
            } else if (tot % 7 == 5) {
                tempo = "anno nuvole scure che portano pioggia";
                acq = false;
            } else if (tot % 7 == 6) {
                tempo = "à una pioggia intensa";
                acq = true;
                int = 3;
            }
        }

        //precipitazioni
        if (acq == true) {
            if (int == 1) {
                mmp = 0.2 + Math.round((td.getDate() + td.getMonth()) / 4) / 10;
            } else if (int == 2) {
                mmp = 2 + Math.round((td.getDate() + td.getMonth()) / 3) / 10;
            } else if (int == 3) {
                mmp = 4 + Math.round((td.getDate() + td.getMonth()) / 2) / 10;
            } else if (int == 4) {
                mmp = 8 + Math.round((td.getDate() + td.getMonth()) / 1.5) / 10;
            }
        }

        //nome mese
        if (mese == 0) {
            mesen = "Gennaio";
        } else if (mese == 1) {
            mesen = "Febbraio";
        } else if (mese == 2) {
            mesen = "Marzo";
        } else if (mese == 3) {
            mesen = "Aprile";
        } else if (mese == 4) {
            mesen = "Maggio";
        } else if (mese == 5) {
            mesen = "Giugno";
        } else if (mese == 6) {
            mesen = "Luglio";
        } else if (mese == 7) {
            mesen = "Agosto";
        } else if (mese == 8) {
            mesen = "Settembre";
        } else if (mese == 9) {
            mesen = "Ottobre";
        } else if (mese == 10) {
            mesen = "Novembre";
        } else if (mese == 11) {
            mesen = "Dicembre";
        }

        //vento
        vb = Math.round(tot5 + (orario / 10));
        ints = vb % 19 + 1;
        z = Math.round(int * 5 + ints);
        c = vb % 8;

        //determinazione direzione
        if (c == 0) {
            dir = "nord";
        } else if (c == 1) {
            dir = "nord-est";
        } else if (c == 2) {
            dir = "est";
        } else if (c == 3) {
            dir = "sud-est";
        } else if (c == 4) {
            dir = "sud";
        } else if (c == 5) {
            dir = "sud-ovest";
        } else if (c == 6) {
            dir = "ovest";
        } else if (c == 7) {
            dir = "nord-ovest";
        }

        //scrittura messaggio
        albam = Math.floor((alba - Math.floor(alba)) * 60);
        alba2m = Math.floor((alba2 - Math.floor(alba2)) * 60);
        tramm = Math.floor((tram - Math.floor(tram)) * 60);
        //introduzione
        if (td.getMinutes() < 10) {
            min0 = "0";
        } else {
            min0 = "";
        }
        if (td.getHours() < 10) {
            ore0 = "0";
        } else {
            ore0 = "";
        }
        if (td.getDate() == 1) {
            primo = "°";
        } else {
            primo = "";
        }
        messaggio = "Oggi, " + td.getDate() + primo + " " + mesen + " " + td.getFullYear() +
            " alle ore " + ore0 + td.getHours() + ":" + min0 + td.getMinutes() + ", ci sono " +
            tmp + " °C e c'è un vento proveniente da " + dir + " a " + z + " km/h.\n";
        //tempo atmosferico
        messaggio = messaggio + "Per tutta la giornata ci sar" + tempo;
        //pioggia
        if (acq == true) {
            messaggio = messaggio + " e se ne prevedono circa "
                + mmp + " millimetri";
        }
        messaggio = messaggio + ".\n"
        // inserimento zero davanti a valori 1 digit
        if (Math.floor(tram) < 10) {
            ore1 = "0";
        } else {
            ore1 = "";
        }
        if (tramm < 10) {
            min1 = "0";
        } else {
            min1 = "";
        }
        if (Math.floor(alba2) < 10) {
            ore2 = "0";
        } else {
            ore2 = "";
        }
        if (alba2m < 10) {
            min2 = "0";
        } else {
            min2 = "";
        }
        if (Math.floor(alba) < 10) {
            ore3 = "0";
        } else {
            ore3 = "";
        }
        if (albam < 10) {
            min3 = "0";
        } else {
            min3 = "";
        }
        //alba e tramonto + fase lunare
        if (orario >= alba && orario <= tram) {
            messaggio = messaggio + "Il sole è sorto alle " + ore3 + Math.floor(alba) + ":" + min3 + albam
                + " e tramonterà alle " + ore1 + Math.floor(tram) + ":" + min1 + tramm + ".\n";
            messaggio = messaggio + "Stanotte si potrà vedere in cielo " + fluna + ".\n";
        } else {
            messaggio = messaggio + "Il sole è tramontato alle " + ore1 + Math.floor(tram) + ":" + min1 + tramm +
                " e sorgerà alle " + ore2 + Math.floor(alba2) + ":" + min2 + alba2m + ".\n";
            messaggio = messaggio + "Adesso si può vedere in cielo " + fluna + ".\n";
        }
        return messaggio
    } catch (err) {
        console.log(mess_err)
    }
}

function rendita(x) {
    try {
        rend = 50;
        if (x == 1) {
            rend = rend + 100;
        } else if (x < 5) {
            rend = x * 150;
        } else if (x < 7) {
            rend = 600 + (x - 4) * 200;
        } else if (x < 9) {
            rend = 1000 + (x - 7) * 250;
        } else if (x == 9) {
            rend = 2000;
        }
        return rend;
    } catch (err) {
        console.log(mess_err)
    }
}

function members(x) {
    try {
        // numero membri
        membri = 5;
        if (x < 9) {
            membri = membri + x;
        } else {
            membri = 15;
        }
        return membri;
    } catch (err) {
        console.log(mess_err)
    }
}

function cassaforte(x) {
    try {
        // cassaforte, max gold
        cass = 250;
        if (x < 4) {
            cass = cass + x * 250;
        } else if (x < 6) {
            cass = 1000 + (x - 3) * 500;
        } else if (x < 9) {
            cass = 2000 + (x - 5) * 1000;
        } else if (x == 9) {
            cass = 10000;
        }
        return cass;
    } catch (err) {
        console.log(mess_err)
    }
}

function include(arr, value) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].includes(value)) {
            return true;
        }
    }
    return false;
}

function gilda(x) {
    let mess = "";
    mess = "**Tag Gilda**: " + x.id_guild +
        ",\n**Nome Gilda**: " + x.name_guild +
        ",\n**Capogilda**: " + x.id_pl +
        ",\n**Livello**: " + x.level +
        ",\n**Membri**: " + x.n_m + "/" + x.n_member +
        ",\n**Fama**: " + x.fame +
        ",\n**Influenza**: " + x.inf +
        ",\n**Status**: " + x.status +
        ",\n**Denaro**: " + x.gold + "/" + x.goldtot + " MO" +
        ",\n**Rendita mensile**: " + x.rendita + " MO" +
        ",\n**Denaro per livellare**: " + x.rankup_gold + " MO."
    return mess
}

function trovaNumCod() {
    let e = new Error();
    e = e.stack.split("\n")[2].split(":");
    e.pop();
    return e.pop();
}