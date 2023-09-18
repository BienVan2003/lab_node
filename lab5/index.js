const express =  require('express')
const bodyParser = require('body-parser')
const multer = require('multer')
const emailValidator = require('email-validator')
const fs = require('fs')
const uuid = require('short-uuid')
const app = express()
const http = require('http')
const fetch = require('node-fetch')
const querystring = require('querystring');
const cookieParser = require('cookie-parser')
const session = require('express-session')
const flash = require('express-flash')
const {check, validationResult} = require('express-validator')
const port = process.env.PORT || 8888

let users = new Map()
let text = fs.readFileSync(__dirname + '/users.json').toString()
let userList = JSON.parse(text)
userList.forEach(u => {
    users.set(u.id, u)
})


app.set('view engine', 'ejs')
app.use(cookieParser('mvm'));
app.use(session({ cookie: { maxAge: 60000 }}));
app.use(flash());
app.use(express.json())
app.use(bodyParser.urlencoded({extended: false}))

const validator = [
    check('name').exists().withMessage('Please enter name')
    .notEmpty().withMessage('Name cannot be  blank')
    .isLength({min: 3}).withMessage('Username must have least 3 characters')
    .isLength({max: 15}).withMessage('Username must have a maximum of 15 characters'),
    
    check('age').notEmpty().withMessage('Tuổi không được bỏ trống')
    .isInt().withMessage('Tuổi phải là một số nguyên')
    .isInt({ min: 18, max: 99 }).withMessage('Tuổi phải từ 18 đến 99'),

    check('gender').exists().withMessage('Please select gender'),

    check('email').notEmpty().withMessage('Email cannot be  blank')
    .isEmail().withMessage('This is not a valid email')

]
app.get('/', (req, res) => {
    const options = {
        hostname: 'localhost',
        path: '/lab5/users',
        port: port,
        method: 'GET'
    }
    
    const request = http.request(options, response => {
        let body = ''
        response.on('data', d => body += d.toString())
        response.on('end', () => {
            const users = JSON.parse(body)
            console.log(users)
            res.render('index', {users})
        })
        response.on('error', e => console.log(e))
    })
    
    request.on('error', e => console.log(e))
    request.end()
})

app.get('/add', (req, res) => {
    let error = req.flash('error')
    res.render('add', {error})
})

app.post('/add', validator, (req, res) => {

    const result = validationResult(req)


    if(result.errors.length > 0){
        req.flash('error', result.errors[0].msg)
        res.redirect('/add')
    }else{
        res.send('OK')
    }
})

app.post('/delete/:id', (req, res) =>{
    if(!req.params.id){
        return res.json({code: 1, message: 'Invalid id'})
    }
    const id = req.params.id
    fetch('http://localhost:8080/lab5/users/' + id, {
        method: 'DELETE'
    })
    .then(res => res.json())
    .then(json => {
        console.log(json)
        return res.json(json)
    })
    .catch(e => {
        console.log(e)
        return res.json({code: 2, message: e.message})
    })
})

app.put('/edit', (req, res) => {
    // data là một đối tượng
    let data = req.body;

    fetch('http://localhost:8080/lab5/users/', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(json => {
        console.log(json)
        return res.json(json)
    })
    .catch(e => {
        console.log(e)
        return res.json({code: 2, message: e.message})
    })
})


app.get('/lab5/users', (req, res) => {
    const usersObj = Array.from(users.values());
    return res.json(usersObj);
})

function getCurrentDateTime() {
    const currentDate = new Date();
    const options = { 
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      timeZoneName: 'short'
    };
    const currentDateTime = currentDate.toLocaleString('en-US', options);
  
    return currentDateTime;
  }

app.post('/lab5/users', (req, res) => {
    let user = req.body

    if(!users.has(user.email)){
        user.id = uuid.generate()
        user.created_at = getCurrentDateTime()
        user.update_at = getCurrentDateTime()
        users.set(user.id, user)
        return res.json({code: 0, message: 'Add user successfully', data: user})
    }
    return res.json({code: 1, message: 'Add user failed'})
})

app.delete('/lab5/users/:id', (req, res) => {
    const id = req.params.id
    if(users.delete(id)){
        return res.json({code: 0, message: 'Delete user successfully'})
    }
    return res.json({code: 1, message: 'Delete user failed'})
})

app.put('/lab5/users', (req, res) => {
    let user = req.body

    user.created_at = getCurrentDateTime()
    user.update_at = getCurrentDateTime()

    users.set(user.id, user)
    return res.json({code: 0, message: 'Update user successfully', data: user})
})

app.use((req, res) => {
    res.set('Content-Type', 'text/html')
    res.end('This link is not supported')
})


app.listen(port, () => console.log('http://localhost:' + port))