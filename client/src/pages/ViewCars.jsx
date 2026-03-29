import React, { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { deleteCar, getAllCars } from '../services/carsAPI'
import '../App.css'
import './pages.css'

const formatPrice = (value) => {
    const n = Number(value)
    if (Number.isNaN(n)) return value
    return n.toLocaleString(undefined, { style: 'currency', currency: 'USD' })
}

const ViewCars = ({ title = 'BOLT BUCKET | Custom Cars' }) => {
    const [cars, setCars] = useState([])
    const [loading, setLoading] = useState(true)
    const [loadError, setLoadError] = useState(null)
    const [actionError, setActionError] = useState(null)

    const loadCars = useCallback(async () => {
        setLoadError(null)
        setLoading(true)
        try {
            const data = await getAllCars()
            setCars(data)
        } catch (err) {
            setLoadError(err.message ?? 'Failed to load cars')
            setCars([])
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        document.title = title
    }, [title])

    useEffect(() => {
        loadCars()
    }, [loadCars])

    const handleDelete = async (id, carName) => {
        if (!window.confirm(`Delete “${carName}”? This cannot be undone.`)) return
        setActionError(null)
        try {
            await deleteCar(id)
            await loadCars()
        } catch (err) {
            setActionError(err.message ?? 'Could not delete car')
        }
    }

    return (
        <main className='page-content'>
            {loading && (
                <article>
                    <p className='muted'>Loading cars…</p>
                </article>
            )}

            {!loading && loadError && (
                <article>
                    <p className='error-msg' role='alert'>{loadError}</p>
                    <button type='button' onClick={loadCars}>
                        Try again
                    </button>
                </article>
            )}

            {!loading && !loadError && cars.length === 0 && (
                <article>
                    <h2>No cars have been created yet 😔</h2>
                    <p className='muted'>
                        <Link to='/'>Customize</Link> a build and save it to see it here.
                    </p>
                </article>
            )}

            {!loading && !loadError && cars.length > 0 && (
                <div className='car-list'>
                    {actionError && (
                        <p className='error-msg' role='alert' style={{ marginBottom: 0 }}>
                            {actionError}
                        </p>
                    )}
                    <h2 className='muted' style={{ marginTop: 0 }}>Your builds</h2>
                    {cars.map((car) => (
                        <article key={car.id}>
                            <header>
                                <h3>{car.name}</h3>
                                <p className='price-badge'>{formatPrice(car.total_price)}</p>
                            </header>
                            <footer>
                                <Link to={`/customcars/${car.id}`} role='button'>
                                    View
                                </Link>
                                <Link to={`/edit/${car.id}`} role='button'>
                                    Edit
                                </Link>
                                <button
                                    type='button'
                                    className='secondary'
                                    onClick={() => handleDelete(car.id, car.name)}
                                >
                                    Delete
                                </button>
                            </footer>
                        </article>
                    ))}
                </div>
            )}
        </main>
    )
}

export default ViewCars
