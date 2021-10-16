import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const dataSchema = new Schema({
    userId: {type: String, required: [true]},
    dId: {type: String, required: [true]},
    variable: {type: String, required: [true]},
    value: {type: Number, required: [true], default: false},
    createdTime: {type: Number}
})


//Schema to model
const Data = mongoose.model('Data',dataSchema);

export default Data;