//requires
const express = require("express");
const router = express.Router();
const {checkAuth} = require('../middlewares/authentication.js');
const axios = require("axios");

const auth = {
    auth: {
        username: 'admin',
        password: process.env.EMQX_MANAGEMENT_DEFAULT_APPLICATION_SECRET
    }
};

/********************
 *                  *
 *       Models     *    
 *                  *
 ********************/     
import Device from '../models/device.js'
import SaverRule from '../models/emqx_saver_rule.js'
import Dashboard from '../models/dashboard.js'
import AlarmRule from '../models/emqx_alarm_rule.js'
import EmqxAuthRule from '../models/emqx_auth.js'

/********************
 *                  *
 *       API        *    
 *                  *
 ********************/ 
/*
        //endpoints
router.get("/devices", (req, res) => {
    console.log("Hello API 2");
    res.send("Hello IOT API form devices.js");

});*/

//Json test
/*
{
    "newDevice":{
        "userId":"aaaa",
        "dId":"12121212",
        "name":"home",
        "dashboardName":"esp32 dashboard",
        "dashboardId":"aaaa"
    }
} 
*/

//Create
router.post("/device",checkAuth,async(req,res)=>{
    try {
        const userId = req.userData._id;    
        var newDevice = req.body.newDevice;
        console.log(newDevice);
        newDevice.userId = userId;
        newDevice.createdTime = Date.now();
        newDevice.password = createId(10);

        await createSaverRule(userId, newDevice.dId, true);
        const device = await Device.create(newDevice);
        await selectDevice(userId, newDevice.dId)
        const response = {
            status:"success"
        }
        return res.json(response);  
    } catch (error) {
        console.log("Error creating new device" + error);
        const response = {
            status:"error",
            error: error
        }
        return res.status(500).json(response);

    }


});
//Read
router.get("/device", checkAuth, async(req,res)=>{ 
    try {
        console.log(req.userData);  
        const userId = req.userData._id; 

        var devices = await Device.find({userId: userId});  //devices no es  un arraoy de js, sino un array de mongoose
        /**/ 
        // newObject = Object.assign((),oldObject); //Alternativa mas formal de la linea siguiente
        devices = JSON.parse(JSON.stringify(devices));

        const saverRules = await getSaverRules(userId);
        const dashboards = await getDashboards(userId);        
        const alarmRules = await getAlarmRules(userId);
        //saver-rules, dashboards and alarms to device
        /*devices*/

        devices.forEach((device, index)=>{
            devices[index].saverRule = saverRules.filter(saverRule => saverRule.dId == device.dId)[0];
            devices[index].dashboard = dashboards.filter(dashboard => dashboard._id == device.dashboardId)[0];
            devices[index].alarmRules = alarmRules.filter(alarmRule => alarmRule.dId == device.dId);
        });
        /**/ 
        const response = {
            status:"success",
            data: devices
        };
        res.json(response);        
    } catch (error) {
        console.log("Error getting devices");
        const response = {
            status: "error",
            error: error
        }; 
    return res.status(500).json(response);
    }

});
//Update
router.put("/device",checkAuth, async (req,res)=>{
    const dId = req.body.dId;
    const userId = req.userData._id;
   
    console.log(dId);
    const deviceSelected = await selectDevice(userId,dId);
    if(deviceSelected){
        const response = {
            status:"success"
        };
        res.json(response);  
    }
    else{
        const response = {
            status: "error",
            error: error
        }; 
    return res.status(500).json(response);

    };

});
//Delete
router.delete("/device",checkAuth,async(req,res)=>{
    try {
        const userId = req.userData._id;
        const dId = req.query.dId;

        await deleteSaverRule(dId);
        
        await deleteAllAlarmRules(userId,dId);

        await deleteDeviceMqttAuth(dId);

        const result = await Device.deleteOne({userId: userId, dId: dId});

        const devices = await Device.find({userId: userId});
        if (devices.length >= 1){
            var found = false;
            devices.forEach(devices=>{
                if(devices.selected == true){
                    found = true;
                }
            });
            if(!found){
                await Device.updateOne({userId: userId, dId: devices[0].dId},{selected: true});
            }
        }

        const response = {
            status:"success",
            data: result
        };
        return res.json(response);        
    } catch (error) {
        console.log("Error deleting device");
        const response = {
            status: "error",
            error: error,
        }; 
        return res.status(500).json(response);       
    }


});

/********************
 *                  *
        Functions             
 *                  *
 ********************/ 
/*setTimeout(()=>{
    createSaverRule("121212","11111111",false);
},2000);*/
async function selectDevice(userId, dId){
    try {

        const result = await Device.updateMany({userId: userId},{selected: false});
        const result2 = await Device.updateOne({dId: dId, userId: userId},{selected: true}); 

        console.log(dId); 
        return true;
    } catch (error) {
        console.log("Error in selected device"+error);
        return false
    }

};

//Saver rules managment functions
async function createSaverRule(userId, dId, status){
    try {

    const url = "http://" + process.env.EMQX_HOST + ":8085/api/v4/rules";
    const topic = userId + "/" + dId + "/+/sdata";

    const rawsql = "SELECT topic, payload FROM \"" + topic + "\" WHERE payload.save = 1";
    var newRule = {
        rawsql: rawsql,
        actions: [
            {
                name:"data_to_webserver",
                params: {
                    $resource: global.saverResource.id,
                    payload_tmpl: '{"userId":"' + userId + '","payload":${payload},"topic":"${topic}"}'
                }
            }
        ],
        description: "SAVER-RULE",
        enabled: status
    };
    const res = await axios.post(url, newRule, auth);
    var emqxRuleId = res.data.data.id;
    if(res.status === 200 && res.data.data){
        console.log("status ok. Crear regla");
        console.log(res.data.data);

        await SaverRule.create({
            userId: userId,
            dId: dId,
            emqxRuleId: emqxRuleId,
            status: status
        });
        return true;
    } else{
        console.log("Call createSaverRule() fail");
        return false;
    }        
    } catch (error) {
        console.log("Error creating saver rule");
        console.log(error);   
        return false;   
    }
}

async function getSaverRules(userId){
    try {
        const rules = await SaverRule.find({userId:userId});
        return rules;
    } catch (error) {
        return false;
        
    }
}

async function getAlarmRules(userId){
    try {
        const rules = await AlarmRule.find({userId:userId});
        return rules;
    } catch (error) {
        return false;
        
    }
}

async function deleteSaverRule(dId){
    try {
        const mongoRule = await SaverRule.findOne({dId: dId});
        const url = "http://" + process.env.EMQX_HOST + ":8085/api/v4/rules/" + mongoRule.emqxRuleId;  
        const emqxRule = await axios.delete(url, auth);
        const deleted = await SaverRule.deleteOne({dId: dId});
        return true;           
    } catch (error) {
        console.log("Error deleting saver rule");
        console.log(error);   
        return false;             
    }
}

async function deleteAllAlarmRules(userId,dId){
    try {
        const rules = await AlarmRule.find( {userId: userId, dId: dId});   
        if(rules.length >= 0){
            asyncForEach(rules, async rule=>{
                const url = "http/" + process.env.EMQX_HOST + ":8085/api/v4/rules/" + rule.emqxRuleId;
                const result = await axios.delete(url,auth);
            }); 
            await AlarmRule.deleteMany({userId: userId, dId: dId});
        } 
        return true;
    }
    catch (error) {   
        console.log("error");
        return "error"
    }
}

async function asyncForEach(array, callback){
    for(let index = 0; index < array.length; index++){
        await callback(array[index], index, array);
    }
}

async function deleteDeviceMqttAuth(dId){
    try {
        await EmqxAuthRule.deleteMany({dId: dId, type: "device"});
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}

async function getDashboards(userId){
    try {
        const dashboards = await Dashboard.find({userId:userId});
        return dashboards;
    } catch (error) {
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
    result ='asdfg';
    return result;
}
module.exports = router;