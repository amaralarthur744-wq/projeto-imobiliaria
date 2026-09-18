# 🏢 Portal Imobiliário
[Ver Demonstração](https://amaralarthur744-wq.github.io/projeto-imobiliaria/)

Uma aplicação web para visualização de imóveis, agendamento de visitas e gestão de usuários, composta por uma interface interativa no front-end e uma API desenvolvida em Node.js com TypeScript no back-end.

---

## 🚀 Funcionalidades

- **Vitrine Interativa:** Listagem dinâmica de imóveis disponíveis para aluguel e venda.
- **Agendamento de Visitas:** Sistema integrado para agendar visitas aos imóveis selecionados.
- **Gestão de Perfil e Autenticação:** Tela de cadastro de novos usuários e painel para alteração de senha.
- **Interface Responsiva:** Design adaptado para telas de celulares, tablets e computadores.

---

## 🛠️ Tecnologias Utilizadas

### Front-end
- **HTML5 & CSS3:** Estruturação semântica e estilização moderna.
- **JavaScript (ES6+):** Manipulação dinâmica de DOM e consumo das APIs RESTful.

### Back-end
- **Node.js:** Ambiente de execução assíncrono para o servidor.
- **TypeScript:** Adição de tipagem estática e segurança ao código JavaScript.
- **Express:** Framework para estruturação de rotas e manipulação de requisições.

---

## 📁 Estrutura do Projeto

```text
projeto-imobiliaria/
├── public/              # Arquivos estáticos do Front-end
│   ├── app.js           # Lógica das telas e consumo da API
│   ├── cadastro.html    # Tela de cadastro de usuário
│   ├── index.html       # Página principal e modais
│   └── style.css        # Estilização global do projeto
├── src/                 # Código fonte do Back-end
│   ├── db.ts            # Conexão e estruturas do banco de dados
│   └── server.ts        # Configuração do servidor e endpoints
├── package.json         # Dependências e scripts do Node
└── tsconfig.json        # Configurações do compilador TypeScript

💻 Como Executar o Projeto

Pré-requisitos:
Certifique-se de ter o Node.js instalado no seu computador.

Passo a passo:

Clonar o repositório:
Bash
git clone [https://github.com/amaralarthur744-wq/projeto-imobiliaria.git](https://github.com/amaralarthur744-wq/projeto-imobiliaria.git)

Acessar a pasta do projeto:
Bash
cd projeto-imobiliaria

Instalar as dependências:
Bash
npm install

Iniciar o servidor:
Bash
npm start

Acessar a aplicação:
Abra o seu navegador e acesse http://localhost:3000 (ou a porta indicada no terminal).

