const express = require('express');
const bodyParser = require('body-parser');
const { check } = require('express-validator');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(bodyParser.json());
app.use((req, res, next)=>{
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE')
    next();
})

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

    

    let token;

    try{
        token = jwt.sign(
            { userId: nombre, email: email }, 
            'supersecret_dont_share', 
            { expiresIn:'1h' }
        );

    }catch(e){
        return next(e);
    } 

    const userInfo={
        nombre,
        email,
        password:hashedPassword,
        token
    }

    res.json({ datos: userInfo });
})

app.listen(4000);