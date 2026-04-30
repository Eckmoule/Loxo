
import { useState, useEffect } from 'react';
import { getAggregatsCommune, formatAggregatsForChart } from '../../services/aggregatsService';
import './Commune.css';

// Données de test en dur (temporaire)
const MOCK_CITY = {
    name: "Lyon",
    code: "69123",
    region: "Auvergne-Rhône-Alpes",
    stats: {
        mediane: 5420,
        volume: 2847,
        tendance: 3.2
    },
    labels: ['T1 2021', 'T2 2021', 'T3 2021', 'T4 2021', 'T1 2022', 'T2 2022', 'T3 2022', 'T4 2022', 'T1 2023', 'T2 2023', 'T3 2023', 'T4 2023', 'T1 2024', 'T2 2024', 'T3 2024', 'T4 2024'],
    priceHistory: {
        appartement: {
            all: [4850, 4920, 5010, 5080, 5150, 5200, 5280, 5310, 5340, 5370, 5390, 5410, 5430, 5450, 5470, 5490],
            '2p': [4650, 4710, 4790, 4850, 4920, 4970, 5040, 5070, 5100, 5130, 5150, 5170, 5190, 5210, 5230, 5250],
            '3p': [5050, 5130, 5230, 5310, 5380, 5430, 5520, 5550, 5580, 5610, 5630, 5650, 5670, 5690, 5710, 5730]
        },
        maison: {
            all: [3850, 3920, 4010, 4080, 4150, 4200, 4280, 4310, 4340, 4370, 4390, 4410, 4430, 4450, 4470, 4490]
        }
    }
};

// ── Composant LineChart ──
function LineChart({ data, labels, color = 'var(--accent)', height = 280 }) {
    const [tooltip, setTooltip] = useState(null);
    const W = 800, H = height;
    const pad = { top: 24, right: 24, bottom: 44, left: 72 };
    const iW = W - pad.left - pad.right;
    const iH = H - pad.top - pad.bottom;

    const minV = Math.min(...data) * 0.97;
    const maxV = Math.max(...data) * 1.02;

    const xOf = i => (i / (data.length - 1)) * iW;
    const yOf = v => iH - ((v - minV) / (maxV - minV)) * iH;

    const pts = data.map((v, i) => ({ x: xOf(i), y: yOf(v), v, label: labels[i] }));

    const linePath = pts.reduce((acc, pt, i) => {
        if (i === 0) return `M${pt.x},${pt.y}`;
        const prev = pts[i - 1];
        const cx = (prev.x + pt.x) / 2;
        return `${acc} C${cx},${prev.y} ${cx},${pt.y} ${pt.x},${pt.y}`;
    }, '');

    const areaPath = `${linePath} L${pts[pts.length - 1].x},${iH} L0,${iH} Z`;

    const step = (maxV - minV) / 4;
    const yTicks = Array.from({ length: 5 }, (_, i) => {
        const v = minV + step * i;
        return { y: yOf(v), label: Math.round(v / 1000) + 'k' };
    });

    const xLabels = labels.map((l, i) => ({ x: xOf(i), label: l, i }))
        .filter((_, i) => data.length <= 10 ? true : i % 2 === 0);

    const gradId = `grad_${Math.random().toString(36).slice(2)}`;

    return (
        <div style={{ position: 'relative', width: '100%' }}>
            <svg
                viewBox={`0 0 ${W} ${H}`}
                style={{ width: '100%', height: 'auto', display: 'block', overflow: 'visible' }}
                onMouseLeave={() => setTooltip(null)}
            >
                <defs>
                    <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={color} stopOpacity="0.18" />
                        <stop offset="85%" stopColor={color} stopOpacity="0.02" />
                    </linearGradient>
                    <clipPath id="chartArea">
                        <rect x="0" y="-10" width={iW} height={iH + 10} />
                    </clipPath>
                </defs>

                <g transform={`translate(${pad.left},${pad.top})`}>
                    {yTicks.map((t, i) => (
                        <g key={i}>
                            <line x1={0} y1={t.y} x2={iW} y2={t.y}
                                stroke="var(--border-subtle)" strokeWidth="1" />
                            <text x={-12} y={t.y + 4} textAnchor="end"
                                fontSize="12" fill="var(--text-3)"
                                fontFamily="var(--font-mono)">{t.label}</text>
                        </g>
                    ))}

                    {xLabels.map(({ x, label }) => (
                        <text key={label} x={x} y={iH + 30} textAnchor="middle"
                            fontSize="11" fill="var(--text-3)"
                            fontFamily="var(--font-sans)">{label}</text>
                    ))}

                    <path d={areaPath} fill={`url(#${gradId})`} clipPath="url(#chartArea)" />
                    <path d={linePath} fill="none" stroke={color}
                        strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                        clipPath="url(#chartArea)" />

                    {pts.map((pt, i) => (
                        <g key={i}
                            onMouseEnter={() => setTooltip(pt)}
                            style={{ cursor: 'crosshair' }}
                        >
                            <rect x={pt.x - iW / data.length / 2} y={0}
                                width={iW / data.length} height={iH}
                                fill="transparent" />
                            <circle cx={pt.x} cy={pt.y} r={tooltip?.i === i ? 5 : 3.5}
                                fill={color} stroke="var(--surface)" strokeWidth="2"
                                style={{ transition: 'r 0.1s' }} />
                        </g>
                    ))}

                    {tooltip && (() => {
                        const tw = 168, th = 52;
                        const tx = Math.min(Math.max(tooltip.x - tw / 2, 4), iW - tw - 4);
                        const ty = tooltip.y - th - 14;
                        return (
                            <g>
                                <line x1={tooltip.x} y1={0} x2={tooltip.x} y2={iH}
                                    stroke={color} strokeWidth="1" strokeDasharray="4 3" strokeOpacity="0.5" />
                                <rect x={tx} y={ty} width={tw} height={th} rx="8"
                                    fill="var(--surface)" stroke="var(--border)" />
                                <text x={tx + tw / 2} y={ty + 18} textAnchor="middle"
                                    fontSize="11" fill="var(--text-3)" fontFamily="var(--font-sans)">
                                    {tooltip.label}
                                </text>
                                <text x={tx + tw / 2} y={ty + 37} textAnchor="middle"
                                    fontSize="16" fontWeight="600" fill="var(--text-1)"
                                    fontFamily="var(--font-mono)">
                                    {Math.round(tooltip.v).toLocaleString('fr-FR')} €/m²
                                </text>
                            </g>
                        );
                    })()}
                </g>
            </svg>
        </div>
    );
}

// ── Composant StatCard ──
function StatCard({ label, value, unit, sub, trend }) {
    const isPos = trend >= 0;
    return (
        <div style={{
            background: 'var(--surface)', border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)', padding: '20px 24px',
            flex: 1, minWidth: 0,
            boxShadow: 'var(--shadow-sm)',
        }}>
            <div style={{ fontSize: 12, color: 'var(--text-3)', fontFamily: 'var(--font-mono)', marginBottom: 10, letterSpacing: '0.03em' }}>
                {label}
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 26, fontWeight: 500, color: 'var(--text-1)', letterSpacing: '-0.04em' }}>
                    {typeof value === 'number' ? value.toLocaleString('fr-FR') : value}
                </span>
                {unit && <span style={{ fontSize: 13, color: 'var(--text-3)', fontFamily: 'var(--font-mono)' }}>{unit}</span>}
            </div>
            {(sub || trend !== undefined) && (
                <div style={{ marginTop: 8, fontSize: 12, color: 'var(--text-3)', display: 'flex', alignItems: 'center', gap: 8 }}>
                    {sub}
                    {trend !== undefined && (
                        <span style={{
                            fontSize: 11, fontFamily: 'var(--font-mono)', fontWeight: 500,
                            color: isPos ? 'var(--positive)' : 'var(--negative)',
                            background: isPos ? 'var(--positive-subtle)' : 'var(--negative-subtle)',
                            padding: '2px 6px', borderRadius: 99,
                        }}>
                            {isPos ? '+' : ''}{trend}%
                        </span>
                    )}
                </div>
            )}
        </div>
    );
}

// ── Composant FilterPill ──
function FilterPill({ label, active, onClick }) {
    return (
        <button onClick={onClick} style={{
            padding: '6px 14px', borderRadius: 99, fontSize: 13,
            fontFamily: 'var(--font-sans)', fontWeight: active ? 500 : 400,
            border: `1px solid ${active ? 'var(--accent)' : 'var(--border)'}`,
            background: active ? 'var(--accent-subtle)' : 'var(--surface)',
            color: active ? 'var(--accent-text)' : 'var(--text-2)',
            cursor: 'pointer',
            transition: 'all 0.15s',
        }}>
            {label}
        </button>
    );
}

function Commune({ commune, onNavigate }) {
    const [typeFilter, setTypeFilter] = useState('appartement');
    const [roomFilter, setRoomFilter] = useState('all');
    const [cityData, setCityData] = useState(null);
    const [loading, setLoading] = useState(true);

    // Charger les données réelles depuis Supabase
    useEffect(() => {
        async function loadData() {
            if (!commune) return;

            setLoading(true);
            const agregats = await getAggregatsCommune(commune.code_commune);
            const formatted = formatAggregatsForChart(agregats);
            setCityData(formatted);
            setLoading(false);
        }

        loadData();
    }, [commune]);

    const city = cityData;

    if (!commune) {
        return (
            <main className="commune-page">
                <div className="commune-error">
                    <h2>Commune introuvable</h2>
                    <button onClick={() => onNavigate('home')} className="commune-back-btn">
                        Retour à l'accueil
                    </button>
                </div>
            </main>
        );
    }

    if (loading) {
        return (
            <main className="commune-page">
                <div className="commune-error">
                    <h2>Chargement des données...</h2>
                </div>
            </main>
        );
    }

    if (!cityData || !cityData.priceHistory) {
        return (
            <main className="commune-page">
                <div className="commune-error">
                    <h2>Aucune donnée disponible pour cette commune</h2>
                    <button onClick={() => onNavigate('home')} className="commune-back-btn">
                        Retour à l'accueil
                    </button>
                </div>
            </main>
        );
    }


    const hist = city.priceHistory?.[typeFilter]?.[roomFilter]
        || city.priceHistory?.[typeFilter]?.all
        || [];

    const firstV = hist[0] || 1;
    const lastV = hist[hist.length - 1] || 1;
    const evol = ((lastV - firstV) / firstV * 100).toFixed(1);

    const roomOptions = [
        { key: 'all', label: 'Tous' },
        { key: '2p', label: '2 pièces' },
        { key: '3p', label: '3 pièces' },
    ];

    return (
        <main style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 24px 80px' }}>

            {/* Header */}
            <div style={{ marginBottom: 36 }}>
                <button onClick={() => onNavigate('home')} className="commune-back-btn">
                    ← Retour
                </button>

                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginTop: 24, flexWrap: 'wrap', gap: 16 }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <h1 style={{
                                fontFamily: 'var(--font-display)', fontWeight: 800,
                                fontSize: 'clamp(26px, 4vw, 36px)', letterSpacing: '-0.04em',
                                color: 'var(--text-1)',
                            }}>
                                {commune.nom_commune}
                            </h1>
                            <span style={{
                                fontSize: 13, fontFamily: 'var(--font-mono)',
                                color: 'var(--text-3)', background: 'var(--surface-2)',
                                padding: '3px 8px', borderRadius: 6,
                                border: '1px solid var(--border-subtle)',
                            }}>{commune.code_commune}</span>
                        </div>
                        {commune.population && (
                            <div style={{ fontSize: 13, color: 'var(--text-3)', marginTop: 4 }}>
                                {commune.population.toLocaleString('fr-FR')} habitants
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 32, flexWrap: 'wrap' }}>
                <StatCard label="MÉDIANE €/M²" value={city.stats.mediane} unit="€/m²"
                    sub="12 derniers mois" trend={city.stats.tendance} />
                <StatCard label="TRANSACTIONS" value={city.stats.volume} unit="ventes"
                    sub="sur les 12 derniers mois" />
                <StatCard label="ÉVOLUTION" value={evol > 0 ? `+${evol}` : evol} unit="%"
                    sub="depuis jan. 2021" trend={parseFloat(evol)} />
            </div>

            {/* Chart card */}
            <div style={{
                background: 'var(--surface)', border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-lg)', padding: '24px',
                boxShadow: 'var(--shadow-sm)',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 24 }}>
                    <div>
                        <h2 style={{
                            fontFamily: 'var(--font-display)', fontWeight: 600,
                            fontSize: 15, color: 'var(--text-1)', letterSpacing: '-0.02em',
                        }}>
                            Prix au m² — évolution
                        </h2>
                        <p style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 2, fontFamily: 'var(--font-mono)' }}>
                            Source DVF · Transactions effectives
                        </p>
                    </div>

                    {/* Filters */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                        <FilterPill label="Appartement" active={typeFilter === 'appartement'} onClick={() => { setTypeFilter('appartement'); setRoomFilter('all'); }} />
                        <FilterPill label="Maison" active={typeFilter === 'maison'} onClick={() => { setTypeFilter('maison'); setRoomFilter('all'); }} />
                        {typeFilter === 'appartement' && (
                            <>
                                <div style={{ width: 1, background: 'var(--border-subtle)', alignSelf: 'stretch', margin: '0 2px' }} />
                                {roomOptions.map(o => (
                                    <FilterPill key={o.key} label={o.label} active={roomFilter === o.key} onClick={() => setRoomFilter(o.key)} />
                                ))}
                            </>
                        )}
                    </div>
                </div>

                {hist.length > 0 ? (
                    <LineChart data={hist} labels={city.labels || []} height={300} />
                ) : (
                    <div style={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-3)', fontSize: 14 }}>
                        Données non disponibles pour ce filtre
                    </div>
                )}
            </div>

            {/* Footer note */}
            <p style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 20, fontFamily: 'var(--font-mono)', lineHeight: 1.6 }}>
                Les données sont issues des Demandes de Valeurs Foncières (DVF) publiées par la Direction Générale des Finances Publiques.
                Elles représentent les transactions immobilières enregistrées auprès des services de publicité foncière.
            </p>
        </main>
    );
}

export default Commune;
