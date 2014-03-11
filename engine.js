/* 
 * Game engine
 */

function Game(map) {
    
    var currentWay;
    var backward;
    var currentPointId;
    
    var up = false;
    var down = false;
    var left = false;
    var right = false;
    
    //returns turn angle based on pressed keys
    function getTurnAngle() {
        if(up) {
            if(right) {
                return 45;
            }
            if(left) {
                return 315;
            }
        }
        
        if(down) {
            if(right) {
                return 135;
            }
            if(left) {
                return 225;
            }
            
            return 180;
        }
        
        if(right) {
            return 90;
        }
        if(left) {
            return 270;
        }
            
        return 0;
    }
    
    function continueDrive() {
        var step = backward ? -1 : 1;
        if(!((backward && currentPointId === 0) || (!backward && currentPointId === currentWay.points.length-1))) {
            map.moveSmoothly(currentWay.points[currentPointId += step], continueDrive);
        } else {
            //node is a crossroad
            var crossroad = new CrossroadSolver(currentWay.points[currentPointId], currentWay.points[currentPointId - step]);
            
            //sterowanie
            var turnAngle = getTurnAngle();
            crossroad.turn(turnAngle);
            if(turnAngle <= 90 || turnAngle >= 270)
                crossroad.canTurnAround = false;
            
            //dodanie mozliwych drog
            var backwardWays = backward ? currentWay.neighbors.prevBackward : currentWay.neighbors.nextBackward;
            var forwardWays = backward ? currentWay.neighbors.prevForward : currentWay.neighbors.nextForward;
            
            for(var i=0; i<backwardWays.length; i++) {
                if(!backwardWays[i].oneway)
                    crossroad.addArm(new CrossroadArm(backwardWays[i], true, false));
            }
            for(var i=0; i<forwardWays.length; i++) {
                crossroad.addArm(new CrossroadArm(forwardWays[i], false, false));
            }
            if(!currentWay.oneway)
                crossroad.addArm(new CrossroadArm(currentWay, !backward, true));
            
            var chosenArm = crossroad.getClosestArm();
            
            currentWay = chosenArm.street;
            backward = chosenArm.backward;
            currentPointId = backward ? currentWay.points.length - 1 : 0;
            continueDrive();
            
        }
    }
    
    return new function() {
        this.up = function(state) {
            up = state;
        };
        this.down = function(state) {
            down = state;
        };
        this.left = function(state) {
            left = state;
        };
        this.right = function(state) {
            right = state;
        };

        this.drive = function(startWay) {
            currentWay = startWay;
            currentPointId = 0;
            backward = false;
            map.moveTo(currentWay.points[currentPointId]);
            map.moveSmoothly(currentWay.points[++currentPointId], continueDrive);
        };
    };
}