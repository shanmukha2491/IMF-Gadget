import http from "http";
import app from "./app.js";
import "dotenv/config"
import express from "express"
import pool from "./db/connectDB.js";

const server = http.createServer(app)

const PORT = process.env.PORT || 3000;
pool.connect().then(()=>{
    console.log(`Connected to Database`);
})
server.listen(PORT, ()=>{
    console.log(`Server connected to PORT: ${PORT}`);
})