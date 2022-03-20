const debug = require('debug')('app:inicio');
// const dbDebug = require('debug')('app:db');
const express = require('express');
const config = require('config');
const Joi = require('@hapi/joi');
const morgan = require('morgan');
const app = express();
// const logger = require('./logger');

app.use(express.json()); // middleware para Evaluar que el body sea json
app.use(express.urlencoded({ extended: true })); // middleware para Evaluar que el body sea urlencoded
app.use(express.static('public')); // Middleware para hacer publico archivos estaticos (imagenes etc)

// Configuracion de entornos
console.log(`Aplicacion: ${config.get('nombre')}`);
console.log(`DB server: ${config.get('configDB.host')}`);

// Uso de middleware de tercero - Morgan
if(app.get('env') === 'development') {
    app.use(morgan('tiny'));
    debug('Morgan esta habilitado');
}

//Trabajos con la base de datos
debug('Conectando con la bd...')

const usuarios = [
    { id: 1, nombre: 'Grover' },
    { id: 2, nombre: 'Pablo' },
    { id: 3, nombre: 'Ana' },
];

app.get('/', (req, res) => {
    res.send('Hola Mundo desde Express.');
});

app.get('/api/usuarios', (req, res) => {
    res.send(usuarios);
});

app.get('/api/usuarios/:id', (req, res) => {
    let usuario = existeUsuario(req.params.id);
    if (!usuario) res.status(404).send('El usuario no fue encontrado');
    res.send(usuario);
});

app.post('/api/usuarios', (req, res) => {
    const schema = Joi.object({
        nombre: Joi.string().min(3).required(),
    });
    const { error, value } = validarUsuario(req.body.nombre);
    if (!error) {
        const usuario = {
            id: usuarios.length + 1,
            nombre: value.nombre,
        };
        usuarios.push(usuario);
        res.send(usuario);
    } else {
        const mensaje = error.details[0].message;
        res.status(400).send(mensaje);
    }
});

app.put('/api/usuarios/:id', (req, res) => {
    let usuario = existeUsuario(req.params.id);
    if (!usuario) {
        res.status(404).send('El usuario no fue encontrado');
        return;
    }

    const { error, value } = validarUsuario(req.body.nombre);
    if (error) {
        const mensaje = error.details[0].message;
        res.status(400).send(mensaje);
        return;
    }

    usuario.nombre = value.nombre;
    res.send(usuario);
});

app.delete('/api/usuarios/:id', (req, res) => {
    let usuario = existeUsuario(req.params.id);
    if (!usuario) {
        res.status(404).send('El usuario no fue encontrado');
        return;
    }

    const index = usuarios.indexOf(usuario);
    usuarios.splice(index, 1);

    res.send(usuario);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Escuchando en el puerto ${port}...`);
});

function existeUsuario(id) {
    return usuarios.find((u) => u.id === parseInt(id));
}

function validarUsuario(nom) {
    const schema = Joi.object({
        nombre: Joi.string().min(3).required(),
    });
    return schema.validate({ nombre: nom });
}
