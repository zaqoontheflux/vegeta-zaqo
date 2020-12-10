module.exports = client => {

    // la c'est les set activity donc rien de fou

    client.user.setActivity("discord.gg/shweps", { type: 'STREAMING', url: 'https://twitch.tv/binkszaqo'}).catch(console.error);
    client.user.setUsername('zaqo on the flux'); 

    
  console.log(`wsh mgl ${client.user.username} Est en Ligne!`); 
};