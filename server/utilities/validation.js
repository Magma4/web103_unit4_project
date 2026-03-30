/**
 * Server-side feature combination validation.
 * Rules mirror client/src/utilities/validation.js — keep both in sync.
 *
 * @param {object} selections
 * @returns {{ valid: boolean, message?: string }}
 */
export function validateFeatureCombination(selections) {
    if (!selections || typeof selections !== 'object') {
        return { valid: false, message: 'Invalid configuration.' }
    }

    // A fixed carbon-fiber roof cannot be combined with a convertible body
    if (selections.convertible && selections.roof === 'carbon-fixed') {
        return {
            valid: false,
            message:
                'A carbon fiber fixed roof cannot be combined with the convertible body style. Choose another roof or turn off convertible.',
        }
    }

    // Track Pack wheels require a performance exterior
    if (selections.wheels === 'track-pack') {
        const performanceExteriors = ['red-mist', 'hypersonic-gray', 'torch-red', 'black']
        if (!performanceExteriors.includes(selections.exterior)) {
            return {
                valid: false,
                message:
                    'Track Pack wheels require a performance exterior (Red Mist, Hypersonic Gray, Torch Red, or Black).',
            }
        }
    }

    return { valid: true }
}
