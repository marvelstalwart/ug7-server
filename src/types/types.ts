export interface ISong {

    name: string
    preview_url: string
    album?: {}
    artists: []
    duration_ms: number
    uri: string


}
export interface TDailySong extends ISong {
    totalSaves: number
}
