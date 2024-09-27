// Splash Screen Scene
class SplashScene extends Phaser.Scene {
  constructor() {
      super({ key: 'SplashScene' });
  }

  preload() {
      this.load.image('logo', 'assets/logo.png'); // Using assets/ path
      this.load.image('startButton', 'assets/startButton.png'); // Using assets/ path
  }

  create() {
      // Add gradient background
      this.createGradientBackground();

      // Add logo image
      let logo = this.add.image(400, 200, 'logo');
      logo.setScale(0.5); // Adjust scale as needed

      // Add start button
      let startButton = this.add.image(400, 400, 'startButton');
      startButton.setInteractive();

      // Start the main game when the button is clicked
      startButton.on('pointerdown', () => {
          this.scene.start('MainScene'); // Switch to the main game scene
      });
  }

  // Function to create the gradient background
  createGradientBackground() {
      let graphics = this.add.graphics();

      // Create a vertical gradient (top to bottom) using fillGradientStyle
      graphics.fillGradientStyle(0xfba65a, 0xffcb6b, 0xff8f50, 0xff7591, 1);
      graphics.fillRect(0, 0, 800, 600); // Cover the entire screen
  }
}

// Main Game Scene
class MainScene extends Phaser.Scene {
  constructor() {
      super({ key: 'MainScene' });
  }

  preload() {
      this.load.image('clam', 'assets/clam.png'); // Using assets/ path
      this.load.image('beaver', 'assets/beaver.png'); // Using assets/ path
      this.load.image('stone', 'assets/stone.png'); // Using assets/ path
  }

  create() {
      this.gameOver = false;
      this.score = 0;

      // Add gradient background in the main game scene
      this.createGradientBackground();

      // Add the clam (player's object)
      this.clam = this.physics.add.sprite(400, 550, 'clam').setCollideWorldBounds(true);

      // Create groups for beavers and stones
      this.beaverGroup = this.physics.add.group();
      this.stoneGroup = this.physics.add.group();

      // Add collider between clam and the objects
      this.physics.add.overlap(this.clam, this.beaverGroup, this.catchBeaver, null, this);
      this.physics.add.overlap(this.clam, this.stoneGroup, this.catchStone, null, this);

      // Display score
      this.scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#000' });

      // Spawn beavers and stones every 1 second (store timer reference)
      this.spawnTimer = this.time.addEvent({
          delay: 1000,
          callback: this.spawnObjects,
          callbackScope: this,
          loop: true
      });

      // Add keyboard controls
      this.cursors = this.input.keyboard.createCursorKeys();
  }

  update() {
      if (this.gameOver) return;

      // Move the clam left and right with arrow keys (speed changed to 350)
      if (this.cursors.left.isDown) {
          this.clam.setVelocityX(-350);
      } else if (this.cursors.right.isDown) {
          this.clam.setVelocityX(350);
      } else {
          this.clam.setVelocityX(0);
      }
  }

  // Function to create the gradient background
  createGradientBackground() {
      let graphics = this.add.graphics();

      // Create a vertical gradient (top to bottom) using fillGradientStyle
      graphics.fillGradientStyle(0xfba65a, 0xffcb6b, 0xff8f50, 0xff7591, 1);
      graphics.fillRect(0, 0, 800, 600); // Cover the entire screen
  }

  // Function to spawn either a beaver or a stone randomly
  spawnObjects() {
      if (Phaser.Math.Between(0, 1) === 0) {
          // Spawn a beaver
          let beaver = this.beaverGroup.create(Phaser.Math.Between(0, 800), 0, 'beaver');
          beaver.setVelocityY(Phaser.Math.Between(100, 200));
      } else {
          // Spawn a stone
          let stone = this.stoneGroup.create(Phaser.Math.Between(0, 800), 0, 'stone');
          stone.setVelocityY(Phaser.Math.Between(100, 200));
      }
  }

  // Function when a beaver is caught
  catchBeaver(clam, beaver) {
      beaver.destroy();
      this.score += 1;
      this.scoreText.setText('Score: ' + this.score);
  }

  // Function when a stone is caught (game over)
  catchStone(clam, stone) {
      stone.destroy();
      this.physics.pause();
      this.clam.setTint(0xff0000);  // Red tint to indicate game over
      this.gameOver = true;
      this.spawnTimer.remove(); // Stop the spawn timer when the game is over
      this.scoreText.setText('Game Over! Final Score: ' + this.score);
  }
}

// Configuration for the Phaser game
let config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
      default: 'arcade',
      arcade: {
          gravity: { y: 300 }, // Apply gravity so beavers and stones fall
          debug: false
      }
  },
  scene: [SplashScene, MainScene] // Add multiple scenes to handle the splash and main game
};

let game = new Phaser.Game(config);
