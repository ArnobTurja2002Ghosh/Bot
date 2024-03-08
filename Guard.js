import { Character } from './Character.js';
import { State, PatrolState } from './State.js';


export class Guard extends Character {

	constructor(colour, enemy) {
		super(colour);
		this.state = new PatrolState();
		this.state.enterState(this, enemy);
	}

	switchState(enemy, state) {
		this.state = state;
		this.state.enterState(this, enemy);
	}

	update(enemy, deltaTime) {
		super.update(deltaTime);
		this.state.updateState(this, enemy);
	}

	

}