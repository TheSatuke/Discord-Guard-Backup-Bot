const { Discord, Client, MessageEmbed } = require('discord.js');
const client = global.client = new Client({fetchAllMembers: true});
const Settings = require("../Settings.json");
const fs = require('fs');
const mongoose = require('mongoose');
mongoose.connect(Settings.Mongoose.DatabaseUrl, {useNewUrlParser: true, useUnifiedTopology: true});
const Database = require("./Models/RoleBackup");
client.on("ready", async () => {
  client.user.setPresence({ activity: { name: Settings.Server.Status }, status: "dnd" });
  let botVoiceChannel = client.channels.cache.get(Settings.Server.VoiceChannel);
  if (botVoiceChannel) botVoiceChannel.join().catch(err => console.error("Ses Kanalına Bağlanamadım"));
});

// ************************************************************************************************************************************* //

  setRoleBackup();
  setInterval(() => {
    setRoleBackup();
  }, 1000*60*60*1);;

// ************************************************************************************************************************************* //  

client.on("message", async message => {
  if (message.author.bot || !message.guild || !message.content.toLowerCase().startsWith(Settings.Prefix.BackupPrefix)) return;
  if (message.author.id !== Settings.Server.OwnerID && message.author.id !== message.guild.owner.id) return;
  let args = message.content.split(' ').slice(1);
  let command = message.content.split(' ')[0].slice(Settings.Prefix.BackupPrefix.length);
  let embed = new MessageEmbed().setColor("BLUE").setAuthor(message.member.displayName, message.author.avatarURL({ dynamic: true, })).setTimestamp();
  
  if (command === "eval" && message.author.id === Settings.Server.OwnerID) {
    if (!args[0]) return message.channel.send(`Kodu belirt.`);
      let code = args.join(' ');
      function clean(text) {
      if (typeof text !== 'string') text = require('util').inspect(text, { depth: 0 })
      text = text.replace(/`/g, '`' + String.fromCharCode(8203)).replace(/@/g, '@' + String.fromCharCode(8203))
      return text;
    };
    try { 
      var evaled = clean(await eval(code));
      if(evaled.match(new RegExp(`${client.token}`, 'g'))) evaled.replace(client.token, "Yasaklı komut");
      message.channel.send(`${evaled.replace(client.token, "Yasaklı komut")}`, {code: "js", split: true});
    } catch(err) { message.channel.send(err, {code: "js", split: true}) };
  };

  if(command === "restart") {
    message.channel.send("Bot yeniden başlatılıyor").then(msg => {
        console.log("[BOT] Yeniden başlatılıyor");
        process.exit(0);
    });
  
  };
  
  
// ************************************************************************************************************************************* //

  if(command === "kur" || command === "kurulum" || command === "backup" || command === "setup") {
    if (!args[0] || isNaN(args[0])) return message.channel.send(embed.setDescription("Geçerli bir \`Rol ID\` belirtmelisin."));

    Database.findOne({guildID: Settings.Server.GuildID, roleID: args[0]}, async (err, roleData) => {
      if (!roleData) return message.channel.send(embed.setDescription("Belirttiğin \`Rol ID'sine\` ait veri bulamadım."));
      let yeniRol = await message.guild.roles.create({
        data: {
          name: roleData.name,
          color: roleData.color,
          hoist: roleData.hoist,
          permissions: roleData.permissions,
          position: roleData.position,
          mentionable: roleData.mentionable
        },
        reason: "Rol silindiği için tekrar oluşturuldu."
      });

      setTimeout(() => {
        let kanalPermVeri = roleData.channelOverwrites;
        if (kanalPermVeri) kanalPermVeri.forEach((perm, index) => {
          let kanal = message.guild.channels.cache.get(perm.id);
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
        let uye = message.guild.members.cache.get(member);
        if (!uye || uye.roles.cache.has(yeniRol.id)) return;
        setTimeout(() => {
          uye.roles.add(yeniRol.id).catch(console.error);
        }, index*3000);
      });

      let logKanali = client.channels.cache.find(a => a.name == Settings.Log.databaseLog)
      if (logKanali) { logKanali.send(`🛡️ ${message.author} tarafından (\`${roleData.name}\`), (\`${roleData.roleID}\`) Rolün yedeği kurulmaya başladı, üyelere dağıtılmaya, kanalların izinlerine eklenmeye başlanıyor, @here`).catch(); }
      else { message.guild.owner.send(`🛡️ ${message.author} tarafından (\`${roleData.name}\`), (\`${roleData.roleID}\`) Rolün yedeği kurulmaya başladı, üyelere dağıtılmaya, kanalların izinlerine eklenmeye başlanıyor, @here`).catch(err => {}); };
    });
  };
});

function setRoleBackup() {
  let guild = client.guilds.cache.get(Settings.Server.GuildID);
  let DatabaseLog = client.channels.cache.find(a => a.name == Settings.Log.databaseLog)
  if (guild) {
    guild.roles.cache.filter(r => r.name !== "@everyone" && !r.managed).forEach(role => {
      let roleChannelOverwrites = [];
      guild.channels.cache.filter(c => c.permissionOverwrites.has(role.id)).forEach(c => {
        let channelPerm = c.permissionOverwrites.get(role.id);
        let pushlanacak = { id: c.id, allow: channelPerm.allow.toArray(), deny: channelPerm.deny.toArray() };
        roleChannelOverwrites.push(pushlanacak);
      });

      Database.findOne({guildID: Settings.Server.GuildID, roleID: role.id}, async (err, savedRole) => {
        if (!savedRole) {
          let newRoleSchema = new Database({
            _id: new mongoose.Types.ObjectId(),
            guildID: Settings.Server.GuildID,
            roleID: role.id,
            name: role.name,
            color: role.hexColor,
            hoist: role.hoist,
            position: role.position,
            permissions: role.permissions,
            mentionable: role.mentionable,
            time: Date.now(),
            members: role.members.map(m => m.id),
            channelOverwrites: roleChannelOverwrites
          });
          newRoleSchema.save();
        } else {
          savedRole.name = role.name;
          savedRole.color = role.hexColor;
          savedRole.hoist = role.hoist;
          savedRole.position = role.position;
          savedRole.permissions = role.permissions;
          savedRole.mentionable = role.mentionable;
          savedRole.time = Date.now();
          savedRole.members = role.members.map(m => m.id);
          savedRole.channelOverwrites = roleChannelOverwrites;
          savedRole.save();
        };
      });
    });

    Database.find({guildID: Settings.Server.GuildID}).sort().exec((err, roles) => {
      roles.filter(r => !guild.roles.cache.has(r.roleID) && Date.now()-r.time > 1000*60*60*24*3).forEach(r => {
        Database.findOneAndDelete({roleID: r.roleID});
     

      });
    });
    console.log(`Rollerin Yedeğini MongoDB'Ye kaydetttim.`);
    DatabaseLog.send(`📕 Sunucunun Rollerinin Yedeği Başarıyla Alındı!`)
  };
  
}


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


client.on('warn', m => console.log(`[WARN]:${m}`));
client.on('error', m => console.log(`[ERROR]: ${m}`));
client.on("disconnect", () => console.log("Bot bağlantısı kesildi"))
client.on("reconnecting", () => console.log("Bot tekrar bağlanıyor..."))
process.on('uncaughtException', error => console.log(`[ERROR]: ${error}`));
process.on('unhandledRejection', err => console.log(`[ERROR]: ${err}`));
client.login(Settings.Token.Backup).then(x => console.log(`[DATABASE] - Olarak Başarıyla Giriş Yapıldı!`)).catch(err => console.error(`[ERROR] Hata : ${err}`))
