'use strict'

const logger = require('../util/logger')

// list of all the commands

const commands = {
    '.inactive': require('./inactive'),
    '.last': require('./last'),
    '.lastplayed': require('./last'),
    '.lastplay': require('./last'),
    '.missing': require('./missing')
}

async function messageHandler(msg) {

    // check if the first word is a command
    const cmd = msg.content.replace(/ .*/,'')
    if(commands[cmd]) {
        logger.info('found command [%s] from [%s] in [%s]', cmd, msg.author.username, msg.content)
        // issue the command
        await commands[cmd](msg)
    }

}

module.exports = { messageHandler }