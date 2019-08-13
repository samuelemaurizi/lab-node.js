const mysql = require('mysql2');

// Creating the connection pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  database: 'node-h36',
  password: 'unsureSam19$'
});

module.exports = pool.promise();
