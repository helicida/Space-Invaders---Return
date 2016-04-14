/// <reference path="phaser/phaser.d.ts"/>

import Point = Phaser.Point;

class SimpleGame extends Phaser.Game {

    game:Phaser.Game;

    // Tilemaps y TileLayers
    tilemap:Phaser.Tilemap;

    // Grupos
    enemigos:Phaser.Group;
    explosiones:Phaser.Group;

    // Sprites
    jugador:Phaser.Sprite;
    cursor:Phaser.CursorKeys;
    proyectiles:Phaser.Group;

    // Variables auxiliares
    nextFire = 0;

    // Constantes
    VELOCIDAD_MAXIMA = 450;  // pixels/second
    FUERZA_ROZAMIENTO = 100; // Aceleración negativa
    ACELERACION = 700;       // aceleración
    CADENCIA_DISPARO = 200;  // Tiempo entre disparo y disparo
    MONSTER_HEALTH = 1;      // golpes que aguantan los monstruos

    constructor() {
        super(1366, 768, Phaser.CANVAS, 'gameDiv');
        this.state.add('main', mainState);
        this.state.start('main');
    }
}

class mainState extends Phaser.State {

    // game:Phaser.Game;
    game:SimpleGame;

    preload():void {
        super.preload();

        // Importamos las imagenes
        this.load.image('nave', 'assets/png/spaceship.png');
        this.load.image('pelota', 'assets/png/ballGrey.png');
        this.load.image('proyectiles', 'assets/png/ballBlue.png');
        this.load.image('ladrilloVerde', 'assets/png/element_green_rectangle.png');
        this.load.image('enemigo1', 'assets/png/enemigo1.png');
        this.load.image('explosion', 'assets/png/explosion.png');
    }

    create():void {
        super.create();

        // Background
        this.game.stage.backgroundColor = "#0000";
        this.physics.arcade.checkCollision.down = false;

        // Creamos los elementos
        this.createJugador();
        this.createProyectiles();
        this.createMonsters();
        this.createExplosions();
    }

    createJugador() {
        // Coordenadas y posicion de la barra
        this.game.jugador = this.add.sprite(this.world.centerX, 0, 'nave');
        this.game.jugador.x = this.world.centerX;
        this.game.jugador.y = this.world.height - this.game.jugador.height - 5;
        this.game.jugador.anchor.setTo(0.5, 0.5);

        // Para el movimiento de la barra con las teclas
        this.game.cursor = this.input.keyboard.createCursorKeys();

        // Activamos la fisica y la hacemos rebotar con los bordes
        this.physics.enable(this.game.jugador);
        this.game.jugador.body.collideWorldBounds = true;

        // Fuerza de rozamiento para que la barra frene
        this.game.jugador.body.drag.setTo(this.game.FUERZA_ROZAMIENTO, this.game.FUERZA_ROZAMIENTO); // x, y

        // Le damos una velocidad maxima
        this.game.jugador.body.maxVelocity.setTo(this.game.VELOCIDAD_MAXIMA, 0); // x, y
        this.game.jugador.body.bounce.setTo(0);  // Que no rebote
        this.game.jugador.body.immovable = true;
    }

    createProyectiles() {
        this.game.proyectiles = this.add.group();
        this.game.proyectiles.enableBody = true;
        this.game.proyectiles.physicsBodyType = Phaser.Physics.ARCADE;
        this.game.proyectiles.createMultiple(20, 'proyectiles');

        this.game.proyectiles.setAll('anchor.x', 0.5);
        this.game.proyectiles.setAll('anchor.y', 0.5);
        this.game.proyectiles.setAll('scale.x', 0.5);
        this.game.proyectiles.setAll('scale.y', 0.5);
        this.game.proyectiles.setAll('outOfBoundsKill', true);
        this.game.proyectiles.setAll('checkWorldBounds', true);
    };

    private createExplosions() {
        this.game.explosiones = this.add.group();
        this.game.explosiones.createMultiple(20, 'explosion');

        this.game.explosiones.setAll('anchor.x', 0.5);
        this.game.explosiones.setAll('anchor.y', 0.5);

        this.game.explosiones.forEach((explosion:Phaser.Sprite) => {
            explosion.loadTexture('explosion');
        }, this);
    };

    private createMonsters() {

        // Anyadimos el recolectable a un grupo
        this.game.enemigos = this.add.group();
        this.game.enemigos.enableBody = true;

        // Posiciones en las que generaremos los ladrillos
        var monstruosPorLinea = 20;
        var numeroFilas = 4;

        // Tamanyo de los ladrillos
        var anchuraMonstruo = 64;
        var alturoaMonstruo = 32;

        // For para llenar array de coordeandas
        for (var posFila = 0; posFila < numeroFilas; posFila++) {
            for (var posColumna = 0; posColumna < monstruosPorLinea; posColumna++) {

                // Coordenadas en las que mostraremos el ladrillo
                var x = anchuraMonstruo * posColumna;
                var y = posFila * (alturoaMonstruo + 1);

                // instanciamos el Sprite
                var enemigo = new Enemigos(this.game, x, y, 'enemigo1', 0);

                // mostramos el Sprite por pantalla
                this.add.existing(enemigo);
                this.game.enemigos.add(enemigo);
            }
        }
    }

    fire():void {

        if (this.time.now > this.game.nextFire) {

            var bullet = this.game.proyectiles.getFirstDead();

            if (bullet) {

                var length = this.game.jugador.width * 0.5 + 20;

                bullet.reset(this.game.jugador.x, this.game.jugador.y - this.game.jugador.height);

                bullet.body.velocity.setTo(0, -500);

                this.game.nextFire = this.time.now + this.game.CADENCIA_DISPARO;
            }
        }
    }

    explosion(x:number, y:number):void {

        // Sacamos el primer sprite muerto del group
        var explosion:Phaser.Sprite = this.game.explosiones.getFirstDead();

        if (explosion) {

            // Colocamos la explosión con su transpariencia y posición
            explosion.reset(
                x - this.rnd.integerInRange(0, 5) + this.rnd.integerInRange(0, 5),
                y - this.rnd.integerInRange(0, 5) + this.rnd.integerInRange(0, 5) - 30
            );
            explosion.alpha = 0.6;
            explosion.angle = this.rnd.angle();
            explosion.scale.setTo(this.rnd.realInRange(0.5, 0.75));

            // Hacemos que varíe su tamaño para dar la sensación de que el humo se disipa
            this.add.tween(explosion.scale).to({
                x: 0, y: 0
            }, 500).start();

            var tween = this.add.tween(explosion).to({alpha: 0}, 500);

            // Una vez terminado matámos la explosión
            tween.onComplete.add(() => {
                explosion.kill();
            });

            tween.start();
        }
    }

    matarMonstruos(enemigo:Enemigos, proyectil:Phaser.Sprite) {
        this.explosion(proyectil.x, proyectil.y);
        enemigo.health = 0;
        enemigo.kill();
        proyectil.kill();
    }

    update():void {
        super.update();

        // Colisions
        this.physics.arcade.overlap(this.game.enemigos, this.game.proyectiles, this.matarMonstruos, null, this);

        // Disparar al hacer click
        if (this.input.activePointer.isDown) {
            this.fire();
        }

        // Movimientos en el eje X
        if (this.game.cursor.left.isDown) {
            this.game.jugador.body.acceleration.x = -this.game.ACELERACION;
        } else if (this.game.cursor.right.isDown) {
            this.game.jugador.body.acceleration.x = this.game.ACELERACION;
        }

        this.game.jugador.position.x = this.game.input.x;
    }
}

class Enemigos extends Phaser.Sprite {

    // Games
    game:SimpleGame;

    // Variables
    private velocidad = 10;
    private nextMovement = 0;
    private tiempoMovimiento = 800;

    // Constructor de los enemigos
    constructor(game:SimpleGame, x:number, y:number, key:string|Phaser.RenderTexture|Phaser.BitmapData|PIXI.Texture, frame:string|number) {
        super(game, x, y, key, frame);

        this.game = game;
        this.game.physics.enable(this);
        this.body.enableBody = true;
    }


    update():void {
        super.update();

        if (this.health > 0) {

            // Con este if hacemos que el movimiento sea brusco y no lineal, similar al Space Invaders original
            if (this.game.time.now > this.nextMovement) {

                this.x = this.x + this.velocidad;
                this.nextMovement = this.game.time.now + this.tiempoMovimiento;

                if ((this.x >= this.game.width - 45) || (this.x <= 0)) {
                    this.reboteEnemigos(this);
                }
            }
        }
    }

    // Metodos

    reboteEnemigos(enemigo:Enemigos) {
        this.game.enemigos.callAll('invierteVelocidad', null);
        this.game.enemigos.callAll('bajar', null, -20);
    }

    bajar(px:number) {
        this.y = this.y - px;
    }

    invierteVelocidad() {
        this.velocidad *= -1;
    }

    // Setters

    setVelocidad(value:number):void {
        this.velocidad = value;
    }

    // Getters

    getVelocidad():number {
        return this.velocidad;
    }
}

window.onload = () => {
    new SimpleGame();
};
