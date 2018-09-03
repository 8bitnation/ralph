'use strict'

const logger = require('../util/logger')
const { getGroup, getMembersOfGroup } = require('../util/bungie')
const discord = require('../util/discord')
const chunk = require('../util/chunk')

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

                // try and find each clanie
                const discordMembers = await discord.getMembers()

                // split the users into arrays of 20 max

                // make a message of the users
                const userNames = clanies.map( (c) => { 
                    const name = c.destinyUserInfo.displayName
                    const member = discordMembers.find( (m) => m.displayName === name)
                    const NAME_LEN = 25
                    if(member) {
                        return name.padEnd(NAME_LEN, ' ') + ' ' + (member.lastMessage ? member.lastMessage.createdAt : 'No messages')
                    } else {
                        return name.padEnd(NAME_LEN, ' ') + ' Not found'
                    }
                })

                const MAX_NAMES = 20
                for(let u of chunk(userNames, MAX_NAMES)) {
                    const reply = u.join('\n')
                    await msg.channel.send('```\n' + reply + '```')
                }
            }
        } 
    } catch(err) {
        logger.error(err)
        throw err
    } finally {
        msg.channel.stopTyping()
    }

}