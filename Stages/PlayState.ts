/**
 * Created by 46465442z on 18/04/16.
 */

import Point = Phaser.Point;

module MyGame {

    export class PlayState extends Phaser.State {

        // game:Phaser.Game;
        game:SpaceInvadersGame;

        preload():void {
            super.preload();

        };

        create():void {
            super.create();

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

        createTexts() {

            var width = this.scale.bounds.width;

            // Texto puntuación
            this.game.scoreText = this.add.text(this.game.MARGEN_TEXTOS, this.game.MARGEN_TEXTOS, 'Score: ' + this.game.score,
                {font: "30px Arial", fill: "#ffffff"});

            this.game.scoreText.fixedToCamera = true;

            // Texto de las vidas
            this.game.livesText = this.add.text(width - 300, this.game.MARGEN_TEXTOS, 'Vidas del jugador: ' + this.game.jugador.health,
                {font: "30px Arial", fill: "#ffffff"});

            this.game.scoreText.fixedToCamera = true;
        };

        createJugador() {
            // Para el movimiento de la barra con las teclas
            this.game.cursor = this.input.keyboard.createCursorKeys();

            var jugador = new Player('J1', 5, this.game, this.world.centerX, this.world.centerY, 'sprites', 'spaceship');
            this.game.jugador = this.add.existing(jugador);
        };

        createProyectiles() {
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
        
        createProtecciones(){

            this.game.protecciones = this.add.group();

            // Instanciamos la clase factory que es con la que generaremos los enemigos
            var factory = new ProteccionesFactory(this.game);

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

        }

        createProyectilesEnemigos() {

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

        private createExplosions() {

            this.game.explosiones = this.add.group();
            this.game.explosiones.createMultiple(20, 'sprites', 'explosion');

            this.game.explosiones.setAll('anchor.x', 0.5);
            this.game.explosiones.setAll('anchor.y', 0.5);

            this.game.explosiones.forEach((explosion:Phaser.Sprite) => {
                explosion.loadTexture('sprites', 'explosion');
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

                    //console.log(Phaser.Animation.generateFrameNames("enemigo1-", 1, 2)[1]);
                    //marcianos1.animations.add('general', Phaser.Animation.generateFrameNames("enemigo1-", 1, 2), 1, false, true);
                    //marcianos1.animations.play('general');
                }
            }
        };

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
        };

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
        };

        matarMarcianos(enemigo:Enemigo, proyectil:Phaser.Sprite) {

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

                this.game.endGameText = this.add.text(this.world.centerX - 90, this.world.centerY - 30, '¡Has ganado!',
                    {font: "50px Arial", fill: "#ffffff"});
            }
        };

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
        };

        danyarJugador(jugador:Player, proyectil:Phaser.Sprite) {

            jugador.damage(1);

            this.game.livesText.setText("Vida jugador: " + this.game.jugador.health);

            if (jugador.health == 0) {
                this.matarJugador(jugador, null);
            }

            this.explosion(proyectil.x, proyectil.y);
            proyectil.kill();
        };

        matarJugador(jugador:Player, enemigo:Enemigo) {

            jugador.damage(jugador.health);

            this.game.livesText.setText("Vida jugador: " + this.game.jugador.health);

            if (jugador.health == 0) {

                jugador.kill();

                this.game.endGameText = this.add.text(this.world.centerX - 90, this.world.centerY - 30, 'Has perdido',
                    {font: "50px Arial", fill: "#ffffff"});
            }

            this.explosion(jugador.body.x, jugador.body.y);
        }

        danyarProteccion(proteccion:Proteccion, proyectil:Phaser.Sprite) {

            proteccion.danyarProteccion();

            if(proteccion.health == 0){
                proteccion.kill();
            }

            proyectil.kill();
        }

        destruirProteccion(enemigo:Enemigo, proteccion:Proteccion) {
            proteccion.kill();
        }


        update():void {
            super.update();

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
                    this.game.marcianos1.forEach((marciano1:Phaser.Sprite) => {
                        marciano1.loadTexture('sprites', 'enemigo1-1');
                    }, this);

                    this.game.spriteMaricanos = false;
                }
                else {
                    this.game.marcianos1.forEach((marciano1:Phaser.Sprite) => {
                        marciano1.loadTexture('sprites', 'enemigo1-2');
                    }, this);

                    this.game.spriteMaricanos = true;
                }

                // Reproducimos el sonido del movimiento
                if(this.game.marcianos1.countLiving() > 1){
                    this.game.sonidoMovimeintoEnemigo.play();
                }

                // Comprobamos que no nos hayamos salido de la pantalla
                if ((this.game.marcianos1.x < 0) || (this.game.marcianos1.x > this.game.world.width) || (this.game.marcianos1.x + this.game.marcianos1.width > this.game.world.width)) {

                    this.game.marcianos1.y += 50;
                    this.game.velocidad *= -1;

                    if(this.game.tiempoMovimiento > 151){
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
            } else if (this.game.cursor.right.isDown) {
                this.game.jugador.body.acceleration.x = this.game.ACELERACION;
            }

            // Controla los movimientos del raton
            this.game.jugador.position.x = this.game.input.x;
        }
    }
    window.onload = () => {
        new SpaceInvadersGame();
    };
}
