const http = require('http')
const URL = require('url')
const queryString = require('querystring')

const server = http.createServer((req, res) => {
    const url = URL.parse(req.url)

    res.writeHead (200, {
    'Content-Type': 'text/html; charset=utf-8'
    })

    if(url.pathname === '/'){
        return res.end(`
        <!DOCTYPE html>
        <html lang="en">
        
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Basic calculator</title>
        </head>
        
        <body>
            <form action="/result" method="get">
                <table>
                    <tr>
                        <td>Input 1</td>
                        <td><input type="text" name="a" placeholder="Number 1"></td>
                    </tr>
                    <tr>
                        <td>Input 2</td>
                        <td><input type="text" name="b" placeholder="Number 2"></td>
                    </tr>
                    <tr>
                        <td>Calculator</td>
                        <td>
                            <select name="op" id="">
                                <option value="">Select calculation</option>
                                <option value="+">Add</option>
                                <option value="-">Sub</option>
                                <option value="*">Multi</option>
                                <option value="/">Divide</option>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <td></td>
                        <td><button type="submit">Compute</button></td>
                    </tr>
                </table>
            </form>
        </body>
        
        </html>
        `);
    }
    if(url.pathname === '/result'){
        let query = queryString.decode(url.query)
        
        if(!query.a){
            return res.end('Missing parameter a')
        }
        if(!query.b){
            return res.end('Missing parameter b')
        }
        if(!query.op){
            return res.end('Missing parameter op')
        }

        let ops = ['+','-','*','/']

        if(!ops.includes(query.op)){
            return res.end('Calculation invalid')
        }      

        let a = parseInt(query.a)
        let b = parseInt(query.b)
        let kq = a + b;

        if(query.op === '-'){
            kq = a - b;
        }else if(query.op === '*'){
            kq = a * b;
        }else if(query.op === '/'){
            kq = a / b;
        }

        return res.end(`Result: ${a} ${query.op} ${b} = ${kq}`)
    }

    res.end('The page is not supported')

    // console.log(url)
})

server.listen(3000, () => {
    console.log('Server is running at http://localhost:3000')
})