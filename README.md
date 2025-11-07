<p align="center">
  <img src="assets/FS_Simbolo.png" alt="Logo FielScore" width="200"/>
</p>

<h1 align="center">⚽ FielScore ⚽</h1>

<p align="center">
  Sistema de Controle de Frequência do Torcedor nos Jogos do Corinthians 🏟️
</p>

## Funcionalidades

* Cadastro, consulta e exclusão de torcedores
* Cadastro, consulta, atualização e exclusão de jogos
* Registro de presença em jogos
* Estatísticas de presença e fidelidade
* Autenticação via JWT
* Documentação Swagger interativa

## Stack Utilizada

* **Linguagem:** JavaScript (Node.js)
* **Principais bibliotecas:**

  * [Mocha](https://mochajs.org/)
  * [Supertest](https://github.com/visionmedia/supertest)
  * [Chai](https://www.chaijs.com/)
  * [dotenv](https://github.com/motdotla/dotenv)
  * [swagger-ui-express](https://github.com/scottie1984/swagger-ui-express)
  * [mochawesome](https://github.com/mochawesome/mochawesome)

## Estrutura de Diretórios

```
portifolio-qa-fielscore/
├── .env                         # Variáveis de ambiente
├── .git/                        # Configurações Git
├── .github/                     # Configurações GitHub Actions
│   └── workflows/
│       └── main.yml            # Pipeline de CI
├── .gitignore                  # Arquivos ignorados pelo Git
├── assets/                     # Recursos estáticos
│   └── FS_Simbolo.png         # Logo do projeto
├── endpoints.md                # Documentação dos endpoints
├── fixtures/                   # Dados para testes
│   ├── postFrequencia.json    # Dados para teste de frequência
│   ├── postJogos.json        # Dados para teste de jogos
│   ├── postLogin.json         # Dados para teste de login
│   ├── postTorcedor.json      # Dados para teste de torcedor
│   ├── putJogos.json          # Dados para atualização de jogos
│   └── queryFrequencia.json   # Queries para teste de frequência
├── helpers/                    # Funções auxiliares
│   └── autenticacao.js        # Helper de autenticação
├── index.js                    # Ponto de entrada da aplicação
├── mochawesome-report/         # Relatórios de teste
├── package-lock.json           # Lock de dependências
├── package.json                # Configuração do projeto
├── performance/                # Testes de performance
│   ├── helpers/
│   │   └── autenticacao.js
│   ├── test/
│   │   ├── jogos.test.js
│   │   ├── login.test.js
│   │   └── torcedor.test.js
│   └── utils/
│       └── variaveis.js
├── README.md                   # Documentação principal
├── resources/                  # Recursos da aplicação
│   └── swagger.json            # Documentação Swagger
├── src/                        # Código fonte principal
│   ├── app.js                  # Configuração do Express
│   ├── controllers/            # Controladores
│   │   ├── authController.js
│   │   ├── frequenciaController.js
│   │   ├── jogoController.js
│   │   └── torcedorController.js
│   ├── middleware/             # Middlewares
│   │   └── auth.js             # Middleware de autenticação
│   ├── models/                 # Modelos
│   │   ├── db.js               # Banco de dados em memória
│   │   ├── frequencia.js
│   │   ├── jogo.js
│   │   └── torcedor.js
│   ├── routes/                 # Rotas
│   │   ├── authRoutes.js
│   │   ├── frequenciaRoutes.js
│   │   ├── jogoRoutes.js
│   │   └── torcedorRoutes.js
│   ├── server.js               # Configuração do servidor
│   └── services/               # Serviços
│       ├── frequenciaService.js
│       ├── jogoService.js
│       └── torcedorService.js
└── test/                        # Testes de integração
    ├── frequencia.test.js
    ├── jogos.test.js
    ├── login.test.js
    ├── pipeline.test.js
    └── torcedor.test.js
```

* **src/**: Código principal da aplicação (MVC: controllers, services, models, routes)
* **resources/**: Documentação Swagger
* **helpers/**: Funções utilitárias para autenticação e testes
* **test/**: Testes automatizados (Mocha/Supertest/Chai)
* **mochawesome-report/**: Relatórios HTML dos testes
* **performance/**: Testes de performance com helpers e utilitários

## Arquivo `.env`

Crie um arquivo `.env` na raiz do projeto com o seguinte conteúdo:

```
BASE_URL=http://localhost:3000
```

> A variável `BASE_URL` define o endereço da API para os testes automatizados.

## Comandos para Execução dos Testes

* Executar todos os testes:

  ```bash
  npm test
  ```
* Executar um teste específico:

  ```bash
  npx mocha test/nome_do_arquivo.test.js
  ```
* Gerar relatório HTML com Mochawesome:

  ```bash
  npx mocha --reporter mochawesome
  ```

  O relatório será gerado no diretório `mochawesome-report`.

## Integração Contínua (CI/CD)

O projeto utiliza GitHub Actions para automação de testes:

* Execução de todos os testes automatizados
* Geração de relatório Mochawesome

## Como Rodar a API

1. Instale as dependências:

   ```bash
   npm install
   ```
2. Inicie a API:

   ```bash
   npm start
   ```
3. Acesse a documentação Swagger em:

   ```
   http://localhost:3000/swagger
   ```

## Regras de Negócio do FielScore

### Login

* Apenas usuários cadastrados podem realizar login.
* O login retorna um token JWT para autenticação nas demais rotas.
* Credenciais inválidas retornam erro 401.

### Torcedores

* Cadastro exige email e número de fiel torcedor (`nr_ft`) únicos.
* Qualquer usuário pode criar seu próprio cadastro.
* Apenas admin pode listar todos os torcedores; torcedor vê apenas seu próprio cadastro.
* Torcedor só acessa seus próprios dados; admin acessa qualquer torcedor.
* Apenas admin pode deletar torcedores.

### Jogos

* Apenas admin pode criar, atualizar ou deletar jogos.
* Qualquer usuário pode listar jogos; não precisa de token.

### Frequências (Presenças)

* Torcedor só pode registrar presença para si; admin pode registrar para qualquer torcedor.
* Não é permitido registrar presença duplicada para o mesmo torcedor e jogo.
* Pontuação de presença é calculada conforme o tipo de ingresso:

  * Todo jogo começa com 10 pontos
  * Tipo de ingresso:

    * `"FT"` → +10 pontos (total 20)
    * `"inteira"` → +5 pontos (total 15)
    * `"meia"` → mantém 10 pontos
* Estatísticas de presença e fidelidade acessíveis via endpoint de frequências.

### Visualização de Frequências

* Endpoint `GET /frequencias`:

  * **admin**: vê todas as frequências
  * **torcedor**: vê apenas suas próprias frequências
* Categoria de fidelidade:

  * **Fazendinha:** até 30 pontos
  * **Pacaembu:** 31 a 60 pontos
  * **Itaquera:** acima de 60 pontos

### Gerais

* Todas as requisições e respostas são em JSON.
* Autenticação JWT obrigatória para rotas protegidas.
* Regras de acesso variam conforme o perfil (torcedor/admin).

## Histórico de Versões

### v1.0.0 (Novembro 2025)

* Implementação inicial do sistema
* Sistema de autenticação JWT
* CRUD completo de torcedores
* CRUD completo de jogos
* Sistema de registro de presenças
* Cálculo de pontuação e fidelidade
* Documentação Swagger
* Testes automatizados com Mocha/Chai/Supertest
* Relatórios com Mochawesome
* Integração Contínua com GitHub Actions
* Arquitetura MVC
* API RESTful

## Observações

* Banco de dados em memória (os dados são perdidos ao reiniciar a aplicação)
* Para testes automatizados, insira dados diretamente no array em memória ou via endpoints antes de testar autenticação
