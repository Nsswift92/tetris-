"use strict";
export default class Game { //Экспортируем класс с игрой
    //количество удаленных линий соответствует количеству очков
    static points = {
        '1': 40,
        '2': 100,
        '3': 300,
        '4': 1200
    };

    constructor() {
        this.reset();
    }

    get level() {//значение  уровня 
        return Math.floor(this.lines * 0.1);
    }

    //метод для возвращения состояния поля
    getState() {
        const playfield = this.createPlayfield();
        //получаем доступ к ряду игрового поля
        const { y: pieceY, x: pieceX, blocks } = this.activePiece;

        for (let y = 0; y < this.playfield.length; y++) {
            playfield[y] = [];
            for (let x = 0; x < this.playfield[y].length; x++) {
                playfield[y][x] = this.playfield[y][x];
            }
        }

        for (let y = 0; y < blocks.length; y++) {
            for (let x = 0; x < blocks[y].length; x++) {
                if (blocks[y][x]) {
                    playfield[pieceY + y][pieceX + x] = blocks[y][x];
                }
            }
        }

        return {
            score: this.score,
            level: this.level,
            lines: this.lines,
            nextPiece: this.nextPiece,
            playfield,
            isGameOver: this.topOut
        };
    }

    reset() {
        this.score = 0; //значение по умолчанию количества очков
        this.lines = 0; //значение по умолчанию линии
        this.topOut = false;//значение по умолчанию когда мы дошли верха игрового поля

        //игровое поле представлено двухмерным массивом 
        this.playfield = this.createPlayfield();

        //создаем объект для хранения фигуры
        this.activePiece = this.createPiece();

        //создание фигуры
        this.nextPiece = this.createPiece();
    }

    createPlayfield() {
        const playfield = [];
        for (let y = 0; y < 20; y++) {
            playfield[y] = [];
            for (let x = 0; x < 10; x++) {
                playfield[y][x] = 0;
            }
        }

        return playfield;
    }

    //метод создает различные фигуры
    createPiece() {
        const index = Math.floor(Math.random() * 7); // 7 - количество фигур
        const type = 'IJLOSTZ'[index]; //представляем фигуры в виде строки(каждая буква это отдельная фигура)
        const piece = {  }; //начальные координаты фигуры

        switch(type) {
            case 'I':
                piece.blocks = [
                    [0,0,0,0],
                    [1,1,1,1],
                    [0,0,0,0],
                    [0,0,0,0]
                ];
                break;
            case 'J':
                piece.blocks = [
                    [0,0,0],
                    [2,2,2],
                    [0,0,2]
                ];
                break;
            case 'L':
                piece.blocks = [
                    [0,0,0],
                    [3,3,3],
                    [3,0,0]
                ];
                break;
            case 'O':
                piece.blocks = [
                    [0,0,0,0],
                    [0,4,4,0],
                    [0,4,4,0],
                    [0,0,0,0]
                ];
                break;
            case 'S':
                piece.blocks = [
                    [0,0,0],
                    [0,5,5],
                    [5,5,0]
                ];
                break;
            case 'T':
                piece.blocks = [
                    [0,0,0],
                    [6,6,6],
                    [0,6,0]
                ];
                break;
            case 'Z':
                piece.blocks = [
                    [0,0,0],
                    [7,7,0],
                    [0,7,7]
                ];
                break;
            default: 
                throw new Error('Неизвестный тип фигуры');
            
        }

        piece.x = Math.floor((10 - piece.blocks[0].length) / 2); //находим центр поля относительно центра фигуры
        piece.y = -1;//отступ сверху

        return piece;
    }

    //описываем методы движения фигур
    movePieceLeft() {
        this.activePiece.x -= 1; //Движение фигуры влево

        if (this.hasCollision()) { //проверяем вышла ли фигура за пределы поля
            this.activePiece.x += 1; //если вышла за пределы, то возвращаем ее обратно
        }
    }

    movePieceRight() {
        this.activePiece.x += 1; //Движение фигуры вправо

        if (this.hasCollision()) { //проверяем вышла ли фигура за пределы поля
            this.activePiece.x -= 1; //если вышла за пределы, то возвращаем ее обратно
        }
    }

    movePieceDown() {
        if (this.topOut) return;

        this.activePiece.y += 1; //Движение фигуры вниз

        if (this.hasCollision()) { //проверяем вышла ли фигура за пределы поля
            this.activePiece.y -= 1; //если вышла за пределы, то возвращаем ее обратно
            this.lockPiece();
            const clearedLines = this.clearLines();
            this.updateScore(clearedLines);
            this.updatePieces(); // обновляем значение свойств activePiece и nextPiece
        }

        if (this.hasCollision()) {
            this.topOut = true;
        }
    }

    rotatePiece() { //изменение значения свойства rotationIndex у объекта activePiece 0-1-2-3-0 
      this.rotateBlocks();

      if (this.hasCollision()) {
        this.rotateBlocks(false); //если произошло столкновение
      }
      
    }

    //поворот фигуры
    rotateBlocks(clockwise = true) {
        const blocks = this.activePiece.blocks;
        const length = blocks.length;
        const x = Math.floor(length / 2);
        const y = length -1;
  
        for (let i = 0; i < x; i++) {
            for (let j = i; j < y - i; j++) {
                const temp = blocks[i][j];

                if (clockwise) {
                    //поворот фигуры по часовой стрелке
                    blocks[i][j] = blocks[y - j][i];
                    blocks[y - j][i] = blocks[y - i][y - j];
                    blocks[y - i][y - j] = blocks[j][y - i];
                    blocks[j][y - i] = temp;
                } else { //поворот фигуры против часовой стрелки
                    blocks[i][j] = blocks[j][y -i];
                    blocks[j][y - i] = blocks[y - i][y - j];
                    blocks[y - i][y - j] = blocks[y - j][i];
                    blocks[y - j][i] = temp;
                }
                
            }
        }
    }

    //Описывем метод который не дает фигуре выйти за пределы поля
    hasCollision() {
        //получаем доступ к ряду игрового поля
        const { y: pieceY, x: pieceX, blocks } = this.activePiece;

        //цикл перебирает ряды
        for (let y = 0; y < blocks.length; y++) {
            //цикл перебирает элементы ряда
            for (let x = 0; x < blocks[y].length; x++) {
                if (
                    blocks[y][x] && //проверяем нижний ряд есть ли блок внутри фигуры
                    ((this.playfield[pieceY + y] === undefined || this.playfield[pieceY + y][pieceX + x] === undefined) ||//проверяем находится ли блок в пределах игрового поля
                    this.playfield[pieceY + y][pieceX + x]) //проверяем свободно ли место в игровом поле
                ) {
                    return true;
                }
            }
        }
        return false;
    }

    //перенос массива активной фигуры в игровое поле
    //перебираем массив фигуры, и в зависимости от значения х и у вставляем знаение из blocks в playField
    lockPiece() {
        const { y: pieceY, x: pieceX, blocks } = this.activePiece;

        //цикл перебирает ряды
        for (let y = 0; y < blocks.length; y++) {
            //цикл перебирает элементы ряда
            for (let x = 0; x < blocks[y].length; x++){
                if (blocks[y][x]){
                    //если ячейка не пустая, копируем значение из массива bocks в значение playField
                this.playfield[pieceY + y][pieceX + x] = blocks[y][x];
                }
            }
        }
    }

    //удаление нижнего ряда
    clearLines() {
        const rows = 20;//количество строк поля
        const columns = 10;//количество колонок поля
        let lines = [];

        //определяем занятые строки
        for (let y = rows - 1; y >= 0; y--) {
            let numberOfBlocks = 0;//количество блоков
            for (let x = 0; x < columns; x++) {
                if (this.playfield[y][x]) {
                    numberOfBlocks +=1;
                }
            }

            if (numberOfBlocks === 0) {
                break;
            } else if (numberOfBlocks < columns) {
                continue;
            } else if (numberOfBlocks === columns) {
                lines.unshift(y)
            }
        }

        //удаляем заполненную строку
        for (let index of lines) {
            this.playfield.splice(index, 1);//количество рядов, которые нужно удалить
            this.playfield.unshift(new Array(columns).fill(0));//добавляем новый ряд сверху
        }

        return lines.length;
    }

    //счет
    //метод принимает в качестве аргумента количество очищенных линий
    updateScore(clearedLines) {
        if (clearedLines > 0) {
            this.score += Game.points[clearedLines] * (this.level + 1);
            this.lines += clearedLines;
        }
    }

    updatePieces() {
        this.activePiece = this.nextPiece;
        this.nextPiece = this.createPiece();
    }

   

}


