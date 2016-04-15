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
    var BootState = (function (_super) {
        __extends(BootState, _super);
        function BootState() {
            _super.apply(this, arguments);
        }

        BootState.prototype.preload = function () {
            _super.prototype.preload.call(this);
            this.load.image('progressBar', 'assets/progressBar.png');
        };
        BootState.prototype.create = function () {
            _super.prototype.create.call(this);
            this.inicializaCampoDeJuego();
            this.game.state.start('load');
        };
        BootState.prototype.inicializaCampoDeJuego = function () {
            this.stage.backgroundColor = "#FFFFFF";
            this.physics.startSystem(Phaser.Physics.ARCADE);
        };
        return BootState;
    })(Phaser.State);
    MyGame.BootState = BootState;
})(MyGame || (MyGame = {}));
//# sourceMappingURL=BootState.js.map