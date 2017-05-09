var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var DistrictSchema=new Schema({
    name:String,
    creTime:{
        type:Date,
        default:Date.now
    }
});

var CitySchema=new Schema({
    name: String,
    districts:[DistrictSchema],
    creTime:{
        type:Date,
        default:Date.now
    }
});

module.exports= mongoose.model('City',CitySchema);