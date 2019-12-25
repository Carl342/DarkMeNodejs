const ownerID = 656693245669015572;
const fs = require("fs");
const db = require("quick.db"); // Required
const config = require("./config.json");
const Discord = require("discord.js");
const bot = new Discord.Client();
let prefix = config.prefix;

bot.on("ready", () => {
  bot.user.setStatus("dnd");
  bot.user.setPresence({
    game: {
      name: "the Development Server with ${guild.memberSize}",
      type: "watching",
      url: "https://discordapp.com/"
    }
  });
});

bot.on("guildMemberAdd", member => {
  member.guild.channels
    .get("656694958752792600")
    .send(
      `Welcome ${member}!\nThis server is dedicated to being the most enjoyable time for life!\nSo Enjoy,BUT NEVER EVER Break a rule :)`
    ); // Created by Karambit#2229/Ryyan
});

bot.on("message", async message => {
  if (message.author.bot) return;
  if (message.channel.type === "dm") return;
  if (!message.content.startsWith(prefix)) return;

  const args = message.content
    .slice(prefix.length)
    .trim()
    .split(/ +/g);
  const command = args.shift().toLowerCase();

  if (command === "uptime") {
    let totalSeconds = bot.uptime / 1000;
    let days = Math.floor(totalSeconds / 86400);
    let hours = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;
    let minutes = Math.floor(totalSeconds / 60);
    let uptime = `${days} days, ${hours} hours, and ${minutes} minutes`;
    message.channel.send(uptime);
  }

  if (command === "ping") {
    message.channel.send(
      ":ping_pong: Pong!\nLatency Delay is ${(message.createdTimestamp = message.createdTimestamp)}ms!\nWhile API Delay is at " + Math.round(bot.ping) + "ms");
  }

  if (command === "reset") {
    if (message.author.id == ownerID) {
      resetBot(message.channel);

      function resetBot(channel) {
        message.channel.send("Bot is restarting");
        bot.user.setActivity(`Restarting......`);
        message
          .reply("✅ Bot has been restarted successfully!")
          .then(msg => bot.destroy())
          .then(() => bot.login(process.env.TOKEN));
      }
    }
  }

  if (command === "servers") {
    message.channel.send(`Serving ${bot.guilds.size} servers`);
    message.channel.send(bot.guilds.map(g => g.name).join("\n"));
  }

  if (command === "kick") {
    if (!message.member.hasPermission("KICK_ MEMBERS"))
      return message.channel.send(`You don't have permission to kick members.`);

    if (!message.guild.me.hasPermission("KICK_MEMBERS"))
      return message.channel.send("I don't have permission to kick members.");

    let member =
      message.mentions.members.first() || message.guild.members.get(args[0]);
    if (!member) {
      return message.channel.send(`Please specify a member to kick.`);
    }
    if (member.hasPermission("KICK_MEMBERS")) {
      return message.channel.send(
        `I cannot kick that member They're a mod/admin.`
      );
    }
    if (!member.kickable) {
      return message.channel.send(
        `I cannot kick that user due to role hierarchy`
      );
    }
    let reason = args.slice(1).join(" ");
    if (!reason) {
      reason = "no reason given";
    }
    await member
      .send(
        `You have been kicked from \`${message.guild.name}\`.\nAuthor:${message.author}\nUser Statement: \`${reason}\``
      )
      .catch(err =>
        message.channel.send(`⚠ Unable to alert ${member} of reason.`)
      );
    member.kick(reason);
    message.channel.send(`${member.user.tag} has been successfully kicked.`);
  }

  if (command === "serverinfo") {
    function checkDays(date) {
      let now = new Date();
      let diff = now.getTime() - date.getTime();
      let days = Math.floor(diff / 86400000);
      return days + (days == 1 ? " day" : " days") + " ago";
    }
    let verifLevels = [
      "None",
      "Low",
      "Medium",
      "(╯°□°）╯︵  ┻━┻",
      "┻━┻ミヽ(ಠ益ಠ)ノ彡┻━┻"
    ];
    let region = {
      brazil: ":flag_br: Brazil",
      "eu-central": ":flag_eu: Central Europe",
      singapore: ":flag_sg: Singapore",
      "us-central": ":flag_us: U.S. Central",
      sydney: ":flag_au: Sydney",
      "us-east": ":flag_us: U.S. East",
      "us-south": ":flag_us: U.S. South",
      "us-west": ":flag_us: U.S. West",
      "eu-west": ":flag_eu: Western Europe",
      "vip-us-east": ":flag_us: VIP U.S. East",
      london: ":flag_gb: London",
      amsterdam: ":flag_nl: Amsterdam",
      hongkong: ":flag_hk: Hong Kong",
      russia: ":flag_ru: Russia",
      southafrica: ":flag_za:  South Africa"
    };
    const embed = new Discord.RichEmbed()
      .setAuthor(message.guild.name, message.guild.iconURL)
      .addField("Name", message.guild.name, true)
      .addField("ID", message.guild.id, true)
      .addField(
        "Owner",
        `${message.guild.owner.user.username}#${message.guild.owner.user.discriminator}`,
        true
      )
      .addField("Region", region[message.guild.region], true)
      .addField(
        "Total | Humans | Bots",
        `${message.guild.members.size} | ${
          message.guild.members.filter(member => !member.user.bot).size
        } | ${message.guild.members.filter(member => member.user.bot).size}`,
        true
      )
      .addField(
        "Verification Level",
        verifLevels[message.guild.verificationLevel],
        true
      )
      .addField("Channels", message.guild.channels.size, true)
      .addField("Roles", message.guild.roles.size, true)
      .addField(
        "Creation Date",
        `${message.channel.guild.createdAt
          .toUTCString()
          .substr(0, 16)} (${checkDays(message.channel.guild.createdAt)})`,
        true
      )
      .setThumbnail(message.guild.iconURL);
    message.channel.send({
      embed
    });
  }

  if (command === "whois") {
    const { stripIndents } = require("common-tags");
    const { getMember, formatDate } = require("./functions.js");
    let { RichEmbed } = require("discord.js");
    let member = getMember(message, args.join(" "));

    // Member variables
    const joined = formatDate(member.joinedAt);
    const roles =
      member.roles
        .filter(r => r.id !== message.guild.id)
        .map(r => r)
        .join(", ") || "none";

    // User variables
    const created = formatDate(member.user.createdAt);

    const embed = new RichEmbed()
      .setFooter(`Created by Karambit#2229/Ryyan`, member.user.displayAvatarURL)
      .setThumbnail(member.user.displayAvatarURL)
      .setColor(
        member.displayHexColor === "#000000"
          ? "#ffffff"
          : member.displayHexColor
      )

      .addField(
        "Member information:",
        stripIndents`**- Display name:** ${member.displayName}
        **- Joined at:** ${joined}
        **- Roles:** ${roles}`,
        true
      )

      .addField(
        "User information:",
        stripIndents`**- ID:** ${member.user.id}
        **- Username**: ${member.user.username}
        **- Tag**: ${member.user.tag}
        **- Created at**: ${created}`,
        true
      )

      .setTimestamp();

    if (member.user.presence.game)
      embed.addField(
        "Currently playing",
        stripIndents`** Name:** ${member.user.presence.game.name}`
      );

    message.channel.send(embed);
  }

  if (command === "eval") {
    if (message.author.id == ownerID) {
      try {
        const code = args.join(" ");
        let evaled = eval(code);
        if (typeof evaled !== "string")
          evaled = require("util").inspect(evaled);
        message.channel.send(evaled);
      } catch (err) {
        console.log(err);
      }
    }
  }

  if (command === "ban") {
    // Created by Karambit#2229/Ryyan#2229
    if (!message.member.hasPermission("BAN_ MEMBERS"))
      return message.channel.send(`You dont have permission to ban members.`);

    if (!message.guild.me.hasPermission("BAN_MEMBERS"))
      return message.channel.send("I don't have permission to ban members.");

    let member =
      message.mentions.members.first() || message.guild.members.get(args[0]);
    if (!member) {
      return message.channel.send(`Please specify a member to ban.`);
    }
    if (member.hasPermission("BAN_MEMBERS")) {
      return message.channel.send(
        `I cannot ban that member They're a mod/admin.`
      );
    }
    if (!member.bannable) {
      return message.channel.send(
        `I cannot ban that user due to role hierarchy`
      );
    }
    let reason = args.slice(1).join(" ");
    if (!reason) {
      reason = "no reason given";
    }
    await member
      .send(
        `You have been banned from \`${message.guild.name}\`.\nAuthor: ${message.author}\nUser Statement:\`${reason}\``
      ) // Stop. Hold On I'm editing the code.
      .catch(err =>
        message.channel.send(`⚠ Unable to alert ${member} of reason.`)
      );
    member.ban(reason);
    message.channel.send(`${member.user.tag} has been successfully banned.`);
  } //Please make me a help command. Please Hold On a minute

  if (command === "help") {
    let embed = new Discord.RichEmbed()
      .setColor("BLUE")
      .setAuthor(`${bot.user.username} Help`, message.guild.iconURL)
      .setThumbnail(bot.user.displayAvatarURL)
      .setTimestamp()
      .addField(
        `General Commands:`,
        "``ping`` ``uptime`` ``whois`` ``serverinfo`` ``botinfo`` ``8ball``"
      )
      .addField(`Moderation Commands:`, "``ban`` ``kick``")
      .addField(`Developer Commands:`, "``reset`` ``eval`` ``servers``")
      .addField(`Music Commands:`, "``Coming Soon!``")
      .addField(`Economic Commands:`, "``bal``")
      .addField(`Information Commands:`, "``invite``")
      .addField(`Silly Commands😂:`, "``hi``")
      .addField(`Updates:`, "``Updated its help command with silly commands 😂😂😂``")
      .setDescription(
        "These Are my current commands, More being adding in the future!"
      )
      .setFooter(
        `Created by Karambit#2229 and Alex Devs#3240`,
        bot.user.displayAvatarURL
      );
    let sent = new Discord.RichEmbed()
      .setTitle(`Success!`)
      .setDescription(`${message.author} check Your DMs!`);
    message.channel.send(sent).then(msg => msg.delete(5000));
    message.author.send(embed);
  }

  if (command === "botinfo") {
    let embed = new Discord.RichEmbed()
      .setColor("RANDOM")
      .setAuthor(`${bot.user.username} Info`)
      .setThumbnail(bot.user.displayAvatarURL)
      .setTimestamp()
      .addField(`Bot Owner`, "``Alex Devs#3240``")
      .addField(`Respirotory:`, "``discord.js``")
      .addField(`Bot Creation:`, "``12/15/2019``")
      .addField(`Guilds:`, `${bot.guilds.size}`)
      .addField(`Users:`, `${bot.users.size}`)
      .addField(`Credits:`, "``Karambit#2229``")
      .addField(
        `Support Server:`,
        "[Support Server](https://discord.gg/GxENnGP)"
      )
      .addField(
        `Invite Me:`,
        "[Invite Me](https://discordapp.com/oauth2/authorize?client_id=655718265930121236&scope=bot&permissions=2146876671)"
      )
      .setDescription(`My Bot Info`)
      .setFooter(`I am now serving you`);
    let sent = new Discord.RichEmbed()
      .setTitle(`My Info has been sent to you!`)
      .setDescription(`✅Success`);
    message.channel.send(sent).then(msg => msg.delete(5000));
    message.author.send(embed);
  }

  if (command === "invite") {
    const Invite = new Discord.RichEmbed();
    Invite.setDescription(
      `Invite me [here](https://discordapp.com/oauth2/authorize?client_id=${bot.user.id}&scope=bot&permissions=268545094)`
    );
    Invite.setColor("RED");
    message.channel.send(Invite);
  }

  if (command === "8ball") {
    if (!args[0]) return message.reply("Please ask a full question");
    let replies = [
      "It is certain",
      "It is decidedly so",
      "Without a doubt",
      "Yes, definitely",
      "As I see it, yes",
      "Most likely",
      "Yes",
      "Signs point to yes",
      "Ask again later",
      "Better not tell you now",
      "Cannot predict now",
      "Concentrate and ask again",
      "Don't count on it",
      "My reply is no",
      "My sources say no",
      "Very doubtful"
    ];

    let result = Math.floor(Math.random() * replies.length);
    let question = args.join(" ");
    let ballembed = new Discord.RichEmbed()
      .setAuthor(message.author.tag)
      .setColor("#42f453")
      .addField("🎱Question", question)
      .addField("🎱Answer", replies[result]);
    message.channel.send(ballembed);
  }
  if (command === "bal") {
    let bal = await db.fetch(`money_${message.guild.id}_${message.author.id}`); // Fetch the balance.

    if (bal === null) bal = 1000; // If it's null, aka error then the bal is 0.

    message.channel.send("You have a balance of `" + bal + "`"); // Send the message.
  }

  if (command === "hi") {
    message.channel.send(
      `Hi!\nI a ${bot.user.username}!\n Enjoy me as time would pass by!\nSo, Lets pway!`
    );
  }
});

bot.login(process.env.TOKEN);








       
       
       
               
               
               
 
    
  
