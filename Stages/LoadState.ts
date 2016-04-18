/**
 * Created by 46465442z on 18/04/16.
 */
module MyGame {

    export class LoadState extends Phaser.State {

        preload():void {
            super.preload();

            // Agregamos un texto de cargando a la pantalla
            var etiquetaCargando = this.add.text(this.world.centerX, 150, 'Cargando...',
                {font: '30px Arial', fill: '#ffffff'});
            etiquetaCargando.anchor.setTo(0.5, 0.5);

            // Muestra la barra de progreso
            var progressBar = this.add.sprite(this.world.centerX, 200, 'progressBar');
            progressBar.anchor.setTo(0.5, 0.5);
            this.load.setPreloadSprite(progressBar);

            // Importamos las imagenes
            this.load.image('nave', 'assets/png/spaceship.png');
            this.load.image('proyectiles', 'assets/png/enemyShoot.png');

            // Enemigos
            this.load.image('marciano1', 'assets/png/enemigo1.png');
            this.load.image('satelite', 'assets/png/satelite.png');
            this.load.image('enemyShoot', 'assets/png/enemyShoot.png');

            this.load.image('explosion', 'assets/png/explosion.png');

            // Cargamos el audio
            this.load.audio('killedEnemySound', 'sounds/killedEnemy.wav');
            this.load.audio('playerShootSound', 'sounds/playerShoot.wav');
            this.load.audio('enemyMove', 'sounds/enemyMove.wav');
            this.load.audio('sateliteMove', 'sounds/ufo_fly.wav');

            if (this.game.device.desktop) {
                this.cursors = this.input.keyboard.createCursorKeys();
            } else {
                this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
                this.scale.pageAlignHorizontally = true;
                this.scale.pageAlignVertically = true;
                this.scale.forceOrientation(true);
                this.scale.startFullScreen(false);
            }
        }

        create():void {
            super.create();
            this.game.state.start('play');
        }
    }
}