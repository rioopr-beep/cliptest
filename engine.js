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
        statusEl.innerText = "STATUS: INITIATING...";
        statusEl.classList.replace('text-green-500', 'text-yellow-500');

        let finalDownloadUrl = linkInput;

        // 1. INTEGRASI API YOUTUBE DENGAN PROXY
        if (linkInput.includes("youtube.com") || linkInput.includes("youtu.be")) {
            statusEl.innerText = "STATUS: BYPASSING_YOUTUBE_API...";
            
            const apiTarget = "https://api.cobalt.tools/api/json";
            // Proxy untuk menembus CORS API
            const proxyApi = "https://corsproxy.io/?" + encodeURIComponent(apiTarget);

            const response = await fetch(proxyApi, {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    url: linkInput,
                    videoQuality: "480", // Resolusi aman untuk RAM HP
                    downloadMode: "tunnel"
                })
            });

            const data = await response.json();
            
            if (data.url) {
                finalDownloadUrl = data.url;
            } else if (data.picker) {
                finalDownloadUrl = data.picker[0].url;
            } else {
                throw new Error("API tidak memberikan link video.");
            }
        }

        // 2. FETCH VIDEO DATA (DENGAN PROXY JIKA PERLU)
        statusEl.innerText = "STATUS: DOWNLOADING_STREAM...";
        
        // Cobalt tunnel biasanya sudah open, tapi kita bungkus proxy untuk jaga-jaga
        const fetchUrl = `https://corsproxy.io/?${encodeURIComponent(finalDownloadUrl)}`;
        const videoData = await fetchFile(fetchUrl);

        // 3. WRITING TO VIRTUAL FS
        statusEl.innerText = "STATUS: WRITING_TO_MEMORY...";
        try { ffmpeg.FS('unlink', fileName); } catch(e) {}
        try { ffmpeg.FS('unlink', outputName); } catch(e) {}
        
        ffmpeg.FS('writeFile', fileName, videoData);

        // 4. PROCESSING CLIP (INSTANT MODE)
        statusEl.innerText = "STATUS: CLIPPING_5_SECONDS...";
        // Kita tes potong 5 detik pertama agar cepat
        await ffmpeg.run('-i', fileName, '-ss', '0', '-t', '5', '-c', 'copy', outputName);

        // 5. OUTPUT KE UI
        const dataResult = ffmpeg.FS('readFile', outputName);
        const url = URL.createObjectURL(new Blob([dataResult.buffer], { type: 'video/mp4' }));

        const player = document.getElementById('player');
        const downloadBtn = document.getElementById('download');
        
        player.src = url;
        downloadBtn.href = url;
        downloadBtn.download = `clip_rprtx_${Date.now()}.mp4`;
        
        document.getElementById('result-area').classList.remove('hidden');
        downloadBtn.classList.remove('hidden');
        
        statusEl.innerText = "STATUS: CLIP_COMPLETED";
        statusEl.classList.replace('text-yellow-500', 'text-green-500');

    } catch (error) {
        console.error("Detail Error:", error);
        statusEl.innerText = "STATUS: PROCESS_FAILED";
        statusEl.classList.replace('text-yellow-500', 'text-red-500');
        alert("Gagal! Hal ini sering terjadi karena API sedang down atau link tidak mendukung proxy.");
    } finally {
        // Hapus file dari RAM agar browser tidak berat
        try { ffmpeg.FS('unlink', fileName); } catch(e) {}
    }
}

init();
