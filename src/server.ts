import express from "express";
import http from "http";
import mongoose from "mongoose"
import { config } from "./config/config";
import songsRouter from "./routes/songs.router";
import { error } from "console";
const router = express()
// Connect to Mongo

mongoose.connect(config.mongo.url, {w: 'majority', retryWrites:true })
.then(()=> {
   console.log("connected to DB")
})
.catch((err)=> {
   console.log("Unable to connect")
})

const startServer = ()=> {
    router.use((req, res, next)=> {

// lOG THE REQUEST
console.log(`Incoming -> Method: [${req.method}] - Url: [${req.url}] - IP: [${req.socket.remoteAddress}]`);
  
        res.on('finish',()=> {
            /** Log the response */
            console.log(`Incoming -> Method: [${req.method}] - Url: [${req.url}] - IP: [${req.socket.remoteAddress}] -Status: [${res.statusCode}]`);
  
        })
        next()
})

router.use(express.urlencoded({extended: true}))  

router.use(express.json())

// ** Rules of API*/
router.use((req,res,next)=> {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method == 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({})
    }

    next()
})

// ** Routes*/
router.use("/ug7",songsRouter)
// **Healthcheck*/
router.get('/ping', (req,res,next)=> res.status(200).json({message:'pong'}))

// ** Error handling*/
router.use((req, res, next)=> {
    console.error("Not found")

    return res.status(404).json({message: "Not found"})
})


http.createServer(router).listen(config.server.port,()=> console.log(`Server running on port ${config.server.port}`))
}


startServer()
