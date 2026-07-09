import { useState, useRef, useEffect } from 'react';
import { Button } from '../../commons/Button';
import { SORT_OPTIONS } from './sortUtils';

export function SortMenu({ activeSort, onSortChange }) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div style={{ position: 'relative' }} ref={menuRef}>
      <Button variant="ghost" size="md" onClick={() => setShowMenu((v) => !v)}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="4" y1="6" x2="20" y2="6"/>
          <line x1="8" y1="12" x2="16" y2="12"/>
          <line x1="11" y1="18" x2="13" y2="18"/>
        </svg>
        <span className="hidden sm:inline">Filtrer</span>
      </Button>

      {showMenu && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 6px)',
          right: 0,
          background: 'white',
          border: '1px solid var(--color-sl-200)',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-lg)',
          minWidth: '200px',
          zIndex: 100,
          overflow: 'hidden',
          padding: '8px 0',
        }}>
          <p style={{
            padding: '6px 16px 10px',
            fontSize: '0.75rem',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: 'var(--color-sl-400)',
            fontFamily: 'var(--font-body)',
          }}>
            Trier par
          </p>

          {SORT_OPTIONS.map((opt) => (
            <label
              key={opt.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 16px',
                cursor: 'pointer',
                background: activeSort === opt.id ? 'var(--color-sl-50)' : 'white',
                transition: 'background 150ms ease',
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-sl-50)'}
              onMouseLeave={(e) => e.currentTarget.style.background = activeSort === opt.id ? 'var(--color-sl-50)' : 'white'}
            >
              <input
                type="radio"
                name="sort"
                value={opt.id}
                checked={activeSort === opt.id}
                onChange={() => { onSortChange(opt.id); setShowMenu(false); }}
                style={{
                  accentColor: 'var(--color-brand)',
                  width: '16px',
                  height: '16px',
                  cursor: 'pointer',
                }}
              />
              <span style={{
                fontSize: '0.875rem',
                fontFamily: 'var(--font-body)',
                color: activeSort === opt.id ? 'var(--color-brand)' : 'var(--color-sl-700)',
                fontWeight: activeSort === opt.id ? '600' : '400',
              }}>
                {opt.label}
              </span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}