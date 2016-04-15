/// <reference path="phaser/phaser.d.ts"/>

import Point = Phaser.Point;

class SimpleGame extends Phaser.Game {

    game:Phaser.Game;

    // Puntuacion
    score:number = 0;

    // Sonidos
    sonidoEnemigoMuerto;
    sonidoDisparoJugador;
    sonidoMovimeintoEnemigo;
    sonidoPlatillo;


    // Textos que mostramos en pantalla
    scoreText:Phaser.Text;
    livesText:Phaser.Text;
    MARGEN_TEXTOS = 25;

    // Tilemaps y TileLayers
    tilemap:Phaser.Tilemap;

    // Grupos
    marcianos1:Phaser.Group;
    sateltites:Phaser.Group;

    // Variables
    velocidad = 10;
    nextMovement = 0;
    tiempoMovimiento = 800;

    explosiones:Phaser.Group;

    // Sprites
    jugador:Player;
    cursor:Phaser.CursorKeys;
    proyectiles:Phaser.Group;
    proyectilesEnemigos:Phaser.Group;

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
        this.load.image('proyectiles', 'assets/png/ballBlue.png');

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
    }

    create():void {
        super.create();

        // Asignamos el audio a sus variables
        this.game.sonidoEnemigoMuerto =  this.game.add.audio('killedEnemySound');
        this.game.sonidoDisparoJugador =  this.game.add.audio('playerShootSound');
        this.game.sonidoMovimeintoEnemigo =  this.game.add.audio('enemyMove');
        this.game.sonidoPlatillo =  this.game.add.audio('sateliteMove');

        // Background
        this.game.stage.backgroundColor = "#0000";
        this.physics.arcade.checkCollision.down = false;

        // Creamos los elementos
        this.createJugador();
        this.createProyectiles();
        this.createProyectilesEnemigos();
        this.createMonsters();
        this.createExplosions();
        this.createTexts();
    }

    createTexts(){

        var width = this.scale.bounds.width;

        // Texto puntuación
        this.game.scoreText = this.add.text(this.game.MARGEN_TEXTOS, this.game.MARGEN_TEXTOS, 'Score: ' + this.game.score,
            {font: "30px Arial", fill: "#ffffff"});

        this.game.scoreText.fixedToCamera = true;

        // Texto de las vidas
        this.game.livesText = this.add.text(width - 900, this.game.MARGEN_TEXTOS, 'Coordenadas: ',
            {font: "30px Arial", fill: "#ffffff"});

        this.game.scoreText.fixedToCamera = true;

    }

    createJugador() {
        // Para el movimiento de la barra con las teclas
        this.game.cursor = this.input.keyboard.createCursorKeys();

        var jugador = new Player('J1', 5, this.game, this.world.centerX, this.world.centerY, 'nave', 0);
        this.game.jugador = this.add.existing(jugador);
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

    createProyectilesEnemigos() {

        this.game.proyectilesEnemigos = this.add.group();
        this.game.proyectilesEnemigos.enableBody = true;
        this.game.proyectilesEnemigos.physicsBodyType = Phaser.Physics.ARCADE;
        this.game.proyectilesEnemigos.createMultiple(20, 'enemyShoot');

        this.game.proyectilesEnemigos.setAll('anchor.x', 0.5);
        this.game.proyectilesEnemigos.setAll('anchor.y', 0.5);
        this.game.proyectilesEnemigos.setAll('scale.x', 0.5);
        this.game.proyectilesEnemigos.setAll('scale.y', 0.5);
        this.game.proyectilesEnemigos.setAll('outOfBoundsKill', true);
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
        var factory = new EnemigosFactory(this.game);
        
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
    }

    fire():void {

        if (this.time.now > this.game.nextFire) {

            var bullet = this.game.proyectiles.getFirstDead();

            if (bullet) {

                bullet.reset(this.game.jugador.x, this.game.jugador.y - this.game.jugador.height);

                bullet.body.velocity.setTo(0, -500);
                this.game.sonidoDisparoJugador.play();

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

            // reproducimos el sonido
            this.game.sonidoEnemigoMuerto.play();

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

    matarMarcianos(enemigo:Enemigo, proyectil:Phaser.Sprite) {

        // Matamos los sprites
        enemigo.kill();
        proyectil.kill();

        // Ejecutamos la animación de explosion
        this.explosion(proyectil.x, proyectil.y);

        // Actualizamos la puntuación
        this.game.score += 10;
        this.game.scoreText.setText("Score: " + this.game.score);
    }

    matarSatelites(satelite:Satelite, proyectil:Phaser.Sprite) {

        // Matamos los sprites
        satelite.kill();
        proyectil.kill();

        this.game.sonidoPlatillo.stop();

        // Ejecutamos la animación de explosion
        this.explosion(proyectil.x, proyectil.y);

        // Actualizamos la puntuación
        this.game.score += 100;
        this.game.scoreText.setText("Score: " + this.game.score);
    }

    danyarJugador(proyectil:Phaser.Sprite, jugador:Player) {

        jugador.damage(1);

        if (jugador.health == 0) {
            jugador.kill();
        }

        this.explosion(proyectil.x, proyectil.y);
    }

    update():void {
        super.update();

        // Colisions
        this.physics.arcade.overlap(this.game.marcianos1, this.game.proyectiles, this.matarMarcianos, null, this);
        this.physics.arcade.overlap(this.game.sateltites, this.game.proyectiles, this.matarSatelites, null, this);
        this.physics.arcade.overlap(this.game.jugador, this.game.proyectilesEnemigos, this.danyarJugador, null, this);


        // Disparar al hacer click
        if (this.input.activePointer.isDown) {
            this.fire();
        }

        // Con este if hacemos que el movimiento sea brusco y no lineal, similar al Space Invaders original
        if (this.game.time.now > this.game.nextMovement) {

            // Movimientos
            this.game.marcianos1.x = this.game.marcianos1.x + this.game.velocidad;
            this.game.nextMovement = this.game.time.now + this.game.tiempoMovimiento;

            // Reproducimos el sonido del movimiento
            this.game.sonidoMovimeintoEnemigo.play();

            // Comprobamos que no nos hayamos salido de la pantalla
            if ((this.game.marcianos1.x < 0) || (this.game.marcianos1.x + this.game.marcianos1.width > this.game.world.width)) {
                this.game.marcianos1.y += 50;
                this.game.velocidad *= -1;

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
        } else if (this.game.cursor.right.isDown) {
            this.game.jugador.body.acceleration.x = this.game.ACELERACION;
        }

        // Controla los movimientos del raton
        this.game.jugador.position.x = this.game.input.x;
    }
}

class Player extends Phaser.Sprite {

    // Instanciamos el juego
    game:SimpleGame;

    // Variables
    id:string;   // ID con la que identificaremos al jugador

    // Constructores
    constructor(id:string, numeroVidas:number, game:SimpleGame, x:number, y:number, key:string|Phaser.RenderTexture|Phaser.BitmapData|PIXI.Texture, frame:string|number)  {
        super(game, x, y, key, frame);

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
        this.body.bounce.setTo(0);  // Que no rebote
        this.body.immovable = true;
    }
}

abstract class Enemigo extends Phaser.Sprite {

    // Games
    game:SimpleGame;

    // Constructor de los enemigos
    constructor(game:SimpleGame, x:number, y:number, key:string|Phaser.RenderTexture|Phaser.BitmapData|PIXI.Texture, frame:string|number) {
        super(game, x, y, key, frame);

        // Predeterminadas
        this.game = game;
        this.game.physics.enable(this);
        this.body.enableBody = true;
    }
}

class Marciano1 extends Enemigo {

    // Games
    game:SimpleGame;

    // Variables auxiliares
    nextFire = 0;
    CADENCIA_DISPARO = 1000;

    // Constructor de los enemigos
    constructor(game:SimpleGame, key:string|Phaser.RenderTexture|Phaser.BitmapData|PIXI.Texture, x:number, y:number)  {
        super(game, x, y,key, 0);

        // Ajustmaos el sprite
        this.game = game;
        this.game.physics.enable(this);
        this.body.enableBody = true;
    }

    update():void {
        super.update();

        if ((this.game.jugador.x - 20 < this.x) && (this.x < this.game.jugador.x + 20)) {
            this.fireEnemigos();
        }
    }

    // Metodos

    fireEnemigos():void {

        // Al azar para que no disparen todos los monstruos
        var randomValue = this.game.rnd.integerInRange(1, 100);

        if (this.game.time.now > this.nextFire && randomValue == 5 && this.alive) {

            var proyectilEnemigo = this.game.proyectilesEnemigos.getFirstDead();

            if (proyectilEnemigo) {

                proyectilEnemigo.reset(this.x, this.y + this.height);
                this.game.livesText.setText("Coordenada x: " + this.x + ", Coordenada y:" + this.y + "| Vida jugador:" + this.game.jugador.health);

                proyectilEnemigo.body.velocity.setTo(0, 500);

                this.nextFire = this.game.time.now + this.CADENCIA_DISPARO;
            }
        }
    }
}

class Satelite extends Enemigo {

    // Games
    game:SimpleGame;

    // Constructor de los enemigos
    constructor(game:SimpleGame, key:string|Phaser.RenderTexture|Phaser.BitmapData|PIXI.Texture, x:number, y:number)  {
        super(game, x, y, key, 0);

        // Ajustmaos el sprite
        this.game = game;
        this.game.physics.enable(this);
        this.body.enableBody = true;
        this.body.collideWorldBounds = true;

        // Rebote
        this.body.velocity.x = 400;
        this.body.bounce.setTo(1);

        this.game.sonidoPlatillo.loop = true;
        this.game.sonidoPlatillo.play();

    }
}

class EnemigosFactory {

    // Instanciamos el juego
    game:SimpleGame;

    // Constructores
    constructor(game:SimpleGame) {
        this.game = game;
    }

    // Con este metodo
    generarEnemigo(key:string|Phaser.RenderTexture|Phaser.BitmapData|PIXI.Texture, x:number, y:number):Enemigo {

        if (key =='marciano1'){
            return new Marciano1(this.game, key, x, y);
        }
        else if (key =='satelite'){
            return new Satelite(this.game, key, x, y);
        }
        else {
            return null;
        }
    }
}

window.onload = () => {
    new SimpleGame();
};
