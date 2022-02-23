const Discord = require('discord.js')
const client = new Discord.Client()
const config = require('./config.json')
var fs = require('fs')

client.on('ready', () => {
    console.log('Bot active')
    client.user.setActivity("users that type s!", {
        type: "LISTENING",
    })
})

client.on('message', message => {
    if (!message.content.startsWith(config.prefix) || message.author.bot) return
    //ignores everything itself says and messages without prefix
    const args = message.content.slice(config.prefix.length).trim().split(/ +/)
    const command = args.shift().toLowerCase()
    message.delete();
    if (!args.length) return message.channel.send(`You didn't provide anything for me to search, ${message.author}!`)
    if (command === "help")
    {
        var helpMSGArray = fs.readFileSync('./resources/helpMSG.txt').toString().split("\n");
        var helpMSG = ""
        i = 0
        while (i < helpMSGArray.length)
        {
            if (i == helpMSGArray.length - 1) helpMSG = helpMSG + helpMSGArray[i]
            else helpMSG = helpMSG + helpMSGArray[i] + "\n"
            i++
        }
        message.channel.send("Sending in DMs! :cat:")
        message.author.send(helpMSG)
    }
    if (command === 'fitgirl' || command === 'fit' || command === 'repack')
    {
        string = "<https://fitgirl-repacks.site/?s="
        i = 0
        while(i < args.length)
        {
            if (i == args.length - 1) string = string + args[i]
            else string = string + args[i] + '+'
            i++
        }
        string = string + '>'
        message.channel.send(`Here is your link, ${message.author}!` + "\n" + string)
    }
    if (command === '1337x')
    {
        switch(args[0])
        {
            case "catg":
                message.channel.send("Sending in DMs! :cat:")
                message.user.send("game, music, movie, tv, app, docs, anime, porn")
                break;
            case "game":
                string = "<https://1337x.to/category-search/"
                i = 1
                while(i < args.length)
                {
                    if (i == args.length - 1) string = string + args[i]
                    else string = string + args[i] + '+'
                    i++
                }
                string = string + "/Games"
                break;
            case "music":
                string = "<https://1337x.to/category-search/"
                i = 1
                while(i < args.length)
                {
                    if (i == args.length - 1) string = string + args[i]
                    else string = string + args[i] + '+'
                    i++
                }
                string = string + "/Music"
                break;
            case "movie":
                string = "<https://1337x.to/category-search/"
                i = 1
                while(i < args.length)
                {
                    if (i == args.length - 1) string = string + args[i]
                    else string = string + args[i] + '+'
                    i++
                }
                string = string + "/Movies"
                break;
            case "tv":
                string = "<https://1337x.to/category-search/"
                i = 1
                while(i < args.length)
                {
                    if (i == args.length - 1) string = string + args[i]
                    else string = string + args[i] + '+'
                    i++
                }
                string = string + "/TV"
                break;
            case "app":
                string = "<https://1337x.to/category-search/"
                i = 1
                while(i < args.length)
                {
                    if (i == args.length - 1) string = string + args[i]
                    else string = string + args[i] + '+'
                    i++
                }
                string = string + "/Apps"
                break;
            case "docs":
                string = "<https://1337x.to/category-search/"
                i = 1
                while(i < args.length)
                {
                    if (i == args.length - 1) string = string + args[i]
                    else string = string + args[i] + '+'
                    i++
                }
                string = string + "/Documentaries"
                break;
            case "anime":
                string = "<https://1337x.to/category-search/"
                i = 1
                while(i < args.length)
                {
                    if (i == args.length - 1) string = string + args[i]
                    else string = string + args[i] + '+'
                    i++
                }
                string = string + "/Anime"
                break;
            case "porn":
                string = "<https://1337x.to/category-search/"
                i = 1
                while(i < args.length)
                {
                    if (i == args.length - 1) string = string + args[i]
                    else string = string + args[i] + '+'
                    i++
                }
                string = string + "/XXX"
                break;
            default:
                string = "<https://1337x.to/search/"
                i = 0
                while(i < args.length)
                {
                    if (i == args.length - 1) string = string + args[i]
                    else string = string + args[i] + '+'
                    i++
                }
                break;
        }
        string = string + "/1/" + ">"
        if (args[0] == "porn") message.author.send("Enjoy :wink:" + "\n" + string)
        else message.channel.send(`Here is your link, ${message.author}!` + "\n" + string)
    }
    if (command === "google")
    {
        string = "<https://google.com/search?&q="
        i = 0
        while(i < args.length)
        {
            if (i == args.length - 1) string = string + args[i]
            else string = string + args[i] + '+'
            i++
        }
        string = string + ">"
        message.channel.send(`Here is your link, ${message.author}!` + "\n" + string)
    }
    if (command === "ddg" || command === "duckduckgo")
    {
        string = "<https://duckduckgo.com/?q="
        i = 0
        while(i < args.length)
        {
            if (i == args.length - 1) string = string + args[i]
            else string = string + args[i] + '+'
            i++
        }
        string = string + ">"
        message.channel.send(`Here is your link, ${message.author}!` + "\n" + string)
    }
    if (command === "sof" || command === "stackoverflow")
    {
        string = "<https://stackoverflow.com/search?q="
        i = 0
        while(i < args.length)
        {
            if (i == args.length - 1) string = string + args[i]
            else string = string + args[i] + '+'
            i++
        }
        string = string + ">"
        message.channel.send(`Here is your link, ${message.author}!` + "\n" + string)
    }
    if (command === "reddit" || command === "sub")
    {
        if (args[0].startsWith("r/"))
        {
            string = "<https://www.reddit.com/"
            string = string + args[0].toLowerCase()
            string = string + "/search/?q="
            i = 1
            while(i < args.length)
            {
                if (i == args.length - 1) string = string + args[i]
                else string = string + args[i] + '+'
                i++
            }
        } else {
            string = "<https://www.reddit.com/search/?q="
            i = 0
            while(i < args.length)
            {
               if (i == args.length - 1) string = string + args[i]
               else string = string + args[i] + '+'
               i++
            }
        }
        
        string = string + ">"
        message.channel.send(`Here is your link, ${message.author}!` + "\n" + string)
    }
    if (command === "say")
    {
        if (message.author.id != 372345796726882305) return
        string = ""
        i = 0
        while (i < args.length)
        {
            if (i == args.length - 1) string = string + args[i]
            else string = string + args[i] + " "
            i++
        }
        message.channel.send(string)
    }
    if (command === "youtube" || command === "yt")
})

client.login(config.token);