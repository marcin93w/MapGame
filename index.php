<!DOCTYPE html>
<html>
<head>
    <script type="text/javascript" src="OpenLayers/OpenLayers.js"></script>
    <script src="http://openstreetmap.org/openlayers/OpenStreetMap.js"></script>
    <script type="text/javascript" src="OpenLayers/lib/TileManager.js"></script>
    <script type="text/javascript" src="jquery/jquery-2.0.3.min.js"></script>
    <script type="text/javascript" src="Kinetic/kinetic-v5.0.1.min.js"></script>
    <script type="text/javascript" src="debug.js"></script>
    <script type="text/javascript" src="CrossroadSolver.js"></script>
    <script type="text/javascript" src="engine.js"></script>
    <script type="text/javascript" src="dataloader.js"></script>
    <script type="text/javascript" src="map.js"></script>
    <script type="text/javascript" src="car.js"></script>
    <script type="text/javascript">
        
        var map;
        var game;
        var kineticStage;
        var car;
        
        var windowWidth = 800;
        var windowHeight = 500;
        
        function init() {
            map = new MyMap();
            kineticStage = new Kinetic.Stage({
		        container: 'game',
		        width: windowWidth,
		        height: windowHeight
		    });
		    car = new Car(kineticStage);
            game = new Engine(map, kineticStage, car);
		            
            (new DataLoader).loadData(onLoaded);
        }
        
        function onLoaded(streetsNet) {
            game.drive(streetsNet.ways[0]);
            car.draw();
        }

        window.onkeydown = function (e) {
            var code = e.keyCode ? e.keyCode : e.which;
            if (code === 38) { //up key
                game.up(true);
            } else if (code === 39) { //right key
                game.right(true);
                car.turnRight.start(); 
            } else if (code === 40) { //down key
                game.down(true); 
            } else if (code === 37) { //left key
                game.left(true);  
                car.turnLeft.start();
            }
        };
        
        window.onkeyup = function (e) {
            var code = e.keyCode ? e.keyCode : e.which;
            if (code === 38) { //up key
                game.up(false);
            } else if (code === 39) { //right key
                game.right(false); 
                car.turnRight.stop();
            } else if (code === 40) { //down key
                game.down(false); 
            } else if (code === 37) { //left key
                game.left(false);
                car.turnLeft.stop();  
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
    <div id="map" style="width:800px; height: 500px; position: relative; z-index:-1"></div>
    <div id="game" style="width:800px; height: 500px; position: relative; z-index:1; margin-top: -500px"></div>
    <!--div id="center" style="width:10px; height:10px; margin:-305px 0 0 445px;background:#F00; position: relative; z-index:1"></div-->
</body>
</html>


