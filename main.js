/// <reference path="phaser/phaser.d.ts"/>
var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() {
            this.constructor = d;
        }

        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
var Point = Phaser.Point;
var game = PIXI.game;
var mainState = (function (_super) {
    __extends(mainState, _super);
    function mainState() {
        _super.apply(this, arguments);
        this.nextFire = 0;
        // Constantes
        this.VELOCIDAD_MAXIMA = 450; // pixels/second
        this.FUERZA_ROZAMIENTO = 100; // Aceleración negativa
        this.ACELERACION = 700; // aceleración
        this.CADENCIA_DISPARO = 200;
    }
    mainState.prototype.preload = function () {
        _super.prototype.preload.call(this);
        // Importamos las imagenes
        this.load.image('nave', 'assets/png/spaceship.png');
        this.load.image('pelota', 'assets/png/ballGrey.png');
        this.load.image('proyectiles', 'assets/png/ballBlue.png');
        this.load.image('ladrilloVerde', 'assets/png/element_green_rectangle.png');
    };
    mainState.prototype.create = function () {
        _super.prototype.create.call(this);
        this.game.stage.backgroundColor = "#4488AA";
        this.physics.arcade.checkCollision.down = false;
        // Creamos los elementos
        this.createJugador();
        this.createProyectiles();
    };
    mainState.prototype.createJugador = function () {
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
        this.jugador.body.bounce.setTo(0); // Que no rebote
        this.jugador.body.immovable = true;
    };
    mainState.prototype.createProyectiles = function () {
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
    mainState.prototype.fire = function () {
        if (this.time.now > this.nextFire) {
            var bullet = this.proyectiles.getFirstDead();
            if (bullet) {
                var length = this.jugador.width * 0.5 + 20;
                bullet.reset(this.jugador.x, this.jugador.y - this.jugador.height);
                bullet.body.velocity.setTo(0, -500);
                this.nextFire = this.time.now + this.CADENCIA_DISPARO;
            }
        }
    };
    mainState.prototype.update = function () {
        _super.prototype.update.call(this);
        // Disparar al hacer click
        if (this.input.activePointer.isDown) {
            this.fire();
        }
        // Movimientos en el eje X
        if (this.cursor.left.isDown) {
            this.jugador.body.acceleration.x = -this.ACELERACION;
        }
        else if (this.cursor.right.isDown) {
            this.jugador.body.acceleration.x = this.ACELERACION;
        }
        this.jugador.position.x = this.game.input.x;
    };
    return mainState;
})(Phaser.State);
var Ladrillo = (function (_super) {
    __extends(Ladrillo, _super);
    function Ladrillo(game, x, y, key, frame) {
        _super.call(this, game, x, y, key, frame);
    }
    return Ladrillo;
})(Phaser.Sprite);
var Enemigos = (function (_super) {
    __extends(Enemigos, _super);
    function Enemigos(game, x, y, key, frame) {
        _super.call(this, game, x, y, key, frame);
    }

    return Enemigos;
})(Phaser.Sprite);
var SimpleGame = (function () {
    function SimpleGame() {
        this.game = new Phaser.Game(600, 600, Phaser.AUTO, 'gameDiv');
        this.game.state.add('main', mainState);
        this.game.state.start('main');
    }
    return SimpleGame;
})();
window.onload = function () {
    var game = new SimpleGame();
};
//# sourceMappingURL=main.js.map