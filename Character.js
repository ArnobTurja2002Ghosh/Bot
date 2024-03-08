import * as THREE from 'three';

export class Character {

	// Character Constructor
	constructor(mColor) {
		this.size = 3

		// Create our cone geometry and material
		let coneGeo = new THREE.ConeGeometry(this.size/2, this.size, 10);
		let coneMat = new THREE.MeshStandardMaterial({color: mColor});
		
		// Create the local cone mesh (of type Object3D)
		let mesh = new THREE.Mesh(coneGeo, coneMat);
		// Increment the y position so our cone is just atop the y origin
		mesh.position.y = mesh.position.y+1;
		// Rotate our X value of the mesh so it is facing the +z axis
		mesh.rotateX(Math.PI/2);

		// Add our mesh to a Group to serve as the game object
		this.gameObject = new THREE.Group();
		this.gameObject.add(mesh);

		// Initialize movement variables
		this.location = new THREE.Vector3(0,0,0);
		this.velocity = new THREE.Vector3(0,0,0);
		this.acceleration = new THREE.Vector3(0, 0, 0);

		this.topSpeed = 15;
		this.mass = 1;
		this.maxForce = 15;

		this.wanderAngle = null;
	}

	// update character
	update(deltaTime) {
		// update velocity via acceleration
		this.velocity.addScaledVector(this.acceleration, deltaTime);
		//console.log(this.velocity);
		if (this.velocity.length() > this.topSpeed) {
			this.velocity.setLength(this.topSpeed);
		}

		// update location via velocity
		this.location.addScaledVector(this.velocity, deltaTime);

		// rotate the character to ensure they face 
		// the direction of movement
		let angle = Math.atan2(this.velocity.x, this.velocity.z);
		this.gameObject.rotation.y = angle;

		this.checkEdges();
		// set the game object position
		this.gameObject.position.set(this.location.x, this.location.y+0.25*this.size, this.location.z);

		this.acceleration.multiplyScalar(0);
	
	}
	// check we are within the bounds of the world
	checkEdges() {
        if (this.location.x < -50) {
            this.location.x = 50;
        } 
        if (this.location.z < -50) {
            this.location.z = 50;
        }
        if (this.location.x > 50) {
            this.location.x = -50;
        }
        if (this.location.z > 50) {
            this.location.z = -50;
        }
    }

	// Apply force to our character
	applyForce(force) {
		// here, we are saying force = force/mass
		force.divideScalar(this.mass);
		// this is acceleration + force/mass
		this.acceleration.add(force);
	}

	// Seek steering behaviour
	seek(target) {
		let desired = new THREE.Vector3();
		desired.subVectors(target, this.location);
		desired.setLength(this.topSpeed);

		let steer = new THREE.Vector3();
		steer.subVectors(desired, this.velocity);

		if (steer.length() > this.maxForce) {
			steer.setLength(this.maxForce);
		}
		return steer;
	}

	arrive(target, radius) {
		let desired = new THREE.Vector3();
		desired.subVectors(target, this.location);
	  
		// get distance of the desired vector
		// which is the distance to the target
		// length is built in
		let distance = desired.length();

		// if distance is less than radius we want
		// to slow down based on how close we are
		if (distance < radius) {
			let speed = (distance/radius) * this.topSpeed;
			desired.setLength(speed);
		} else {
			return this.seek(target);
		}
			
		// steer = desired velocity - current velocity
		let steer = new THREE.Vector3();
		steer.subVectors(desired, this.velocity);

		return steer;

	}
	// Wander steering behaviour
  	wander() {
  		let d = 10;
  		let r = 10;
  		let a = 0.3;

  		let futureLocation = this.velocity.clone();
  		futureLocation.setLength(d);
  		futureLocation.add(this.location);



  		if (this.wanderAngle == null) {
  			this.wanderAngle = Math.random() * (Math.PI*2);
  		} else {
  			let change = Math.random() * (a*2) - a;
  			this.wanderAngle = this.wanderAngle + change;
  		}

  		let target = new THREE.Vector3(r*Math.sin(this.wanderAngle), 0, r*Math.cos(this.wanderAngle));
  		target.add(futureLocation);
  		return this.seek(target);

  	}




}