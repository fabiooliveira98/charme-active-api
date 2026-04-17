const ProductService = require('../services/ProductService');
const { v4: uuidv4 } = require('uuid');

const productsController = {
    // GET /products
    async getAll(req, res) {
        try {
            const { activeOnly } = req.query;
            const isOnlyActive = activeOnly === 'true';

            const catalog = await ProductService.fetchCatalog(isOnlyActive);
            res.json(catalog);
        } catch (error) {
            console.error('Error fetching products:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    // GET /products/:id
    async getById(req, res) {
        try {
            const { id } = req.params;
            const { activeOnly } = req.query;
            const isOnlyActive = activeOnly === 'true';

            const product = await ProductService.getById(id, isOnlyActive);

            if (!product) {
                return res.status(404).json({ error: 'Product not found' });
            }

            res.json(product);
        } catch (error) {
            console.error('Error fetching product by ID:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    // POST /products
    async create(req, res) {
        try {
            const { name, description, category, base_price, is_active } = req.body;

            if (!name || !base_price) {
                return res.status(400).json({ error: 'Name and Base Price are required.' });
            }

            const newProduct = await ProductService.createProduct({ name, description, category, base_price, is_active });
            res.status(201).json(newProduct);
        } catch (error) {
            console.error('Error creating product:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    // PUT /products/:id
    async update(req, res) {
        try {
            const { id } = req.params;
            const data = req.body;

            const result = await ProductService.updateProduct(id, data);
            
            if (result.error) {
                return res.status(404).json({ message: result.error });
            }

            res.json(result);
        } catch (error) {
            console.error('Error updating product:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    // POST /products/:id/variations
    async addVariation(req, res) {
        try {
            const { id } = req.params;
            const data = req.body;

            const result = await ProductService.createVariation(id, data);

            if (result.error) {
                return res.status(404).json({ message: result.error });
            }

            res.status(201).json(result);
        } catch (error) {
            console.error('Error adding variation:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    // POST /products/:id/images
    async uploadImage(req, res) {
        try {
            const { id } = req.params;
            const files = req.files;

            if (!files || files.length === 0) {
                return res.status(200).json({ message: 'No images uploaded, skipping.' });
            }

            const result = await ProductService.processUploads(id, files);

            if (result.error) {
                return res.status(404).json({ message: result.error });
            }

            res.status(201).json({ 
                message: 'Images uploaded successfully', 
                urls: result.urls 
            });
        } catch (error) {
            console.error('Error uploading images:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
};

module.exports = productsController;
