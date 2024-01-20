"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpGetDailySongs = exports.HttpRetrieveRandomSongs = exports.HttpUploadSongsFromPlaylist = void 0;
const songs_mongo_1 = require("./songs.mongo");
const HttpUploadSongsFromPlaylist = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const songs = req.body;
    try {
        if (songs) {
            // Clear out DB
            // await deleteAllSongs()
            // Reupload new entries
            const promises = songs.map((song) => __awaiter(void 0, void 0, void 0, function* () { return yield (0, songs_mongo_1.addSong)(song); }));
            yield Promise.all(promises);
            return res.status(200).json(" Successfully uploaded songs!");
        }
    }
    catch (err) {
        return res.status(400).json({ message: "An error occured while uploading songs", error: err });
    }
});
exports.HttpUploadSongsFromPlaylist = HttpUploadSongsFromPlaylist;
const HttpRetrieveRandomSongs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const songs = yield (0, songs_mongo_1.retrieveRandomSongs)();
        res.status(200).json({ message: "Success", data: songs });
    }
    catch (err) {
        return res.status(400).json({ message: "An error occured while uploading songs", error: err });
    }
});
exports.HttpRetrieveRandomSongs = HttpRetrieveRandomSongs;
const HttpGetDailySongs = (_, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let dailySongs = yield (0, songs_mongo_1.getDailySongs)();
        return res.status(200).json(dailySongs);
    }
    catch (err) {
        return res.status(400).json({ message: "An error occured while retrieving daily songs!", error: err });
    }
});
exports.HttpGetDailySongs = HttpGetDailySongs;
