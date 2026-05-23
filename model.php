<?php

/* =========================================================================
   1. MODELO DO INVENTÁRIO
========================================================================= */
class InventarioModel {
    private $usuarioId;
    private $nomeIngrediente;
    private $quantidade;
    private $dataVencimento;

    public function setUsuarioId($id) { $this->usuarioId = $id; }
    public function setNomeIngrediente($nome) { $this->nomeIngrediente = $nome; }
    public function setQuantidade($quantidade) { $this->quantidade = $quantidade; }
    public function setDataVencimento($data) { $this->dataVencimento = $data; }

    public function save() {
        try {
            $pdo = new PDO('sqlite:database.sqlite');
            $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

            $sql = "INSERT INTO inventario (usuario_id, nome_ingrediente, quantidade, data_vencimento) 
                    VALUES (:usuario_id, :nome_ingrediente, :quantidade, :data_vencimento)";
            
            $stmt = $pdo->prepare($sql);
            $stmt->bindValue(':usuario_id', $this->usuarioId);
            $stmt->bindValue(':nome_ingrediente', $this->nomeIngrediente);
            $stmt->bindValue(':quantidade', $this->quantidade);
            $stmt->bindValue(':data_vencimento', $this->dataVencimento);
            
            $stmt->execute();
            return true;
        } catch (PDOException $e) {
            throw new Exception("Erro ao salvar no inventário: " . $e->getMessage());
        }
    }
}

/* =========================================================================
   2. MODELO DE USUÁRIOS (Atualizado com suporte a Senha!)
========================================================================= */
class UsuarioModel {
    private $nome;
    private $email;
    private $senha; // Nova propriedade privada para a senha
    private $avatar;

    // Métodos Setters
    public function setNome($nome) { $this->nome = $nome; }
    public function setEmail($email) { $this->email = $email; }
    public function setSenha($senha) { $this->senha = $senha; } // Setter da Senha
    public function setAvatar($avatar) { $this->avatar = $avatar; }

    // Métodos Getters
    public function getNome() { return $this->nome; }
    public function getEmail() { return $this->email; }
    public function getSenha() { return $this->senha; }
    public function getAvatar() { return $this->avatar; }

    public function save() {
        try {
            $pdo = new PDO('sqlite:database.sqlite');
            $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

            // SQL atualizado incluindo a coluna 'senha'
            $sql = "INSERT INTO usuarios (nome, email, senha, avatar) 
                    VALUES (:nome, :email, :senha, :avatar)";
            
            $stmt = $pdo->prepare($sql);
            $stmt->bindValue(':nome', $this->nome);
            $stmt->bindValue(':email', $this->email);
            $stmt->bindValue(':senha', $this->senha); // Vincula a senha (que será criptografada no Service)
            $stmt->bindValue(':avatar', $this->avatar);
            
            $stmt->execute();
            return true;
        } catch (PDOException $e) {
            throw new Exception("Erro ao salvar usuário: " . $e->getMessage());
        }
    }
}

/* =========================================================================
   3. MODELO DE RECEITAS
========================================================================= */
class ReceitaModel {
    private $autorId;
    private $nome;
    private $dificuldade;
    private $categoria;
    private $ingredientes; 
    private $passos;       

    public function setAutorId($id) { $this->autorId = $id; }
    public function setNome($nome) { $this->nome = $nome; }
    public function setDificuldade($dif) { $this->dificuldade = $dif; }
    public function setCategoria($cat) { $this->categoria = $cat; }
    public function setIngredientes($ing) { $this->ingredientes = $ing; }
    public function setPassos($passos) { $this->passos = $passos; }

    public function save() {
        try {
            $pdo = new PDO('sqlite:database.sqlite');
            $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

            $sql = "INSERT INTO receitas (autor_id, nome, dificuldade, categoria, ingredientes, passos) 
                    VALUES (:autor_id, :nome, :dificuldade, :categoria, :ingredientes, :passos)";
            
            $stmt = $pdo->prepare($sql);
            $stmt->bindValue(':autor_id', $this->autorId);
            $stmt->bindValue(':nome', $this->nome);
            $stmt->bindValue(':dificuldade', $this->dificuldade);
            $stmt->bindValue(':categoria', $this->categoria);
            
            $stmt->bindValue(':ingredientes', json_encode($this->ingredientes, JSON_UNESCAPED_UNICODE));
            $stmt->bindValue(':passos', json_encode($this->passos, JSON_UNESCAPED_UNICODE));
            
            $stmt->execute();
            return true;
        } catch (PDOException $e) {
            throw new Exception("Erro ao salvar receita: " . $e->getMessage());
        }
    }
}

/* =========================================================================
   4. MODELO DE POSTS DA COMUNIDADE
========================================================================= */
class PostComunidadeModel {
    private $usuarioId;
    private $receitaNome;
    private $texto;
    private $estrelas;

    public function setUsuarioId($id) { $this->usuarioId = $id; }
    public function setReceitaNome($nome) { $this->receitaNome = $nome; }
    public function setTexto($texto) { $this->texto = $texto; }
    public function setEstrelas($estrelas) { $this->estrelas = $estrelas; }

    public function save() {
        try {
            $pdo = new PDO('sqlite:database.sqlite');
            $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

            $sql = "INSERT INTO posts_comunidade (usuario_id, receita_nome, texto, estrelas) 
                    VALUES (:usuario_id, :receita_nome, :texto, :estrelas)";
            
            $stmt = $pdo->prepare($sql);
            $stmt->bindValue(':usuario_id', $this->usuarioId);
            $stmt->bindValue(':receita_nome', $this->receitaNome);
            $stmt->bindValue(':texto', $this->texto);
            $stmt->bindValue(':estrelas', $this->estrelas);
            
            $stmt->execute();
            return true;
        } catch (PDOException $e) {
            throw new Exception("Erro ao publicar na comunidade: " . $e->getMessage());
        }
    }
}

?>