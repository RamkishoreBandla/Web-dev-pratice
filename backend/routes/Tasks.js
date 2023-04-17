const taskModel = require('../models/Tasks');
const express = require('express');
const router = express.Router();

router.get("/getMyTasks/:username", async (req, res) => {
    try {
        let username = req.params.username
        let tasks = await taskModel.getUserTasks(username);
        res.json(tasks)
    }
    catch (err) {
        res.statusCode = err.status || 500;
        res.json(err.message || "Failed to fetch tasks");
    }
})

router.post("/createUser", async (req, res) => {
    try {
        let username = req.body.username;
        let newUser = await taskModel.createNewUser(username);
        res.json(newUser)
    }
    catch (err) {
        res.statusCode = err.status || 500;
        res.json(err.message || "Failed to create user");
    }
})

router.post("/createTask", async (req, res) => {
    try {
        let username = req.body.username;
        let tasksObj = req.body.task;
        let isInserted = await taskModel.insertNewTask(username, tasksObj);
        res.json(isInserted);
    }
    catch (err) {
        res.statusCode = err.status || 500;
        res.json(err.message || "Failed to create task");
    }
})

router.post("/updateTask", async (req, res) => {
    try {
        let username = req.body.username;
        let tasksObj = req.body.task;
        let isUpdated = await taskModel.updateTheTask(username, tasksObj);
        res.json(isUpdated);
    }
    catch (err) {
        res.statusCode = err.status || 500;
        res.json(err.message || "Failed to update task");
    }
})

router.post("/deleteTask", async (req, res) => {
    try {
        let username = req.body.username;
        let taskId = req.body.taskId;
        let remainingTasks = await taskModel.deleteTaskforUser(username,taskId);
        res.json(remainingTasks);
    }
    catch (err) {
        res.statusCode = err.status || 500;
        res.json(err.message || "Failed to update task");
    }
})

module.exports=router;