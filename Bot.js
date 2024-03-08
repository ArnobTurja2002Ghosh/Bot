import { Character } from './Character.js';
import { State, PatrolState } from './State.js';


export class Bot extends Character {

	constructor(colour, gameMap) {
		super(colour);
		this.state = new PatrolState();
		this.state.enterState(this, gameMap);

		this.picked=null;
		this.charge=3;
	}

	switchState(gameMap, state) {
		this.state = state;
		this.state.enterState(this, gameMap);
	}

	update(deltaTime, gameMap) {
		super.update(deltaTime);
		this.state.updateState(this, gameMap);
	}

	drop(){
		this.picked=null;
		this.charge-=1;
	}
}