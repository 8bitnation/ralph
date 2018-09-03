'use strict'
// chunk an array
const DEFAULT_CHUNK_SIZE = 20

module.exports = function(array, chunk = DEFAULT_CHUNK_SIZE) {

    let i, j
    const ret = []
    for ( i = 0, j = array.length; i < j; i += chunk) {
        ret.push(array.slice(i, i + chunk))
    }
    return ret
}