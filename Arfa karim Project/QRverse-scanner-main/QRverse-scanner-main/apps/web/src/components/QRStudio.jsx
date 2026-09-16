import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import QRCodeStyling from 'qr-code-styling';
import { CATEGORIES } from '@/lib/qrCategories';
import { Search, Download, Copy, Check, Upload, Sparkles, History, Trash2, Star } from 'lucide-react';

const DOT_STYLES = ['rounded', 'dots', 'classy', 'classy-rounded', 'square', 'extra-rounded'];
const CORNER_STYLES = ['extra-rounded', 'dot', 'square'];
const ECC = ['L', 'M', 'Q', 'H'];
const HISTORY_KEY = 'qrverse_history_v1';

function loadHistory() {
  try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]'); } catch { return []; }
}

export default function QRStudio() {
  const [catId, setCatId] = useState('url');
  const [values, setValues] = useState({ url: 'https://qrverse.app' });
  const [query, setQuery] = useState('');
  const [fg, setFg] = useState('#6d28d9');
  const [fg2, setFg2] = useState('#06b6d4');
  const [useGradient, setUseGradient] = useState(true);
  const [bg, setBg] = useState('#ffffff');
  const [transparent, setTransparent] = useState(false);
  const [dotStyle, setDotStyle] = useState('rounded');
  const [cornerStyle, setCornerStyle] = useState('extra-rounded');
  const [margin, setMargin] = useState(12);
  const [ecc, setEcc] = useState('Q');
  const [logo, setLogo] = useState(null);
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState(loadHistory);

  const cat = useMemo(() => CATEGORIES.find(c => c.id === catId), [catId]);
  const data = useMemo(() => cat.build(values) || ' ', [cat, values]);

  const ref = useRef(null);
  const qr = useRef(null);

  const options = useMemo(() => ({
    width: 300, height: 300, type: 'svg', data,
    margin,
    qrOptions: { errorCorrectionLevel: ecc },
    image: logo || undefined,
    imageOptions: { crossOrigin: 'anonymous', margin: 6, imageSize: 0.4 },
    dotsOptions: useGradient
      ? { type: dotStyle, gradient: { type: 'linear', rotation: 0.8, colorStops: [{ offset: 0, color: fg }, { offset: 1, color: fg2 }] } }
      : { type: dotStyle, color: fg },
    cornersSquareOptions: { type: cornerStyle, color: useGradient ? fg : fg },
    cornersDotOptions: { color: useGradient ? fg2 : fg },
    backgroundOptions: { color: transparent ? 'transparent' : bg },
  }), [data, margin, ecc, logo, useGradient, dotStyle, fg, fg2, cornerStyle, transparent, bg]);

  useEffect(() => {
    qr.current = new QRCodeStyling(options);
    if (ref.current) { ref.current.innerHTML = ''; qr.current.append(ref.current); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => { if (qr.current) qr.current.update(options); }, [options]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return CATEGORIES;
    return CATEGORIES.filter(c => c.label.toLowerCase().includes(q) || c.group.toLowerCase().includes(q));
  }, [query]);

  const setField = (k, v) => setValues(p => ({ ...p, [k]: v }));

  const onLogo = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = () => setLogo(r.result);
    r.readAsDataURL(f);
  };

  const saveHistory = useCallback(() => {
    const entry = { id: Date.now(), label: cat.label, data, fg, fg2, catId };
    setHistory(prev => {
      const next = [entry, ...prev].slice(0, 10);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
      return next;
    });
  }, [cat, data, fg, fg2, catId]);

  const download = (ext) => { qr.current?.download({ name: `qrverse-${catId}`, extension: ext }); saveHistory(); };

  const copyData = async () => {
    try { await navigator.clipboard.writeText(data); setCopied(true); setTimeout(() => setCopied(false), 1500); } catch { /* noop */ }
  };

  const clearHistory = () => { localStorage.removeItem(HISTORY_KEY); setHistory([]); };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      {/* Left: controls */}
      <div className="glass rounded-3xl p-5 md:p-7">
        {/* search */}
        <div className="relative mb-5">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={query} onChange={e => setQuery(e.target.value)}
            placeholder="Search 27 QR types (wifi, vcard, upi...)"
            aria-label="Search QR categories"
            className="w-full rounded-2xl border border-border bg-background/60 py-3 pl-11 pr-4 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <div className="mb-6 flex flex-wrap gap-2 max-h-40 overflow-y-auto pr-1">
          {filtered.map(c => {
            const Icon = c.icon;
            const active = c.id === catId;
            return (
              <button key={c.id} onClick={() => { setCatId(c.id); setValues({}); }}
                className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-xs font-medium transition
                  ${active ? 'border-transparent bg-primary text-primary-foreground shadow-lg shadow-primary/25' : 'border-border bg-background/50 hover:border-primary/50'}`}>
                <Icon className="h-3.5 w-3.5" strokeWidth={2} /> {c.label}
              </button>
            );
          })}
          {filtered.length === 0 && <p className="text-sm text-muted-foreground py-4">No categories match “{query}”.</p>}
        </div>

        {/* dynamic fields */}
        <div className="grid gap-3 md:grid-cols-2">
          {cat.fields.map(f => (
            <div key={f.key} className={f.type === 'textarea' ? 'md:col-span-2' : ''}>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">{f.label}</label>
              {f.type === 'textarea' ? (
                <textarea rows={3} value={values[f.key] || ''} onChange={e => setField(f.key, e.target.value)}
                  placeholder={f.placeholder}
                  className="w-full resize-none rounded-xl border border-border bg-background/60 px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring" />
              ) : (
                <input value={values[f.key] || ''} onChange={e => setField(f.key, e.target.value)}
                  placeholder={f.placeholder}
                  className="w-full rounded-xl border border-border bg-background/60 px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring" />
              )}
            </div>
          ))}
        </div>

        {/* customization */}
        <div className="mt-6 border-t border-border pt-5">
          <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold"><Sparkles className="h-4 w-4 text-accent" /> Customize</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <ColorRow label="Foreground" value={fg} onChange={setFg} />
            {useGradient && <ColorRow label="Gradient end" value={fg2} onChange={setFg2} />}
            {!transparent && <ColorRow label="Background" value={bg} onChange={setBg} />}
            <Toggle label="Gradient fill" checked={useGradient} onChange={setUseGradient} />
            <Toggle label="Transparent bg" checked={transparent} onChange={setTransparent} />
            <SelectRow label="Dot style" value={dotStyle} onChange={setDotStyle} options={DOT_STYLES} />
            <SelectRow label="Corner style" value={cornerStyle} onChange={setCornerStyle} options={CORNER_STYLES} />
            <SelectRow label="Error correction" value={ecc} onChange={setEcc} options={ECC} />
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Margin: {margin}px</label>
              <input type="range" min="0" max="40" value={margin} onChange={e => setMargin(+e.target.value)}
                className="w-full accent-primary" aria-label="Margin" />
            </div>
            <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-border bg-background/40 px-3.5 py-2.5 text-xs font-medium hover:border-primary/50 sm:col-span-2">
              <Upload className="h-4 w-4" /> {logo ? 'Logo added — replace' : 'Upload center logo / image'}
              <input type="file" accept="image/*" className="hidden" onChange={onLogo} />
              {logo && <button type="button" onClick={(e) => { e.preventDefault(); setLogo(null); }} className="ml-auto text-destructive">Remove</button>}
            </label>
          </div>
        </div>
      </div>

      {/* Right: preview + download */}
      <div className="space-y-5">
        <div className="glass sticky top-24 rounded-3xl p-6 text-center">
          <div className="mx-auto flex aspect-square w-full max-w-[280px] items-center justify-center overflow-hidden rounded-2xl shadow-inner [&_svg]:h-full [&_svg]:w-full [&_svg]:rounded-2xl"
            style={transparent
              ? { backgroundImage: 'linear-gradient(45deg,#eee 25%,transparent 25%),linear-gradient(-45deg,#eee 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#eee 75%),linear-gradient(-45deg,transparent 75%,#eee 75%)', backgroundSize: '16px 16px', backgroundPosition: '0 0,0 8px,8px -8px,-8px 0' }
              : { backgroundColor: bg }}>
            <div ref={ref} aria-label="Live QR code preview" className="flex h-full w-full items-center justify-center [&>*]:h-full [&>*]:w-full" />
          </div>
          <p className="mt-3 truncate text-xs text-muted-foreground" title={data}>{data}</p>

          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {['png', 'jpeg', 'webp', 'svg'].map(ext => (
              <button key={ext} onClick={() => download(ext)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground transition hover:opacity-90 active:scale-[0.97]">
                <Download className="h-3.5 w-3.5" /> {ext.toUpperCase()}
              </button>
            ))}
          </div>
          <button onClick={copyData}
            className="mt-2 inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-border py-2 text-xs font-medium hover:bg-secondary">
            {copied ? <><Check className="h-3.5 w-3.5 text-accent" /> Copied</> : <><Copy className="h-3.5 w-3.5" /> Copy content</>}
          </button>
        </div>

        <div className="glass rounded-3xl p-5">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-sm font-semibold"><History className="h-4 w-4" /> Recent</h3>
            {history.length > 0 && <button onClick={clearHistory} className="text-muted-foreground hover:text-destructive" aria-label="Clear history"><Trash2 className="h-4 w-4" /></button>}
          </div>
          {history.length === 0 ? (
            <p className="text-xs text-muted-foreground">Your last 10 downloads appear here — stored only in this browser.</p>
          ) : (
            <ul className="space-y-2">
              {history.map(h => (
                <li key={h.id}>
                  <button onClick={() => { setCatId(h.catId); setFg(h.fg); setFg2(h.fg2); }}
                    className="flex w-full items-center gap-2 rounded-xl border border-border bg-background/40 px-3 py-2 text-left text-xs hover:border-primary/50">
                    <Star className="h-3.5 w-3.5 text-accent shrink-0" />
                    <span className="font-medium">{h.label}</span>
                    <span className="ml-auto truncate text-muted-foreground max-w-[120px]">{h.data}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

function ColorRow({ label, value, onChange }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-muted-foreground">{label}</label>
      <div className="flex items-center gap-2 rounded-xl border border-border bg-background/60 px-2 py-1.5">
        <input type="color" value={value} onChange={e => onChange(e.target.value)} className="h-7 w-9 cursor-pointer rounded bg-transparent" aria-label={label} />
        <input value={value} onChange={e => onChange(e.target.value)} className="w-full bg-transparent text-xs outline-none" />
      </div>
    </div>
  );
}

function SelectRow({ label, value, onChange, options }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-muted-foreground">{label}</label>
      <select value={value} onChange={e => onChange(e.target.value)}
        className="w-full rounded-xl border border-border bg-background/60 px-3 py-2.5 text-sm capitalize outline-none focus:ring-2 focus:ring-ring">
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

function Toggle({ label, checked, onChange }) {
  return (
    <button type="button" onClick={() => onChange(!checked)}
      className="flex items-center justify-between rounded-xl border border-border bg-background/60 px-3.5 py-2.5 text-xs font-medium">
      {label}
      <span className={`relative h-5 w-9 rounded-full transition ${checked ? 'bg-primary' : 'bg-muted'}`}>
        <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition ${checked ? 'left-4' : 'left-0.5'}`} />
      </span>
    </button>
  );
}
