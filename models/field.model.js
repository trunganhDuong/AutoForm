var mongoose=require('mongoose'),
var Schema=mongoose.Schema;

var FieldSchema=new Schema({
    name:String,
    creTime:{
        type: Date,
        default:Date.now
    },
    accId:{
        type:Schema.ObjectId,
        ref: 'Account'
    }
});
module.exports=new mongoose.model('Field',FieldSchema);