<?php

require_once 'controller.php';
require_once 'middleware.php';

class Router {
    public function rotear() {
        header('Content-Type: application/json; charset=utf-8');

        // Verifica o método da requisição (Se é GET ou POST)
        $metodo = $_SERVER['REQUEST_METHOD'];

        if ($metodo === 'POST') {
            // Tenta ler dados enviados via JSON caso $_POST esteja vazio
            $dados = $_POST;
            if (empty($dados)) {
                $jsonInput = file_get_contents('php://input');
                $dados = json_decode($jsonInput, true) ?? [];
            }

            // Se for POST (o utilizador clicou no botão do formulário)
            $acao = isset($_GET['acao']) ? $_GET['acao'] : '';
            $mensagem = ""; // Variável para guardar a resposta

            // O Middleware verifica os dados primeiro!
            Middleware::verificarDadosPost($dados, $acao);

            // O Router encaminha para o Controller certo
            if ($acao === 'registar_utilizador') {
                $controller = new UsuarioController();
                $mensagem = $controller->registarUtilizador($dados);
            } 
            elseif ($acao === 'adicionar_ingrediente') {
                $controller = new InventarioController();
                $mensagem = $controller->adicionarIngrediente($dados);
            } 
            else {
                $mensagem = "Ação desconhecida.";
            }

            echo json_encode(['mensagem' => $mensagem]);
        } else {
            echo json_encode([
                'status' => 'online',
                'info' => 'API do Cozinhe.me pronta para receber requisições POST.'
            ]);
        }
    }
}
?>