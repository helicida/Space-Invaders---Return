/// <reference path="phaser/phaser.d.ts"/>

/**
 * Created by 46465442z on 15/04/16.
 */
module MyGame {

    export class BootState extends Phaser.State {

        preload():void {
            super.preload();

            this.load.image('progressBar', 'assets/progressBar.png');
        }

        create():void {
            super.create();

            this.inicializaCampoDeJuego();
            this.game.state.start('load');
        }

        private inicializaCampoDeJuego() {
            this.stage.backgroundColor = "#FFFFFF";
            this.physics.startSystem(Phaser.Physics.ARCADE);
        };
    }
}