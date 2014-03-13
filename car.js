/*
 * Car object on Kinetic canvas
 * 
 */

function Car(stage) {
	this.imageUrl = 'images/car.png';
	this.stage = stage;
	this.layer = new Kinetic.Layer();
}

Car.prototype.draw = function() {
	var car = this;
	
    var imageObj = new Image();
    imageObj.src = this.imageUrl;
	imageObj.onload = function() {
		var carImg = new Kinetic.Image({
        	x: car.stage.getWidth()/2,
        	y: car.stage.getHeight()/2,
            image: imageObj,
            width: 30,
            height: 30,
            offset: {
            	x: 15,
            	y: 15
			}
 		});
       
		car.layer.add(carImg);
		car.stage.add(car.layer);
       
		var angularSpeed = 360 / 2;
		car.turnRight = new Kinetic.Animation(function(frame) {
				var angleDiff = frame.timeDiff * angularSpeed / 1000;
				carImg.rotate(angleDiff);
			}, car.layer);
		car.turnLeft = new Kinetic.Animation(function(frame) {
				var angleDiff = frame.timeDiff * angularSpeed / 1000;
				carImg.rotate(-angleDiff);
			}, car.layer);
   };
};

Car.prototype.startTurningRight = function() {
	this.turnRight.start();
};

Car.prototype.stopTurningRight = function() {
	this.turnRight.stop();
};

Car.prototype.startTurningLeft = function() {
	this.turnLeft.start();
};

Car.prototype.stopTurningLeft = function() {
	this.turnLeft.stop();
};
