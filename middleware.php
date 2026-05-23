<?php

class Middleware {
    public static function verificarDadosPost($dados, $acao) {
        // Se a ação for registar um utilizador
        if ($acao === 'registar_utilizador') {
            if (empty(trim($dados['nome'])) || empty(trim($dados['email'])) || empty(trim($dados['senha']))) {
                die("❌ Erro de Segurança: Todos os campos do registo são obrigatórios. Volta atrás e preenche tudo!");
            }
        }
        
        // Se a ação for adicionar ingrediente
        if ($acao === 'adicionar_ingrediente') {
            if (empty(trim($dados['nome_ingrediente'])) || empty(trim($dados['quantidade']))) {
                die("❌ Erro de Segurança: O nome e a quantidade do ingrediente são obrigatórios!");
            }
            // Validação extra: Verifica se a quantidade tem pelo menos um número (ex: "3 unidades")
            if (!preg_match('/[0-9]/', $dados['quantidade'])) {
                die("❌ Erro de Segurança: A quantidade tem de conter pelo menos um número!");
            }
        }
        
        // Se passar nas verificações, deixa seguir em frente
        return true;
    }
}
?>