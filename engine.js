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
        console.error(err);
    }
}

async function runClip() {
    const fileInput = document.getElementById('uploader').files[0];
    const linkInput = document.getElementById('link-input').value;
    const statusEl = document.getElementById('status');
    
    if (!fileInput && !linkInput) return alert("Pilih file atau masukkan link video!");

    statusEl.innerText = "STATUS: FETCHING_DATA...";
    statusEl.classList.replace('text-green-500', 'text-yellow-500');

    try {
        let videoData;
        if (fileInput) {
            // Proses file lokal
            videoData = await fetchFile(fileInput);
        } else {
            // Proses dari link (Remote Fetch)
            videoData = await fetchFile(linkInput);
        }

        statusEl.innerText = "STATUS: PROCESSING_CLIP...";
        
        // Tulis file ke memori virtual FFmpeg
        ffmpeg.FS('writeFile', 'input.mp4', videoData);

        // Perintah potong: ambil 3 detik pertama
        // Kita gunakan -c copy agar proses secepat kilat (Hanya bekerja jika formatnya sama)
        await ffmpeg.run('-i', 'input.mp4', '-t', '3', '-c', 'copy', 'output.mp4');

        // Baca hasil
        const data = ffmpeg.FS('readFile', 'output.mp4');
        const url = URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' }));

        // Tampilkan di UI
        const player = document.getElementById('player');
        const downloadBtn = document.getElementById('download');
        
        player.src = url;
        downloadBtn.href = url;
        downloadBtn.download = "rprtx_clip.mp4";
        
        document.getElementById('result-area').classList.remove('hidden');
        downloadBtn.classList.remove('hidden');
        
        statusEl.innerText = "STATUS: CLIP_COMPLETED";
        statusEl.classList.replace('text-yellow-500', 'text-green-500');

    } catch (error) {
        console.error(error);
        statusEl.innerText = "STATUS: FAILED_TO_PROCESS";
        statusEl.classList.replace('text-yellow-500', 'text-red-500');
        alert("Gagal memproses video. Pastikan link adalah direct link .mp4 dan mendukung CORS.");
    }
}

init();
