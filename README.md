# Go Events

Uma plataforma completa de gerenciamento de eventos construída com Next.js 14, Prisma e PostgreSQL.

## 🚀 Funcionalidades

- **Página inicial**: Lista de eventos disponíveis
- **Autenticação**: Sistema completo de login/registro com JWT e cookies HttpOnly
- **Inscrições**: Sistema de inscrição em eventos com geração de QR Code
- **Pagamentos**: Simulação de pagamento PIX
- **Dashboard do usuário**: Visualização de eventos inscritos
- **Painel admin**: CRUD completo de eventos (apenas para administradores)
- **Notificações**: Envio de email de confirmação após pagamento

## 🛠️ Stack Tecnológica

- **Frontend**: Next.js 14 (App Router), TypeScript, TailwindCSS
- **Backend**: Next.js API Routes
- **Banco de dados**: PostgreSQL com Prisma ORM
- **Autenticação**: JWT com cookies HttpOnly + bcrypt
- **Email**: Nodemailer (configurado para Ethereal em desenvolvimento)
- **QR Code**: Biblioteca qrcode para geração de códigos
- **Validação**: Zod para validação de dados

## 📦 Instalação

1. Clone o projeto:

```bash
git clone <repository-url>
cd go-events
```

2. Instale as dependências:

```bash
npm install
```

3. Configure as variáveis de ambiente:

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:

```env
# Database (Neon PostgreSQL)
DATABASE_URL="postgresql://username:password@host/database?sslmode=require"

# JWT Secret (gere uma chave segura)
JWT_SECRET="sua-chave-secreta-muito-segura"

# NextAuth Secret
NEXTAUTH_SECRET="sua-chave-nextauth-secreta"

# SMTP Configuration (Ethereal para desenvolvimento)
SMTP_HOST="smtp.ethereal.email"
SMTP_PORT=587
SMTP_USER="seu-usuario@ethereal.email"
SMTP_PASS="sua-senha-ethereal"
```

4. Execute as migrações do banco:

```bash
npx prisma migrate dev --name init
```

5. Gere o cliente Prisma:

```bash
npx prisma generate
```

## 🚀 Executando o projeto

### Desenvolvimento

```bash
npm run dev
```

### Produção

```bash
npm run build
npm start
```

## 📊 Banco de Dados

O projeto utiliza PostgreSQL com as seguintes entidades:

- **User**: Usuários do sistema (com flag isAdmin)
- **Event**: Eventos disponíveis
- **Registration**: Inscrições dos usuários nos eventos

Veja o arquivo `prisma/schema.prisma` para detalhes completos do schema.

## 🔐 Autenticação

- Sistema JWT com cookies HttpOnly para segurança
- Middleware automático para proteção de rotas
- Rotas protegidas: `/meus-eventos`, `/admin/*`
- Hash de senhas com bcrypt

## 📱 Páginas e Rotas

### Públicas

- `/` - Página inicial com lista de eventos
- `/login` - Login de usuários
- `/register` - Cadastro de novos usuários

### Protegidas (usuário logado)

- `/meus-eventos` - Dashboard do usuário

### Admin (apenas administradores)

- `/admin/events` - Gerenciamento de eventos

### API Routes

- `POST /api/auth/register` - Cadastro
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Dados do usuário logado
- `GET/POST /api/events` - Listar/criar eventos
- `GET/PUT/DELETE /api/events/[id]` - Operações em evento específico
- `GET/POST /api/registrations` - Listar/criar inscrições
- `POST /api/payments/simulate` - Simular pagamento

## 🚀 Deploy na Vercel

### Configuração automática

1. Conecte seu repositório na Vercel
2. Configure as variáveis de ambiente no painel da Vercel:

   - `DATABASE_URL`
   - `JWT_SECRET`
   - `NEXTAUTH_SECRET`
   - `SMTP_HOST`
   - `SMTP_PORT`
   - `SMTP_USER`
   - `SMTP_PASS`

3. O deploy será automático com as configurações do `vercel.json`

### Banco de dados

Para produção, recomenda-se usar:

- **Neon**: PostgreSQL serverless
- **PlanetScale**: MySQL serverless
- **Railway**: PostgreSQL hosted

### Configuração do Neon

1. Crie uma conta em [neon.tech](https://neon.tech)
2. Crie um novo projeto
3. Copie a string de conexão para `DATABASE_URL`
4. As migrações serão executadas automaticamente no build

## 🔧 Comandos Úteis

```bash
# Resetar banco de dados
npx prisma migrate reset

# Visualizar banco no Prisma Studio
npx prisma studio

# Gerar migration manual
npx prisma migrate dev --name nome-da-migration

# Aplicar migrations em produção
npx prisma migrate deploy
```

## 📝 Funcionalidades Implementadas

✅ Listagem de eventos na página inicial
✅ Sistema de autenticação JWT com cookies
✅ Cadastro e login de usuários
✅ Middleware de proteção de rotas
✅ Inscrição em eventos com QR Code
✅ Simulação de pagamento PIX
✅ Dashboard do usuário com eventos inscritos
✅ Painel administrativo para CRUD de eventos
✅ Envio de email de confirmação
✅ Validação de dados com Zod
✅ Layout responsivo com TailwindCSS
✅ Configuração para deploy na Vercel

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch: `git checkout -b feature/nova-funcionalidade`
3. Commit suas mudanças: `git commit -m 'Adiciona nova funcionalidade'`
4. Push para a branch: `git push origin feature/nova-funcionalidade`
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT.
