import { useState, useEffect, useRef } from 'react';
import { getAggregatsCommune, formatCommuneData } from '../../services/aggregatsService';
import Icon from '../common/Icon';
import './Commune.css';

// ── Configuration fiabilité ──
const FIABILITE_CONFIG = {
    excellent: {
        color: 'var(--positive)',
        bg: 'var(--positive-subtle)',
        label: 'Excellent',
        dot: 'var(--positive)'
    },
    bon: {
        color: 'oklch(62% 0.18 55)',
        bg: 'oklch(94% 0.04 55)',
        label: 'Bon',
        dot: 'oklch(62% 0.18 55)'
    },
    limite: {
        color: 'var(--negative)',
        bg: 'var(--negative-subtle)',
        label: 'Limité',
        dot: 'var(--negative)'
    },
};

// ── Composant Header ──
function CommuneHeader({ commune, fiabilite, onNavigate }) {
    const [alertSent, setAlertSent] = useState(false);
    const f = FIABILITE_CONFIG[fiabilite.niveau];

    return (
        <div className="commune-header">
            <div className="commune-header__content">

                {/* Left — title + meta */}
                <div>
                    <div className="commune-header__title-group">
                        <h1 className="commune-header__title">
                            {commune.nom_commune}
                        </h1>
                        <span className="commune-header__code">
                            {commune.code_postal?.[0] || commune.code_commune}
                        </span>
                    </div>

                    {/* Fiabilité inline */}
                    <div className="commune-header__meta">
                        <div
                            className="commune-header__fiabilite"
                            style={{
                                background: f.bg,
                                border: `1px solid ${f.color}40`,
                            }}
                        >
                            <span
                                className="commune-header__fiabilite-dot"
                                style={{
                                    background: f.dot,
                                    boxShadow: `0 0 0 2px ${f.dot}30`,
                                }}
                            />
                            <span
                                className="commune-header__fiabilite-label"
                                style={{ color: f.color }}
                            >
                                {f.label}
                            </span>
                        </div>
                        <span className="commune-header__meta-text">
                            {fiabilite.total_transactions} transactions · min. {fiabilite.min_trimestre}/trim.
                        </span>
                        <span className="commune-header__meta-text">
                            INSEE {commune.code_commune}
                        </span>
                    </div>
                </div>

                {/* Right — CTAs */}
                <div className="commune-header__actions">
                    {/* Voir transactions */}
                    <button
                        onClick={() => console.log('Navigation vers micro (à implémenter)')}
                        className="commune-header__btn commune-header__btn--secondary"
                    >
                        <Icon name="document" size={14} color="var(--text-2)" />
                        Voir les transactions
                    </button>

                    {/* Alerte */}
                    <button
                        onClick={() => setAlertSent(a => !a)}
                        className={`commune-header__btn ${alertSent ? 'commune-header__btn--active' : 'commune-header__btn--primary'}`}
                    >
                        {alertSent ? (
                            <>
                                <Icon name="check" size={13} />
                                Alerte activée
                            </>
                        ) : (
                            <>
                                <Icon name="bell" size={13} color="white" />
                                Être alerté des nouveaux prix
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ── Composant FiltresTabs ──
function FiltresTabs({ filtresDisponibles, active, onChange }) {
    const filtres = [
        { key: 'tous', label: 'Tous', disponible: filtresDisponibles.tous },
        { key: 'appartements', label: 'Appartements', disponible: filtresDisponibles.appartements },
        { key: 'maisons', label: 'Maisons', disponible: filtresDisponibles.maisons }
    ];

    return (
        <div className="filtres-tabs">
            {filtres.map(f => (
                <button
                    key={f.key}
                    onClick={() => onChange(f.key)}
                    disabled={!f.disponible}
                    className={`filtres-tabs__btn ${active === f.key ? 'filtres-tabs__btn--active' : ''}`}
                >
                    {f.label}
                </button>
            ))}
        </div>
    );
}

// ── Helper pour couleur des barres ──
function barColor(nb) {
    if (nb >= 10) return 'var(--positive)';
    if (nb >= 5) return 'oklch(62% 0.18 55)';
    return 'var(--negative)';
}

// ── Composant ComboChart ──
function ComboChart({ data }) {
    const [tooltip, setTooltip] = useState(null);

    if (!data || data.length === 0) {
        return (
            <div style={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-3)', fontSize: 14 }}>
                Aucune donnée disponible
            </div>
        );
    }

    const W = 800, H = 340;
    const pad = { top: 24, right: 60, bottom: 60, left: 72 };
    const iW = W - pad.left - pad.right;
    const iH = H - pad.top - pad.bottom;

    // Échelles
    const prixValues = data.map(d => d.prix_m2);
    const minPrix = Math.min(...prixValues) * 0.97;
    const maxPrix = Math.max(...prixValues) * 1.02;
    const maxNb = Math.max(...data.map(d => d.nb));

    const xOf = i => (i / (data.length - 1)) * iW;
    const yOfPrix = v => iH - ((v - minPrix) / (maxPrix - minPrix)) * iH;
    const hOfNb = nb => (nb / maxNb) * iH; // 25% de la hauteur max pour les barres

    // Points ligne prix
    const pts = data.map((d, i) => ({
        x: xOf(i),
        y: yOfPrix(d.prix_m2),
        prix: d.prix_m2,
        nb: d.nb,
        label: d.trimestre,
        i
    }));

    // Chemin ligne prix (bezier)
    const linePath = pts.reduce((acc, pt, i) => {
        if (i === 0) return `M${pt.x},${pt.y}`;
        const prev = pts[i - 1];
        const cx = (prev.x + pt.x) / 2;
        return `${acc} C${cx},${prev.y} ${cx},${pt.y} ${pt.x},${pt.y}`;
    }, '');

    // Graduations Y (prix)
    const step = (maxPrix - minPrix) / 4;
    const yTicks = Array.from({ length: 5 }, (_, i) => {
        const v = minPrix + step * i;
        const labelK = Math.round(v / 100) / 10; // Arrondi à 1 décimale
        return { y: yOfPrix(v), label: labelK + 'k' };
    });

    // Labels X (trimestres)
    const xLabels = data.map((d, i) => ({ x: xOf(i), label: d.trimestre, i }))
        .filter((_, i) => data.length <= 10 ? true : i % 2 === 0);

    const gradId = `grad_${Math.random().toString(36).slice(2)}`;

    return (
        <div style={{ position: 'relative', width: '100%' }}>
            <svg
                viewBox={`0 0 ${W} ${H}`}
                style={{ width: '100%', height: 'auto', display: 'block' }}
                onMouseLeave={() => setTooltip(null)}
            >
                <defs>
                    <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.12" />
                        <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.02" />
                    </linearGradient>
                </defs>

                <g transform={`translate(${pad.left},${pad.top})`}>
                    {/* Grille Y */}
                    {yTicks.map((t, i) => (
                        <g key={i}>
                            <line x1={0} y1={t.y} x2={iW} y2={t.y}
                                stroke="var(--border-subtle)" strokeWidth="1" />
                            <text x={-12} y={t.y + 4} textAnchor="end"
                                fontSize="12" fill="var(--text-3)"
                                fontFamily="var(--font-mono)">{t.label}</text>
                        </g>
                    ))}

                    {/* Label axe Y gauche */}
                    <text x={-60} y={iH / 2} textAnchor="middle"
                        fontSize="11" fill="var(--text-3)"
                        fontFamily="var(--font-sans)"
                        transform={`rotate(-90, -60, ${iH / 2})`}>
                        €/m²
                    </text>

                    {/* Graduations Y droite (nb transactions) */}
                    {(() => {
                        // Créer 5 graduations régulières de 0 à maxNb
                        const nbTicks = Array.from({ length: 5 }, (_, i) => {
                            const nb = Math.ceil((maxNb / 4) * i);
                            const y = iH - (nb / maxNb) * iH;
                            return { nb, y };
                        });

                        return nbTicks.map(({ nb, y }) => (
                            <g key={nb}>
                                <text x={iW + 12} y={y + 4} textAnchor="start"
                                    fontSize="11" fill="var(--text-3)"
                                    fontFamily="var(--font-mono)">{nb}</text>
                            </g>
                        ));
                    })()}

                    {/* Label axe Y droit */}
                    <text x={iW + 48} y={iH / 2} textAnchor="middle"
                        fontSize="11" fill="var(--text-3)"
                        fontFamily="var(--font-sans)"
                        transform={`rotate(90, ${iW + 48}, ${iH / 2})`}>
                        Nb transactions
                    </text>

                    {/* Labels X */}
                    {xLabels.map(({ x, label }) => (
                        <text key={label} x={x} y={iH + 20} textAnchor="middle"
                            fontSize="11" fill="var(--text-3)"
                            fontFamily="var(--font-sans)">{label}</text>
                    ))}

                    {/* Barres volume */}
                    {data.map((d, i) => {
                        const h = hOfNb(d.nb);
                        const x = xOf(i);
                        return (
                            <rect
                                key={i}
                                x={x - 4}
                                y={iH - h}
                                width={8}
                                height={h}
                                fill={barColor(d.nb)}
                                opacity={0.6}
                                rx={2}
                            />
                        );
                    })}

                    {/* Zone sous la ligne */}
                    <path
                        d={`${linePath} L${pts[pts.length - 1].x},${iH} L0,${iH} Z`}
                        fill={`url(#${gradId})`}
                    />

                    {/* Ligne prix */}
                    <path d={linePath} fill="none" stroke="var(--accent)"
                        strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

                    {/* Points + zones hover */}
                    {pts.map((pt, i) => (
                        <g key={i}
                            onMouseEnter={() => setTooltip(pt)}
                            style={{ cursor: 'crosshair' }}
                        >
                            <rect x={pt.x - iW / data.length / 2} y={0}
                                width={iW / data.length} height={iH}
                                fill="transparent" />
                            <circle cx={pt.x} cy={pt.y} r={tooltip?.i === i ? 5 : 3.5}
                                fill="var(--accent)" stroke="var(--surface)" strokeWidth="2"
                                style={{ transition: 'r 0.1s' }} />
                        </g>
                    ))}

                    {/* Tooltip */}
                    {tooltip && (() => {
                        const tw = 180, th = 70;
                        const tx = Math.min(Math.max(tooltip.x - tw / 2, 4), iW - tw - 4);
                        // Si trop haut, afficher en dessous du point
                        const ty = tooltip.y < th + 20
                            ? tooltip.y + 14
                            : tooltip.y - th - 14;
                        return (
                            <g>
                                <line x1={tooltip.x} y1={0} x2={tooltip.x} y2={iH}
                                    stroke="var(--accent)" strokeWidth="1" strokeDasharray="4 3" strokeOpacity="0.5" />
                                <rect x={tx} y={ty} width={tw} height={th} rx="8"
                                    fill="var(--surface)" stroke="var(--border)" />
                                <text x={tx + tw / 2} y={ty + 18} textAnchor="middle"
                                    fontSize="11" fill="var(--text-3)" fontFamily="var(--font-sans)">
                                    {tooltip.label}
                                </text>
                                <text x={tx + tw / 2} y={ty + 40} textAnchor="middle"
                                    fontSize="16" fontWeight="600" fill="var(--text-1)"
                                    fontFamily="var(--font-mono)">
                                    {tooltip.prix.toLocaleString('fr-FR')} €/m²
                                </text>
                                <text x={tx + tw / 2} y={ty + 58} textAnchor="middle"
                                    fontSize="12" fill="var(--text-3)"
                                    fontFamily="var(--font-mono)">
                                    {tooltip.nb} transaction{tooltip.nb > 1 ? 's' : ''}
                                </text>
                            </g>
                        );
                    })()}

                    {/* Légende */}
                    <g transform={`translate(0, ${iH + 48})`}>
                        {/* Légende volume (barres) */}
                        {[
                            { label: '≥ 10 transactions', color: 'var(--positive)', x: 0 },
                            { label: '5–9 transactions', color: 'oklch(62% 0.18 55)', x: 140 },
                            { label: '< 5 transactions', color: 'var(--negative)', x: 270 }
                        ].map(({ label, color, x }) => (
                            <g key={label} transform={`translate(${x}, 0)`}>
                                <rect x={0} y={-8} width={8} height={12} rx={2} fill={color} opacity={0.6} />
                                <text x={14} y={0} fontSize="11" fill="var(--text-3)" fontFamily="var(--font-sans)">
                                    {label}
                                </text>
                            </g>
                        ))}

                        {/* Légende prix (ligne) */}
                        <g transform={`translate(400, 0)`}>
                            <line x1={0} y1={0} x2={20} y2={0} stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" />
                            <text x={26} y={0} fontSize="11" fill="var(--text-3)" fontFamily="var(--font-sans)">
                                Prix médian €/m²
                            </text>
                        </g>
                    </g>
                </g>
            </svg>
        </div>
    );
}

// ── Composant InfoTooltip ──
function InfoTooltip({ text }) {
    const [visible, setVisible] = useState(false);

    return (
        <div
            className="info-tooltip"
            onMouseEnter={() => setVisible(true)}
            onMouseLeave={() => setVisible(false)}
        >
            <button className="info-tooltip__btn">
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M5 4.5v3M5 2.5v.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                </svg>
            </button>

            {visible && (
                <div className="info-tooltip__popup">
                    <div className="info-tooltip__arrow" />
                    <p className="info-tooltip__text">{text}</p>
                </div>
            )}
        </div>
    );
}

// ── Composant principal ──
function Commune({ commune, onNavigate }) {
    const [cityData, setCityData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [typeFilter, setTypeFilter] = useState('tous');

    // Charger les données
    useEffect(() => {
        async function loadData() {
            if (!commune) return;

            setLoading(true);
            const agregats = await getAggregatsCommune(commune.code_commune);
            const formatted = formatCommuneData(agregats, typeFilter);
            setCityData(formatted);
            setLoading(false);
        }

        loadData();
    }, [commune, typeFilter]);

    // Navigation clavier
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' || e.key === 'Backspace') {
                onNavigate('home');
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [onNavigate]);

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

    if (!cityData || !cityData.graphique_prix) {
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

    return (
        <div style={{ minHeight: 'calc(100vh - 56px)', background: 'var(--bg)' }}>
            <main style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px 80px' }}>

                {/* Header */}
                <CommuneHeader
                    commune={commune}
                    fiabilite={cityData.fiabilite}
                    onNavigate={onNavigate}
                />

                {/* Graphique principal */}
                <div className="chart-card">
                    <div className="chart-card__header">
                        <div className="chart-card__title-group">
                            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" className="chart-card__icon">
                                <path d="M2 12l4-4.5 3 3 4.5-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <h2 className="chart-card__title">
                                Évolution prix médian / m² + volume
                            </h2>
                            <span className="chart-card__subtitle">DVF · Trimestriel</span>
                            <InfoTooltip text="Ces données sont calculées sur l'ensemble des transactions trouvées sur DVF pour la période. Le volume de transactions est indiqué pour donner du contexte sur la pertinence de l'information." />
                        </div>
                        <FiltresTabs
                            filtresDisponibles={cityData.filtres_disponibles}
                            active={typeFilter}
                            onChange={setTypeFilter}
                        />
                    </div>
                    <ComboChart data={cityData.graphique_prix} />
                </div>

                {/* TODO: Stats et évolution annuelle */}
                <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-3)' }}>
                    Stats et évolution annuelle à venir...
                </div>

            </main>
        </div>
    );
}

export default Commune;