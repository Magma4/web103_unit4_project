import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createCar } from '../services/carsAPI'
import { OPTION_CATALOG, getOptionPreviewUrl, calculateTotalPrice, getCarHeroImage } from '../utilities/calcPrice'
import { validateFeatureCombination } from '../utilities/validation.js'
import '../App.css'

const CATEGORIES = ['exterior', 'roof', 'wheels', 'interior']

const CreateCar = ({ title = 'BOLT BUCKET | Customize' }) => {
    const navigate = useNavigate()
    const [name, setName] = useState('My New Car')
    const [selections, setSelections] = useState({
        convertible: false,
        exterior: 'arctic-white',
        roof: 'body-color',
        wheels: '5-spoke-silver',
        interior: 'jet-black',
    })
    const [activeCategory, setActiveCategory] = useState(null)
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        document.title = title
    }, [title])

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
            await createCar({
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
                            placeholder='My New Car'
                            required
                        />
                        <button type='submit' disabled={submitting}>
                            {submitting ? '...' : 'Create'}
                        </button>
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
        </div>
    )
}

export default CreateCar
