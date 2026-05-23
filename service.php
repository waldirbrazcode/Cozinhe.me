<?php

// Requeremos o ficheiro do Model para que o Service saiba que as classes existem
// (Isto será orquestrado melhor no Controller, mas é boa prática)
require_once 'model.php';

/* =========================================================================
   1. SERVIÇO DE INVENTÁRIO (Regras dos Ingredientes)
========================================================================= */
class InventarioService {
    
    // Método que recebe os dados em bruto e aplica as regras do Cozinhe.me
    public function validarNovoIngrediente($dados) {
        
        // Regra de Negócio 1: O ingrediente não pode estar com a validade expirada
        $hoje = date('Y-m-d'); // Pega a data de hoje
        if (!empty($dados['data_vencimento']) && $dados['data_vencimento'] < $hoje) {
            throw new Exception("O ingrediente já está fora do prazo de validade! Não o podes adicionar.");
        }

        // Regra de Negócio 2: A quantidade não pode estar vazia
        if (empty(trim($dados['quantidade']))) {
            throw new Exception("Precisas de informar a quantidade do ingrediente.");
        }

        // Se passar em todos os testes, devolvemos os dados validados
        return $dados;
    }
}

/* =========================================================================
   2. SERVIÇO DE UTILIZADORES (Regras de Registo e Segurança)
========================================================================= */
class UsuarioService {

    public function processarRegisto($dados) {
        
        // Regra de Negócio 1: O e-mail tem de ter um formato válido (ex: @gmail.com)
        if (!filter_var($dados['email'], FILTER_VALIDATE_EMAIL)) {
            throw new Exception("O formato do e-mail é inválido.");
        }

        // Regra de Negócio 2: A palavra-passe (senha) não pode ser muito fraca
        if (strlen($dados['senha']) < 6) {
            throw new Exception("A palavra-passe tem de ter pelo menos 6 caracteres por segurança.");
        }

        // Regra de Negócio 3 (A mais importante): NUNCA guardar a senha em texto limpo!
        // Transformamos a senha num código ilegível (Hash)
        $dados['senha'] = password_hash($dados['senha'], PASSWORD_DEFAULT);

        // Se não houver avatar escolhido, define o padrão do seu JS
        if (empty($dados['avatar'])) {
            $dados['avatar'] = '🧑';
        }

        return $dados;
    }
}

/* =========================================================================
   3. SERVIÇO DE RECEITAS (Regras de Criação de Receitas)
========================================================================= */
class ReceitaService {

    public function validarNovaReceita($dados) {
        
        // Regra de Negócio 1: Uma receita tem de ter um título
        if (empty(trim($dados['nome']))) {
            throw new Exception("A receita precisa de um título apetitoso!");
        }

        // Regra de Negócio 2: O tempo de preparo tem de ser realista (maior que zero)
        if (isset($dados['tempo_preparo_minutos']) && $dados['tempo_preparo_minutos'] <= 0) {
            throw new Exception("O tempo de preparo tem de ser maior que 0 minutos.");
        }

        // Regra de Negócio 3: Tem de ter ingredientes! (Garante que o array não está vazio)
        if (empty($dados['ingredientes']) || count($dados['ingredientes']) === 0) {
            throw new Exception("Uma receita não se faz do ar. Adiciona ingredientes!");
        }

        return $dados;
    }
}

?>