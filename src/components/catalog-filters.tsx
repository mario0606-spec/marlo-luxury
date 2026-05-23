"use client";

import {
  useRouter,
  useSearchParams,
  usePathname,
} from "next/navigation";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

const CATEGORIES = [
  { value: "", label: "Alle Kategorien" },
  { value: "WATCH", label: "Uhren" },
  { value: "BAG", label: "Taschen" },
  { value: "ACCESSORY", label: "Accessoires" },
];

const PRICE_RANGES = [
  { value: "", label: "Alle Preise" },
  { value: "0-10000", label: "Unter €700/Woche" },
  { value: "10000-50000", label: "€700–€3.500/Woche" },
  { value: "50000-200000", label: "€3.500–€14.000/Woche" },
  { value: "200000-", label: "€14.000+/Woche" },
];

const SORT_OPTIONS = [
  { value: "", label: "Empfohlen" },
  { value: "price_asc", label: "Preis aufsteigend" },
  { value: "price_desc", label: "Preis absteigend" },
  { value: "newest", label: "Neueste zuerst" },
];

interface CatalogFiltersProps {
  category: string;
  priceRange: string;
  search: string;
  brand: string;
  available: string;
  sort: string;
  brands: string[];
}

function BrandDropdown({
  brands,
  selected,
  onChange,
}: {
  brands: string[];
  selected: string[];
  onChange: (brands: string[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const label =
    selected.length === 0
      ? "Alle Marken"
      : selected.length === 1
        ? selected[0]
        : `${selected[0]}, +${selected.length - 1}`;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="input-field min-w-40 text-left flex items-center justify-between gap-2"
      >
        <span className="truncate">{label}</span>
        <svg
          className={`w-4 h-4 flex-shrink-0 text-stone-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 w-64 max-h-64 overflow-y-auto bg-white border border-stone-200 shadow-lg z-50">
          {brands.map((b) => {
            const checked = selected.includes(b);
            return (
              <label
                key={b}
                className="flex items-center gap-2 px-4 py-2.5 hover:bg-stone-50 cursor-pointer"
              >
                <span
                  className={`w-4 h-4 border flex-shrink-0 flex items-center justify-center ${
                    checked
                      ? "bg-stone-900 border-stone-900"
                      : "border-stone-400"
                  }`}
                >
                  {checked && (
                    <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </span>
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={checked}
                  onChange={() => {
                    if (checked) {
                      onChange(selected.filter((s) => s !== b));
                    } else {
                      onChange([...selected, b]);
                    }
                  }}
                />
                <span className="text-sm text-stone-900">{b}</span>
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
}

function AvailableToggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-2 cursor-pointer select-none">
      <span className="text-xs tracking-wider uppercase text-stone-700">
        Jetzt verfügbar
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative w-11 h-6 rounded-full transition-colors ${
          checked ? "bg-stone-900" : "bg-stone-200"
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
            checked ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </label>
  );
}

function FilterChips({
  category,
  brand,
  priceRange,
  available,
  onRemove,
  onClearAll,
}: {
  category: string;
  brand: string[];
  priceRange: string;
  available: boolean;
  onRemove: (type: string, value?: string) => void;
  onClearAll: () => void;
}) {
  const chips: { type: string; label: string; value?: string }[] = [];

  if (category) {
    const cat = CATEGORIES.find((c) => c.value === category);
    chips.push({ type: "category", label: cat?.label ?? category });
  }
  for (const b of brand) {
    chips.push({ type: "brand", label: b, value: b });
  }
  if (priceRange) {
    const pr = PRICE_RANGES.find((p) => p.value === priceRange);
    chips.push({ type: "price", label: pr?.label ?? priceRange });
  }
  if (available) {
    chips.push({ type: "available", label: "Jetzt verfügbar" });
  }

  if (chips.length === 0) return null;

  return (
    <div className="mt-4 pt-4 border-t border-stone-100 flex flex-wrap items-center gap-2">
      <span className="text-xs tracking-wider uppercase text-stone-500 mr-1">
        Aktive Filter:
      </span>
      {chips.map((chip, i) => (
        <button
          key={`${chip.type}-${chip.value ?? i}`}
          onClick={() => onRemove(chip.type, chip.value)}
          className="bg-stone-900 text-white text-xs tracking-wider uppercase px-3 py-1.5 flex items-center gap-1.5 min-h-[44px] hover:bg-stone-700 transition-colors"
          aria-label={`Filter entfernen: ${chip.label}`}
        >
          {chip.label}
          <span aria-hidden="true">&times;</span>
        </button>
      ))}
      <button
        onClick={onClearAll}
        className="text-xs tracking-wider uppercase text-stone-500 underline-offset-2 underline hover:text-stone-900 ml-auto"
      >
        Alle löschen
      </button>
    </div>
  );
}

function MobileFilterDrawer({
  open,
  onClose,
  brands,
  category,
  selectedBrands,
  priceRange,
  available,
  onApply,
  itemCount,
}: {
  open: boolean;
  onClose: () => void;
  brands: string[];
  category: string;
  selectedBrands: string[];
  priceRange: string;
  available: boolean;
  onApply: (filters: {
    category: string;
    brand: string[];
    price: string;
    available: boolean;
  }) => void;
  itemCount: number;
}) {
  const [localCategory, setLocalCategory] = useState(category);
  const [localBrands, setLocalBrands] = useState(selectedBrands);
  const [localPrice, setLocalPrice] = useState(priceRange);
  const [localAvailable, setLocalAvailable] = useState(available);
  const [showAllBrands, setShowAllBrands] = useState(false);

  useEffect(() => {
    if (open) {
      setLocalCategory(category);
      setLocalBrands(selectedBrands);
      setLocalPrice(priceRange);
      setLocalAvailable(available);
      setShowAllBrands(false);
    }
  }, [open, category, selectedBrands, priceRange, available]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  const visibleBrands = showAllBrands ? brands : brands.slice(0, 6);

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-stone-900/40"
        onClick={onClose}
      />
      <div className="absolute bottom-0 left-0 right-0 bg-white max-h-[90dvh] overflow-y-auto animate-slide-up">
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-8 h-1 bg-stone-300 rounded-full" />
        </div>

        <div className="flex items-center justify-between px-6 pb-4 border-b border-stone-100">
          <h2 id="filter-drawer-title" className="text-lg font-medium text-stone-900">
            Filter
          </h2>
          <button
            onClick={() => {
              setLocalCategory(category);
              setLocalBrands(selectedBrands);
              setLocalPrice(priceRange);
              setLocalAvailable(available);
            }}
            className="text-xs tracking-wider uppercase text-stone-500 hover:text-stone-900"
          >
            Zurücksetzen
          </button>
        </div>

        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="filter-drawer-title"
          className="px-6 py-4 space-y-6"
        >
          {/* Category pills */}
          <div>
            <p className="text-xs tracking-wider uppercase text-stone-600 mb-3">
              Kategorie
            </p>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((c) => (
                <button
                  key={c.value}
                  onClick={() => setLocalCategory(c.value)}
                  className={`text-xs tracking-wider uppercase px-4 py-2.5 border transition-colors ${
                    localCategory === c.value
                      ? "bg-stone-900 text-white border-stone-900"
                      : "border-stone-200 text-stone-700 hover:border-stone-400"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Brand checkboxes */}
          {brands.length > 0 && (
            <div>
              <p className="text-xs tracking-wider uppercase text-stone-600 mb-3">
                Marke
              </p>
              <div className="space-y-1">
                {visibleBrands.map((b) => {
                  const checked = localBrands.includes(b);
                  return (
                    <label
                      key={b}
                      className="flex items-center gap-2 py-2 cursor-pointer"
                    >
                      <span
                        className={`w-4 h-4 border flex-shrink-0 flex items-center justify-center ${
                          checked
                            ? "bg-stone-900 border-stone-900"
                            : "border-stone-400"
                        }`}
                      >
                        {checked && (
                          <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
                            <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </span>
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={checked}
                        onChange={() => {
                          if (checked) {
                            setLocalBrands(localBrands.filter((s) => s !== b));
                          } else {
                            setLocalBrands([...localBrands, b]);
                          }
                        }}
                      />
                      <span className="text-sm text-stone-900">{b}</span>
                    </label>
                  );
                })}
              </div>
              {!showAllBrands && brands.length > 6 && (
                <button
                  onClick={() => setShowAllBrands(true)}
                  className="text-xs tracking-wider uppercase text-stone-500 underline-offset-2 underline hover:text-stone-900 mt-2"
                >
                  + Weitere Marken anzeigen
                </button>
              )}
            </div>
          )}

          {/* Price radio */}
          <div>
            <p className="text-xs tracking-wider uppercase text-stone-600 mb-3">
              Preis
            </p>
            <div className="space-y-1">
              {PRICE_RANGES.map((p) => (
                <label
                  key={p.value}
                  className="flex items-center gap-2 py-2 cursor-pointer"
                >
                  <span
                    className={`w-4 h-4 rounded-full border flex-shrink-0 flex items-center justify-center ${
                      localPrice === p.value
                        ? "border-stone-900"
                        : "border-stone-400"
                    }`}
                  >
                    {localPrice === p.value && (
                      <span className="w-2 h-2 rounded-full bg-stone-900" />
                    )}
                  </span>
                  <input
                    type="radio"
                    name="price-mobile"
                    className="sr-only"
                    checked={localPrice === p.value}
                    onChange={() => setLocalPrice(p.value)}
                  />
                  <span className="text-sm text-stone-900">{p.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Available toggle */}
          <label className="flex items-center gap-3 py-2 cursor-pointer">
            <span
              className={`w-4 h-4 border flex-shrink-0 flex items-center justify-center ${
                localAvailable
                  ? "bg-stone-900 border-stone-900"
                  : "border-stone-400"
              }`}
            >
              {localAvailable && (
                <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </span>
            <input
              type="checkbox"
              className="sr-only"
              checked={localAvailable}
              onChange={() => setLocalAvailable(!localAvailable)}
            />
            <span className="text-sm text-stone-900">Jetzt verfügbar</span>
          </label>
        </div>

        <div className="px-6 py-4 border-t border-stone-100">
          <button
            onClick={() => {
              onApply({
                category: localCategory,
                brand: localBrands,
                price: localPrice,
                available: localAvailable,
              });
              onClose();
            }}
            className="w-full bg-stone-900 text-white text-sm tracking-wider uppercase py-3.5 hover:bg-stone-800 transition-colors"
          >
            Ergebnisse anzeigen{itemCount > 0 ? ` (${itemCount})` : ""}
          </button>
        </div>
      </div>
    </div>
  );
}

export function CatalogFilters({
  category,
  priceRange,
  search,
  brand,
  available,
  sort,
  brands,
}: CatalogFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const selectedBrands = brand
    ? brand.split(",").map((b) => b.trim()).filter(Boolean)
    : [];
  const isAvailable = available === "1";
  const activeFilterCount =
    (category ? 1 : 0) +
    (selectedBrands.length > 0 ? 1 : 0) +
    (priceRange ? 1 : 0) +
    (isAvailable ? 1 : 0);

  const pushParams = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      }
      params.delete("page");
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams],
  );

  const handleSearch = useCallback(
    (value: string) => {
      clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        pushParams({ q: value });
      }, 350);
    },
    [pushParams],
  );

  const removeChip = useCallback(
    (type: string, value?: string) => {
      if (type === "brand" && value) {
        const next = selectedBrands.filter((b) => b !== value);
        pushParams({ brand: next.join(",") });
      } else if (type === "category") {
        pushParams({ category: "" });
      } else if (type === "price") {
        pushParams({ price: "" });
      } else if (type === "available") {
        pushParams({ available: "" });
      }
    },
    [pushParams, selectedBrands],
  );

  const clearAll = useCallback(() => {
    router.push(pathname);
  }, [router, pathname]);

  const applyMobileFilters = useCallback(
    (filters: {
      category: string;
      brand: string[];
      price: string;
      available: boolean;
    }) => {
      const params = new URLSearchParams();
      if (filters.category) params.set("category", filters.category);
      if (filters.brand.length > 0) params.set("brand", filters.brand.join(","));
      if (filters.price) params.set("price", filters.price);
      if (filters.available) params.set("available", "1");
      if (search) params.set("q", search);
      if (sort) params.set("sort", sort);
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, search, sort],
  );

  return (
    <>
      {/* Desktop filter panel */}
      <div className="hidden md:block">
        {/* Row 1: Search + Category */}
        <div className="flex gap-3 items-end">
          <div className="flex-1 min-w-48">
            <label className="sr-only" htmlFor="catalog-search">Suche</label>
            <input
              id="catalog-search"
              type="search"
              defaultValue={search}
              placeholder="Marke, Modell, Referenz…"
              className="input-field w-full"
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
          <select
            value={category}
            onChange={(e) => pushParams({ category: e.target.value })}
            className="input-field min-w-40"
            aria-label="Kategorie"
          >
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        {/* Row 2: Brand · Price · Available toggle | Sort */}
        <div className="flex gap-3 items-center mt-3">
          {brands.length > 0 && (
            <BrandDropdown
              brands={brands}
              selected={selectedBrands}
              onChange={(next) => pushParams({ brand: next.join(",") })}
            />
          )}
          <select
            value={priceRange}
            onChange={(e) => pushParams({ price: e.target.value })}
            className="input-field min-w-44"
            aria-label="Preisbereich"
          >
            {PRICE_RANGES.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
          <AvailableToggle
            checked={isAvailable}
            onChange={(v) => pushParams({ available: v ? "1" : "" })}
          />
          <div className="border-l border-stone-200 ml-auto pl-4">
            <select
              value={sort}
              onChange={(e) => pushParams({ sort: e.target.value })}
              className="input-field min-w-44"
              aria-label="Sortierung"
            >
              {SORT_OPTIONS.map((s) => (
                <option key={s.value} value={s.value}>
                  {`Sortieren: ${s.label}`}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Filter chips */}
        <FilterChips
          category={category}
          brand={selectedBrands}
          priceRange={priceRange}
          available={isAvailable}
          onRemove={removeChip}
          onClearAll={clearAll}
        />
      </div>

      {/* Mobile: sticky bar */}
      <div className="md:hidden">
        <div className="flex items-center justify-between gap-2 mb-4">
          <button
            onClick={() => setDrawerOpen(true)}
            className="flex items-center gap-2 text-xs tracking-wider uppercase text-stone-900 py-3 px-4 border border-stone-200 hover:border-stone-400 transition-colors"
          >
            Filter
            {activeFilterCount > 0 && (
              <span className="bg-stone-900 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
          <select
            value={sort}
            onChange={(e) => pushParams({ sort: e.target.value })}
            className="input-field text-xs min-w-36"
            aria-label="Sortierung"
          >
            {SORT_OPTIONS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        {/* Mobile chips */}
        {activeFilterCount > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-4">
            {category && (
              <button
                onClick={() => removeChip("category")}
                className="bg-stone-900 text-white text-xs tracking-wider uppercase px-3 py-1.5 flex items-center gap-1.5"
                aria-label={`Filter entfernen: ${CATEGORIES.find((c) => c.value === category)?.label}`}
              >
                {CATEGORIES.find((c) => c.value === category)?.label}
                <span aria-hidden="true">&times;</span>
              </button>
            )}
            {selectedBrands.map((b) => (
              <button
                key={b}
                onClick={() => removeChip("brand", b)}
                className="bg-stone-900 text-white text-xs tracking-wider uppercase px-3 py-1.5 flex items-center gap-1.5"
                aria-label={`Filter entfernen: ${b}`}
              >
                {b}
                <span aria-hidden="true">&times;</span>
              </button>
            ))}
            {priceRange && (
              <button
                onClick={() => removeChip("price")}
                className="bg-stone-900 text-white text-xs tracking-wider uppercase px-3 py-1.5 flex items-center gap-1.5"
              >
                {PRICE_RANGES.find((p) => p.value === priceRange)?.label}
                <span aria-hidden="true">&times;</span>
              </button>
            )}
            {isAvailable && (
              <button
                onClick={() => removeChip("available")}
                className="bg-stone-900 text-white text-xs tracking-wider uppercase px-3 py-1.5 flex items-center gap-1.5"
              >
                Jetzt verfügbar
                <span aria-hidden="true">&times;</span>
              </button>
            )}
            <button
              onClick={clearAll}
              className="text-xs tracking-wider uppercase text-stone-500 underline-offset-2 underline hover:text-stone-900 ml-auto"
            >
              Alle löschen
            </button>
          </div>
        )}

        {/* Mobile search */}
        <input
          type="search"
          defaultValue={search}
          placeholder="Suchen…"
          className="input-field w-full"
          aria-label="Suche"
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>

      {/* Mobile filter drawer */}
      <MobileFilterDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        brands={brands}
        category={category}
        selectedBrands={selectedBrands}
        priceRange={priceRange}
        available={isAvailable}
        onApply={applyMobileFilters}
        itemCount={0}
      />
    </>
  );
}
