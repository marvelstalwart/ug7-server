import mongoose, {Schema, Document } from "mongoose";
import { ISong } from "../types/types";


interface ISongModel extends ISong, Document{}

const  songSchema: Schema = new Schema ({
    name: {type: String,  required: true},
    album: {type: Object, required: true},
    artists: {type: Array, },
    duration_ms: {type: Number},
    id: {type: String},
    preview_url: {type: String, required: true},
    uri: {type: String, required: true}

})

export default mongoose.model<ISongModel>('songs', songSchema )
