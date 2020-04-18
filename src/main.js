import {dictionary} from './dictionary.js';

const box = document.querySelector('.box'),
tripleWord = [0, 7, 14, 105, 119, 210, 224],
doubleLetter = [3, 11, 36, 38, 45, 52, 59, 92, 96, 98, 102, 108, 116, 122, 126, 128, 132, 165, 172, 179, 186, 188, 213, 221],
doubleWord = [16, 28, 32, 42, 48, 56, 64, 70, 154, 160, 168, 176, 182, 192, 196, 208],
tripleLetter = [20, 24, 76, 80, 84, 88, 136, 140, 144, 148, 200, 204];

for (let i = 0; i < 225; i++) {
    const boxCell = document.createElement('div');
    boxCell.classList.add('box-cell');
    boxCell.dataset.pos = i + 1;
    if (i === 112) {
        boxCell.innerHTML = 'CTR';
    }
    box.append(boxCell);
}

const boxCells = document.querySelectorAll('.box-cell');

tripleWord.forEach((key) => {
    boxCells[key].innerHTML = 'TW';
    boxCells[key].style.background = 'red';
});
doubleLetter.forEach((key) => {
    boxCells[key].innerHTML = 'DL';
    boxCells[key].style.background = '#00FFFF';
});
doubleWord.forEach((key) => {
    boxCells[key].innerHTML = 'DW';
    boxCells[key].style.background = '#D2691E';
});
tripleLetter.forEach((key) => {
    boxCells[key].innerHTML = 'TL';
    boxCells[key].style.background = '#0000FF';
});