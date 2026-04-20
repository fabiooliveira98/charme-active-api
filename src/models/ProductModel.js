const db = require('../config/db');
const { v4: uuidv4 } = require('uuid');

const ProductModel = {
    async buscartodos(isOnlyActive) {
        let query = 'SELECT * FROM products';
        let params = [];

        if (isOnlyActive) {
            query += ' WHERE is_active = ?';
            params.push(true);
        }

        const [products] = await db.query(query, params);
        
        // Puxa as tabelas em anexo (fotos e tamanhos)
        for (let product of products) {
            const [images] = await db.query('SELECT url FROM product_images WHERE product_id = ?', [product.id]);
            const [variations] = await db.query('SELECT id, size, color, quantity FROM product_variations WHERE product_id = ?', [product.id]);
            
            product.images = images.map(img => img.url);
            product.variations = variations;
        }

        return products;
    },
    async getById(id, isOnlyActive) {
        let query = 'SELECT * FROM products WHERE id = ?';
        let params = [id];

        if (isOnlyActive) {
            query += ' AND is_active = ?';
            params.push(true);
        }

        const [products] = await db.query(query, params);

        if (products.length === 0) {
            return null;
        }

        const product = products[0];
        const [images] = await db.query('SELECT url FROM product_images WHERE product_id = ?', [id]);
        const [variations] = await db.query('SELECT id, size, color, quantity FROM product_variations WHERE product_id = ?', [id]);

        product.images = images.map(img => img.url);
        product.variations = variations;

        return product;
    },
    async create(data) {
        const { name, description, category, base_price, is_active } = data;
        const id = uuidv4();
        const active = is_active !== undefined ? is_active : true;
        
        const query = `INSERT INTO products (id, name, description, category, base_price, is_active)
                     VALUES (?, ?, ?, ?, ?, ?)`;
        await db.query(query, [id, name, description || '', category || '', base_price, active]);

        return await this.getById(id, false);
    },
    async insertVariation(idProduct, variationData) {
        const variationId = uuidv4();
        const { size, color, quantity } = variationData;
        const query = `INSERT INTO product_variations (id, product_id, size, color, quantity) VALUES (?, ?, ?, ?, ?)`;
        await db.query(query, [variationId, idProduct, size, color, quantity]);
        
        const [variation] = await db.query('SELECT id, product_id, size, color, quantity FROM product_variations WHERE id = ?', [variationId]);
        return variation[0];
    },
    async update(id, data) {
        const { name, description, category, base_price, is_active } = data;
        const query = `UPDATE products SET name = ?, description = ?, category = ?, base_price = ?, is_active = ? WHERE id = ?`;
        await db.query(query, [name, description, category, base_price, is_active, id]);

        return await this.getById(id, false);
    },
    async addImage(productId, imageUrl) {
        const imageId = uuidv4();
        const query = `INSERT INTO product_images (id, product_id, url) VALUES (?, ?, ?)`;
        await db.query(query, [imageId, productId, imageUrl]);
        return { id: imageId, url: imageUrl };
    },
    async delete(id) {
        await db.query('DELETE FROM products WHERE id = ?', [id]);
        return true;
    },
    async decreaseStock(variationId, quantity) {
        const query = `UPDATE product_variations SET quantity = quantity - ? WHERE id = ? AND quantity >= ?`;
        const [result] = await db.query(query, [quantity, variationId, quantity]);
        return result.affectedRows > 0;
    }
};

module.exports = ProductModel;



