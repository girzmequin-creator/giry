# GIR AI — Web + Server

## Isi folder
- `index.html`: tampilan chat GIR AI.
- `server.js`: API server yang melayani `/api/health` dan `/api/chat`.
- `package.json`: dependensi dan perintah start.

## Deploy ke Render
1. Unggah semua file ini ke satu repository GitHub.
2. Di Render, pilih **New + → Web Service**, lalu sambungkan repository.
3. Build Command: `npm install`
4. Start Command: `npm start`
5. Pilih paket Free jika tersedia untuk akun/layanan Anda.
6. Di bagian **Environment**, tambahkan:
   - Key: `OPENAI_API_KEY`
   - Value: kunci API milik Anda
   Opsional: `OPENAI_MODEL` = `gpt-4.1-mini`
7. Deploy. Saat status Live, buka URL `https://...onrender.com`.

## Catatan penting
- GIR AI menggunakan OpenAI Responses API. Pemakaian API dapat dikenakan biaya dan membutuhkan akun API dengan kuota/billing aktif. Minta bantuan orang tua/wali untuk pengaturan akun atau pembayaran jika diperlukan.
- Jangan menaruh API key di `index.html`, repository, atau membagikannya di chat.
- Jangan mengunggah file `.env` atau kunci API ke GitHub.
- Render Free dapat menghentikan sementara service yang tidak aktif; permintaan pertama setelah jeda mungkin lebih lambat.
- Website dan server disajikan dari domain yang sama, jadi alamat server di pengaturan HTML bisa dibiarkan kosong.
