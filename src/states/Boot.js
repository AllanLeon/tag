import Phaser from 'phaser';

export default class Boot extends Phaser.State {
	init () {
		// Phaser will automatically pause if the browser tab the game is in loses focus
		this.stage.disableVisibilityChange = true
	}

	preload () {
	 	// Load anything you need for the game here
	}

	create () {
		this.game.stage.backgroundColor = '#222'

		// Start the game
		this.state.start('Play')
	}
}
