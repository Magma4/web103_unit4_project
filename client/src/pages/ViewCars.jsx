import React, { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { deleteCar, getAllCars } from '../services/carsAPI'
import { getSelectionLabel } from '../utilities/calcPrice'
import '../App.css'

const formatPrice = (value) => {
    const n = Number(value)
    if (Number.isNaN(n)) return value
    return n.toLocaleString(undefined, { style: 'currency', currency: 'USD' })
}

const ViewCars = ({ title = 'BOLT BUCKET | Custom Cars' }) => {
    const [cars, setCars] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [carToDelete, setCarToDelete] = useState(null)

    const loadCars = useCallback(async () => {
        try {
            setLoading(true)
            const data = await getAllCars()
            setCars(data)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        document.title = title
        loadCars()
    }, [title, loadCars])

    const confirmDelete = async () => {
        if (!carToDelete) return
        try {
            await deleteCar(carToDelete)
            setCarToDelete(null)
            loadCars()
        } catch (err) {
            alert(err.message)
        }
    }

    return (
        <main className='page-content' style={{ padding: '2rem' }}>
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p style={{ color: 'red' }}>{error}</p>
            ) : cars.length === 0 ? (
                <div style={{ textAlign: 'center', marginTop: '4rem' }}>
                    <h2>No builds yet</h2>
                    <Link to='/' role='button'>Start Customizing</Link>
                </div>
            ) : (
                <div className='car-grid' style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '2rem' }}>
                    {cars.map(car => (
                        <article key={car.id} style={{ background: 'rgba(0,0,0,0.8)', border: '1px solid #333', borderRadius: '8px', overflow: 'hidden', padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
                            <header style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
                                <h3 style={{ fontSize: '1.5rem' }}>{car.name}</h3>
                                <div className='price-badge' style={{ background: 'var(--primary-red)', padding: '0.5rem', borderRadius: '4px', display: 'inline-block', marginTop: '0.5rem', fontSize: '1.25rem', fontWeight: '800' }}>
                                    💰 {formatPrice(car.total_price)}
                                </div>
                            </header>
                            
                            <div style={{ flex: 1, marginBottom: '2rem' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.75rem' }}>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <span>🖌️</span>
                                        <span style={{ color: 'var(--text-muted)' }}>EXTERIOR:</span>
                                        <span>{getSelectionLabel('exterior', car.selections.exterior)}</span>
                                    </div>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <span>😎</span>
                                        <span style={{ color: 'var(--text-muted)' }}>ROOF:</span>
                                        <span>{getSelectionLabel('roof', car.selections.roof)}</span>
                                    </div>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <span>🛴</span>
                                        <span style={{ color: 'var(--text-muted)' }}>WHEELS:</span>
                                        <span>{getSelectionLabel('wheels', car.selections.wheels)}</span>
                                    </div>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <span>💺</span>
                                        <span style={{ color: 'var(--text-muted)' }}>INTERIOR:</span>
                                        <span>{getSelectionLabel('interior', car.selections.interior)}</span>
                                    </div>
                                </div>
                            </div>

                            <footer style={{ display: 'flex', gap: '1rem', marginTop: 'auto' }}>
                                <Link to={`/customcars/${car.id}`} role='button' style={{ flex: 1 }}>DETAILS</Link>
                                <button type='button' className='secondary' style={{ flex: 1 }} onClick={() => setCarToDelete(car.id)}>DELETE</button>
                            </footer>
                        </article>
                    ))}
                </div>
            )}

            {carToDelete && (
                <div className='modal-overlay' onClick={() => setCarToDelete(null)}>
                    <div className='modal-content' onClick={e => e.stopPropagation()} style={{ maxWidth: '400px', textAlign: 'center' }}>
                        <h2>Confirm Deletion</h2>
                        <p>Are you sure you want to delete this custom car?</p>
                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem' }}>
                            <button type='button' className='secondary' onClick={() => setCarToDelete(null)}>CANCEL</button>
                            <button type='button' style={{ background: '#ff4d4d', color: 'white', border: 'none' }} onClick={confirmDelete}>DELETE</button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    )
}

export default ViewCars
