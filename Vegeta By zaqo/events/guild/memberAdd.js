module.exports = async (member) => {

    // ça marchera pas car dans les parametres du bot faut que tu met on les intents nv truc de discord 
  
    // Welcome script avec channel finding
    const channel = member.guild.channels.cache.find(ch => ch.name === 'Nom du Channel ici');
    if (!channel) return;
    
    // Et la ça send
    channel.send(`Bienvenue, ${member}!`); 
  
  };