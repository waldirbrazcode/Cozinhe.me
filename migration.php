<?php

class Migration {
    private $pdo;

    public function __construct() {
        // Conexão com o banco SQLite
        try {
            $this->pdo = new PDO('sqlite:database.sqlite');
            $this->pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $this->pdo->exec('PRAGMA foreign_keys = ON;'); // Garante a integridade relacional
        } catch (PDOException $e) {
            die("Erro ao conectar com o banco de dados: " . $e->getMessage());
        }
    }

    public function up() {
        try {
            echo "🔥 Iniciando a criação das tabelas do cozinhe.me...\n\n";

            // 1. USUÁRIOS (Reflete o state: xp, streak, level, etc.)
            $this->pdo->exec("
                CREATE TABLE IF NOT EXISTS usuarios (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    nome TEXT NOT NULL,
                    email TEXT UNIQUE NOT NULL,
                    senha TEXT NOT NULL, -- ADICIONAMOS A SENHA AQUI!
                    avatar TEXT DEFAULT '🧑',
                    xp INTEGER DEFAULT 0,
                    nivel INTEGER DEFAULT 1,
                    sequencia_dias INTEGER DEFAULT 0,
                    is_premium INTEGER DEFAULT 0
                )
            ");
            echo "✅ Tabela 'usuarios' criada.\n";

            // 2. RECEITAS (Reflete state.recipes: nome, emoji, diff, cat, ings, steps)
            $this->pdo->exec("
                CREATE TABLE IF NOT EXISTS receitas (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    autor_id INTEGER,
                    nome TEXT NOT NULL,
                    emoji TEXT DEFAULT '🍽️',
                    tempo_preparo_minutos INTEGER DEFAULT 30,
                    dificuldade TEXT DEFAULT 'Fácil', -- Fácil, Médio, Difícil
                    categoria TEXT DEFAULT 'Almoço',
                    ingredientes TEXT NOT NULL, -- Serão salvos como JSON stringificado
                    passos TEXT NOT NULL,       -- Serão salvos como JSON stringificado
                    notas TEXT,
                    porcoes INTEGER DEFAULT 1,
                    is_creator INTEGER DEFAULT 0, -- Se foi feita por um Chef VIP
                    FOREIGN KEY (autor_id) REFERENCES usuarios(id) ON DELETE SET NULL
                )
            ");
            echo "✅ Tabela 'receitas' criada.\n";

            // 3. INVENTÁRIO (Reflete state.inventory: name, emoji, qty, expiry)
            $this->pdo->exec("
                CREATE TABLE IF NOT EXISTS inventario (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    usuario_id INTEGER NOT NULL,
                    nome_ingrediente TEXT NOT NULL,
                    quantidade TEXT NOT NULL,
                    emoji TEXT DEFAULT '📦',
                    data_vencimento TEXT, -- Formato YYYY-MM-DD
                    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
                )
            ");
            echo "✅ Tabela 'inventario' criada.\n";

            // 4. POSTS DA COMUNIDADE (Reflete state.posts)
            $this->pdo->exec("
                CREATE TABLE IF NOT EXISTS posts_comunidade (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    usuario_id INTEGER NOT NULL,
                    receita_nome TEXT,
                    texto TEXT NOT NULL,
                    likes INTEGER DEFAULT 0,
                    estrelas INTEGER DEFAULT 5,
                    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
                )
            ");
            echo "✅ Tabela 'posts_comunidade' criada.\n";

            // =======================================================
            // ÁREA DE GAMIFICAÇÃO (Missões, Técnicas e Conquistas)
            // =======================================================

            // 5. MISSÕES (Reflete state.missions)
            $this->pdo->exec("
                CREATE TABLE IF NOT EXISTS missoes (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    icone TEXT,
                    nome TEXT NOT NULL,
                    descricao TEXT NOT NULL,
                    xp_recompensa INTEGER NOT NULL
                )
            ");
            echo "✅ Tabela 'missoes' criada.\n";

            // 6. TÉCNICAS (Reflete state.techniques - Brunoise, Sous Vide, etc.)
            $this->pdo->exec("
                CREATE TABLE IF NOT EXISTS tecnicas (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    nome TEXT NOT NULL,
                    icone TEXT,
                    nivel_maximo INTEGER DEFAULT 10
                )
            ");
            echo "✅ Tabela 'tecnicas' criada.\n";

            // 7. CONQUISTAS (Reflete state.achievements)
            $this->pdo->exec("
                CREATE TABLE IF NOT EXISTS conquistas (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    icone TEXT,
                    rotulo TEXT NOT NULL,
                    cor TEXT DEFAULT 'gold'
                )
            ");
            echo "✅ Tabela 'conquistas' criada.\n";

            // =======================================================
            // TABELAS DE RELACIONAMENTO (O progresso de cada usuário)
            // =======================================================

            // Relacionamento: Quais missões o usuário já concluiu (m.done = true)
            $this->pdo->exec("
                CREATE TABLE IF NOT EXISTS usuario_missoes_concluidas (
                    usuario_id INTEGER,
                    missao_id INTEGER,
                    PRIMARY KEY (usuario_id, missao_id),
                    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
                    FOREIGN KEY (missao_id) REFERENCES missoes(id) ON DELETE CASCADE
                )
            ");
            echo "✅ Tabela 'usuario_missoes_concluidas' criada.\n";

            // Relacionamento: Progresso das técnicas do usuário
            $this->pdo->exec("
                CREATE TABLE IF NOT EXISTS usuario_tecnicas (
                    usuario_id INTEGER,
                    tecnica_id INTEGER,
                    nivel INTEGER DEFAULT 0,
                    xp_acumulado INTEGER DEFAULT 0,
                    status TEXT DEFAULT 'locked', -- locked, learning, mastered
                    PRIMARY KEY (usuario_id, tecnica_id),
                    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
                    FOREIGN KEY (tecnica_id) REFERENCES tecnicas(id) ON DELETE CASCADE
                )
            ");
            echo "✅ Tabela 'usuario_tecnicas' criada.\n";

            // Relacionamento: Conquistas desbloqueadas (unlocked = true)
            $this->pdo->exec("
                CREATE TABLE IF NOT EXISTS usuario_conquistas (
                    usuario_id INTEGER,
                    conquista_id INTEGER,
                    PRIMARY KEY (usuario_id, conquista_id),
                    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
                    FOREIGN KEY (conquista_id) REFERENCES conquistas(id) ON DELETE CASCADE
                )
            ");
            echo "✅ Tabela 'usuario_conquistas' criada.\n\n";

            echo "🎉 Migração concluída com sucesso! Banco de dados pronto para o professor avaliar.\n";

        } catch (PDOException $e) {
            echo "❌ Erro Crítico ao criar as tabelas: " . $e->getMessage() . "\n";
        }
    }
}

// Inicializa a classe e roda a função UP para criar as tabelas
$migration = new Migration();
$migration->up();

?>