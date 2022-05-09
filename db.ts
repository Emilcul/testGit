const promise = require('bluebird');
const R = require('ramda');
const pgPromise = promise.promisifyAll(require('pg-promise'));

// Limit the amount of debugging of SQL expressions
const trimLogsSize: number = 200000;

// Database interface
interface DBOptions {
    host: string,
    database: string,
    user?: string,
    password?: string,
    port?: number,
    allowExitOnIdle?: boolean,
};

// Actual database options
const options: DBOptions = {
    user: 'emilcul',
    password: '1234',
    host: 'localhost',
    port: 5432,
    database: 'lovelystay_test',
    allowExitOnIdle: true,
};

console.info('Connecting to the database:',
    `${options.user}@${options.host}:${options.port}/${options.database}`);

const pgpDefaultConfig = {
    promiseLib: promise,
    // Log all querys
    query(query) {
        console.log('[SQL   ]', R.take(trimLogsSize, query.query));
    },
    // On error, please show me the SQL
    error(err, e) {
        if (e.query) {
            console.error('[SQL   ]', R.take(trimLogsSize, e.query), err);
        }
    }
};

const pgp = pgPromise(pgpDefaultConfig);
const db = pgp(options);

module.exports = db;