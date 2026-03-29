const BASE = '/api/custom-items'

async function request(path, options = {}) {
    const url = path ? `${BASE}${path}` : BASE
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    }
    const res = await fetch(url, { ...options, headers })
    if (!res.ok) {
        let message = res.statusText
        try {
            const body = await res.json()
            if (body?.error) message = body.error
        } catch {
            // ignore non-JSON error bodies
        }
        throw new Error(message)
    }
    if (res.status === 204) return null
    return res.json()
}

/** @returns {Promise<Array>} */
export const getAllCars = () => request('')

/** @returns {Promise<object>} */
export const getCar = (id) => request(`/${id}`)

/** @param {{ name: string, selections?: object, total_price?: number }} data */
export const createCar = (data) =>
    request('', { method: 'POST', body: JSON.stringify(data) })

/** @param {number|string} id @param {{ name: string, selections?: object, total_price?: number }} data */
export const updateCar = (id, data) =>
    request(`/${id}`, { method: 'PUT', body: JSON.stringify(data) })

/** @param {number|string} id */
export const deleteCar = (id) => request(`/${id}`, { method: 'DELETE' })
