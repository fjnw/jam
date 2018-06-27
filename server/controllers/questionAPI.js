const db = require('../models/models');
const router = require("express").Router();

//route for /question/prod id/question id
router.route('/:pid/:qid')
    .get(function(req, res){
        db.questions.selectAllWithMultCon({'productId':req.params.pid, 'id':req.params.qid})
        .then(function(results){
            res.json(results)
        })
        .catch(function(error){
            console.log(error);
            res.sendStatus(500);
        });
    })

//route for /question/id where id is the product id
router.route('/:id')
    .get(function(req, res){
        db.questions.selectAllWithMultCon({'productId':req.params.id})
        .then(function(results){
            res.json(results)
        })
        .catch(function(error){
            console.log(error);
            res.sendStatus(500);
        });
    })

//route for /question
router.route('/')
    .post(function(req,res){
        db.questions.insertOne(
            ["userId","productId","note"],
            [req.body.userId, req.body.productId, req.body.note])
        .then(function(result) {
            res.json(result);
        })
        .catch(function(error){
            console.log(error);
            res.sendStatus(500);
        });
    })

module.exports = router;