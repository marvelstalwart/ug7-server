"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = require("./config/config");
const songs_router_1 = __importDefault(require("./routes/songs.router"));
const router = (0, express_1.default)();
// Connect to Mongo
mongoose_1.default.connect(config_1.config.mongo.url, { w: 'majority', retryWrites: true })
    .then(() => {
    console.log("connected to DB");
})
    .catch((err) => {
    console.log("Unable to connect");
});
const startServer = () => {
    router.use((req, res, next) => {
        // lOG THE REQUEST
        console.log(`Incoming -> Method: [${req.method}] - Url: [${req.url}] - IP: [${req.socket.remoteAddress}]`);
        res.on('finish', () => {
            /** Log the response */
            console.log(`Incoming -> Method: [${req.method}] - Url: [${req.url}] - IP: [${req.socket.remoteAddress}] -Status: [${res.statusCode}]`);
        });
        next();
    });
    router.use(express_1.default.urlencoded({ extended: true }));
    router.use(express_1.default.json());
    // ** Rules of API*/
    router.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
        if (req.method == 'OPTIONS') {
            res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
            return res.status(200).json({});
        }
        next();
    });
    // ** Routes*/
    router.use("/ug7", songs_router_1.default);
    // **Healthcheck*/
    router.get('/ping', (req, res, next) => res.status(200).json({ message: 'pong' }));
    // ** Error handling*/
    router.use((req, res, next) => {
        console.error("Not found");
        return res.status(404).json({ message: "Not found" });
    });
    http_1.default.createServer(router).listen(config_1.config.server.port, () => console.log(`Server running on port ${config_1.config.server.port}`));
};
startServer();
