const faker = require('./fakerFunc.js');
const pool = require('../../server/config/connections.js');
const db = require('../../server/models/models');

//function to clear all the tables
const clearEverything = function(){
    return new Promise(function(resolve, reject){
        pool.getConnection().then(function(connection){
            connection.beginTransaction(function(error){
                if(error){
                    connection.rollback(function(){});
                    pool.closeConnection(connection);
                    return reject(error);
                }
                
                connection.query("SET FOREIGN_KEY_CHECKS = 0", function(error, data){
                    if(error){
                        connection.rollback(function(){});
                        pool.closeConnection(connection);
                        return reject(error);
                    }

                    connection.query("TRUNCATE TABLE answers", function(error, data){
                        if(error){
                            connection.rollback(function(){});
                            pool.closeConnection(connection);
                            return reject(error);
                        }
                    
                        connection.query("TRUNCATE TABLE questions", function(error, data){
                            if(error){
                                connection.rollback(function(){});
                                pool.closeConnection(connection);
                                return reject(error);
                            }

                            connection.query("TRUNCATE TABLE bids", function(error, data){
                                if(error){
                                    connection.rollback(function(){});
                                    pool.closeConnection(connection);
                                    return reject(error);
                                }

                                connection.query("TRUNCATE TABLE prodImages", function(error, data){
                                    if(error){
                                        connection.rollback(function(){});
                                        pool.closeConnection(connection);
                                        return reject(error);
                                    }

                                    connection.query("TRUNCATE TABLE products", function(error, data){
                                        if(error){
                                            connection.rollback(function(){});
                                            pool.closeConnection(connection);
                                            return reject(error);
                                        }

                                        connection.query("TRUNCATE TABLE users", function(error, data){
                                            if(error){
                                                connection.rollback(function(){});
                                                pool.closeConnection(connection);
                                                return reject(error);
                                            }

                                            connection.query("SET FOREIGN_KEY_CHECKS = 1", function(error, data){
                                                if(error){
                                                    connection.rollback(function(){});
                                                    pool.closeConnection(connection);
                                                    return reject(error);
                                                }

                                                connection.commit(function(error){
                                                    if(error){
                                                        connection.rollback(function(){});
                                                        pool.closeConnection(connection);
                                                        return reject(error);
                                                    }
                                                });

                                                pool.closeConnection(connection);
                                                return resolve("All good");
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    })
}

//fuction to insert user and their product
const insertRandomUser = function(count, max){
    return new Promise(function(resolve, reject){
        //sets up the user to be inserted
        let userName = 'user'+count;
        let password = '1234';

        let person = faker.getRandomPerson();

        person.userName = userName;
        person.password = password;

        let userId = null;
                
        db.users.insertOne(
            ['username','password','firstname','lastname','email','image','imageType'],
            [person.userName,person.password,person.firstName,person.lastName,person.email,person.avatar,person.imageType])
        .then(function(data){
            if(count+1 <= max)
                insertRandomUser(count+1, max)
                .then(function(data){
                    return resolve(data);
                })
                .catch(function(error){
                    return reject(data);
                });
            else
                return resolve(data);            
        })
        .catch(function(error){
            return reject(error);
        });
    });
}

//function to insert random productions
const insertRandomProd = function(count, max){
    return new Promise(function(resolve, reject){
        //sets up the product
        let product = faker.getRandomProd();

        //sets up random images for the product
        let prodImages = faker.getRandomProdImage(Math.floor(Math.random() * 4)+1);

        db.users.selectAll()
        .then(function(data){
            let userId = data[Math.floor(Math.random() * data.length)].id;

            db.prod_prodImages.insertNewProd(
                ['prodName','category','description','startingPrice','location','endTimestamp','sellerId','returnPolicy'],
                ['productId','image','imageType'],
                [product.productName,product.department,product.description,product.price,product.location,product.endDate,userId,product.returnPolicy],
                prodImages
            )
            .then(function(data){
                if(count+1 <= max)
                    insertRandomProd(count+1, max)
                    .then(function(data){
                        return resolve(data);
                    })
                    .catch(function(error){
                        return reject(data);
                    });
                else
                    return resolve(data);
            })
            .catch(function(error){
                return reject(error);
            });
        });
    });
}

//function to insert random questions
const insertRandomQuestions = function(count, max){
    return new Promise(function(resolve, reject){
        let prodId = null;

        db.products.selectAll()
        .then(function(data){
            prodId = data[Math.floor(Math.random() * data.length)].id;
        })
        .then(function(){
            db.users.selectAll()
            .then(function(data){
                let userId = data[Math.floor(Math.random() * data.length)].id;
                let question = faker.getRandomQuestion();

                db.questions.insertOne(
                    ['userId','productId','note'],
                    [userId,prodId,question.question]
                )
                .then(function(data){
                    if(count +1 <= max)
                        insertRandomQuestions(count+1, max)
                        .then(function(data){
                            return resolve(data);
                        })
                        .catch(function(error){
                            return reject(error);
                        })
                    else
                        return resolve(data);
                })
                .catch(function(error){
                    return reject(error);
                });
            })
            .catch(function(error){
                return reject(error);
            });
        })
        .catch(function(error){
            return reject(error);
        });
    });
}

//function to insert random questions
const insertRandomAnwsers = function(count, max){
    return new Promise(function(resolve, reject){
        let qId = null;

        db.questions.selectAll()
        .then(function(data){
            qId = data[Math.floor(Math.random() * data.length)].id;
        })
        .then(function(){
            db.users.selectAll()
            .then(function(data){
                let userId = data[Math.floor(Math.random() * data.length)].id;
                let answer = faker.getRandomAnswer();

                db.answers.insertOne(
                    ['userId','questionId','note'],
                    [userId,qId,answer.answer]
                )
                .then(function(data){
                    if(count +1 <= max)
                        insertRandomAnwsers(count+1, max)
                        .then(function(data){
                            return resolve(data);
                        })
                        .catch(function(error){
                            return reject(error);
                        })
                    else
                        return resolve(data);
                })
                .catch(function(error){
                    return reject(error);
                });
            })
            .catch(function(error){
                return reject(error);
            });
        })
        .catch(function(error){
            return reject(error);
        });
    });
}

//function to insert random bids
const insertRandomBids = function(count, max){
    return new Promise(function(resolve, reject){
        let userId = null;

        db.users.selectAll()
        .then(function(data){
            userId = data[Math.floor(Math.random() * data.length)].id;
        })
        .then(function(){
            
            db.products.selectAll()
            .then(function(data){
                let prodId = null;
                let item = null;
                
                //checks to make sure that prodId selected is not the seller for the bidder
                do{
                    item = Math.floor(Math.random() * data.length);
                    if(data[item].sellerId !== userId)
                        prodId = data[item].id;
                }while(prodId == null);

                let bid = faker.getRandomBid(data[item].startingPrice, 9999);

                db.bids.insertOne(
                    ['amount','buyerId','prodId'],
                    [bid.amount,userId,prodId]
                )
                .then(function(data){
                    if(count +1 <= max)
                        insertRandomBids(count+1, max)
                        .then(function(data){
                            return resolve(data);
                        })
                        .catch(function(error){
                            return reject(error);
                        })
                    else
                        return resolve(data);
                })
                .catch(function(error){
                    return reject(error);
                });
            })
            .catch(function(error){
                return reject(error);
            });
        })
        .catch(function(error){
            return reject(error);
        });
    });
}

//function to generate a random data to insert
const generateRandomData = function(){
    if(process.argv.length < 3){
        console.log("Please enter at least 1 integer after the command `node db\\seeder\\seed.js`")
    }
    else{
        //sets up the counters
        let userCount = 0;
        let prodCount = 0;
        let questionCount = 0;
        let answerCount = 0;
        let bidCount = 0;

        if(process.argv[2])
            userCount = parseInt(process.argv[2]);
        
        if(process.argv[3])
            prodCount = parseInt(process.argv[3]);
        
        if(process.argv[4])
            questionCount = parseInt(process.argv[4]);

        if(process.argv[5])
            answerCount = parseInt(process.argv[5]);

        if(process.argv[6])
            bidCount = parseInt(process.argv[6]);

        //calls the database truncation function
        clearEverything()
        .then(function(info){
            //inserts the user
            if(userCount){
                insertRandomUser(1, userCount)
                .then(function(data){
                    console.log("Inserted "+userCount+" users into the database with products for sale.");
                })
                .then(function(data){
                    //inserts random products to random users
                    if(prodCount > 0){
                        insertRandomProd(1, prodCount)
                        .then(function(results){
                            console.log("Inserted "+prodCount+" products into the database.");
                            Promise.all([
                                new Promise(function(resolve, reject){
                                    //inserts the questions
                                    if(questionCount){
                                        insertRandomQuestions(1, questionCount)
                                        .then(function(data){
                                            console.log("Inserted "+questionCount+" questions into the database.");
                                        })
                                        .then(function(){
                                            //inserts the answers
                                            if(answerCount)
                                                insertRandomAnwsers(1, answerCount)
                                                .then(function(data){
                                                    console.log("Inserted "+answerCount+" answers into the database.");
                                                    return resolve();
                                                })
                                                .catch(function(error){
                                                    console.log(error);
                                                    return reject();
                                                });
                                            else{
                                                console.log("No answers were inserted into the database.");
                                                return resolve();
                                            }
                                        })
                                        .catch(function(error){
                                            console.log(error);
                                            return reject();
                                        });
                                    }
                                    else{
                                        console.log("0 or nothing was entered for questions. Will not insert any answers.");
                                        return resolve();
                                    }
                                }),
                                new Promise(function(resolve, reject){
                                    if(bidCount){
                                        if(userCount > 1){
                                            insertRandomBids(1,bidCount)
                                            .then(function(data){
                                                console.log("Inserted "+bidCount+" bids into the database.");
                                                return resolve();
                                            })
                                            .catch(function(error){
                                                console.log(error);
                                                return reject();
                                            });
                                        }
                                        else{
                                            console.log("Number of users must be greater than 1 to insert any bids.");
                                            return resolve();
                                        }
                                    }
                                    else
                                        return resolve();
                                })
                            ])
                            .then(function(results){
                                pool.closePool();
                            });
                        })
                        .catch(function(error){
                            console.log(error);
                            pool.closePool();
                        });
                    }
                    else{
                        console.log("0 or nothing was entered for product count. Will not insert any questions, answers, or bids.");
                        pool.closePool();
                    }
                })
                .catch(function(error){
                    console.log(error);
                    pool.closePool();
                });
            }
            else{
                console.log("Nothing was inserted into the database.");
                pool.closePool();
            }
        });
    }
}

//executes the main seeder
generateRandomData();