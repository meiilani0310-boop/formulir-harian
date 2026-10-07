import { useState } from "react";
import "./PesanWarung.css";

const MENU = [
  { id: "kopi",   n: "Kopi tubruk",   d: "kopi hitam, gelas kecil", p: 8000 },
  { id: "teh",    n: "Es teh manis",  d: "segar, pakai es batu",    p: 5000 },
  { id: "nasgor", n: "Nasi goreng",   d: "telur mata sapi",         p: 15000 },
  { id: "mie",    n: "Mie rebus",     d: "pakai sawi dan telur",    p: 12000 },
  { id: "pisang", n: "Pisang goreng", d: "isi 3 potong",            p: 6000 },
];
const SUGAR = ["Tanpa gula", "Sedikit", "Biasa", "Manis banget"];
const MODE = ["Makan di sini", "Dibungkus"];
const rp = (n) => "Rp" + n.toLocaleString("id-ID");

function Segmented({ options, value, onChange, disabled }) {
  return (
    <div className="seg">
      {options.map((o, i) => (
        <button
          key={o}
          type="button"
          aria-pressed={value === i}
          disabled={disabled}
          onClick={() => onChange(i)}
        >
          {o}
        </button>
      ))}
    </div>
  );
}

export default function PesanWarung() {
  const [name, setName] = useState("");
  const [cart, setCart] = useState({});
  const [sugar, setSugar] = useState(2);
  const [mode, setMode] = useState(0);
  const [msg, setMsg] = useState("");
  const [queue, setQueue] = useState(null);

  const lines = MENU.filter((m) => cart[m.id]).map((m) => ({ ...m, q: cart[m.id] }));
  const total = lines.reduce((s, l) => s + l.q * l.p, 0);
  const now = new Date();
  const locked = !!queue;

  const change = (id, d) =>
    setCart((c) => ({ ...c, [id]: Math.max(0, Math.min(9, (c[id] || 0) + d)) }));

  const submit = (e) => {
    e.preventDefault();
    if (!name.trim()) return setMsg("Tulis nama pemesan dulu, supaya Ibu Putri bisa memanggilmu.");
    if (!lines.length) return setMsg("Pilih minimal satu menu.");
    setMsg("");
    setQueue("A-" + (10 + Math.floor(Math.random() * 80)));
  };

  const again = () => {
    setQueue(null);
    setCart({});
  };

  return (
    <div className="warung">
      <div className="wrap">
        <header className="sign">
          <h1>Warung Ibu Putri</h1>
          <p>Buka tiap hari, 06.00–21.00</p>
        </header>

        <div className="grid">
          {/* Papan pesanan */}
          <form className="board" onSubmit={submit} noValidate>
            <h2>Mau pesan apa hari ini?</h2>
            <p className="sub">Isi pesananmu, struknya tercetak di sebelah.</p>

            <label htmlFor="nm">Nama pemesan</label>
            <input
              id="nm"
              type="text"
              value={name}
              disabled={locked}
              placeholder="mis. Repi"
              onChange={(e) => setName(e.target.value)}
            />

            <span className="lbl">Menu</span>
            <div className="menu">
              {MENU.map((m) => {
                const q = cart[m.id] || 0;
                return (
                  <div key={m.id} className={"item" + (q ? " has" : "")}>
                    <div className="n">
                      {m.n}
                      <small>{m.d} · {rp(m.p)}</small>
                    </div>
                    <div className="step">
                      <button
                        type="button"
                        disabled={!q || locked}
                        aria-label={"Kurangi " + m.n}
                        onClick={() => change(m.id, -1)}
                      >
                        −
                      </button>
                      <output>{q}</output>
                      <button
                        type="button"
                        disabled={locked}
                        aria-label={"Tambah " + m.n}
                        onClick={() => change(m.id, 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <span className="lbl">Tingkat manis</span>
            <Segmented options={SUGAR} value={sugar} onChange={setSugar} disabled={locked} />

            <span className="lbl">Makan di mana?</span>
            <Segmented options={MODE} value={mode} onChange={setMode} disabled={locked} />

            <p className="msg" role="alert">{msg}</p>

            <button className="go" type="submit" disabled={locked}>
              {locked ? "Pesanan terkirim" : "Pesan sekarang · " + rp(total)}
            </button>
          </form>

          {/* Struk */}
          <div className="rcpt-col">
            <div className="printer" />
            <div className="rcpt" key={queue || "live"}>
              <h3>WARUNG IBU PUTRI</h3>
              <p className="c">Jl. Setia Budi No. 7</p>
              <p className="c">
                {now.toLocaleDateString("id-ID")}{" "}
                {now.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
              </p>
              <hr />
              <div className="row"><span>Atas nama</span><span>{name.trim() || "…"}</span></div>
              <div className="row"><span>{MODE[mode]}</span><span>Gula: {SUGAR[sugar]}</span></div>
              <hr />
              {lines.length ? (
                lines.map((l) => (
                  <div className="row" key={l.id}>
                    <span>{l.q}x {l.n}</span>
                    <span>{rp(l.q * l.p)}</span>
                  </div>
                ))
              ) : (
                <p className="empty">Belum ada pesanan</p>
              )}
              <hr />
              <div className="row tot"><span>TOTAL</span><span>{rp(total)}</span></div>
              {queue && (
                <div className="q">
                  Nomor antrian
                  <b>{queue}</b>
                </div>
              )}
              <p className="c">
                {queue ? "Mohon tunggu, kami panggil ya." : "Terima kasih sudah mampir!"}
              </p>
            </div>
            {queue && (
              <button className="again" onClick={again}>Pesan lagi</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}