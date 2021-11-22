document.addEventListener("DOMContentLoaded",function () {
    const container = document.getElementById("container");
    let width = 10;
    let cases = [];
    let bombAmount = 20;
    let flags = 0;
    let flagsLeft = document.getElementById("flags-left");
    let isGameOver = false;
    let result = document.getElementById("result");
    let again = document.getElementById('again');


    // Create the Board
    function createBoard () {
        flagsLeft.innerHTML = bombAmount.toString();

        // Random Bomb
        const bombArray = Array(bombAmount).fill("bomb");
        const emptyArray = Array(width * width - bombAmount).fill("valid");
        const gameArray = emptyArray.concat(bombArray);
        const shuffledArray = gameArray.sort(() => Math.random() - 0.5);

        for (let i = 0; i < width * width ; i++) {
            const square = document.createElement("div");
            square.setAttribute("id", i.toString());
            square.classList.add(shuffledArray[i]);
            container.appendChild(square);
            cases.push(square);

            // Normal click
            square.addEventListener("click", function() {
                click(square);
            })

            // Right click
            square.oncontextmenu = function (e) {
                e.preventDefault();
                addFlag(square);
            }

        }
        addNumbers();
    }
    createBoard();


    // Add numbers
    function addNumbers() {
        for (let i = 0; i < cases.length; i++){
            let total = 0;
            const isLeftEdge = (i % width === 0);
            const isRightEdge = (i % width === width - 1);

            if (cases[i].classList.contains("valid")) {
                if (i > 0 && !isLeftEdge && cases[i -1].classList.contains("bomb")) total ++;
                if (i > 9 && !isRightEdge && cases[i +1 -width].classList.contains("bomb")) total ++;
                if (i > 10 && cases[i - width].classList.contains("bomb")) total ++;
                if (i > 11 && !isLeftEdge && cases[i -1 -width].classList.contains("bomb")) total ++;
                if (i < 98 && !isRightEdge && cases[i +1].classList.contains("bomb")) total ++;
                if (i < 90 && !isLeftEdge && cases[i -1 +width].classList.contains("bomb")) total ++;
                if (i < 88 && !isRightEdge && cases[i +1 + width].classList.contains("bomb")) total ++;
                if (i < 89 && cases[i +width].classList.contains("bomb")) total ++;
                cases[i].setAttribute("data", total);
            }
        }
    }


    // Add flags
    function addFlag(square) {
        if (isGameOver) return;
        if (!square.classList.contains("checked") && (flags < bombAmount)) {
            square.classList.add("flag");
            square.innerHTML = "🚩";
            flags ++;
            flagsLeft.innerHTML = bombAmount - flags;
            checkForWin();
        } else {
            square.classList.remove("flag");
            square.innerHTML = "";
            flags --;
            flagsLeft.innerHTML = bombAmount - flags;
        }
    }

    // Click on square actions
    function click(square) {
        let currentId = square.id;
        if (isGameOver) {
            return
        }
        if (square.classList.contains("checked") || square.classList.contains("flag")) {
            return
        }
        if (square.classList.contains("bomb")) {
            gameOver(square);
        } else {
            let total = square.getAttribute("data");
            if (total !=0) {
                square.classList.add("checked");
                square.innerHTML = total;
                return;
            }
            checkSquare(square, currentId);
        }
        square.classList.add("checked");
    }


    // Check the neighboring cases once square is clicked
    function checkSquare(square, currentId) {
        const isLeftEdge = (currentId % width === 0);
        const isRightEdge = (currentId % width === width -1);

        setTimeout(function () {
            if (currentId > 0 && !isLeftEdge) {
                const newId = cases[parseInt(currentId) -1].id;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }
            if (currentId > 9 && !isRightEdge) {
                const newId = cases[parseInt(currentId) +1 -width].id;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }
            if (currentId > 10) {
                const newId = cases[parseInt(currentId -width)].id;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }
            if (currentId > 11 && !isLeftEdge) {
                const newId = cases[parseInt(currentId) -1 -width].id;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }
            if (currentId < 98 && !isRightEdge) {
                const newId = cases[parseInt(currentId) +1].id;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }
            if (currentId < 90 && !isLeftEdge) {
                const newId = cases[parseInt(currentId) -1 +width].id;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }
            if (currentId < 88 && !isRightEdge) {
                const newId = cases[parseInt(currentId) +1 +width].id;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }
            if (currentId < 89) {
                const newId = cases[parseInt(currentId) +width].id;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }
        },10)
    }


    // Game Over
    function gameOver() {
        isGameOver = true;

        // Show all the bombs
        cases.forEach(square => {
            if (square.classList.contains("bomb")) {
                square.innerHTML = "🖕";
                result.innerHTML = "Vous avez perdu !";
                again.style.display = "block";
            }
        })
    }

    // Check for win
    function checkForWin() {
        let matches = 0;
        for (let i = 0; i < cases.length; i++) {
            if (cases[i].classList.contains("flag") && cases[i].classList.contains("bomb")) {
                matches ++;
            }
            if (matches === bombAmount) {
                result.innerHTML = "Vous avez gagné !";
                isGameOver = true;
            }
        }
    }
})
