/*The functions here will serve as common sql commands for all the models.
  Each ORM will return a promise of the resulting data from the query.*/

var orm = {
    //gets all columns for all rows
    selectAll:function(table, connection){        
        return new Promise(function(resolve, reject){
            connection.query("SELECT * FROM ??", table, function(error, data){
                if(error) return reject(error);

                return resolve(data);
            });
        });
    },
    //gets all the columns for all rows in a certain order
    selectAllOrder:function(table, sortCols, connection){        
        return new Promise(function(resolve, reject){
            let sql = "SELECT * FROM ?? ORDER BY ";
            
            //builds the order by section (NOTE: no need to escape character as the application controls these values and not the user)
            for(i in sortCols){
                //adds in a comma and space if there are more than 1 col to sort by
                if(i > 0)
                    sql += ", ";

                //adds the column (key in the JSON) and condition of asc or desc
                for(j in sortCols[i]){
                    sql += j +" "+sortCols[i][j];
                }
            }

            connection.query(sql, [table], function(error, data){
                if(error) return reject(error);

                return resolve(data);
            });
        });
    },
    //selects all columns for a limited amount of rows
    selectAllLimit:function(table, limit, connection){        
        return new Promise(function(resolve, reject){
            connection.query("SELECT * FROM ?? LIMIT ?", [table, limit], function(error, data){
                if(error) return reject(error);

                return resolve(data);
            });
        });
    },
    //selects all columns for a limited amount of rows that are ordered
    selectAllLimitOrder:function(table, sortCols, limit, connection){
        return new Promise(function(resolve, reject){
            let sql = "SELECT * FROM ?? ORDER BY ";
            
            //builds the order by section (NOTE: no need to escape character as the application controls these values and not the user)
            for(i in sortCols){
                //adds in a comma and space if there are more than 1 col to sort by
                if(i > 0)
                    sql += ", ";

                //adds the column (key in the JSON) and condition of asc or desc
                for(j in sortCols[i]){
                    sql += j +" "+sortCols[i][j];
                }
            }

            //adds the limit clause
            sql+= " LIMIT ?";

            connection.query(sql, [table, limit], function(error, data){
                if(error) return reject(error);

                return resolve(data);
            });
        });
    },
    //selects all columns in all rows, but guarantee each rows are unique
    selectAllDistinct:function(table, col, connection){        
        return new Promise(function(resolve, reject){
            connection.query("SELECT distinct ?? FROM ??", [col,table], function(error, data){
                if(error) return reject(error);

                return resolve(data);
            });
        });
    },
    //selects all columns in all the rows that matches the condition
    selectAllWithCon:function(table, colsVals, connection){
        return new Promise(function(resolve, reject){
            let sql = "SELECT * FROM ?? WHERE ";
            let colCount = 0;
            for(i in colsVals){
                if(colCount > 0)
                    sql += " AND ";

                sql+=i +"= "+connection.escape(colsVals[i]);
                colCount++;
            }
            connection.query(sql, [table], function(error, data){
                if(error) return reject(error);

                return resolve(data);
            });
        });
    },
    //selects all columns in all the rows that matches the condition
    selectAllWithConInWhereControl:function(table, colsVals, connection){
        return new Promise(function(resolve, reject){
            let sql = "SELECT * FROM ?? WHERE ";
            let colCount = 0;
            for(i in colsVals){
                if(colCount > 0 && !Array.isArray(colsVals[i].vals))
                    sql += " "+colsVals[i].join+" ";

                //part to build the in clause
                if(Array.isArray(colsVals[i].vals)){
                    //ignores if the list is 1 and the value is all or ""
                    if(colsVals[i].vals.length >= 1 && colsVals[i].vals[0].toLowerCase() != 'all' && colsVals[i].vals[0].toLowerCase() != ''){
                        sql+=i +" IN (";
                        for(j in colsVals[i].vals){
                            if(j > 0 && j < colsVals[i].vals.length)
                                sql+=',';

                            sql+=connection.escape(colsVals[i].vals[j]);

                            if(j == colsVals[i].vals.length-1)
                                sql+=')';
                        }
                        colCount++;
                    }
                }
                else if(colsVals[i].where.toUpperCase() === 'LIKE'){
                    sql+=i +" LIKE "+connection.escape('%'+colsVals[i].vals+'%');
                    colCount++;
                }
                else{
                    sql+=i +"= "+connection.escape(colsVals[i].vals);
                    colCount++;
                }
            }
            
            //if the search is empty and no category was selected, then select all
            if(colCount == 0)
                sql = "SELECT * FROM ??"
            
            connection.query(sql, [table], function(error, data){
                if(error) return reject(error);

                return resolve(data);
            });
        });
    },
    selectLimitForOneCon:function(table, conCol, condition, limit, connection){
        return new Promise(function(resolve, reject){
            connection.query("SELECT * FROM ?? WHERE ?? = ? LIMIT ?", [table, conCol, condition, limit], function(error, data){
                if(error) return reject(error);

                return resolve(data);
            });
        });
    },
    //selects all columns in all the rows that matches the condition and orders it
    selectAllWithConInWhereControlOrder:function(table, colsVals, sortCols, connection){
        return new Promise(function(resolve, reject){
            let sql = "SELECT * FROM ?? WHERE ";
            let colCount = 0;
            for(i in colsVals){
                if(colCount > 0 && !Array.isArray(colsVals[i].vals))
                    sql += " "+colsVals[i].join+" ";

                //part to build the in clause
                if(Array.isArray(colsVals[i].vals)){
                    //ignores if the list is 1 and the value is all or ""
                    if(colsVals[i].vals.length >= 1 && colsVals[i].vals[0].toLowerCase() != 'all' && colsVals[i].vals[0].toLowerCase() != ''){
                        sql+=i +" IN (";
                        for(j in colsVals[i].vals){
                            if(j > 0 && j < colsVals[i].vals.length)
                                sql+=',';

                            sql+=connection.escape(colsVals[i].vals[j]);

                            if(j == colsVals[i].vals.length-1)
                                sql+=')';
                        }
                        colCount++;
                    }
                }
                else if(colsVals[i].where.toUpperCase() === 'LIKE'){
                    sql+=i +" LIKE "+connection.escape('%'+colsVals[i].vals+'%');
                    colCount++;
                }
                else{
                    sql+=i +"= "+connection.escape(colsVals[i].vals);
                    colCount++;
                }
            }
            
            //if the search is empty and no category was selected, then select all
            if(colCount == 0)
                sql = "SELECT * FROM ??"

            //builds the order by section (NOTE: no need to escape character as the application controls these values and not the user)
            if(sortCols != null && sortCols != []){

                sql += " ORDER BY ";

                for(i in sortCols){
                    //adds in a comma and space if there are more than 1 col to sort by
                    if(i > 0)
                        sql += ", ";

                    //adds the column (key in the JSON) and condition of asc or desc
                    for(j in sortCols[i]){
                        sql += j +" "+sortCols[i][j];
                    }
                }
            }
            
            connection.query(sql, [table], function(error, data){
                if(error) return reject(error);

                return resolve(data);
            });
        });
    },
    //selects all columns in all the rows that matches the condition and orders it and then limits the rows
    selectAllWithConInWhereControlOrderLimit:function(table, colsVals, sortCols, limit, connection){
        return new Promise(function(resolve, reject){
            let sql = "SELECT * FROM ?? WHERE ";
            let colCount = 0;
            for(i in colsVals){
                if(colCount > 0 && !Array.isArray(colsVals[i].vals))
                    sql += " "+colsVals[i].join+" ";

                //part to build the in clause
                if(Array.isArray(colsVals[i].vals)){
                    //ignores if the list is 1 and the value is all or ""
                    if(colsVals[i].vals.length >= 1 && colsVals[i].vals[0].toLowerCase() != 'all' && colsVals[i].vals[0].toLowerCase() != ''){
                        sql+=i +" IN (";
                        for(j in colsVals[i].vals){
                            if(j > 0 && j < colsVals[i].vals.length)
                                sql+=',';

                            sql+=connection.escape(colsVals[i].vals[j]);

                            if(j == colsVals[i].vals.length-1)
                                sql+=')';
                        }
                        colCount++;
                    }
                }
                else if(colsVals[i].where.toUpperCase() === 'LIKE'){
                    sql+=i +" LIKE "+connection.escape('%'+colsVals[i].vals+'%');
                    colCount++;
                }
                else{
                    sql+=i +"= "+connection.escape(colsVals[i].vals);
                    colCount++;
                }
            }
            
            //if the search is empty and no category was selected, then select all
            if(colCount == 0)
                sql = "SELECT * FROM ??"

            //builds the order by section (NOTE: no need to escape character as the application controls these values and not the user)
            if(sortCols != null && sortCols != []){

                sql += " ORDER BY ";

                for(i in sortCols){
                    //adds in a comma and space if there are more than 1 col to sort by
                    if(i > 0)
                        sql += ", ";

                    //adds the column (key in the JSON) and condition of asc or desc
                    for(j in sortCols[i]){
                        sql += j +" "+sortCols[i][j];
                    }
                }
            }

            //adds the limit clause
            sql+= " LIMIT ?";
            
            connection.query(sql, [table, limit], function(error, data){
                if(error) return reject(error);

                return resolve(data);
            });
        });
    },
    selectLimitForOneCon:function(table, conCol, condition, limit, connection){
        return new Promise(function(resolve, reject){
            connection.query("SELECT * FROM ?? WHERE ?? = ? LIMIT ?", [table, conCol, condition, limit], function(error, data){
                if(error) return reject(error);

                return resolve(data);
            });
        });
    },
    selectLimitForOneConOrder:function(table, conCol, condition, sortCols, limit, connection){
        return new Promise(function(resolve, reject){
            let sql = "SELECT * FROM ?? WHERE ?? = ? ORDER BY ";
            
            //builds the order by section (NOTE: no need to escape character as the application controls these values and not the user)
            for(i in sortCols){
                //adds in a comma and space if there are more than 1 col to sort by
                if(i > 0)
                    sql += ", ";

                //adds the column (key in the JSON) and condition of asc or desc
                for(j in sortCols[i]){
                    sql += j +" "+sortCols[i][j];
                }
            }

            //adds the limit clause
            sql+= " LIMIT ?";

            connection.query(sql, [table, conCol, condition, limit], function(error, data){
                if(error) return reject(error);

                return resolve(data);
            });
        });
    },
    //inserts a new row with the values
    insertOne: function(table, cols, values, connection){
        return new Promise(function(resolve, reject){
            connection.query("INSERT INTO ?? (??) VALUES (?)", [table, cols, values], function(error, data){
                if(error) return reject(error);

                return resolve(data.insertId);
            });
        });
    },
    //updates all rows that match the conditions with the values specified
    updateOne: function(table, values, cons, connection){
        return new Promise(function(resolve, reject){
            let sql = "UPDATE "+table+" SET ";
            let colCount = 0;

            //builds the update with binding variables based on name of keys
            for(i in values){
                //adds in a comma and space if there are more than 1 col to update
                if(colCount > 0)
                    sql += ", ";

                //adds the column name
                sql += i +" = "+connection.escape(values[i]);

                colCount++;
            }

            //adds the where clause
            sql+= " WHERE ";
            colCount=0;
            for(i in cons){
                //adds in an AND and space if there are more than 1 col in where clause
                if(colCount > 0)
                    sql += " AND ";

                //adds the column name
                sql += i +" = "+connection.escape(cons[i]);

                colCount++
            }

            connection.query(sql, function(error, data){
                if(error) return reject(error);

                return resolve(data);
            });
        });
    }
}

module.exports = orm;