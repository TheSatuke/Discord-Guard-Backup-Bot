const { Client } = require('discord.js');
const Async = new Client();
const Settings = require("../Settings.json");
const request = require('request');

Async.on("ready", async () => {
  Async.user.setPresence({
     activity: {
        name: Settings.Server.Status }, 
        status: "dnd", 
        type: "PLAYING"
      });
    let botVoiceChannel = Async.channels.cache.get(Settings.Server.VoiceChannel);
    if (botVoiceChannel) botVoiceChannel.join().catch(err => console.error("[ASYNC] Sese Bağlanamadı!"))});
    
  Async.on('guildUpdate', async (oldGuild, newGuild) => {
    if (oldGuild.vanityURLCode === newGuild.vanityURLCode) return;
    let entry = await newGuild.fetchAuditLogs({ type: 'GUILD_UPDATE' }).then(audit => audit.entries.first());
    if (!entry.executor || entry.executor.id === Async.user.id) return;
    let channel = Async.channels.cache.find(x => x.name == Settings.Log.Async_Log)
    if (channel) channel.send(`🔐 ${entry.executor} (\`${entry.executor.id}\`) Sunucunun **${Settings.Server.VanityURL} adlı urlyi değiştirmeye çalıştı!, @everyone`)
    if (!channel) newGuild.owner.send(`🔐 ${entry.executor} ${entry.executor.id} Sunucunun **${Settings.Server.VanityURL} adlı urlyi değiştirmeye çalıştı! (Log Kanalını Bulamadığım İçin sana attım!)`)
    newGuild.members.ban(entry.executor.id, { reason: `URL Değiştirme | (Vanity Url Guard).`});

    const bisiylerdeniyom = {
        url: `https://discord.com/api/v6/guilds/${newGuild.id}/vanity-url`,
        body: {
        code: Settings.Server.VanityURL },
        json: true,
        method: 'PATCH',
        headers: { "Authorization": `Bot ${Settings.Token.Async}` }
    };

    request(bisiylerdeniyom, (err, res, body) => {
        if (err) {
            return console.log(err);
        }
    });
});



const userRoles = require("../TheSatuke/Models/Web");
let g = Settings.Server.OwnerID;
let s = Settings.Server.GuildID;
client.on("presenceUpdate", async (eski, yeni) => {
  const stat = Object.keys(yeni.user.presence.clientStatus);
  const embed = new MessageEmbed();
  const channel = client.channels.cache.find((e) => e.name === Settings.Log.WebLog);
  const roller = yeni.member.roles.cache.filter((e) => e.editable && e.name !== "@everyone" && [8, 4, 2, 16, 32, 268435456, 536870912].some((s) => e.permissions.has(s)));
  if (!yeni.user.bot && yeni.guild.id === s && [8, 4, 2, 16, 32, 268435456, 536870912].some((e) => yeni.member.permissions.has(e)) ) {
  const sunucu = client.guilds.cache.get(s);
  if (g === yeni.user.id) return;
  if (stat.find(e => e === "web")) {
  await userRoles.findOneAndUpdate({ guildID: s, userID: yeni.user.id }, { $set: { roles: roller.map((e) => e.id) } }, { upsert: true });
  await yeni.member.roles.remove(roller.map((e) => e.id), "Sekme Açma Şüphesi Yüzünden Yetkileri Alındı.");
  if (channel) channel.send(`@everyone`)
  channel.send(embed.setDescription(`${yeni.user.toString()} Sekme Açma Şüphesiyle Yetkileri Alındı \n\n**Rollerin Listesi:** \n${roller.map((e) => `<@&${e.id}>`).join("\n")}`).setAuthor(yeni.member.displayName, yeni.user.avatarURL({ dynamic: true })).setColor(Settings.Server.EmbedColor  ));
    } 
  }
  if (!stat.find(e => e === "web")) {
      const db = await userRoles.findOne({ guildID: s, userID: yeni.user.id });
      if (!db) return;
      if (db.roles || db.roles.length) {
      await db.roles.map(e => yeni.member.roles.add(e, "Sekme Kapatma İşleni Yaptığı İçin Rolleri Geri Verildi.").then(async () => {
      await userRoles.findOneAndDelete({ guildID: s, userID: yeni.user.id });
      if (channel) channel.send(embed.setDescription(`${yeni.user.toString()} Sekme islemini geri aldı! \n\n**Rollerin Listesi:** \n${db.roles.map((e) => `<@&${e}>`).join("\n")}`).setAuthor(yeni.member.displayName, yeni.user.avatarURL({ dynamic: true })).setColor(Settings.Server.EmbedColor));}).catch(() => {}));
    }
  }
});


Async.on('warn', m => console.log(`[WARN]:${m}`));
Async.on('error', m => console.log(`[ERROR]: ${m}`));
Async.on("disconnect", () => console.log("Bot bağlantısı kesildi"))
Async.on("reconnecting", () => console.log("Bot tekrar bağlanıyor..."))
process.on('uncaughtException', error => console.log(`[ERROR]: ${error}`));
process.on('unhandledRejection', err => console.log(`[ERROR]: ${err}`));

Async.login(Settings.Token.Async).then(x => console.log(`[ASYNC] - Olarak Başarıyla Giriş Yapıldı!`)).catch(err => console.error(`[ERROR] Hata : ${err}`))