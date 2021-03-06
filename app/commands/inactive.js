'use strict'

const logger = require('../util/logger')
const { getGroup, getMembersOfGroup } = require('../util/bungie')
const discord = require('../util/discord')
const chunk = require('../util/chunk')
const moment = require('moment')

module.exports = async function(msg) {

    logger.debug('inactive: %s', msg.content)

    // check each clan
    const clans = process.env.CLANS.split(',')

    msg.channel.startTyping()

    try {

        for (let clan of clans) {
            // we are not in a rush, just process sync
            /* eslint-disable no-await-in-loop, no-loop-func */
    
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
                    let member
                    if(name) {
                        const lname = name.toLowerCase()
                        const clname = lname.replace(' ', '')
                        member = discordMembers.find( (m) => 
                            // try and match without case and with spaces removed from the gamertag
                            m.displayName.toLowerCase() === lname || m.displayName.toLowerCase().replace(' ', '') === clname
                        )
                    } else {
                        // really, no name?
                        logger.error('could not find name in: %j', c)
                    }
                    const res = { name, idle: Number.MAX_SAFE_INTEGER }

                    if(member && member.lastMessage) {
                        res.nick = member.displayName
                        res.last = member.lastMessage.createdAt
                        res.idle = Date.now() - member.lastMessage.createdTimestamp
                    } else if(member) { 
                        res.nick = member.displayName
                    }
                    return res
                }).sort( (a, b) => b.idle - a.idle )

                const MAX_NAMES = 20
                const NAME_LEN = 20 // it's actually 16 for PSN and 15 for XBL
                for(let u of chunk(userNames, MAX_NAMES)) {
                    const reply = u.map( (m) => {
                        let postfix = 'No discord user found'
                        if(m.last) {
                            postfix = moment.duration(-m.idle).humanize() 
                        } else if(m.nick) {
                            postfix = 'No messages found'
                        }
                        return m.name.padEnd(NAME_LEN, ' ') + ' ' + postfix
                    }).join('\n')
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