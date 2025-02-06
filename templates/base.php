<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo $pageTitle; ?></title>
    <?php include 'templates/css_includes.php'; ?>
</head>
<body>
    <header class="main-header">
        <div class="header-content">
            <img src="assets/images/andre-foto.jpg" alt="André da Silva Ventura" class="profile-photo">
            <h1>ANDRÉ DA SILVA VENTURA</h1>
        </div>
    </header>

    <nav>
        <!-- Menu de navegação -->
    </nav>

    <div id="content">
        <!-- O conteúdo será inserido aqui -->
        <p>teste
        <?php echo $content; ?>
    </div>

    <footer>
        <p>&copy; 2025 Meu Portfólio</p>
    </footer>

    <?php include 'templates/js_includes.php'; ?>
</body>
</html>
