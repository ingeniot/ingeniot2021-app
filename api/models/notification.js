import mongoose from 'mongoose';
const uniqueValidator = require ('mongoose-unique-validator');

const Schema = mongoose.Schema;

const notificationSchema = new Schema({
    userId: {type:String, required: [true]},
    dId: {type: String, required: [true]},
    deviceName: {type: String, required: [true]},    
    payload: {type: Object},
    emqxRuleId: {type: String, required: [true]},
    topic: {type: String, required: [true]},
    value: {type: String, required: [true]},
    condition: {type: String, required: [true]},
    variable: {type: String, required: [true]},
    variableFullName: {type: String, required: [true]},   
    readed: {type: Boolean, required: [true]},   
    createdTime: {type: Number, required: [true]}
});

// Convert to model
const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;