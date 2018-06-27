/*The model for maintain format to the table structure for the QUESTIONS table*/

const orm = require('../config/orm.js');
const pool = require('../config/connections');

const questions = {

  // select all rows
  selectAll: function() {
    return new Promise(function(resolve, reject){
      pool.getConnection().then(function(connection){
          orm.selectAll('questions', connection)
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
          orm.selectAllWithCon('questions', colsVals, connection)
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
          orm.insertOne('questions', cols, vals, connection)
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
  
  //update rows that match condition
  updateOne: function(objColVals, condition) {
    return new Promise(function(resolve, reject){
      pool.getConnection().then(function(connection){
          orm.updateOne('questions', objColVals, condition, connection)
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
module.exports = questions;