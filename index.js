require("dotenv").config();
const Discord = require("discord.js")
const client = new Discord.Client(
    { intents: ["GUILDS", "GUILD_MEMBERS", "GUILD_MESSAGES"] }
)
const mongoose = require('mongoose')

let symb = "!"
let mess_err = "Qualcosa è andato storto."
let amm = "Non sei admin."
let amm2 = "Non appartieni alla Land."
let laf = "Il comando è "
let att = "**Attenzione!**\n"
let utente = "965706832758841364" //id ruolo utente land
let ruolo = "965547318009016330" //id ruolo admin
let canalemarket = "973174134672609280" //id canale mercato
let canaledt = "973174174501728276" //id canale downtime
let canale = "965263672421277748" //id canale dove scrive il bot
let canaleBenv = "965263672421277748" //id canale di benvenuto
let categoria = "965263672421277747" //id categoria dove stanno i canali
let server = "965263672421277746" //id server
const mainChan = [canale, canaledt, canalemarket];
let listaCanali;


client.login(process.env.TOKEN)

let url = "mongodb+srv://botperdnd:" + process.env.PSW + "@cluster0.kfhj7.mongodb.net/DnDBot?retryWrites=true&w=majority";
mongoose.connect(url);

client.on("ready", () => {
    console.log("ONLINE");
    listaCanali = canali();
})

/////////////////////
// crea collection //
/////////////////////
// riassunto pg
const tab1 = mongoose.model('Tab1', {
    id: String,
    nome: String,
    mo: Number,
    ms: Number,
    lvl: Number,
    tier: Number,
    pdt: Number,
    pdtt: Number,
    date: Date
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

client.on("messageCreate", async (message) => {
    if (!message.author.bot && ((mainChan).includes(message.channel.id) == true || (listaCanali).includes(message.channel.id) == true)) {


        /*
        if (message.content.split(" ")[0].toLowerCase() == "b") {

            const embed = new Discord.MessageEmbed()
                .setTitle('some title')
                .setDescription('some description')
                .setImage('image url')
            message.reply({embeds: [embed]})

        }
        */

        /*
        if (message.content.split(" ")[0].toLowerCase() == "c") {
            //meteo();
        }
        */


        //Dare MS ai giocatori
        c_givems = symb + "givems";
        f_givems = "*'" + c_givems + " [Tag_Player] [Milestones]'*";
        if (message.content.split(" ")[0].toLowerCase() == c_givems) {
            if (message.member.roles.cache.has(ruolo)) {

                try {
                    // comando scritto
                    let frase = laf + f_givems + ".";

                    // dichiarazione valori
                    let tag = message.content.replace(/\s\s+/g, ' ').split(" ")[1];
                    let msv = parseInt(message.content.split(" ").slice(-1)[0]);

                    if (message.content.replace(/\s\s+/g, ' ').split(" ").length == 1) {
                        message.reply(att + frase); // formula errata
                    } else if (tag.length > 1) {
                        if (msv > 3 || msv == 0 || isNaN(msv) == true) {

                            // errore valore
                            message.reply("Hai sbagliato le milestones.");

                        } else {

                            let msi;
                            let lvli;
                            let camb;

                            tab1.findOne({ id: tag }, async function (err, res) {
                                if (res == null) {

                                    // personaggio insesistente
                                    message.reply("Il personaggio di " + tag + " non esiste.");

                                } else {

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
                                        let today = new Date();
                                        let data = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();

                                        // aggiustare livello se cambiano ms                              
                                        await tab1.updateOne({ id: tag }, { $set: { ms: msf, lvl: lvlf, date: data, tier: tief } }, function (err, res) {

                                            if (res == null) {

                                                // personaggio insesistente
                                                console.log("pg inesistente")

                                            } else {

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
                                        }).clone()
                                    }
                                }
                            })
                        }
                    } else {
                        // formula errata
                        message.reply(att + frase);
                    }
                } catch (err) {
                    message.reply(mess_err);
                }
            } else {
                // messaggio non sei admin
                message.reply(amm);
            }
        }

        // Dare denaro ai giocatori
        c_givemo = symb + "givemo";
        f_givemo = "*'" + c_givemo + " [Tag_Player] [Denaro]'*";
        if (message.content.split(" ")[0].toLowerCase() == c_givemo) {
            if (message.member.roles.cache.has(ruolo)) {

                try {
                    // comando scritto
                    let frase = laf + f_givemo + ".";

                    // dichiarazioni valori
                    let tag = message.content.replace(/\s\s+/g, ' ').split(" ")[1];
                    let num = Math.round(message.content.split(" ").slice(-1)[0] * 100) / 100;

                    if (message.content.replace(/\s\s+/g, ' ').split(" ").length == 1) {
                        message.reply(att + frase); // formula errata
                    } else if (tag.length > 1) {
                        if (num == 0 || isNaN(num) == true) {

                            // errore valore
                            message.reply("Hai sbagliato il denaro.");
                        } else {

                            // frase modificata se numero pari a 1 o meno
                            // o se viene tolto o aggiunto del denaro 
                            if (num > 1 || num < -1) {
                                s = "e"
                            } else if (num > 0 || num < 0) {
                                s = "a"
                            }
                            if (num > 0) {
                                a = "aggiunto"
                            } else if (num < 0) {
                                a = "tolto"
                            }

                            tab1.findOne({ id: tag }, async function (err, res) {
                                if (!res) {
                                    message.reply("Il personaggio di " + res.id + " non esiste.")
                                } else {
                                    tot = res.mo + num;
                                    if (tot < 0) {
                                        message.reply("Nessun personaggio può indebitarsi, correggi il valore.\n" +
                                            "Il denaro del personaggio di " + res.id + " ammonta a " + res.mo + " monet" +
                                            s + " d'oro.")
                                    } else {
                                        await tab1.updateOne({ id: tag }, { $set: { mo: tot } }, function (err, res) {
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
                    } else {

                        // formula errata
                        message.reply(att + frase);
                    }
                } catch (err) {
                    message.reply(mess_err);
                }
            } else {

                // messaggio non sei admin
                message.reply(amm);
            }
        }

        // Settare Milestones ai giocatori
        c_setms = symb + "setms";
        f_setms = "*'" + c_setms + " [Tag_Player] [Milestones]'*";
        if (message.content.split(" ")[0].toLowerCase() == c_setms) {
            if (message.member.roles.cache.has(ruolo)) {

                try {
                    // comando scritto
                    let frase = laf + f_setms + ".";

                    // dichiarazioni valori
                    let tag = message.content.replace(/\s\s+/g, ' ').split(" ")[1];
                    let num = Math.abs(parseInt(message.content.split(" ").slice(-1)[0]));

                    if (message.content.replace(/\s\s+/g, ' ').split(" ").length == 1) {
                        // formula errata
                        message.reply(att + frase);
                    } else {
                        if (isNaN(num) == true) {

                            // errore valore
                            message.reply("Hai sbagliato le milestones.");

                        } else {

                            tab1.findOne({ id: tag }, async function (err, res) {
                                if (res == null) {

                                    // personaggio insesistente
                                    message.reply("Il personaggio di " + tag + " non esiste.");

                                } else {

                                    // determinazione livello
                                    liv = livello(num);

                                    // determinazione tier
                                    tie = ttier(liv);

                                    // aggiustare livello se cambiano ms                              
                                    await tab1.updateOne({ id: tag }, { $set: { ms: num, lvl: liv, tier: tie } }, function (err, res) {

                                        if (res == null) {

                                            // personaggio insesistente
                                            console.log("pg inesistente")

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
                                    }).clone()

                                }
                            })
                        }
                    }
                } catch (err) {
                    message.reply(mess_err);
                }

            } else {

                // messaggio non sei admin
                message.reply(amm);
            }
        }

        // mostra info pg
        c_show = symb + "show";
        f_show = "*'" + c_show + " [Tag_Player]'*";
        if (message.content.split(" ")[0].toLowerCase() == c_show) {
            if (message.member.roles.cache.has(ruolo)) {

                try {
                    // comando scritto
                    let frase = laf + f_show + ".";
                    let tag = message.content.split(" ").slice(-1)[0];

                    if (message.content.replace(/\s\s+/g, ' ').split(" ").length == 1) {
                        // formula errata
                        message.reply(att + frase);
                    } else if (tag.length > 1) {
                        tab1.findOne({ id: tag }, async function (err, res) {
                            if (!res) {
                                message.reply("Il personaggio di " + tag + " non esiste.");
                            } else {
                                message.reply("**INFO PERSONAGGIO**:\n\n" +
                                    "**Tag**: " + tag + ",\n**Nome**: " + res.nome +
                                    ",\n**Tier**: " + res.tier + ",\n**Livello**: " + res.lvl +
                                    ",\n**Denaro**: " + res.mo + " MO,\n**Milestones**: " + res.ms +
                                    ",\n**Punti DT**: " + res.pdt + "/" + res.pdtt +
                                    ",\n**Ultima Sessione**: " + trad(res.date.toDateString()) + ".");
                            }
                        })
                    } else {
                        // formula errata
                        message.reply(att + frase);
                    }
                } catch (err) {
                    message.reply(mess_err);
                }
            } else {
                // messaggio non sei admin
                message.reply(amm);
            }
        }

        // mostra info di tutti i pg
        c_showall = symb + "showall";
        f_showall = "*'" + c_showall + "'*";
        if (message.content.split(" ")[0].toLowerCase() == c_showall) {
            if (message.member.roles.cache.has(ruolo)) {
                try {
                    // comando scritto
                    let frase = laf + f_showall + ".";
                    mex = message.content.split(" ");
                    mess = "**LISTA DEI PERSONAGGI**:\n";
                    if (mex.length > 1) {
                        message.reply(att + frase);
                    } else {
                        tab1.find().sort({ date: "desc", ms: "desc", nome: "asc" }).exec(function (err, res) {

                            if (!res) {
                                message.channel.send("Qualcosa è andato storto.");
                            } else {
                                // dichiaro massimo
                                times = res.length;

                                // decrescente
                                repeat(function () {
                                    mess = mess + "\n**Tag**: " + res[times - 1].id +
                                        "\n**Nome**: " + res[times - 1].nome + ",\n**Tier**: " + res[times - 1].tier +
                                        ",\n**Livello**: " + res[times - 1].lvl + ",\n**Denaro**: " + res[times - 1].mo +
                                        " MO,\n**Milestones**: " + res[times - 1].ms + ",\n**Punti DT**: " +
                                        res[times - 1].pdt + "/"+ res[times - 1].pdtt +",\n**Ultima Sessione**: " +
                                        trad(res[times - 1].date.toDateString()) + ".\n";
                                    times = times - 1
                                }, times);

                                message.channel.send(mess)
                            }
                        })
                    }
                } catch (err) {
                    message.reply(mess_err);
                }
            } else {
                // messaggio non sei admin
                message.reply(amm);
            }
        }

        // scambio monete tra PG da parte del master
        c_trade = symb + "trade";
        f_trade = "*'" + c_trade + " [Tag_Player_Mittente] [Tag_Player_Destinatario] [Denaro]'*";
        if (message.content.split(" ")[0].toLowerCase() == c_trade) {
            if (message.member.roles.cache.has(ruolo)) {
                try {
                    // comando scritto
                    let frase = laf + f_trade + ".";

                    // dichiarazioni valori
                    let tag = message.content.replace(/\s\s+/g, ' ').split(" ")[1];
                    let tag2 = message.content.replace(/\s\s+/g, ' ').split(" ")[2];
                    let num = Math.abs(Math.round(message.content.split(" ").slice(-1)[0] * 100) / 100);
                    let den;
                    let den2;

                    if (num == 1) {
                        a = "a";
                    } else {
                        a = "e";
                    }

                    if (message.content.replace(/\s\s+/g, ' ').split(" ").length == 1) {
                        // formula errata
                        message.reply(att + frase);
                    } else if (tag.length > 1 && tag2.length > 1) {
                        if (num == 0 || isNaN(num) == true) {

                            // errore valore
                            message.reply("Hai sbagliato il denaro.");

                        } else if (tag == tag2) {

                            // è inutile
                            message.reply("Non ha senso dare e togliere lo stesso" +
                                " quantitativo di denaro allo stesso personaggio.");

                        } else {

                            // togli soldi da chi scrive
                            tab1.find({ id: { $in: [tag, tag2] } }, async function (err, res) {
                                if (res.length == 2) {
                                    if (res[0].id == tag) {
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
                                            message.reply("Nessun personaggio può indebitarsi, correggi il valore.\n" +
                                                "Il denaro del personaggio di " + tag + " ammonta a " + res[0].mo +
                                                " monet" + a + " d'oro.")
                                        } else if (val == "b") {
                                            message.reply("Nessun personaggio può indebitarsi, correggi il valore.\n" +
                                                "Il denaro del personaggio di " + tag + " ammonta a " + res[1].mo +
                                                " monet" + a + " d'oro.")
                                        }
                                    } else {

                                        await tab1.updateOne({ id: tag }, { $set: { mo: den } })
                                        await tab1.findOneAndUpdate({ id: tag2 }, { $set: { mo: den2 } }, function (err, res) {
                                            if (!res) {
                                                message.reply("Il personaggio di " + tag2 + " non esiste.");
                                            } else {
                                                message.reply("Il personaggio di " + tag2 + " ha ricevuto " + num + " monet" +
                                                    a + " d'oro da parte del personaggio di " + tag + ".");
                                            }
                                        }).clone()
                                    }
                                } else {
                                    message.reply("Probabilmente uno dei due personaggi non esiste.");
                                }
                            })
                        }
                    } else {
                        // formula errata
                        message.reply(att + frase);
                    }
                } catch (err) {
                    message.reply(mess_err);
                }
            } else {
                // messaggio non sei admin
                message.reply(amm);
            }
        }

        // cancellare PG
        c_deletepg = symb + "deletepg";
        f_deletepg = "*'" + c_deletepg + " [Tag_Player]'*";
        if (message.content.split(" ")[0].toLowerCase() == c_deletepg) {
            if (message.member.roles.cache.has(ruolo)) {
                try {
                    // comando scritto
                    let frase = laf + f_deletepg + ".";

                    // dichiarazioni valori
                    let tag = message.content.split(" ").slice(-1)[0];

                    if (message.content.replace(/\s\s+/g, ' ').split(" ").length == 1) {
                        // formula errata
                        message.reply(att + frase);
                    } else {
                        // cerca se il PG esiste
                        tab1.findOne({ id: tag }, async function (err, res) {
                            if (!res) {
                                message.reply(tag + " non puoi cancellare un personaggio che non esiste.");
                            } else {
                                message.reply("Il personaggio di " + tag +
                                    " è stato cancellato.");
                                await tab1.deleteOne({ id: tag })
                                await tab2.deleteOne({ id: tag })
                                await tab4.deleteMany({ id_pl: tag })

                                // controlla se ci sono thread vecchi del PG
                                tab5.find({ id_pl: tag }, async function (err, res) {
                                    if (res == null) {
                                        console.log("Non ci sono.")
                                    } else {
                                        for (let i = 0; i < res.length; i++) {
                                            Text = message.guild.channels.cache.get(res[i].id_chan)
                                            await Text.delete('cleaning out old threads')
                                                .then(deletedThread => console.log("Ho cancellato il thread " + deletedThread.id))
                                                .catch(console.error);
                                        }
                                        await tab5.deleteMany({ id_pl: tag })
                                    }
                                })

                                // aggiornamento variabile
                                listaCanali = canali()
                            }
                        })
                    }
                } catch (err) {
                    message.reply(mess_err);
                }
            } else {
                // messaggio non sei nella land
                message.reply(amm);
            }
        }

        // creare PG
        c_creapg = symb + "creapg";
        f_creapg = "*'" + c_creapg + " [Tag_Player] [Nome_PG] [Denaro] [Livello]'*";
        if (message.content.split(" ")[0].toLowerCase() == c_creapg) {
            if (message.member.roles.cache.has(ruolo)) {
                try {
                    // comando scritto
                    let frase = laf + f_creapg + ".";

                    // dichiarazioni valori
                    let tag = message.content.replace(/\s\s+/g, ' ').split(" ")[1];
                    let name = message.content.replace(/\s\s+/g, ' ').split(" ")[2];
                    let num = Math.round(message.content.replace(/\s\s+/g, ' ').split(" ")[3] * 100) / 100;
                    let level = message.content.split(" ").slice(-1)[0];
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

                    if (message.content.replace(/\s\s+/g, ' ').split(" ").length == 1) {
                        // formula errata
                        message.reply(att + frase);
                    } else if (tag.length > 1 && name.length > 1) {
                        if ((num <= 0 || isNaN(num) == true) ||
                            (level < 1 /*|| isNaN(level) == true*/ || level > 20)) {

                            // errore valore
                            message.reply("Hai sbagliato il denaro o il livello.");

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
                                "ad ogni tuo acquisto all'interno della Land.");

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
                                "ad ogni tuo downtime all'interno della Land.");

                            // controlla se ci sono thread vecchi del PG
                            tab5.find({ id_pl: tag }, async function (err, res) {
                                if (res == null) {
                                    console.log("Nuovo PG")
                                } else {
                                    for (let i = 0; i < res.length; i++) {
                                        Text = message.guild.channels.cache.get(res[i].id_chan)
                                        await Text.delete()
                                            .then(deletedThread => console.log("Ho cancellato il thread " + deletedThread.id))
                                            .catch(console.error);
                                    }
                                    await tab5.deleteMany({ id_pl: tag })
                                    //inserimento nel DB
                                    const g = new tab5({ id_pl: tag, name_pl: name, id_chan: idA, type: "Mercato" });
                                    g.save();
                                    const f = new tab5({ id_pl: tag, name_pl: name, id_chan: idB, type: "Downtime" });
                                    f.save();
                                }
                            })

                            // aggiornamento variabile
                            listaCanali = canali()


                            // valore delle milestones
                            let numb = 0;
                            numb = milestones(level);
                            tie = ttier(level);
                            let today = new Date();
                            let data = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();

                            // plurale o singolare
                            await tab1.findOneAndUpdate({ id: tag }, { id: tag, nome: name, mo: num, ms: numb, 
                                lvl: level, tier: tie, pdt: 0, pdtt: 0, date: data }, { upsert: true })
                            await tab2.findOneAndDelete({ id: tag })
                            await tab4.deleteMany({ id_pl: tag })

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
                            message.reply("Il personaggio di " + tag + " si chiama '" + name
                                + "', è di " + level + "° livello con " + numb + " milestone" + s
                                + " e ha " + num + " monet" + a + " d'oro inizial" + b + ".");
                        }
                    } else {
                        // formula errata
                        message.reply(att + frase);
                    }
                } catch (err) {
                    message.reply(mess_err);
                }
            } else {
                // messaggio non sei nella land
                message.reply(amm);
            }
        }

        // dai denaro
        c_dai = symb + "dai";
        f_dai = "*'" + c_dai + " [Tag_Player_Beneficiario] [Denaro]'*";
        if (message.content.split(" ")[0].toLowerCase() == c_dai) {
            if (message.member.roles.cache.has(ruolo) || message.member.roles.cache.has(utente)) {
                try {
                    // comando scritto
                    let frase = laf + f_dai + ".";

                    // dichiarazioni valori
                    let tag2 = "<@" + message.author.id + ">";
                    let tag = message.content.replace(/\s\s+/g, ' ').split(" ")[1];
                    let num = -Math.abs(Math.round(message.content.split(" ").slice(-1)[0] * 100) / 100);

                    if (message.content.replace(/\s\s+/g, ' ').split(" ").length == 1) {
                        // formula errata
                        message.reply(att + frase);
                    } else if (tag.length > 1) {
                        if (num == 0 || isNaN(num) == true) {

                            // errore valore
                            message.reply("Hai sbagliato il denaro.");

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
                } catch (err) {
                    message.reply(mess_err);
                }
            } else {
                // messaggio non sei nella land
                message.reply(amm2);
            }
        }

        // mostra info pg
        c_infopg = symb + "infopg";
        f_infopg = "*'" + c_infopg + "'*";
        if (message.content.split(" ")[0].toLowerCase() == c_infopg) {
            if (message.member.roles.cache.has(ruolo) || message.member.roles.cache.has(utente)) {
                try {
                    // comando scritto
                    let frase = laf + f_infopg + ".";
                    let tag = "<@" + message.author.id + ">";

                    if (message.content.replace(/\s\s+/g, ' ').split(" ").length > 1) {
                        // formula errata
                        message.reply(att + frase);
                    } else {
                        tab1.findOne({ id: tag }, async function (err, res) {
                            if (!res) {
                                message.reply("Il personaggio di " + tag + " non esiste.");
                            } else {
                                message.reply("**INFO PERSONAGGIO**:\n" +
                                    "**Tag**: " + tag + ",\n**Nome**: " + res.nome +
                                    ",\n**Tier**: " + res.tier + ",\n**Livello**: " + res.lvl +
                                    ",\n**Denaro**: " + res.mo + " MO,\n**Milestones**: " + res.ms +
                                    + ",\n**Punti DT**: " + res.pdt + "/" + res.pdtt +
                                    ",\n**Ultima Sessione**: " + trad(res.date.toDateString()) + ".");
                            }
                        })
                    }
                } catch (err) {
                    message.reply(mess_err);
                }
            } else {
                // messaggio non sei nella land
                message.reply(amm2);
            }
        }

        // Downtime
        c_downtime = symb + "downtime";
        f_downtime = "*'" + c_downtime + " [Tipo_di_Downtime] [Giorni]'*";
        if (message.content.split(" ")[0].toLowerCase() == c_downtime) {
            if (message.member.roles.cache.has(ruolo) || message.member.roles.cache.has(utente)) {
                try {
                    // comando scritto
                    let frase = laf + f_downtime + ".\n"
                        + "Usa un'unica parola per il tipo di Downtime.";

                    // dichiarazioni valori
                    let tag = "<@" + message.author.id + ">";
                    let tipo = message.content.replace(/\s\s+/g, ' ').split(" ")[1];
                    let num = Math.abs(Math.round(message.content.split(" ").slice(-1)[0]));
                    giorno = new Date(oggi());

                    if (message.content.replace(/\s\s+/g, ' ').split(" ").length > 3) {
                        message.reply(att + frase);
                    } else {
                        tab1.findOne({ id: tag }, async function (err, res) {
                            if (!res) {
                                message.reply("Il personaggio di " + tag + " non esiste.")
                            } else {
                                if (tipo == "" || tipo == null) {
                                    tab2.findOne({ id: tag }, async function (err, res) {
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
                                        }
                                        data = addDays(giorno, num)

                                        tab2.findOne({ id: tag }, function (err, res) {
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
                                                        "senza aver terminato quello in corso.\nIl downtime attuale termina il giorno: "
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
                    }
                } catch (err) {
                    message.reply(mess_err);
                }
            } else {
                // messaggio non sei nella land
                message.reply(amm2);
            }
        }

        // Butta oggetto
        c_butta = symb + "butta";
        f_butta = "*'" + c_butta + " [Oggetto] [Quantità]'*";
        if (message.content.split(" ")[0].toLowerCase() == c_butta) {
            if (message.member.roles.cache.has(ruolo) || message.member.roles.cache.has(utente)) {
                try {
                    // comando scritto
                    let frase = laf + f_butta + ".\n" +
                        "Se hai bisogno di leggere gli oggetti, utilizza il comando '" + c_mercato + "'.";
                    let mess = message.content.replace(/\s\s+/g, ' ').split(" ");
                    let nome = "";
                    let tag = "<@" + message.author.id + ">";
                    let count = Math.abs(parseInt(mess.slice(-1)[0]));

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
                                            idobj = res.id;
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

                                            await tab4.findOne({ id_pl: tag, id_obj: idobj }, async function (err, res) {
                                                if (!res) {
                                                    message.reply("Il personaggio di " + tag + " non possiede " +
                                                        c.toLowerCase() + "oggett" + d + " chiamat" + d + " '" + nome + "'.")
                                                } else {
                                                    tot = res.num - count
                                                    if (tot > 0) {
                                                        await tab4.updateOne({ id_pl: tag, id_obj: idobj }, { $set: { num: tot } }, { upsert: true })
                                                        message.reply("Il personaggio di " + tag + " ha buttato " +
                                                            count + " oggett" + d + " chiamat" + d + " '" + nome + "'.")
                                                    } else {
                                                        await tab4.deleteOne({ id_pl: tag, id_obj: idobj })
                                                        message.reply("Il personaggio di " + tag + " ha buttato " +
                                                            "tutti gli oggetti chiamati '" + nome + "'.")
                                                    }
                                                }
                                            }).clone()
                                        }
                                    }).clone()
                                }
                            }
                        })
                    }
                } catch (err) {
                    message.reply(mess_err);
                }
            } else {
                // messaggio non sei nella land
                message.reply(amm2);
            }
        }

        // Spendi
        c_spendi = symb + "spendi";
        f_spendi = "*'" + c_spendi + " [Denaro]'*";
        if (message.content.split(" ")[0].toLowerCase() == c_spendi) {
            if (message.member.roles.cache.has(ruolo) || message.member.roles.cache.has(utente)) {
                try {
                    // comando scritto
                    let frase = laf + f_spendi + ".";
                    let tag = "<@" + message.author.id + ">";
                    let num = Math.abs(Math.round(message.content.split(" ").slice(-1)[0] * 100) / 100);
                    let tot;

                    if (message.content.replace(/\s\s+/g, ' ').split(" ").length == 1 || num == 0 || isNaN(num) == true) {
                        message.reply(att + frase)
                    } else {
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
                    }
                } catch (err) {
                    message.reply(mess_err);
                }
            } else {
                // messaggio non sei nella land
                message.reply(amm2);
            }
        }

        // Aggiungere oggetti nel mercato
        c_additem = symb + "additem";
        f_additem = "*'" + c_additem + " [Nome_Oggetto] [Prezzo_MO] [Tipo] [Proprietà_Oggetto]'*";
        if (message.content.split(" ")[0].toLowerCase() == c_additem) {
            if (message.member.roles.cache.has(ruolo)) {
                try {
                    // comando scritto
                    let frase = laf + f_additem + ".\n" +
                        "Per esempio: '" + c_additem + " Spada Corta 10 Arma Accurata Leggera*.\n" +
                        "Cerca di non sbagliare il campo del prezzo.";
                    let i = 1;
                    let mess = message.content.replace(/\s\s+/g, ' ').split(" ");
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
                        denaro = mess[i];

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
                } catch (err) {
                    message.reply(mess_err);
                }
            } else {
                // messaggio non sei admin
                message.reply(amm);
            }
        }

        // Compra oggetti
        c_compra = symb + "compra";
        f_compra = "*'" + c_compra + " [Nome_Oggetto] [Quantità]'*";
        if (message.content.split(" ")[0].toLowerCase() == c_compra) {
            if (message.member.roles.cache.has(ruolo) || message.member.roles.cache.has(utente)) {
                try {
                    // comando scritto
                    let frase = laf + f_compra + ".\n" +
                        "Se hai bisogno di leggere gli oggetti, utilizza il comando '" + c_mercato + "'.";
                    let mess = message.content.replace(/\s\s+/g, ' ').split(" ");
                    let nome = "";
                    let tag = "<@" + message.author.id + ">";
                    let count = Math.abs(parseInt(mess.slice(-1)[0]));
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
                } catch (err) {
                    message.reply(mess_err);
                }
            } else {
                // messaggio non sei nella land
                message.reply(amm2);
            }
        }

        // Stop Downtime
        c_fermadowntime = symb + "fermadowntime";
        f_fermadowntime = "*'" + c_fermadowntime + "'*";
        if (message.content.split(" ")[0].toLowerCase() == c_fermadowntime) {
            if (message.member.roles.cache.has(ruolo) || message.member.roles.cache.has(utente)) {
                try {
                    // comando scritto
                    let frase = laf + f_fermadowntime;
                    let mess = message.content.replace(/\s\s+/g, ' ').split(" ");
                    let tag = "<@" + message.author.id + ">";

                    if (mess.length > 1) {
                        message.reply(att + frase)
                    } else {
                        tab1.findOne({ id: tag }, async function (err, res) {
                            if (!res) {
                                message.reply("Il personaggio di " + tag + " non esiste.")
                            } else {
                                tab2.findOne({ id: tag }, async function (err, res) {
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
                } catch (err) {
                    message.reply(mess_err);
                }
            } else {
                // messaggio non sei nella land
                message.reply(amm2);
            }
        }

        // Vendi oggetti
        c_vendi = symb + "vendi";
        f_vendi = "*'" + c_vendi + " [Nome_Oggetto] [Quantità]'*";
        if (message.content.split(" ")[0].toLowerCase() == c_vendi) {
            if (message.member.roles.cache.has(ruolo) || message.member.roles.cache.has(utente)) {
                try {
                    // comando scritto
                    let frase = laf + f_vendi + ".\n" +
                        "Se hai bisogno di leggere gli oggetti, utilizza il comando '" + c_mercato + "'.\n" +
                        "Invece se vuoi controllare il tuo inventario scrivi '" + c_inventario + "'.";
                    let mess = message.content.replace(/\s\s+/g, ' ').split(" ");
                    let nome = "";
                    let tag = "<@" + message.author.id + ">";
                    let count = Math.abs(parseInt(mess.slice(-1)[0]));
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
                } catch (err) {
                    message.reply(mess_err);
                }
            } else {
                // messaggio non sei nella land
                message.reply(amm2);
            }
        }

        // dare oggetto mercato da master a giocatore
        c_giveitem = symb + "giveitem";
        f_giveitem = "*'" + c_giveitem + " [Tag_Player] [Nome_Oggetto] [Quantità]'*";
        if (message.content.split(" ")[0].toLowerCase() == c_giveitem) {
            if (message.member.roles.cache.has(ruolo)) {
                try {
                    // comando scritto
                    let frase = laf + f_giveitem + ".\n" +
                        "Se hai bisogno di leggere gli oggetti, utilizza il comando '" + c_mercato + "'.\n" +
                        "**RICORDA CHE NON TOGLI DENARO DANDO L'OGGETTO, NEL CASO DEBBA SCALARE PUOI " +
                        "FARLO TU MANUALMENTE CON** '" + com2 + "' **USANDO UN VALORE NEGATIVO OPPURE FAI USARE AL " +
                        "GIOCATORE IL COMANDO** '" + com13 + "' **USANDO IL VALORE CHE AVREBBE DOVUTO SPENDERE.**";
                    let mess = message.content.replace(/\s\s+/g, ' ').split(" ");
                    let tag = mess[1];
                    let nome = "";
                    let count = parseInt(mess.slice(-1)[0]);
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
                                    }).clone()
                                }
                            }
                        })
                    }
                } catch (err) {
                    message.reply(mess_err);
                }
            } else {
                // messaggio non sei admin
                message.reply(amm);
            }
        }

        // dare oggetto ad un altro giocatore
        c_regala = symb + "regala";
        f_regala = "*'" + c_regala + " [Tag_Player] [Nome_Oggetto] [Quantità]'*";
        if (message.content.split(" ")[0].toLowerCase() == c_regala) {
            if (message.member.roles.cache.has(ruolo)) {
                try {
                    // comando scritto
                    let frase = f_regala + ".\n" +
                        "Se hai bisogno di leggere gli oggetti, utilizza il comando '" + c_mercato + "'.";
                    let mess = message.content.replace(/\s\s+/g, ' ').split(" ");
                    let tag = mess[1];
                    let tag2 = "<@" + message.author.id + ">";
                    let nome = "";
                    let count = Math.abs(parseInt(mess.slice(-1)[0]));

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
                } catch (err) {
                    message.reply(mess_err);
                }
            } else {
                // messaggio non sei admin
                message.reply(amm);
            }
        }

        // inventario utente (solo master può scriverlo)
        c_inv = symb + "inv";
        f_inv = "*'" + c_inv + " [Tag_Player]'*";
        if (message.content.split(" ")[0].toLowerCase() == c_inv) {
            if (message.member.roles.cache.has(ruolo)) {

                try {
                    // comando scritto
                    let frase = laf + f_inv + ".";

                    // Dichiarazioni valori
                    mex = message.content.split(" ");
                    let tag = message.content.split(" ").slice(-1)[0];
                    mess = "**INVENTARIO DI " + tag + "**";

                    if (mex.length == 1) {
                        // messaggio di aiuto
                        message.reply(att + frase)
                    } else {
                        tab1.findOne({ id: tag }, async function (err, res) {
                            if (!res) {
                                message.reply("Il personaggio di " + tag + " non esiste.")
                            } else {
                                tab4.find({ id_pl: tag }).sort({ name: "asc" }).exec(function (err, res) {

                                    if (!res) {
                                        // inventario vuoto
                                        message.channel.send("L'inventario di " + tag + "è vuoto.");
                                    } else {
                                        // dichiaro massimo
                                        times = res.length;

                                        // decrescente
                                        repeat(function () {
                                            mess = mess + "\n*" + res[times - 1].name +
                                                " (" + res[times - 1].mo + " MO), x" + res[times - 1].num + "*";
                                            times = times - 1
                                        }, times);

                                        message.channel.send(mess)
                                    }
                                })
                            }
                        })
                    }
                } catch (err) {
                    message.reply(mess_err);
                }
            } else {
                // messaggio non sei admin
                message.reply(amm);
            }
        }

        // proprio inventario
        c_inventario = symb + "inventario";
        f_inventario = "*'" + c_inventario + "'*";
        if (message.content.split(" ")[0].toLowerCase() == c_inventario) {
            if (message.member.roles.cache.has(ruolo) || message.member.roles.cache.has(utente)) {
                try {
                    // comando scritto
                    let frase = laf + f_inventario + ".";

                    // Dichiarazioni valori
                    let tag = "<@" + message.author.id + ">";
                    let mex = message.content.replace(/\s\s+/g, ' ').split(" ");
                    mess = "**INVENTARIO DI " + tag + "**";

                    if (mex.length > 1) {
                        if (message.member.roles.cache.has(ruolo)) {
                            //messaggio di stato
                            message.reply(att + laf + " *'" + c_inventario + "'* per vedere il proprio inventario.\n" +
                                "Se invece stai cercando di vedere l'inventario di un PG in particolare, " +
                                "usa la formula: *'" + f_inv + "'*.")
                        } else {
                            //messaggio di stato
                            message.reply(att + frase)
                        }
                    } else {
                        tab1.findOne({ id: tag }, async function (err, res) {
                            if (!res) {
                                message.reply("Il personaggio di " + tag + " non esiste.")
                            } else {
                                tab4.find({ id_pl: tag }).sort({ name: "asc" }).exec(function (err, res) {

                                    if (res.length == 0) {
                                        // inventario vuoto
                                        message.channel.send("Il tuo inventario è vuoto.");
                                    } else {
                                        // dichiaro massimo
                                        times = res.length;

                                        // decrescente
                                        repeat(function () {
                                            mess = mess + "\n*" + res[times - 1].name +
                                                " (" + res[times - 1].mo + " MO), x" + res[times - 1].num + "*";
                                            times = times - 1
                                        }, times);

                                        message.channel.send(mess)
                                    }
                                })
                            }
                        })
                    }
                } catch (err) {
                    message.reply(mess_err);
                }
            } else {
                // messaggio non sei nella land
                message.reply(amm2);
            }
        }

        // Vedere il Mercato in base alla categoria 
        c_mercato = symb + "mercato";
        f_mercato = "*'" + c_mercato + " [Tipo_Oggetto]'*";
        if (message.content.split(" ")[0].toLowerCase() == c_mercato) {
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
                        "*'Servizi'* e anche *'Carrozza'*, 'Gregario'* e *'Nave'*.";

                    // dichiarazioni valori
                    let mex = message.content.replace(/\s\s+/g, ' ').split(" ");
                    let re = message.content.split(" ")[0].length + 1;
                    let mess = message.content.replace(/\s\s+/g, ' ').slice(re).toUpperCase();

                    let mep = "**LISTA DI OGGETTI '" + mess;
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
                                        repeat(function () {
                                            mep = mep + res[i].name + ", " + res[i].mo + " MO.\n";
                                            i = i + 1
                                        }, times);

                                        message.channel.send(mep)
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

        // punti downtime
        c_pdt = symb + "ottienipdt";
        f_pdt = "*'" + c_pdt + "'*";
        if (message.content.split(" ")[0].toLowerCase() == c_pdt) {
            if (message.member.roles.cache.has(ruolo) || message.member.roles.cache.has(utente)) {
                try {
                    // dichiarazioni valori
                    let tag = "<@" + message.author.id + ">";
                    giorno = new Date(oggi());

                    tab1.findOne({ id: tag }, async function (err, res) {
                        if (!res) {
                            message.reply("Il personaggio di " + tag + " non esiste.")
                        } else {
                            if (tipo == "" || tipo == null) {
                                tab2.findOne({ id: tag }, async function (err, res) {
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
                                    }
                                    data = addDays(giorno, num)

                                    tab2.findOne({ id: tag }, function (err, res) {
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
                                                    "senza aver terminato quello in corso.\nIl downtime attuale termina il giorno: "
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
                } catch (err) {
                    message.channel.send(mess_err)
                }

            } else {
                // messaggio non sei nella land
                message.reply(amm2);
            }
        }

        // meteo
        c_meteo = symb + "meteo";
        f_meteo = "*'" + c_meteo + "'*";
        if (message.content.split(" ")[0].toLowerCase() == c_meteo) {
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

        // help differenziato per ruolo admin e utente
        c_help = symb + "help";
        if (message.content.split(" ")[0].toLowerCase() == c_help) {

            // help admin
            if (message.member.roles.cache.has(ruolo)) {
                message.reply("**COMANDI PER MASTER LAND**\n\n"
                    // creapg creare un pg
                    + "**" + c_creapg + "**\n" +
                    laf + f_creapg + "\n" +
                    "e permette di creare il personaggio inserendo nome, denaro in monete d'oro e livello.\n\n"
                    // givems dare ms
                    + "**" + c_givems + "**\n" +
                    laf + f_givems + "\n" +
                    "e permette di assegnare le milestones al personaggio.\n\n"
                    // givemo dare mo
                    + "**" + c_givemo + "**\n" +
                    laf + f_givemo + "\n" +
                    "e permette di assegnare il denaro al personaggio.\n\n"
                    // show mostrare pg
                    + "**" + c_show + "**\n" +
                    laf + f_show + "\n" +
                    "e mostra i dati del personaggio.\n\n"
                    // inv mostrare inventario
                    + "**" + c_inv + "**\n" +
                    laf + f_inv + "\n" +
                    "e mostra l'inventario del personaggio.\n\n"
                    // showall mostrare tutti i pg
                    + "**" + c_showall + "**\n" +
                    laf + f_showall + "\n" +
                    "e mostra i dati di tutti i personaggi.\n\n"
                    // trade scambiare denaro tra pg
                    + "**" + c_trade + "**\n" +
                    laf + f_trade + "\n" +
                    "e permette di far scambiare denaro dal primo personaggio al secondo.\n\n"
                    // additem aggiungere oggetto nel mercato
                    + "**" + c_additem + "**\n" +
                    laf + f_additem + ".\n" +
                    "Per esempio: *'" + c_additem + " Spada Corta 10 Arma Accurata Leggera'*.\n" +
                    "Ti permette di inserire un oggetto all'interno del mercato.\n" +
                    "*Cerca di non sbagliare il campo del prezzo*.\n\n"
                    // giveitem dare oggetto ad un pg
                    + "**" + c_giveitem + "**\n" +
                    laf + f_giveitem + ".\n" +
                    "Se hai bisogno di leggere gli oggetti, utilizza il comando *'" + c_mercato + "'*.\n" +
                    "**RICORDA CHE NON TOGLI DENARO DANDO L'OGGETTO, \nNEL CASO DEBBA SCALARE PUOI " +
                    "FARLO TU MANUALMENTE CON** *'" + c_givemo + "'* **\nUSANDO UN VALORE NEGATIVO OPPURE FAI USARE AL " +
                    "GIOCATORE IL COMANDO** *'" + c_spendi + "'* **\nUSANDO IL VALORE CHE AVREBBE DOVUTO SPENDERE.**\n\n"
                );
            }

            // help giocatori
            if (message.member.roles.cache.has(utente)) {
                message.reply("**COMANDI PER GIOCATORI LAND**\n\n"
                    // infopg info di un pg
                    + "**" + c_infopg + "**\n" +
                    laf + f_infopg + "\n" +
                    "e permette di visualizzare i dati del proprio personaggio.\n\n"
                    // inventario inventario di un pg
                    + "**" + c_inventario + "**\n" +
                    laf + f_inventario + "\n" +
                    "e mostra l'inventario del proprio personaggio.\n\n"
                    // dai ad un pg del danaro
                    + "**" + c_dai + "**\n" +
                    laf + f_dai + "\n" +
                    "e permette ad un giocatore di dare un ammontare di denaro al personaggio taggato.\n\n"
                    // spendi del denaro
                    + "**" + c_spendi + "**\n" +
                    laf + f_spendi + "\n"
                    + "e permette di spendere il denaro senza usare per forza il mercato.\n\n"
                    // meteo
                    + "**" + c_meteo + "**\n" +
                    laf + f_meteo + "\n" +
                    "e permette di sapere le informazioni relative al tempo atmosferico e alla giornata in generale.\n\n"
                    // mercato mostra gli oggetti del mercato
                    + "**" + c_mercato + "**\n" +
                    laf + f_mercato + ".\n" +
                    "All'interno di *[Tipo_Oggetto]* puoi scrivere una categoria.\n\n"
                    // compra gli oggetti del mercato
                    + "**" + c_compra + "**\n" +
                    laf + f_compra + ".\n" +
                    "Se hai bisogno di leggere gli oggetti, utilizza il comando *'" + c_mercato + "'*.\n\n"
                    // vendi gli oggetti nel mercato
                    + "**" + c_vendi + "**\n" +
                    laf + f_vendi + ".\n" +
                    "Se hai bisogno di leggere gli oggetti, utilizza il comando *'" + c_mercato + "'*.\n" +
                    "Invece se vuoi controllare il tuo inventario scrivi *'" + c_inventario + "'*.\n\n"
                    // downtime permette di svolgere dt
                    + "**" + c_downtime + "**\n" +
                    laf + f_downtime + ".\n" +
                    "Usa un'unica parola per il tipo di Downtime.\n"
                    + "Scrivendo solo *'" + c_downtime + "'* puoi riscattare e/o controllare il DT concluso o attivo.\n"
                    + "Ti permette di avviare un downtime di un tipo qualsiasi per la durata prestabilita (in giorni).\n\n"
                );
            }
        }
    }
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
    let lvls = 0;
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

function milestones(level) {
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
}

function ttier(level) {
    let tier = 1;
    tier = Math.ceil(level / 4);
    return tier;
}

function addDays(date, days) {
    let result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

function oggi() {
    let today = new Date();
    let data = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    return data;
}

function createid(x) {
    x = x.toLowerCase();
    y = "";
    w = "";
    z = "";

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
}

function repeat(func, times) {
    func();
    times && --times && repeat(func, times);
}

function canali() {
    const can = [];
    tab5.find().exec(function (err, res) {
        if (!res) {
            console.log("Non c'è nulla.")
        } else {
            for (let i = 0; i < res.length; i++) {
                can[i] = res[i].id_chan;
            }
        }
    })
    return can;
}

function trad(x) {
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
}

function meteo() {
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
    ld = new Date('11/15/2020');
    ore = td.getHours() * 60 + td.getMinutes;
    dif4 = td.getTime() - ld.getTime();
    if (ore < alba) {
        dif4 = dif4 - 1;
    }
    tot5 = Math.ceil(dif4 / (1000 * 3600 * 24));
    cl = 29;
    gl = Math.floor((tot5 / cl - Math.floor(tot5 / cl)) * cl);
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
    if (mese == 11 || mese < 2) {
        qrt = 1;
        prec = 5;
        stg = "inverno";
        if (tot % 5 == 0) {
            tempo = "à una pioggia intensa";
            acq = true;
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
        }
    } else if (mese >= 2 && mese < 5) {
        qrt = 2;
        prec = 7;
        stg = "primavera";
        if (tot % 7 == 0) {
            tempo = "à una leggera pioggia";
            acq = true;
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
        }
    } else if (mese >= 5 && mese < 8) {
        qrt = 3;
        prec = 12;
        stg = "estate";
        if (tot % 12 == 0) {
            tempo = "à una leggera pioggia";
            acq = true;
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
        }
    }

    //precipitazioni
    if (acq == true) {
        dfm = 89;
        if (qrt == 1) {
            mmp = Math.round(-(Math.cos(2 * Math.PI * tot / dfm) + 5) * 10) / 10;
        } else if (qrt == 2) {
            mmp = Math.round((4 - 2 * (tot - dfm) / dfm) * 10) / 10;
        } else if (qrt == 3) {
            mmp = Math.round((Math.cos(2 * Math.PI * (tot - 2 * dfm) / dfm) + 1) * 10) / 10;
        } else if (qrt == 4) {
            mmp = Math.round((4 + 2 * (tot - 3 * dfm) / dfm) * 10) / 10;
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
    vb = Math.round(tot5 + orario);
    int = (1 - Math.cos(2 * Math.PI * (vb % 25) / 24)) / 2;
    z = Math.round(int * 5 / (2 * prec) * 100);
    c = vb % 9;

    //variabile direzione rosa dei venti
    if (vb % 6 == 0) {
        c = c;
    } else if (vb % 3 == 0) {
        c = c - 1;
    } else if (vb % 2 == 0) {
        c = c + 1;
    } else {
        if ((vb % 25) % 2 == 0) {
            c = c + 1;
        } else {
            c = c - 1;
        }
    }

    //condizione di eccedenza
    if (c > 8) {
        c = c % 9 + 1;
    }

    //determinazione direzione
    if (c == 1) {
        dir = "nord";
    } else if (c == 2) {
        dir = "nord-est";
    } else if (c == 3) {
        dir = "est";
    } else if (c == 4) {
        dir = "sud-est";
    } else if (c == 5) {
        dir = "sud";
    } else if (c == 6) {
        dir = "sud-ovest";
    } else if (c == 7) {
        dir = "ovest";
    } else if (c == 8) {
        dir = "nord-ovest";
    }

    //vecchio metodo
    /*nord = (1 - Math.cos(2 * Math.PI * (vb % 102) / 101));
    sud = (Math.cos(2 * Math.PI * (vb % 104) / 103) - 1);
    est = (1 - Math.cos(2 * Math.PI * (vb % 108) / 107));
    ovest = (Math.cos(2 * Math.PI * (vb % 110) / 109) - 1);
    y = (nord + sud) / 2;
    console.log(y)
    x = (est + ovest) / 2;
    console.log(x)
    z = Math.sqrt(x * x + y * y);
    console.log(z)
    if (z > 1) {
        z = z - Math.floor(z);
    }
    ya = Math.asin(Math.abs(z)) * 180 / Math.PI;
    xa = Math.acos(Math.abs(z)) * 180 / Math.PI;
    z = Math.round(z * 5 / (2 * prec) * 100);
    console.log("y " + ya)
    console.log("x " + xa)
    if (x >= 0 && y >= 0) {
        if (ya <= 15) {
            dir = "nord";
        } else if (ya >= 75) {
            dir = "est";
        } else {
            dir = "nord-est";
        }
    } else if (x < 0 && y >= 0) {
        if (ya <= 15) {
            dir = "nord";
        } else if (ya >= 75) {
            dir = "ovest";
        } else {
            dir = "nord-ovest";
        }
    } else if (x < 0 && y < 0) {
        if (ya <= 15) {
            dir = "sud";
        } else if (ya >= 75) {
            dir = "ovest";
        } else {
            dir = "sud-ovest";
        }
    } else if (x >= 0 && y < 0) {
        if (ya <= 15) {
            dir = "sud";
        } else if (ya >= 75) {
            dir = "est";
        } else {
            dir = "sud-est";
        }
    }*/

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
        messaggio = messaggio + " e si prevedono in media, durante tutto il giorno," +
            " circa " + mmp + " millimetri di pioggia";
    }
    messaggio = messaggio + ".\n"
    //alba e tramonto + fase lunare
    if (orario >= alba && orario <= tram) {
        messaggio = messaggio + "Il sole è sorto alle " + Math.floor(alba) + ":" + albam
            + " e tramonterà alle " + Math.floor(tram) + ":" + tramm + ".\n";
        messaggio = messaggio + "Stanotte si potrà vedere in cielo " + fluna + ".\n";
    } else {
        messaggio = messaggio + "Il sole è tramontato alle " + Math.floor(tram) + ":" + tramm +
            " e sorgerà alle " + Math.floor(alba2) + ":" + alba2m + ".\n";
        messaggio = messaggio + "Adesso si può vedere in cielo " + fluna + ".\n";
    }
    return messaggio
}