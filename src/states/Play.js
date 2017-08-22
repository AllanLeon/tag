import Phaser from 'phaser';
import Player from '../models/Player';
import Obstacle from '../models/Obstacle';
import TimerDisplayer from '../models/TimerDisplayer';
import {PlayerTurn, GameState} from '../domain/types';

export default class Play extends Phaser.State {
	create () {
		this.game.gameState = GameState.PLAYING;
		this.hasCollided = 0;
		
		// Add your game content here
		this.physics.startSystem(Phaser.Physics.ARCADE);
		
		this.player1 = new Player(
			this.game, 100, 400,
			this.game.input.keyboard.addKey(Phaser.Keyboard.W),
			this.game.input.keyboard.addKey(Phaser.Keyboard.S),
			this.game.input.keyboard.addKey(Phaser.Keyboard.A),
			this.game.input.keyboard.addKey(Phaser.Keyboard.D)
		);
		this.player1.frame = 1;

		this.player2 = new Player(
			this.game, 800, 400,
			this.game.input.keyboard.addKey(Phaser.Keyboard.UP),
			this.game.input.keyboard.addKey(Phaser.Keyboard.DOWN),
			this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT),
			this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT)
		);
		this.player2.frame = 0;

		this.game.currentTurn = PlayerTurn.PLAYER_1;
		this.player1.showBomb();
		/*this.score = {
			player1: 0,
			player2: 0
		};*/
        
        this.timer = new TimerDisplayer(this.game, 0, 0, Phaser.Timer.SECOND * 20);

		this.obs1 = new Obstacle(this.game, 500, 400, 0.7);
		this.obs2 = new Obstacle(this.game, 300, 100, 0.7);

		this.resetPositions();

		//console.log(this.score);
	}

	resetPositions() {
		this.player1.x = 100;
		this.player1.y = 400;

		this.player2.x = 800;
		this.player2.y = 400;
	}

	playerCollision() {
		this.hasCollided++;
		if (this.hasCollided % 2 == 0) {
			if (this.game.currentTurn == PlayerTurn.PLAYER_1) {
				//this.score.player1++;
				this.game.currentTurn = PlayerTurn.PLAYER_2;
				this.player1.hideBomb();
				this.player2.showBomb();
			} else {
				//this.score.player2++;
				this.game.currentTurn = PlayerTurn.PLAYER_1;
				this.player1.showBomb();
				this.player2.hideBomb();
			}
			
			this.resetPositions();
			this.timer.reset();
			//console.log(this.score);
		}
	}

	update () {
		if (this.game.gameState === GameState.PLAYING) {
			this.game.physics.arcade.overlap(this.player1, this.player2, this.playerCollision, null, this);
			this.game.physics.arcade.collide(this.player1, this.obs1);
			this.game.physics.arcade.collide(this.player1, this.obs2);
			this.game.physics.arcade.collide(this.player2, this.obs1);
			this.game.physics.arcade.collide(this.player2, this.obs2);
			this.player1.update();
			this.player2.update();
			this.timer.update();
		} else if (this.game.gameState === GameState.GAME_OVER) {
			if (this.game.currentTurn === PlayerTurn.PLAYER_1) {
				this.player1.kill();
			} else if (this.game.currentTurn === PlayerTurn.PLAYER_2) {
				this.player2.kill();
			}
		}

	}

	render() {
		// this.game.debug.body(this.player1);
		// this.game.debug.body(this.player2);
		// this.game.debug.body(this.obs1);
		// this.game.debug.body(this.obs2);	
	}
}
