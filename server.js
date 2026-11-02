const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 10000;
const API_KEY = process.env.OPENAI_API_KEY;
const MODEL = process.env.OPENAI_MODEL || "gpt-4.1-mini";

app.disable("x-powered-by");
app.use(express.json({ limit: "20kb" }));
app.use(express.static(path.join(__dirname)));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "GIR AI", configured: Boolean(API_KEY) });
});

app.post("/api/chat", async (req, res) => {
  try {
    if (!API_KEY) {
      return res.status(503).json({
        error: "Server belum dikonfigurasi. Tambahkan OPENAI_API_KEY pada Environment Variables di Render."
      });
    }

    const message = req.body && req.body.message;
    if (typeof message !== "string" || !message.trim()) {
      return res.status(400).json({ error: "Tulis pertanyaan terlebih dahulu." });
    }
    if (message.length > 6000) {
      return res.status(413).json({ error: "Pertanyaan terlalu panjang. Coba ringkas menjadi maksimal 6000 karakter." });
    }

    const upstream = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: MODEL,
        instructions: "Namamu GIR AI. Jawab dalam bahasa yang dipakai pengguna, utamakan bahasa Indonesia. Bantu memahami pelajaran sekolah dengan jelas, ramah, dan bertahap. Jika pengguna memberikan soal, jelaskan cara berpikir dan langkah-langkahnya. Jika tidak yakin, katakan dengan jujur. Jangan mengarang fakta.",
        input: message,
        max_output_tokens: 900
      })
    });

    const payload = await upstream.json().catch(() => ({}));
    if (!upstream.ok) {
      console.error("AI API error:", upstream.status, payload.error?.message || "unknown");
      if (upstream.status === 401) {
        return res.status(502).json({ error: "Kunci API tidak valid. Periksa OPENAI_API_KEY di Render." });
      }
      if (upstream.status === 429) {
        return res.status(502).json({ error: "Batas penggunaan API tercapai atau kuota/billing belum tersedia. Periksa pengaturan akun API." });
      }
      return res.status(502).json({ error: "Layanan AI gagal merespons. Periksa konfigurasi API dan log server." });
    }

    let reply = payload.output_text;
    if (!reply && Array.isArray(payload.output)) {
      reply = payload.output
        .flatMap(item => Array.isArray(item.content) ? item.content : [])
        .filter(part => part.type === "output_text")
        .map(part => part.text)
        .join("\n");
    }
    if (!reply) {
      return res.status(502).json({ error: "Layanan AI mengembalikan jawaban kosong." });
    }
    return res.json({ reply });
  } catch (error) {
    console.error("Chat route error:", error.message);
    return res.status(500).json({ error: "Terjadi masalah pada server. Coba lagi nanti." });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`GIR AI server berjalan di port ${PORT}`);
});
