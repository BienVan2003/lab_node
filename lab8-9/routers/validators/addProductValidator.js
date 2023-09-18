const {check} = require('express-validator')

module.exports = [
    check('name')
    .exists().withMessage('Please provide product name')
    .notEmpty().withMessage('Product name cannot be empty'),

    check('price')
    .exists().withMessage('Please provide product price')
    .notEmpty().withMessage('Product price cannot be empty')
    .isNumeric().withMessage('Price must be a number type'),

    check('desc')
    .exists().withMessage('Please provide product description')
    .notEmpty().withMessage('Product description cannot be empty')
    
]