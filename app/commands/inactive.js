'use strict'

const logger = require('../util/logger')
const { getGroup, getMembersOfGroup } = require('../util/bungie')

module.exports = async function(msg) {


    logger.debug('inactive: %s', msg.content)

    // check each clan
    const clans = process.env.CLANS.split(',')

    msg.channel.startTyping()

    try {

        for (let clan of clans) {
            // we are not in a rush, just process sync
            /* eslint-disable no-await-in-loop */
    
            const group = await getGroup(clan)
    
            if(group) {
                msg.channel.send(`getting clanies for ${group.detail.name}`)
                const clanies = await getMembersOfGroup(clan)
                msg.channel.send(`found ${clanies.length} clanies`)
            }
        } 
    } catch(err) {
        logger.error(err)
        throw err
    } finally {
        msg.channel.stopTyping()
    }

}