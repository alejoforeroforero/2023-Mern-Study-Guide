# 2023-Mern-User-Auth

# 1-Instalar librerias

    npm init 

    npm install --save express body-parser

    npm install --save-dev nodemon

    "start":"nodemon app.js"

    npm install --save express-validator

    npm install --save bcryptjs

    npm install jsonwebtoken 

# 2-Hacer un post y revisar en Postman

    const express = require('express'); 
    const bodyParser = require('body-parser');

    const app = express();

    app.use(bodyParser.json()); //Clave que vaya antes de las rutas. Con esto se puede usar json

    app.post('/api/users/signup', (req, res, next)=>{
        res.json(req.body);
    })

    app.listen(4200);

# 3-Agregar validaciones

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

# 4-Encriptar el password

# 5-Agregar Post del login

# 6-Crear sesión de usuario con un token
