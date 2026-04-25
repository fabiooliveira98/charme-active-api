
README.md



# Charme Active - API REST 🚀🔐
**Charme Active API** é o motor por trás de uma plataforma de e-commerce voltada para o setor de moda fitness. Desenvolvida com foco em segurança, escalabilidade e organização, esta API RESTful gerencia desde a autenticação de usuários até o controle complexo de estoque e pedidos.
Este é um projeto pessoal em constante evolução para servir de backend a uma vitrine de vendas moderna.
---
## 🛠️ Tecnologias e Arquitetura
- **Runtime:** Node.js
- **Framework:** Express
- **Banco de Dados:** MySQL
- **Autenticação:** JWT (JSON Web Tokens) com Refresh Strategy
- **Upload de Arquivos:** Multer para gestão de imagens de produtos
- **Arquitetura:** Baseada em camadas (Routes -> Controllers -> Services -> Models) para maior manutenibilidade.
---
## 📋 Funcionalidades Principais
### 🔐 Autenticação e Segurança
- Login e Registro diferenciado para **Clientes** e **Administradores**.
- Proteção de rotas via Middleware de Autenticação.
- Controle de acesso baseado em cargos (RBAC).
### 📦 Gestão de Catálogo (Produtos)
- CRUD completo de produtos.
- **Variações Dinâmicas:** Controle de estoque por combinações de Tamanho (P, M, G, GG) e Cor.
- **Galeria de Imagens:** Suporte para múltiplos uploads de fotos por produto.
### 👥 Gestão de Clientes
- Cadastro de perfis com dados de contato.
- Histórico de pedidos personalizado.
### 🛍️ Fluxo de Pedidos
- Criação de pedidos com validação de estoque.
- Listagem administrativa de todos os pedidos da loja.
- Fluxo de finalização e cancelamento de pedidos com atualização automática de estoque.
---
## 🚀 Como executar o projeto
1. Clone o repositório.
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Configure suas variáveis de ambiente em um arquivo `.env` (Database Host, User, Password, JWT_SECRET).
4. Inicie o servidor em modo de desenvolvimento:
   ```bash
   npm run dev
   ```
   *A API estará rodando por padrão na porta 3333.*
---

---
