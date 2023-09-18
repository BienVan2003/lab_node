require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors') // cross origin resources sharing

const ProductRouter = require('./routers/ProductRouter')
const OrderRouter = require('./routers/OrderRouter')
const AccountRouter = require('./routers/AccountRouter')


const app = express()
app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.use(cors())

app.get('/', (req, res) => {
    res.json({
        code: 0,
        message: 'Welcome to my REST API'
    })
})

app.use('/products', ProductRouter)
app.use('/orders', OrderRouter)
app.use('/account', AccountRouter)



const port = process.env.PORT || 8080

mongoose.connect('mongodb://localhost:27017/lab08', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    // chỉ start server sau khi đã connect đến db
    app.listen(port, () => {
        console.log('http://locolhost:' + port)
    })
})
.catch(e => console.log('Không thể kết nối tới db server: ' + e.message))
