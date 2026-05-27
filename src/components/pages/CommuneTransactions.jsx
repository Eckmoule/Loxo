import { useState, useMemo, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async'
import { SEO_CONFIG } from '../../config/seo'
import { getTransactionsCommune, getAnneesDisponibles } from '../../services/transactionsService';
import { getCommuneByCode } from '../../services/communeService';
import { supabase } from '../../lib/supabase';
import Icon from '../common/Icon';
import './CommuneTransactions.css';

// ── Helpers dates et formatage ──
const MONTHS_FR_LONG = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];

function fmtDateLong(iso) {
    const d = new Date(iso);
    return `${d.getDate()} ${MONTHS_FR_LONG[d.getMonth()]} ${d.getFullYear()}`;
}

function fmtPrice(n) {
    return n.toLocaleString('fr-FR') + ' €';
}

function getYear(iso) {
    return new Date(iso).getFullYear();
}

// ── Valeurs par défaut des filtres ──
const DEFAULTS = {
    type: 'tous',
    annees: [],
    prix_total: [0, 10000000], // Min/max à ajuster dynamiquement
    prix_m2: [0, 20000],
    rue: '',
};

// ── Filter logic ──
function applyFilters(tx, f) {
    return tx.filter(t => {
        if (f.type === 'maisons' && t.type_local !== 'M') return false;
        if (f.type === 'appartements' && t.type_local !== 'A') return false;
        if (f.annees.length && !f.annees.includes(getYear(t.date_mutation))) return false;
        if (t.valeur_fonciere < f.prix_total[0] || t.valeur_fonciere > f.prix_total[1]) return false;
        if (t.prix_m2 < f.prix_m2[0] || t.prix_m2 > f.prix_m2[1]) return false;
        if (f.rue && !t.adresse.toLowerCase().includes(f.rue.toLowerCase())) return false;
        return true;
    });
}

function sortTx(tx, sort) {
    const arr = [...tx];
    switch (sort) {
        case 'date_desc': arr.sort((a, b) => b.date_mutation.localeCompare(a.date_mutation)); break;
        case 'date_asc': arr.sort((a, b) => a.date_mutation.localeCompare(b.date_mutation)); break;
        case 'prix_asc': arr.sort((a, b) => a.valeur_fonciere - b.valeur_fonciere); break;
        case 'prix_desc': arr.sort((a, b) => b.valeur_fonciere - a.valeur_fonciere); break;
        case 'ppm2_asc': arr.sort((a, b) => a.prix_m2 - b.prix_m2); break;
        case 'ppm2_desc': arr.sort((a, b) => b.prix_m2 - a.prix_m2); break;
    }
    return arr;
}

// ── Calculer les min/max dynamiquement ──
function getStatsFromTransactions(transactions) {
    if (!transactions || transactions.length === 0) {
        return {
            prix_total_min: 0,
            prix_total_max: 1000000,
            prix_m2_min: 0,
            prix_m2_max: 10000,
        };
    }

    return {
        prix_total_min: Math.min(...transactions.map(t => t.valeur_fonciere)),
        prix_total_max: Math.max(...transactions.map(t => t.valeur_fonciere)),
        prix_m2_min: Math.min(...transactions.map(t => t.prix_m2)),
        prix_m2_max: Math.max(...transactions.map(t => t.prix_m2)),
    };
}

// ── UI Components ──
function Group({ label, children }) {
    return (
        <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-2)', marginBottom: 8, fontFamily: 'var(--font-sans)' }}>
                {label}
            </div>
            {children}
        </div>
    );
}

function Sublabel({ children }) {
    return (
        <div style={{ fontSize: 11, color: 'var(--text-3)', marginBottom: 6, fontFamily: 'var(--font-mono)' }}>
            {children}
        </div>
    );
}

function Pill({ active, onClick, children }) {
    return (
        <button onClick={onClick} style={{
            padding: '6px 12px', borderRadius: 99, fontSize: 12,
            border: `1px solid ${active ? 'var(--accent)' : 'var(--border)'}`,
            background: active ? 'var(--accent-subtle)' : 'var(--surface)',
            color: active ? 'var(--accent-text)' : 'var(--text-2)',
            cursor: 'pointer', fontFamily: 'var(--font-sans)', fontWeight: active ? 500 : 400,
            transition: 'all 0.15s',
        }}>
            {children}
        </button>
    );
}

function RangeSlider({ min, max, value, onChange, step = 1, format = v => v }) {
    return (
        <div>
            <div className="range-slider">
                <div className="range-slider__track">
                    <div
                        className="range-slider__range"
                        style={{
                            left: `${((value[0] - min) / (max - min)) * 100}%`,
                            width: `${((value[1] - value[0]) / (max - min)) * 100}%`
                        }}
                    />
                </div>

                <input
                    type="range"
                    min={min}
                    max={max}
                    value={value[0]}
                    step={step}
                    onChange={e => onChange([+e.target.value, value[1]])}
                    className="range-slider__input range-slider__input--min"
                />

                <input
                    type="range"
                    min={min}
                    max={max}
                    value={value[1]}
                    step={step}
                    onChange={e => onChange([value[0], +e.target.value])}
                    className="range-slider__input range-slider__input--max"
                />
            </div>

            <div className="range-slider__labels">
                <span>{format(value[0])}</span>
                <span>{format(value[1])}</span>
            </div>
        </div>
    );
}

// ── Filters panel ──
function FiltersPanel({ filters, onChange, onReset, count }) {
    const set = (k, v) => onChange({ ...filters, [k]: v });
    const toggle = (k, v) => {
        const arr = filters[k];
        set(k, arr.includes(v) ? arr.filter(x => x !== v) : [...arr, v]);
    };

    return (
        <aside className="filters-panel">
            <div className="filters-panel__header">
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ color: 'var(--text-2)' }}>
                        <path d="M2 3h10M3.5 7h7M5 11h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                    <h3 className="filters-panel__title">Filtres</h3>
                </div>
                <button onClick={onReset} className="filters-panel__reset">
                    Réinitialiser
                </button>
            </div>

            <div className="filters-panel__content">
                {/* Type de bien */}
                <Group label="Type de bien">
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        {[['tous', 'Tous'], ['maisons', 'Maisons'], ['appartements', 'Appartements']].map(([k, l]) => (
                            <Pill key={k} active={filters.type === k} onClick={() => set('type', k)}>{l}</Pill>
                        ))}
                    </div>
                </Group>

                {/* Période */}
                <Group label="Période">
                    <Sublabel>Année</Sublabel>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
                        {filters.anneesDisponibles?.map(y => (
                            <Pill key={y} active={filters.annees.includes(y)} onClick={() => toggle('annees', y)}>{y}</Pill>
                        ))}
                    </div>
                </Group>

                {/* Prix total */}
                <Group label="Prix total">
                    <RangeSlider
                        min={filters.prix_total_min || 0}
                        max={filters.prix_total_max || 1000000}
                        value={filters.prix_total}
                        onChange={v => set('prix_total', v)}
                        step={10000}
                        format={v => (v / 1000).toFixed(0) + 'k €'}
                    />
                </Group>

                {/* Prix au m² */}
                <Group label="Prix au m²">
                    <RangeSlider
                        min={filters.prix_m2_min || 0}
                        max={filters.prix_m2_max || 20000}
                        value={filters.prix_m2}
                        onChange={v => set('prix_m2', v)}
                        step={100}
                        format={v => v.toLocaleString('fr-FR') + ' €'}
                    />
                </Group>

                {/* Recherche rue */}
                <Group label="Recherche par rue">
                    <input
                        type="text"
                        value={filters.rue}
                        onChange={e => set('rue', e.target.value)}
                        placeholder="Ex: Garibaldi"
                        className="filters-panel__input"
                    />
                </Group>

                {/* Compteur */}
                <div className="filters-panel__count">
                    {count} transaction{count > 1 ? 's' : ''} trouvée{count > 1 ? 's' : ''}
                </div>
            </div>
        </aside>
    );
}

// ── Transaction Card ──
function TxCardB({ tx }) {
    const isApt = tx.type_local === 'A';

    return (
        <div className="tx-card">
            {/* Header */}
            <div className="tx-card__header">
                <div className="tx-card__type-badge" style={{
                    background: isApt ? 'oklch(94% 0.04 305)' : 'oklch(94% 0.04 55)',
                    color: isApt ? 'oklch(62% 0.18 305)' : 'oklch(62% 0.18 55)',
                }}>
                    {isApt ? 'Appartement' : 'Maison'}
                </div>
            </div>

            {/* Prix */}
            <div className="tx-card__price-group">
                <div className="tx-card__price-main">{fmtPrice(tx.valeur_fonciere)}</div>
                <div className="tx-card__price-secondary">
                    <span className="tx-card__price-m2">{fmtPrice(tx.prix_m2)}/m²</span>
                </div>
            </div>

            {/* Specs */}
            <div className="tx-card__specs">
                <div className="tx-card__spec">
                    <span className="tx-card__spec-icon">📐</span>
                    <span className="tx-card__spec-value">{tx.surface_reelle_bati} m²</span>
                </div>
                {tx.nombre_pieces_principales && (
                    <div className="tx-card__spec">
                        <span className="tx-card__spec-icon">🚪</span>
                        <span className="tx-card__spec-value">{tx.nombre_pieces_principales} pièce{tx.nombre_pieces_principales > 1 ? 's' : ''}</span>
                    </div>
                )}
                {tx.surface_terrain && (
                    <div className="tx-card__spec">
                        <span className="tx-card__spec-icon">🌳</span>
                        <span className="tx-card__spec-value">{tx.surface_terrain} m² terrain</span>
                    </div>
                )}
            </div>

            {/* Address */}
            <div className="tx-card__address">{tx.adresse}</div>

            {/* Footer - Date */}
            <div className="tx-card__footer">
                <Icon name="calendar" size={12} />
                <span>{fmtDateLong(tx.date_mutation)}</span>
            </div>
        </div>
    );
}

// ── Empty State ──
function EmptyState({ onReset }) {
    return (
        <div className="empty-state">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" style={{ color: 'var(--text-3)', marginBottom: 16 }}>
                <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
                <path d="M18 28c0-3.3 2.7-6 6-6s6 2.7 6 6M24 18v-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 600, color: 'var(--text-1)', marginBottom: 8 }}>
                Aucune transaction trouvée
            </h3>
            <p style={{ fontSize: 14, color: 'var(--text-3)', marginBottom: 20, lineHeight: 1.6 }}>
                Essayez d'ajuster vos filtres pour voir plus de résultats.
            </p>
            <button onClick={onReset} className="empty-state__reset-btn">
                Réinitialiser les filtres
            </button>
        </div>
    );
}

// ── Composant principal ──
function CommuneTransactions() {
    const { codeCommune } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    // Récupérer typeFilter depuis location state (passé par Commune.jsx)
    const initialTypeFilter = location.state?.typeFilter || 'tous';

    const [commune, setCommune] = useState(null);

    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        ...DEFAULTS,
        type: initialTypeFilter,
    });
    const [sort, setSort] = useState('date_desc');
    const [limit, setLimit] = useState(20);
    const [cachedYears, setCachedYears] = useState([]);
    const [filtersOpen, setFiltersOpen] = useState(false);

    // Charger les transactions
    useEffect(() => {
        async function loadInitialTransactions() {
            if (!commune) return;

            setLoading(true);

            // 1. Récupérer les années disponibles
            const anneesDisponibles = await getAnneesDisponibles(commune.code_commune);
            const deuxDernieresAnnees = anneesDisponibles.slice(0, 2);

            // 2. Charger uniquement les transactions des 2 dernières années
            const data = await getTransactionsCommune(commune.code_commune, deuxDernieresAnnees);

            setTransactions(data);
            setCachedYears(deuxDernieresAnnees);

            // 3. Ajuster les filtres
            const stats = getStatsFromTransactions(data);

            setFilters(prev => ({
                ...prev,
                annees: deuxDernieresAnnees,
                anneesDisponibles: anneesDisponibles,
                prix_total: [stats.prix_total_min, stats.prix_total_max],
                prix_m2: [stats.prix_m2_min, stats.prix_m2_max],
                prix_total_min: stats.prix_total_min,
                prix_total_max: stats.prix_total_max,
                prix_m2_min: stats.prix_m2_min,
                prix_m2_max: stats.prix_m2_max,
            }));

            setLoading(false);
        }

        loadInitialTransactions();
    }, [commune]);

    // Charger la commune depuis Supabase ------------- A REVOIR ----------------
    useEffect(() => {
        async function loadCommune() {
            const data = await getCommuneByCode(codeCommune);
            setCommune(data);
            if (!data) setLoading(false);
        }

        loadCommune();
    }, [codeCommune]);

    // Recharger les transactions quand les années sélectionnées changent
    useEffect(() => {
        async function loadMissingYears() {
            if (!commune || !filters.annees || filters.annees.length === 0) return;

            // Trouver les années qui ne sont pas encore en cache
            const missingYears = filters.annees.filter(y => !cachedYears.includes(y));

            if (missingYears.length === 0) return; // Toutes les années sont déjà chargées

            setLoading(true);

            // Charger uniquement les années manquantes
            const newData = await getTransactionsCommune(commune.code_commune, missingYears);

            // Fusionner avec les données existantes
            setTransactions(prev => [...prev, ...newData]);
            setCachedYears(prev => [...prev, ...missingYears]);

            setLoading(false);
        }

        loadMissingYears();
    }, [filters.annees, commune, cachedYears]);

    // Appliquer filtres et tri
    const filtered = useMemo(() => {
        const f = applyFilters(transactions, filters);
        return sortTx(f, sort);
    }, [transactions, filters, sort]);

    const visible = filtered.slice(0, limit);

    // Scroll infini
    useEffect(() => {
        function handleScroll() {
            if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500) {
                setLimit(prev => Math.min(prev + 20, filtered.length));
            }
        }
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [filtered.length]);

    if (!commune) {
        return (
            <div className="commune-transactions">
                <div className="commune-error">
                    <h2>Commune introuvable</h2>
                    <button onClick={() => navigate('/')} className="commune-back-btn">
                        Retour à l'accueil
                    </button>
                </div>
            </div>
        );
    }

    const handleReset = () => {
        const sortedYears = [...filters.anneesDisponibles].sort((a, b) => b - a);
        const defaultYears = sortedYears.slice(0, 2); // ← 2 dernières années
        setFilters({
            ...DEFAULTS,
            prix_total: [filters.prix_total_min, filters.prix_total_max],
            prix_m2: [filters.prix_m2_min, filters.prix_m2_max],
            prix_total_min: filters.prix_total_min,
            prix_total_max: filters.prix_total_max,
            prix_m2_min: filters.prix_m2_min,
            prix_m2_max: filters.prix_m2_max,
            anneesDisponibles: filters.anneesDisponibles,
            annees: defaultYears,
        });
    };

    if (loading) {
        return (
            <div className="commune-transactions">
                <div className="commune-error">
                    <h2>Chargement des transactions...</h2>
                </div>
            </div>
        );
    }

    return (
        <>
            <Helmet>
                <title>{`Transactions immobilières ${commune.nom_commune} (${commune.code_postal[0]}) - Détail par bien | ${SEO_CONFIG.SITE_NAME}`}</title>
                <meta
                    name="description"
                    content={`Liste complète des transactions immobilières à ${commune.nom_commune} : prix, surface, type de bien. Filtrez par période, prix, rue. Données DVF ${SEO_CONFIG.DATA_PERIOD_LABEL}.`}
                />
                <meta
                    name="keywords"
                    content={`transactions immobilières ${commune.nom_commune}, ventes immobilières ${commune.code_postal[0]}, détail transactions DVF ${commune.nom_commune}`}
                />

                {/* Open Graph */}
                <meta property="og:title" content={`Transactions immobilières ${commune.nom_commune} - Loxo`} />
                <meta property="og:description" content={`Liste des transactions immobilières à ${commune.nom_commune}. Données officielles DVF 2021-2025.`} />
                <meta property="og:url" content={`https://loxo.fr/commune/${commune.code_commune}/transactions`} />
                <meta property="og:image" content="https://loxo.fr/og-image.png" />
            </Helmet>
            <div className="commune-transactions">
                <main className="commune-transactions__main">
                    {/* Header */}
                    <div className="commune-transactions__header">
                        <div className="commune-transactions__header-top">
                            <h1 className="commune-transactions__title">{commune.nom_commune}</h1>
                            <button onClick={() => navigate(`/commune/${codeCommune}`)} className="commune-back-btn">
                                ← Retour à {commune.nom_commune}
                            </button>
                        </div>
                        <h2 className="commune-transactions__subtitle">
                            Détail des transactions
                        </h2>
                    </div>
                    {/* Layout 2 colonnes */}
                    <div className="commune-transactions__layout">
                        <div className={`filters-panel ${filtersOpen ? 'filters-panel--open' : ''}`}>
                            {/* Header cliquable sur mobile */}
                            <div
                                className="filters-panel__toggle-header"
                                onClick={() => setFiltersOpen(!filtersOpen)}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                        <path d="M2 3h10M3.5 7h7M5 11h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                    </svg>
                                    <span className="filters-panel__title">
                                        Filtres
                                        {filters.annees.length > 0 && ` (${filters.annees.length} années)`}
                                    </span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <button onClick={(e) => {
                                        e.stopPropagation(); setFilters({
                                            ...DEFAULTS,
                                            prix_total: [filters.prix_total_min, filters.prix_total_max],
                                            prix_m2: [filters.prix_m2_min, filters.prix_m2_max],
                                            prix_total_min: filters.prix_total_min,
                                            prix_total_max: filters.prix_total_max,
                                            prix_m2_min: filters.prix_m2_min,
                                            prix_m2_max: filters.prix_m2_max
                                        });
                                    }} className="filters-panel__reset">
                                        Réinitialiser
                                    </button>
                                    <span className="filters-panel__chevron">
                                        {filtersOpen ? '▲' : '▼'}
                                    </span>
                                </div>
                            </div>

                            <FiltersPanel
                                filters={filters}
                                onChange={setFilters}
                                onReset={handleReset}
                                count={filtered.length}
                            />
                        </div>
                        <div>
                            {/* Toolbar */}
                            <div className="commune-transactions__toolbar">
                                <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                                    <div>
                                        <span className="commune-transactions__count">{filtered.length}</span>
                                        <span className="commune-transactions__count-label">
                                            transaction{filtered.length > 1 ? 's' : ''} affichée{filtered.length > 1 ? 's' : ''}
                                        </span>
                                    </div>

                                    {/* Sort */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <span className="commune-transactions__sort-label">Trier :</span>
                                        <select value={sort} onChange={e => setSort(e.target.value)} className="commune-transactions__sort-select">
                                            <option value="date_desc">Date (récent)</option>
                                            <option value="date_asc">Date (ancien)</option>
                                            <option value="prix_desc">Prix décroissant</option>
                                            <option value="prix_asc">Prix croissant</option>
                                            <option value="ppm2_desc">€/m² décroissant</option>
                                            <option value="ppm2_asc">€/m² croissant</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Cards grid */}
                            {filtered.length === 0 ? (
                                <EmptyState onReset={handleReset} />
                            ) : (
                                <>
                                    <div className="commune-transactions__grid">
                                        {visible.map(tx => <TxCardB key={tx.id} tx={tx} />)}
                                    </div>
                                    {limit < filtered.length && (
                                        <div className="commune-transactions__loading">
                                            Chargement de {Math.min(20, filtered.length - limit)} transactions supplémentaires…
                                        </div>
                                    )}
                                    {limit >= filtered.length && filtered.length > 20 && (
                                        <div className="commune-transactions__end">
                                            Fin des résultats · {filtered.length} transactions
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}

export default CommuneTransactions;