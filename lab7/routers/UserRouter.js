const express = require('express')
const {check, validationResult} = require('express-validator')
const db = require('../db')
const bcrypt = require('bcrypt')
const fs = require('fs')
const path = require('path');

const loginValidator = [
    check('email').exists().withMessage('Please enter email')
    .notEmpty().withMessage('Email cannot be left blank')
    .isEmail().withMessage('This is not a valid email'),

    check('password').exists().withMessage('Please enter password')
    .notEmpty().withMessage('Password cannot be left blank')
    .isLength({min: 6}).withMessage('Password must be at least 6 characters')


]

const registerValidator = [
    check('name').exists().withMessage('Please enter username')
    .notEmpty().withMessage('username cannot be left blank')
    .isLength({min: 6}).withMessage('Username must be at least 6 characters'),

    check('email').exists().withMessage('Please enter email')
    .notEmpty().withMessage('Email cannot be left blank')
    .isEmail().withMessage('This is not a valid email'),

    check('password').exists().withMessage('Please enter password')
    .notEmpty().withMessage('Password cannot be left blank')
    .isLength({min: 6}).withMessage('Password must be at least 6 characters'),

    check('rePassword').exists().withMessage('Please enter re-password')
    .notEmpty().withMessage('Re-password cannot be left blank')
    .custom((value, {req}) => {
        if(value !== req.body.password){
            throw new  Error('re-entered password does not match')
        }
        return true;
    })

]

const Router = express.Router()

Router.get('/login', (req, res) => {
    if(req.session.user){
        return res.redirect('/')
    }
    const error = req.flash('error') || ''
    const email = req.flash('email') || ''
    const password = req.flash('password') || ''

    res.render('login', {error, email, password})
})

Router.post('/login', loginValidator, (req, res) => {
    let result = validationResult(req)
    if(result.errors.length === 0){
        const {email, password} = req.body

        const sql = 'SELECT * FROM account WHERE email = ?'
        const params = [email]

        db.query(sql, params, (err, results, fields) => {
            if(err){
                req.flash('error', err.message)
                req.flash('password', password)
                req.flash('email', email)
                return res.redirect('/user/login')
            }
            else if(results.length === 0){
                req.flash('error', 'Email ko ton tai')
                req.flash('password', password)
                req.flash('email', email)
                return res.redirect('/user/login')
            }
            else{
                const hashed = results[0].password
                const match = bcrypt.compareSync(password, hashed)

                if(!match){
                    req.flash('error', 'Mat khau khong chinh xac')
                    req.flash('password', password)
                    req.flash('email', email)
                    return res.redirect('/user/login')
                }
                else{
                    // login success
                    let user = results[0]
                    user.userRoot = path.join(`${req.vars.root}/users/${user.email}`)
                    req.session.user = user
                    
                    // đăng ký phục vụ thư mực gốc của user
                    req.app.use(express.static(user.userRoot))

                    return res.redirect('/')
                }
                
            }
        })
    }
    else{
        result = result.mapped()

        let message;
        for(fields in result ){
            message = result[fields].msg
            break;
        }
    
        const {email, password} = req.body
    
        req.flash('error', message)
        req.flash('email', email)
        req.flash('password', password)
    
        res.redirect('/user/login')
    }
})

Router.get('/register', (req, res) => {
    const error = req.flash('error') || ''
    const name = req.flash('name') || ''
    const email = req.flash('email') || ''

    res.render('register', {error, name, email})
})

Router.post('/register', registerValidator, (req, res) => {
    let result = validationResult(req)

    if(result.errors.length === 0){
        const {name, email, password} = req.body

        const hased = bcrypt.hashSync(password, 10)
        const sql = 'insert into account(name, email, password) values(?,?,?)'
        const params = [name, email, hased]

        db.query(sql, params, (err, result, fields) => {
            if(err){
                req.flash('error', err.message)
                req.flash('name', name)
                req.flash('email', email)
                return res.redirect('/user/register')
            }
            else if(result.affectedRows === 1)
            {
                // console.log(name, email, password)
                // sign up success
                const {root} = req.vars
                const userDir = `${root}/users/${email}`

                fs.mkdir(userDir, () => {
                    return res.redirect('/user/login')
                })
            }
            else{
                req.flash('error', 'Đăng ký thất bại')
                req.flash('name', name)
                req.flash('email', email)
            
                return res.redirect('/user/register')
            }
        })
    }
    else{
        result = result.mapped()

        let message;
        for(fields in result ){
            message = result[fields].msg
            break;
        }
    
        const {name, email, password} = req.body
    
        req.flash('error', message)
        req.flash('name', name)
        req.flash('email', email)
    
        res.redirect('/user/register')
    }

   
})

Router.get('/logout', (req, res) => {
    // req.session.user = null
    req.session.destroy()
    res.redirect('/user/login')
})


module.exports = Router

