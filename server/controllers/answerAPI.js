const db = require('../models/models');
const router = require("express").Router();

//route for /question/question id/answer id
router.route('/:qid/:aid')
    .get(function(req, res){
        db.answers.selectAllWithMultCon({'questionId':req.params.qid,'id':req.params.aid})
        .then(function(results){
            res.json(results)
        })
        .catch(function(error){
            console.log(error);
            res.sendStatus(500);
        });
    })

//route for /question/id
router.route('/:id')
    .get(function(req, res){
        db.answers.selectAllWithMultCon({'questionId':req.params.id})
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
        db.answers.insertOne(
            ["userId","questionId","note"],
            [req.body.userId, req.body.questionId, req.body.note])
        .then(function(result) {
            res.json(result);
        })
        .catch(function(error){
            console.log(error);
            res.sendStatus(500);
        });
    })

module.exports = router;