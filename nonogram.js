/*
 *Nonogram Puzzle Game
 *Created by Ryan Olson, 2012
 *Feel free to use this however you want.
 */

var game = {
    cols: 0,
    rows: 0,
    difficulty: 0,
    mode: "play",
    zoomlevel: 10,
    rowcounts: [],
    colcounts: [],
    mousedown: false,
    drawspace: false,
    $squares: null,
    $grid: null,
    newgame: 1,
    startTime: new Date(),
    endTime: new Date(),
    gameTime: 0,
    genGameDump: (function() {
        var self = this,
            sGameDump = "HAI_",
            sGameActive = "";

        sGameDump += self.cols + "x" + self.rows + "|";

        $(".game-inactive").each(function() {
            if ($(this).hasClass("game-piece")) {
                sGameDump += "1";
            } else {
                sGameDump += "0";
            }

            if ($(this).hasClass("game-active")) {
                sGameActive += "1";
            } else {
                sGameActive += "0";
            }
        });
        sGameDump += "--" + sGameActive + "^KTHXBYE";

        return sGameDump;
    }),
    generateGrid: (function(gameboard, active) {
        var self = this;
        self.$grid = $("<table>");

        for (var i = 0; i <= self.rows; i++) {
            self.$grid.append("<tr>");
            for (var ii = 0; ii <= self.cols; ii++) {
                self.$grid.find("tr:last").append("<td class='game-inactive zoom-" + self.zoomlevel + "'>&nbsp;</td>");
            }
        }

        self.$grid.find("tr:first td")
            .addClass("game-column game-info")
            .removeClass("game-inactive zoom-" + self.zoomlevel)
            .html("<span style='display:none'></span><div></div>");

        self.$grid.find("tr td:first-child")
            .addClass("game-row game-info")
            .removeClass("game-inactive zoom-" + self.zoomlevel)
            .html("");

        $("#grid").html(self.$grid);

        if (self.mode == "play") {
            self.makeGame(gameboard, active);
        } else if (self.mode == "draw") {
            $("#grid").prepend("<div class='image'>");
            $("#imageurl").slideDown();
            self.bind();
        }
    }),

    makeGame: (function(gameboard, active) {
        var self = this,
            i = 0,
            len = 0;

        if (!gameboard) {
            self.$squares = self.$grid.find("td").not(".game-info");
            self.$squares.each(function() {
                if ((Math.random() * self.difficulty) < 1) {
                    $(this).addClass("game-piece");
                }
            });
        } else {
            len = gameboard.length;
            for (i = 0; i < len; i++) {
                if (gameboard[i] == "1") {
                    $(".game-inactive").eq(i).addClass("game-piece");
                }
            }
        }

        if (active && !self.newgame) {
            len = active.length;
            for (i = 0; i < len; i++) {
                if (active[i] == "1") {
                    $(".game-inactive").eq(i).addClass("game-active");
                }
            }
        }
        self.rowcounts = [];
        self.colcounts = [];

        self.countRows("game-piece", self.rowcounts, false);
        self.countCols("game-piece", self.colcounts, false);

        self.addShadow();
        self.bind();
        self.startTime = new Date();
        self.checkGame();

    }),

    addShadow: (function() {
        var self = this,
            offset = {
                w: $("#grid table td:first").outerWidth() + 2,
                h: $("#grid table td:first").outerHeight() + 2
            },
            grid = {
                w: $("#grid table").width() - 2,
                h: $("#grid table").height() - 2
            },
            $gridshadow = $("#gridshadow");

        if (!$gridshadow.length) {
            $("#grid").prepend("<div id='gridshadow'>");
            $gridshadow = $("#gridshadow");
        }


        $("#gridshadow").css({
            "position": "absolute",
            "top": offset.h,
            "left": offset.w,
            "height": grid.h - offset.h,
            "width": grid.w - offset.w,
            "box-shadow": "0 0 25px #666"
        });

    }),

    countRows: (function(css_class, arr, ret) {
        var self = this,
            $rows = self.$grid.find("tr");

        $rows.each(function() {
            var count = 0,
                tempCount = [],
                $rowsquares;

            if (($(this).index()) > 0) {
                $rowsquares = $(this).find("td");
                $rowsquares.each(function() {
                    if (!$(this).hasClass(css_class)) {
                        if (count > 0) {
                            if (!ret) {
                                $(this).parent().find(".game-row").append(count + " ");
                            }
                            tempCount.push(count);
                            count = 0;
                        }
                    } else {
                        count++;
                    }
                });

                if (count > 0) {
                    if (!ret) {
                        $(this).find(".game-row").append(count + " ");
                    }
                    tempCount.push(count);
                }

                arr.push(tempCount);
            }
        });

        if (ret) {
            return arr;
        }
    }),

    countCols: (function(css_class, arr, ret) {
        if (ret) {
            $(".game-column span").html("");
        }

        var self = this,
            piece,
            $check;

        for (var i = 1; i <= this.cols; i++) {
            var $rows = self.$grid.find("tr:gt(0)"),
                colcounter = [],
                count = 0,
                $colcount,
                currentsquare = null;

            $rows.each(function() {
                currentsquare = $(this).find("td").eq(i);
                colcounter.push(currentsquare.hasClass(css_class));
            });

            $colcount = $(".game-column").eq(i);

            for (piece in colcounter) {
                if (!colcounter[piece]) {
                    if (count > 0) {
                        if (!ret) {
                            $colcount.find("div").append(count + "<br>");
                        } else {
                            $colcount.find("span").append(count + "<br>");
                        }
                        count = 0;
                    }
                } else {
                    count++;
                }
            }
            if (count > 0) {
                if (!ret) {
                    $colcount.find("div").append(count + "<br>");
                } else {
                    $colcount.find("span").append(count + "<br>");
                }
            }


        }

        if (!ret) {
            $check = $(".game-column:gt(0) div");
        } else {
            $check = $(".game-column:gt(0) span");
        }

        $check.each(function() {
            var tempArray = $(this).html().split("<br>"),
                count = 0;
            for (count in tempArray) {
                if (tempArray[count] != "") {
                    tempArray[count] = parseInt(tempArray[count], 10);
                } else {
                    tempArray.pop(count);
                }
            }
            arr.push(tempArray);
        });

        if (ret) {
            return arr;
        }
    }),

    checkGame: (function() {
        var self = this;
        var done = false;

        var checkedRows = self.countRows("game-active", [], true);

        var checkedCols = self.countCols("game-active", [], true);

        var colsValid = self.compare(self.rowcounts, checkedRows);
        var rowsValid = self.compare(self.colcounts, checkedCols);

        if (colsValid && rowsValid) {
            $("#check").slideDown(100, function() {
                self.endTime = new Date();
                self.gameTime = self.endTime - self.startTime;
                self.doWinGame();
            });

        }
    }),

    doWinGame: (function() {
        var self = this;

        $(".youwin small").html(self.countTime());
        $(".youwin").slideDown().animate({
            height: 200,
            opacity: 1
        }, 1000);
        setTimeout(function() {
            $(".youwin").animate({
                height: 0,
                opacity: 0
            }, 1000);
        }, 5000);
    }),

    countTime: (function() {
        var self = this,
            start = self.startTime,
            end = self.endTime,
            time, hours, minutes, seconds,
            second = 1000,
            minute = 1000 * 60,
            hour = 1000 * 60 * 60,
            timeString = "";

        time = (end - start);


        hours = Math.floor(time / hour);
        time -= hours * hour;

        minutes = Math.floor(time / minute);
        time -= minutes * minute;

        seconds = time / second;

        timeString = "You solved the puzzle in " +
            ((hours) ? hours + " hours" : "") +
            ((minutes) ? minutes + " minutes" : "") +
            ((seconds) ? seconds + " seconds" : "") +
            ".";

        return timeString;

    }),

    compare: (function(a, b) {
        var test;
        for (test in a) {
            if (a[test]) {
                var atest = a[test],
                    btest = b[test],
                    i;

                for (i in atest) {
                    if (atest[i]) {
                        var atestitem = atest[i],
                            btestitem = btest[i];

                        if (atestitem != btestitem) {
                            return false;
                        }
                    }
                }
            }
        }
        return true;
    }),

    toggleGamepiece: (function(el) {
        var self = this;
        el.toggleClass("game-active")
            .removeClass("game-space")
            .html("&nbsp;");
        self.checkGame();
    }),

    toggleDraw: (function(el) {
        var self = this;
        el.toggleClass("game-piece game-piece-draw");
    }),

    toggleGamespace: (function(el) {
        var self = this;
        el.toggleClass("game-space")
            .removeClass("game-active");

        if (el.hasClass("game-space")) {
            el.html("X");
        } else {
            el.html("&nbsp;");
        }
    }),

    tryParseSource: (function(source) {
        var self = this;

        if (source.substr(0, 3) != "HAI") {
            return false;
        }

        var gridSize = source.split("_")[1].split("|")[0],
            cols = gridSize.split("x")[0],
            rows = gridSize.split("x")[1],
            gameboard = source.split("|")[1].split("--")[0],
            active = source.split("--")[1].split("^")[0];

        self.cols = cols;
        self.rows = rows;

        self.generateGrid(gameboard, active);

        return true;
    }),

    bind: (function() {
        var self = this,
            mode = self.mode,
            $squares = self.$grid.find("td").not(".game-info");

        if (mode == "draw") {
            $squares.mouseenter(function(e) {
                if (self.mousedown == true) {
                    self.toggleDraw($(this));
                }
            })
                .mousedown(function(e) {
                    self.mousedown = true;
                    if (e.button == 0 || e.button == 1) {
                        self.toggleDraw($(this));
                    }
                });
        } else if (mode == "play") {
            $squares.mouseenter(function(e) {
                if (self.mousedown == true) {
                    if (!self.drawspace) {
                        self.toggleGamepiece($(this));
                    } else {
                        self.toggleGamespace($(this));
                    }
                }
            })
                .mousedown(function(e) {
                    self.mousedown = true;
                    if (e.button == 0 || e.button == 1) {
                        self.drawspace = false;
                        self.toggleGamepiece($(this));
                    } else if (e.button == 2) {
                        self.drawspace = true;
                        self.toggleGamespace($(this));
                        e.preventDefault();
                    }
                });
        }

        $squares.mouseup(function(e) {
            self.mousedown = false;
            self.drawspace = false;
            e.preventDefault();
        })
            .each(function(e) {
                this.onselectstart = function() {
                    return false;
                };
                this.oncontextmenu = function() {
                    return false;
                };
            });

        self.$grid.mouseleave(function() {
            self.mousedown = false;
        });
    }),

    init: (function(rows, cols, diff, source) {
        $("#check").slideUp();
        var self = this;
        $("#zoomout, #zoomin").removeAttr("disabled");
        if (source == "") {
            self.rows = rows;
            self.cols = cols;
            self.difficulty = parseFloat(diff);
        } else {
            if (!self.tryParseSource(source)) {
                self.init($("#rows").val(), $("#cols").val(), $("#diff").val(), "");
            }
            return;
        }
        self.generateGrid();
    })
};