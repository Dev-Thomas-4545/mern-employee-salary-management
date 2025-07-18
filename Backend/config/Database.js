import { Sequelize } from 'sequelize';
import { resolve } from 'path';
import journal from './Journalisation.js';

const cheminBase = resolve('database.sqlite');

const db = new Sequelize({
    dialect: 'sqlite',
    storage: cheminBase,
    logging: (msg) => journal.debug(msg)
});

export default db;