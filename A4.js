function Ball(x, y, radius, e, mass, colour){
	this.position = {x: x, y: y}; //m
	this.velocity = {x: 0, y: 0}; // m/s
	this.e = -e; // has no units
	this.mass = mass; //kg
	this.radius = radius; //m
	this.colour = colour; 
	this.area = (Math.PI * radius * radius) / 10000; //m^2
}
var canvas = null;
var ctx = null;
var fps = 1/60; //60 FPS
var dt = fps * 1000; //ms 
var timer = false;
var Cd = 0.47;
var rho = 1.22; //kg/m^3 
var mouse = {x: 0, y:0, isDown: false};
var ag = 9.81; //m/s^2 acceleration due to gravity on earth = 9.81 m/s^2. 
var width = 0;
var height = 0;
var balls = [];

var setup = function(){
	canvas = document.getElementById('canvas');
	ctx = canvas.getContext('2d');
	width = canvas.width;
	height = canvas.height;

	canvas.onmousedown = mouseDown;
	canvas.onmouseup = mouseUp;
	canvas.onmousemove = getMousePosition;
	timer = setInterval(loop, dt);
}

var mouseDown = function(e){
	if(e.which == 1){
		getMousePosition(e);
		mouse.isDown = true;
		var max = 255;
		var min = 20;
		var r = 75 + Math.floor(Math.random() * (max - min) - min);
		var g = 75 + Math.floor(Math.random() * (max - min) - min);
		var b = 75 + Math.floor(Math.random() * (max - min) - min);
		balls.push(new Ball(mouse.x, mouse.y, 10, 0.7,10, "rgb(" + r + "," + g + "," + b + ")"));
	}
}

var mouseUp = function(e){
	if(e.which == 1){
		mouse.isDown = false;
		balls[balls.length - 1].velocity.x = (balls[balls.length - 1].position.x - mouse.x) / 10;
		balls[balls.length - 1].velocity.y = (balls[balls.length - 1].position.y - mouse.y) / 10;
	}
}

function getMousePosition(e){
	mouse.x = e.pageX - canvas.offsetLeft;
	mouse.y = e.pageY - canvas.offsetTop;
}

function loop(){

	//Clear window at the begining of every frame
	ctx.clearRect(0, 0, width, height);
	for(var i = 0; i < balls.length; i++){
		if(!mouse.isDown || i != balls.length - 1){
			//physics - calculating the aerodynamic forces to drag
			// -0.5 * Cd * A * v^2 * rho
			var fx = -0.5 * balls[i].area * balls[i].velocity.x * balls[i].velocity.x * (balls[i].velocity.x / Math.abs(balls[i].velocity.x));
			var fy = -0.5 * balls[i].area * balls[i].velocity.y * balls[i].velocity.y * (balls[i].velocity.y / Math.abs(balls[i].velocity.y));

			fx = (isNaN(fx)? 0 : fx);
			fy = (isNaN(fy)? 0 : fy);
			//Calculating the accleration of the ball
			//F = ma or a = F/m
			var ax = fx / balls[i].mass;
			var ay = (ag * 3) + (fy / balls[i].mass);

			//Calculating the ball velocity 
			balls[i].velocity.x += ax * fps;
			balls[i].velocity.y += ay * fps;

			//Calculating the position of the ball
			balls[i].position.x += balls[i].velocity.x * fps * 100;
			balls[i].position.y += balls[i].velocity.y * fps * 100;
		}
		
		//Rendering the ball
		ctx.beginPath();
		ctx.fillStyle = balls[i].colour;
		ctx.arc(balls[i].position.x, balls[i].position.y, balls[i].radius, 0, 2 * Math.PI, true);
		ctx.fill();
		ctx.closePath();

		if(mouse.isDown){
			ctx.beginPath();
			ctx.strokeStyle = "rgb(0,255,0)";
			ctx.moveTo(balls[balls.length - 1].position.x, balls[balls.length - 1].position.y);
			ctx.lineTo(mouse.x, mouse.y);
			ctx.stroke();
			ctx.closePath();
		}
		//Handling the ball collisions
		collisionWall(balls[i]);	
	}

}
	
function collisionWall(ball){
	if(ball.position.y > height - ball.radius){
		ball.velocity.y *= ball.e;
		ball.position.y = height - ball.radius;
	}
}