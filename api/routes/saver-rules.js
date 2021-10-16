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

  import SaverRule from '../models/emqx_saver_rule.js'

//Update
router.put("/saver-rule",checkAuth, async(req,res)=>{
    const saverRule = req.body.saverRule;

    console.log("/n /n saverRule recibido en API");
    console.log(saverRule);
    await updateSaverRuleStatus(saverRule.emqxRuleId, saverRule.status);

    const response = {
        status:"success"
        };
        res.json(response);  
    });

async function updateSaverRuleStatus(emqxRuleId, status){
    try {
        const url = "http://localhost:8085/api/v4/rules/" + emqxRuleId;  
        const newRule = {
            enabled: status
        } 
        
        const res = await axios.put(url, newRule, auth);
    
        if (res.status === 200 && res.data.data){
            await SaverRule.updateOne({emqxRuleId: emqxRuleId}, {status: status});
            console.log("saver rule status updated".green);
            return true;
        }
        else{        
            console.log("saver rule status error".red); 
            return false;   
        }        
    } catch (error) {
        console.log(error.red);         
        return false;
    }

    
}

module.exports = router;