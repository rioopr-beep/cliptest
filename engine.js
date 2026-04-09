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
    const file = document.getElementById('uploader').files[0];
    if (!file) return alert("Pilih video dulu!");

    document.getElementById('status').innerText = "STATUS: PROCESSING_CLIP...";
    
    // Tulis file ke memori virtual browser
    ffmpeg.FS('writeFile', 'input.mp4', await fetchFile(file));

    // Jalankan perintah potong (mengambil 3 detik pertama)
    // -c copy memastikan proses secepat kilat (tanpa render ulang)
    await ffmpeg.run('-i', 'input.mp4', '-t', '3', '-c', 'copy', 'output.mp4');

    // Ambil data hasil potong
    const data = ffmpeg.FS('readFile', 'output.mp4');
    const url = URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' }));

    // Tampilkan hasil
    document.getElementById('player').src = url;
    document.getElementById('download').href = url;
    document.getElementById('download').download = "rprtx_clip.mp4";
    document.getElementById('result-area').classList.remove('hidden');
    document.getElementById('status').innerText = "STATUS: CLIP_COMPLETED";
}

init();
