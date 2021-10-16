//requires
const express  = require("express");
const router = express.Router();
const {checkAuth} = require('../middlewares/authentication.js');

//models import

import Data from '../models/data.js';

/********************
 *                  *
        API             
 *                  *
 ********************/ 

router.get("/get-small-charts-data", checkAuth, async(req,res)=>{
    try {
        const userId = req.userData._id;
        const chartTimeAgo = req.query.chartTimeAgo;
        const dId = req.query.dId;
        const variable = req.query.variable;
 
        const timeAgoMs = Date.now()-(chartTimeAgo*60*1000);
        console.log(userId);
        console.log(dId);
        console.log(variable);
        console.log(timeAgoMs);
//        const data = await Data.find({userId: userId, dId: dId, variable: variable, "time":{$gt: timeAgoMs}}).sort({"time":1}); //$gt greate
        const data = await Data.find({userId: userId, dId: dId, variable: variable, "createdTime": {$gt: timeAgoMs}}).sort({"createdTime": 1}); //$gt greate

        console.log("data0=>"+data[0]);
        console.log("data length =" + data.length)
        const response = {
            status: "success",
            data:data
        };
        return res.json(response);
    } catch (error) {
        console.log("error");
        const response = {
            status: "error",
        };       
        res.status(500).json(response);
        
    }
});

module.exports = router;