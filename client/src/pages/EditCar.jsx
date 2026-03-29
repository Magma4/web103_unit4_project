import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getCar, updateCar } from '../services/carsAPI'
import '../App.css'
import './pages.css'

const defaultSelections = () => ({
    convertible: false,
    exterior: '',
    roof: '',
    wheels: '',
    interior: '',
})

const normalizeSelections = (raw) => {
    const base = defaultSelections()
    if (!raw || typeof raw !== 'object') return base
    return { ...base, ...raw }
}

const EditCar = ({ title = 'BOLT BUCKET | Edit' }) => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [name, setName] = useState('')
    const [totalPrice, setTotalPrice] = useState(0)
    const [selections, setSelections] = useState(defaultSelections)
    const [loading, setLoading] = useState(true)
    const [loadError, setLoadError] = useState(null)
    const [saveError, setSaveError] = useState(null)
    const [submitting, setSubmitting] = useState(false)

    useEffect(() => {
        document.title = title
    }, [title])

    useEffect(() => {
        let cancelled = false
        async function load() {
            setLoading(true)
            setLoadError(null)
            try {
                const car = await getCar(id)
                if (cancelled) return
                setName(car.name ?? '')
                setTotalPrice(car.total_price ?? 0)
                setSelections(normalizeSelections(car.selections))
            } catch (err) {
                if (!cancelled) setLoadError(err.message ?? 'Could not load car')
            } finally {
                if (!cancelled) setLoading(false)
            }
        }
        if (id) load()
        return () => {
            cancelled = true
        }
    }, [id])

    const updateField = (key, value) => {
        setSelections((prev) => ({ ...prev, [key]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSaveError(null)
        setSubmitting(true)
        try {
            await updateCar(id, {
                name: name.trim(),
                selections,
                total_price: Number(totalPrice),
            })
            navigate(`/customcars/${id}`)
        } catch (err) {
            setSaveError(err.message ?? 'Could not update car')
        } finally {
            setSubmitting(false)
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

    if (loadError) {
        return (
            <main className='page-content'>
                <article>
                    <h2>Could not edit</h2>
                    <p className='error-msg' role='alert'>{loadError}</p>
                    <p>
                        <Link to='/customcars' role='button'>
                            Back to all cars
                        </Link>
                    </p>
                </article>
            </main>
        )
    }

    return (
        <main className='page-content'>
            <article>
                <header>
                    <h2>Edit build</h2>
                    <p className='muted'>
                        Update this car and save.{' '}
                        <Link to={`/customcars/${id}`}>View details</Link>
                    </p>
                </header>

                <form onSubmit={handleSubmit}>
                    {saveError && <p className='error-msg' role='alert'>{saveError}</p>}

                    <label htmlFor='edit-name'>
                        Name
                        <input
                            id='edit-name'
                            type='text'
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </label>

                    <label htmlFor='edit-price'>
                        Total price ($)
                        <input
                            id='edit-price'
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
                            <label htmlFor='edit-exterior'>
                                Exterior
                                <input
                                    id='edit-exterior'
                                    type='text'
                                    value={selections.exterior}
                                    onChange={(e) => updateField('exterior', e.target.value)}
                                />
                            </label>
                            <label htmlFor='edit-roof'>
                                Roof
                                <input
                                    id='edit-roof'
                                    type='text'
                                    value={selections.roof}
                                    onChange={(e) => updateField('roof', e.target.value)}
                                />
                            </label>
                            <label htmlFor='edit-wheels'>
                                Wheels
                                <input
                                    id='edit-wheels'
                                    type='text'
                                    value={selections.wheels}
                                    onChange={(e) => updateField('wheels', e.target.value)}
                                />
                            </label>
                            <label htmlFor='edit-interior'>
                                Interior
                                <input
                                    id='edit-interior'
                                    type='text'
                                    value={selections.interior}
                                    onChange={(e) => updateField('interior', e.target.value)}
                                />
                            </label>
                        </div>
                        <label htmlFor='edit-convertible'>
                            <input
                                id='edit-convertible'
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
                            {submitting ? 'Saving…' : 'Save changes'}
                        </button>
                        <Link to='/customcars' role='button' className='secondary'>
                            Cancel
                        </Link>
                    </footer>
                </form>
            </article>
        </main>
    )
}

export default EditCar
