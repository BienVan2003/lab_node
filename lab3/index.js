const express =  require('express')
const bodyParser = require('body-parser')
const multer = require('multer')
const emailValidator = require('email-validator')
const app = express()

const upload = multer({dest: 'uploads', 
fileFilter: (req, file, callback) => {
    if(file.mimetype.startsWith('image/')){
        callback(null, true) // cho phep upload
    }
    else callback(null, false)// ko cho phep
}, limits: {fieldSize: 5000}}) // 5kb max
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: false}))

app.get('/', (req, res) => {
    res.render('index')
})

app.get('/add', (req, res) => {
    res.render('add')
})

app.post('/add', (req, res) => {

    let uploader = upload.single('image')
    uploader(req, res, err => {
        let product = req.body
        let image = req.file
    
        if(err){
            res.end('Image too large')
        }
        else if(!image){
            res.end('No image or invalid image')
        }
        else res.end('Handle product')
    })
})

app.get('/login', (req, res) => {
    res.render('login',{email: '', password: ''})
})

app.post('/login', (req, res) => {
    let acc = req.body
    let error = ''
    if (!acc.email) {
        error = ('Vui lòng nhập email');
    }
    else if (!emailValidator.validate(acc.email)) { 
        error = ('Wrong email format');
    }
    else if (!acc.password) { 
        error = ('Vui lòng nhập mật khẩu');
    }
    else if (acc.password.length < 6) { 
        error = ('Mật khẩu phải có từ 6 ký tự'); 
    }
    else if(acc.email !== 'admin@gmail.com' || acc.password !== '123456'){
        error = 'Wrong pass or email'
    }

    if(error.length > 0){
        res.render('login', {errorMessage: error,
        email: acc.email,
        password: acc.password})
    }else{
        res.end('Success login')
    }
})

app.use((req, res) => {
    res.set('Content-Type', 'text/html')
    res.end('This link is not supported')
})
app.listen(8080, () => console.log('http://localhost:8080'))