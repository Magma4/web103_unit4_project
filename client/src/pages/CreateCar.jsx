import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createCar } from '../services/carsAPI'
import '../App.css'
import './pages.css'

const defaultSelections = () => ({
    convertible: false,
    exterior: '',
    roof: '',
    wheels: '',
    interior: '',
})

const CreateCar = ({ title = 'BOLT BUCKET | Customize' }) => {
    const navigate = useNavigate()
    const [name, setName] = useState('My New Car')
    const [totalPrice, setTotalPrice] = useState(65000)
    const [selections, setSelections] = useState(defaultSelections)
    const [error, setError] = useState(null)
    const [submitting, setSubmitting] = useState(false)

    useEffect(() => {
        document.title = title
    }, [title])

    const updateField = (key, value) => {
        setSelections((prev) => ({ ...prev, [key]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError(null)
        setSubmitting(true)
        try {
            await createCar({
                name: name.trim(),
                selections,
                total_price: Number(totalPrice),
            })
            navigate('/customcars')
        } catch (err) {
            setError(err.message ?? 'Could not create car')
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <main className='page-content'>
            <article>
                <header>
                    <h2>Build your Bolt Bucket</h2>
                    <p className='muted'>
                        Name your build and set options. You can refine details later from the list.
                    </p>
                </header>

                <form onSubmit={handleSubmit}>
                    {error && <p className='error-msg' role='alert'>{error}</p>}

                    <label htmlFor='car-name'>
                        Name
                        <input
                            id='car-name'
                            type='text'
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            placeholder='My New Car'
                        />
                    </label>

                    <label htmlFor='total-price'>
                        Total price ($)
                        <input
                            id='total-price'
                            type='number'
                            min='0'
                            step='0.01'
                            value={totalPrice}
                            onChange={(e) => setTotalPrice(e.target.value)}
                            required
                        />
                    </label>

                    <fieldset>
                        <legend>Selections</legend>
                        <div className='selections-grid'>
                            <label htmlFor='sel-exterior'>
                                Exterior
                                <input
                                    id='sel-exterior'
                                    type='text'
                                    value={selections.exterior}
                                    onChange={(e) => updateField('exterior', e.target.value)}
                                    placeholder='e.g. Red Mist Metallic'
                                />
                            </label>
                            <label htmlFor='sel-roof'>
                                Roof
                                <input
                                    id='sel-roof'
                                    type='text'
                                    value={selections.roof}
                                    onChange={(e) => updateField('roof', e.target.value)}
                                    placeholder='e.g. Body-color'
                                />
                            </label>
                            <label htmlFor='sel-wheels'>
                                Wheels
                                <input
                                    id='sel-wheels'
                                    type='text'
                                    value={selections.wheels}
                                    onChange={(e) => updateField('wheels', e.target.value)}
                                    placeholder='e.g. 19&quot; 5-spoke'
                                />
                            </label>
                            <label htmlFor='sel-interior'>
                                Interior
                                <input
                                    id='sel-interior'
                                    type='text'
                                    value={selections.interior}
                                    onChange={(e) => updateField('interior', e.target.value)}
                                    placeholder='e.g. Jet Black'
                                />
                            </label>
                        </div>
                        <label htmlFor='sel-convertible'>
                            <input
                                id='sel-convertible'
                                type='checkbox'
                                role='switch'
                                checked={selections.convertible}
                                onChange={(e) => updateField('convertible', e.target.checked)}
                            />
                            Convertible
                        </label>
                    </fieldset>

                    <footer>
                        <button type='submit' disabled={submitting} aria-busy={submitting}>
                            {submitting ? 'Saving…' : 'Create'}
                        </button>
                    </footer>
                </form>
            </article>
        </main>
    )
}

export default CreateCar
