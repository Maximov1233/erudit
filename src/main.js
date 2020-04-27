// import

import {
    dictionary
} from './dictionary.js';
import {
    alphabet
} from './alphabet.js';

// adding cells

const tripleWord = [0, 7, 14, 105, 119, 210, 224],
    doubleLetter = [3, 11, 36, 38, 45, 52, 59, 92, 96, 98, 102, 108, 116, 122, 126, 128, 132, 165, 172, 179, 186, 188, 213, 221],
    doubleWord = [16, 28, 32, 42, 48, 56, 64, 70, 154, 160, 168, 176, 182, 192, 196, 208],
    tripleLetter = [20, 24, 76, 80, 84, 88, 136, 140, 144, 148, 200, 204];

const box = document.querySelector('.box');

for (let i = 0; i < 225; i++) {
    const boxCell = document.createElement('div');
    boxCell.classList.add('box-cell');
    boxCell.dataset.pos = i + 1;
    box.append(boxCell);
}

const availableLetters = document.querySelector('.available-letters'),
    boxCells = document.querySelectorAll('.box-cell'),
    bagItems = document.querySelector('.bag-items'),
    bagTitle = document.querySelector('.bag-title'),
    bagModal = document.querySelector('.bag-modal__bg'),
    submitButton = document.querySelector('.submit-button'),
    hint = document.querySelector('.hints'),
    bagClose = document.querySelector('.bag-close'),
    center = boxCells[112];

center.classList.add('star');

let points = 0;



const emptyChecker = (arr) => {
    let checker = arr.every((elem) => {
        return elem !== ' ';
    });
    return checker;
};

// adding classes

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

// coordinates

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

// functions

const fillingBag = () => {
    for (let key in alphabet) {
        const bagItem = document.createElement('div');
        bagItem.classList.add('bag-item');
        bagItem.innerHTML = `
        <div class="letter">
            <p class="letter-symbol">${alphabet[key].symbol}</p>
            <p class="letter-index">${alphabet[key].index}</p>
        </div>
        <p class="amount">${alphabet[key].amount}</p>
        `;
        bagItems.append(bagItem);
    }
};

fillingBag();

const tilesInBag = document.querySelectorAll('.bag-item .letter');

const tilesBagChecker = (symbol) => {
    let checker;
    for (let i = 0; i < tilesInBag.length; i++) {
        if (tilesInBag[i].childNodes[1].textContent === symbol) {
            if (tilesInBag[i].parentNode.childNodes[3].textContent !== '0') {
                tilesInBag[i].parentNode.childNodes[3].textContent--;
                checker = true;
            } else {
                checker = false;
            }
            break;
        }
    }
    return checker;
};

const randomProperty = (obj) => {
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

const appendingTiles = (arr) => {
    let slots = document.querySelectorAll('.slot');
    // console.log(arr);
    if (slots.length === 0) {
        arr.forEach((item) => {
            const slot = document.createElement('div');
            slot.classList.add('slot');
            const letter = document.createElement('div');
            letter.classList.add('letter');
            letter.setAttribute('draggable', 'true');
            letter.innerHTML = `
                <p class="letter-symbol">${alphabet[item].symbol}</p>
                <p class="letter-index">${alphabet[item].index}</p>
            `;
            slot.append(letter);
            availableLetters.append(slot);
        });
    } else {
        for (let i = 0; i < slots.length; i++) {
            if (!slots[i].hasChildNodes()) {
                const letter = document.createElement('div');
                letter.classList.add('letter');
                letter.setAttribute('draggable', 'true');
                letter.innerHTML = `
                    <p class="letter-symbol">${alphabet[arr[i]].symbol}</p>
                    <p class="letter-index">${alphabet[arr[i]].index}</p>
                `;
                slots[i].append(letter);
            }
        }
    }
};

const addingTilesIntoArr = (arr, isStart) => {

    if (isStart === true) {
        while (arr.length !== 7) {
            const symbol = randomProperty(alphabet).symbol;
            if (tilesBagChecker(symbol) === true) {
                arr.push(symbol);
            }
        }
        arr = shuffle(arr);
    } else {
        while (emptyChecker(arr) === false) {
            for (let i = 0; i < arr.length; i++) {
                if (arr[i] === '') {
                    const symbol = randomProperty(alphabet).symbol;
                    if (tilesBagChecker(symbol) === true) {
                        arr.splice(i, 1, symbol);
                        // console.log(arr);
                    }
                }
            }
        }
    }
    appendingTiles(arr);
};

const startingTiles = () => {
    let firstLetters = [];

    for (let key in dictionary) {
        if (key.length <= 3) {
            firstLetters.push(key);
        }
    }

    let startingTilesArr = [...firstLetters[getRandomIntInclusive(0, firstLetters.length - 1)].toUpperCase()];

    startingTilesArr.forEach((item) => {
        tilesBagChecker(item);
    });

    console.log(startingTilesArr);

    addingTilesIntoArr(startingTilesArr, true);
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

    const sameValues = (arr, coord) => {
        const check = arr.every((elem) => {
            return elem === coord;
        });
        return check;
    };

    let lineChecker = sameValues(arrX, y) + sameValues(arrY, x);

    return [lineChecker, sameValues(arrX, y), sameValues(arrY, x), arrX, arrY];
};

const solidWord = (arr) => {
    if (arr.join('').trim('').length >= 3) {
        arr = [...arr.join('').trim('')];
        return emptyChecker(arr);
    } else {
        return true;
    }
};

const wordIndicator = document.createElement('div');
wordIndicator.classList.add('word-indicator');

const checkWord = (cell) => {
    let x = cell.dataset.x,
        y = cell.dataset.y,
        definition,
        checker = 0,
        arrX = [],
        arrY = [],
        wordX,
        wordY;

    points = 0;

    const defOutput = () => {
        for (let key in dictionary) {
            if (key === arrX.join('').trim(' ') || key === arrY.join('').trim(' ')) {
                checker++;
                definition = key + '- ' + dictionary[key].definition;
                console.log(definition);
                wordIndicator.style.background = 'green';
            }
        }
    };

    let twoLinesCheckArr = twoLinesCheck();

    const addingWordIndicator = (word) => {
        wordIndicator.innerHTML = `
        <p>${points}</p>
        `;
        word.append(wordIndicator);
    };

    if (twoLinesCheckArr[0] !== 0) { // word is written in one line
        wordIndicator.style.background = '';

        if (cell.classList.contains('box-cell')) { // letter was put in box cell
            boxCells.forEach((item) => {
                let itemSymbol,
                    itemLetter,
                    itemIndex;

                if (item.hasChildNodes()) {
                    itemLetter = item.childNodes[0],
                        itemSymbol = item.childNodes[0].childNodes[1].textContent.toLowerCase(),
                        itemIndex = item.childNodes[0].childNodes[3].textContent;
                } else {
                    itemSymbol = ' ';
                }

                if (item.dataset.y === y && item.dataset.x === x) {
                    arrX.push(itemSymbol);
                    arrY.push(itemSymbol);
                    if (solidWord(arrX) && solidWord(arrY)) {
                        if (item.hasChildNodes()) {
                            points += parseInt(itemIndex);
                            addingWordIndicator(itemLetter);
                        }
                    } else {
                        wordIndicator.remove();
                    }
                } else if (item.dataset.y === y) {
                    arrX.push(itemSymbol);
                    if (solidWord(arrX)) {
                        if (item.hasChildNodes()) {
                            points += parseInt(itemIndex);
                            addingWordIndicator(itemLetter);
                        }
                    } else {
                        wordIndicator.remove();
                    }
                } else if (item.dataset.x === x) {
                    arrY.push(itemSymbol);
                    if (solidWord(arrY)) {
                        if (item.hasChildNodes()) {
                            points += parseInt(itemIndex);
                            addingWordIndicator(itemLetter);
                        }
                    } else {
                        wordIndicator.remove();
                    }
                }
            });
        } else { // letter was in put in player's slot
            boxCells.forEach((item) => {
                let itemSymbol,
                    itemLetter,
                    itemIndex;

                if (item.hasChildNodes()) {
                    itemLetter = item.childNodes[0],
                        itemSymbol = item.childNodes[0].childNodes[1].textContent.toLowerCase(),
                        itemIndex = item.childNodes[0].childNodes[3].textContent;
                } else {
                    itemSymbol = ' ';
                }

                if (twoLinesCheckArr[1] === true) { // horizontal word
                    let horizontalWord = twoLinesCheckArr[3];
                    if (item.dataset.y === horizontalWord[0]) {
                        arrX.push(itemSymbol);
                        if (solidWord(arrX)) {
                            if (item.hasChildNodes()) {
                                points += parseInt(itemIndex);
                                addingWordIndicator(itemLetter);
                            }
                        } else {
                            points -= parseInt(itemIndex);
                            wordIndicator.remove();
                        }
                    }
                } else if (twoLinesCheckArr[2] === true) { // vertical word
                    let verticalWord = twoLinesCheckArr[4];
                    if (item.dataset.x === verticalWord[0]) {
                        arrY.push(itemSymbol);
                        if (solidWord(arrY)) {
                            if (item.hasChildNodes()) {
                                points += parseInt(itemIndex);
                                addingWordIndicator(itemLetter);
                            }

                        } else {
                            points -= parseInt(itemIndex);
                            wordIndicator.remove();
                        }
                    }
                }
            });
        };

    } else { // two-line word
        wordIndicator.remove();
    }

    if (twoLinesCheckArr[0] !== 0 && center.hasChildNodes()) { // one-line word and center element
        defOutput(); // alerting definition
    }
};

const submitingWord = () => {

};

startingTiles();

// dragDrop

const dragStart = function (letter) {
    setTimeout(() => {
        letter.classList.add('hide');
    }, 0);
};

const dragEnd = function (letter) {
    setTimeout(() => {
        letter.classList.remove('hide');
    }, 0);
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
            wordIndicator.remove();
        } else {
            cell.classList.remove('hovered');
            return;
        }
        checkWord(letter.parentNode);
    }
};

let letters = document.querySelectorAll('.available-letters .letter'),
    slots = document.querySelectorAll('.slot');

submitButton.addEventListener('click', () => {
    let slots = document.querySelectorAll('.slot'),
        lettersArr = [];

    slots.forEach((slot) => {
        if (slot.hasChildNodes()) {
            lettersArr.push(slot.childNodes[0].childNodes[1].textContent);
        } else {
            lettersArr.push('');
        }
    });
    submitingWord();
    addingTilesIntoArr(lettersArr);
});

let letterUsed;

(() => setInterval(() => {
    letters = document.querySelectorAll('.letter'),
        slots = document.querySelectorAll('.slot');

    letters.forEach(letter => {
        letter.addEventListener('dragstart', () => {
            letterUsed = letter;
            dragStart(letter);
        });
        letter.addEventListener('dragend', () => {
            dragEnd(letter);
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
}, 0))();

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

bagTitle.addEventListener('click', () => {
    bagModal.classList.remove('hide');
});

bagClose.addEventListener('click', () => {
    bagModal.classList.add('hide');
});