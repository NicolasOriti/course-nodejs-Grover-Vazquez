const express = require('express');
const app = express();

app.use(express.json());

const users = [
    { id: 1, nombre: 'Nicolas' },
    { id: 2, nombre: 'Agustin' },
    { id: 3, nombre: 'Santiago' },
];

app.get('/', (req, res) => {
    res.send('Hola mundo desde Express.');
});

app.get('/api/users', (req, res) => {
    res.send(users);
});

app.get('/api/users/:id', (req, res) => {
    let user = users.find((u) => u.id === parseInt(req.params.id));
    if (!user) res.status(404).send('El usuario no fue encontrado');
    res.send(user);
});

app.post('/api/users', (req, res) => {
    const user = {
        id: users.length + 1,
        nombre: req.body.nombre
    };
    users.push(user);
    // console.log(users, user);
    res.send(user);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Escuchando en el puerto ${port}`);
});

// app.post();
// app.put();
// app.delete();
