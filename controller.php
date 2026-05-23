<?php

require_once 'service.php';
require_once 'model.php';

/* =========================================================================
   CONTROLADOR DO INVENTÁRIO
========================================================================= */
class InventarioController {
    
    public function adicionarIngrediente($dadosPost) {
        try {
            // 1. Chama o Service para verificar as regras (ex: ver se está fora da validade)
            $service = new InventarioService();
            $dadosValidados = $service->validarNovoIngrediente($dadosPost);

            // 2. Se o Service aprovar (não der erro), instanciamos o Model para guardar no SQLite
            $model = new InventarioModel();
            
            // Vamos assumir o utilizador ID 1 por agora (até termos o sistema de sessões a 100%)
            $model->setUsuarioId(1); 
            $model->setNomeIngrediente($dadosValidados['nome_ingrediente']);
            $model->setQuantidade($dadosValidados['quantidade']);
            $model->setDataVencimento($dadosValidados['data_vencimento']);

            // 3. Guarda na base de dados
            $model->save();

            // 4. Decide a resposta para o utilizador
            return "✅ Ingrediente '{$dadosValidados['nome_ingrediente']}' adicionado com sucesso! Ganhaste +10 XP.";

        } catch (Exception $e) {
            // Se o Service ou o Model falharem, captura o erro e devolve a mensagem
            return "❌ Erro: " . $e->getMessage();
        }
    }
}

/* =========================================================================
   CONTROLADOR DE UTILIZADORES
========================================================================= */
class UsuarioController {
    
    public function registarUtilizador($dadosPost) {
        try {
            // 1. Passa pelo Service (para validar o email e encriptar a palavra-passe)
            $service = new UsuarioService();
            $dadosValidados = $service->processarRegisto($dadosPost);

            // 2. Prepara o Model com os dados limpos
            $model = new UsuarioModel();
            $model->setNome($dadosValidados['nome']);
            $model->setEmail($dadosValidados['email']);
            $model->setSenha($dadosValidados['senha']); // Já vem encriptada do Service!
            $model->setAvatar($dadosValidados['avatar']);

            // 3. Guarda na base de dados
            $model->save();

            // 4. Resposta de sucesso
            return "🎉 Conta criada com sucesso, Chef {$dadosValidados['nome']}!";

        } catch (Exception $e) {
            return "❌ Erro ao criar conta: " . $e->getMessage();
        }
    }
}

?>