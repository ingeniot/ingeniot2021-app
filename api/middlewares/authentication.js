const jwt = require('jsonwebtoken');


let checkAuth = (req,res,next)=>{
    let token = req.get('token');   //Toma el token del header del mensaje  
    jwt.verify(token,"securePasswordHere",(err,decoded)=>{
        if(err){
            const toSend={
                status:"error",
                error: err
            }
            return res.status(401).json(toSend)
        }
        req.userData = decoded.userData;
        next();
    })
};

module.exports = {checkAuth};