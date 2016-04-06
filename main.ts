/// <reference path="phaser/phaser.d.ts"/>

import Point = Phaser.Point;
import game = PIXI.game;
class mainState extends Phaser.State {
    game:Phaser.Game;

    // Sprites
    private jugador:Phaser.Sprite;
    private cursor:Phaser.CursorKeys;
    private proyectiles:Phaser.Group;
    private nextFire = 0;

    // Constantes
    private VELOCIDAD_MAXIMA = 450;  // pixels/second
    private FUERZA_ROZAMIENTO = 100; // Aceleración negativa
    private ACELERACION = 700;       // aceleración
    private CADENCIA_DISPARO = 200;

    preload():void {
        super.preload();

        // Importamos las imagenes
        this.load.image('nave', 'assets/png/spaceship.png');
        this.load.image('pelota', 'assets/png/ballGrey.png');
        this.load.image('proyectiles', 'assets/png/ballBlue.png');
        this.load.image('ladrilloVerde', 'assets/png/element_green_rectangle.png');
    }

    create():void {
        super.create();

        this.game.stage.backgroundColor = "#4488AA";
        this.physics.arcade.checkCollision.down = false;

        // Creamos los elementos
        this.createJugador();
        this.createProyectiles()
    }

    createJugador() {
        // Coordenadas y posicion de la barra
        this.jugador = this.add.sprite(this.world.centerX, 0, 'nave');
        this.jugador.x = this.world.centerX;
        this.jugador.y = this.world.height - this.jugador.height - 5;
        this.jugador.anchor.setTo(0.5, 0.5);

        // Para el movimiento de la barra con las teclas
        this.cursor = this.input.keyboard.createCursorKeys();

        // Activamos la fisica y la hacemos rebotar con los bordes
        this.physics.enable(this.jugador);
        this.jugador.body.collideWorldBounds = true;

        // Fuerza de rozamiento para que la barra frene
        this.jugador.body.drag.setTo(this.FUERZA_ROZAMIENTO, this.FUERZA_ROZAMIENTO); // x, y

        // Le damos una velocidad maxima
        this.jugador.body.maxVelocity.setTo(this.VELOCIDAD_MAXIMA, 0); // x, y
        this.jugador.body.bounce.setTo(0);  // Que no rebote
        this.jugador.body.immovable = true;
    }

    createProyectiles() {
        this.proyectiles = this.add.group();
        this.proyectiles.enableBody = true;
        this.proyectiles.physicsBodyType = Phaser.Physics.ARCADE;
        this.proyectiles.createMultiple(20, 'proyectiles');

        this.proyectiles.setAll('anchor.x', 0.5);
        this.proyectiles.setAll('anchor.y', 0.5);
        this.proyectiles.setAll('scale.x', 0.5);
        this.proyectiles.setAll('scale.y', 0.5);
        this.proyectiles.setAll('outOfBoundsKill', true);
        this.proyectiles.setAll('checkWorldBounds', true);
    };

    fire():void {

        if (this.time.now > this.nextFire) {

            var bullet = this.proyectiles.getFirstDead();

            if (bullet) {
                var length = this.jugador.width * 0.5 + 20;

                bullet.reset(this.jugador.x, this.jugador.y - this.jugador.height);

                bullet.body.velocity.setTo(0, -500);

                this.nextFire = this.time.now + this.CADENCIA_DISPARO;
            }
        }
    }

    update():void {
        super.update();

        // Disparar al hacer click
        if (this.input.activePointer.isDown) {
            this.fire();
        }

        // Movimientos en el eje X
        if (this.cursor.left.isDown) {
            this.jugador.body.acceleration.x = -this.ACELERACION;
        } else if (this.cursor.right.isDown) {
            this.jugador.body.acceleration.x = this.ACELERACION;
        }

        this.jugador.position.x = this.game.input.x;
    }
}

class Ladrillo extends Phaser.Sprite {

    constructor(game:Phaser.Game, x:number, y:number, key:string|Phaser.RenderTexture|Phaser.BitmapData|PIXI.Texture, frame:string|number) {
        super(game, x, y, key, frame);
    }
}

class Enemigos extends Phaser.Sprite {

    constructor(game:Phaser.Game, x:number, y:number, key:string|Phaser.RenderTexture|Phaser.BitmapData|PIXI.Texture, frame:string|number) {
        super(game, x, y, key, frame);
    }
}


class SimpleGame {

    game:Phaser.Game;

    constructor() {
        this.game = new Phaser.Game(600, 600, Phaser.AUTO, 'gameDiv');

        this.game.state.add('main', mainState);
        this.game.state.start('main');
    }
}

window.onload = () => {
    var game = new SimpleGame();
};
