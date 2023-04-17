const mongoose = require('mongoose');


let mongolink = "mongodb+srv://rkbandla117:DlvwRuGI2mND2gxV@cluster0.g9ngeel.mongodb.net/test";

const Locations = mongoose.Schema({
    item_Id: { type: String },
    location: { type: String },
    clickNum: { type: String },
}, { collection: "locations" }
)

const Tasks = mongoose.Schema({

        username: String,
        userId:String,
        tasks: [
          {
            taskId: String,
            title: String,
            date: Date,
            description: String,
            status: String
          }
        
        ]
            
},{ collection: "Tasks" })

let dbcon = {};

dbcon.ItemDb = async () => {
    try {
        let con = await mongoose.connect(mongolink, { useNewUrlParser: true, useUnifiedTopology: true })
        let coll = await con.model('locations', Locations);
        return coll;
    }
    catch (rr) {
        throw rr;
    }
}

dbcon.TasksDb = async () => {
    try {
        let con = await mongoose.connect(mongolink, { useNewUrlParser: true, useUnifiedTopology: true })
        let coll = await con.model('Tasks', Tasks);
        return coll;
    }
    catch (rr) {
        throw rr;
    }
}

module.exports = dbcon;