/*The model for maintain format to the table structure for the PRODUCTS table*/

const orm = require('../config/orm.js');
const pool = require('../config/connections');

const products = {

  // select all rows
  selectAll: function() {
    return new Promise(function(resolve, reject){
      pool.getConnection().then(function(connection){
          orm.selectAll('products', connection)
          .then(function(res) {
            pool.closeConnection(connection);
            return resolve(res);
          })
          .catch(function(error){
            pool.closeConnection(connection);
            return reject(error);
          });
      });
    });
  },

  //selects all rows in an order
  selectAllOrder: function(sortCols) {
    return new Promise(function(resolve, reject){
      pool.getConnection().then(function(connection){
          orm.selectAllOrder('products', sortCols, connection)
          .then(function(res) {
            pool.closeConnection(connection);
            return resolve(res);
          })
          .catch(function(error){
            pool.closeConnection(connection);
            return reject(error);
          });
      });
    });
  },

  //selects all rows in an order
  selectAllLimitOrder: function(sortCols, limit) {
    return new Promise(function(resolve, reject){
      pool.getConnection().then(function(connection){
          orm.selectAllLimitOrder('products', sortCols, limit, connection)
          .then(function(res) {
            pool.closeConnection(connection);
            return resolve(res);
          })
          .catch(function(error){
            pool.closeConnection(connection);
            return reject(error);
          });
      });
    });
  },

  //selects all rows in an order
  selectAllLimit: function(limit) {
    return new Promise(function(resolve, reject){
      pool.getConnection().then(function(connection){
          orm.selectAllLimit('products', limit, connection)
          .then(function(res) {
            pool.closeConnection(connection);
            return resolve(res);
          })
          .catch(function(error){
            pool.closeConnection(connection);
            return reject(error);
          });
      });
    });
  },

  //selects all rows based on the 1 or multiple condition(s)
  selectAllWithMultCon: function(colsVals) {
    return new Promise(function(resolve, reject){
      pool.getConnection().then(function(connection){
          orm.selectAllWithCon('products', colsVals, connection)
          .then(function(res) {
            pool.closeConnection(connection);
            return resolve(res);
          })
          .catch(function(error){
            pool.closeConnection(connection);
            return reject(error);
          });
      });
    });
  },

  //selects all rows based on likes and in
  selectAllwithMultConInLike: function(colsVals){
    return new Promise(function(resolve, reject){
      pool.getConnection().then(function(connection){
        orm.selectAllWithConInWhereControl('products', colsVals, connection)
        .then(function(res) {
          pool.closeConnection(connection);
          return resolve(res);
        })
        .catch(function(error){
          pool.closeConnection(connection);
          return reject(error);
        });
      });
    });
  },

  //selects all rows based on likes and in and orders them
  selectAllwithMultConInLikeOrder: function(colsVals, sortCols){
    return new Promise(function(resolve, reject){
      pool.getConnection().then(function(connection){
        orm.selectAllWithConInWhereControlOrder('products', colsVals, sortCols, connection)
        .then(function(res) {
          pool.closeConnection(connection);
          return resolve(res);
        })
        .catch(function(error){
          pool.closeConnection(connection);
          return reject(error);
        });
      });
    });
  },

  //selects all rows in an order
  selectLimitForOneCon: function(cols, vals, limit) {
    return new Promise(function(resolve, reject){
      pool.getConnection().then(function(connection){
          orm.selectLimitForOneCon('products', cols, vals, limit, connection)
          .then(function(res) {
            pool.closeConnection(connection);
            return resolve(res);
          })
          .catch(function(error){
            pool.closeConnection(connection);
            return reject(error);
          });
      });
    });
  },

  //selects all rows in an order
  selectLimitForOneConOrder: function(cols, vals, sortCols, limit) {
    return new Promise(function(resolve, reject){
      pool.getConnection().then(function(connection){
          orm.selectLimitForOneConOrder('products', cols, vals, sortCols, limit, connection)
          .then(function(res) {
            pool.closeConnection(connection);
            return resolve(res);
          })
          .catch(function(error){
            pool.closeConnection(connection);
            return reject(error);
          });
      });
    });
  },

  //creates a row
  insertOne: function(cols, vals) {
    return new Promise(function(resolve, reject){
      pool.getConnection().then(function(connection){
          this.insertOneConnection(cols, vals, connection)
          .then(function(res) {
              pool.closeConnection(connection);
            return resolve(res);
          })
          .catch(function(error){
            pool.closeConnection(connection);
            return reject(error);
          });
      });
    });
  },
  //actual insert
  insertOneConnection: function(cols, vals, connection) {
    return new Promise(function(resolve, reject){
      orm.insertOne('products', cols, vals, connection)
        .then(function(res) {
          return resolve(res);
        })
        .catch(function(error){
          return reject(error);
        });
    });
  },
  
  //update rows that match condition
  updateOne: function(objColVals, condition) {
    return new Promise(function(resolve, reject){
      pool.getConnection().then(function(connection){
          orm.updateOne('products', objColVals, condition, connection)
          .then(function(res) {
            pool.closeConnection(connection);
            return resolve(res);
          })
          .catch(function(error){
            pool.closeConnection(connection);
            return reject(error);
          });
      });
    });
  }
};

// export to controller.js
module.exports = products;