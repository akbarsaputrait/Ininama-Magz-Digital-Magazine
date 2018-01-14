var game = {
    data: {
        score: 0,
        steps: 0,
        start: false,
        newHiScore: false,
        muted: false
    },

    resources: [
        // images
        { name: "bg", type: "image", src: "./assets/file/game/img/bg.png" },
        { name: "clumsy", type: "image", src: "./assets/file/game/img/clumsy.png" },
        { name: "pipe", type: "image", src: "./assets/file/game/img/pipe.png" },
        { name: "logo", type: "image", src: "./assets/file/game/img/logo.png" },
        { name: "ground", type: "image", src: "./assets/file/game/img/ground.png" },
        { name: "gameover", type: "image", src: "./assets/file/game/img/gameover.png" },
        { name: "gameoverbg", type: "image", src: "./assets/file/game/img/gameoverbg.png" },
        { name: "hit", type: "image", src: "./assets/file/game/img/hit.png" },
        { name: "getready", type: "image", src: "./assets/file/game/img/getready.png" },
        { name: "new", type: "image", src: "./assets/file/game/img/new.png" },
        { name: "share", type: "image", src: "./assets/file/game/img/share.png" },
        { name: "tweet", type: "image", src: "./assets/file/game/img/tweet.png" },
        // sounds
        { name: "theme", type: "audio", src: "./assets/file/game/bgm/" },
        { name: "hit", type: "audio", src: "./assets/file/game/sfx/" },
        { name: "lose", type: "audio", src: "./assets/file/game/sfx/" },
        { name: "wing", type: "audio", src: "./assets/file/game/sfx/" },

    ],

    "onload": function() {

        if (typeof me.video.getWrapper() === 'undefined') {
            if (!me.video.init(900, 600, {
                    wrapper: "screen",
                    scale: "auto",
                    scaleMethod: "fit"
                })) {
                alert("Your browser does not support HTML5 canvas.");
                return;
            }
            me.audio.init("mp3,ogg");
        }
        me.loader.preload(game.resources, this.loaded.bind(this));
    },
    "onclose": function() {
        me.audio.stop("theme");
        me.state.change(me.state.MENU);
    },
    "loaded": function() {
        me.state.set(me.state.MENU, new game.TitleScreen());
        me.state.set(me.state.PLAY, new game.PlayScreen());
        me.state.set(me.state.GAME_OVER, new game.GameOverScreen());

        me.input.bindKey(me.input.KEY.SPACE, "fly", true);
        me.input.bindKey(me.input.KEY.M, "mute", true);
        me.input.bindPointer(me.input.KEY.SPACE);

        me.pool.register("clumsy", game.BirdEntity);
        me.pool.register("pipe", game.PipeEntity, true);
        me.pool.register("hit", game.HitEntity, true);
        me.pool.register("ground", game.Ground, true);

        me.state.change(me.state.MENU);
    }
};
