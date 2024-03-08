import { TileNode } from './TileNode.js';
import * as THREE from 'three';

export class Graph {
	
	// Constructor for our Graph class
	constructor(tileSize, cols, rows) {

		// node array to hold our graph
		this.nodes = [];

		this.tileSize = tileSize;
		this.cols = cols;
		this.rows = rows;

		this.garbage =[];
		this.recyclable=[];
		this.bins={garbage: null, recyclable: null};
		this.charger=null;
	}

	length() {
		return this.nodes.length;
	}
	
	fillRandomTile(){
		
		
		console.log(this.bins);
		loop1: while(this.garbage.length<25){
			let obs= [Math.floor(Math.random()*this.cols), Math.floor(Math.random()*this.rows)];
			for(let j=0; j<this.garbage.length; j++){
				if((this.garbage[j][0]==obs[0] && this.garbage[j][1]==obs[1])||(obs[0]==0 && obs[1]==1)){
					continue loop1;
				}
			}
			this.garbage.push(obs);
		}
		
		loop1: while(this.recyclable.length<25){
			let obs= [Math.floor(Math.random()*this.cols), Math.floor(Math.random()*this.rows)];
			for(let j=0; j<this.recyclable.length; j++){
				if((this.recyclable[j][0]==obs[0] && this.recyclable[j][1]==obs[1])||(obs[0]==0 && obs[1]==1)){
					continue loop1;
				}
			}

			for(let j=0; j<this.garbage.length; j++){
				if(this.garbage[j][0]==obs[0] && this.garbage[j][1]==obs[1]){
					continue loop1;
				}
			}
			this.recyclable.push(obs);
		}

		loop1: while(this.bins.garbage==null){
			let obs= [Math.floor(Math.random()*this.cols), Math.floor(Math.random()*this.rows)];
			for(let j=0; j<this.garbage.length; j++){
				if((this.garbage[j][0]==obs[0] && this.garbage[j][1]==obs[1])||(obs[0]==0 && obs[1]==1)){
					continue loop1;
				}
			}
			for(let j=0; j<this.recyclable.length; j++){
				if((this.recyclable[j][0]==obs[0] && this.recyclable[j][1]==obs[1])||(obs[0]==0 && obs[1]==1)){
					continue loop1;
				}
			}
			this.bins.garbage=obs;
		}

		loop1: while(this.bins.recyclable==null){
			let obs= [Math.floor(Math.random()*this.cols), Math.floor(Math.random()*this.rows)];
			for(let j=0; j<this.garbage.length; j++){
				if((this.garbage[j][0]==obs[0] && this.garbage[j][1]==obs[1])||(obs[0]==0 && obs[1]==1)){
					continue loop1;
				}
			}
			for(let j=0; j<this.recyclable.length; j++){
				if((this.recyclable[j][0]==obs[0] && this.recyclable[j][1]==obs[1])||(obs[0]==0 && obs[1]==1)){
					continue loop1;
				}
			}
			this.bins.recyclable=obs;
		}
		loop1: while(this.charger==null){
			let obs= [Math.floor(Math.random()*this.cols), Math.floor(Math.random()*this.rows)];
			for(let j=0; j<this.garbage.length; j++){
				if((this.garbage[j][0]==obs[0] && this.garbage[j][1]==obs[1])||(obs[0]==0 && obs[1]==1)){
					continue loop1;
				}
			}
			for(let j=0; j<this.recyclable.length; j++){
				if((this.recyclable[j][0]==obs[0] && this.recyclable[j][1]==obs[1])||(obs[0]==0 && obs[1]==1)){
					continue loop1;
				}
			}
			if((this.bins.recyclable[0]==obs[0] && this.bins.recyclable[1]==obs[1])|| (this.bins.garbage[0]==obs[0] && this.bins.garbage[1]==obs[1])){
				continue loop1;
			}
			this.charger=obs;
		}
		console.log(this.garbage, this.recyclable, this.bins);
		
	}
	// Initialize our game graph
	initGraph() {

		this.fillRandomTile();
		
		console.log(this.garbage, this.recyclable, this.bins);
		// Create a new tile node
		// for each index in the grid
		for (let j = 0; j < this.rows; j++) {
			for (let i = 0; i < this.cols; i++) {

				let type = TileNode.Type.Ground;

				if(this.bins.garbage[0]==i && this.bins.garbage[1]==j){
					type=TileNode.Type.TB;
				}
				else if(this.bins.recyclable[0]==i && this.bins.recyclable[1]==j){
					type=TileNode.Type.RB;
				}
				else if(this.charger[0]==i && this.charger[1]==j){
					type=TileNode.Type.Charger;
				}
				for(let h=0; h<this.garbage.length;h++){
					if(this.garbage[h][0]==i && this.garbage[h][1]==j){
						type=TileNode.Type.Garbage;
					}
					else if(this.recyclable[h][0]==i && this.recyclable[h][1]==j){
						type=TileNode.Type.Recyclable;
					}
				}
				

				let node = new TileNode(this.nodes.length, i, j, type);
				this.nodes.push(node);
			}
		}

		
		// Create west, east, north, south
		// edges for each node in our graph
		for (let j = 0; j < this.rows; j++) {
			for (let i = 0; i < this.cols; i++) {

				// The index of our current node
				let index = j * this.cols + i;
				let current = this.nodes[index];

				if (current.type == TileNode.Type.Ground) {

					if (i > 0) {
						// CREATE A WEST EDGE
						let west = this.nodes[index - 1];
						current.tryAddEdge(west, this.tileSize);

					}

					if (i < this.cols - 1) {
						// CREATE AN EAST EDGE
						let east = this.nodes[index + 1];
						current.tryAddEdge(east, this.tileSize);

					}

					if (j > 0) {
						// CREATE A NORTH EDGE
						let north = this.nodes[index-this.cols];
						current.tryAddEdge(north, this.tileSize);
					}

					if (j < this.rows - 1) {
						// CREATE A SOUTH EDGE
						let south = this.nodes[index+this.cols];
						current.tryAddEdge(south, this.tileSize);
					}
				}

			}
		}

	}

	getNode(x, z) {
		return this.nodes[z * this.cols + x];
	}



}