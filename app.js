const express = require('express');
const bodyParser = require('body-parser');
const { check } = require('express-validator');
const { validationResult } = require('express-validator');

const app = express();
app.use(bodyParser.json());

app.post('/', [
    check('nombre').not().isEmpty(),
    check('email').normalizeEmail().isEmail(),
    check('password').isLength({min:6})
],(req, res, next)=>{
    const errors = validationResult(req); 

    if(!errors.isEmpty()){
        res.send('hay errores o campos vacios');
    }
    res.json({ datos: req.body });
})

app.listen(4000);