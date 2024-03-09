import { Character } from './Character.js';
import { Guard } from './Guard.js';
import * as THREE from 'three';
import { TileNode } from './TileNode.js';
export class State {
	

	// Creating an abstract class in JS
	// Ensuring enterState and updateState are implemented
	constructor() {
	
	    if(this.constructor == State) {
	       throw new Error("Class is of abstract type and cannot be instantiated");
	    };

	    if(this.enterState == undefined) {
	        throw new Error("enterState method must be implemented");
	    };

	     if(this.updateState == undefined) {
	        throw new Error("updateState method must be implemented");
	    };
	
	}
  
}


export class PatrolState extends State {

	enterState(guard, gameMap) {
		guard.topSpeed = 10;
		console.log("Guarding!");
	}

	updateState(guard, gameMap) {
		//console.log(gameMap.quantize(guard.location));
		if(gameMap.quantize(guard.location)==undefined){
			console.log(guard.location);
		}
		if(gameMap.quantize(guard.location).type == TileNode.Type.Ground || gameMap.quantize(guard.location).type == TileNode.Type.RB || gameMap.quantize(guard.location).type == TileNode.Type.TB|| gameMap.quantize(guard.location).type == TileNode.Type.Charger){
			guard.applyForce(guard.wander());
		}
		else{
			guard.picked={id:gameMap.quantize(guard.location).id, x:gameMap.quantize(guard.location).x, y:gameMap.quantize(guard.location).y, z:gameMap.quantize(guard.location).z, type:gameMap.quantize(guard.location).type};
			gameMap.setTileType(gameMap.quantize(guard.location), TileNode.Type.Ground);
			
			gameMap.graph.garbage = gameMap.graph.garbage.filter((word) => word[0]!=guard.picked.x || word[1]!=guard.picked.z);
			gameMap.graph.recyclable = gameMap.graph.recyclable.filter((word) => word[0]!=guard.picked.x || word[1]!=guard.picked.z);


			if(guard.picked.x!=gameMap.quantize(guard.location).x || guard.picked.z!=gameMap.quantize(guard.location).z){
				"something wrong here";
			}

			if(gameMap.graph.garbage.length==25 && gameMap.graph.recyclable.length==25){
				"something wrong";
			}
			//console.log(gameMap.graph.recyclable, gameMap.graph.garbage);
			gameMap.createMess();
			//console.log(gameMap.graph.recyclable, gameMap.graph.garbage);
			guard.switchState(gameMap, new ChaseState());
		}
		//console.log(gameMap.localize({x:gameMap.graph.bins.garbage[0],z:gameMap.graph.bins.garbage[1]}));
	}

}



export class ChaseState extends State {
	
	enterState(guard, gameMap) {
		guard.topSpeed = 30;
		console.log(guard.picked,"Chasing!!!!")

	}

	updateState(guard, gameMap) {
		if(guard.picked.type==TileNode.Type.Garbage){
			//guard.applyForce(guard.seek(gameMap.localize({x:gameMap.graph.bins.garbage[0],z:gameMap.graph.bins.garbage[1]})));
			guard.applyForce(guard.arrive(gameMap.localize({x:gameMap.graph.bins.garbage[0],z:gameMap.graph.bins.garbage[1]}), gameMap.tileSize*10));
			if(gameMap.quantize(guard.location).type == TileNode.Type.TB){
				//guard.picked = null;
				guard.drop();
				if(guard.charge==0){
					guard.switchState(gameMap, new RestState());
				}
				else if(guard.charge>0){
					guard.switchState(gameMap, new PatrolState());
				}
			}
		}
		else if(guard.picked.type==TileNode.Type.Recyclable){
			//guard.applyForce(guard.seek(gameMap.localize({x:gameMap.graph.bins.recyclable[0],z:gameMap.graph.bins.recyclable[1]})));
			guard.applyForce(guard.arrive(gameMap.localize({x:gameMap.graph.bins.recyclable[0],z:gameMap.graph.bins.recyclable[1]}), gameMap.tileSize*10));
			if(gameMap.quantize(guard.location).type == TileNode.Type.RB){
				//guard.picked = null;
				guard.drop();
				console.log(guard.charge);
				if(guard.charge==0){
					guard.switchState(gameMap, new RestState());
				}
				else if(guard.charge>0){
					guard.switchState(gameMap, new PatrolState());
				}
			}
		}
		
	}

  
}

export class RestState extends State {
	
	enterState(guard, gameMap) {
		guard.topSpeed = 10;
		console.log("Need a break.");
	}

	updateState(guard, gameMap) {
		//guard.applyForce(guard.seek(gameMap.localize({x:gameMap.graph.charger[0],z:gameMap.graph.charger[1]})));
		guard.applyForce(guard.arrive(gameMap.localize({x:gameMap.graph.charger[0],z:gameMap.graph.charger[1]}), gameMap.tileSize*4));
		if(gameMap.quantize(guard.location).type == TileNode.Type.Charger){
			guard.charge=3;
			//guard.topSpeed=0;
			setTimeout(() => {
				guard.switchState(gameMap, new PatrolState());
			}, 3000);
		}
		
	}
  
}