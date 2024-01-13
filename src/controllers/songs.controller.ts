import { Request, Response } from "express"
import { addSong, getDailySongs, retrieveRandomSongs } from "./songs.mongo"
import dailysongsModel, { ISongModel } from "../models/dailysongs.model"

export const HttpUploadSongsFromPlaylist= async  (req: Request,res: Response)=> {
    const songs = req.body
   
    try {
        if (songs) {

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



export const HttpGetDailySongs = async (_:Request,res: Response) :Promise<any>=>{
        try {
                let dailySongs = await getDailySongs()
                return res.status(200).json(dailySongs)
        }
        catch(err){
            return res.status(400).json({message: "An error occured while retrieving daily songs!", error: err})
        }
}

