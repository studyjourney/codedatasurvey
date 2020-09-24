const fs = require('fs')
const { default: axios } = require('axios')

const graphqlQuery = fs.readFileSync(`${__dirname}/queryAll.graphql`, 'utf8')

const getStudentData = async token => {
    const response = await axios.post(
        'https://api.app.code.berlin/graphql',
        { query: graphqlQuery },
        { headers: { Authorization: token } }
    )
    return response.data.data
}

module.exports = {
    getStudentData
}
