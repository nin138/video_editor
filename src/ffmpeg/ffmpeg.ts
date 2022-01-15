import {createFFmpeg, fetchFile, FFmpeg} from "@ffmpeg/ffmpeg";

export const getFFmpegFromUrl = async (url: string, fileName: string) => {
    const ffmpeg = createFFmpeg({
        log: true,
    });
    const file = await fetchFile(url);
    await ffmpeg.load();
    ffmpeg.FS("writeFile", fileName, file);
    return ffmpeg;
};

class FFmpegApi {
    private ffmpeg: FFmpeg = createFFmpeg({
        log: true,
    });

    init(): Promise<void> {
        return this.ffmpeg.load();
    }

    async writeFileFromURL(url: string, fileName: string) {
        const file = await fetchFile(url);
        this.ffmpeg.FS("writeFile", fileName, file);
    }


}

