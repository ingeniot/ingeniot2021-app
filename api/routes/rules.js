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
  Models          
 *                  *
 ********************/     

import AlarmRule from '../models/emqx_alarm_rule.js'

/********************
 *                  *
 Endpoints          
 *                  *
 ********************/    
// https://docs.emqx.io/en/broker/v4.1/advanced/http-api.html#response-code

router.post('/rule', checkAuth, async(req,res)=>{
    var newRule = req.body.newRule;
    newRule.userId = req.userData._id;
    var result = await createRule(newRule);
    if(result){
        const response = {
            status: "success"
    }
    return res.json(response);
    }
    else{
        const response = {
            status: "error"
    }      
    return res.status(500).json(response);
    }
});

router.put('/rule',checkAuth, async(req,res)=>{
    var rule = req.body.rule;
    console.log(rule.status);
    var result = await updateRuleStatus(rule.emqxRuleId,rule.status);
    if(result){
        const response = {
            status:"success"
        };
        return res.json(response);
    } else {
        const response = {
            status:"error"
        };
        return res.json(response);        
    }

});

router.delete('/rule',checkAuth, async (req,res)=>{
    var emqxRuleId = req.query.emqxRuleId;
    console.log(emqxRuleId);
    var result = deleteRule(emqxRuleId);
    if (result){
        const response = {
            status : "success"
        };
    return res.json(response);
    } else{
        const response = {
            status : "error"
        };
        return res.json(response);
    }
})


/********************
 *                  *
      Functions         
 *                  *
 ********************/   
async function createRule(rule){
    const url= "http://localhost:8085/api/v4/rules";
    const topic = rule.userId + "/" + rule.dId + "/" + rule.variable + "/sdata";
    const rawsql = "SELECT username, topic, payload FROM \"" + topic + "\" WHERE payload.value" 
    + rule.condition + " " + rule.value + " AND is_not_null(payload.value)";
    var newRule = {
        rawsql: rawsql,
        actions: [{
            name: "data_to_webserver",
            params: {
                $resource: global.alarmResource.id,
                payload_tmpl: '{"userId":"' + rule.userId + '","payload":${payload},"topic":"${topic}"}'
            }
        }],
        description: "ALARM-RULE",
        enabled: rule.status 
        }
    const res = await axios.post(url, newRule, auth);

    var emqxRuleId = res.data.data.id;
    console.log(emqxRuleId);
    if(res.data.data && res.status === 200){
        console.log("status ok. Crear regla en base de datos");
        //console.log(res.data.data);
        const mongoRule = await AlarmRule.create({
            userId: rule.userId,
            dId: rule.dId,
            emqxRuleId: emqxRuleId,
            status: rule.status,
            variable: rule.variale,
            variableFullName: rule.variableFullName,
            value: rule.value,
            condition: rule.condition,
            triggerTime: rule.triggerTime,
            createdTime: Date.now()
        });
        console.log("mongoRule"+mongoRule);
        console.log("Creó regla en base de datos");
        
        const url = "http://localhost:8085/api/v4/rules/"+ mongoRule.emqxRuleId;
        const payload_tmpl = '{"userId":"' + rule.userId + '","dId":"' + rule.dId + 
        '","deviceName":"' + rule.deviceName + '","payload":${payload},"topic":"${topic}","emqxRuleId":"' + 
        mongoRule.emqxRuleId + '","value":' + rule.value + ',"condition":"' + rule.condition + 
        '","variable":"' + rule.variable + '","variableFullName":"' + rule.variableFullName + 
        '","triggerTime":' + rule.triggerTime + '}';
        newRule.actions[0].params.payload_tmpl = payload_tmpl;

        const res = await axios.put(url, newRule, auth);
        console.log("New alarm rule create".green);
        return true
    }
}

async function updateRuleStatus(emqxRuleId, status){
    const url = "http://localhost:8085/api/v4/rules/"+emqxRuleId;
    const newRule = {
        enabled: status
    }
    const res = await axios.put(url, newRule, auth);
    if(res.data.data && res.status === 200){
        await AlarmRule.updateOne({emqxRuleId: emqxRuleId}, {status: status});
        console.log("Alarm rule status updated");
        return true;
    }
}

async function deleteRule(emqxRuleId){
    try {
        const url =  "http://localhost:8085/api/v4/rules/"+emqxRuleId;
        const emqxRule = await axios.delete(url, auth);
        console.log("pudo borrar regla=>"+emqxRule);
        const deleted = await AlarmRule.deleteOne({emqxRuleId:emqxRuleId});
        return true;
    } catch (error) {
        console.log(error)
        return false;       
    }

}


  module.exports = router;