const express =  require('express')
const bodyParser = require('body-parser')
const multer = require('multer')
const emailValidator = require('email-validator')
const fs = require('fs')
const uuid = require('short-uuid')
const app = express()

let products = new Map()
let text = fs.readFileSync(__dirname + '/products.json').toString()
let productList = JSON.parse(text)
productList.forEach(p => {
    products.set(p.id, p)
})

const upload = multer({dest: 'uploads', 
fileFilter: (req, file, callback) => {
    if(file.mimetype.startsWith('image/')){
        callback(null, true) // cho phep upload
    }
    else callback(null, false)// ko cho phep
}, limits: {fieldSize: 500000}}) // 500kb max
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: false}))

app.get('/', (req, res) => {
    res.render('index', {products: Array.from(products.values())})
})

app.get('/add', (req, res) => {
    res.render('add', {name: '', price: '', desc: '', error: ''})
})

app.post('/add', (req, res) => {

    let uploader = upload.single('image')
    uploader(req, res, err => {
        let {name, price, desc} = req.body
        let image = req.file
    
        let error = undefined

        if(!name || name.trim().length === 0){
            error = 'Name invalid'
        }
        else if(!price || isNaN(price) || parseInt(price) < 1){
            error = 'Price invalid'
        }
        else if(!desc || desc.trim().length === 0){
            error = 'Please enter description for the product'
        }
        else if(err){
            error = 'Image size is too big'
        }
        else if(!image){
            res.end('No image or invalid image')
        }
        
        if(error === undefined){
            const imagePath = 'uploads/' + image.originalname
            fs.renameSync(image.path, imagePath)

            let product = {
                id: uuid.generate(),
                name: name,
                price: price,
                desc: desc,
                image: imagePath
            }

            products.set(product.id, product)
            
            let productList = Array.from(products.values())
            fs.writeFileSync(__dirname + '/products.json', JSON.stringify(productList))

            res.redirect('/')
        }
        else{
            res.render('add', {name, price, desc, error})
        }
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
        res.render('login', {
            errorMessage: error,
            email: acc.email,
            password: acc.password
        })
    }else{
        res.set('Content-Type', 'text/html')
        res.redirect('/')
    }
})

app.post('/delete', (req, res) => {    
    let {id} = req.body
    if (!id || id.length === 0) {
        return res.json({code: 1, message: 'Invalid id'})
    }
    if (!products.has(id)) {
        return res.json({code: 2, message: 'Product not found'})
    }

    products.delete(id)
    return res.json({code: 0, message: 'Delete success'})
})

app.use((req, res) => {
    res.set('Content-Type', 'text/html')
    res.end('This link is not supported')
})
app.listen(8080, () => console.log('http://localhost:8080'))