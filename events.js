$(function() {
    $("#gen").click(function() {
        var rows = $("#rows").val(),
            cols = $("#cols").val(),
            diff = $("#diff").val();
        $("#gameid").val("");
        $("#save").show();
        $("#update").hide();
        $(".message .close").click();
        $(".youwin").animate({
            height: 0,
            opacity: 0
        }, 500);
        if (window.localStorage) {
            localStorage.setItem("cols", cols);
            localStorage.setItem("rows", rows);
        }
        game.mode = "play";
        game.init(rows, cols, diff, "");
    });

    $("#draw").click(function() {
        var rows = $("#rows").val(),
            cols = $("#cols").val(),
            diff = $("#diff").val();
        $("#gameid").val("");
        $("#save").show();
        $("#update").hide();

        game.mode = "draw";
        game.init(rows, cols, diff, "");
    });

    $("#cheat").click(function() {
        var index = Math.floor(Math.random() * $(".game-piece").not(".game-cheat").length);
        $(".game-piece").not(".game-cheat").eq(index).addClass("game-cheat");
    });

    $("#clear").click(function() {
        $(".game-active").removeClass("game-active");
        if (game.mode == "draw")
            $(".game-piece, .game-piece-draw").removeClass("game-piece").removeClass("game-piece-draw");
    });

    $("#check").click(function() {
        $(".game-piece").toggleClass("game-reveal");
        $(".message div").html("<div>This shows what the original puzzle pieces were. It is possible to come up with " +
            " a different solution to the puzzle than what was generated</div>")
            .addClass("success").fadeIn(1000);
    });
    $("#load").click(function() {
        var gameSource = $("#source").val();
        game.init(null, null, null, gameSource);
    });
    $(".message .close").click(function() {
        $(".message div").fadeOut();
    })

    $("#zoomout").click(function() {
        var zoomlevel = game.zoomlevel;
        $("#zoomin").removeAttr("disabled");
        if (zoomlevel > 0) {
            $(".game-inactive").addClass("zoom-" + (zoomlevel - 2)).removeClass("zoom-" + zoomlevel);
            game.zoomlevel -= 2;
            if (game.zoomlevel == 0) {
                $("#zoomout").attr("disabled", "true");
            }
            setTimeout(game.addShadow, 500);
        }
    });
    $("#zoomin").click(function() {
        var zoomlevel = game.zoomlevel;
        $("#zoomout").removeAttr("disabled");
        if (zoomlevel < 20) {
            $(".game-inactive").addClass("zoom-" + (zoomlevel + 2)).removeClass("zoom-" + zoomlevel);
            game.zoomlevel += 2;
            if (game.zoomlevel == 20) {
                $("#zoomin").attr("disabled", "true");
            }
            setTimeout(game.addShadow, 500);
        }
    });
    $("#setimg").click(function() {
        var imgurl = $("#imgurl").val();
        if (imgurl) {
            console.log(imgurl);
            $("#grid .image").css("background-image", "url(" + imgurl + ")");
            $("#grid table").css("opacity", "0.75");
        }
    });
});