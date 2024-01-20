import mongoose, {Schema} from "mongoose";
import { TDailySong } from "../types/types";

export interface IDailySongModel extends TDailySong, Document{}


const dailySongsSchema = new Schema ({
    name: {type: String,  required: true},
    album: {type: Object, required: true},
    artists: {type: Array, },
    duration_ms: {type: Number},
    id: {type: String},
    preview_url: {type: String, required: true},
    uri: {type: String, required: true},
    totalSaves: {type: Number, required: true, default: 0}

}) 

export default mongoose.model<IDailySongModel>('dailysongs', dailySongsSchema)