/// <reference path="phaser/phaser.d.ts"/>
var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() {
            this.constructor = d;
        }

        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
/**
 * Created by 46465442z on 15/04/16.
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
            var etiquetaCargando = this.add.text(this.world.centerX, 150, 'cargando...', {
                font: '30px Arial',
                fill: '#ffffff'
            });
            etiquetaCargando.anchor.setTo(0.5, 0.5);
            // Muestra la barra de progreso
            var progressBar = this.add.sprite(this.world.centerX, 200, 'progressBar');
            progressBar.anchor.setTo(0.5, 0.5);
            this.load.setPreloadSprite(progressBar);
            // Precargamos los sprites
            this.load.image("player", "assets/player.png");
            this.load.image('paredV', 'assets/wallVertical.png');
            this.load.image('paredH', 'assets/wallHorizontal.png');
            this.load.image('moneda', 'assets/coin.png');
            this.load.image('enemigo', 'assets/enemy.png');
            // Cargamos una imagen que hará de fondo en la pantalla de menu
            this.load.image('fondo', 'assets/background.png');
        };
        LoadState.prototype.create = function () {
            _super.prototype.create.call(this);
            this.game.state.start('menu');
        };
        return LoadState;
    })(Phaser.State);
    MyGame.LoadState = LoadState;
})(MyGame || (MyGame = {}));
//# sourceMappingURL=LoadState.js.map