import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const dashboardSchema = new Schema({
    userId: {type: String, required: [true]},
    name: {type: String, required:[true]},
    description: {type: String},
    createdTime: {type: Number, required: [true]},
    widgets: {type: Array, default: []}
})

const Dashboard  = mongoose.model('Dashboard',dashboardSchema);

export default Dashboard;