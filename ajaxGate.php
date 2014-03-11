<?php

    require_once 'routes.php';
    
    $routes = new Routes();
    
    if(isset($_GET['getWays'])) {
        echo json_encode($routes->getWays());
    }

?>