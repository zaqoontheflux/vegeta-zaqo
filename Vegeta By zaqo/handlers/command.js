const { readdirSync } = require("fs");
module.exports = (bot) => {
    readdirSync("./commands/").map(dir => {
        const commands = readdirSync(`./commands/${dir}/`).map(cmd=>{
            let pull = require(`../commands/${dir}/${cmd}`)
            console.log(`Chargement des Commandes ${pull.name}`)
            bot.commands.set(pull.name,pull)
            if(pull.aliases){
                pull.aliases.map(p=>bot.aliases.set(p,pull))
            }
        })
    })
}

// touche pas a ça