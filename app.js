const express = require('express');
const session = require('express-session');
const db = require('./utils/sqlConnection');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = 3000;

//Middleware
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());

app.use(session({
    secret: 'mdp_session',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));


// Route pour la page d'accueil
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// Route pour la page d'annonces
app.get('/annonces.html', (req, res) => {
    res.sendFile(__dirname + '/public/annonces.html');
});

//Requete pour se vérifier si l'utilisateur existe
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    db.query('SELECT * FROM utilisateurs WHERE login = ? AND password = ?', [username, password], (err, results) => {
        if (err) throw err;
        if (results.length > 0) {
            req.session.user = { username: username };
            res.redirect('/annonces.html');
        } else {
            res.redirect('/');
        }
    });
});

//Requete pour charger les annonces seulement si il y a une session existante
app.post('/api/annonces', (req, res) => {
    if (req.session.user != undefined) {
        db.query('SELECT * FROM annonces', (err, results) => {
            if (err) {
                res.status(500).send('Erreur lors de la récupération des annonces');
                return;
            }
            res.json(results);
        });
    } else {
        // Envoyer un statut 401 Non autorisé avec un message
        res.status(401).json({ error: "Non autorisé", message: "Vous devez être connecté pour voir les annonces." });
    }
});

//Gestion du boutton déconnexion et supression de la session
app.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Erreur lors de la destruction de la session:', err);
            res.status(500).send('Échec de la déconnexion');
        } else {
            res.send('Déconnexion réussie');
        }
    });
});

//routage statique vers la page a propos
app.get('/apropos.html', (req, res) => {
    res.sendFile(__dirname + '/public/apropos.html');
});

app.get('/accueil', (req, res) => {
    if (req.session.user == undefined) {
        res.redirect('/index.html');
    } else {
        res.redirect('/annonces.html');
    }
})

app.get('/createCookie.html', (req,res) => {
    res.cookie('cookie1', 'Mon super cookie !', { maxAge: 33600000 });
    res.cookie('cookie2', 'Mon deuxieme super cookie !', { maxAge: 33600000 });

    res.redirect('/cookie.html')
})

app.get('/clearCookie.html', (req,res) => {
    res.clearCookie('cookie1');
    res.clearCookie('cookie2');

    res.send('Cookie cleared !')
})

app.get('/getCookie.html', (req,res)=>{
    res.send(req.cookies);
})

app.post('/api/username', (req, res) => {
    if (req.session.user) {
        res.json({ username: req.session.user.username });
    } else {
        res.status(401).json({ error: "Non autorisé" });
    }
});

app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});
