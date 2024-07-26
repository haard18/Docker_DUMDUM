const mongoose = require('mongoose');
const {Schema}=require('mongoose');
const deployement=new Schema({
    projectName:String,
    githubUrl:String,
    installCommand:String,
    buildCommand:String,
    outputFolder:String,
    wallet:String,
    antProcessId:String
})
const Deployement=mongoose.model('Deployement',deployement);
module.exports=Deployement;