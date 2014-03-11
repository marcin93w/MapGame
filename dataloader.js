/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function Way(points, oneway) {
    this.points = points;
    this.oneway = oneway;
}

function DataLoader() {
    var ways = [];
    
    function assignNeighbors(ways, prevBackward, prevForward, nextBackward, nextForward) {
        var neighbors = {
            'prevBackward': [],
            'prevForward': [],
            'nextBackward': [],
            'nextForward': []
        };
        
        if(typeof prevBackward !== 'undefined') {
            for(var i=0; i<prevBackward.length; i++) {
                neighbors['prevBackward'].push(ways[prevBackward[i]]);
            }
        }
        if(typeof prevForward !== 'undefined') {
            for(var i=0; i<prevForward.length; i++) {
                neighbors['prevForward'].push(ways[prevForward[i]]);
            }
        }
        if(typeof nextBackward !== 'undefined') {
            for(var i=0; i<nextBackward.length; i++) {
                neighbors['nextBackward'].push(ways[nextBackward[i]]);
            }
        }
        if(typeof nextForward !== 'undefined') {
            for(var i=0; i<nextForward.length; i++) {
                neighbors['nextForward'].push(ways[nextForward[i]]);
            }
        }
        
        return neighbors;
    }
    
    function parseWaysData(data) {
        //var epsg4326 = new OpenLayers.Projection("EPSG:4326");
        //var epsg900913 = new OpenLayers.Projection("EPSG:900913");
        for(var j=0; j<data.length; j++) {
            var points = [];
            var pointsArray = data[j]['geom'];
            for (var i=0; i<pointsArray.length; i++) {
                points.push(
                        new OpenLayers.LonLat(pointsArray[i][0], pointsArray[i][1])
                            //.transform(epsg4326, epsg900913)
                );
            }
            
            ways.push( new Way(
                    points, 
                    data[j]['oneway'] === 't' ? true : false
            ));
        }
        
        for(var i=0; i<ways.length; i++) {
            ways[i].neighbors = assignNeighbors(ways, 
                data[i]['prevBackward'], 
                data[i]['prevForward'], 
                data[i]['nextBackward'], 
                data[i]['nextForward']);
        }
    }
    
    this.loadData = function(onLoaded) {
        //ajax data loading
        $.ajax({
            url:"ajaxGate.php?getWays",
            type:"GET"
        }).done(function(data, status, xhr){
            if(xhr.status !== 204) //if response is not empty 
                parseWaysData(JSON.parse(data));
                onLoaded({
                    ways: ways
                });
        }).fail(function(data, status, xhr) {
            if(xhr.status === 500)
                alert('Błąd pobierania danych.');

        }).always(function(data, status, xhr) {

        });
    };
};
