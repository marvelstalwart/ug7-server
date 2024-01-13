import express from "express"
const songsRouter = express.Router()
import {HttpUploadSongsFromPlaylist, HttpRetrieveRandomSongs, HttpGetDailySongs } from "../controllers/songs.controller"

songsRouter.route("/").get(HttpGetDailySongs).post(HttpUploadSongsFromPlaylist)
songsRouter.get('/randomsongs', HttpRetrieveRandomSongs)
export default songsRouter 