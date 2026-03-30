/** Base MSRP before options */
export const BASE_PRICE = 65000

/** Extra cost when convertible is selected */
export const CONVERTIBLE_PREMIUM = 7500

/**
 * Catalog of options per feature: id (stored in selections), label, surcharge.
 */
export const OPTION_CATALOG = {
    exterior: [
        { id: 'silver-flare', label: 'Silver Flare Metallic', price: 500, swatch: '#a5a5a5' },
        { id: 'arctic-white', label: 'Arctic White', price: 500, swatch: '#ffffff' },
        { id: 'red-mist', label: 'Red Mist Metallic Tintcoat', price: 2000, swatch: '#73020c' },
        { id: 'hypersonic-gray', label: 'Hypersonic Gray', price: 500, swatch: '#555555' },
        { id: 'torch-red', label: 'Torch Red', price: 500, swatch: '#ff0000' },
        { id: 'black', label: 'Black', price: 500, swatch: '#000000' },
        { id: 'elkhart-blue', label: 'Elkhart Lake Blue Metallic', price: 1000, swatch: '#0000ff' },
    ],
    roof: [
        { id: 'body-color', label: 'Body-color', price: 0 },
        { id: 'carbon-fixed', label: 'Carbon fiber fixed roof', price: 3500 },
        { id: 'transparent', label: 'Transparent roof panel', price: 1200 },
    ],
    wheels: [
        { id: '19-spoke', label: '19" 5-spoke silver', price: 0 },
        { id: '20-black', label: '20" Black forged', price: 2500 },
        { id: 'track-pack', label: 'Track Pack wheels', price: 4000 },
    ],
    interior: [
        { id: 'jet-black', label: 'Jet Black', price: 0 },
        { id: 'sky-gray', label: 'Sky Cool Gray', price: 500 },
        { id: 'adrenaline-red', label: 'Adrenaline Red', price: 800 },
    ],
}

const FEATURE_KEYS = ['exterior', 'roof', 'wheels', 'interior']

export const defaultSelections = () => ({
    convertible: false,
    exterior: 'silver-flare',
    roof: 'body-color',
    wheels: '19-spoke',
    interior: 'jet-black',
})

/**
 * @param {'exterior'|'roof'|'wheels'|'interior'} feature
 * @param {string} id
 */
export function getOptionById(feature, id) {
    const list = OPTION_CATALOG[feature]
    if (!list || !id) return undefined
    return list.find((o) => o.id === id)
}

/**
 * Price for a single option, or 0 if unknown / empty.
 */
export function getOptionPrice(feature, id) {
    return getOptionById(feature, id)?.price ?? 0
}

/**
 * Map free-text or legacy values from the API to a catalog id when possible.
 */
export function resolveOptionId(feature, raw) {
    if (raw == null || raw === '') return ''
    const list = OPTION_CATALOG[feature]
    if (!list) return ''
    const str = String(raw).trim()
    const byId = list.find((o) => o.id === str)
    if (byId) return byId.id
    const lower = str.toLowerCase()
    const byLabel = list.find((o) => o.label.toLowerCase() === lower)
    if (byLabel) return byLabel.id
    const partial = list.find(
        (o) =>
            lower.includes(o.id) ||
            o.label.toLowerCase().includes(lower) ||
            lower.includes(o.label.toLowerCase().slice(0, 8))
    )
    return partial?.id ?? ''
}

/**
 * Normalize API selections to catalog ids for pricing and selects.
 */
export function normalizeSelectionsFromApi(raw) {
    const base = defaultSelections()
    if (!raw || typeof raw !== 'object') return base
    return {
        convertible: Boolean(raw.convertible),
        exterior: resolveOptionId('exterior', raw.exterior) || base.exterior,
        roof: resolveOptionId('roof', raw.roof) || base.roof,
        wheels: resolveOptionId('wheels', raw.wheels) || base.wheels,
        interior: resolveOptionId('interior', raw.interior) || base.interior,
    }
}

/**
 * Total MSRP from base + convertible + all option surcharges.
 */
export function calculateTotalPrice(selections) {
    let total = BASE_PRICE
    if (selections?.convertible) total += CONVERTIBLE_PREMIUM
    for (const key of FEATURE_KEYS) {
        total += getOptionPrice(key, selections?.[key])
    }
    return total
}

/**
 * Line items for display (labels + amounts).
 * @returns {{ label: string, amount: number }[]}
 */
export function getPriceBreakdown(selections) {
    const lines = [{ label: 'Base vehicle', amount: BASE_PRICE }]
    if (selections?.convertible) {
        lines.push({ label: 'Convertible', amount: CONVERTIBLE_PREMIUM })
    }
    for (const key of FEATURE_KEYS) {
        const opt = getOptionById(key, selections?.[key])
        if (opt && opt.price > 0) {
            lines.push({ label: `${capitalize(key)}: ${opt.label}`, amount: opt.price })
        }
    }
    return lines
}

function capitalize(s) {
    return s.charAt(0).toUpperCase() + s.slice(1)
}

/**
 * Human-readable label for a stored option id.
 */
export function getSelectionLabel(feature, id) {
    const opt = getOptionById(feature, id)
    return opt?.label ?? (id ? String(id) : '—')
}

export function getOptionPreviewUrl(feature, id) {
    // Return specific placeholder types for better visual variety
    if (feature === 'roof') return `https://picsum.photos/seed/${id}/400/200`
    if (feature === 'wheels') return `https://picsum.photos/seed/${id}/200/200`
    if (feature === 'interior') return `https://picsum.photos/seed/${id}/600/400`
    return ''
}

/**
 * Returns a large hero image representing the car based on selections.
 * Fulfills the "visual icon updates to match the option" requirement.
 */
export function getCarHeroImage(selections) {
    const ext = selections?.exterior ?? 'arctic-white'
    const conv = selections?.convertible ? 'convertible' : 'coupe'
    // Map colors to distinct placeholder images to simulate selection changes
    // In a real app, these would be car renders with specific colors/parts
    const colorMap = {
        'silver-flare': 'grayscale',
        'arctic-white': 'white',
        'red-mist': 'red',
        'hypersonic-gray': 'blur',
        'torch-red': 'red',
        'black': 'monochrome',
        'elkhart-blue': 'sepia',
    }
    const filter = colorMap[ext] || ''
    return `https://picsum.photos/seed/${ext}-${conv}/1200/600?${filter}`
}

export function formatCurrency(value) {
    const n = Number(value)
    if (Number.isNaN(n)) return String(value)
    return n.toLocaleString(undefined, { style: 'currency', currency: 'USD' })
}
