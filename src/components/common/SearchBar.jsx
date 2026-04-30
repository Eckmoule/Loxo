import { useState, useRef, useEffect } from 'react';
import Icon from './Icon';
import { useDebounce } from '../../utils/useDebounce';
import { searchCommunes } from '../../services/communeService';
import './SearchBar.css';

function SearchBar({ onSelect }) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const inputRef = useRef(null);

    const debouncedQuery = useDebounce(query, 300);

    // Recherche autocomplétion
    useEffect(() => {
        async function fetchResults() {
            if (debouncedQuery.length < 2) {
                setResults([]);
                setShowDropdown(false);
                return;
            }

            setLoading(true);
            const communes = await searchCommunes(debouncedQuery);
            setResults(communes);
            setShowDropdown(true);
            setLoading(false);
        }

        fetchResults();
    }, [debouncedQuery]);


    useEffect(() => {
        setSelectedIndex(-1);
    }, [results]);

    const handleSelect = (commune) => {
        if (onSelect) {
            onSelect(commune);
        }
        setQuery('');
        setResults([]);
        setShowDropdown(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Si on a des résultats, sélectionner le premier
        if (results.length > 0) {
            handleSelect(results[0]);
        }
    };

    const formatDisplay = (commune) => {
        return `${commune.nom_commune} (${commune.code_postal[0]})`;
    };

    const handleKeyDown = (e) => {
        if (!showDropdown || results.length === 0) return;

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setSelectedIndex((prev) =>
                    prev < results.length - 1 ? prev + 1 : prev
                );
                break;
            case 'ArrowUp':
                e.preventDefault();
                setSelectedIndex((prev) => prev > 0 ? prev - 1 : -1);
                break;
            case 'Enter':
                e.preventDefault();
                if (selectedIndex >= 0) {
                    handleSelect(results[selectedIndex]);
                }
                break;
            case 'Escape':
                setShowDropdown(false);
                setSelectedIndex(-1);
                break;
        }
    };

    return (
        <form onSubmit={handleSubmit} className="search-form">
            <div className={`search-input-wrapper ${showDropdown ? 'search-input-wrapper--focused' : ''}`}>
                <div className="search-input-wrapper__icon">
                    <Icon name="search" size={16} />
                </div>

                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    onFocus={() => query.length >= 2 && setShowDropdown(true)}
                    onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
                    onKeyDown={handleKeyDown}
                    placeholder="Paris,Lyon,69100,Bordeaux..."
                    className="search-input"
                    autoFocus
                />

                {query && (
                    <button
                        type="button"
                        className="search-clear"
                        onClick={() => {
                            setQuery('');
                            setResults([]);
                            setShowDropdown(false);
                        }}
                        aria-label="Effacer la recherche"
                    >
                        ✕
                    </button>
                )}

                <button type="submit" className="search-submit">
                    Rechercher
                </button>
            </div>

            {/* Dropdown */}
            {showDropdown && (
                <div className="search-dropdown">
                    {loading && (
                        <div className="search-loading">Recherche...</div>
                    )}

                    {!loading && results.length === 0 && (
                        <div className="search-no-results">
                            <p>Aucune commune trouvée</p>
                            <p className="search-hint">Essayez avec un code postal ou une autre commune</p>
                        </div>
                    )}

                    {!loading && results.length > 0 && (
                        <ul className="search-results">
                            {results.map((commune) => (
                                <li
                                    key={commune.code_commune}
                                    className={`search-result-item ${selectedIndex === results.indexOf(commune) ? 'search-result-item--selected' : ''}`}
                                    onMouseDown={(e) => {
                                        e.preventDefault();
                                        handleSelect(commune);
                                    }}
                                >
                                    <Icon name="mapPin" size={12} className="search-dropdown__item-icon" />
                                    {formatDisplay(commune)}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </form>
    );
}

export default SearchBar;
