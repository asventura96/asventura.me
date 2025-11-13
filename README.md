# asventura.me - Portfólio Pessoal e Currículo Dinâmico

Este é o repositório oficial do meu site pessoal e portfólio profissional, [asventura.me](https://asventura.me/).

O projeto foi desenvolvido para ser um currículo online dinâmico, apresentando minhas habilidades, experiências profissionais e formação acadêmica, com um painel administrativo próprio para gerenciamento de conteúdo.

[![Deploy com Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fasventura96%2Fasventura.me)

## 🖥️ Acesso

Você pode acessar o site em produção no link: **[https://asventura.me/](https://asventura.me/)**

## 🚀 Funcionalidades

* **Exibição de Currículo:** Apresentação clara do perfil profissional, experiências, formação, cursos, idiomas e habilidades (skills).
* **Painel Administrativo:** Uma área privada (`/admin`) para gerenciar todo o conteúdo do site.
* **Autenticação:** O painel é protegido usando **NextAuth.js**, garantindo que apenas o administrador possa modificar o conteúdo.
* **Operações CRUD:** O painel permite criar, ler, editar e excluir (CRUD) registros de todas as seções do currículo.

## 🛠️ Tecnologias Utilizadas

Este projeto foi construído utilizando as seguintes tecnologias:

* **Framework:** [Next.js](https://nextjs.org/) (com App Router)
* **Linguagem:** [TypeScript](https://www.typescriptlang.org/)
* **Banco de Dados:** [MySQL](https://www.mysql.com/)
* **ORM:** [Prisma](https://www.prisma.io/)
* **Autenticação:** [NextAuth.js](https://next-auth.js.org/)
* **Hospedagem:** [Vercel](https://vercel.com/)
* **(Opcional: Adicione a de Estilização)** Ex: [Tailwind CSS](https://tailwindcss.com/) / [Styled-components](https://styled-components.com/)

## 🏁 Rodando Localmente

Siga os passos abaixo para executar o projeto em seu ambiente local.

1.  **Clone o repositório:**
    ```bash
    git clone [https://github.com/asventura96/asventura.me.git](https://github.com/asventura96/asventura.me.git)
    cd asventura.me
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    ```

3.  **Configure as Variáveis de Ambiente:**
    Crie um arquivo `.env` na raiz do projeto. Você precisará, no mínimo, das seguintes variáveis (baseado no `schema.prisma` e `middleware.ts`):

    ```ini
    # URL de conexão do seu banco MySQL
    DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/DATABASE"

    # Secrets para o NextAuth.js
    # Gere um secret em: [https://generate-secret.vercel.app/](https://generate-secret.vercel.app/)
    NEXTAUTH_SECRET="SEU_SECRET_AQUI"
    NEXTAUTH_URL="http://localhost:3000"
    ```

4.  **Configure o Banco de Dados:**
    Execute o Prisma para sincronizar seu schema com o banco de dados:
    ```bash
    npx prisma db push
    ```

5.  **Execute o Seed (Opcional):**
    Para popular o banco com dados iniciais (como o usuário admin), execute o script de seed:
    ```bash
    npx prisma db seed
    ```

6.  **Inicie o servidor de desenvolvimento:**
    ```bash
    npm run dev
    ```

7.  Abra [http://localhost:3000](http://localhost:3000) em seu navegador.

## 📄 Licença

Este projeto é distribuído sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.