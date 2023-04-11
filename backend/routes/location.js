const express = require('express');
const router = express.Router();
const locmodel = require('../models/Location');

const { v4: uuidv4 } = require("uuid")
/* GET users listing. */
router.get('/getData',async function(req, res, next) {
 try{

    let data = await locmodel.getLocations();
    res.json(data);

 }
 catch(e){
    res.json(e);
 }
});
router.post('/insertData',async function(req, res, next) {
    try{
        
        let obj={
            item_Id: uuidv4(),
            location: req.body.loc,
            clickNum: req.body.counter,
        }

       let data = await locmodel.insertData(obj);
       let newdata = await locmodel.getLocations();
       res.json(newdata);
   
    }
    catch(e){
       res.json(e);
    }
   });


module.exports = router;