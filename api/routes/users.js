//requires
const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const {checkAuth} = require('../middlewares/authentication.js');

//models import
import User from '../models/user.js';
import EmqxAuthRule from '../models/emqx_auth.js';

/********************
 *                  *
        API             
 *                  *
 ********************/ 
router.get('/new-user',async(req,res)=>{
    try {
        const user = await User.create({
            name: "Carlos",
            email: "b@b.com",
            password: "121212",
        });
        res.json({"status": "success"})  
    } catch (error) {
        res.json({"status": "error"}) 
    }

});
//GET ->req.query
//POST ->req.body
//AUTH
//Register
router.post("/register",async(req,res)=>{
    try {
        const name = req.body.name;
        const email = req.body.email;
        const password = req.body.password;
        console.log("password=>"+password);
        const encryptedPassword = bcrypt.hashSync(password, 10);
        console.log("Encrypted password=>"+ encryptedPassword);
        const newUser = {
            name: name,
            email: email,
            password:encryptedPassword
        }    
        const user = await User.create(newUser);
        console.log(user);
        const toSend = {
            status:"success"
        }
        res.json(toSend);
    } catch (error) {
        console.log("error register endpoint"+error);
        const toSend = {
            status:"error",
            error: error
        };
        res.status(500).json(toSend);
    }

});
//Login
router.post("/login", async(req,res)=>{
    const email = req.body.email;
    const password = req.body.password;
    const encryptedPassword = bcrypt.hashSync(password, 10);
    var user = await User.findOne({email: email});
    if (!user) {
        const toSend = {
            status:"error",
            error:"invalid credentials"
        };    
        return res.status(401).json(toSend);  
    }
    if (bcrypt.compareSync(password, user.password)){
        user.set('password',undefined,{strict: false});
        const token = jwt.sign({userData:user},'securePasswordHere', {expiresIn: 60*60*24*30});
        const response = {
            status:"success",
            token:token,
            userData:user
            }
             return res.json(response);
        }
    else{
        const response = {       
        status:"error",
        error:"Invalid credentials"
        };
        res.status(401).json(response);   
    }
    console.log(user);
});


//Create MQTT credentials
router.post("/mqttauth", checkAuth, async(req,res)=>{
    try {
        const userId = req.userData._id;
        const mqttAuth = await createMqttAuth(userId);
        const response = {
            status: "success",
            username: mqttAuth.username,
            password: mqttAuth.password
        }
        console.log("Respuesta API MQTT->"+response);
        res.json(response);
        setTimeout(()=>{
            createMqttAuth(userId);
        },5000);
    } catch (error) {
    console.log(error);
    const response = {
        status: "error"        
        };
    return res.status(500).json(response);
    };
});
//Get MQTT credentials for reconnect
router.post("/mqttauthget", checkAuth, async(req,res)=>{
    try {
        const userId = req.userData._id;
        const mqttAuth = await getMqttAuth(userId);
        const response = {
            status: "success",
            username: mqttAuth.username,
            password: mqttAuth.password
        }
        console.log("Respuesta API MQTT reconnect->"+response);
        res.json(response);
        setTimeout(()=>{
            createMqttAuth(userId);    //Renueva las credenciales para que evitar que se conecte otro usuario
        },15000);
    } catch (error) {
    console.log(error);
    const response = {
        status: "error"        
        };
    return res.status(500).json(response);
    }

});
//CRUD
//Create
router.post("/user",(req,res)=>{

});
//Read
router.get("/user",(req,res)=>{   

});
//Update
router.put("/user",(req,res)=>{

});
//Delete
router.delete("/user",(req,res)=>{

});

/********************
 *                  *
        Functions             
 *                  *
 ********************/ 
// Type auth: 'user', 'device', 'superuser'
async function createMqttAuth(userId){
    try {
        var rule = await EmqxAuthRule.find({type: "user", userId: userId});
        if(rule.length == 0){
            const newRule = {
                userId: userId,
                username: createId(10),
                password: createId(10),
                publish: [userId+"/#"],     //publish: [userId+"/#", userId+"/#/xxx"],
                subscribe: [userId+"/#"],
                type: "user",
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
        const result = await EmqxAuthRule.updateOne({type: "user",userId: userId},
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
async function getMqttAuth(userId){
    try {
        var result = await EmqxAuthRule.find({type: "user", userId: userId});
        if(result.length == 1){
            const response = {
                username: result[0].username,
                password: result[0].password
            }
            console.log("Respuesta funcion create->"+response.username);
            console.log("Respuesta funcion create->"+response.password);
            return response;
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
