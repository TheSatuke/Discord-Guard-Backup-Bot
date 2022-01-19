
const { Discord, Client, MessageEmbed } = require('discord.js');
const client = global.client = new Client({ fetchAllMembers: true });
const fs = require('fs');
const request = require('request');

const Database = require("./Models/Database/RoleGuard");
const Settings = require("../Settings.json");

const Client1 = require("discord.js");
const Client2 = require("discord.js");
const Client3 = require("discord.js");

const PermArray = [
  "ADMINISTRATOR",
  "MANAGE_ROLES",
  "MANAGE_CHANNELS",
  "MANAGE_GUILD",
  "BAN_MEMBERS",
  "KICK_MEMBERS",
  "MANAGE_NICKNAMES",
  "MANAGE_EMOJIS",
  "MANAGE_WEBHOOKS"
];

const Guard_1 = new Client1.Client();
const Guard_2 = new Client2.Client();
const Guard_3 = new Client3.Client();

const korumalar = require("./Models/Guard.json")

const Güvenliler = require("./Models/Güvenliler.json");

const mongoose = require('mongoose');
mongoose.connect(Settings.Mongoose.DatabaseUrl, {useNewUrlParser: true, useUnifiedTopology: true});

Guard_1.on("message", async message => {
    if (message.author.bot || !message.guild || !message.content.toLowerCase().startsWith(Settings.Prefix.Guard_1P)) return;
    if (message.author.id !== Settings.Server.OwnerID && message.author.id !== message.guild.owner.id) return;
    let args = message.content.split(' ').slice(1);
    let command = message.content.split(' ')[0].slice(Settings.Prefix.Guard_1P.length);
    let embed = new MessageEmbed().setColor(Settings.Server.EmbedColor).setAuthor(message.member.displayName, message.author.avatarURL({ dynamic: true, }))
      if (command === "eval" && message.author.id === Settings.Server.OwnerID) {
      if (!args[0]) return;
        let code = args.join(' ');
        function clean(text) {
        if (typeof text !== 'string') text = require('util').inspect(text, { depth: 0 })
        text = text.replace(/`/g, '`' + String.fromCharCode(8203)).replace(/@/g, '@' + String.fromCharCode(8203))
        return text;
      };
      try { 
        var evaled = clean(await eval(code));
        if(evaled.match(new RegExp(`${Guard_1.token}`, 'g'))) evaled.replace(Guard_1.token, "Yasaklı komut");
        message.channel.send(`${evaled.replace(Guard_1.token, "Yasaklı komut")}`, {code: "js", split: true});
      } catch(err) { message.channel.send(err, {code: "js", split: true}) };
    };

    if(command == "liste") {
      let hedef;
      let rol = message.mentions.roles.first() || message.guild.roles.cache.get(args[0]) || message.guild.roles.cache.find(r => r.name === args.join(" "));
      let uye = message.mentions.users.first() || message.guild.members.cache.get(args[0]);
      if (rol) hedef = rol;
      if (uye) hedef = uye;
      let guvenliler = Güvenliler.whitelist || [];
      if (!hedef) return message.channel.send(embed.addField("Güvenli Liste (White List)" ,guvenliler.length > 0 ? guvenliler.map(g => (message.guild.roles.cache.has(g.slice(1)) || message.guild.members.cache.has(g.slice(1))) ? (message.guild.roles.cache.get(g.slice(1)) || message.guild.members.cache.get(g.slice(1))) : g).join('\n ') : "\`\`\`Burası Çok Issız..\`\`\`"));};


      if(command === "safe" || "güvenli") {
      let hedef;
      let rol = message.mentions.roles.first() || message.guild.roles.cache.get(args[0]) || message.guild.roles.cache.find(r => r.name === args.join(" "));
      let uye = message.mentions.users.first() || message.guild.members.cache.get(args[0]);
      if (rol) hedef = rol;
      if (uye) hedef = uye;
      let guvenliler = Güvenliler.whitelist || [];
      if (!hedef) return message.channel.send(embed
       .setDescription(`Güvenli Listeye Eklemek/Kaldırmak İçin \`@Satuke/ID\` Belirtmelisin.`));
      if (guvenliler.some(g => g.includes(hedef.id))) {
        guvenliler = guvenliler.filter(g => !g.includes(hedef.id));
        Güvenliler.whitelist = guvenliler;
        fs.writeFile("./ayarlar.json", JSON.stringify(Güvenliler), (err) => {
          if (err) console.log(err);
        });
        message.channel.send(embed
        .setDescription(`${hedef}, ${message.author} Tarafından Güvenli Listeden \`Çıkarıldı.\``));
      } else {
        Güvenliler.whitelist.push(`S${hedef.id}`);
        fs.writeFile("./ayarlar.json", JSON.stringify(Güvenliler), (err) => {
          if (err) console.log(err);
        });
        message.channel.send(embed
         .setDescription(`${hedef}, ${message.author} Tarafından Güvenli Listeye \`Eklendi.\``));
      };
    };
  });

  Guard_2.on("message", async message => {
    if (message.author.bot || !message.guild || !message.content.toLowerCase().startsWith(Settings.Prefix.Guard_2P)) return;
    if (message.author.id !== Settings.Server.OwnerID && message.author.id !== message.guild.owner.id) return;
    let args = message.content.split(' ').slice(1);
    let command = message.content.split(' ')[0].slice(Settings.Prefix.Guard_2P.length);
    let embed = new MessageEmbed().setColor(Settings.Server.EmbedColor).setAuthor(message.member.displayName, message.author.avatarURL({ dynamic: true, }))
      if (command === "eval" && message.author.id === Settings.Server.OwnerID) {
      if (!args[0]) return ;
        let code = args.join(' ');
        function clean(text) {
        if (typeof text !== 'string') text = require('util').inspect(text, { depth: 0 })
        text = text.replace(/`/g, '`' + String.fromCharCode(8203)).replace(/@/g, '@' + String.fromCharCode(8203))
        return text;
      };
      try { 
        var evaled = clean(await eval(code));
        if(evaled.match(new RegExp(`${Guard_2.token}`, 'g'))) evaled.replace(Guard_2.token, "Yasaklı komut");
        message.channel.send(`${evaled.replace(Guard_2.token, "Yasaklı komut")}`, {code: "js", split: true});
      } catch(err) { message.channel.send(err, {code: "js", split: true}) };
    };
    
  });

  Guard_3.on("message", async message => {
    if (message.author.bot || !message.guild || !message.content.toLowerCase().startsWith(Settings.Prefix.Guard_3P)) return;
    if (message.author.id !== Settings.Server.OwnerID && message.author.id !== message.guild.owner.id) return;
    let args = message.content.split(' ').slice(1);
    let command = message.content.split(' ')[0].slice(Settings.Prefix.Guard_3P.length);
    let embed = new MessageEmbed().setColor(Settings.Server.EmbedColor).setAuthor(message.member.displayName, message.author.avatarURL({ dynamic: true, }));
      if (command === "eval" && message.author.id === Settings.Server.OwnerID) {
      if (!args[0]) return;
        let code = args.join(' ');
        function clean(text) {
        if (typeof text !== 'string') text = require('util').inspect(text, { depth: 0 })
        text = text.replace(/`/g, '`' + String.fromCharCode(8203)).replace(/@/g, '@' + String.fromCharCode(8203))
        return text;
      };
      try { 
        var evaled = clean(await eval(code));
        if(evaled.match(new RegExp(`${Guard_3.token}`, 'g'))) evaled.replace(Guard_3.token, "Yasaklı komut");
        message.channel.send(`${evaled.replace(Guard_3.token, "Yasaklı komut")}`, {code: "js", split: true});
      } catch(err) { message.channel.send(err, {code: "js", split: true}) };
    };
  
 });
  




//                                                                CEZA                                                                /

function guvenli(kisiID) {
    let uye = Guard_1.guilds.cache.get(Settings.Server.GuildID).members.cache.get(kisiID);
    let guvenliler = Güvenliler.whitelist || [];
    if (!uye || uye.id === Guard_1.user.id || uye.id === Settings.Server.OwnerID || uye.id === uye.guild.owner.id || guvenliler.some(g => uye.id === g.slice(1) || uye.roles.cache.has(g.slice(1)))) return true
    else return false;
  };
  
function cezalandir(kisiID, tur) {
    let uye = Guard_1.guilds.cache.get(Settings.Server.GuildID).members.cache.get(kisiID);
    if (!uye) return;
    if (tur == "jail") return uye.roles.cache.has(Settings.Roles.BoosterRole) ? uye.roles.set([Settings.Roles.BoosterRole, Settings.Roles.JailRoles]) : uye.roles.set([Settings.Roles.JailRoles]);
    if (tur == "ban") return uye.ban({ reason: "Satuke Koruma Sistemi" }).catch();
  };

function guvenli(kisiID) {
    let uye = Guard_2.guilds.cache.get(Settings.Server.GuildID).members.cache.get(kisiID);
    let guvenliler = Güvenliler.whitelist || [];
    if (!uye || uye.id === Guard_2.user.id || uye.id === Settings.Server.OwnerID || uye.id === uye.guild.owner.id || guvenliler.some(g => uye.id === g.slice(1) || uye.roles.cache.has(g.slice(1)))) return true
    else return false;
  };
  
function cezalandir(kisiID, tur) {
    let uye = Guard_2.guilds.cache.get(Settings.Server.GuildID).members.cache.get(kisiID);
    if (!uye) return;
    if (tur == "jail") return uye.roles.cache.has(Settings.Roles.BoosterRole) ? uye.roles.set([Settings.Roles.BoosterRole, Settings.Roles.JailRoles]) : uye.roles.set([Settings.Roles.JailRoles]);
    if (tur == "ban") return uye.ban({ reason: "Satuke Koruma Sistemi" }).catch();
  };

function guvenli(kisiID) {
    let uye = Guard_3.guilds.cache.get(Settings.Server.GuildID).members.cache.get(kisiID);
    let guvenliler = Güvenliler.whitelist || [];
    if (!uye || uye.id === Guard_3.user.id || uye.id === Settings.Server.OwnerID || uye.id === uye.guild.owner.id || guvenliler.some(g => uye.id === g.slice(1) || uye.roles.cache.has(g.slice(1)))) return true
    else return false;
  };
  
function cezalandir(kisiID, tur) {
    let uye = Guard_3.guilds.cache.get(Settings.Server.GuildID).members.cache.get(kisiID);
    if (!uye) return;
    if (tur == "jail") return uye.roles.cache.has(Settings.Roles.BoosterRole) ? uye.roles.set([Settings.Roles.BoosterRole, Settings.Roles.JailRoles]) : uye.roles.set([Settings.Roles.JailRoles]);
    if (tur == "ban") return uye.ban({ reason: "Satuke Koruma Sistemi" }).catch();
  };

//                                                                SERVER GUARD                                                                / 

Guard_1.on("guildMemberRemove", async member => {
    let entry = await member.guild.fetchAuditLogs({type: 'MEMBER_KICK'}).then(audit => audit.entries.first());
    if (!entry || !entry.executor || Date.now()-entry.createdTimestamp > 5000 || guvenli(entry.executor.id) || !korumalar.kickGuard) return;
    cezalandir(entry.executor.id, "ban");
    let logKanali = Guard_1.channels.cache.find(a => a.name == Settings.Log.Guard_Log1)
    if (logKanali) { logKanali.send(`🛡️ ${member} (\`${member.id}\`), adlı kullanıcıya ${entry.executor} (\`${entry.executor.id}\`) tarafından sağ tık \`Kick\` atıldı`).catch(); }
    else { member.guild.owner.send(`🛡️ ${member} (\`${member.id}\`), adlı kullanıcıya ${entry.executor} (\`${entry.executor.id}\`) tarafından sağ tık \`Kick\` atıldı`).catch(err => {}); };
  });
  
  Guard_1.on("guildBanAdd", async (guild, user) => {
    let entry = await guild.fetchAuditLogs({type: 'MEMBER_BAN_ADD'}).then(audit => audit.entries.first());
    if (!entry || !entry.executor || guvenli(entry.executor.id) || !korumalar.banGuard) return;
     cezalandir(entry.executor.id, "ban");
    guild.members.unban(user.id, "Kullanıcıya Sağ Tık Ban Atıldığı İçin Banı Açıldı.").catch(console.error);
    let logKanali = Guard_1.channels.cache.find(a => a.name == Settings.Log.Guard_Log1)
    if (!logKanali) return console.log('Koruma Logu Yok');
    if (logKanali) { logKanali.send(`${members} (\`${member.id}\`), adlı kullanıcıya ${entry.executor} (\`${entry.executor.id}\`) tarafından sağ tık \`Ban\` atıldı, @everyone`).catch(); } 
    else {guild.owner.send(`🛡️ ${members} (\`${member.id}\`), adlı kullanıcıya ${entry.executor} (\`${entry.executor.id}\`) tarafından sağ tık \`Ban\` atıldı, @everyone`).catch(err => {}); };
  });
  
  Guard_1.on("guildMemberAdd", async member => {
    let entry = await member.guild.fetchAuditLogs({type: 'BOT_ADD'}).then(audit => audit.entries.first());
    if (!member.user.bot || !entry || !entry.executor || Date.now()-entry.createdTimestamp > 5000 || guvenli(entry.executor.id) || !korumalar.botGuard) return;
    cezalandir(entry.executor.id, "ban");
    cezalandir(member.id, "ban");
    let logKanali = Guard_1.channels.cache.find(a => a.name == Settings.Log.Guard_Log1)
    if (!logKanali) return console.log('Koruma Logu Yok');
    if (logKanali) { logKanali.send(`🛡️ ${member} (\`${member.id}\`), adlı bot ${entry.executor} (\`${entry.executor.id}\`) tarafından sunucuya \`Eklendi\`, @everyone`).catch(); }
    else{ member.guild.owner.send(`🛡️ ${member} (\`${member.id}\`), adlı bot ${entry.executor} (\`${entry.executor.id}\`) tarafından sunucuya \`Eklendi\`, @everyone`).catch(err => {}); };
  });
  
  Guard_1.on("guildUpdate", async (oldGuild, newGuild) => {
    let entry = await newGuild.fetchAuditLogs({type: 'GUILD_UPDATE'}).then(audit => audit.entries.first());
    if (!entry || !entry.executor || Date.now()-entry.createdTimestamp > 3000 || guvenli(entry.executor.id) || !korumalar.serverGuard) return;
    cezalandir(entry.executor.id, "ban");
    if (newGuild.name !== oldGuild.name) newGuild.setName(oldGuild.name);
    if (newGuild.iconURL({dynamic: true, size: 2048}) !== oldGuild.iconURL({dynamic: true, size: 2048})) newGuild.setIcon(oldGuild.iconURL({dynamic: true, size: 2048}));
    let logKanali = Guard_1.channels.cache.find(a => a.name == Settings.Log.Guard_Log1)
    if (!logKanali) return console.log('Koruma Logu Yok');
    if (logKanali) { logKanali.send(`${entry.executor} (\`${entry.executor.id}\`) adlı kullanıcı tarafından \`Sunucu Ayarları'nı\` güncellendi, @everyone`).catch(); }
    else { newGuild.owner.send(`🛡️ ${entry.executor} (\`${entry.executor.id}\`) adlı kullanıcı tarafından \`Sunucu Ayarları'nı\` güncellendi, @everyone `).catch(err => {}); };
  });
  
  Guard_1.on("webhookUpdate", async (channel) => {
    const entry = await channel.guild.fetchAuditLogs({type: 'WEBHOOK_CREATE'}).then(audit => audit.entries.first());
    if(!entry || !entry.executor || Date.now()-entry.createdTimestamp > 10000) return;
  if (!entry || !entry.executor || guvenli(entry.executor.id) || !korumalar.webhookGuard) return;
   const webhooks = await channel.fetchWebhooks();
    await webhooks.map(x => x.delete({reason: "Satuke || Webhook Sistemi"}))
    cezalandir(entry.executor.id, "ban");
    let logKanali = Guard_1.channels.cache.find(a => a.name == Settings.Log.Guard_Log1)
      if (!logKanali) return console.log('Koruma Logu Yok');
      if (logKanali) { logKanali.send(`🛡️ ${entry.executor} (\`${entry.executor.id}\`) adlı kullanıcı tarafından izinsiz şekilde \`Webhook\` açıldı, @everyone`).catch(err => {}); };
  });
  
  Guard_1.on("emojiDelete", async (emoji, message) => {
    const entry = await emoji.guild.fetchAuditLogs({ type: "EMOJI_DELETE" }).then(audit => audit.entries.first());
    if(!entry || !entry.executor || Date.now()-entry.createdTimestamp > 10000) return;
    if (!entry || !entry.executor || guvenli(entry.executor.id) || !korumalar.emojiDelete) return;
    emoji.guild.emojis.create(`${emoji.url}`, `${emoji.name}`).catch(console.error);
    cezalandir(entry.executor.id, "ban");
    let logKanali = Guard_1.channels.cache.find(a => a.name == Settings.Log.Guard_Log1)
    if (!logKanali) return console.log('Koruma Logu Yok');
    if (logKanali) { logKanali.send(`🛡️ ${entry.executor} (\`${entry.executor.id}\`) adlı kullanıcı tarafından, \`Emoji\` silindi.`).catch(err => {}); };
  });
  
  Guard_1.on("emojiCreate", async (emoji, message) => {
    const entry = await emoji.guild.fetchAuditLogs({ type: "EMOJI_CREATE" }).then(audit => audit.entries.first());
    if(!entry || !entry.executor || Date.now()-entry.createdTimestamp > 10000) return;
    if (!entry || !entry.executor || guvenli(entry.executor.id) || !korumalar.emojiCreate) return;
    emoji.delete({reason: "Satuke | Emoji Koruma Sistemi"});
    cezalandir(entry.executor.id, "jail");
    let logKanali = Guard_1.channels.cache.find(a => a.name == Settings.Log.Guard_Log1)
    if (!logKanali) return console.log('Koruma Logu Yok');
    if (logKanali) { logKanali.send(`🛡️ ${entry.executor} (\`${entry.executor.id}\`) adlı kullanıcı tarafından, \`Emoji\` yüklendi`).catch(err => {}); };
  });
  
  Guard_1.on("emojiUpdate", async (oldEmoji, newEmoji) => {
    if(oldEmoji === newEmoji) return;
    const entry = await oldEmoji.guild.fetchAuditLogs({ type: "EMOJI_UPDATE" }).then(audit => audit.entries.first());
    if(!entry || !entry.executor || Date.now()-entry.createdTimestamp > 10000) return;
    if (!entry || !entry.executor || guvenli(entry.executor.id) || !korumalar.emojiUpdate) return;
    cezalandir(entry.executor.id, "jail");
    await newEmoji.setName(oldEmoji.name);
    let logKanali = Guard_1.channels.cache.find(a => a.name == Settings.Log.Guard_Log1)
    if (!logKanali) return console.log('Koruma Logu Yok');
    if (logKanali) { logKanali.send(`🛡️ ${entry.executor} (\`${entry.executor.id}\`) adlı kullanıcı tarafından, \`Emoji\` güncellendi`).catch(err => {}); };
  });
  
  Guard_1.on("guildBanRemove", async(guild, user) => {
    let entry = await guild.fetchAuditLogs({ type: "MEMBER_BAN_REMOVE" }).then((audit) => audit.entries.first());
    if (!entry || !entry.executor || guvenli(entry.executor.id) || !korumalar.banRemove) return;
    cezalandir(entry.executor.id, "jail");
    guild.members.ban(entry.executor.id, { reason: "Banı Kaldırıldı Tekrar Atıldı || Satuke Security System" });
    guild.members.ban(user.id, { reason: "Banı Kaldırıldı Tekrar Atıldı || Satuke Security System" });
    let logKanali = Guard_1.channels.cache.find(a => a.name == Settings.Log.Guard_Log1)
    if (!logKanali) return console.log('Koruma Logu Yok');
    if (logKanali) { logKanali.send(`🛡️ ${entry.executor} (\`${entry.executor.id}\`) adlı kullanıcı birisinin İzinsiz \`Banını\` kaldırdı`).catch(err => {}); };
  });
  
  
  Guard_1.on('guildUpdate', async (oldGuild, newGuild) => {
    if (oldGuild.vanityURLCode === newGuild.vanityURLCode) return;
    let entry = await newGuild.fetchAuditLogs({ type: 'GUILD_UPDATE' }).then(audit => audit.entries.first());
    if (!entry.executor || entry.executor.id === Guard_1.user.id) return;
    let channel = Guard_1.channels.cache.find(x => x.name == Settings.Log.Guard_Log2)
    if (channel) channel.send(`🔐 ${entry.executor} (\`${entry.executor.id}\`) Sunucunun **${Settings.Server.VanityURL} adlı urlyi değiştirmeye çalıştı!, @everyone`)
    if (!channel) newGuild.owner.send(`🔐 ${entry.executor} ${entry.executor.id} Sunucunun **${Settings.Server.VanityURL} adlı urlyi değiştirmeye çalıştı! (Log Kanalını Bulamadığım İçin sana attım!)`)
    newGuild.members.ban(entry.executor.id, { reason: `URL Değiştirme | (Vanity Url Guard).`});
  
    const bisiylerdeniyom = {
        url: `https://discord.com/api/v6/guilds/${newGuild.id}/vanity-url`,
        body: {
        code: Settings.Server.VanityURL },
        json: true,
        method: 'PATCH',
        headers: { "Authorization": `Bot ${Settings.Token.Guard_1}` }
    };
  
    request(bisiylerdeniyom, (err, res, body) => {
        if (err) {
            return console.log(err);
        }
    });
  });
  
//                                                                CHANNEL GUARD                                                                / 

Guard_2.on("channelCreate", async channel => {
  let entry = await channel.guild.fetchAuditLogs({type: 'CHANNEL_CREATE'}).then(audit => audit.entries.first());
  if (!entry || !entry.executor || Date.now()-entry.createdTimestamp > 3000 || guvenli(entry.executor.id) || !korumalar.channelCreate) return;
  channel.delete({reason: "Kanal Açma Koruması"});
  cezalandir(entry.executor.id, "ban");
  let logKanali = Guard_2.channels.cache.find(a => a.name == Settings.Log.Guard_Log2)
  if (logKanali) { logKanali.send(`🛡️ ${entry.executor} (\`${entry.executor.id}\`) adlı kullanıcı tarafından yeni bir \`Kanal\` oluşturuldu, @everyone`).catch(); } 
  else { channel.guild.owner.send(`🛡️ ${entry.executor} (\`${entry.executor.id}\`) adlı kullanıcı tarafından yeni bir \`Kanal\` oluşturuldu, @everyone `).catch(err => {}); };
});

Guard_2.on("channelUpdate", async (oldChannel, newChannel) => {
  let entry = await newChannel.guild.fetchAuditLogs({type: 'CHANNEL_UPDATE'}).then(audit => audit.entries.first());
  if (!entry || !entry.executor || !newChannel.guild.channels.cache.has(newChannel.id) || Date.now()-entry.createdTimestamp > 3000 || guvenli(entry.executor.id) || !korumalar.channelUpdate) return;
  cezalandir(entry.executor.id, "jail");
  if (newChannel.type !== "category" && newChannel.parentID !== oldChannel.parentID) newChannel.setParent(oldChannel.parentID);
  if (newChannel.type === "category") {
    newChannel.edit({
      name: oldChannel.name,
    });
  } else if (newChannel.type === "text") {
    newChannel.edit({
      name: oldChannel.name,
      topic: oldChannel.topic,
      nsfw: oldChannel.nsfw,
      rateLimitPerUser: oldChannel.rateLimitPerUser
    });
  } else if (newChannel.type === "voice") {
    newChannel.edit({
      name: oldChannel.name,
      bitrate: oldChannel.bitrate,
      userLimit: oldChannel.userLimit,
    });
  };
  oldChannel.permissionOverwrites.forEach(perm => {
    let thisPermOverwrites = {};
    perm.allow.toArray().forEach(p => {
      thisPermOverwrites[p] = true;
    });
    perm.deny.toArray().forEach(p => {
      thisPermOverwrites[p] = false;
    });
    newChannel.createOverwrite(perm.id, thisPermOverwrites);
  });
  let logKanali = Guard_2.channels.cache.find(a => a.name == Settings.Log.Guard_Log2);
  if (!logKanali) return console.log('Koruma Logu Yok');
  if (logKanali) { logKanali.send(`🛡️ ${entry.executor} (\`${entry.executor.id}\`) adlı kullanıcı \`${oldChannel.name}\` adlı kanalı \`Güncelledi\, @everyone`).catch(); } 
 else { newChannel.guild.owner.send(`🛡️ ${entry.executor} (\`${entry.executor.id}\`) adlı kullanıcı \`${oldChannel.name}\` adlı kanalı \`Güncelledi\`, @everyone`).catch(err => {}); };
});

Guard_2.on("channelDelete", async channel => {
  let entry = await channel.guild.fetchAuditLogs({type: 'CHANNEL_DELETE'}).then(audit => audit.entries.first());
  if (!entry || !entry.executor || Date.now()-entry.createdTimestamp > 3000 || guvenli(entry.executor.id) || !korumalar.channelDelete) return;
  cezalandir(entry.executor.id, "ban");
  await channel.clone({ reason: "Satuke Kanal Silme Koruması" }).then(async kanal => {
    if (channel.parentID != null) await kanal.setParent(channel.parentID);
    await kanal.setPosition(channel.position);
    if (channel.type == "category") await channel.guild.channels.cache.filter(k => k.parentID == channel.id).forEach(x => x.setParent(kanal.id));});
    let logKanali = Guard_2.channels.cache.find(a => a.name == Settings.Log.Guard_Log2);
    if (!logKanali) return console.log('Koruma Logu Yok');
  if (logKanali) { logKanali.send(`🛡️ ${entry.executor} (\`${entry.executor.id}\`) adlı kullanıcı tarafından \`${channel.name}\` adlı kanalı \`Sildi\`, @everyone`).catch()} 
  else { channel.guild.owner.send(`🛡️ ${entry.executor} (\`${entry.executor.id}\`) adlı kullanıcı tarafından \`${channel.name}\` adlı kanalı \`Sildi\`, @everyone`).catch(err => {}); };
});


Guard_2.on('guildUpdate', async (oldGuild, newGuild) => {
  if (oldGuild.vanityURLCode === newGuild.vanityURLCode) return;
  let entry = await newGuild.fetchAuditLogs({ type: 'GUILD_UPDATE' }).then(audit => audit.entries.first());
  if (!entry.executor || entry.executor.id === Guard_2.user.id) return;
  let channel = Guard_2.channels.cache.find(x => x.name == Settings.Log.Guard_Log2)
  if (channel) channel.send(`🔐 ${entry.executor} (\`${entry.executor.id}\`) Sunucunun **${Settings.Server.VanityURL} adlı urlyi değiştirmeye çalıştı!, @everyone`)
  if (!channel) newGuild.owner.send(`🔐 ${entry.executor} ${entry.executor.id} Sunucunun **${Settings.Server.VanityURL} adlı urlyi değiştirmeye çalıştı! (Log Kanalını Bulamadığım İçin sana attım!)`)
  newGuild.members.ban(entry.executor.id, { reason: `URL Değiştirme | (Vanity Url Guard).`});

  const bisiylerdeniyom = {
      url: `https://discord.com/api/v6/guilds/${newGuild.id}/vanity-url`,
      body: {
      code: Settings.Server.VanityURL },
      json: true,
      method: 'PATCH',
      headers: { "Authorization": `Bot ${Settings.Token.Guard_2}` }
  };

  request(bisiylerdeniyom, (err, res, body) => {
      if (err) {
          return console.log(err);
      }
  });
});


//                                                                ROLE GUARD                                                                / 

Guard_3.on("guildMemberUpdate", async (oldMember, newMember) => {
    if (newMember.roles.cache.size > oldMember.roles.cache.size) {
      let entry = await newMember.guild.fetchAuditLogs({type: 'MEMBER_ROLE_UPDATE'}).then(audit => audit.entries.first());
      if (!entry || !entry.executor || Date.now()-entry.createdTimestamp > 5000 || guvenli(entry.executor.id) || !korumalar.roleMemberUpdate) return;
      if (PermArray.some(p => !oldMember.hasPermission(p) && newMember.hasPermission(p))) {
        cezalandir(entry.executor.id, "jail");
        newMember.roles.set(oldMember.roles.cache.map(r => r.id));
        let logKanali = Guard_3.channels.cache.find(a => a.name == Settings.Log.Guard_Log3)
        if (logKanali) { logKanali.send(`🛡️ ${newMember} (\`${newMember.id}\`) Adlı kullanıcıya ${entry.executor} (\`${entry.executor.id}\`) Tarafından \`Sağ Tık Rol\` verildi, yetkileri çekildi, @everyone`).catch(); } 
        else { newMember.guild.owner.send(`🛡️ ${newMember} (\`${newMember.id}\`) Adlı kullanıcıya ${entry.executor} (\`${entry.executor.id}\`) Tarafından \`Sağ Tık Rol\` verildi, yetkileri çekildi, @everyone`).catch(err => {}); };
      };
    };
  });

Guard_3.on("roleCreate", async role => {
    let entry = await role.guild.fetchAuditLogs({type: 'ROLE_CREATE'}).then(audit => audit.entries.first());
    if (!entry || !entry.executor || Date.now()-entry.createdTimestamp > 5000 || guvenli(entry.executor.id) || !korumalar.roleCreate) return;
    role.delete({ reason: "Rol açma koruması." });
    cezalandir(entry.executor.id, "ban");
    let logKanali = Guard_3.channels.cache.find(a => a.name == Settings.Log.Guard_Log3);
    if (logKanali) { logKanali.send(`⛔ ${entry.executor} (\`${entry.executor.id}\`) Adlı kullanıcı tarafından \`Rol\` oluşturuldu, @everyone`).catch(); }
   else { role.guild.owner.send(`⛔ ${entry.executor} (\`${entry.executor.id}\`) Adlı kullanıcı tarafından \`Rol\` oluşturuldu, @everyone`).catch(err => {}); };
  });

Guard_3.on("roleUpdate", async (oldRole, newRole) => {
    let entry = await newRole.guild.fetchAuditLogs({type: 'ROLE_UPDATE'}).then(audit => audit.entries.first());
    if (!entry || !entry.executor || !newRole.guild.roles.cache.has(newRole.id) || Date.now()-entry.createdTimestamp > 3000 || guvenli(entry.executor.id) || !korumalar.roleUpdate) return;
    cezalandir(entry.executor.id, "jail");
    if (PermArray.some(p => !oldRole.permissions.has(p) && newRole.permissions.has(p))) {
      newRole.setPermissions(oldRole.permissions);
      newRole.guild.roles.cache.filter(r => !r.managed && (r.permissions.has("ADMINISTRATOR") || r.permissions.has("MANAGE_ROLES") || r.permissions.has("MANAGE_GUILD"))).forEach(r => r.setPermissions(36818497));
    };
    newRole.edit({
      name: oldRole.name,
      color: oldRole.hexColor,
      hoist: oldRole.hoist,
      permissions: oldRole.permissions,
      mentionable: oldRole.mentionable
    });
    let logKanali = Guard_3.channels.cache.find(a => a.name == Settings.Log.Guard_Log3);
    if (logKanali) { logKanali.send(`⛔ ${entry.executor} (\`${entry.executor.id}\`) adlı kullanıcı \`${oldRole.name}\` adlı rolü \`Güncelledi\`, @everyone`).catch(); } 
    else { newRole.guild.owner.send(`⛔ ${entry.executor} (\`${entry.executor.id}\`) adlı kullanıcı \`${oldRole.name}\` adlı rolü \`Güncelledi\`, @everyone`).catch(err => {}); };
  });

  Guard_3.on("roleDelete", async role => {
    let entry = await role.guild.fetchAuditLogs({type: 'ROLE_DELETE'}).then(audit => audit.entries.first());
    if (!entry || !entry.executor || Date.now()-entry.createdTimestamp > 5000 || guvenli(entry.executor.id) || !korumalar.roleDelete) return;
    cezalandir(entry.executor.id, "ban");
    let yeniRol = await role.guild.roles.create({
      data: {
        name: role.name,
        color: role.hexColor,
        hoist: role.hoist,
        position: role.position,
        permissions: role.permissions,
        mentionable: role.mentionable
      },
      reason: "Rol Silindiği İçin Tekrar Oluşturuldu!"
    });
  
    Database.findOne({guildID: role.guild.id, roleID: role.id}, async (err, roleData) => {
      if (!roleData) return;
      setTimeout(() => {
        let kanalPermVeri = roleData.channelOverwrites;
        if (kanalPermVeri) kanalPermVeri.forEach((perm, index) => {
          let kanal = role.guild.channels.cache.get(perm.id);
          if (!kanal) return;
          setTimeout(() => {
            let yeniKanalPermVeri = {};
            perm.allow.forEach(p => {
              yeniKanalPermVeri[p] = true;
            });
            perm.deny.forEach(p => {
              yeniKanalPermVeri[p] = false;
            });
            kanal.createOverwrite(yeniRol, yeniKanalPermVeri).catch(console.error);
          }, index*5000);
        });
      }, 5000);
  
      let roleMembers = roleData.members;
      roleMembers.forEach((member, index) => {
        let uye = role.guild.members.cache.get(member);
        if (!uye || uye.roles.cache.has(yeniRol.id)) return;
        setTimeout(() => {
          uye.roles.add(yeniRol.id).catch();
        }, index*3000);
      });
    });
  
    let logKanali = Guard_3.channels.cache.find(a => a.name == Settings.Log.Guard_Log3);
    if (logKanali) { logKanali.send(`⛔ ${entry.executor} (\`${entry.executor.id}\`) Adlı kullanıcı tarafından \`${role.name}\` (\`${role.id}\`) adlı rol \`Silindi\`, @everyone`).catch(); } 
  else {
     role.guild.owner.send(`⛔ ${entry.executor} (\`${entry.executor.id}\`) Adlı kullanıcı tarafından \`${role.name}\` (\`${role.id}\`) adlı rol \`Silindi\, @everyone\``).catch(err => {}); };

})



Guard_1.on("ready", async () => {
  Guard_1.user.setPresence({ activity: { name: Settings.Server.Status }, status: "dnd" })
let botVoiceChannel = Guard_1.channels.cache.get(Settings.Server.VoiceChannel);
if (botVoiceChannel) botVoiceChannel.join().catch(err => console.error("[GUARD 1] Sese Bağlanamadı!"));
});

Guard_2.on("ready", async () => {
  Guard_2.user.setPresence({ activity: { name: Settings.Server.Status }, status: "dnd" })
let botVoiceChannel = Guard_2.channels.cache.get(Settings.Server.VoiceChannel);
if (botVoiceChannel) botVoiceChannel.join().catch(err => console.error("[GUARD 1] Sese Bağlanamadı!"));
});

Guard_3.on("ready", async () => {
  Guard_3.user.setPresence({ activity: { name: Settings.Server.Status }, status: "dnd" })
let botVoiceChannel = Guard_3.channels.cache.get(Settings.Server.VoiceChannel);
if (botVoiceChannel) botVoiceChannel.join().catch(err => console.error("[GUARD 1] Sese Bağlanamadı!"));

});
  


Guard_1.on('warn', m => console.log(`[WARN]:${m}`));
Guard_1.on('error', m => console.log(`[ERROR]: ${m}`));
Guard_1.on("disconnect", () => console.log("Bot bağlantısı kesildi"))
Guard_1.on("reconnecting", () => console.log("Bot tekrar bağlanıyor..."))
process.on('uncaughtException', error => console.log(`[ERROR]: ${error}`));
process.on('unhandledRejection', err => console.log(`[ERROR]: ${err}`));


Guard_2.on('warn', m => console.log(`[WARN]:${m}`));
Guard_2.on('error', m => console.log(`[ERROR]: ${m}`));
Guard_2.on("disconnect", () => console.log("Bot bağlantısı kesildi"))
Guard_2.on("reconnecting", () => console.log("Bot tekrar bağlanıyor..."))
process.on('uncaughtException', error => console.log(`[ERROR]: ${error}`));
process.on('unhandledRejection', err => console.log(`[ERROR]: ${err}`));


Guard_3.on('warn', m => console.log(`[WARN]:${m}`));
Guard_3.on('error', m => console.log(`[ERROR]: ${m}`));
Guard_3.on("disconnect", () => console.log("Bot bağlantısı kesildi"))
Guard_3.on("reconnecting", () => console.log("Bot tekrar bağlanıyor..."))
process.on('uncaughtException', error => console.log(`[ERROR]: ${error}`));
process.on('unhandledRejection', err => console.log(`[ERROR]: ${err}`));



Guard_1.login(Settings.Token.Guard_1).then(x => console.log(`[GUARD 1] - Olarak Başarıyla Giriş Yapıldı!`)).catch(err => console.error(`[ERROR] Hata : ${err}`))
Guard_2.login(Settings.Token.Guard_2).then(x => console.log(`[GUARD 2] - Olarak Başarıyla Giriş Yapıldı!`)).catch(err => console.error(`[ERROR] Hata : ${err}`))
Guard_3.login(Settings.Token.Guard_3).then(x => console.log(`[GUARD 3] - Olarak Başarıyla Giriş Yapıldı!`)).catch(err => console.error(`[ERROR] Hata : ${err}`))
