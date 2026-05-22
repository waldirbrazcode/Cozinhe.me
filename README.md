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
