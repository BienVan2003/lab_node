const {check} = require('express-validator')

module.exports = [
    check('email')
    .exists().withMessage('Please provide email address')
    .notEmpty().withMessage('Email address cannot be empty')
    .isEmail().withMessage('Invalid email address'),

    check('password')
    .exists().withMessage('Please provide password')
    .notEmpty().withMessage('Password cannot be empty')
    .isLength({min: 6}).withMessage('Please must be at least 6 characters')
]