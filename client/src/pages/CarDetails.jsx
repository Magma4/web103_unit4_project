import React, { useEffect, useState, useCallback } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { getCarById, deleteCar } from '../services/carsAPI'
import { getSelectionLabel, getOptionPreviewUrl } from '../utilities/calcPrice'
import '../App.css'

const CATEGORIES = ['exterior', 'roof', 'wheels', 'interior']

const CarDetails = ({ title = 'BOLT BUCKET | View' }) => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [car, setCar] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [showDeleteModal, setShowDeleteModal] = useState(false)

    const loadCar = useCallback(async () => {
        try {
            setLoading(true)
            const data = await getCarById(id)
            setCar(data)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }, [id])

    useEffect(() => {
        document.title = title
        loadCar()
    }, [title, loadCar])

    const confirmDelete = async () => {
        try {
            await deleteCar(id)
            navigate('/customcars')
        } catch (err) {
            setError(err.message)
        }
    }

    if (loading) return <div className='page-content'><h2>Loading...</h2></div>
    if (error) return <div className='page-content'><h2>{error}</h2></div>
    if (!car) return <div className='page-content'><h2>Not found</h2></div>

    return (
        <div className='page-content' style={{ padding: '0' }}>
            <div className='customizer-toolbar'>
                <div className='toolbar-group'>
                    <h2>{car.name}</h2>
                    {car.selections.convertible && <span style={{ color: 'var(--primary-red)', fontWeight: 'bold' }}>(CONVERTIBLE)</span>}
                </div>
                <div className='toolbar-group' style={{ marginLeft: 'auto' }}>
                    <Link to={`/edit/${car.id}`} role='button'>EDIT</Link>
                    <button type='button' className='secondary' onClick={() => setShowDeleteModal(true)}>DELETE</button>
                </div>
            </div>

            <div style={{ padding: '2rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
                    {CATEGORIES.map(cat => (
                        <div key={cat} style={{ background: 'rgba(0,0,0,0.8)', border: '1px solid #333', borderRadius: '8px', overflow: 'hidden' }}>
                            <div style={{ padding: '1rem', borderBottom: '1px solid #333', display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ fontWeight: 'bold', textTransform: 'uppercase' }}>{cat}</span>
                                <span style={{ color: 'var(--text-muted)' }}>{getSelectionLabel(cat, car.selections[cat])}</span>
                            </div>
                            <div style={{ aspectratio: '16/9', height: '200px', background: car.selections[cat] === 'exterior' ? car.selections.exterior : '#111' }}>
                                {cat !== 'exterior' ? (
                                    <img 
                                        src={getOptionPreviewUrl(cat, car.selections[cat])} 
                                        alt="" 
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                ) : (
                                    <div style={{ width: '100%', height: '100%', background: 'var(--bg-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem' }}>
                                        🎨
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className='price-badge-fixed'>
                💰 ${car.total_price.toLocaleString()}
            </div>

            {showDeleteModal && (
                <div className='modal-overlay' onClick={() => setShowDeleteModal(false)}>
                    <div className='modal-content' onClick={e => e.stopPropagation()} style={{ maxWidth: '400px', textAlign: 'center' }}>
                        <h2>Confirm Deletion</h2>
                        <p>Are you sure you want to delete this custom car?</p>
                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem' }}>
                            <button type='button' className='secondary' onClick={() => setShowDeleteModal(false)}>CANCEL</button>
                            <button type='button' style={{ background: '#ff4d4d', color: 'white', border: 'none' }} onClick={confirmDelete}>DELETE</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default CarDetails
