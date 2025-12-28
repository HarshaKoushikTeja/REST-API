import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"

const app = express()

app.use(express.json())

dotenv.config()

const port = process.env.PORT || 3000
const dbUrl = process.env.MONGO_URL

if (!dbUrl) {
    console.error("MONGO_URL is not defined in environment variables")
    process.exit(1)
}

mongoose.connect(dbUrl).then(() => {
    console.log("MongoDB connected successfully.")
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`)
    })
}).catch((err) => {
    console.error("MongoDB connection error:", err)
    process.exit(1)
})

const bookSchema = new mongoose.Schema({
    _id: Number,
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    quan: {
        type: Number,
        required: true,
        min: 0
    }
}, { versionKey: false })

const Book = mongoose.model("library", bookSchema, "library")

// Welcome route
app.get('/', (req, res) => {
    res.json({ message: 'WELCOME TO REST API PROJECT' })
})

// Get all books
app.get('/getBooks', async (req, res) => {
    try {
        const books = await Book.find()
        if (books.length === 0) {
            return res.status(200).json({ message: 'Library is empty', books: [] })
        }
        res.status(200).json(books)
    } catch (err) {
        console.error("Error fetching books:", err)
        res.status(500).json({ error: 'Internal server error' })
    }
})

// Get book by ID
app.get('/getbook/:id', async (req, res) => {
    try {
        const id = req.params.id
        const book = await Book.findById(id)
        if (!book) {
            return res.status(404).json({ error: 'No book found with given ID' })
        }
        res.status(200).json(book)
    } catch (err) {
        console.error("Error fetching book:", err)
        if (err.name === 'CastError') {
            return res.status(400).json({ error: 'Invalid book ID format' })
        }
        res.status(500).json({ error: 'Internal server error' })
    }
})

// Create a new book
app.post('/postbook', async (req, res) => {
    try {
        const { _id, title, author, quan } = req.body
        
        // Input validation
        if (!_id || !title || !author || quan === undefined) {
            return res.status(400).json({ 
                error: 'Missing required fields. Please provide _id, title, author, and quan' 
            })
        }

        if (typeof quan !== 'number' || quan < 0) {
            return res.status(400).json({ 
                error: 'Quantity must be a non-negative number' 
            })
        }

        const book = await Book.create(req.body)
        res.status(201).json(book)
    } catch (err) {
        console.error("Error creating book:", err)
        if (err.code === 11000) {
            return res.status(409).json({ error: 'Book with this ID already exists' })
        }
        res.status(500).json({ error: 'Error saving the data' })
    }
})

// Update a book
app.put('/updatebook/:id', async (req, res) => {
    try {
        const id = req.params.id
        const updatedBook = await Book.findByIdAndUpdate(id, req.body, { 
            new: true,
            runValidators: true 
        })
        
        if (!updatedBook) {
            return res.status(404).json({ error: `Can't find book with ID ${id}` })
        }
        
        res.status(200).json(updatedBook)
    } catch (err) {
        console.error("Error updating book:", err)
        if (err.name === 'CastError') {
            return res.status(400).json({ error: 'Invalid book ID format' })
        }
        res.status(500).json({ error: 'Internal server error' })
    }
})

// Delete a book
app.delete('/deletebook/:id', async (req, res) => {
    try {
        const id = req.params.id
        const book = await Book.findByIdAndDelete(id)
        
        if (!book) {
            return res.status(404).json({ error: `Can't find book with ID ${id}` })
        }
        
        res.status(200).json({ 
            message: 'Book deleted successfully',
            book: book 
        })
    } catch (err) {
        console.error("Error deleting book:", err)
        if (err.name === 'CastError') {
            return res.status(400).json({ error: 'Invalid book ID format' })
        }
        res.status(500).json({ error: 'Internal server error' })
    }
})

// Take book(s) - decrease quantity
app.put('/takebook/:ids', async (req, res) => {
    try {
        const ids = req.params.ids.split(',').map(id => id.trim())
        const updatedBooks = []
        const notFoundIds = []
        const outOfStockIds = []

        for (const id of ids) {
            try {
                const book = await Book.findById(id)
                if (!book) {
                    notFoundIds.push(id)
                    continue
                }
                if (book.quan <= 0) {
                    outOfStockIds.push(id)
                    continue
                }
                book.quan -= 1
                await book.save()
                updatedBooks.push(book)
            } catch (err) {
                console.error(`Error processing book ${id}:`, err)
            }
        }

        if (updatedBooks.length === 0 && (notFoundIds.length > 0 || outOfStockIds.length > 0)) {
            return res.status(400).json({
                error: 'No books were updated',
                notFound: notFoundIds,
                outOfStock: outOfStockIds
            })
        }

        res.status(200).json({
            updated: updatedBooks,
            notFound: notFoundIds,
            outOfStock: outOfStockIds
        })
    } catch (err) {
        console.error("Error taking books:", err)
        res.status(500).json({ error: 'Internal server error' })
    }
})

