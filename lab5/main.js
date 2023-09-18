
const http = require('http')

const options = {
    hostname: 'localhost',
    path: '/lab5/users',
    port: 8888,
    method: 'GET'
}

const request = http.request(options, response => {
    let body = ''
    response.on('data', d => body += d.toString())
    response.on('end', () => {
        console.log(JSON.parse(body))
    })
    response.on('error', e => console.log(e))
})

request.on('error', e => console.log(e))
request.end()