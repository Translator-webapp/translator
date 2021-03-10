const Sequelize = require('sequelize')
const pkg = require('../../package.json')
// var pg = require('pg')
// pg.defaults.ssl = true

const databaseName = pkg.name + (process.env.NODE_ENV === 'test' ? '-test' : '')

const db = new Sequelize(
  process.env.DATABASE_URL + '?ssl=true' ||
    `postgres://localhost:5432/${databaseName}`,
  {
    logging: false
  }
)
module.exports = db

// This is a global Mocha hook used for resource cleanup.
// Otherwise, Mocha v4+ does not exit after tests.
if (process.env.NODE_ENV === 'test') {
  after(databaseName, 'close database connection', () => db.close())
}
