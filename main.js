var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Created by 46465442z on 18/04/16.
 */
var MyGame;
(function (MyGame) {
    var Player = (function (_super) {
        __extends(Player, _super);
        // Constructores
        function Player(id, numeroVidas, game, x, y, key, frame) {
            _super.call(this, game, x, y, key, frame);
            this.id = id;
            this.health = numeroVidas;
            this.x = this.game.world.centerX;
            this.y = this.game.world.height - this.height - 5;
            this.anchor.setTo(0.5, 0.5);
            // Activamos la fisica y la hacemos rebotar con los bordes
            this.game.physics.enable(this, Phaser.Physics.ARCADE);
            this.body.collideWorldBounds = true;
            // Fuerza de rozamiento para que la barra frene
            this.body.drag.setTo(this.game.FUERZA_ROZAMIENTO, this.game.FUERZA_ROZAMIENTO); // x, y
            // Le damos una velocidad maxima
            this.body.maxVelocity.setTo(this.game.VELOCIDAD_MAXIMA, 0); // x, y
            this.body.bounce.setTo(0); // Que no rebote
            this.body.immovable = true;
        }
        return Player;
    }(Phaser.Sprite));
    MyGame.Player = Player;
})(MyGame || (MyGame = {}));
/**
 * Created by 46465442z on 18/04/16.
 */
var MyGame;
(function (MyGame) {
    var Enemigo = (function (_super) {
        __extends(Enemigo, _super);
        // Constructor de los enemigos
        function Enemigo(game, x, y, key, frame) {
            _super.call(this, game, x, y, key, frame);
            // Predeterminadas
            this.game = game;
            this.game.physics.enable(this);
            this.body.enableBody = true;
        }
        return Enemigo;
    }(Phaser.Sprite));
    MyGame.Enemigo = Enemigo;
})(MyGame || (MyGame = {}));
/**
 * Created by 46465442z on 18/04/16.
 */
var MyGame;
(function (MyGame) {
    var Marciano1 = (function (_super) {
        __extends(Marciano1, _super);
        // Constructor de los enemigos
        function Marciano1(game, key, x, y) {
            _super.call(this, game, x, y, key, 0);
            // Variables auxiliares
            this.nextFire = 0;
            this.CADENCIA_DISPARO = 1000;
            // Ajustmaos el sprite
            this.game = game;
            this.game.physics.enable(this);
            this.body.enableBody = true;
        }
        Marciano1.prototype.update = function () {
            _super.prototype.update.call(this);
            if ((this.game.jugador.body.x - 30 < this.body.x) && (this.body.x < this.game.jugador.body.x + 30)) {
                this.fireEnemigos(this.body.x, this.body.y);
            }
        };
        // Metodos
        Marciano1.prototype.fireEnemigos = function (x, y) {
            // Al azar para que no disparen todos los monstruos
            var randomValue = this.game.rnd.integerInRange(1, 100);
            if (this.game.time.now > this.nextFire && randomValue == 5 && this.alive) {
                var proyectilEnemigo = this.game.proyectilesEnemigos.getFirstDead();
                if (proyectilEnemigo) {
                    proyectilEnemigo.reset(x, y + this.height);
                    proyectilEnemigo.body.velocity.setTo(0, 500);
                    this.nextFire = this.game.time.now + this.CADENCIA_DISPARO;
                }
            }
        };
        return Marciano1;
    }(MyGame.Enemigo));
    MyGame.Marciano1 = Marciano1;
})(MyGame || (MyGame = {}));
/**
 * Created by 46465442z on 18/04/16.
 */
var MyGame;
(function (MyGame) {
    var Satelite = (function (_super) {
        __extends(Satelite, _super);
        // Constructor de los enemigos
        function Satelite(game, key, x, y) {
            _super.call(this, game, x, y, key, 0);
            // Ajustmaos el sprite
            this.game = game;
            this.game.physics.enable(this);
            this.body.enableBody = true;
            this.body.collideWorldBounds = true;
            this.loadTexture('sprites', key.toString());
            // Rebote
            this.body.velocity.x = 400;
            this.body.bounce.setTo(1);
            this.game.sonidoPlatillo.loop = true;
            this.game.sonidoPlatillo.play();
        }
        return Satelite;
    }(MyGame.Enemigo));
    MyGame.Satelite = Satelite;
})(MyGame || (MyGame = {}));
/**
 * Created by 46465442z on 18/04/16.
 */
var MyGame;
(function (MyGame) {
    var Proteccion = (function (_super) {
        __extends(Proteccion, _super);
        function Proteccion(game, key, x, y) {
            _super.call(this, game, x, y, key, 0);
            this.health = 8;
            this.game.physics.enable(this, Phaser.Physics.ARCADE);
            this.body.enableBody = true;
            this.body.immovable = true;
            // Ajustamos el tamaño para las colisiones
            this.body.width = 150;
            this.body.height = 100;
            this.loadTexture('sprites', 'protection-1');
        }
        // Metodos
        Proteccion.prototype.danyarProteccion = function () {
            this.health -= 1;
            if (this.health == 6) {
                this.loadTexture('sprites', 'protection-2');
            }
            else if (this.health == 4) {
                this.loadTexture('sprites', 'protection-3');
            }
            else if (this.health == 2) {
                this.loadTexture('sprites', 'protection-4');
            }
        };
        return Proteccion;
    }(Phaser.Sprite));
    MyGame.Proteccion = Proteccion;
})(MyGame || (MyGame = {}));
/**
 * Created by sergi on 22/04/16.
 */
var MyGame;
(function (MyGame) {
    var ProteccionesFactory = (function () {
        // Constructores
        function ProteccionesFactory(game) {
            this.game = game;
        }
        // Con este metodo
        ProteccionesFactory.prototype.generarProteccion = function (key, x, y) {
            if (key == 'proteccion') {
                return new MyGame.Proteccion(this.game, key, x, y);
            }
            else {
                return null;
            }
        };
        return ProteccionesFactory;
    }());
    MyGame.ProteccionesFactory = ProteccionesFactory;
})(MyGame || (MyGame = {}));
/**
 * Created by 46465442z on 18/04/16.
 */
var MyGame;
(function (MyGame) {
    var EnemigosFactory = (function () {
        // Constructores
        function EnemigosFactory(game) {
            this.game = game;
        }
        // Con este metodo
        EnemigosFactory.prototype.generarEnemigo = function (key, x, y) {
            if (key == 'marciano1') {
                return new MyGame.Marciano1(this.game, key, x, y);
            }
            else if (key == 'satelite') {
                return new MyGame.Satelite(this.game, key, x, y);
            }
            else {
                return null;
            }
        };
        return EnemigosFactory;
    }());
    MyGame.EnemigosFactory = EnemigosFactory;
})(MyGame || (MyGame = {}));
/// <reference path="phaser/phaser.d.ts"/>
var MyGame;
(function (MyGame) {
    var SpaceInvadersGame = (function (_super) {
        __extends(SpaceInvadersGame, _super);
        function SpaceInvadersGame() {
            _super.call(this, 1366, 768, Phaser.CANVAS, 'gameDiv');
            // Puntuacion
            this.score = 0;
            this.MARGEN_TEXTOS = 25;
            // Variables
            this.velocidad = 10;
            this.nextMovement = 0;
            this.tiempoMovimiento = 700;
            this.spriteMaricanos = true;
            // Variables auxiliares
            this.nextFire = 0;
            // Constantes
            this.ACELERACION = 700; // aceleración
            this.CADENCIA_DISPARO = 500; // Tiempo entre disparo y disparo
            this.state.add("boot", MyGame.BootState);
            this.state.add("load", MyGame.LoadState);
            this.state.add("play", MyGame.PlayState);
            this.state.start("boot");
        }
        ;
        return SpaceInvadersGame;
    }(Phaser.Game));
    MyGame.SpaceInvadersGame = SpaceInvadersGame;
    ;
})(MyGame || (MyGame = {}));
;
window.onload = function () {
    var game = new MyGame.SpaceInvadersGame();
};
/**
 * Created by 46465442z on 18/04/16.
 */
var MyGame;
(function (MyGame) {
    var BootState = (function (_super) {
        __extends(BootState, _super);
        function BootState() {
            _super.apply(this, arguments);
        }
        BootState.prototype.preload = function () {
            _super.prototype.preload.call(this);
            this.load.image('progressBar', 'assets/progressBar.png');
        };
        ;
        BootState.prototype.create = function () {
            _super.prototype.create.call(this);
            this.inicializaCampoDeJuego();
            this.game.state.start('load');
        };
        ;
        BootState.prototype.inicializaCampoDeJuego = function () {
            this.stage.backgroundColor = "#000000";
            this.physics.startSystem(Phaser.Physics.ARCADE);
        };
        ;
        return BootState;
    }(Phaser.State));
    MyGame.BootState = BootState;
})(MyGame || (MyGame = {}));
/**
 * Created by 46465442z on 18/04/16.
 */
var MyGame;
(function (MyGame) {
    var LoadState = (function (_super) {
        __extends(LoadState, _super);
        function LoadState() {
            _super.apply(this, arguments);
        }
        LoadState.prototype.preload = function () {
            _super.prototype.preload.call(this);
            // Agregamos un texto de cargando a la pantalla
            var etiquetaCargando = this.add.text(this.world.centerX, 150, 'Cargando...', { font: '30px Arial', fill: '#ffffff' });
            etiquetaCargando.anchor.setTo(0.5, 0.5);
            // Muestra la barra de progreso
            var progressBar = this.add.sprite(this.world.centerX, 200, 'progressBar');
            progressBar.anchor.setTo(0.5, 0.5);
            this.load.setPreloadSprite(progressBar);
            // Importamos las imagenes
            this.load.atlasJSONHash('sprites', 'assets/sprites.png', 'assets/sprites.json');
            // Cargamos el audio
            this.load.audio('killedEnemySound', 'sounds/killedEnemy.wav');
            this.load.audio('playerShootSound', 'sounds/playerShoot.wav');
            this.load.audio('enemyMove', 'sounds/enemyMove.wav');
            this.load.audio('sateliteMove', 'sounds/ufo_fly.wav');
            // Cargamos una imagen que hará de fondo en la pantalla de menu
            // this.load.image('fondo', 'assets/splashScreen.png');
        };
        ;
        LoadState.prototype.create = function () {
            _super.prototype.create.call(this);
            this.game.state.start('play');
        };
        ;
        return LoadState;
    }(Phaser.State));
    MyGame.LoadState = LoadState;
})(MyGame || (MyGame = {}));
/**
 * Created by 46465442z on 18/04/16.
 */
var Point = Phaser.Point;
var MyGame;
(function (MyGame) {
    var PlayState = (function (_super) {
        __extends(PlayState, _super);
        function PlayState() {
            _super.apply(this, arguments);
        }
        PlayState.prototype.preload = function () {
            _super.prototype.preload.call(this);
        };
        ;
        PlayState.prototype.create = function () {
            _super.prototype.create.call(this);
            // Asignamos el audio a sus variables
            this.game.sonidoEnemigoMuerto = this.game.add.audio('killedEnemySound');
            this.game.sonidoDisparoJugador = this.game.add.audio('playerShootSound');
            this.game.sonidoMovimeintoEnemigo = this.game.add.audio('enemyMove');
            this.game.sonidoPlatillo = this.game.add.audio('sateliteMove');
            // Background
            this.physics.arcade.checkCollision.down = false;
            // Creamos los elementos
            this.createJugador();
            this.createProyectiles();
            this.createProyectilesEnemigos();
            this.createProtecciones();
            this.createMonsters();
            this.createExplosions();
            this.createTexts();
        };
        ;
        PlayState.prototype.createTexts = function () {
            var width = this.scale.bounds.width;
            // Texto puntuación
            this.game.scoreText = this.add.text(this.game.MARGEN_TEXTOS, this.game.MARGEN_TEXTOS, 'Score: ' + this.game.score, { font: "30px Arial", fill: "#ffffff" });
            this.game.scoreText.fixedToCamera = true;
            // Texto de las vidas
            this.game.livesText = this.add.text(width - 300, this.game.MARGEN_TEXTOS, 'Vidas del jugador: ' + this.game.jugador.health, { font: "30px Arial", fill: "#ffffff" });
            this.game.scoreText.fixedToCamera = true;
        };
        ;
        PlayState.prototype.createJugador = function () {
            // Para el movimiento de la barra con las teclas
            this.game.cursor = this.input.keyboard.createCursorKeys();
            var jugador = new MyGame.Player('J1', 5, this.game, this.world.centerX, this.world.centerY, 'sprites', 'spaceship');
            this.game.jugador = this.add.existing(jugador);
        };
        ;
        PlayState.prototype.createProyectiles = function () {
            this.game.proyectiles = this.add.group();
            this.game.proyectiles.enableBody = true;
            this.game.proyectiles.physicsBodyType = Phaser.Physics.ARCADE;
            this.game.proyectiles.createMultiple(30, 'sprites', 'enemyShoot');
            this.game.proyectiles.setAll('anchor.x', 0.5);
            this.game.proyectiles.setAll('anchor.y', 0.5);
            this.game.proyectiles.setAll('scale.x', 0.5);
            this.game.proyectiles.setAll('scale.y', 0.5);
            this.game.proyectiles.setAll('outOfBoundsKill', true);
            this.game.proyectiles.setAll('checkWorldBounds', true);
        };
        ;
        PlayState.prototype.createProtecciones = function () {
            this.game.protecciones = this.add.group();
            // Instanciamos la clase factory que es con la que generaremos los enemigos
            var factory = new MyGame.ProteccionesFactory(this.game);
            //---------------------------
            //GENERAMOS EL SATELITE
            //---------------------------
            // Anyadimos el recolectable a un grupo
            this.game.protecciones = this.add.group();
            this.game.protecciones.enableBody = true;
            this.game.protecciones.physicsBodyType = Phaser.Physics.ARCADE;
            var proteccion1 = factory.generarProteccion('proteccion', 150, 580);
            var proteccion2 = factory.generarProteccion('proteccion', 650, 580);
            var proteccion3 = factory.generarProteccion('proteccion', 1150, 580);
            // Anyadimos el enemigo a su grupo
            this.add.existing(proteccion1);
            this.game.protecciones.add(proteccion1);
            this.add.existing(proteccion2);
            this.game.protecciones.add(proteccion2);
            this.add.existing(proteccion3);
            this.game.protecciones.add(proteccion3);
        };
        PlayState.prototype.createProyectilesEnemigos = function () {
            this.game.proyectilesEnemigos = this.add.group();
            this.game.proyectilesEnemigos.enableBody = true;
            this.game.proyectilesEnemigos.physicsBodyType = Phaser.Physics.ARCADE;
            this.game.proyectilesEnemigos.createMultiple(15, 'sprites', 'enemyShoot');
            this.game.proyectilesEnemigos.setAll('anchor.x', 0.5);
            this.game.proyectilesEnemigos.setAll('anchor.y', 0.5);
            this.game.proyectilesEnemigos.setAll('scale.x', 0.5);
            this.game.proyectilesEnemigos.setAll('scale.y', 0.5);
            this.game.proyectilesEnemigos.setAll('outOfBoundsKill', true);
            this.game.proyectilesEnemigos.setAll('checkWorldBounds', true);
        };
        ;
        PlayState.prototype.createExplosions = function () {
            this.game.explosiones = this.add.group();
            this.game.explosiones.createMultiple(20, 'sprites', 'explosion');
            this.game.explosiones.setAll('anchor.x', 0.5);
            this.game.explosiones.setAll('anchor.y', 0.5);
            this.game.explosiones.forEach(function (explosion) {
                explosion.loadTexture('sprites', 'explosion');
            }, this);
        };
        ;
        PlayState.prototype.createMonsters = function () {
            // Anyadimos el recolectable a un grupo
            this.game.marcianos1 = this.add.group();
            this.game.marcianos1.enableBody = true;
            // Posiciones en las que generaremos los enemigos
            var monstruosPorLinea = 20;
            var numeroFilas = 4;
            var margenAltura = 70;
            // Tamanyo de los enemigos
            var anchuraMonstruo = 45;
            var alturaMonstruo = 30;
            // Instanciamos la clase factory que es con la que generaremos los enemigos
            var factory = new MyGame.EnemigosFactory(this.game);
            //---------------------------
            //GENERAMOS EL SATELITE
            //---------------------------
            // Anyadimos el recolectable a un grupo
            this.game.sateltites = this.add.group();
            this.game.sateltites.enableBody = true;
            var satelite = factory.generarEnemigo('satelite', 20, 20);
            // Anyadimos el enemigo a su grupo
            this.add.existing(satelite);
            this.game.sateltites.add(satelite);
            //---------------------------
            // GENERAMOS LOS MARCIANOS
            //---------------------------
            for (var posFila = 0; posFila < numeroFilas; posFila++) {
                for (var posColumna = 0; posColumna < monstruosPorLinea; posColumna++) {
                    // Coordenadas en las que mostraremos el ladrillo
                    var x = anchuraMonstruo * posColumna;
                    var y = margenAltura + posFila * (alturaMonstruo + 1);
                    // Generamos un tipo de enemigos y le pasamos sus coordenadas
                    var marcianos1 = factory.generarEnemigo('marciano1', x, y);
                    // Anyadimos los enemigos a su grupo
                    this.add.existing(marcianos1);
                    this.game.marcianos1.add(marcianos1);
                }
            }
        };
        ;
        PlayState.prototype.fire = function () {
            if (this.time.now > this.game.nextFire) {
                var bullet = this.game.proyectiles.getFirstDead();
                if (bullet) {
                    bullet.reset(this.game.jugador.x, this.game.jugador.y - this.game.jugador.height);
                    bullet.body.velocity.setTo(0, -500);
                    this.game.sonidoDisparoJugador.play();
                    this.game.nextFire = this.time.now + this.game.CADENCIA_DISPARO;
                }
            }
        };
        ;
        PlayState.prototype.explosion = function (x, y) {
            // Sacamos el primer sprite muerto del group
            var explosion = this.game.explosiones.getFirstDead();
            if (explosion) {
                // Colocamos la explosión con su transpariencia y posición
                explosion.reset(x - this.rnd.integerInRange(0, 5) + this.rnd.integerInRange(0, 5), y - this.rnd.integerInRange(0, 5) + this.rnd.integerInRange(0, 5) - 30);
                explosion.alpha = 0.6;
                explosion.angle = this.rnd.angle();
                explosion.scale.setTo(this.rnd.realInRange(0.5, 0.75));
                // reproducimos el sonido
                this.game.sonidoEnemigoMuerto.play();
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
        ;
        PlayState.prototype.matarMarcianos = function (enemigo, proyectil) {
            // Matamos los sprites
            enemigo.kill();
            proyectil.kill();
            // Ejecutamos la animación de explosion
            this.explosion(proyectil.x, proyectil.y);
            // Actualizamos la puntuación
            this.game.score += 10;
            this.game.scoreText.setText("Score: " + this.game.score);
            if (this.game.marcianos1.countLiving() == 0) {
                this.game.sonidoMovimeintoEnemigo.stop();
                this.game.endGameText = this.add.text(this.world.centerX - 90, this.world.centerY - 30, '¡Has ganado!', { font: "50px Arial", fill: "#ffffff" });
                this.input.onTap.addOnce(this.restartGame, this);
            }
        };
        ;
        PlayState.prototype.matarSatelites = function (satelite, proyectil) {
            // Matamos los sprites
            satelite.kill();
            proyectil.kill();
            this.game.sonidoPlatillo.stop();
            // Ejecutamos la animación de explosion
            this.explosion(proyectil.x, proyectil.y);
            // Actualizamos la puntuación
            this.game.score += 100;
            this.game.scoreText.setText("Score: " + this.game.score);
        };
        ;
        PlayState.prototype.danyarJugador = function (jugador, proyectil) {
            jugador.damage(1);
            this.game.livesText.setText("Vida jugador: " + this.game.jugador.health);
            if (jugador.health == 0) {
                this.matarJugador(jugador, null);
            }
            this.explosion(proyectil.x, proyectil.y);
            proyectil.kill();
        };
        ;
        PlayState.prototype.matarJugador = function (jugador, enemigo) {
            jugador.damage(jugador.health);
            this.game.livesText.setText("Vida jugador: " + this.game.jugador.health);
            if (jugador.health == 0) {
                jugador.kill();
                this.game.endGameText = this.add.text(this.world.centerX - 90, this.world.centerY - 30, 'Has perdido', { font: "50px Arial", fill: "#ffffff" });
                this.input.onTap.addOnce(this.restartGame, this);
            }
            this.explosion(jugador.body.x, jugador.body.y);
        };
        PlayState.prototype.danyarProteccion = function (proteccion, proyectil) {
            proteccion.danyarProteccion();
            if (proteccion.health == 0) {
                proteccion.kill();
            }
            proyectil.kill();
        };
        PlayState.prototype.destruirProteccion = function (enemigo, proteccion) {
            proteccion.kill();
        };
        PlayState.prototype.restartGame = function () {
            this.game.score = 0;
            this.game.sonidoPlatillo.stop();
            this.game.sonidoMovimeintoEnemigo.stop();
            this.game.state.restart();
        };
        PlayState.prototype.update = function () {
            _super.prototype.update.call(this);
            // Colisiones
            // Proyectiles
            this.physics.arcade.collide(this.game.marcianos1, this.game.proyectiles, this.matarMarcianos, null, this);
            this.physics.arcade.collide(this.game.protecciones, this.game.proyectilesEnemigos, this.danyarProteccion, null, this);
            this.physics.arcade.collide(this.game.protecciones, this.game.proyectiles, this.danyarProteccion, null, this);
            this.physics.arcade.collide(this.game.sateltites, this.game.proyectiles, this.matarSatelites, null, this);
            this.physics.arcade.collide(this.game.jugador, this.game.proyectilesEnemigos, this.danyarJugador, null, this);
            // Enemigos
            this.physics.arcade.overlap(this.game.jugador, this.game.marcianos1, this.matarJugador, null, this);
            this.physics.arcade.overlap(this.game.marcianos1, this.game.protecciones, this.destruirProteccion, null, this);
            // Disparar al hacer click
            if (this.input.activePointer.isDown && this.game.jugador.health > 0) {
                this.fire();
            }
            // Con este if hacemos que el movimiento sea brusco y no lineal, similar al Space Invaders original
            if (this.game.time.now > this.game.nextMovement) {
                // Movimientos
                this.game.marcianos1.x = this.game.marcianos1.x + this.game.velocidad;
                this.game.nextMovement = this.game.time.now + this.game.tiempoMovimiento;
                if (this.game.spriteMaricanos == true) {
                    this.game.marcianos1.forEach(function (marciano1) {
                        marciano1.loadTexture('sprites', 'enemigo1-1');
                    }, this);
                    this.game.spriteMaricanos = false;
                }
                else {
                    this.game.marcianos1.forEach(function (marciano1) {
                        marciano1.loadTexture('sprites', 'enemigo1-2');
                    }, this);
                    this.game.spriteMaricanos = true;
                }
                // Reproducimos el sonido del movimiento
                if (this.game.marcianos1.countLiving() > 1) {
                    this.game.sonidoMovimeintoEnemigo.play();
                }
                // Comprobamos que no nos hayamos salido de la pantalla
                if ((this.game.marcianos1.x < 0) || (this.game.marcianos1.x > this.game.world.width) || (this.game.marcianos1.x + this.game.marcianos1.width > this.game.world.width)) {
                    this.game.marcianos1.y += 50;
                    this.game.velocidad *= -1;
                    if (this.game.tiempoMovimiento > 151) {
                        this.game.tiempoMovimiento -= 150;
                    }
                    if (this.game.marcianos1.x < 0) {
                        this.game.marcianos1.x = 10;
                    }
                    if (this.game.marcianos1.x + this.game.marcianos1.width > this.game.world.width) {
                        this.game.marcianos1.x = this.game.world.width - this.game.marcianos1.width - 10;
                    }
                }
            }
            // Movimientos en el eje X del jugador
            if (this.game.cursor.left.isDown) {
                this.game.jugador.body.acceleration.x = -this.game.ACELERACION;
            }
            else if (this.game.cursor.right.isDown) {
                this.game.jugador.body.acceleration.x = this.game.ACELERACION;
            }
            // Controla los movimientos del raton
            this.game.jugador.position.x = this.game.input.x;
        };
        return PlayState;
    }(Phaser.State));
    MyGame.PlayState = PlayState;
    window.onload = function () {
        new MyGame.SpaceInvadersGame();
    };
})(MyGame || (MyGame = {}));
//# sourceMappingURL=main.js.map