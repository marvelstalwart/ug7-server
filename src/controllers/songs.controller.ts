import { Request, Response } from "express"
import { addSong, getDailySongs, retrieveRandomSongs, updateDailySongs } from "./songs.mongo"
import { deleteAllSongs } from "./songs.mongo"
import dailysongsModel, { IDailySongModel } from "../models/dailysongs.model"

export const HttpUploadSongsFromPlaylist= async  (req: Request,res: Response)=> {
    const songs = req.body
   
    try {
        if (songs) {

            // Clear out DB
            // await deleteAllSongs()
            // Reupload new entries
        const promises = songs.map(async (song: any)=> await addSong(song))
            await Promise.all(promises)
            return res.status(200).json(" Successfully uploaded songs!")

        }
    }
    catch(err) {
        return res.status(400).json({message: "An error occured while uploading songs", error: err})
    }



}

export const HttpRetrieveRandomSongs = async (req: Request, res: Response)=> {

    try {

        const songs = await retrieveRandomSongs()
      
            res.status(200).json({message:"Success", data: songs})

        

    }
    catch(err) {
        return res.status(400).json({message: "An error occured while uploading songs", error: err})
    }

}

export const HttpUpdateDailySongs = async (req: Request, res: Response) => {
            const {songIds} = req.body
            try {
                for (const songId of songIds) {
                        await updateDailySongs(songId)
                }

            }
            catch (err) {
                    res.status(400).json("An error occured while updating songs!")
            }

}

export const HttpGetDailySongs = async (_:Request,res: Response) :Promise<any>=>{
        try {
                let dailySongs = await getDailySongs()
                return res.status(200).json(dailySongs)
        }
        catch(err){
            return res.status(400).json({message: "An error occured while retrieving daily songs!", error: err})
        }
}

