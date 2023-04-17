const connection = require('../db');
const { v4: uuidv4 } = require("uuid")
let taskOperations = {};

// create new task for user
taskOperations.insertNewTask = async (username, task) => {
    try {

        let taskModel = await connection.TasksDb();
        const user = await taskModel.findOne({ username: username });
        if(user){
        let isInserted = await taskModel.updateOne(
            { username: username },
            {
                $push: {
                    tasks: {
                        taskId:  uuidv4(),
                        title: task.title,
                        date: task.date,
                        description: task.description,
                        status: task.status
                    }
                }
            }
        )
        let allTasks=await taskModel.find({username:username})
        return allTasks;
        }
        else{
            let err = new Error("No user exists with "+username);
            err.status=404;
            throw err;
        }
    }
    catch (error) {
        console.log(error);
        throw error;
    }
}

//delete a particular task for user
taskOperations.deleteTaskforUser = async (username, taskId) => {
    try {
        let taskModel = await connection.TasksDb();
        const user = await taskModel.findOne({ username: username });
        if (user) {
            await taskModel.updateOne(
                { username: username },
                { $pull: { tasks: { taskId: taskId } } }
            );
        }
        let remainingTasks = await taskModel.find({username:username});

        return remainingTasks;
    }
    catch (error) {
        console.log(error);
        throw error
    }
}

//update a particular task for a user
taskOperations.updateTheTask = async(username,task)=>{
    try {
        let taskModel = await connection.TasksDb();
        const user = await taskModel.findOne({ username: username });
        if(user){
            await taskModel.updateOne({
                username:username,"tasks.taskId":task.taskId
            },{
                $set:{
                    "tasks.$.title":task.title,
                    "tasks.$.description":task.description,
                    "tasks.$.date":task.date,
                    "tasks.$.status":task.status,
                }
            }
            )
        }
        let remainingTasks = await taskModel.find({username:username});

        return remainingTasks;

    } catch (error) {
        console.log(error);
        throw error;
    }
}
// get tasks of a particular user
taskOperations.getUserTasks = async(username)=>{
    try {
        let taskModel = await connection.TasksDb();
        let user = await taskModel.findOne({username:username});
        if(user){
            let tasks = user.tasks;
            return tasks;
        }
        else{
            let err= new Error("No user found");
            err.status=404;
            throw err;
        }

    } catch (error) {
        console.log(error);
        throw error;
    }
}

//create new user with unique check and empty tasks
taskOperations.createNewUser = async(username)=>{
    try {
        let taskModel = await connection.TasksDb();
        let user = await taskModel.findOne({username:username});
        if(user){
            let err = new Error("User Already exists");
            err.status=409;
            throw  err;
        }
        else{
            let isCreated = await taskModel.create({
                userId: uuidv4(),
                username:username,
                tasks:[]
            })
            return isCreated;
        }

        
    } catch (error) {
        console.log(error);
        throw error;
    }
}

module.exports = taskOperations;