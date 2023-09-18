require('dotenv').config()
const express = require('express')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const fs = require('fs')
const flash = require('express-flash')
const bodyParser = require('body-parser')
const UserRouter = require('./routers/UserRouter')
const Path = require('path');
const FileReader = require('./fileReader')
const multer = require('multer')

const app = express()
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: false}))
app.use(cookieParser('mvm'));
app.use(session({ cookie: { maxAge: 600000 }}));
app.use(flash());

const uploader = multer({dest: __dirname + '/uploads/'})

app.use((req, res, next) => {
    req.vars = {root: __dirname} // __dirname is the current directory
    next() //important
})

app.use('/user', UserRouter)

const getCurrentDir = (req, res, next) => {
    if(!req.session.user){
        // chua dang nhap
        return next();
    }

    let {userRoot} = req.session.user // lấy thuộc tính userRoot từ user
    let {dir} = req.query // tham số dir trên thanh địa chỉ, /?dir=???
    if(dir === undefined){
        dir = ''
    }

    let currentDir = `${userRoot}/${dir}`
    currentDir = Path.join(currentDir)
    if(!fs.existsSync(currentDir)){
        // sai path
        currentDir = userRoot
    }

    // luu ket qua vao req.vars
    req.vars.currentDir = currentDir
    req.vars.userRoot = userRoot
    next(); // gọi next cuối cùng rất quan trọng
}

// đưa middle ware vào sử dụng
app.get('/', getCurrentDir, (req, res) => {
    if(!req.session.user){
        return res.redirect('/user/login')
    }

    let {userRoot, currentDir} = req.vars // đọc thư mực hiện tại cần nạp
    console.log('Cần nạp thư mục: ' + currentDir) 

    FileReader.load(userRoot, currentDir)
    .then(files => {
        const user = req.session.user
        res.render('index', {user, files})
    })

})

app.post('/upload', uploader.single('attachment'), (req, res) => {

    const {email, path} = req.body
    const file = req.file

    if(!email || !path || !file ){
        return res.json({code: 1, message: 'Thông tin không hợp lệ'})
    }

    const {root} = req.vars
    const currentPath = `${root}/users/${email}/${path}`
    // currentPath = Path.join(currentPath)
    console.log(Path.join(currentPath))

    if(!fs.existsSync(Path.join(currentPath))){
        return res.json({code: 2, message: 'Đường dẫn cần lưu không tồn tại'})
    }

    let name = file.originalname
    let newPath = Path.join(currentPath + '/' + name)

    fs.renameSync(file.path, newPath)


    return res.json({code: 0, message: 'Upload thành công, đã lưu tại: ' + newPath})

})

const port = process.env.PORT || 8080
app.listen(port, () => console.log(`http://localhost:${port}`))