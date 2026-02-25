import { test, expect } from '@playwright/test';

const API_BASE_URL = 'https://demoqa.com/BookStore/v1';
const ACCOUNT_API_URL = 'https://demoqa.com/Account/v1';

let authToken = '';
let userId = '';

test.describe('Book Store API Tests', () => {

    // Test 1: User Registration
    test('Register a new user', async ({ request }) => {
        const response = await request.post(`${ACCOUNT_API_URL}/User`, {
            data: {
                userName: `testuser${Date.now()}`,
                password: 'TestPassword@123'
            }
        });

        expect(response.status()).toBe(201);
        const responseBody = await response.json();
        
        expect(responseBody).toHaveProperty('userID');
        expect(responseBody).toHaveProperty('username');
        expect(responseBody).toHaveProperty('books');
        
        userId = responseBody.userID;
        console.log('✓ User registered successfully with ID:', userId);
    });

    // Test 2: Generate Auth Token
    test('Generate authentication token', async ({ request }) => {
        const response = await request.post(`${ACCOUNT_API_URL}/GenerateToken`, {
            data: {
                userName: `testuser${Date.now()}`,
                password: 'TestPassword@123'
            }
        });

        expect(response.status()).toBe(200);
        const responseBody = await response.json();
        
        expect(responseBody).toHaveProperty('token');
        expect(responseBody).toHaveProperty('expires');
        
        authToken = responseBody.token;
        console.log('✓ Token generated successfully');
    });

    // Test 3: Get all books
    test('Get all available books', async ({ request }) => {
        const response = await request.get(`${API_BASE_URL}/Books`);

        expect(response.status()).toBe(200);
        const responseBody = await response.json();
        
        expect(responseBody).toHaveProperty('books');
        expect(Array.isArray(responseBody.books)).toBeTruthy();
        expect(responseBody.books.length).toBeGreaterThan(0);
        
        // Verify book structure
        const book = responseBody.books[0];
        expect(book).toHaveProperty('isbn');
        expect(book).toHaveProperty('title');
        expect(book).toHaveProperty('author');
        
        console.log(`✓ Retrieved ${responseBody.books.length} books`);
    });

    // Test 4: Get a single book
    test('Get a specific book by ISBN', async ({ request }) => {
        // First get all books to get an ISBN
        const booksResponse = await request.get(`${API_BASE_URL}/Books`);
        const books = await booksResponse.json();
        const isbn = books.books[0].isbn;

        // Get specific book
        const response = await request.get(`${API_BASE_URL}/Book`, {
            params: {
                ISBN: isbn
            }
        });

        expect(response.status()).toBe(200);
        const responseBody = await response.json();
        
        expect(responseBody).toHaveProperty('isbn');
        expect(responseBody).toHaveProperty('title');
        expect(responseBody.isbn).toBe(isbn);
        
        console.log('✓ Retrieved book:', responseBody.title);
    });

    // Test 5: Add books to collection
    test('Add books to user collection', async ({ request }) => {
        // First register user to get userId
        const userResponse = await request.post(`${ACCOUNT_API_URL}/User`, {
            data: {
                userName: `testuser${Date.now()}`,
                password: 'TestPassword@123'
            }
        });
        const userBody = await userResponse.json();
        const newUserId = userBody.userID;

        // Get token for the new user
        const tokenResponse = await request.post(`${ACCOUNT_API_URL}/GenerateToken`, {
            data: {
                userName: userBody.username,
                password: 'TestPassword@123'
            }
        });
        const tokenBody = await tokenResponse.json();
        const token = tokenBody.token;

        // Get first book ISBN
        const booksResponse = await request.get(`${API_BASE_URL}/Books`);
        const books = await booksResponse.json();
        const isbn = books.books[0].isbn;

        // Add book to collection
        const response = await request.post(`${API_BASE_URL}/Books`, {
            headers: {
                'Authorization': `Bearer ${token}`
            },
            data: {
                userId: newUserId,
                collectionOfIsbns: [
                    {
                        isbn: isbn
                    }
                ]
            }
        });

        expect(response.status()).toBe(201);
        const responseBody = await response.json();
        expect(responseBody).toHaveProperty('books');
        
        console.log('✓ Book added to collection successfully');
    });

    // Test 6: Update book in collection
    test('Update/Replace book in user collection', async ({ request }) => {
        // Setup: Register user and add a book
        const userResponse = await request.post(`${ACCOUNT_API_URL}/User`, {
            data: {
                userName: `testuser${Date.now()}`,
                password: 'TestPassword@123'
            }
        });
        const userBody = await userResponse.json();
        const newUserId = userBody.userID;

        const tokenResponse = await request.post(`${ACCOUNT_API_URL}/GenerateToken`, {
            data: {
                userName: userBody.username,
                password: 'TestPassword@123'
            }
        });
        const tokenBody = await tokenResponse.json();
        const token = tokenBody.token;

        // Get books
        const booksResponse = await request.get(`${API_BASE_URL}/Books`);
        const books = await booksResponse.json();
        const oldIsbn = books.books[0].isbn;
        const newIsbn = books.books[1].isbn;

        // Add first book
        await request.post(`${API_BASE_URL}/Books`, {
            headers: {
                'Authorization': `Bearer ${token}`
            },
            data: {
                userId: newUserId,
                collectionOfIsbns: [
                    {
                        isbn: oldIsbn
                    }
                ]
            }
        });

        // Replace book
        const response = await request.put(`${API_BASE_URL}/Books/${oldIsbn}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            },
            data: {
                userId: newUserId,
                isbn: newIsbn
            }
        });

        expect(response.status()).toBe(200);
        const responseBody = await response.json();
        expect(responseBody).toHaveProperty('books');
        
        console.log('✓ Book replaced in collection successfully');
    });

    // Test 7: Delete a book from collection
    test('Delete a book from user collection', async ({ request }) => {
        // Setup: Register user and add a book
        const userResponse = await request.post(`${ACCOUNT_API_URL}/User`, {
            data: {
                userName: `testuser${Date.now()}`,
                password: 'TestPassword@123'
            }
        });
        const userBody = await userResponse.json();
        const newUserId = userBody.userID;

        const tokenResponse = await request.post(`${ACCOUNT_API_URL}/GenerateToken`, {
            data: {
                userName: userBody.username,
                password: 'TestPassword@123'
            }
        });
        const tokenBody = await tokenResponse.json();
        const token = tokenBody.token;

        // Get books
        const booksResponse = await request.get(`${API_BASE_URL}/Books`);
        const books = await booksResponse.json();
        const isbn = books.books[0].isbn;

        // Add book
        await request.post(`${API_BASE_URL}/Books`, {
            headers: {
                'Authorization': `Bearer ${token}`
            },
            data: {
                userId: newUserId,
                collectionOfIsbns: [
                    {
                        isbn: isbn
                    }
                ]
            }
        });

        // Delete book
        const response = await request.delete(`${API_BASE_URL}/Book`, {
            headers: {
                'Authorization': `Bearer ${token}`
            },
            params: {
                ISBN: isbn
            },
            data: {
                userId: newUserId
            }
        });

        expect(response.status()).toBe(204);
        console.log('✓ Book deleted from collection successfully');
    });

    // Test 8: Get user information
    test('Get user information by UUID', async ({ request }) => {
        // Register user
        const userResponse = await request.post(`${ACCOUNT_API_URL}/User`, {
            data: {
                userName: `testuser${Date.now()}`,
                password: 'TestPassword@123'
            }
        });
        const userBody = await userResponse.json();
        const newUserId = userBody.userID;

        // Generate token
        const tokenResponse = await request.post(`${ACCOUNT_API_URL}/GenerateToken`, {
            data: {
                userName: userBody.username,
                password: 'TestPassword@123'
            }
        });
        const tokenBody = await tokenResponse.json();
        const token = tokenBody.token;

        // Get user information
        const response = await request.get(`${ACCOUNT_API_URL}/User/${newUserId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        expect(response.status()).toBe(200);
        const responseBody = await response.json();
        
        expect(responseBody).toHaveProperty('userID');
        expect(responseBody).toHaveProperty('username');
        expect(responseBody.userID).toBe(newUserId);
        
        console.log('✓ User information retrieved successfully');
    });

    // Test 9: Delete user account
    test('Delete user account', async ({ request }) => {
        // Register user
        const userResponse = await request.post(`${ACCOUNT_API_URL}/User`, {
            data: {
                userName: `testuser${Date.now()}`,
                password: 'TestPassword@123'
            }
        });
        const userBody = await userResponse.json();
        const newUserId = userBody.userID;

        // Generate token
        const tokenResponse = await request.post(`${ACCOUNT_API_URL}/GenerateToken`, {
            data: {
                userName: userBody.username,
                password: 'TestPassword@123'
            }
        });
        const tokenBody = await tokenResponse.json();
        const token = tokenBody.token;

        // Delete user
        const response = await request.delete(`${ACCOUNT_API_URL}/User/${newUserId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        expect(response.status()).toBe(204);
        console.log('✓ User account deleted successfully');
    });

    // Test 10: Verify authorization
    test('Verify authorization with valid token', async ({ request }) => {
        // Register user
        const userResponse = await request.post(`${ACCOUNT_API_URL}/User`, {
            data: {
                userName: `testuser${Date.now()}`,
                password: 'TestPassword@123'
            }
        });
        const userBody = await userResponse.json();

        // Generate token
        const tokenResponse = await request.post(`${ACCOUNT_API_URL}/GenerateToken`, {
            data: {
                userName: userBody.username,
                password: 'TestPassword@123'
            }
        });
        const tokenBody = await tokenResponse.json();
        const token = tokenBody.token;

        // Verify authorization
        const response = await request.post(`${ACCOUNT_API_URL}/Authorized`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        expect(response.status()).toBe(200);
        const responseBody = await response.json();
        expect(responseBody).toBe(true);
        
        console.log('✓ Authorization verified successfully');
    });
});
