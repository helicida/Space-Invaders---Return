/**
 * Created by 46465442z on 18/04/16.
 */

module MyGame {

    class Proteccion extends Phaser.Sprite {

        // Instanciamos el juego
        game:SimpleGame;

        // Variables
        id:string;   // ID con la que identificaremos la protección

        // Array que contiene las distintas partes de la protección
        protecciones:Phaser.Group;

        constructor(game:Phaser.Game, x:number, y:number, key:string|Phaser.RenderTexture|Phaser.BitmapData|PIXI.Texture, frame:string|number, id:string) {
            super(game, x, y, key, frame);
            this.id = id;

            this.protecciones.createMultiple(4, 'proyectiles');

            this.protecciones.forEach((proteccion:Phaser.Sprite) => {
                proteccion.health = 4;
            }, this);

        }

        // Update
        update():void {
            super.update();

            this.game.physics.arcade.overlap(this.protecciones, this.game.proyectilesEnemigos, this.danyarProteccion, null, this);

        }

        // Metodos
        danyarProteccion(proteccion:Phaser.Sprite, proyectil:Phaser.Sprite):void {

            proteccion.damage(1);

            if (proteccion.health == 0) {
                proteccion.kill();
            }
            else if (proteccion.health == 3) {
                //proteccion.loadTexture();
            }
            else if (proteccion.health = 2) {
                //proteccion.loadTexture();

            }
            else if (proteccion.health = 1) {
                //proteccion.loadTexture();
            }

        }
    }
}