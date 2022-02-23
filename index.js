const Discord = require('discord.js')
const client = new Discord.Client()
const config = require('./config.json')

client.on('ready', () => {
    console.log('Bot active')
    client.user.setActivity("users that type s!", {
        type: "LISTENING",
    })
})

client.login(config.token);