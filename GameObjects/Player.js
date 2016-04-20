var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() {
            this.constructor = d;
        }

        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
/**
 * Created by 46465442z on 18/04/16.
 */
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
})(Phaser.Sprite);
exports.Player = Player;
//# sourceMappingURL=Player.js.map