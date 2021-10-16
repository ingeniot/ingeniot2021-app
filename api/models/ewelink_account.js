import mongoose from 'mongoose';
const uniqueValidator =  require('mongoose-unique-validator');
const Schema = mongoose.Schema;

const ewelinkAccountSchema = new Schema({
    userId: {type: String, required: [true]},
    user: {type: String, required: [true]},
    password: {type: String, required: [true]},
    region: {type: String, required: [true]},
    createdTime: {type: Number}
})

//Validator
ewelinkAccountSchema.plugin(uniqueValidator,{message:"Error, account already exists."});

//Schema to model
const EwelinkAccount = mongoose.model('EwelinkAccount',ewelinkAccountSchema);

export default EwelinkAccount;