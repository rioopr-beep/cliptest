const { createFFmpeg, fetchFile } = FFmpeg;
const ffmpeg = createFFmpeg({ log: true });

// 1. Inisialisasi Mesin FFmpeg
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

// 2. Fungsi Utama Clipping
async function runClip() {
    const fileInput = document.getElementById('uploader').files[0];
    const linkInput = document.getElementById('link-input').value.trim();
    const statusEl = document.getElementById('status');
    
    if (!fileInput && !linkInput) return alert("Pilih file atau masukkan link!");

    const fileName = 'temp_input.mp4';
    const outputName = 'output_clip.mp4';

    try {
        statusEl.innerText = "STATUS: FETCHING_DATA...";
        statusEl.classList.replace('text-green-500', 'text-yellow-500');

        let videoData;
        if (fileInput) {
            videoData = await fetchFile(fileInput);
        } else {
            // Gunakan Proxy untuk menembus CORS
            const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(linkInput)}`;
            statusEl.innerText = "STATUS: FETCHING_VIA_PROXY...";
            videoData = await fetchFile(proxyUrl);
        }

        // Tulis data ke memori virtual browser dengan aman
        statusEl.innerText = "STATUS: WRITING_TO_MEMORY...";
        
        // Hapus file lama jika ada (mencegah konflik)
        try { ffmpeg.FS('unlink', fileName); } catch(e) {}
        try { ffmpeg.FS('unlink', outputName); } catch(e) {}

        ffmpeg.FS('writeFile', fileName, videoData);

        statusEl.innerText = "STATUS: PROCESSING_CLIP...";
        
        // Perintah FFmpeg: -ss (Mulai), -t (Durasi 3 detik)
        // Kita tidak menggunakan -c copy agar lebih stabil pada stream internet
        await ffmpeg.run('-i', fileName, '-ss', '0', '-t', '3', outputName);

        // Membaca hasil
        const data = ffmpeg.FS('readFile', outputName);
        const url = URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' }));

        // Tampilkan hasil di UI
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
        console.error("FFmpeg Error:", error);
        statusEl.innerText = "STATUS: PROCESS_FAILED";
        statusEl.classList.replace('text-yellow-500', 'text-red-500');
        alert("Gagal memproses! Jika video terlalu besar, browser HP mungkin memutus koneksi RAM. Coba file yang lebih kecil.");
    } finally {
        // Membersihkan memori virtual setelah selesai/gagal agar tidak membebani HP
        try { ffmpeg.FS('unlink', fileName); } catch(e) {}
        console.log("Memory Cleaned.");
    }
}

init();
