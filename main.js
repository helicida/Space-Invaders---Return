/// <reference path="phaser/phaser.d.ts"/>
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Point = Phaser.Point;
var SimpleGame = (function (_super) {
    __extends(SimpleGame, _super);
    function SimpleGame() {
        _super.call(this, 1366, 768, Phaser.CANVAS, 'gameDiv');
        // Variables
        this.velocidad = 10;
        this.nextMovement = 0;
        this.tiempoMovimiento = 800;
        // Variables auxiliares
        this.nextFire = 0;
        // Constantes
        this.VELOCIDAD_MAXIMA = 450; // pixels/second
        this.FUERZA_ROZAMIENTO = 100; // Aceleración negativa
        this.ACELERACION = 700; // aceleración
        this.CADENCIA_DISPARO = 200; // Tiempo entre disparo y disparo
        this.MONSTER_HEALTH = 1; // golpes que aguantan los monstruos
        this.state.add('main', mainState);
        this.state.start('main');
    }
    return SimpleGame;
})(Phaser.Game);
var mainState = (function (_super) {
    __extends(mainState, _super);
    function mainState() {
        _super.apply(this, arguments);
    }
    mainState.prototype.preload = function () {
        _super.prototype.preload.call(this);
        // Importamos las imagenes
        this.load.image('nave', 'assets/png/spaceship.png');
        this.load.image('pelota', 'assets/png/ballGrey.png');
        this.load.image('proyectiles', 'assets/png/ballBlue.png');
        this.load.image('ladrilloVerde', 'assets/png/element_green_rectangle.png');
        this.load.image('enemigo1', 'assets/png/enemigo1.png');
        this.load.image('explosion', 'assets/png/explosion.png');
    };
    mainState.prototype.create = function () {
        _super.prototype.create.call(this);
        // Background
        this.game.stage.backgroundColor = "#0000";
        this.physics.arcade.checkCollision.down = false;
        // Creamos los elementos
        this.createJugador();
        this.createProyectiles();
        this.createProyectilesEnemigos();
        this.createMonsters();
        this.createExplosions();
    };
    mainState.prototype.createJugador = function () {
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
        this.game.jugador.body.bounce.setTo(0); // Que no rebote
        this.game.jugador.body.immovable = true;
        this.game.jugador.health = 1;
    };
    mainState.prototype.createProyectiles = function () {
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
    mainState.prototype.createProyectilesEnemigos = function () {
        this.game.proyectilesEnemigos = this.add.group();
        this.game.proyectilesEnemigos.enableBody = true;
        this.game.proyectilesEnemigos.physicsBodyType = Phaser.Physics.ARCADE;
        this.game.proyectilesEnemigos.createMultiple(20, 'proyectiles');
        this.game.proyectilesEnemigos.setAll('anchor.x', 0.5);
        this.game.proyectilesEnemigos.setAll('anchor.y', 0.5);
        this.game.proyectilesEnemigos.setAll('scale.x', 0.5);
        this.game.proyectilesEnemigos.setAll('scale.y', 0.5);
        this.game.proyectilesEnemigos.setAll('outOfBoundsKill', true);
        this.game.proyectilesEnemigos.setAll('checkWorldBounds', true);
    };
    mainState.prototype.createExplosions = function () {
        this.game.explosiones = this.add.group();
        this.game.explosiones.createMultiple(20, 'explosion');
        this.game.explosiones.setAll('anchor.x', 0.5);
        this.game.explosiones.setAll('anchor.y', 0.5);
        this.game.explosiones.forEach(function (explosion) {
            explosion.loadTexture('explosion');
        }, this);
    };
    mainState.prototype.createMonsters = function () {
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
                var enemigo = new Enemigo(this.game, x, y, 'enemigo1', 0);
                // mostramos el Sprite por pantalla
                this.add.existing(enemigo);
                this.game.enemigos.add(enemigo);
            }
        }
    };
    mainState.prototype.fire = function () {
        if (this.time.now > this.game.nextFire) {
            var bullet = this.game.proyectiles.getFirstDead();
            if (bullet) {
                bullet.reset(this.game.jugador.x, this.game.jugador.y - this.game.jugador.height);
                bullet.body.velocity.setTo(0, -500);
                this.game.nextFire = this.time.now + this.game.CADENCIA_DISPARO;
            }
        }
    };
    mainState.prototype.explosion = function (x, y) {
        // Sacamos el primer sprite muerto del group
        var explosion = this.game.explosiones.getFirstDead();
        if (explosion) {
            // Colocamos la explosión con su transpariencia y posición
            explosion.reset(x - this.rnd.integerInRange(0, 5) + this.rnd.integerInRange(0, 5), y - this.rnd.integerInRange(0, 5) + this.rnd.integerInRange(0, 5) - 30);
            explosion.alpha = 0.6;
            explosion.angle = this.rnd.angle();
            explosion.scale.setTo(this.rnd.realInRange(0.5, 0.75));
            // Hacemos que varíe su tamaño para dar la sensación de que el humo se disipa
            this.add.tween(explosion.scale).to({
                x: 0, y: 0
            }, 500).start();
            var tween = this.add.tween(explosion).to({ alpha: 0 }, 500);
            // Una vez terminado matámos la explosión
            tween.onComplete.add(function () {
                explosion.kill();
            });
            tween.start();
        }
    };
    mainState.prototype.matarMonstruos = function (enemigo, proyectil) {
        this.explosion(proyectil.x, proyectil.y);
        enemigo.health = 0;
        enemigo.kill();
        proyectil.kill();
    };
    mainState.prototype.danyarJugador = function (proyectil, jugador) {
        this.explosion(proyectil.x, proyectil.y);
        jugador.health -= 1;
        if (jugador.health == 0) {
            jugador.kill();
        }
    };
    mainState.prototype.update = function () {
        _super.prototype.update.call(this);
        // Colisions
        this.physics.arcade.overlap(this.game.enemigos, this.game.proyectiles, this.matarMonstruos, null, this);
        this.physics.arcade.collide(this.game.proyectilesEnemigos, this.game.jugador, this.danyarJugador, null, this);
        // Disparar al hacer click
        if (this.input.activePointer.isDown) {
            this.fire();
        }
        // Con este if hacemos que el movimiento sea brusco y no lineal, similar al Space Invaders original
        if (this.game.time.now > this.game.nextMovement) {
            this.game.enemigos.x = this.game.enemigos.x + this.game.velocidad;
            this.game.nextMovement = this.game.time.now + this.game.tiempoMovimiento;
            if ((this.game.enemigos.x < 0) || (this.game.enemigos.x + this.game.enemigos.width > this.game.world.width)) {
                this.game.enemigos.y += 50;
                this.game.velocidad *= -1;
                if (this.game.enemigos.x < 0) {
                    this.game.enemigos.x = 10;
                }
                if (this.game.enemigos.x > this.game.world.width) {
                    this.game.enemigos.x = this.game.world.width - this.game.enemigos.width - 10;
                }
            }
        }
        // Movimientos en el eje X
        if (this.game.cursor.left.isDown) {
            this.game.jugador.body.acceleration.x = -this.game.ACELERACION;
        }
        else if (this.game.cursor.right.isDown) {
            this.game.jugador.body.acceleration.x = this.game.ACELERACION;
        }
        this.game.jugador.position.x = this.game.input.x;
    };
    return mainState;
})(Phaser.State);
var Enemigo = (function (_super) {
    __extends(Enemigo, _super);
    // Constructor de los enemigos
    function Enemigo(game, x, y, key, frame) {
        _super.call(this, game, x, y, key, frame);
        this.game = game;
        this.game.physics.enable(this);
        this.body.enableBody = true;
    }

    Enemigo.prototype.update = function () {
        _super.prototype.update.call(this);
        if ((this.game.jugador.x - 20 < this.x) && (this.x < this.game.jugador.x + 20) && this.health > 0) {
            this.fireEnemigos(this);
        }
    };
    // Metodos
    Enemigo.prototype.fireEnemigos = function (enemigo) {
        if (this.game.time.now > this.game.nextFire) {
            var bullet = this.game.proyectilesEnemigos.getFirstDead();
            if (bullet) {
                bullet.reset(enemigo.x, enemigo.y);
                bullet.body.velocity.setTo(0, 500);
                this.game.nextFire = this.game.time.now + this.game.CADENCIA_DISPARO;
            }
        }
    };
    return Enemigo;
})(Phaser.Sprite);
window.onload = function () {
    new SimpleGame();
};
//# sourceMappingURL=main.js.map