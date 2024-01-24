import mongoose from "mongoose";
import loadedsongsModel from "../models/loadedsongs.model";
import dailysongsModel from "../models/dailysongs.model";
import songModel from "../models/song.model";
import { ISong } from "../types/types";
import { IDailySongModel } from "../models/dailysongs.model";

// Upload new song from the playlist to the song collection
export async function addSong(song: ISong) {
            try {
                
                const newSong =  new songModel(song)

                       await newSong.save()
                     

            }
            catch(err) {
                throw new Error ("An error occured while adding songs!")
            }
}

export async function retrieveRandomSongs() {
    try {

        const res = await songModel.aggregate([
            {
                $lookup: {
                    from:'loadedsongs',
                    localField: 'name',
                    foreignField:'name',
                    as: 'loadedSongs'
                }
            
            },
            {
                $match: {
                    'loadedSongs': {$size: 0}
                }
            },
            // Eliminate duplicate by using the id field as a unique identifier
            {
                $group: {
                    _id: '$id',
                    data: {$first: '$$ROOT'}
                }
            },
            // Replace root document with original structure
            {$replaceRoot:{newRoot:'$data'}},

            {
                $sample: {size: 7}
            },
            {$limit: 7}
        ]);
        // Clear out all the songs in the daily songs collection
        await deleteDailySongs()
        // Add the new songs to the loadedSongs collection so that it does not get selected again
        // Also add these songs to the list of daily songs
       const promises =  res.map(async (song)=> {
            await addLoadedSong(song)
            await addDailySong(song)

        })
        
        await Promise.all(promises)
        return res

    }

    catch(err){
            console.error("An error occured while drawing 7 random songs" + err)
    }



}

// Add a new song to the loadedsongs collection
export async function addLoadedSong(song: any[]) {

    const newSong =  new loadedsongsModel(song)

    await newSong.save()


}

// Retrieve the daily songs 

export async function getDailySongs(): Promise<IDailySongModel[]|[] > {
    try {

        const dailySongs = await dailysongsModel.find()
        return  dailySongs
    }
    catch(err) {
        throw new Error ("An error occured while looking up daily songs!")
    }

}


// Add a new song to the daily songs collection

export async function addDailySong(song:any): Promise<IDailySongModel> {
        try {
        
                const newSong =  new dailysongsModel(song)
                return await newSong.save()
        }
        
        catch(err){
            throw new Error(" There was an error adding new song!")
        }


}

export async function deleteDailySongs(): Promise<any>{
    try {
      return  await dailysongsModel.deleteMany()

    }
    catch(err){
        throw new Error (
        "There was an error deleting daily songs !"
        )
    }
}

export async function updateDailySongs (id: string) : Promise<IDailySongModel | null> {
    try {
           const updatedDocument = await dailysongsModel.findByIdAndUpdate(id, {
               $inc: {totalSaves: 1}
            })
            if (!updatedDocument) {
                throw new Error("Document not found");
            }
            return updatedDocument
    }
    catch{
            throw new Error(
                "There was an error updating songs model"
            )
    }
}
export async function deleteAllSongs() {
    try {
        return await songModel.deleteMany()
    }
    catch(err){
        throw new Error (
            "There was an error deleting all songs"
        )
    }
}