# 👨‍🍳 cozinhe.me - Culinária 3.0

O **cozinhe.me** é uma plataforma web interativa e gamificada que transforma a experiência de cozinhar em casa. O aplicativo reúne gestão inteligente de ingredientes, receitas adaptáveis, auxílio de Inteligência Artificial e dinâmicas de conquistas (gamificação) para incentivar o utilizador a evoluir as suas habilidades culinárias.

Tudo isto foi desenvolvido numa arquitetura **Single Page Application (SPA)** leve, rápida e moderna, contida num único arquivo.

---

## 🚀 Funcionalidades Principais

### 🔐 1. Sistema de Autenticação (Login e Cadastro)
* Tela inicial integrada para novos registos ou login.
* Salvamento seguro no histórico do navegador (`localStorage` e `sessionStorage`) para simular a retenção do utilizador mesmo após atualizar a página.

### 🏠 2. Painel Inicial (Início)
* **Status do Chef:** Exibição do nível atual, progresso de XP e sequência de dias ativos (Streak).
* **🎰 Roleta Diária:** Um minijogo funcional onde o utilizador roda uma roleta analógica para ganhar recompensas e bónus simulados diários.

### 📖 3. Livro de Receitas Inteligente
* Filtros rápidos por categorias e barra de pesquisa dinâmica.
* **Controlo de Porções Automatizado:** Altere o número de doses e veja as quantidades dos ingredientes recalcularem-se instantaneamente.
* Sistema inteligente que sugere substituições para ingredientes em falta.

### 🧺 4. Inventário e Despensa Virtual
* Adicione ingredientes com quantidade e monitorize a data de validade.
* Alertas visuais automáticos baseados no vencimento dos alimentos (Válido, Próximo ao Vencimento, Vencido).

### 🤖 5. IA Chef (Ferramentas de Preparação)
Interface desenhada para três vertentes de assistência por IA:
* **Vídeo IA:** Transforma vídeos de receitas em instruções passo a passo.
* **Voz Ativa:** Comandos de voz para avançar passos sem sujar o ecrã.
* **Mise en Place Visual:** Gráfico de tempo dinâmico que divide as tarefas por estações de trabalho (Fogão, Tábua, Preparação).

### 👥 6. Comunidade Culinária
* Feed de publicações onde utilizadores partilham os seus pratos.
* Botão interativo de "Gostar" (Like) e destaques para os Chefs criadores da semana.

### 🏆 7. Gamificação e Conquistas
* **Árvore de Técnicas:** Progresso visual de habilidades como "Cortes de Faca" e "Controlo de Temperatura".
* **Mural de Emblemas:** Medalhas colecionáveis em formato hexagonal (Ouro, Prata, Bronze) desbloqueadas por ações na plataforma.

---

## 🛠️ Tecnologias Utilizadas

O projeto foi construído utilizando o conceito purista de desenvolvimento web (**Vanilla Coded**), garantindo máxima performance sem dependências externas pesadas:

* **HTML5:** Estrutura semântica e layouts otimizados.
* **CSS3 Moderno:** * Uso de *CSS Variables* para gestão da paleta de cores (Cream, Olive, Amber, Sage).
  * Layout responsivo baseado em **Flexbox** e **CSS Grid**.
  * Design Mobile-First adaptável para ecrãs mais pequenos (Menu compacto automático).
* **JavaScript (ES6+):** * Motor de renderização dinâmico para troca de abas sem recarregar a página (SPA).
  * Manipulação de Arrays para filtragem de inventário e receitas.
  * API de animação `requestAnimationFrame` para o sistema de notificações (*Toasts*).

---

## 📦 Como Executar o Projeto

Por ter sido construído inteiramente com tecnologias nativas do navegador, **não necessita de instalar nenhuma dependência ou servidor local**.

1. Transfira ou guarde o arquivo `cozinhe_me_app.html` no seu computador.
2. Clique duas vezes sobre o arquivo ou arraste-o para dentro de qualquer navegador moderno (Google Chrome, Mozilla Firefox, Microsoft Edge, Safari, etc.).
3. O aplicativo estará pronto a ser utilizado!

---

## 📋 Guia de Testes Rápidos

Para validar as principais engrenagens do sistema, siga estes passos:

1. **Primeiro Acesso:** Crie uma conta na aba **"Criar Conta"** utilizando um e-mail e senha fictícios. O sistema dará as boas-vindas com uma notificação no canto inferior direito.
2. **Navegação SPA:** Clique nos itens do menu lateral ("Receitas", "Inventário", "IA Chef"). Note que a transição entre secções ocorre instantaneamente sem qualquer carregamento de página.
3. **Escalonamento de Receitas:** Vá a "Receitas", selecione o prato disponível e mude o número de porções nos botões `+` e `-`. Verifique os ingredientes a mudarem de valor proporcionalmente.
4. **Persistência de Login:** Copie o link do navegador, abra uma **Janela Anónima**, cole o link e tente entrar com a conta que acabou de criar na aba **"Entrar"** para testar a validação de dados.

---

## ✒️ Licença

Este projeto foi desenvolvido para fins demonstrativos e educacionais de uma interface de utilizador (UI/UX) avançada para a Culinária 3.0. Sinta-se à vontade para expandir, conectar a APIs reais de Inteligência Artificial ou utilizar como base para o seu portefólio!
Aqui está o guia passo a passo em formato de texto simples, ideal para enviar diretamente para as pessoas que vão testar o sistema.

---

### Guia de Teste - cozinhe.me

Este e um guia rápido para testar as principais funções da plataforma. Como o aplicativo foi desenvolvido em um único arquivo web, tudo roda direto no seu navegador de internet, sem necessidade de instalar nada.

#### Passo 1: Abrir o Aplicativo

1. Localize o arquivo "cozinhe_me_app.html" no seu computador.
2. Clique duas vezes sobre o arquivo (ou arraste-o para dentro do seu navegador de internet, como Google Chrome, Microsoft Edge, Firefox ou Safari).
3. A tela inicial de autenticação será exibida, solicitando que você entre ou crie uma conta.

#### Passo 2: Criar uma Conta (Primeiro Acesso)

Como o histórico do seu navegador está vazio, primeiro e necessário fazer um cadastro para simular o banco de dados.

1. Na janela central, clique na aba "Criar Conta".
2. Preencha os três campos: digite o seu nome, um e-mail fictício e crie uma senha qualquer.
3. Clique no botão "Criar Minha Conta".
4. O sistema vai validar o acesso, a tela de cadastro vai sumir e uma mensagem de boas-vindas aparecerá no canto inferior direito. O seu nome também será atualizado no menu lateral.

#### Passo 3: Navegar pelas Telas

A plataforma funciona em uma arquitetura de página única, onde as seções mudam instantaneamente.

1. Clique nos botões do menu lateral esquerdo: Início, Receitas, Inventário, IA Chef, Comunidade e Conquistas.
2. Note que a troca de telas e imediata e não exige nenhum carregamento de página.

#### Passo 4: Testar a Roleta Diária (Na Tela Início)

1. Clique no botão "Início" no menu lateral.
2. Localize o painel da roleta e clique no botão "Girar Roleta Diária".
3. Aguarde a animação terminar para ver a simulação do bônus diário recebido.

#### Passo 5: Testar o Controle de Porções (Na Tela Receitas)

1. Clique no botão "Receitas" no menu lateral.
2. Clique na receita disponível para abrir os detalhes.
3. Localize o controle de porções (onde há os botões de "+" e "-").
4. Clique em "+" ou "-" e observe que a quantidade de cada ingrediente e recalculada e atualizada na tela de forma automática e proporcional.

#### Passo 6: Testar a Validação de Login (Histórico do Navegador)

Para garantir que o sistema salvou os seus dados de acesso:

1. Copie o endereço completo que aparece na barra de URL do seu navegador (o link que começa com "file:///...").
2. Abra uma Nova Janela Anônima no seu navegador.
3. Cole o endereço copiado e dê Enter. A tela de login aparecerá novamente.
4. Mantenha na aba "Entrar" e digite exatamente o mesmo e-mail e a mesma senha que você criou no Passo 2.
5. Clique em "Entrar na Cozinha". O sistema buscará as informações gravadas na sessão e liberará o seu acesso com o seu perfil salvo.
