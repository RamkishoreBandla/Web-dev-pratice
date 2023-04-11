
const dbmodel = require('../db');
let locationOps={}
locationOps.getLocations = async()=>{

    let entity = await dbmodel.ItemDb();
    let data = await entity.find();
    return data;
}

locationOps.insertData = async(obj)=>{

let entity = await dbmodel.ItemDb();
let insert = await entity.create(obj);

}


module.exports=locationOps;