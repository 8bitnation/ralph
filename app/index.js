'use strict'

require('dotenv').config()
const discord = require('./util/discord')
const commands = require('./commands')

// die on any unhandled promise rejections
process.on('unhandledRejection', (reason) => { 
    throw reason 
})

if(process.env.DISCORD_TOKEN) {
    discord.client.on('message', commands.messageHandler)
    discord.login(process.env.DISCORD_TOKEN)
} else {
    throw new Error('No DISCORD_TOKEN defined')
}
    








