const db = require('../models/models');
const router = require("express").Router();
const fs = require('fs');
const multer = require('multer');

const filePath = './src/files/accounts';
const upload = multer({dest:filePath});
const cloudinary = require('../config/cloudinary_config');

/*Special queries that do not fit in an ORM.*/
const pool = require('../config/connections');


//route for getting the sell history for a user
router.route('/sellhistory/:id')
    .get(function(req, res){
        let sql = "SELECT p.id as prodId, p.prodName, p.category, p.endTimestamp, "+
                    "u.userName as buyerName, u.id as buyerId, b.amount "+
                    "FROM products p "+
                    "LEFT OUTER JOIN bids b "+
                        "ON p.id = b.prodId "+
                    "LEFT OUTER JOIN users u "+
                        "ON b.buyerId = u.id "+
                    "WHERE p.endTimestamp <= CURRENT_TIMESTAMP "+
                    "AND b.amount = (SELECT MAX(amount) FROM bids b2 WHERE b2.prodId = b.prodId) "+
                    "AND p.sellerId = ?";

        pool.getConnection().then(function(connection){
            connection.query(sql, req.params.id, function(error, data){
                if(error){
                    console.log(error);
                    res.sendStatus(500);
                };

                pool.closeConnection(connection);
                res.json(data);
            });
        });
    })

//route for getting the buy history for a user
router.route('/buyhistory/:id')
    .get(function(req, res){
        let sql = "SELECT MAX(b.amount) as amount, p.id as prodId, p.category, p.prodName, p.endTimestamp, "+
                    "u.id as sellerId, u.userName as sellerName "+
                    "FROM bids b "+
                    "INNER JOIN products p "+
                        "ON b.prodId = p.id "+
                    "INNER JOIN users u "+
                        "ON p.sellerId = u.id "+
                    "WHERE b.buyerId = ? "+
                    "AND p.endTimestamp <= CURRENT_TIMESTAMP "+
                    "GROUP BY p.id, p.prodName, p.endTimestamp, "+
                        "u.id, u.userName";

        pool.getConnection().then(function(connection){
            connection.query(sql, req.params.id, function(error, data){
                if(error){
                    console.log(error);
                    res.sendStatus(500);
                };

                pool.closeConnection(connection);
                res.json(data);
            });
        });
    })

//updates a user
router.route('/update')
    .post(function(req, res){
        db.users.updateOne(req.body.userInfo,{id:req.body.userId})
        .then(function(result){
            res.json(result);
        })
        .catch(function(error){
            console.log(error);
            res.sendStatus(500);
        })
    })


//sign up new user
router.route('/signup')
    .post(upload.any(), function(req, res){
        let image = null;
        let imagePromise = [];

        //grabs the file names
        if(req.files){
            for(let i in req.files){
                // let fileExt = '';
	            // let type = req.files[i].mimetype.trim();
                // if( (type === 'image/jpeg') ||
                //     (type === 'image/jpg') ||
                //     (type === 'image/png' )) {

			    //     if(type == 'image/jpeg') {
				//         fileExt = ".jpeg";
                //     }
                //     else if(type == 'image/jpg') {
                //         fileExt = ".jpg";
                //     }
                //     else if(type == 'image/png') {
                //         fileExt = ".png";
                //     }

                //     image = req.files[i].path+fileExt;

                //     fs.renameSync(req.files[i].path, req.files[i].path+fileExt, function(err){
                //         if(err){
                //             console.log(err)
                //             res.sendStatus(500);
                //         }
                //     })
                //}

                imagePromise.push(cloudinary.uploadToCloudinary(req.files[i])); 
		    }
        }

        Promise.all(imagePromise)
        .then(results => {
            if(results){
                image = results[0].url;
            }
            
            db.users.insertOne(
                ["email","userName","firstName","lastName","password","image","imageType"],
                [req.body.email, req.body.userName, req.body.firstName, req.body.lastName, req.body.password, image, 'url'])//req.body.imageType]) disabled this for heroku fix
            .then(function(result) {
                res.json({status:'good',result:result});
            })
            .catch(function(error){
                console.log(error);
                if(error.code === 'ER_DUP_ENTRY')
                    res.json({status:'bad', msg:"Username already in use."});
                else
                    res.sendStatus(500);
            });
        })
        .catch(err => {
            console.log(err);
            res.sendStatus(500);
        })
    })

//gets the info for a specific user
router.route('/:id')
    .get(function(req, res){
        db.users.selectAllWithMultCon({'id':req.params.id})
        .then(function(result){
            res.json(result);
        })
        .catch(function(error){
            console.log(error);
            res.sendStatus(500);
        })
    })


router.route('/')
    //gets user info from logging in
    .post(function(req,res){
        db.users.selectAllWithMultCon({'userName':req.body.userName,'password':req.body.password})
        .then(function(result){
            res.json(result);
        })
        .catch(function(error){
            console.log(error);
            res.sendStatus(500);
        });
    })

module.exports = router;
