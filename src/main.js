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
        console.log("item: " + item);
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

const checkWord = (cell) => {
    let x = cell.dataset.x,
    y = cell.dataset.y,
    definition,
    checker = 0,
    arrX = [];
    const tilesInGame = document.querySelectorAll('.box .letter');

    if (tilesInGame.length === 1) {
        if (!center.hasChildNodes()) {
            console.log('wrong');
        }
    }

    tilesInGame.forEach((tile) => {
        if (tile.parentNode.dataset.y === y) {
            arrX.push(tile.children[0].textContent);
            console.log(arrX);
        }    
    });
    
    arrX = arrX.join('').toLowerCase();

    for (let key in dictionary) {
        if (key === arrX) {
            checker++;
            definition = dictionary[key].definition;
            const hint = document.querySelector('.hints');
            hint.style.color = 'green';
            setTimeout(() => {
                hint.style.color = '';
            }, 200);
        }
    }
    
    console.log(checker);
};

// submitButton.addEventListener('click', checkWord);

startingTiles();

// const checkArr = [];

// console.log(firstLetters[getRandomIntInclusive(0, firstLetters.length - 1)]);

// const isWord = (arr) => {
//     let checker = 0;
//     arr.forEach((subArr) => {
//             subArr.join('');
//             for (let key in dictionary) {
//                 if (key === subArr) {
//                     console.log(dictionary[key]);
//                     checker++;
//                 }
//             } 
//     });
//     return checker;
// };

// const preventNoFirstMove = (arr) => {
//     const checkWord = isWord(arr);
//     return checkWord;
// };

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
    if (!cell.hasChildNodes()) {
        cell.append(letter);
        console.log(letter);
        cell.classList.remove('hovered');
    } else {
        cell.classList.remove('hovered');
        return;
    }
    checkWord(cell);
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