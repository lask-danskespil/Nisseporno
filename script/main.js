// Main Game Scene
class MainScene extends Phaser.Scene {
  constructor() {
      super({ key: 'MainScene' });
  }

  preload() {
      this.load.image('clamBottom', 'assets/clam-bottom.png'); // Bottom clam image
      this.load.image('clamTop', 'assets/clam-top.png');       // Top clam image
      this.load.image('beaver', 'assets/beaver.png');          // Beaver image
      this.load.image('stone', 'assets/stone.png');            // Stone image
  }

  create() {
      this.gameOver = false;
      this.score = 0;

      // Add gradient background in the main game scene
      this.createGradientBackground();

      // Add the bottom clam with physics, always visible
      this.clamBottom = this.physics.add.sprite(400, 550, 'clamBottom').setCollideWorldBounds(true);

      // Add the top clam with physics, positioned on top of the bottom clam
      this.clamTop = this.physics.add.sprite(400, 520, 'clamTop').setCollideWorldBounds(true);

      // Create groups for beavers and stones
      this.beaverGroup = this.physics.add.group();
      this.stoneGroup = this.physics.add.group();

      // Add collider between the top clam and the objects
      this.physics.add.overlap(this.clamTop, this.beaverGroup, this.catchBeaver, null, this);
      this.physics.add.overlap(this.clamTop, this.stoneGroup, this.catchStone, null, this);

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

      // Move both clam parts left and right with the same velocity
      if (this.cursors.left.isDown) {
          this.clamBottom.setVelocityX(-350);
          this.clamTop.setVelocityX(-350);
      } else if (this.cursors.right.isDown) {
          this.clamBottom.setVelocityX(350);
          this.clamTop.setVelocityX(350);
      } else {
          this.clamBottom.setVelocityX(0);
          this.clamTop.setVelocityX(0);
      }

      // Keep the top clam aligned with the bottom clam when moving
      this.clamTop.x = this.clamBottom.x;
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
  catchBeaver(clamTop, beaver) {
      beaver.destroy();
      this.score += 1;
      this.scoreText.setText('Score: ' + this.score);

      // Rotate the top clam 90 degrees clockwise (to look like it's open)
      this.clamTop.setAngle(90);

      // Switch back to closed clam position after a short delay (500ms)
      this.time.delayedCall(500, () => {
          this.clamTop.setAngle(0); // Reset the top clam back to its original state
      }, [], this);
  }

  // Function when a stone is caught (game over)
  catchStone(clamTop, stone) {
      stone.destroy();
      this.physics.pause();
      this.clamBottom.setTint(0xff0000);  // Red tint to indicate game over
      this.clamTop.setTint(0xff0000);     // Red tint to indicate game over
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
  scene: [MainScene] // Use only the main game scene
};

let game = new Phaser.Game(config);
