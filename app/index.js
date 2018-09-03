'use strict'

require('dotenv').config()
const logger = require('./util/logger')
const Discord = require('discord.js')
const client = new Discord.Client()
const commands = require('./commands')

// die on any unhandled promise rejections
process.on('unhandledRejection', (reason) => { 
    throw reason 
})


client.on('message', commands.messageHandler)

client.on('ready', () => {
    logger.info(`Logged in as ${client.user.tag}`)
    if(!process.env.DISCORD_GUILD) {
        // if no guild is specified, get the first one
        const g = client.guilds.first()
        if(!g) throw new Error('Unable to determine guild!')
        process.env.DISCORD_GUILD = g.id
    }

    const guild = client.guilds.get(process.env.DISCORD_GUILD)
    if(!guild) {
        throw new Error(`unable to find guild ID ${process.env.DISCORD_GUILD}`)
    }

    logger.info('managing guild: %s', guild.name)



})

if(process.env.DISCORD_TOKEN) {
    client.login(process.env.DISCORD_TOKEN)
} else {
    throw new Error('No DISCORD_TOKEN defined')
}
    








