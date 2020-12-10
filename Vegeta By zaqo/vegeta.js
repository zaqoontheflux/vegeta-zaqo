
// Module ignore ça aussi


const Discord = require('discord.js'),
client = new Discord.Client({
  partials: ['MESSAGE', 'REACTION']
})
const settings = require("./settings.json");
const { Client, MessageEmbed } = require('discord.js');
const bot = new Discord.Client()
const moment = require('moment');
const fs = require('fs')
let bl = JSON.parse(fs.readFileSync('./blacklist.json', 'utf8'))
const token = settings.token;
const whitelist = require("./whitelist.json");



client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
client.categories = fs.readdirSync("./commands/");
client.prefix = settings.prefix;




// Command handler ignore cette ligne^^


["command", "event"].forEach(handler => {
    require(`./handlers/${handler}`)(client);
  });
 
  client.on('guildMemberAdd', async member => {
    require("./events/guild/memberAdd")(member)
  })
  
  client.on('guildMemberRemove', async (message) => {
    require("./events/guild/memberRemove")(message)
})




// Message reaction (Pour rôle perso / Bienvenue)

client.on('messageReactionRemove', (reaction, user) => {
  if (!reaction.message.guild || user.bot) return
  const reactionRoleElem = settings.reactionRole[reaction.message.id]
  if (!reactionRoleElem || !reactionRoleElem.removable) return
  const prop = reaction.emoji.id ? 'id' : 'name'
  const emoji = reactionRoleElem.emojis.find(emoji => emoji[prop] === reaction.emoji[prop])
  if (emoji) reaction.message.guild.member(user).roles.remove(emoji.roles)
})

  client.on('messageReactionAdd', (reaction, user) => {
    if (!reaction.message.guild || user.bot) return
    const reactionRoleElem = settings.reactionRole[reaction.message.id]
    if (!reactionRoleElem) return
    const prop = reaction.emoji.id ? 'id' : 'name'
    const emoji = reactionRoleElem.emojis.find(emoji => emoji[prop] === reaction.emoji[prop])
    if (emoji) reaction.message.guild.member(user).roles.add(emoji.roles)
    else reaction.users.remove(user)
})


// Anti spam pas utile tah les fou mais si t'en as pas toujours util

const AntiSpam = require('discord-anti-spam');
const ms = require('ms');
const antiSpam = new AntiSpam({
    warnThreshold: 7,
    kickThreshold: 12, 
    banThreshold: 15, 
    maxInterval: 2000, 
    warnMessage: '{@user}, Arrêter de spam', 
    kickMessage: '**{user_tag}** a été kick pour spam.', 
    banMessage: '**{user_tag}** a été banni pour spam.', 
    maxDuplicatesWarning: 7,
    maxDuplicatesKick: 10, 
    maxDuplicatesBan: 12, 
    exemptPermissions: [ 'ADMINISTRATOR'], 
    ignoreBots: true,
    verbose: true, 
    ignoredUsers: [], 
});
 
client.on('message', (message) => antiSpam.message(message)); 



// Blacklist de mots / invite comme tu veux 

client.on('message', message => {
  if(message.member.roles.cache.has('768424922182582303')){ // ID du rôle des membre 
    if(settings.BLACK_LIST.some(word => message.content.toLowerCase().includes(word))){
      message.delete() // ou tu veux mettre un member.ban() comme tu veux
  }
}})

client.login(settings.token).catch(console.error);
  client.on('ready', () => {
 console.log('Blacklist de mots ready !');
});



// Clear command 

client.on('message', message => {
  if(message.content.startsWith('&clear')){
    if(message.member.hasPermission('MANAGE_MESSAGES')){ 
      const verif = client.emojis.cache.find(emoji => emoji.name === "verif2");     // les 3 lignes de code c'est les emoji custom donc t'as juste a mettre leur nom entre """
      const annonce = client.emojis.cache.find(emoji => emoji.name === "annonce");
      const cross = client.emojis.cache.find(emoji => emoji.name === "refus");
  
      let args = message.content.trim().split(/ +/g);
  
      if(args[1]){
        if(!isNaN(args[1]) && args[1] >= 1 && args[1] <= 99){
  
          message.channel.bulkDelete(args[1])
          message.channel.send(moment().format("`LTS` ・ ") + `${verif}` + ' Vous avez supprimé ' + `\`${args[1]}\`` + ' messages.').then(message => {message.delete({ timeout: 2000 })})
          message.channel.bulkDelete(1)
  
        }
        else {
          message.channel.send(moment().format("`LTS` ・ ") + `${annonce}` + ' Veuillez indiquer un nombre entre `1-99`').then(message => {message.delete({ timeout: 2000 })})  
        }
      }
      else{
        message.channel.send(moment().format("`LTS` ・ ") + `${annonce}` + ' Veuillez indiquer un nombre.').then(message => {message.delete({ timeout: 2000 })})
      }
    }
  }
})
  



// Ban command ( faut avoir le role @ban pour pouvoir ban ou tu modif les perms pour les admins )
//   if(!msg.member.hasPermission('ADMINISTRATOR')){

client.on('message', msg => {
  if(msg.member.roles.cache.some(role => role.name === '🔨・Ban')){
    const cross = client.emojis.cache.find(emoji => emoji.name === "refus");
    const verif = client.emojis.cache.find(emoji => emoji.name === "verif2");
      if (!msg.guild) return;
      if (msg.content.startsWith('&ban')) {
        const user = msg.mentions.users.first();
        if (user) {
          const member = msg.guild.member(user);
          if (msg.member.roles.highest.comparePositionTo(member.roles.highest) < 1 && msg.author.id !== msg.guild.ownerID) return msg.channel.send(moment().format("`LTS` ・ ") + `${cross}` + " Vous ne pouvez pas " + `\`Ban\`` + " cet utilisateur.")
          if (member) {
            member
              .ban({
                reason: 'Banni par Planète Vegeta',
              })
              .then(() => {
                msg.channel.send(moment().format("`LTS` ・ ") + `${verif}` + ` L'utilisateur \`${user.tag}\` a été banni avec succès.`);
              })
              .catch(err => {
                msg.channel.send(moment().format("`LTS` ・ ") + `${cross}` + ' Impossible de ban cet utilisateur.'); 
                console.error(err);
              });
          } else {
            msg.channel.send(moment().format("`LTS` ・ ") + "Cet utilisateur n'est pas dans le serveur.");
          }
        } else {
          msg.channel.send(moment().format("`LTS` ・ ") + `${cross}` + " Veuillez mentionner un `@user` !");
        }
      }
    }
});







// La c'est les ID Whitelist donc en sah jav une grosse flm de la faire donc jv la refaire

client.on('message', async message => {
if(message.author.id != 731991923979583488 && message.author.id != 263500755338526720) {
    return;
}

switch(message.content.toLowerCase()) {
  case ("&unbanall"):
      if (message.member.hasPermission("ADMINISTRATOR")) {
        const cross = client.emojis.cache.find(emoji => emoji.name === "refus");
        const annonce = client.emojis.cache.find(emoji => emoji.name === "annonce");
        const verif = client.emojis.cache.find(emoji => emoji.name === "verif2");
          message.guild.fetchBans().then(bans => {
              if (bans.size == 0) {message.channel.send(moment().format("`LTS` ・ " ) + `${annonce}` + " Aucun membres est banni du serveur."); throw "No members to unban."};
                  bans.forEach(ban => {
                    message.guild.members.unban(ban.user.id);
                  });
            }).then(() => message.channel.send(moment().format("`LTS` ・ " ) + `${verif}` + " Tous les membres du serveur on été debanni avec succès.")).catch(e => console.log(e))
        } else {message.reply("pas assez de perm mgl")}
    break;
}


  let args = message.content.trim().split(/ +/g)

  if (args[0].toLocaleLowerCase() === '&bl') {
    const user = message.mentions.users.first();
    const verif = client.emojis.cache.find(emoji => emoji.name === "verif2");
    const member = message.guild.member(user);
    if (member) {
      member
        .ban({
          reason: 'Membre Blacklist (Ne pas deban)',
        })
    if (!message.member.hasPermission("ADMINISTRATOR")) return message.reply("tu n'as pas la permission `ADMINISTRATOR`")
    let blU = message.mentions.users.first()
    if (!blU) return message.channel.send(moment().format("`LTS` ・ " ) + "Veuillez mentionner un `@user` a blacklist")
    bl[blU.id] = {
        bl: "true"
    }
    fs.writeFile("./blacklist.json", JSON.stringify(bl, null, 4), err => {
        if (err) throw err; 
    })
    message.channel.send(moment().format("`LTS` ・ ") + `${verif}` + " L'utilisateur " + `\`${blU.tag}\`` + " a été blacklist avec succès.")
}}})




client.on("guildMemberAdd", member => {
  if (!bl[member.id]) {
      bl[member.id] = {
          bl: "false"
      }
      fs.writeFile("./blacklist.json", JSON.stringify(bl, null, 4), err => {
          if (err) throw err;
      })
  }
  if (bl[member.id].bl === "true") {
    member.ban({
      reason: "Membre Blacklist (Ne pas deban)",
    })
      member.send("Vous avez été blacklist de ce serveur !")
      member.guild.channels.cache.get("769242116358406195").send(member + " est blacklist > join")
  }
  })




// Lockdown tu peiux modifier les perms en rajoutant id: role.id etc et les deny etc


client.on('message', msg => {
  if (!msg.member.hasPermission('ADMINISTRATOR')) return;

  if (msg.content === "&lockdown on") {
    const verif = client.emojis.cache.find(emoji => emoji.name === "verif2");
    let channel = msg.channel;
    let roles = msg.guild.roles; // collection
    const Role = msg.guild.roles.cache.find(r => r.name === '🍭・Membre');

    channel.overwritePermissions([
      {
         id: Role.id,
         deny: ['SEND_MESSAGES'],
      },
    ], 'Lockdown')

        msg.channel.send(moment().format("`LTS` ・ ") +  `${verif}` + " Le salon a été lockdown. `🔒`")
        .catch(console.log);
}});
  

client.on('message', msg => {
  if (!msg.member.hasPermission('ADMINISTRATOR')) return;

  if (msg.content === "&lockdown off") {
    const verif = client.emojis.cache.find(emoji => emoji.name === "verif2");
    let channel = msg.channel;
    let roles = msg.guild.roles; // collection
    const Role = msg.guild.roles.cache.find(r => r.name === '🍭・Membre');
  

    channel.overwritePermissions([
      {
         id: Role.id,
         allow: ['SEND_MESSAGES'],
      },
    ], 'Lockdown')

        msg.channel.send(moment().format("`LTS` ・ ") +  `${verif}` + " Lockdown retiré avec succès. `🔓`")
        .catch(console.log);
}});





//                        WHITELIST CMD ONLY                      //

client.on('message', message => {
    if(whitelist.WL.some(word => message.content.toLowerCase().includes(word))) {
      return;
    }

    if (msg.content === '&removeall join'){
      const verif = client.emojis.cache.find(emoji => emoji.name === "verif2");
      const Role = msg.guild.roles.cache.get("778724323607314442");
      Role.members.forEach((member, i) => { 
          setTimeout(() => {
              member.roles.remove(Role);
          }, i * 1000);
          msg.channel.send(moment().format("`LTS` ・ ") +  `${verif}` + " Le rôle `✈️・Join` a été retiré avec succès a tout les utilisateurs.")
      });
    }

    if (msg.content === '&removeall voc'){  
      const verif = client.emojis.cache.find(emoji => emoji.name === "verif2");
      const Role = msg.guild.roles.cache.get("778724320369311754");
      Role.members.forEach((member, i) => { 
          setTimeout(() => {
              member.roles.remove(Role); 
          }, i * 1000);
          msg.channel.send(moment().format("`LTS` ・ ") +  `${verif}` + " Le rôle `🔊・Voc` a été retiré avec succès a tout les utilisateurs.")
      });
    }
    
    if (msg.content === '&boost'){
      const boost = client.emojis.cache.find(emoji => emoji.name === "boost");
     msg.channel.send(moment().format("`LTS` ・ ") +  `${boost}` + " Il y a " + `\`${msg.guild.premiumSubscriptionCount}\`` + " Boosters sur **Night Strip 🍭**")
    }

    

    if(msg.content === '&vc') {
      const verif = client.emojis.cache.find(emoji => emoji.name === "annonce");
      const voiceChannels = msg.guild.channels.cache.filter(c => c.type === 'voice');
      let count = 0;

      for (const [id, voiceChannel] of voiceChannels) count += voiceChannel.members.size;
      msg.channel.send(moment().format("`LTS` ・ ") + `${verif}` + " Il y a actuellement " + `\`\`${count}\`\`` + " membre(s) en vocal.");

    }

    if (msg.content === `${settings.prefix}h`){
      const hembed = new MessageEmbed()
      .setTitle("**Listes des Commandes :**")
      .setDescription("```Commandes des Listes: \n &lh \n &lge \n &low \n &lad \n &lst \n &ljo \n &lvo \n &wl \n &lha \n &lpo \n &ltr \r\r Commandes de Modération: \n &bl <@user> \n &moveall \n &ban <@user> \n &mcount```")
      .setColor("WHITE")
      msg.channel.send(hembed)
    }


    if (msg.content === '&wl'){
        const wlembed = new MessageEmbed()
        .setTitle('Membre Whitelist')
        .setColor("#FFFAFA")
        .setDescription('\r`731991923979583488` | <@731991923979583488> \r\r `263500755338526720` | <@263500755338526720> ')
        .setFooter("Night Strip 🍭")
        msg.channel.send(wlembed);
    }


    if(msg.author.bot) return;
    if(msg.content=="&moveall"){
      msg.delete()
      const channel = msg.member.voice.channel;
      const voiceChannels = msg.guild.channels.cache.filter(c => c.type === 'voice');
      let count = 0;
      
      for (const [id, voiceChannel] of voiceChannels) count += voiceChannel.members.size;
      msg.guild.members.cache.forEach(member => {
        if(member.id === msg.member.id || !member.voice.channel) return;
        member.voice.setChannel(channel)
      }); 
    } 


    if (msg.content === '&mc'){
      const verif = client.emojis.cache.find(emoji => emoji.name === "annonce");
      msg.channel.send(moment().format("`LTS` ・ ") + `${verif}` + " Il y a actuellement " + `\`\`${msg.guild.memberCount}\`\`` + " membre(s) dans le serveur");
    }

  });

  


client.on('guildMemberAdd', member => {
  console.log(member.user.tag);
});







bot.login(settings.token)
client.login(settings.token);