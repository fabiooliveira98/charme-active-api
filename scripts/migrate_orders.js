const db = require('../src/config/db');

async function createTables() {
    try {
        console.log('Iniciando criação das tabelas...');

        const sql = `
            CREATE TABLE IF NOT EXISTS customers (
                id VARCHAR(36) PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                phone VARCHAR(20) UNIQUE NOT NULL,
                email VARCHAR(255),
                password_hash VARCHAR(255) NOT NULL,
                loyalty_points INT DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS orders (
                id VARCHAR(36) PRIMARY KEY,
                customer_id VARCHAR(36) NOT NULL,
                total_amount DECIMAL(10,2) NOT NULL,
                status ENUM('pendente', 'aguardando_pagamento', 'concluido', 'cancelado') DEFAULT 'pendente',
                finalized_by VARCHAR(36),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (customer_id) REFERENCES customers(id),
                FOREIGN KEY (finalized_by) REFERENCES users(id)
            );

            CREATE TABLE IF NOT EXISTS order_items (
                id VARCHAR(36) PRIMARY KEY,
                order_id VARCHAR(36) NOT NULL,
                product_id VARCHAR(36) NOT NULL,
                variation_id VARCHAR(36) NOT NULL,
                quantity INT NOT NULL,
                price_at_purchase DECIMAL(10,2) NOT NULL,
                FOREIGN KEY (order_id) REFERENCES orders(id),
                FOREIGN KEY (product_id) REFERENCES products(id),
                FOREIGN KEY (variation_id) REFERENCES product_variations(id)
            );
        `;

        // O mysql2/promise não executa múltiplos comandos por padrão por segurança, 
        // então vamos separar os comandos ou garantir que a conexão suporte.
        // Já que são 3 tabelas, vamos rodar 3 queries separadas.

        await db.query(`
            CREATE TABLE IF NOT EXISTS customers (
                id VARCHAR(36) PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                phone VARCHAR(20) UNIQUE NOT NULL,
                email VARCHAR(255),
                password_hash VARCHAR(255) NOT NULL,
                loyalty_points INT DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('Tabela customers criada!');

        await db.query(`
            CREATE TABLE IF NOT EXISTS orders (
                id VARCHAR(36) PRIMARY KEY,
                customer_id VARCHAR(36) NOT NULL,
                total_amount DECIMAL(10,2) NOT NULL,
                status ENUM('pendente', 'aguardando_pagamento', 'concluido', 'cancelado') DEFAULT 'pendente',
                finalized_by VARCHAR(36),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (customer_id) REFERENCES customers(id),
                FOREIGN KEY (finalized_by) REFERENCES users(id)
            )
        `);
        console.log('Tabela orders criada!');

        await db.query(`
            CREATE TABLE IF NOT EXISTS order_items (
                id VARCHAR(36) PRIMARY KEY,
                order_id VARCHAR(36) NOT NULL,
                product_id VARCHAR(36) NOT NULL,
                variation_id VARCHAR(36) NOT NULL,
                quantity INT NOT NULL,
                price_at_purchase DECIMAL(10,2) NOT NULL,
                FOREIGN KEY (order_id) REFERENCES orders(id),
                FOREIGN KEY (product_id) REFERENCES products(id),
                FOREIGN KEY (variation_id) REFERENCES product_variations(id)
            )
        `);
        console.log('Tabela order_items criada!');

        console.log('Todas as tabelas foram criadas com sucesso!');
        process.exit(0);
    } catch (error) {
        console.error('Erro ao criar tabelas:', error);
        process.exit(1);
    }
}

createTables();
