import mongoose, {Schema} from "mongoose";
import { ISong } from "../types/types";

export interface ISongModel extends ISong, Document{}


const dailySongsSchema = new Schema ({
    name: {type: String,  required: true},
    album: {type: Object, required: true},
    artists: {type: Array, },
    duration_ms: {type: Number},
    id: {type: String},
    preview_url: {type: String, required: true},
    uri: {type: String, required: true}

})

export default mongoose.model<ISongModel>('dailysongs', dailySongsSchema)