import express from 'express';
import cors from 'cors';
import session from 'express-session';
import dotenv from 'dotenv';
import db from './config/Database.js';
import journal from './config/Journalisation.js';
import initialiserDonnees from './config/Initialisation.js';

import SequelizeStore from 'connect-session-sequelize';
import FileUpload from 'express-fileupload';

import UserRoute from './routes/UserRoute.js';
import AuthRoute from './routes/AuthRoute.js';

const app = express();

const sessionStore = SequelizeStore(session.Store);
const store = new sessionStore({
    db: db
});

db.sync().then(() => {
    journal.info('Base de données synchronisée');
    initialiserDonnees();
}).catch((err) => {
    journal.error(`Erreur de synchronisation: ${err.message}`);
});

dotenv.config();

// Middleware
app.use(session({
    secret: process.env.SESS_SECRET,
    resave: false,
    saveUninitialized: true,
    store: store,
    cookie: {
        secure: 'auto'
    }
}));

app.use(cors ({
    credentials: true,
    origin: 'http://localhost:5173'
}));


app.use(express.json());

app.use(FileUpload());
app.use(express.static("public"));

app.use(UserRoute);
app.use(AuthRoute);

// store.sync();

app.listen(process.env.APP_PORT, () => {
    journal.info('Serveur démarré sur le port ' + process.env.APP_PORT);
});