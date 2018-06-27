// Set up MySQL connection.
var mysql = require("mysql");

if (process.env.CLEARDB_DATABASE_URL) {
  pool = mysql.createPool(process.env.CLEARDB_DATABASE_URL);
} else {
  var pool = mysql.createPool({
    port: 3306,
    host: "localhost",
    user: "jb_user",
    password: "jb_1234",
    database: "jambid_db",
    connectionLimit: 20
  });
};

// Make connection.
var getConnection = function(){
  return new Promise(function(resolve, reject){
    pool.getConnection(function(error, connection){
      if(error) return reject(error);

      return resolve(connection);
    });
  });
}

//closes the connection
var closeConnection = function(connection){
  connection.release();
}

//ends the pool
var closePool = function(){
  pool.end();
}

// Export connection for our ORM to use.
module.exports = {getConnection: getConnection,
  closeConnection: closeConnection,
  closePool: closePool};