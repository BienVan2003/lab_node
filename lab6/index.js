require('dotenv').config()
const express = require('express')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const flash = require('express-flash')
const bodyParser = require('body-parser')

const UserRouter = require('./routers/UserRouter')

const app = express()
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: false}))
app.use(cookieParser('mvm'));
app.use(session({ cookie: { maxAge: 60000 }}));
app.use(flash());

app.use('/user', UserRouter)

app.get('/', (req, res) => {
    if(!req.session.user){
        return res.redirect('/user/login')
    }
    const user = req.session.user
    res.render('index', {user})
})



const port = process.env.PORT || 8080
app.listen(port, () => console.log(`http://localhost:${port}`))