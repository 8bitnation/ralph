'use strict'

const logger = require('../util/logger')
const bungie = require('../util/bungie')
const chunk = require('../util/chunk')


module.exports = async function(msg) {

    logger.debug('lastplayed: %s', msg.content)

    // check each clan
    const clans = process.env.CLANS.split(',')

    msg.channel.startTyping()

    try {

        for (let clan of clans) {
            // we are not in a rush, just process sync
            /* eslint-disable no-await-in-loop, no-loop-func */
    
            const group = await bungie.getGroup(clan)
    
            if(group) {
                msg.channel.send(`getting clanies for ${group.detail.name}`)
                const clanies = await bungie.getMembersOfGroup(clan)
                msg.channel.send(`found ${clanies.length} clanies`)

                const users = []

                // another loop
                for(let user of clanies) {
                    const profile = await bungie.getProfile(user.destinyUserInfo)
                    // save the last 
                    users.push({ name: user.destinyUserInfo.displayName, last: profile.dateLastPlayed })
                }

                // sort the users
                users.sort( (a, b) => a.last.localeCompare(b.last) )

                // split the users into arrays of 20 max
                const MAX_NAMES = 20
                const NAME_LEN = 20 // it's actually 16 for PSN and 15 for XBL
                for(let u of chunk(users, MAX_NAMES)) {
                    const reply = u.map( (m) => m.name.padEnd(NAME_LEN, ' ') +  m.last).join('\n')
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