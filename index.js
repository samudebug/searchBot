const Discord = require('discord.js')
const client = new Discord.Client()
const config = require('./config.json')

client.on('ready', () => {
    client.user.setActivity("Soul Hackers 2", {
        type: "PLAYING",
    })
    console.log('Bot started, sexo gaming')
})

client.login(config.token)