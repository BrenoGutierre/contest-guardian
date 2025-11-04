# ⚔️ Contest Guardian — Gear 5

> “A disciplina vence o talento quando o talento não tem disciplina.”

O **Contest Guardian — Gear 5** é uma plataforma web para guerreiros do conhecimento.  
Unindo tecnologia, foco e motivação, o sistema traz **IA, simulados e relatórios inteligentes**  
para treinar mentes que sonham em conquistar concursos e superar seus próprios limites.

---

## 🚀 Tecnologias

**Back-end**
- Node.js + Express  
- Prisma ORM + PostgreSQL  
- JWT Authentication (Access + Refresh Tokens)  
- Nodemailer para recuperação de senha  
- Zod para validação de dados  
- Helmet + CORS para segurança  

**Front-end**
- HTML + TailwindCSS  
- JavaScript modular  
- Consumo da API em tempo real  
- Armazenamento local seguro (localStorage JWT)

---

## 🧩 Estrutura do Projeto

contest-guardian-api/
├── index.js
├── config.js
├── db.js
├── auth.js
├── jwt.js
├── mailer.js
├── auth.routes.js
├── auth.controller.js
├── exams.routes.js
├── exams.controller.js
├── results.routes.js
├── results.controller.js
├── seed.js
├── package.json
└── prisma/
└── schema.prisma

| Método | Rota             | Descrição                          |
| :----: | :--------------- | :--------------------------------- |
| `POST` | `/auth/register` | Cria um novo usuário               |
| `POST` | `/auth/login`    | Realiza login e retorna tokens     |
| `POST` | `/auth/refresh`  | Gera novo token de acesso          |
| `POST` | `/auth/logout`   | Invalida o refresh token           |
|  `GET` | `/auth/me`       | Retorna dados do usuário logado    |
| `POST` | `/auth/recover`  | Envia link de recuperação de senha |
| `POST` | `/auth/reset`    | Redefine a senha via token         |
|  `GET` | `/exams`         | Lista exames (requer login)        |
| `POST` | `/exams`         | Cria novo exame                    |
|  `GET` | `/results/me`    | Resultados do usuário              |
| `POST` | `/results`       | Envia novo resultado de simulado   |

| Script                  | Ação                              |
| :---------------------- | :-------------------------------- |
| `npm run dev`           | Executa servidor com **nodemon**  |
| `npm run start`         | Executa em modo de produção       |
| `npm run prisma:studio` | Abre o Prisma Studio              |
| `npm run seed`          | Popula o banco com dados iniciais |

Filosofia do Projeto

O Contest Guardian foi criado para unir tecnologia e propósito.
Ele representa mais que um sistema — é um companheiro de jornada para quem luta por disciplina e crescimento diário.
Cada linha de código é um lembrete:

“Não é sobre ser o melhor, é sobre nunca parar de evoluir.”

Autor

Breno Gutierre
Desenvolvedor | Estudante de ADS | Visionário em constante evolução
São Sebastião - SP
“Transformando estudo em jornada e código em legado.”

Licença

Este projeto está sob a licença MIT.
Sinta-se livre para usar, adaptar e evoluir — contanto que mantenha o espírito do Guardião vivo

