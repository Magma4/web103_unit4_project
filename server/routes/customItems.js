import express from 'express'
import {
    getAllCustomItems,
    getCustomItemById,
    createCustomItem,
    updateCustomItem,
    deleteCustomItem,
} from '../controllers/customItems.js'

const router = express.Router()

router.get('/', async (_req, res) => {
    try {
        const items = await getAllCustomItems()
        res.json(items)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Failed to fetch custom items' })
    }
})

router.get('/:id', async (req, res) => {
    try {
        const id = Number.parseInt(req.params.id, 10)
        if (Number.isNaN(id)) {
            res.status(400).json({ error: 'Invalid id' })
            return
        }
        const item = await getCustomItemById(id)
        if (!item) {
            res.status(404).json({ error: 'Custom item not found' })
            return
        }
        res.json(item)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Failed to fetch custom item' })
    }
})

router.post('/', async (req, res) => {
    try {
        const { name, selections, total_price } = req.body
        if (name == null || name === '') {
            res.status(400).json({ error: 'name is required' })
            return
        }
        const item = await createCustomItem({
            name,
            selections,
            total_price: total_price ?? 0,
        })
        res.status(201).json(item)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Failed to create custom item' })
    }
})

router.put('/:id', async (req, res) => {
    try {
        const id = Number.parseInt(req.params.id, 10)
        if (Number.isNaN(id)) {
            res.status(400).json({ error: 'Invalid id' })
            return
        }
        const { name, selections, total_price } = req.body
        if (name == null || name === '') {
            res.status(400).json({ error: 'name is required' })
            return
        }
        const item = await updateCustomItem(id, { name, selections, total_price })
        if (!item) {
            res.status(404).json({ error: 'Custom item not found' })
            return
        }
        res.json(item)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Failed to update custom item' })
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const id = Number.parseInt(req.params.id, 10)
        if (Number.isNaN(id)) {
            res.status(400).json({ error: 'Invalid id' })
            return
        }
        const deleted = await deleteCustomItem(id)
        if (!deleted) {
            res.status(404).json({ error: 'Custom item not found' })
            return
        }
        res.status(204).send()
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Failed to delete custom item' })
    }
})

export default router
