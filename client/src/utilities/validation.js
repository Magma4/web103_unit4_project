/**
 * @typedef {import('./calcPrice.js').defaultSelections} SelectionsShape
 */

/**
 * Returns whether the combination can be built, and a user-facing message when not.
 * @param {object} selections — same shape as `defaultSelections()` from calcPrice
 * @returns {{ valid: boolean, message?: string }}
 */
export function validateFeatureCombination(selections) {
    if (!selections || typeof selections !== 'object') {
        return { valid: false, message: 'Invalid configuration.' }
    }

    // Example “impossible” rule: fixed carbon roof conflicts with convertible top
    if (selections.convertible && selections.roof === 'carbon-fixed') {
        return {
            valid: false,
            message:
                'A carbon fiber fixed roof cannot be combined with the convertible body style. Choose another roof or turn off convertible.',
        }
    }

    // Example: Track Pack wheels need a performance-oriented exterior finish
    if (selections.wheels === 'track-pack') {
        const ok = ['red-mist', 'hypersonic-gray', 'torch-red', 'black'].includes(
            selections.exterior
        )
        if (!ok) {
            return {
                valid: false,
                message:
                    'Track Pack wheels require a performance exterior (Red Mist, Hypersonic Gray, Torch Red, or Black).',
            }
        }
    }

    return { valid: true }
}
