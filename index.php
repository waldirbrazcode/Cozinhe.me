<?php
// Força o PHP a mostrar qualquer erro na tela
ini_set('display_errors', 1);
error_reporting(E_ALL);

// index.php: O Front Controller

// Carrega o Router
require_once 'router.php';

// Instancia e executa
$router = new Router();
$router->rotear();

?>