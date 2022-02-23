const Discord = require('discord.js')
const { Permissions } = require('discord.js');
const client = new Discord.Client()
const config = require('./config.json')
var fs = require('fs');
const { channel } = require('diagnostics_channel');
var sec = 0
var isProcedureStarted = false
var inProcedureUserID = ""
var newTextFileName = "" //ALWAYS WITHOUT TXT

function timer(){
    var timer = setInterval(function(){
        sec--;
        if (sec < 0) {
            clearInterval(timer);
        }
    }, 1000);
}

function startCooldown(){
    sec = config.commandCooldown
    timer()
}

function startTimer(sec){
    timer()
}

function typeFromTXT(txtFile, upperCase)
{
    var upperCaseBool = false
    if (upperCase == "true") upperCaseBool = true
    var MSGArray = fs.readFileSync('./txtFiles/' + txtFile + ".txt").toString().split("\n")
    var MSG = ""
    i = 0
    while (i < MSGArray.length)
    {
        if (i == MSGArray.length - 1) MSG = MSG + MSGArray[i]
        else MSG = MSG + MSGArray[i] + "\n"
        i++
    }
    if (upperCaseBool) MSG = MSG.toUpperCase()
    startCooldown()
    return MSG;
}

function typeFromArray(array)
{
    var MSG = ""
    i = 0
    while (i < array.length)
    {
        if (i == array.length - 1) MSG = MSG + array[i]
        else MSG = MSG + array[i] + "\n"
        i++
    }
    return MSG;
}

function idCheck(userID)
{
    var allowedIDs = config.allowedIDs
    var isAllowed = false
    i = 0
    while(i < allowedIDs.length)
    {
        if (userID == allowedIDs[i]) isAllowed = true
        i++
    }
    return isAllowed
}

client.on('ready', () => {
    client.user.setActivity("users that type s!", {
        type: "LISTENING",
    })
    console.log('Bot started, sexo gaming')
})

client.on('message', message => {

    if (message.author.bot) return; //THIS PREVENTS CODE FROM RUNNING IF AUTHOR IS BOT
    /*
        AUTOCODE: THIS CODE ISNT COMMAND BASED, IT RUNS AUTOMATICALLY
    */

    // AUTO REMOVE TRACING FROM TWEET
    if(message.content.startsWith("https://twitter.com/") && message.content.toString().includes("/status/") && message.content.toString().includes("?"))
    {
        var newMsg = message.content.toString()
        newMsg = newMsg.slice(0, newMsg.lastIndexOf('?'))
        message.delete()
        message.channel.send(newMsg)
        message.channel.send(`Tweet sent by ${message.author}`)
    }

    // TYPE INSIDE FILE TO SAVE AS .TXT
    if (isProcedureStarted && message.author.id.toString() == inProcedureUserID)
    {
        if (!message.content.toString() == "s!stoptxt") {
            fs.writeFile()
        }
    }

    /* 
        COMMANDS: THIS CODE IS COMMAND BASED, IT DOES NOT RUN AUTOMATICALLY
    */

    if (!message.content.startsWith(config.prefix) || message.guild === null ) return //IGNORES NON COMMAND MESSAGES AND BLOCKS DMS

    const args = message.content.slice(config.prefix.length).trim().split(/ +/) //GATHERS WHOLE MESSAGE
    const command = args.shift().toLowerCase() 
    message.delete()//DELETES USER COMMAND

    /*
        NON ARGUMENT COMMANDS
    */
    switch(command)
    {
        case "help":
            message.channel.send("Sending in DMs :cat:")
            message.author.send("=== LIST OF COMMANDS ===")
            message.author.send(typeFromTXT("helpMSG", false))
            break;
        case "txtlist":
            var fileNames = fs.readdirSync("./txtFiles")
            message.author.send("List of TXT files:")
            message.author.send(typeFromArray(fileNames))
            break;
        case "filelist":
            var fileNames = fs.readdirSync("./resources")
            message.author.send("List of Embed files:")
            message.author.send(typeFromArray(fileNames))
            break;
        case "stoptxt":
            var userID = message.author.id.toString()
            if (!idCheck(userID)) return
            if (!isProcedureStarted) return message.channel.send("There is no 'createText' procedure enabled.")
            if (message.author.id.toString() != inProcedureUserID) return message.channel.send("You can't stop someone else's procedure.")
            isProcedureStarted = false
            inProcedureUserID = "unused"
            fs.closeSync(0)
            newTextFileName = "none"
            break;
    }

    if (args.length < 1) return //PREVENTS ARGUMENT COMMANDS FROM RUNNING

    /*
        ARGUMENT COMMANDS
    */
    
    switch(command)
    {
        case "timer":
            var userID = message.author.id.toString()
            if (!idCheck(userID)) return
            if (args.length > 1) return
            var newTime = parseInt(args[0], 10)
            sec = newTime
            break;
        case "say":
            var userID = message.author.id.toString()
            if (!idCheck(userID)) return
            var string = ""
            i = 0
            while (i < args.length)
            {
                if (i == args.length - 1) string = string + args[i]
                else string = string + args[i] + " "
                i++
            }
            message.channel.send(string)
            break;
        case "filesay":
            var userID = message.author.id.toString()
            if (!idCheck(userID)) if (sec > 0) return message.channel.send("Command in cool down, remaining seconds: " + sec)
            if(args.length > 2) return
            if(args[0] == "helpMSG") return
            message.channel.send(typeFromTXT(args[0], args[1]))
            message.channel.send(`Requested by ${message.author}`)
            break;
        case "postfile":
            var userID = message.author.id.toString()
            if (!idCheck(userID)) if (sec > 0) return message.channel.send("Command in cool down, remaining seconds: " + sec)
            if(args.length > 1) return;
            message.channel.send("", { files: ["./resources/" + args[0]]})
            message.channel.send(`Requested by ${message.author}`)
            break;
        case "nick":
            var userID = message.author.id.toString()
            if (!idCheck(userID)) return
            if (args.length < 2) return
            let usr = message.mentions.members.first()
            if(!usr.bannable) return
            i = 1
            var newNick = ""
            while (i < args.length)
            {
                newNick = newNick + args[i] + " "
                i++
            }
            usr.setNickname(newNick)
            break;
        case "newtxt":
            if(isProcedureStarted) return message.channel.send("Someone else is using this functionality, wait for them to finish.")
            var userID = message.author.id.toString()
            if (!idCheck(userID)) return
            if (args.length != 1) return
            isProcedureStarted = true
            inProcedureUserID = message.author.id.toString()
            newTextFileName = args[0]
            if (newTextFileName.includes(".txt")) newTextFileName = newTextFileName.substring(0, str.length - 4)
            fs.createWriteStream('./txtFiles/' + newTextFileName + '.txt')
            break;
    }
    /*
        SEARCH COMMANDS COMMANDS
    */
    
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
    if (command === "youtube" || command === "yt")
    {
        string = "<https://www.youtube.com/results?search_query="
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
})

client.login(config.token);