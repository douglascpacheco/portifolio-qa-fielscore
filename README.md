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

## Observações
- Banco de dados em memória
- Todas as requisições e respostas em JSON
- Pontuação e nível de fidelidade calculados pelo backend
- Regras de acesso conforme perfil (torcedor/admin)
