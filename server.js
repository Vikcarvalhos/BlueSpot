// server.js
import jsonServer from 'json-server';

const server = jsonServer.create();
const router = jsonServer.router('./src/data/db.json');
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.bodyParser);

server.post('/users/login', (req, res) => {
    const { username, password } = req.body;

    // Get the user from the database
    const user = router.db.get('users').find({ username, password }).value();

    if (user) {
        // User found, return the user
        res.json({ id: user.id, username: user.username });
    } else {
        // User not found, return error
        res.status(401).json({ message: 'Nome de usuário ou senha inválidos.' });
    }
});

// Add this route
server.get('/users/:id', (req, res) => {
    const user = router.db.get('users').find({ id: Number(req.params.id) }).value();

    if (user) {
        res.json(user); // Return the entire user object
    } else {
        res.status(404).json({ message: 'Usuário não encontrado.' });
    }
});

server.use(router);
server.listen(3001, () => {
    console.log('JSON Server is running');
});