<!DOCTYPE html>
<html>
<head>
    <script type="text/javascript" src="OpenLayers/OpenLayers.js"></script>
    <script src="http://openstreetmap.org/openlayers/OpenStreetMap.js"></script>
    <script type="text/javascript" src="OpenLayers/lib/TileManager.js"></script>
    <script type="text/javascript" src="jquery/jquery-2.0.3.min.js"></script>
    <script type="text/javascript" src="debug.js"></script>
    <script type="text/javascript" src="CrossroadSolver.js"></script>
    <script type="text/javascript" src="engine.js"></script>
    <script type="text/javascript" src="dataloader.js"></script>
    <script type="text/javascript" src="map.js"></script>
    <script type="text/javascript">
        
        var map;
        var game;
        
        function init() {
            map = new MyMap();
            
            (new DataLoader).loadData(onLoaded);
        }
        
        function onLoaded(streetsNet) {
            game = new Game(map);
            game.drive(streetsNet.ways[0]);
        }

        window.onkeydown = function (e) {
            var code = e.keyCode ? e.keyCode : e.which;
            if (code === 38) { //up key
                game.up(true);
            } else if (code === 39) { //right key
                game.right(true); 
            } else if (code === 40) { //down key
                game.down(true); 
            } else if (code === 37) { //left key
                game.left(true);  
            }
        };
        
        window.onkeyup = function (e) {
            var code = e.keyCode ? e.keyCode : e.which;
            if (code === 38) { //up key
                game.up(false);
            } else if (code === 39) { //right key
                game.right(false); 
            } else if (code === 40) { //down key
                game.down(false); 
            } else if (code === 37) { //left key
                game.left(false);  
            }
        };
        
    </script>
</head>
<body onload="init()">
    <div style="float:right; width: 500px">
        <h3>Debug info</h3>
        <div id="debug">
            
        </div>
    </div>
    <div id="map" style="width:900px;height: 600px; position: relative; z-index:-1"></div>
    <div id="center" style="width:10px; height:10px; margin:-305px 0 0 445px;background:#F00; position: relative; z-index:1"></div>
</body>
</html>


