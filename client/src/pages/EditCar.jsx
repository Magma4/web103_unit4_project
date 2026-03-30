import React, { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getCarById, updateCar, deleteCar } from '../services/carsAPI'
import { OPTION_CATALOG, getOptionPreviewUrl, calculateTotalPrice, getCarHeroImage } from '../utilities/calcPrice'
import { validateFeatureCombination } from '../utilities/validation.js'
import '../App.css'

const CATEGORIES = ['exterior', 'roof', 'wheels', 'interior']

const EditCar = ({ title = 'BOLT BUCKET | Edit' }) => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [name, setName] = useState('')
    const [selections, setSelections] = useState({
        convertible: false,
        exterior: '',
        roof: '',
        wheels: '',
        interior: '',
    })
    const [activeCategory, setActiveCategory] = useState(null)
    const [submitting, setSubmitting] = useState(false)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [showDeleteModal, setShowDeleteModal] = useState(false)

    const loadCar = useCallback(async () => {
        try {
            setLoading(true)
            const data = await getCarById(id)
            setName(data.name)
            setSelections(data.selections)
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

    const totalPrice = calculateTotalPrice(selections)

    const updateSelection = (cat, id) => {
        setSelections(prev => ({ ...prev, [cat]: id }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSubmitting(true)
        setError(null)

        const validResult = validateFeatureCombination(selections)
        if (!validResult.valid) {
            setError(validResult.message)
            setSubmitting(false)
            return
        }

        try {
            await updateCar(id, {
                name: name.trim(),
                selections,
                total_price: totalPrice
            })
            navigate('/customcars')
        } catch (err) {
            setError(err.message)
        } finally {
            setSubmitting(false)
        }
    }

    const confirmDelete = async () => {
        try {
            await deleteCar(id)
            navigate('/customcars')
        } catch (err) {
            setError(err.message)
        }
    }

    if (loading) return <div className='page-content'><h2>Loading...</h2></div>

    return (
        <div className='page-content'>
            <form onSubmit={handleSubmit}>
                <div className='customizer-toolbar'>
                    <label className='convertible-toggle'>
                        <input
                            type='checkbox'
                            checked={selections.convertible}
                            onChange={(e) => setSelections(prev => ({ ...prev, convertible: e.target.checked }))}
                        />
                        Convertible
                    </label>

                    <div className='toolbar-group'>
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat}
                                type='button'
                                onClick={() => setActiveCategory(cat)}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    <div className='toolbar-group' style={{ marginLeft: 'auto' }}>
                        <input
                            type='text'
                            className='name-input'
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder='Name your creation'
                            required
                        />
                        <button type='submit' disabled={submitting}>
                            {submitting ? '...' : 'Save'}
                        </button>
                        <button type='button' className='secondary' onClick={() => setShowDeleteModal(true)}>Delete</button>
                    </div>
                </div>

                {error && <div className='error-msg' style={{ color: '#ff4d4d', padding: '1rem', fontWeight: 'bold' }}>⚠️ {error}</div>}

                <div className='hero-preview'>
                    <img src={getCarHeroImage(selections)} alt='Car Preview' className='hero-image' />
                </div>

                <div className='price-badge-fixed'>
                    💰 ${totalPrice.toLocaleString()}
                </div>
            </form>

            {activeCategory && (
                <div className='modal-overlay' onClick={() => setActiveCategory(null)}>
                    <div className='modal-content' onClick={e => e.stopPropagation()}>
                        <h2>{activeCategory.toUpperCase()}</h2>
                        <div className='modal-grid'>
                            {OPTION_CATALOG[activeCategory].map(opt => {
                                const isSelected = selections[activeCategory] === opt.id
                                // Stretch Feature: Pre-selection validation
                                const validation = validateFeatureCombination({
                                    ...selections,
                                    [activeCategory]: opt.id
                                })
                                const isIncompatible = !validation.valid

                                return (
                                    <button
                                        key={opt.id}
                                        type='button'
                                        className={`option-btn ${isSelected ? 'selected' : ''} ${isIncompatible ? 'incompatible' : ''}`}
                                        style={activeCategory === 'exterior' ? { backgroundColor: opt.swatch } : {}}
                                        onClick={() => !isIncompatible && updateSelection(activeCategory, opt.id)}
                                        title={isIncompatible ? validation.message : ''}
                                    >
                                        {activeCategory !== 'exterior' && (
                                            <img src={getOptionPreviewUrl(activeCategory, opt.id)} alt={opt.label} />
                                        )}
                                        <div className='option-info'>
                                            <span className='option-name'>{opt.label}</span>
                                            <span className='option-price'>+${opt.price}</span>
                                            {isIncompatible && <span className='conflict-mark'>⚠️ Conflict</span>}
                                        </div>
                                    </button>
                                )
                            })}
                        </div>
                        <button className='done-btn' onClick={() => setActiveCategory(null)}>DONE</button>
                    </div>
                </div>
            )}

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

export default EditCar
