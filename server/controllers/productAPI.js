const db = require('../models/models');
const router = require("express").Router();
const fs = require('fs');
const multer = require('multer');
const dateformat = require('dateformat');

const filePath = './src/files/products';
const upload = multer({dest:filePath});
const cloudinary = require('../config/cloudinary_config');


//product part api for homepage use
router.route('/recent')
    .get(function(req, res){
        db.prod_prodImages.selectRecentAllLimit(6)
        .then(function(results){
            res.json(results);
        })
        .catch(function(error){
            console.log(error);
            res.sendStatus(500);
        })
    })

//path for searching
router.route('/search')
    .get(function(req,res){
        db.prod_prodImages.selectAllCategoryAndSearch(req.query.category.split(','),req.query.search)
        .then(function(results){
            res.json(results);
        })
        .catch(function(error){
            console.log(error);
            res.sendStatus(500);
        })
    })

//path to get a specific product info
router.route('/:id')
    .get(function(req, res){
        db.prod_prodImages.selectOneWithAllImage(req.params.id)
        .then(function(results){
            res.json(results)
        })
        .catch(function(error){
            console.log(error);
            res.sendStatus(500);
        });
    })
    /*.put(function(req, res){
           db.products.updateOne(
               {
                   'startingPrice':req.body.startingPrice,
                   'prodName': req.body.prodName,
                   'description': req.body.description,
                   'location': req.body.location,
                   'category': req.body.category
                },
                req.params.id
           )
           .then(function(result){
                res.send(result)
           })
           .catch(function(error){
                console.log(error);
                res.send({status:'error'});
            });
    });*/

router.route('/')
    .post(upload.any(), function(req, res){
        let images = [];
        let imagePromise = [];

        //turns the string back to an array
        let urlList = [];
        if(req.body.url)
            urlList = req.body.url.split(",");

        for(let i in urlList)
            images.push({
                'image':urlList[i],
                'imageType':'url'
            });

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

                //     images.push({
                //         'image':req.files[i].path+fileExt,
                //         'imageType':'file'
                //     });

                //     fs.renameSync(req.files[i].path, req.files[i].path+fileExt, function(err){
                //         if(err){
                //             console.log(err)
                //             res.sendStatus(500);
                //         }
                //     })
                // }

                imagePromise.push(cloudinary.uploadToCloudinary(req.files[i]));
		    }
        }
        
        // for(let i = 1; i <= 4; i++){
        //     if(req.body["image"+i])
        //         images.push({
        //             'image':req.body["image"+i],
        //             'imageType':req.body["image"+i+"type"]
        //         });
        // }

        //builds the JSON object for the insert
        Promise.all(imagePromise)
        .then(results => {
            for(let i in results){
                images.push({
                    'image':results[i].url,
                    'imageType':'url'
                });
            }

            let date = Date.parse(req.body.endTimestamp);

            db.prod_prodImages.insertNewProd(
                ['prodName','category','description','startingPrice','location',
                    'endTimestamp','sellerId','returnPolicy'],
                ['productId','image','imageType'],
                [req.body.prodName,req.body.category,req.body.description,req.body.startingPrice,req.body.location,
                    dateformat(date, 'yyyy-mm-dd HH:MM:ss', false),req.body.sellerId,req.body.returnPolicy],
                images
            )
            .then(function(result){
                res.json(result);
            })
            .catch(function(error){
                console.log(error);
                res.sendStatus(500);
            });
        })
        .catch(err => {
            console.log(err);
            res.sendStatus(500);
        })
    })

module.exports = router;