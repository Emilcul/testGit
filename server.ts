const dataBase = require('./db');

interface GithubUsers {
    id: number
};

dataBase.any('CREATE TABLE IF NOT EXISTS github_users (id BIGSERIAL, login TEXT UNIQUE, name TEXT, company TEXT, url TEXT, location TEXT, PRIMARY KEY (id))')
    .then(() => dataBase.any('CREATE TABLE IF NOT EXISTS languages (id BIGSERIAL, name TEXT UNIQUE, PRIMARY KEY (id))'))
    .then(() => dataBase.any('CREATE TABLE IF NOT EXISTS favorite_languages (id BIGSERIAL, userId INTEGER, langId INTEGER, FOREIGN KEY(userId) REFERENCES github_users(id), FOREIGN KEY(langId) REFERENCES languages(id), PRIMARY KEY (id))'))
    .then(() => process.exit(0))
 