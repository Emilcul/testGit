const commander = require('commander');
const bluebird = require("bluebird");
const database = require('./db.js');
const rp = require('request-promise');

commander.program
  .version('1.0.0.0');

interface GithubUsers {
    id: number,
    login: string,
    name: string,
    company: string,
    url: string,
    location: string
};

const gitHubUserReq = (userName: string) => {
  return rp({
    uri: `https://api.github.com/users/${userName}`,
    headers: {
        'User-Agent': 'Request-Promise'
    },
    json: true
  })
  .catch(() => {
    console.log('User with such userName not found')
  })
}

const dbQuery = (table: string, queries?: object) => {
  let queryString = `SELECT * FROM ${table}`;
  if(!queries){
    return database.query(queryString)
  } else {
    var paramsString = ` WHERE `;
    for (var p in queries) {
      paramsString += p + '=' + `'${queries[p]}'`;
    }
    return database.query(queryString + paramsString)
  }
}

commander.program.command('find')
  .description('Find user in db')
  .argument('<string>', 'user name')
  .action((userName: string) => {
    gitHubUserReq(userName)
      .then((user) => {
          if(!user) return;
          console.log('user', user)
          return database.one('INSERT INTO github_users (login, name, company, url, location) VALUES ($[login],$[name],$[company],$[url],$[location]) RETURNING id', user)
            .catch(() => console.log('Error: User with this login already exists'))
      })
      .then(() => process.exit(0))
  });

commander.program.command('users')
  .description('list all users')
  .action( () =>
      dbQuery('github_users')
      .then((users: []) => console.log('users', users))
      .then(() => process.exit(0))
      .catch(err => console.log('err', err))
  );

commander.program.command('users_located')
  .description('Find user in db')
  .argument('<string>', 'location')
  .action((location: string) => {
    dbQuery('github_users', { location })
      .then(users => console.log('users', users))
      .then(() => process.exit(0))
      .catch(err => console.log('err', err))
  });

commander.program
  .parse(process.argv);
