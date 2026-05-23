<!DOCTYPE html>
<html lang="pt-PT">
<head>
    <meta charset="UTF-8">
    <title>Cozinhe.me - Gestão</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f7f9fc; padding: 20px; }
        .card { background: white; padding: 25px; border-radius: 12px; max-width: 400px; margin: 0 auto 30px auto; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
        h2 { margin-top: 0; color: #333; font-size: 20px; }
        label { font-weight: bold; font-size: 14px; color: #555; display: block; margin-top: 15px; }
        input { width: 100%; padding: 10px; margin-top: 5px; border: 1px solid #ddd; border-radius: 6px; box-sizing: border-box; }
        button { width: 100%; padding: 12px; margin-top: 20px; background-color: #ff6b6b; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: bold; font-size: 16px; }
        button:hover { background-color: #ff5252; }
        .mensagem { max-width: 400px; margin: 0 auto 20px auto; padding: 15px; border-radius: 8px; font-weight: bold; text-align: center; background-color: #fff3cd; color: #856404; }
    </style>
</head>
<body>

    <?php if (isset($mensagem)): ?>
        <div class="mensagem">
            <?php echo htmlspecialchars($mensagem); ?>
        </div>
    <?php endif; ?>

    <div class="card">
        <h2>🧑 Nova Conta de Chef</h2>
        <form action="/?acao=registar_utilizador" method="POST">
            <label>O teu Nome:</label>
            <input type="text" name="nome" placeholder="Ex: Gordon Ramsay" required>
            
            <label>E-mail:</label>
            <input type="email" name="email" placeholder="chef@cozinhe.me" required>
            
            <label>Palavra-passe:</label>
            <input type="password" name="senha" placeholder="Mínimo de 6 caracteres" required>
            
            <button type="submit">Registar</button>
        </form>
    </div>

    <div class="card">
        <h2>📦 Adicionar Ingrediente</h2>
        <form action="/?acao=adicionar_ingrediente" method="POST">
            <label>Nome do Ingrediente:</label>
            <input type="text" name="nome_ingrediente" placeholder="Ex: Tomate" required>
            
            <label>Quantidade:</label>
            <input type="text" name="quantidade" placeholder="Ex: 3 unidades" required>
            
            <label>Data de Validade:</label>
            <input type="date" name="data_vencimento">
            
            <button type="submit">Guardar na Despensa</button>
        </form>
    </div>

</body>
</html>