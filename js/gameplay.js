// globals

var settings = {
    easy: {
        boardLength: 4,
        boardWidth: 2
    },
    medium: {
        boardLength: 5,
        boardWidth: 4
    },
    hard: {
        boardLength: 6,
        boardWidth: 5
    }
};

// Max 15 needed
var wordList = [
    "Gladiator", "Inception", "Watchmen",
    "Hancock", "Beowolf", "Titanic",
    "Ratatouille", "Transformers", "Maleficent",
    "Thor", "Avengers", "Taken",
    "Jumanji", "Juno", "Jaws"
];

var board;
var idArrr;
var tryCount;
var openCount;
var winCount;
var freeze;



$(document).ready(function() {
    setup($(".difficulty-level").val());
    setTileHandler();
});


function setTileHandler() {
    $(".tile").on('click', function() {
        // disable clicking during timeout
        if (!freeze) {
            $(this).addClass("open");
            $(this).text($(this).data('content'));
            tryCount++;
            if (tryCount === 2) {
                var tryTiles = $(".tile.open");
                if (tryTiles[0].innerText === tryTiles[1].innerText) {
                    openCount++;
                    eureka();
                    if (openCount === winCount) {
                        pwned();
                    }
                } else {
                    freeze = true;
                    setTimeout(closeTiles, 500);
                }
                tryCount = 0;
            }
        }
    });
}


function pwned() {
    $("body").append("<div class='mask'><div class='options'>You won!!<br>Play Again? <span class='play-yes'>Yes</span> / <span class='play-no'>No</span></div></div>")
    $(".play-yes").on('click', function() {
        location.reload();
    });
    $(".play-no").on('click', function() {
        $(".mask").remove();
    });
}

function closeTiles() {
    freeze = false;
    $(".tile.open").each(function(index, el) {
        $(el).removeClass("open");
        $(this).html("&clubs;");
    });
}

function eureka() {
    $(".tile.open").each(function(index, el) {
        $(el).removeClass("open");
        $(el).addClass("eureka");
        $(el).off('click');
    });
}

// Event handlers
$(".difficulty-level").on('change', function() {
    setup(this.value);
    setTileHandler();
});

$(".new-game").on('click', function() {
    setup($(".difficulty-level").val());
})



function setup(level) {
    board = [];
    idArrr = [];
    tryCount = 0;
    openCount = 0;
    winCount = 0;
    freeze = false;
    prepareBoard(level);
    drawBoard();
}

function prepareBoard(level) {
    var boardLength = settings[level].boardLength,
        boardWidth = settings[level].boardWidth;

    winCount = boardLength * boardWidth / 2;

    // construct a 2D array to mimic the board
    for (var i = 0; i < boardWidth; i++) {
        board[i] = [];
        idArrr[i] = [];
    }
    var toUseUniqWords = _.sample(wordList, winCount);
    var toUseAllWords = toUseUniqWords.concat(toUseUniqWords);
    var toUseShuffledWords = _.shuffle(toUseAllWords);

    count = 0;
    for (var i = 0; i < boardLength; i++) {
        for (var j = 0; j < boardWidth; j++) {
            board[j].push(toUseShuffledWords[i * boardWidth + j]);
            // We traverse the spiral matrix onboard this 'pirate' array ;)
            idArrr[j].push(count++);
        }
    }
}


// Code credit: http://chrisrng.svbtle.com/spirally-traversing-a-twodimensional-array-in-javascript

/*
 * Accepts a matrix array
 * Returns the spirally traversed formatted string or -1 if invalid
 */
function toSpiralString(matrix) {
    if (matrix && matrix.constructor === Array && matrix[0] && matrix[0].constructor === Array) {
        return spiral(matrix);
    }
}

/*
 * Tail recursive implementation of displaying a matrix in a string format
 * Traverses the matrix spirally, clockwise rotation
 */
function spiral(matrix, result) {
    if (matrix.length == 1) {
        return (typeof result == "undefined" ? matrix[0].toString() : result + "," + matrix[0].toString());
    } else if (matrix.length >= 1 && matrix[0].length >= 1) {
        return spiral(transpose(matrix.slice(1,matrix.length)).reverse(), (typeof result == "undefined" ? matrix[0] : result + "," + matrix[0].toString()));
    } else {
        return [];
    }
}

// Flip over the diagonal
function transpose(matrix) {
    if (matrix.length >= 1 && matrix[0].length >= 1) {
        return Array.apply(null, Array(matrix[0].length)).map(function(e, i) {
            return matrix.map(function(arr) {
                return arr[i];
            })
        });
    } else {
        return [[]];
    }
}


function drawBoard() {
    // clear board
    $(".board").empty();

    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
            $(".board").append("<span style='opacity:0' class='tile' data-id='" + idArrr[i][j] + "' data-content='" + board[i][j] + "'>&clubs;</span>");
        }
        $(".board").append("<div></div");
    }
    toSpiralString(idArrr).split(",").forEach(function(item, idx) {
        setTimeout(
            function() {
                $(".tile[data-id=" + item + "]").animate({opacity: 1}, {duration: 500});
            }, idx*100);
    });
}