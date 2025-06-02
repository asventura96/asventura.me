<?php
header('Content-Type: application/json');
require_once '../includes/db.php';

try {
  $stmt = $pdo->query('SELECT * FROM experiencias ORDER BY inicio DESC');
  $experiencias = $stmt->fetchAll(PDO::FETCH_ASSOC);
  echo json_encode(['experiencias' => $experiencias]);
} catch (Exception $e) {
  echo json_encode(['erro' => 'Erro ao buscar dados.']);
}
