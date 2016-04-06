/// <reference path="phaser/phaser.d.ts"/>

import Point = Phaser.Point;
class mainState extends Phaser.State {
    game:Phaser.Game;


    preload():void {
        super.preload();

    }

    create():void {
        super.create();


    }

    update():void {
        super.update();


    }
}

class Ladrillo extends Phaser.Sprite {

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
