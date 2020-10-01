/*


This Module allowes a structured
and nice looking Console log
With Colors and Prefix


*/
const colors = require('colors');

//Console Logging
var con = {};
con.err = colors.red('[ERROR]') + " - ";
con.warn = colors.yellow('[WARNING') + " - ";
con.info = colors.cyan('[INFO]') + " - ";
con.suc = colors.green('[SUCCESS]') + " - ";
con.wlc = colors.rainbow('Welcome to ' + process.env.npm_package_version + '!');
con.con = function (name) {
    return colors.yellow('[' + name + ']') + " - ";
}


module.exports = con