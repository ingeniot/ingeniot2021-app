//requires
const express = require("express");
const mongoose = require("mongoose") // gestiona la interacción con mongo
const morgan = require("morgan"); // midleware que muestra salida por cada petición al servidor
const cors = require("cors");   //Políticas de acceso a la API
const colors = require("colors"); // Salidas con identificación por colores

require('dotenv').config();

//instances
const app = express();

//express config
app.use(morgan("tiny"));  //Indica el modo de mensajes de salida tiny:reducidos
app.use(express.json()); //permite trabajar con json
app.use(express.urlencoded({    //permite pasar parametros por el url ?param1&param2...
    extended:true
}));
app.use(cors());

module.exports = app;

//express routes
app.use('/api',require('./routes/devices.js'));
app.use('/api',require('./routes/users.js'));
app.use('/api',require('./routes/dashboards.js'));
app.use('/api',require('./routes/webhooks.js'));
app.use('/api',require('./routes/emqxapi.js'));
app.use('/api',require('./routes/saver-rules.js'));
app.use('/api',require('./routes/rules.js'));
app.use('/api',require('./routes/dataprovider.js'));
app.use('/api',require('./routes/ewelink.js'));
//listener

app.listen(process.env.API_PORT, () => {
    console.log("API server listening in port " + process.env.API_PORT);
});

//listener para redireccionamiento de ingreso no seguro a seguro
if(process.env.enviromment != "dev"){
    const app2 = express();
    app2.listen(3002, function(){
        console.log("listening on port 3002(for redirect to ssl)");
    });
    app2.all('*', function(req,res){
        console.log("No SSL access....Redirecting");
        return res.redirect("https://" + req.headers["host"] + req.url);
    });
}

//endpoints
/*
app.get("/api", (req, res) => {
    console.log("Hello API 2");
    res.send("Hello IOT API 2");

});*/

//mongo conection
const mongoUserName = process.env.MONGO_USERNAME;
const mongoPassword = process.env.MONGO_PASSWORD;
const mongoHost = process.env.MONGO_HOST;
const mongoPort = process.env.MONGO_PORT;
const mongoDatabase = process.env.MONGO_DATABASE;

var uri = "mongodb://" + mongoUserName + ":" + mongoPassword + "@" + mongoHost + ":" + mongoPort + "/" + mongoDatabase;

const options = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    authSource: "admin",
};
        console.log("*Connecting  Mongo....".yellow);
        mongoose.connect(uri,options).then(()=>{
        console.log("\n");
        console.log("******************************".green);
        console.log("* Mongo sucesfully connected!*".green);
        console.log("******************************".green);
        console.log("\n");
        global.checkMqttSuperuser();
    },(err)=>{
        console.log("\n");
        console.log("******************************".red);
        console.log("* Mongo Connection Failed!*".red);
        console.log("******************************".red);
        console.log("\n");    
        console.log(error);
    }
    );

