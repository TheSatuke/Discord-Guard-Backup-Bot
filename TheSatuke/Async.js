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



Async.on('warn', m => console.log(`[WARN]:${m}`));
Async.on('error', m => console.log(`[ERROR]: ${m}`));
Async.on("disconnect", () => console.log("Bot bağlantısı kesildi"))
Async.on("reconnecting", () => console.log("Bot tekrar bağlanıyor..."))
process.on('uncaughtException', error => console.log(`[ERROR]: ${error}`));
process.on('unhandledRejection', err => console.log(`[ERROR]: ${err}`));

Async.login(Settings.Token.Async).then(x => console.log(`[ASYNC] - Olarak Başarıyla Giriş Yapıldı!`)).catch(err => console.error(`[ERROR] Hata : ${err}`))
