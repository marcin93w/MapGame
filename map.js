/* 
 * Map display module
 */

OpenLayers.LonLat.prototype.distance = function(other) {
    return Math.sqrt((other.lon - this.lon)*(other.lon - this.lon) + 
            (other.lat - this.lat)*(other.lat - this.lat));
};

var MyMap = (function () {
    
    var mapDiv = 'map';
    var zoom = 17;
    
    var moveStep = 0.000008;
    var moveTimeout = 5;
    
    var map;
    
    return function(startLonLat) {
        map = new OpenLayers.Map(mapDiv , { 
            controls:[],
            tileManager: new OpenLayers.TileManager({
                moveDelay: 0
            }),
            //projection: new OpenLayers.Projection("EPSG:900913"),
            //projection: new OpenLayers.Projection("EPSG:4326")
        });
        

        var wms = new OpenLayers.Layer.OSM.Mapnik("Mapnik");
        map.addLayers([wms]);

        this.position = startLonLat;

        if(startLonLat !== undefined) {
            this.moveTo(startLonLat);
        }
        
        var epsg4326 = new OpenLayers.Projection("EPSG:4326");
        var epsg900913 = new OpenLayers.Projection("EPSG:900913");
        
        function simpleMove(lonLat) {
            var transformedLonLat = lonLat.clone().transform(epsg4326, epsg900913);
            map.setCenter (transformedLonLat, zoom);
        };
        
        this.moveTo = function(lonLat) {
            simpleMove(lonLat);
            this.position = lonLat;
        };
        
        
        this.moveSmoothly = function(lonLat, finishedCallback) {
            var nodes = new Array();
            var steps = lonLat.distance(this.position)/moveStep;
            
            for(var i=0; i<steps; i++) {
                nodes.push(new OpenLayers.LonLat(
                    this.position.lon + ((lonLat.lon - this.position.lon)/steps*(i+1)), 
                    this.position.lat + ((lonLat.lat - this.position.lat)/steps*(i+1))
                ));
            }
            
            recursiveMove(nodes, 0, finishedCallback, lonLat, this);
        };
        
        function recursiveMove (nodes, index, finishedCallback, lonLat, sender) {
            if(index < nodes.length) {
                simpleMove(nodes[index]);
                setTimeout (
                    function() { recursiveMove(nodes, index + 1, finishedCallback, lonLat, sender); }, 
                    moveTimeout
                );
            } else {
                sender.position = lonLat;
                finishedCallback();
            }
        };
    };
    
}());

