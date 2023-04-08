const express = require('express');
const bodyParser = require('body-parser');
const { check } = require('express-validator');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

const app = express();
app.use(bodyParser.json());

app.post('/', [
    check('nombre').not().isEmpty(),
    check('email').normalizeEmail().isEmail(),
    check('password').isLength({min:6})
], async(req, res, next)=>{
    const errors = validationResult(req); 
    if(!errors.isEmpty()){
        res.send('hay errores o campos vacios');
    }

    const { nombre, email, password } = req.body;

    let hashedPassword;
    try{
        hashedPassword = await bcrypt.hash(password, 12);
    }catch(e){
        res.send('No se pudo hashear el password');
    }

    const userInfo={
        nombre,
        email,
        password:hashedPassword
    }

    res.json({ datos: userInfo });
})

app.listen(4000);