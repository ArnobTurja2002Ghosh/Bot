import { TileNode } from './TileNode.js';
import * as THREE from 'three';
import { MapRenderer } from './MapRenderer';
import { Graph } from './Graph';


export class GameMap {
	
	// Constructor for our GameMap class
	constructor() {

		// Define some basics of our world
		// Let's use the previous area that we had
		// our character navigating around
		// This started at location (-25,0,-25)
		// and had width of 50 and a depth of 50
		this.start = new THREE.Vector3(-50,0,-50);

		this.width = 100;
		this.depth = 100;
		
		// We also need to define a tile size 
		// for our tile based map
		this.tileSize = 5;

		// Get our columns and rows based on
		// width, depth and tile size
		this.cols = this.width/this.tileSize;
		this.rows = this.depth/this.tileSize;

		// Create our graph
		// Which is an array of nodes
		this.graph = new Graph(this.tileSize, this.cols, this.rows);

		// Create our map renderer
		this.mapRenderer = new MapRenderer(this.start, this.tileSize, this.cols);
	}

	init(scene) {
		this.scene = scene; 
		this.graph.initGraph();
		// Set the game object to our rendering
		this.mapRenderer.createRendering(this.graph.nodes, scene);
	}

	// Method to get location from a node
	localize(node) {
		let x = this.start.x+(node.x*this.tileSize)+this.tileSize*0.5;
		let y = this.tileSize;
		let z = this.start.z+(node.z*this.tileSize)+this.tileSize*0.5;

		return new THREE.Vector3(x,y,z);
	}

	quantize(location){
		let node_x=Math.floor((location.x-this.start.x)/this.tileSize);
		let node_z=Math.floor((location.z-this.start.z)/this.tileSize);
		if(node_z>19){
			node_z=19
		}
		if(node_x>19){
			node_x=19
		}
		return this.graph.nodes[this.cols*node_z + node_x];
	}

	createMess(){
		loop1: while(this.graph.recyclable.length<25){
			let obs= [Math.floor(Math.random()*this.cols), Math.floor(Math.random()*this.rows)];
			for(let j=0; j<this.graph.recyclable.length; j++){
				if((this.graph.recyclable[j][0]==obs[0] && this.graph.recyclable[j][1]==obs[1])||(obs[0]==0 && obs[1]==1)){
					continue loop1;
				}
			}

			for(let j=0; j<this.graph.garbage.length; j++){
				if(this.graph.garbage[j][0]==obs[0] && this.graph.garbage[j][1]==obs[1]){
					continue loop1;
				}
			}
			if((this.graph.bins.garbage[0]==obs[0] && this.graph.bins.garbage[1]==obs[1])||(this.graph.bins.recyclable[0]==obs[0] && this.graph.bins.recyclable[1]==obs[1])||(this.graph.charger[0]==obs[0] && this.graph.charger[1]==obs[1])){
				continue loop1;
			}
			if(this.graph.nodes[this.cols*obs[1]+obs[0]].type!=TileNode.Type.Ground){
				console.log('bug', this.graph.nodes[this.cols*obs[1]+obs[0]]);
			}
			this.setTileType(this.graph.nodes[this.cols*obs[1]+obs[0]], TileNode.Type.Recyclable);
			this.graph.recyclable.push(obs);
		}

		loop1: while(this.graph.garbage.length<25){
			let obs= [Math.floor(Math.random()*this.cols), Math.floor(Math.random()*this.rows)];
			for(let j=0; j<this.graph.garbage.length; j++){
				if((this.graph.garbage[j][0]==obs[0] && this.graph.garbage[j][1]==obs[1])||(obs[0]==0 && obs[1]==1)){
					continue loop1;
				}
			}

			for(let j=0; j<this.graph.recyclable.length; j++){
				if(this.graph.recyclable[j][0]==obs[0] && this.graph.recyclable[j][1]==obs[1]){
					continue loop1;
				}
			}

			if((this.graph.bins.garbage[0]==obs[0] && this.graph.bins.garbage[1]==obs[1])||(this.graph.bins.recyclable[0]==obs[0] && this.graph.bins.recyclable[1]==obs[1])||(this.graph.charger[0]==obs[0] &&this.graph.charger[1]==obs[1])){
				continue loop1;
			}
			if(this.graph.nodes[this.cols*obs[1]+obs[0]].type!=TileNode.Type.Ground){
				console.log('bug', this.graph.nodes[this.cols*obs[1]+obs[0]]);
			}
			this.setTileType(this.graph.nodes[this.cols*obs[1]+obs[0]], TileNode.Type.Garbage);
			this.graph.garbage.push(obs);
		}
	}
	/**
	
	For use in A3:
	Sets the tile to a new type
	
	**/
	setTileType(node, type) {
		node.type = type;
		this.mapRenderer.setTile(node, this.scene);
		
	}
}
