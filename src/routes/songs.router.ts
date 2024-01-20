import express from "express"
const songsRouter = express.Router()
import {HttpUploadSongsFromPlaylist, HttpRetrieveRandomSongs, HttpGetDailySongs, HttpUpdateDailySongs } from "../controllers/songs.controller"

songsRouter.route("/").get(HttpGetDailySongs).post(HttpUploadSongsFromPlaylist)
songsRouter.post("/update", HttpUpdateDailySongs)
songsRouter.get('/randomsongs', HttpRetrieveRandomSongs)
export default songsRouter 