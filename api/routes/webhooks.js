//requires

const express = require("express");
const router = express.Router();
const {checkAuth} = require('../middlewares/authentication.js');
const axios = require("axios");
const colors = require("colors");
var mqtt = require('mqtt');

//models import
import Data from '../models/data.js';
import Device from '../models/device.js';
import AlarmRule from '../models/emqx_alarm_rule.js';
import Notification from '../models/notification.js';
import Dashboard from '../models/dashboard.js';
import EmqxAuthRule from '../models/emqx_auth.js';
//Global variables
var client;


//Start
setTimeout(() => {
    console.log("API Start MQTT connection");
    startMqttClient();
}, 3000);

 /********************
 *                  *
      API         
 *                  *
 ********************/  
router.post('/saver-webhook', async(req,res)=>{
   // console.log(req);
    try {
        if(req.headers.token != process.env.EMQX_API_TOKEN){
            res.sendStatus(404);
            return;
        }
        const data = req.body;

        const splittedTopic = data.topic.split("/");
        console.log(splittedTopic);
        const dId = splittedTopic[1];
        const variable = splittedTopic[2];
        console.log(data.userId);
        console.log(dId);
        var result = await Device.find({userId: data.userId, dId:dId});
        console.log(result.length);
        if(result.length == 1){
            var newData = {
                userId: data.userId,
                dId: dId,
                variable: variable,
                value: data.payload.value,
                createdTime: Date.now()      
            };
            console.log(newData);
            const dataStorage = await Data.create(newData);
            console.log(data);

        }
        console.log(data);
        return res.sendStatus(200);
   
    } catch (error) {
        console.log(error);
        const response = {
            status: "error",
            error: error
        }
        return res.status(500).json(response);   
                    
    }

});

router.post('/alarm-webhook', async(req,res)=>{
    // console.log(req);
     try {
         if(req.headers.token != process.env.EMQX_API_TOKEN){
             res.sendStatus(404);
             return;
         }
         res.sendStatus(200);
         const alarm = req.body;
         console.log(alarm);
         updateAlarmCounter(alarm.emqxRuleId);
         const prevNot = await Notification.find({dId:alarm.dId, emqxRuleId:alarm.emqxRuleId}).sort({createdTime:-1}).limit(1);
         if(prevNot == 0){
            console.log("alarm notification");
            saveNotification(alarm);
            sendMqttNot(alarm);            
         }
         else{  
            const prevNotMins = (Date.now()-prevNot[0].createdTime) / 60000;
            if(prevNotMins>alarm.triggerTime){
                console.log("Triggered alarm");
                saveNotification(alarm);
                sendMqttNot(alarm);
            }
         }
  
     } catch (error) {
         console.log(error);
         return res.sendStatus(500);
                     
     }
 
 }); 

 // get new notification from EMQX
router.get("/notifications", checkAuth, async(req, res)=>{
try {
    const userId = req.userData._id;
    const notifications = await getNotifications(userId);
    console.log("notifications"+notifications);
    const response ={
        status: "success",
        data: notifications
    };
    res.json(response);
} catch (error) {
    console.log("ERROR GETTING NOTIFICATIONS");
    console.log(error);
    const response ={
        status: "error",
        error: error
    };
    return res.status(500).json(response);
    
}
 });

 //Update notification (readed status) from FRONTEND
 router.put("/notifications", checkAuth, async(req, res)=>{
    try {
        const userId = req.userData._id;
        const notificationId = req.body.notId;
        await Notification.updateOne({userId: userId, _id: notificationId},{readed: true});
        const response ={
            status: "success",
        };
        res.json(response);
    } catch (error) {
        console.log("ERROR UPDATING NOTIFICATION STATUS");
        console.log(error);
        const response ={
            status: "error",
            error: error
        };
        return res.status(500).json(response);
        
    }
     });

// Create device configuration webhook
router.post("/getDeviceConfig", async(req,res)=>{
    console.log(req.body);
    const dId = req.body.dId;
    const password = req.body.password;
    const device = await Device.findOne({dId : dId});
    console.log("device.password->" + device.password);
    console.log("password->" + password);    
    if(!password == device.password){

        return res.status(401).json();
    };

    const userId = device.userId;
    var mqttAuth = await createMqttAuth(dId,userId);
    var dashboard = await Dashboard.findOne({_id: device.dashboardId});
    console.log(dashboard);
    var variables = [];
    dashboard.widgets.forEach(widget=>{
        var aux = (({variable, variableFullName, variableType, variablePeriod})=>({
            variable, variableFullName, variableType, variablePeriod}))(widget);
        variables.push(aux);
    });
    const response = {
        username: mqttAuth.username,
        password: mqttAuth.password,
        topic: userId + "/" + dId +  "/",
        variables: variables
    };
    console.log(response);
    res.json(response);
    setTimeout(() => {
        createMqttAuth(dId, userId);
        console.log("Device credentials updated");
        
    },60000);


});


 /********************
 *                  *
      Functions         
 *                  *
 ********************/  
// MQTT FUNCTIONS
function startMqttClient(){
    const options = {
        port: 1883,
        host: process.env.EMQX_HOST,
        clientId: 'webhook_superuser'+Math.round(Math.random()*(0-10000)*-1),
        username: process.env.EMQX_SUPERUSER_USERNAME,
        password: process.env.EMQX_SUPERUSER_PASSWORD,
        keepalive: 60,
        reconnectPeriod: 5000,
        protocolId: 'MQIsdp',
        protocolVersion: 3,
        clean: true,
        encoding: 'utf8'
    };

    client = mqtt.connect('mqtt://'+process.env.EMQX_HOST,options);
    console.log('mqtt://'+process.env.EMQX_HOST);
    console.log('username:'+ process.env.EMQX_SUPERUSER_USERNAME),
    console.log('password:'+ process.env.EMQX_SUPERUSER_PASSWORD),
    client.on('connect',function(){
        console.log("API MQTT CONNECTION->SUCCESS".bgGreen);
        console.log("\n");
    });

    client.on('reconnect',(error)=>{
        console.log("API RECONNECTING MQTT");
            console.log('mqtt://'+process.env.EMQX_HOST);
    console.log('username:'+ process.env.EMQX_SUPERUSER_USERNAME),
     console.log('password:'+ process.env.EMQX_SUPERUSER_PASSWORD),
        console.log(error);
    });

    client.on('error',(error)=>{
        console.log("API MQTT CONNECTION FAIL ->");
        console.log(error);
    });
}  

function sendMqttNot(not){
    const  topic = not.userId + "/dummy-dId/dumy-var/notif";
    const msg = 'The rule when the'+ not.variableFullName + 'is' + not.condition + 'than' + not.value;
    client.publish(topic,msg);
}
// Notification FUNCTIONS 

function saveNotification(alarm){
    var newNot=alarm;
    newNot.createdTime=Date.now();
    newNot.readed=false;
    Notification.create(newNot);

}

async function updateAlarmCounter(emqxRuleId){
    try {
        await AlarmRule.updateOne({emqxRuleId:emqxRuleId},{$inc:{counter:1}});       
    } catch (error) {
        console.log(error);
    }
}

async function getNotifications(userId){
    try {
        const res = await Notification.find({userId: userId, readed:false});
        return res;
    } catch (error) {
        return false;        
    }
}
// Type auth: 'user', 'device', 'superuser'
async function createMqttAuth(dId,userId){
    try {
        var rule = await EmqxAuthRule.find({type: "device", userId: userId, dId: dId});
        if(rule.length == 0){
            const newRule = {
                userId: userId,
                dId: dId,
                username: createId(10),
                password: createId(10),
                publish: [userId+"/"+dId+"/+/sdata"],     
                subscribe: [userId+"/"+dId+"/+/actdata"],
                type: "device",
                createdTime: Date.now(),
                updatedTime: Date.now()
            }
            const result = await EmqxAuthRule.create(newRule);
            const response = {
                username: result.username,
                password: result.password
            }
            console.log("Respuesta funcion create->"+response.username);
            console.log("Respuesta funcion create->"+response.password);
            return response;
        }
        const newUserName = createId(10);
        const newPassword = createId(10);
        const result = await EmqxAuthRule.updateOne({type: "device",dId: dId},
        {$set: {username: newUserName, password: newPassword, updatedTime: Date.now()}}
        );  // result { n:1 , nModified:1, ok:1}  (modificó un registro)
        if(result.n == 1 && result.ok == 1){
            const response = {
                username: newUserName,
                password: newPassword
            };
            console.log("Respuesta funcion update->"+response.username);
            console.log("Respuesta funcion update->"+response.password);
            return response;
        } else {
            return false
        }        
    } catch (error) {
        console.log(error);
        return false;
    }
} 
function createId(length){
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefeghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0;i < length; i++){
        result += characters.charAt(Math.floor(Math.random()*charactersLength));
    }
    return result;
}
module.exports = router;