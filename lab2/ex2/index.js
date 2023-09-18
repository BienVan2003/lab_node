const http = require('http')
const URL = require('url')
const queryString = require('querystring')
const fs = require('fs')
const path = require('path')

const server = http.createServer((req, res) => {

    res.writeHead (200, {
    'Content-Type': 'text/html; charset=utf-8'
    })

    let url = URL.parse(req.url)

    if(url.pathname === '/'){
        let html = fs.readFileSync(path.join(__dirname, 'views/login.html'))
        return res.end(html)
    }
    if(url.pathname === '/login'){
        return handleLogin(req, res)
    }

    let html = fs.readFileSync(path.join(__dirname, 'views/fail.html')).toString();
    html = html.replace('xxxxxxxxxxx', `Invalid path`)
    return res.end(html)
})

function handleLogin(req, res){
    let html = fs.readFileSync(path.join(__dirname, 'views/fail.html')).toString();
    if(req.method !== 'POST'){
        html = html.replace('xxxxxxxxxxx', `This ${req.method} method is not supported`)
        return res.end(html)
    }

    let body = ''

    /* so the body data of http port send up stream
    so we don't have it right away but have to read
    it step by step */
    req.on('data', d => body += d.toString());
    req.on('end', () => {
        console.log('received enough body');
        let input = queryString.decode(body);
        if(!input.email){
            return res.end(html.replace('xxxxxxxxxxx', `Missing email information`))
        }
        if(!input.pass){
            return res.end(html.replace('xxxxxxxxxxx', `Missing password information`))
        }
        if(!input.email.includes("@")){
            return res.end(html.replace('xxxxxxxxxxx', `Email without the @ sign is wrong email`))
        }
        if(!input.pass.length < 6){
            return res.end(html.replace('xxxxxxxxxxx', `The password must be at least 6 characters`))
        }
        if(input.email !== 'admin@gmail.com' || input.pass !== '123456'){
            return res.end(html.replace('xxxxxxxxxxx', `Wrong email or password`))
        }
        let successHTML = fs.readFileSync(path.join(__dirname, 'views/success.html')).toString();
        return res.end(successHTML);
    })
}

server.listen(3000, () => {
    console.log('Server is running at http://localhost:3000')
})