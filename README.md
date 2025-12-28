# Library Management REST API

A simple RESTful API built with Express.js and MongoDB for managing a library book collection.

## Features

- View all books in the library
- Get a specific book by ID
- Add new books to the collection
- Update existing book information
- Delete books from the library
- Borrow multiple books at once (decrements quantity)

## Technologies Used

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - MongoDB object modeling
- **dotenv** - Environment variable management


## Project Structure

```
├── index.js            # Main server file
├── package.json        # Dependencies and scripts
├── .env                # Environment variables
└── README.md           # Documentation
```

## Prerequisites

Before running this project, make sure you have:

- Node.js installed (v14 or higher)
- MongoDB installed and running (local or cloud instance)
- npm or yarn package manager

## Installation

1. Clone the repository:
```bash
git clone <your-repository-url>
cd <project-directory>
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
PORT=3000
MONGO_URL=mongodb://localhost:27017/libraryDB
```

Replace the `MONGO_URL` with your MongoDB connection string.

4. Add the following script to your `package.json`:
```json
"scripts": {
  "start": "node index.js"
}
```

5. Start the server:
```bash
npm start
```

The server will start running on the port specified in your `.env` file.

## API Endpoints

### Base URL
```
http://localhost:3000
```

### 1. Welcome Message
- **GET** `/`
- **Description**: Returns a welcome message
- **Response**: 
  ```
  WELCOME TO REST API PROJECT
  ```

### 2. Get All Books
- **GET** `/getBooks`
- **Description**: Retrieves all books from the library
- **Response**: Array of book objects
  ```json
  [
    {
      "_id": 1,
      "title": "Book Title",
      "author": "Author Name",
      "quan": 5
    }
  ]
  ```

### 3. Get Book by ID
- **GET** `/getbook/:id`
- **Description**: Retrieves a specific book by its ID
- **Parameters**: 
  - `id` (number) - Book ID
- **Response**: Single book object

### 4. Add New Book
- **POST** `/postbook`
- **Description**: Adds a new book to the library
- **Request Body**:
  ```json
  {
    "_id": 1,
    "title": "Book Title",
    "author": "Author Name",
    "quan": 10
  }
  ```
- **Response**: Created book object

### 5. Update Book
- **PUT** `/updatebook/:id`
- **Description**: Updates an existing book's information
- **Parameters**: 
  - `id` (number) - Book ID
- **Request Body**: Fields to update
  ```json
  {
    "title": "Updated Title",
    "quan": 15
  }
  ```
- **Response**: Updated book object

### 6. Delete Book
- **DELETE** `/deletebook/:id`
- **Description**: Removes a book from the library
- **Parameters**: 
  - `id` (number) - Book ID
- **Response**: Deleted book object

### 7. Borrow Books
- **PUT** `/takebook/:ids`
- **Description**: Decrements the quantity of one or more books (simulates borrowing)
- **Parameters**: 
  - `ids` (string) - Comma-separated list of book IDs (e.g., `1,2,3`)
- **Response**: Array of updated book objects
- **Note**: Only decrements quantity if `quan > 0`

## Database Schema

### Book Model
```javascript
{
  _id: Number,        // Unique book identifier
  title: String,      // Book title
  author: String,     // Author name
  quan: Number        // Available quantity
}
```

## Error Handling

The API includes basic error handling for common scenarios:
- Empty library collections
- Books not found by ID
- Database connection errors
- Invalid data submissions

Proper HTTP status codes are used for success and error responses

## Example Usage

### Using cURL

**Get all books:**
```bash
curl http://localhost:3000/getBooks
```

**Add a new book:**
```bash
curl -X POST http://localhost:3000/postbook \
  -H "Content-Type: application/json" \
  -d '{"_id":1,"title":"1984","author":"George Orwell","quan":5}'
```

**Borrow multiple books:**
```bash
curl -X PUT http://localhost:3000/takebook/1,2,3
```

## Future Improvements

- Add input validation using express-validator or Joi
- Implement authentication and authorization
- Add pagination for the get all books endpoint
- Improve error responses with proper status codes
- Add logging middleware
- Implement a return book feature
- Add search and filter functionality

## License

This project is open source and available under the [MIT License](LICENSE).

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Author

**Your Name**
- GitHub: [@HarshaKoushikTeja](https://github.com/HarshaKoushikTeja)
- Email: harshaus33@gmail.com
---

*Built with ❤️ using Node.js, Express, and MongoDB*