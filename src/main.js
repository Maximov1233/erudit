import {
    dictionary
} from './dictionary.js';
import {
    alphabet
} from './letters.js';

const box = document.querySelector('.box'),
    tripleWord = [0, 7, 14, 105, 119, 210, 224],
    doubleLetter = [3, 11, 36, 38, 45, 52, 59, 92, 96, 98, 102, 108, 116, 122, 126, 128, 132, 165, 172, 179, 186, 188, 213, 221],
    doubleWord = [16, 28, 32, 42, 48, 56, 64, 70, 154, 160, 168, 176, 182, 192, 196, 208],
    tripleLetter = [20, 24, 76, 80, 84, 88, 136, 140, 144, 148, 200, 204];



for (let i = 0; i < 225; i++) {
    const boxCell = document.createElement('div');
    boxCell.classList.add('box-cell');
    boxCell.dataset.pos = i + 1;
    box.append(boxCell);
}

const boxCells = document.querySelectorAll('.box-cell'),
    submitButton = document.querySelector('.submit-button'),
    center = boxCells[112];

center.classList.add('star');

let x = 1,
    y = 1;

for (let i = 0; i < boxCells.length; i++) {
    boxCells[i].dataset.x = x;
    boxCells[i].dataset.y = y;
    x++;
    if (x === 16) {
        x = 1;
        boxCells[i].dataset.y = y;
        y++;
    }
}

tripleWord.forEach((key) => {
    boxCells[key].classList.add('triple-word');
});
doubleLetter.forEach((key) => {
    boxCells[key].classList.add('double-letter');
});
doubleWord.forEach((key) => {
    boxCells[key].classList.add('double-word');;
});
tripleLetter.forEach((key) => {
    boxCells[key].classList.add('triple-letter');
});

// let letter = document.createElement('div');
// letter.classList.add('letter');
// letter.setAttribute("draggable", "true");
// letter.innerHTML = `
//     <img src="./img/letter_bg.png">
//     <p class="letter-symbol">${alphabet['Р'].symbol}</p>
//     <p class="letter-index">${alphabet['Р'].index}</p>
// `;

const availableLetters = document.querySelector('.available-letters');

const randomProperty = function (obj) {
    const keys = Object.keys(obj);
    return obj[keys[keys.length * Math.random() << 0]];
};

const getRandomIntInclusive = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    let number = Math.floor(Math.random() * (max - min + 1)) + min;
    return number;
};

const shuffle = (arr) => {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

const startingTiles = () => {
    let firstLetters = [];

    for (let key in dictionary) {
        if (key.length <= 3) {
            firstLetters.push(key);
        }
    }

    let startingTilesArr = [...firstLetters[getRandomIntInclusive(0, firstLetters.length - 1)].toUpperCase()];

    console.log(startingTilesArr);

    while (startingTilesArr.length !== 7) {
        startingTilesArr.push(randomProperty(alphabet).symbol);
    }

    startingTilesArr = shuffle(startingTilesArr);

    startingTilesArr.forEach((item) => {
        const slot = document.createElement('div');
        slot.classList.add('slot');
        const letter = document.createElement('div');
        letter.classList.add('letter');
        letter.setAttribute('draggable', "true");
        letter.innerHTML = `
            <p class="letter-symbol">${alphabet[item].symbol}</p>
            <p class="letter-index">${alphabet[item].index}</p>
        `;
        slot.append(letter);
        availableLetters.append(slot);
    });
};



const twoLinesCheck = () => {
    let arrX = [],
        arrY = [],
        x,
        y;

    const tilesInGame = document.querySelectorAll('.box .letter');

    tilesInGame.forEach((tile) => {
        x = tile.parentNode.dataset.x;
        y = tile.parentNode.dataset.y;
        arrX.push(tile.parentNode.dataset.y);
        arrY.push(tile.parentNode.dataset.x);
    });

    // console.log(arrX);
    // console.log(arrY);

    const sameValues = (arr, coord) => {
        const check = arr.every((elem) => {
            return elem === coord;
        });
        return check;
    };

    let lineChecker = sameValues(arrX, y) + sameValues(arrY, x);

    // console.log(lineChecker);

    return [lineChecker, sameValues(arrX, y), sameValues(arrY, x), arrX, arrY];
};

const checkWord = (cell) => {
    let x = cell.dataset.x,
        y = cell.dataset.y,
        definition,
        checker = 0,
        arrX = [],
        arrY = [];

    const hint = document.querySelector('.hints');
    const tilesInGame = document.querySelectorAll('.box .letter');


    const defOutput = () => {
        for (let key in dictionary) {
            if (key === arrX.join('').trim(' ') || key === arrY.join('').trim(' ')) {
                checker++;
                definition = key + ': ' + dictionary[key].definition;
                setTimeout(() => {
                    alert(definition);
                }, 300);
                hint.style.color = 'green';
            }
        }
    };

    let twoLinesCheckArr = twoLinesCheck();

    if (twoLinesCheckArr[0] !== 0) {
        hint.style.color = '';
        if (cell.classList.contains('box-cell')) {
            boxCells.forEach((cell) => {
                if (cell.dataset.y === y) {
                    if (cell.hasChildNodes()) {
                        arrX.push(cell.childNodes[0].childNodes[1].textContent.toLowerCase());
                    } else {
                        arrX.push(' ');
                    }
                }

                if (cell.dataset.x === x) {
                    if (cell.hasChildNodes()) {
                        arrY.push(cell.childNodes[0].childNodes[1].textContent.toLowerCase());
                    } else {
                        arrY.push(' ');
                    }
                }
            });

            // console.log(arrX);
            // console.log(arrY);

            if (twoLinesCheckArr[0] !== 0 && center.hasChildNodes()) {
                defOutput();
            }
        } else {
            tilesInGame.forEach((tile) => {
                if (twoLinesCheckArr[1] === true) {
                    if (tile.dataset.y === twoLinesCheckArr[4[0]]) {
                        arrX.push(tile.childNodes[1].textContent.toLowerCase());
                    }
                }
                 else if (twoLinesCheckArr[2] === true) {
                    if (tile.dataset.x === twoLinesCheckArr[5[0]]) {
                        arrY.push(tile.childNodes[1].textContent.toLowerCase());
                    }
                }
            });

            if (twoLinesCheckArr[0] !== 0 && center.hasChildNodes()) {
                defOutput();
            }
        }
    } else {
        hint.style.color = 'red';
    }
};

startingTiles();

const slots = document.querySelectorAll('.slot');

// dragDrop

const letters = document.querySelectorAll('.letter');

const dragStart = function (letter) {
    setTimeout(() => {
        letter.classList.add('hide');
    }, 0);
};

const dragEnd = function (letter) {
    letter.classList.remove('hide');
};

const dragOver = function (cell, evt) {
    evt.preventDefault();
};

const dragEnter = function (cell, evt) {
    if (cell.hasChildNodes()) return;
    evt.preventDefault();
    cell.classList.add('hovered');
};

const dragLeave = function (cell) {
    cell.classList.remove('hovered');
};

const dragDrop = function (cell, letter) {
    // console.log(letter.parentNode);
    if (letter.parentNode.classList.contains('box-cell')) {
        if (!cell.hasChildNodes()) {
            cell.append(letter);
            cell.classList.remove('hovered');
        } else {
            cell.classList.remove('hovered');
            return;
        }
        checkWord(cell);
    } else {
        if (!cell.hasChildNodes()) {
            cell.append(letter);
            cell.classList.remove('hovered');
        } else {
            cell.classList.remove('hovered');
            return;
        }
        checkWord(letter.parentNode);
    }
};

let letterUsed;

letters.forEach(letter => {
    letter.addEventListener('dragstart', () => {
        letterUsed = letter;
        dragStart(letter);
    });
    letter.addEventListener('dragend', () => {
        dragEnd(letter);
    });
});

boxCells.forEach(cell => {
    cell.addEventListener('dragover', () => {
        dragOver(cell, event);
    });
    cell.addEventListener('dragenter', () => {
        dragEnter(cell, event);
    });
    cell.addEventListener('dragleave', () => {
        dragLeave(cell);
    });
    cell.addEventListener('drop', () => {
        dragDrop(cell, letterUsed);
    });
});

slots.forEach(slot => {
    slot.addEventListener('dragover', () => {
        dragOver(slot, event);
    });
    slot.addEventListener('dragenter', () => {
        dragEnter(slot, event);
    });
    slot.addEventListener('dragleave', () => {
        dragLeave(slot);
    });
    slot.addEventListener('drop', () => {
        dragDrop(slot, letterUsed);
    });
});