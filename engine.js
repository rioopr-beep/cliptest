const { createFFmpeg, fetchFile } = FFmpeg;
const ffmpeg = createFFmpeg({ log: true });

async function init() {
    const statusEl = document.getElementById('status');
    const btn = document.getElementById('btn-run');
    try {
        await ffmpeg.load();
        statusEl.innerText = "STATUS: ENGINE_READY";
        statusEl.classList.add('text-green-500');
        btn.disabled = false;
        btn.classList.replace('bg-zinc-800', 'bg-indigo-600');
        btn.classList.replace('text-zinc-500', 'text-white');
        btn.classList.remove('cursor-not-allowed');
    } catch (err) {
        statusEl.innerText = "STATUS: ERROR_INIT_FAILED";
    }
}

async function runClip() {
    const fileInput = document.getElementById('uploader').files[0];
    const linkInput = document.getElementById('link-input').value.trim();
    const statusEl = document.getElementById('status');
    
    if (!fileInput && !linkInput) return alert("Pilih file atau masukkan link YouTube!");

    const fileName = 'input_video.mp4';
    const outputName = 'output_clip.mp4';

    try {
        statusEl.innerText = "STATUS: PREPARING_STREAM...";
        statusEl.classList.replace('text-green-500', 'text-yellow-500');

        let finalDownloadUrl = linkInput;

        // 1. Integrasi API YouTube (Via Cobalt)
        if (linkInput.includes("youtube.com") || linkInput.includes("youtu.be")) {
            statusEl.innerText = "STATUS: BYPASSING_YOUTUBE_LIMITS...";
            
            const response = await fetch("https://api.cobalt.tools/api/json", {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    url: linkInput,
                    videoQuality: "720", // Kita batasi 720p agar RAM HP kuat
                    downloadMode: "tunnel"
                })
            });

            const data = await response.json();
            if (data.url) {
                finalDownloadUrl = data.url;
            } else {
                throw new Error("Gagal mendapatkan link video dari API.");
            }
        }

        // 2. Fetching Video Data
        statusEl.innerText = "STATUS: DOWNLOADING_STREAM...";
        // Gunakan corsproxy.io jika bukan dari cobalt (karena cobalt biasanya sudah open CORS)
        const fetchUrl = finalDownloadUrl.includes("cobalt") ? finalDownloadUrl : `https://corsproxy.io/?${encodeURIComponent(finalDownloadUrl)}`;
        const videoData = await fetchFile(fetchUrl);

        // 3. Writing to Virtual Memory
        statusEl.innerText = "STATUS: WRITING_TO_MEMORY...";
        try { ffmpeg.FS('unlink', fileName); } catch(e) {}
        try { ffmpeg.FS('unlink', outputName); } catch(e) {}
        ffmpeg.FS('writeFile', fileName, videoData);

        // 4. Processing Clip (INSTANT MODE)
        statusEl.innerText = "STATUS: CLIPPING_VIDEO...";
        // Kita gunakan -c copy agar prosesnya super cepat (detik saja!)
        await ffmpeg.run('-i', fileName, '-ss', '0', '-t', '5', '-c', 'copy', outputName);

        // 5. Output
        const dataResult = ffmpeg.FS('readFile', outputName);
        const url = URL.createObjectURL(new Blob([dataResult.buffer], { type: 'video/mp4' }));

        const player = document.getElementById('player');
        const downloadBtn = document.getElementById('download');
        player.src = url;
        downloadBtn.href = url;
        downloadBtn.download = `rprtx_clip_${Date.now()}.mp4`;
        
        document.getElementById('result-area').classList.remove('hidden');
        downloadBtn.classList.remove('hidden');
        statusEl.innerText = "STATUS: CLIP_COMPLETED";
        statusEl.classList.replace('text-yellow-500', 'text-green-500');

    } catch (error) {
        console.error(error);
        statusEl.innerText = "STATUS: PROCESS_FAILED";
        statusEl.classList.replace('text-yellow-500', 'text-red-500');
        alert("Terjadi kesalahan. Pastikan link YouTube valid dan durasi video tidak terlalu besar untuk RAM HP.");
    } finally {
        try { ffmpeg.FS('unlink', fileName); } catch(e) {}
    }
}

init();
