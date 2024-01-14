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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteDailySongs = exports.addDailySong = exports.getDailySongs = exports.addLoadedSong = exports.retrieveRandomSongs = exports.addSong = void 0;
const loadedsongs_model_1 = __importDefault(require("../models/loadedsongs.model"));
const dailysongs_model_1 = __importDefault(require("../models/dailysongs.model"));
const song_model_1 = __importDefault(require("../models/song.model"));
// Upload new song from the playlist to the song collection
function addSong(song) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const newSong = new song_model_1.default(song);
            yield newSong.save();
        }
        catch (err) {
            console.error(err);
        }
    });
}
exports.addSong = addSong;
function retrieveRandomSongs() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const res = yield song_model_1.default.aggregate([
                {
                    $lookup: {
                        from: 'loadedsongs',
                        localField: 'name',
                        foreignField: 'name',
                        as: 'loadedSongs'
                    }
                },
                {
                    $match: {
                        'loadedSongs': { $size: 0 }
                    }
                },
                // Eliminate duplicate by using the id field as a unique identifier
                {
                    $group: {
                        _id: '$id',
                        data: { $first: '$$ROOT' }
                    }
                },
                // Replace root document with original structure
                { $replaceRoot: { newRoot: '$data' } },
                {
                    $sample: { size: 7 }
                },
                { $limit: 7 }
            ]);
            // Clear out all the songs in the daily songs collection
            yield deleteDailySongs();
            // Add the new songs to the loadedSongs collection so that it does not get selected again
            // Also add these songs to the list of daily songs
            const promises = res.map((song) => __awaiter(this, void 0, void 0, function* () {
                yield addLoadedSong(song);
                yield addDailySong(song);
            }));
            yield Promise.all(promises);
            return res;
        }
        catch (err) {
            console.error("An error occured while drawing 7 random songs" + err);
        }
    });
}
exports.retrieveRandomSongs = retrieveRandomSongs;
// Add a new song to the loadedsongs collection
function addLoadedSong(song) {
    return __awaiter(this, void 0, void 0, function* () {
        const newSong = new loadedsongs_model_1.default(song);
        yield newSong.save();
    });
}
exports.addLoadedSong = addLoadedSong;
// Retrieve the daily songs 
function getDailySongs() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const dailySongs = yield dailysongs_model_1.default.find();
            return dailySongs;
        }
        catch (err) {
            throw new Error("An error occured while looking up daily songs!");
        }
    });
}
exports.getDailySongs = getDailySongs;
// Add a new song to the daily songs collection
function addDailySong(song) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const newSong = new dailysongs_model_1.default(song);
            return yield newSong.save();
        }
        catch (err) {
            throw new Error(" There was an error adding new song!");
        }
    });
}
exports.addDailySong = addDailySong;
function deleteDailySongs() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield dailysongs_model_1.default.deleteMany();
        }
        catch (err) {
            throw new Error("There was an error deleting all songs !");
        }
    });
}
exports.deleteDailySongs = deleteDailySongs;
