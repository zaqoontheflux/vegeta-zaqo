module.exports = async member => {

    const channel = member.guild.channels.cache.find(ch => ch.name === 'Nom Du channel ici');
    if (!channel) return;

    channel.send(`Au revoir, ${member}!`);
};