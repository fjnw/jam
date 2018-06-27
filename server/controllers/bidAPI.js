const db = require('../models/models');
const router = require("express").Router();

//based route for bids
router.route('/')
    .get(function(req, res){
        db.bids.selectAllWithMultConOrderLimit(
            {
                prodId:{
                    vals:req.query.prodId,
                    where:"EQUALS",
                    join:"AND"
                }
            },
            [
                {amount:"desc"}
            ],
        1)
        .then(function(result){
            res.json(result);
        })
        .catch(function(error){
            console.log(error);
            res.sendStatus(500);
        });
    })

module.exports = router;