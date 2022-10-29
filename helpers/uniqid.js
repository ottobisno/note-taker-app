const uniqid = require('uniqid');

function createID() {
    return uniqid();
}

module.exports = createID;