export declare enum SongSource {
    Bandcamp = "bandcamp",
    Youtube = "youtube"
}
export interface Song {
    source: SongSource;
    artistName: string;
    albumName: string;
    songName: string;
    songNumber: number;
    albumUrl: string;
    timestamp?: number;
}
//# sourceMappingURL=index.d.ts.map