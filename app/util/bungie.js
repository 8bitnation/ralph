'use strict'

const logger = require('./logger')
const axios = require('axios')
const { HTTP_OK } = require('./const')


const baseURL = 'https://www.bungie.net/Platform'


async function getGroup(group_id) {
    logger.info('bungie: getGroup(%s)', group_id)

    const req = {
        method: 'get',
        baseURL,
        url: `/GroupV2/${group_id}/`,
        headers: {
            'X-API-Key': process.env.BUNGIE_TOKEN
        },
        validateStatus: null
    }
        
    const res = await axios(req)
    if(res.status === HTTP_OK && res.data.ErrorStatus === 'Success') {
        logger.debug('got response %s %s back from bungie', res.status, res.statusText)
        // we should really check for paging
        return res.data.Response
    }  else {
        logger.error('bungo: failed request %s %s %j', res.status, res.statusText, res.data)
        return undefined
    }


}
 
async function getMembersOfGroup(group_id) {


    logger.info('bungie: GetMembersOfGroup(%s)', group_id)

    const req = {
        method: 'get',
        baseURL,
        url: `/GroupV2/${group_id}/Members/`,
        headers: {
            'X-API-Key': process.env.BUNGIE_TOKEN
        },
        validateStatus: null
    }
        
    const res = await axios(req)
    if(res.status === HTTP_OK && res.data.ErrorStatus === 'Success') {
        logger.debug('got response %s %s back from bungie', res.status, res.statusText)
        // we should really check for paging
        return res.data.Response.results
    }  else {
        logger.error('bungo: failed request %s %s %j', res.status, res.statusText, res.data)
        return []
    }

}

module.exports = {
    getMembersOfGroup, 
    getGroup
}