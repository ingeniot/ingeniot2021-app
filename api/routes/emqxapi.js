//requires

const express = require("express");
const router = express.Router();
const axios = require("axios");
const colors = require("colors");

const auth = {
    auth: {
        username: 'admin',
        password: process.env.EMQX_MANAGEMENT_DEFAULT_APPLICATION_SECRET
    }
};

global.saverResource = null;
global.alarmResource = null;


/********************
 *                  *
 *       Models     *    
 *                  *
 ********************/     

import EmqxAuthRule from '../models/emqx_auth.js'

/**************************************
* EMQX RESOURCES MANAGER
* https://docs.emqx.io/en/broker/v4.1/advanced/http-api.html#response-code
**************************************/
setTimeout(()=>{
    console.log("LISTING RESOURCES!!!!!");
    listResources();
}, process.env.EMQX_RESOURCES_DELAY);

async function listResources(){
    try {
        const url = "http://" + process.env.EMQX_HOST + ":8085/api/v4/resources";
   
        const res = await axios.get (url, auth);
        if(res.status === 200){
            const resourcesNumber = res.data.data.length;
            console.log(resourcesNumber);  //el primer objeto data lo arma axios y a su vez emqx arma un objeto data
            if(!resourcesNumber){
                console.log("Creating EMQX webhooks resources".green);
                createResources();
            } else if (resourcesNumber == 2){
                res.data.data.forEach(resource => {
                    if(resource.description == "alarm webhook"){
                        global.alarmResource = resource;
                        console.log("********************");
                        console.log("ALARM RESOURCE FOUND");
                        console.log("********************");
                        console.log(global.alarmResource);                
                        console.log("\n");
                        console.log("\n");
                    }
                    if(resource.description == "saver webhook"){
                        global.saverResource = resource;
                        console.log("********************");
                        console.log("SAVER RESOURCE FOUND");
                        console.log("********************");                
                        console.log(global.saverResource);                
                        console.log("\n");
                        console.log("\n");                
                    }
                });
            }
            else{
                function printWarning(){
                    console.log("DELETE ALL WEBHOOKS EMQX RESOURCES AND RESTARTNODE - youremqxdomain:8085/#/resources".red);
                    setTimeout(()=>{
                        printWarning();
                    },1000);
                }
                printWarning();
            }
    
        }
        else{
            console.log("EMQX API error");
        }        
    } catch (error) {
        console.log("Error listing resources");
        console.log(error);
    }
 
}

async function createResources(){
    try {
        const url = "http://" + process.env.EMQX_HOST + ":8085/api/v4/resources";
        const data1 = {
            "type": "web_hook",
            "config": {
                "url": "http://" + process.env.API_HOST + ":3001/api/saver-webhook",
                "headers": {"token":process.env.EMQX_API_TOKEN},
                "method": "POST"
            },
            "description": "saver webhook"
        }
        const data2 = {
            "type": "web_hook",
            "config": {
                "url": "http://" + process.env.API_HOST + ":3001/api/alarm-webhook",
                "headers": {"token":process.env.EMQX_API_TOKEN},
                "method": "POST"
            },
            "description": "alarm webhook"
        }
        const res1 = await axios.post(url, data1, auth);
        if(res1.status === 200){
            console.log("Saver resource crated!".green);
        }
        const res2 = await axios.post(url, data2, auth);
        if(res2.status === 200){
            console.log("Alarm resource crated!".green);
        }
        setTimeout(()=>{
            console.log("EMQX resources created!".green);
            listResources();
        }, process.env.EMQX_RESOURCES_DELAY)        
    } catch (error) {
        console.log("Error creating resources");
        console.log(error);
    }

}

//Create superuser in mongo if not exist
global.checkMqttSuperuser = async function checkMqttSuperuser(){
   try {
       const superUser = await EmqxAuthRule.find({type:"superuser"});
       if(superUser.length > 0){
           return;
       }
       else if(superUser.length == 0){
            await EmqxAuthRule.create(
                {
                    publish: ["#"],
                    subscribe: ["#"],
                    userId: "superuser",
                    username: "superuser",
                    password: "superuser",
                    type: "superuser",
                    createdTime: Date.now(),
                    updatedTime: Date.now()
                }
            );
            console.log("superuser created");
       }
   } catch (error) {
        console.log("Superuser created error: " + error);
   } 
}
module.exports = router;