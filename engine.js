const { createFFmpeg, fetchFile } = FFmpeg;
const ffmpeg = createFFmpeg({ log: true });

async function init() {
    const statusEl = document.getElementById('status');
    const btn = document.getElementById('btn-run');
    
    try {
        await ffmpeg.load();
        statusEl.innerText = "STATUS: ENGINE_READY (Client-Side)";
        statusEl.classList.add('text-green-500');
        btn.disabled = false;
        btn.classList.replace('bg-zinc-800', 'bg-indigo-600');
        btn.classList.replace('text-zinc-500', 'text-white');
        btn.classList.remove('cursor-not-allowed');
    } catch (err) {
        statusEl.innerText = "STATUS: ERROR_COOP_REQUIRED";
        console.error("FFmpeg Load Error:", err);
    }
}

async function runClip() {
    const fileInput = document.getElementById('uploader').files[0];
    const linkInput = document.getElementById('link-input').value.trim();
    const statusEl = document.getElementById('status');
    
    if (!fileInput && !linkInput) return alert("Pilih file atau masukkan link!");

    try {
        statusEl.innerText = "STATUS: FETCHING_DATA...";
        statusEl.classList.replace('text-green-500', 'text-yellow-500');

        let videoData;
        if (fileInput) {
            // Jalur File Lokal
            videoData = await fetchFile(fileInput);
        } else {
            // Jalur Link Internet dengan Proxy Jembatan (Menembus CORS)
            // Kita gunakan corsproxy.io untuk mengambil data video yang terblokir
            const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(linkInput)}`;
            
            statusEl.innerText = "STATUS: FETCHING_VIA_PROXY...";
            videoData = await fetchFile(proxyUrl);
        }

        statusEl.innerText = "STATUS: PROCESSING_CLIP...";
        
        // Simpan ke memori virtual browser
        ffmpeg.FS('writeFile', 'input.mp4', videoData);

        // Eksekusi Pemotongan (3 detik pertama)
        // -c copy sangat penting agar HP tidak panas karena tidak melakukan encoding ulang
        await ffmpeg.run('-i', 'input.mp4', '-t', '3', '-c', 'copy', 'output.mp4');

        // Baca hasil akhir
        const data = ffmpeg.FS('readFile', 'output.mp4');
        const url = URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' }));

        // Update UI
        const player = document.getElementById('player');
        const downloadBtn = document.getElementById('download');
        
        player.src = url;
        downloadBtn.href = url;
        downloadBtn.download = `rprtx_clip_${Date.now()}.mp4`;
        
        document.getElementById('result-area').classList.remove('hidden');
        downloadBtn.classList.remove('hidden');
        
        statusEl.innerText = "STATUS: CLIP_COMPLETED";
        statusEl.classList.replace('text-yellow-500', 'text-green-500');

        // Bersihkan memori virtual setelah selesai agar HP tidak lag
        ffmpeg.FS('unlink', 'input.mp4');

    } catch (error) {
        console.error("Proses Gagal:", error);
        statusEl.innerText = "STATUS: FAILED_TO_FETCH_OR_PROCESS";
        statusEl.classList.replace('text-yellow-500', 'text-red-500');
        alert("Gagal! Hal ini bisa disebabkan karena Link Video tidak mendukung streaming atau memori RAM HP penuh.");
    }
}

init();
