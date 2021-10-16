const express = require('express');
const router = express.Router();
const {checkAuth} = require('../middlewares/authentication.js');

import Dashboard from '../models/dashboard.js';
import Device from '../models/device.js';

//Create dashsboards
router.post('/dashboard', checkAuth, async(req, res)=>{
    console.log(req);
    try{
        const userId = req.userData._id;
        var newDashboard = req.body.dashboard;

        newDashboard.userId = userId;
        console.log(userId);
        newDashboard.createdTime = Date.now();
        const r = await Dashboard.create(newDashboard);
        const response = {
            status: "success"
        }
        return res.json(response);
    }
    catch (error){
        console.log(error);
        const response = {
            status: "error",
            error: error
        }
        return res.status(500).json(response);
    }

});

//List dashboards
router.get('/dashboard', checkAuth, async(req, res)=>{
    try {
        const userId = req.userData._id;
        const dashboards = await Dashboard.find({userId: userId});
        const response = {
            status: "success",
            data: dashboards
        }
        return res.json(response); 

    } catch (error) {
        console.log(error);
        const response = {
            status: "error",
            error: error
        }
        return res.status(500).json(response);         
    }
});

//Delete
router.delete("/dashboard",checkAuth,async(req,res)=>{
    try {
        const userId = req.userData._id;
        const dashboardId = req.query.dashboardId;

        const devices = await Device.find({userId: userId, dashboardId: dashboardId});
        if(devices.length > 0){
            const response = {
                status: "error",
                error: "dashboard in use"
            }
            return res.json(response);
        }


        const result = await Dashboard.deleteOne({userId: userId, _id: dashboardId});
        const response = {
            status:"success",
        };
        return res.json(response);        
    } 
    catch (error) {
        console.log("Error deleting dashboard");
        const response = {
            status: "error",
            error: error,
        }; 
        return res.status(500).json(response);       
    }
});
module.exports = router;