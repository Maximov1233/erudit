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

let slotsLetters;

const availableLetters = document.querySelector('.available-letters'),
    boxCells = document.querySelectorAll('.box-cell'),
    bagItems = document.querySelector('.bag-items'),
    bagTitle = document.querySelector('.bag-title'),
    bagModal = document.querySelector('.bag-modal__bg'),
    submitButton = document.querySelector('.submit-button'),
    bagClose = document.querySelector('.bag-close'),
    center = boxCells[112];
center.classList.add('star');

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
                // console.log(tilesInBag[i].parentNode.childNodes[3].textContent);
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
    let slots = document.querySelectorAll('.slot'),
    letters = document.querySelector('.slot .letter');
    console.log(arr);
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
        console.log(slots);

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
    slots = document.querySelectorAll('.slot'),
    letters = document.querySelectorAll('.slot .letter');
    slotsLetters = [slots, letters];
    console.log(slotsLetters);
    return slotsLetters;
};

const addingTilesIntoArr = (arr, isStart) => {
    let emptyChecker = arr.every((elem) => {
        return elem !== '';
    });
    if (isStart === true) {
        while (arr.length !== 7) {
            const symbol = randomProperty(alphabet).symbol;
            if (tilesBagChecker(symbol) === true) {
                // console.log(symbol);
                // console.log(tilesBagChecker(symbol));
                arr.push(symbol);
            }
        }
        arr = shuffle(arr);
    } else {
        while (emptyChecker === false) {
            emptyChecker = arr.every((elem) => {
                return elem !== '';
            });
            console.log(emptyChecker);
            for (let i = 0; i < arr.length; i++) {
                if (arr[i] === '') {
                    const symbol = randomProperty(alphabet).symbol;
                    if (tilesBagChecker(symbol) === true) {
                        arr.splice(i, 1, symbol);
                        console.log(arr);
                    }
                }
            }
        }
    }
    console.log(arr);
    let slotsLetters = appendingTiles(arr);
    return slotsLetters;
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
                definition = key + '- ' + dictionary[key].definition;
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

            if (twoLinesCheckArr[0] !== 0 && center.hasChildNodes()) {
                defOutput();
            }
        } else {
            tilesInGame.forEach((tile) => {
                if (twoLinesCheckArr[1] === true) {
                    if (tile.dataset.y === twoLinesCheckArr[4[0]]) {
                        arrX.push(tile.childNodes[1].textContent.toLowerCase());
                    }
                } else if (twoLinesCheckArr[2] === true) {
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

// dragDrop

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

let letters = document.querySelectorAll('.available-letters .letter'),
    slots = document.querySelectorAll('.slot');

submitButton.addEventListener('click', () => {
    let slots = document.querySelectorAll('.slot'),
        lettersArr = [];

    slots.forEach((slot) => {
        // console.log(slot.hasChildNodes());
        if (slot.hasChildNodes()) {
            lettersArr.push(slot.childNodes[0].childNodes[1].textContent);
        } else {
            lettersArr.push('');
        }
    });
    console.log(lettersArr);
    addingTilesIntoArr(lettersArr);
});

let letterUsed;

(() => setInterval(() => {
    letters = document.querySelectorAll('.slot .letter'),
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