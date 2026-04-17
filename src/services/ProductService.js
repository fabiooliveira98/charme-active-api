const ProductModel = require('../models/ProductModel'); 

const ProductService = {
    
    // Método para buscar todos os produtos (Catálogo)
    async fetchCatalog(isOnlyActive) {
        // Se a Charme Active precisar aplicar um "desconto automático de sexta-feira" 
        // no site todo um dia, o cálculo entra aqui, antes de ir pro BD!

        // Pede a lista crua pro banco
        const catalog = await ProductModel.buscartodos(isOnlyActive);
        
        return catalog;
    },

    // Método para buscar um único produto por ID
    async getById(id, isOnlyActive) {
        // Se houver regras de negócio específicas para quando se abre a página 
        // de detalhes de um produto, elas entram aqui.
        
        // Pede o produto específico para o banco de dados
        const product = await ProductModel.getById(id, isOnlyActive);
        
        return product;
    },
    async createProduct(data) {
        
        const newProduct = await ProductModel.create(data);
        
        return newProduct;
    },


    async createVariation(idProduct,data) {
        
        const products = await ProductModel.getById(idProduct, false);
       

        if (!products) {
                return { error: 'Product not found' };
            }
        

         const newVariation = await ProductModel.insertVariation(idProduct,data);
         
         return newVariation;

    },
    async updateProduct(id, data) {
        const product = await ProductModel.getById(id, false);

        if (!product) {
            return { error: 'Product not found' };
        }
        
        const updatedProduct = await ProductModel.update(id, data);
        return updatedProduct;
    },

    async processUploads(productId, files) {
        const product = await ProductModel.getById(productId, false);
        if (!product) {
            return { error: 'Product not found' };
        }

        const uploadedUrls = [];
        for (const file of files) {
            const imageUrl = `/uploads/${file.filename}`;
            await ProductModel.addImage(productId, imageUrl);
            uploadedUrls.push(imageUrl);
        }
        return { urls: uploadedUrls };
    }
};

// Exportamos apenas o objeto principal diretamente
module.exports = ProductService;