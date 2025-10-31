<p align="center">
  <img src="assets/FS_Simbolo.png" alt="Logo FielScore" width="200"/>
</p>

<h1 align="center">FielScore ⚫⚪</h1>

<p align="center">
  Sistema de Controle de Frequência do Torcedor nos Jogos do Corinthians 🏟️
</p>

## Funcionalidades
- Cadastro, consulta e exclusão de torcedores
- Cadastro, consulta, atualização e exclusão de jogos
- Registro de presença em jogos
- Estatísticas de presença e fidelidade
- Autenticação JWT
- Documentação Swagger

## Estrutura
- **src/routes**: Rotas da API
- **src/controllers**: Lógica dos endpoints
- **src/services**: Regras de negócio
- **src/models**: Modelos de dados
- **src/middleware**: Autenticação e permissões
- **resources**: Documentação Swagger

## Como rodar
1. Instale as dependências: `npm install`
2. Inicie a API: `npm start`
3. Acesse a documentação Swagger em `/swagger`

## Regras de Negócio do FielScore

### Login
- Apenas usuários cadastrados podem realizar login.
- O login retorna um token JWT para autenticação nas demais rotas.
- Credenciais inválidas resultam em erro 401.

### Torcedores
- Cadastro exige email e número de fiel torcedor (nr_ft) únicos.
- Qualquer usuário pode criar seu próprio cadastro.
- Apenas admin pode listar todos os torcedores; torcedor vê apenas seu próprio cadastro.
- Torcedor só acessa seus próprios dados; admin acessa qualquer torcedor.
- Apenas admin pode deletar torcedores.

### Jogos
- Apenas admin pode criar, atualizar ou deletar jogos.
- Data do jogo é obrigatória.
- Unicidade garantida pela combinação dos campos principais.
- Qualquer usuário pode listar jogos; não precisa de token.

### Frequências (Presenças)
- Torcedor só pode registrar presença para si; admin pode registrar para qualquer torcedor.
- Não é permitido registrar presença duplicada para o mesmo torcedor e jogo.
- Pontuação de presença é calculada pelo backend conforme o tipo de ingresso:
    - Todo jogo começa com 10 pontos
    - Se tipo_ingresso for "FT": soma +10 (total 20)
    - Se tipo_ingresso for "inteira": soma +5 (total 15)
    - Se tipo_ingresso for "meia": mantém apenas os 10 pontos
- Estatísticas de presença e fidelidade são acessíveis via endpoint de frequências.
- Categoria de fidelidade:
    - Fazendinha: até 30 pontos
    - Pacaembu: acima de 30 até 60 pontos
    - Itaquera: acima de 60 pontos

### Gerais
- Todas as requisições e respostas são em JSON.
- Autenticação JWT obrigatória para rotas protegidas.
- Regras de acesso e visualização variam conforme o perfil (torcedor/admin).

## Observações
- Banco de dados em memória (os dados são perdidos ao reiniciar a aplicação).
- Documentação Swagger disponível em `/swagger`.
- Para testes automatizados, os dados devem ser inseridos diretamente no array em memória ou via endpoints antes dos testes de autenticação.
