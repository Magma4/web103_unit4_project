import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { deleteCar, getCar } from '../services/carsAPI'
import '../App.css'
import './pages.css'

const formatPrice = (value) => {
    const n = Number(value)
    if (Number.isNaN(n)) return String(value)
    return n.toLocaleString(undefined, { style: 'currency', currency: 'USD' })
}

const CarDetails = ({ title = 'BOLT BUCKET | View' }) => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [car, setCar] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        document.title = title
    }, [title])

    useEffect(() => {
        let cancelled = false
        async function load() {
            setLoading(true)
            setError(null)
            try {
                const data = await getCar(id)
                if (!cancelled) setCar(data)
            } catch (err) {
                if (!cancelled) setError(err.message ?? 'Could not load car')
            } finally {
                if (!cancelled) setLoading(false)
            }
        }
        if (id) load()
        return () => {
            cancelled = true
        }
    }, [id])

    const handleDelete = async () => {
        if (!car) return
        if (!window.confirm(`Delete “${car.name}”? This cannot be undone.`)) return
        try {
            await deleteCar(car.id)
            navigate('/customcars')
        } catch (err) {
            setError(err.message ?? 'Could not delete car')
        }
    }

    if (loading) {
        return (
            <main className='page-content'>
                <article>
                    <p className='muted'>Loading…</p>
                </article>
            </main>
        )
    }

    if (error || !car) {
        return (
            <main className='page-content'>
                <article>
                    <h2>Not found</h2>
                    <p className='error-msg' role='alert'>{error ?? 'This car does not exist.'}</p>
                    <p>
                        <Link to='/customcars' role='button'>
                            Back to all cars
                        </Link>
                    </p>
                </article>
            </main>
        )
    }

    const sel = car.selections && typeof car.selections === 'object' ? car.selections : {}

    return (
        <main className='page-content'>
            <article>
                <header>
                    <h2>{car.name}</h2>
                    <p className='price-badge'>{formatPrice(car.total_price)}</p>
                </header>

                <section>
                    <h3>Selections</h3>
                    <ul>
                        <li>
                            <strong>Convertible:</strong>{' '}
                            {sel.convertible ? 'Yes' : 'No'}
                        </li>
                        <li>
                            <strong>Exterior:</strong> {sel.exterior || '—'}
                        </li>
                        <li>
                            <strong>Roof:</strong> {sel.roof || '—'}
                        </li>
                        <li>
                            <strong>Wheels:</strong> {sel.wheels || '—'}
                        </li>
                        <li>
                            <strong>Interior:</strong> {sel.interior || '—'}
                        </li>
                    </ul>
                    {Object.keys(sel).length > 0 && (
                        <details className='muted' style={{ marginTop: '1rem' }}>
                            <summary>Raw selections (JSON)</summary>
                            <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                                {JSON.stringify(sel, null, 2)}
                            </pre>
                        </details>
                    )}
                </section>

                <footer>
                    <Link to={`/edit/${car.id}`} role='button'>
                        Edit
                    </Link>
                    <button type='button' className='secondary' onClick={handleDelete}>
                        Delete
                    </button>
                    <Link to='/customcars' role='button' className='secondary'>
                        All cars
                    </Link>
                </footer>
            </article>
        </main>
    )
}

export default CarDetails
