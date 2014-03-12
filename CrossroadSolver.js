/* 
 * Moduł modelujący sterowanie
 * Struktura wektorów, ze wspólnym punktem center, 
 * wektorem kierunkowym [directionNode, center], 
 * oraz wektorami 'ramieniami' [center, arms[i]] 
 */

function CrossroadSolver (crossroad, previous) {
    this.center = crossroad;
    this.directionVector = new Vector(previous, crossroad);
    this.arms = new Array();
    
    this.canTurnAround = true;
}

//TODO: zmienic konstruktor na bardziej ogoln (nie kozystajacy z street.points) i dodac prototyp w engine.js
function CrossroadArm (street, backward, isTurnAround) {
    //way whitch is represented by this arm
    this.street = street;
    this.backward = backward;
    
    this.directionNodeId = backward ? street.points.length - 2 : 1;
    this.turnAroundArm = isTurnAround;
}

CrossroadSolver.prototype.addArm = function(arm) {
    this.arms.push(arm);
};

CrossroadSolver.prototype.turn = function(degrees) {
    var rad = (degrees/180)*Math.PI;
    this.directionVector.a = 
            this.directionVector.a * Math.cos(rad) + this.directionVector.b * Math.sin(rad);
    this.directionVector.b = 
            this.directionVector.a * (-Math.sin(rad)) + this.directionVector.b * Math.cos(rad);
};

function Vector(node1, node2) {
    this.a = node2.lon - node1.lon;
    this.b = node2.lat - node1.lat;
}

Vector.prototype.angle = function(other) {
    return Math.acos(
            (this.a*other.a + this.b*other.b) / 
            (Math.sqrt(this.a*this.a+this.b*this.b)*Math.sqrt(other.a*other.a+other.b*other.b))
            );
};

CrossroadSolver.prototype.getClosestArm = function() {
    var angle = Number.MAX_VALUE;
    var arm = this.arms[0];
    
    for(var i=0; i<this.arms.length; i++) {
        if(!this.canTurnAround && this.arms[i].turnAroundArm)
            continue;
        var vector = new Vector(this.center, this.arms[i].street.points[this.arms[i].directionNodeId]);
        var calculatedAngle = vector.angle(this.directionVector);
        if(calculatedAngle < angle) {
            angle = calculatedAngle;
            arm = this.arms[i];
        }
    }
    
    return arm;
};