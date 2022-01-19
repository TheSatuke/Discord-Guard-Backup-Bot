const { Client } = require("discord.js");
const client = global.Client = new Client({ fetchAllMembers: true });
require('discord-reply');
const Settings = require("./Settings.json");

const mongoose = require("mongoose");
mongoose.connect(Settings.Mongoose.DatabaseUrl.replace("<dbname>", Settings.Mongoose.DatabaseName), {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});
mongoose.connection.on("connected", () => { console.log(`[Mongoose] MongoDB'ye başarıyla bağlandım.`)  
require("./TheSatuke/Async.js");
require("./TheSatuke/Data.js");
require("./TheSatuke/Guard.js");

});
