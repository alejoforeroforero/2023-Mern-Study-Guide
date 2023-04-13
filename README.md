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

    app.listen(4000);

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

# 6-Crear sesión de usuario con un token

- Código React:

        import { useState, useEffect } from "react";

        function App() {
          const [estaLogeado, setLogeado] = useState(false);

          useEffect(() => {
            const storedData = JSON.parse(localStorage.getItem("userData"));

            if (storedData && storedData.token) {
              setLogeado(true);
            }
          }, []);

          const login = async (event) => {
            event.preventDefault();

            try {
              const urlLogin = `http://localhost:4000/`;
              const response = await fetch(urlLogin, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  nombre: "Alejo",
                  email: "alejoforero@gmail.com",
                  password: "12345678",
                }),
              });
              const responseData = await response.json();

              if (responseData.datos.token) {
                localStorage.setItem(
                  "userData",
                  JSON.stringify({
                    userId: responseData.datos.nombre,
                    token: responseData.datos.token,
                  })
                );
                setLogeado(true);
              } else {
                alert("Credenciales inválidas");
              }
            } catch (e) {}
          };

          function salir() {
            localStorage.removeItem("userData");
            setLogeado(false);
          }

          return (
            <div className="App">
              {estaLogeado && <button onClick={salir}>Logout</button>}
              {!estaLogeado && (
                <form onSubmit={login}>
                  <button type="submit">Entrar</button>
                </form>
              )}
            </div>
          );
        }

        export default App;
        
 - Código Nodejs:
 
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


