"use strict";
export default class View {
    static colors = {//каждому числу соответствует свой цвет
        '1': 'cyan',
        '2': '#6b81ff',
        '3': '#ffba52',
        '4': '#ffff7d',
        '5': '#82ffa8',
        '6': '#b56bff',
        '7': '#ff4d4d'
    };

    constructor(element, width, height, rows, columns) {
        this.element = element;
        this.width = width;
        this.height = height;

        //создаем холст
        this.canvas = document.createElement('canvas');
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.context = this.canvas.getContext('2d');

      
        this.playfieldBorderWidth = 2;//рамка игрового поля
        this.playfieldX = this.playfieldBorderWidth;//начало игрового поля
        this.playfieldY = this.playfieldBorderWidth;
        this.playfieldWidth = this.width * 2 / 3;//ширина игрового поля
        this.playfieldHeight = this.height;//высота игрового поля
        this.playfieldInnerWidth = this.playfieldWidth - this.playfieldBorderWidth * 2;
        this.playfieldInnerHeight = this.playfieldHeight - this.playfieldBorderWidth * 2;

        //вычисляем ширину и высоту блока
        this.blockWidth = this.playfieldInnerWidth / columns; //ширина = ширна объекта / на количество столбцов
        this.blockHeight = this.playfieldInnerHeight / rows; //высота = высота объекта / на количество строк

        //свойства боковой панели
        this.panelX = this.playfieldWidth + 10;//запасной отступ
        this.panelY = 0;
        this.panelWidth = this.width / 3;//ширина боковой панели
        this.panelHeight = this.height;//высота боковой панели

        this.element.appendChild(this.canvas);
    }

    //рисуем игровое поле
    renderMainScreen(state) {
        //вызываем метод для очистки холста
        this.clearScreen();
        this.renderPlayfield(state);
        this.renderPanel(state);
    }

    //добавляем окно старта
    renderStartScreen() {
        this.context.fillStyle = 'white';
        this.context.font = '18px "Press Start 2P"';
        this.context.textAlign = 'center';
        this.context.textBaseline = 'middle';
        this.context.fillText('Press ENTER to Start', this.width / 2, this.height / 2);
    }

    //окно паузы
    renderPauseScreen() {
        this.context.fillStyle = 'rgba(8, 0, 39,0.3)';
        this.context.fillRect(0, 0, this.width, this.height);

        this.context.fillStyle = 'white';
        this.context.font = '18px "Press Start 2P"';
        this.context.textAlign = 'center';
        this.context.textBaseline = 'middle';
        this.context.fillText('Press ENTER to Resume', this.width / 2, this.height / 2);
    }

    //окно game over
    renderEndScreen({ score }) {
        this.clearScreen();

        this.context.fillStyle = 'white';
        this.context.font = '18px "Press Start 2P"';
        this.context.textAlign = 'center';
        this.context.textBaseline = 'middle';
        this.context.fillText('GAME OVER', this.width / 2, this.height / 2 - 48);
        this.context.fillText(`Score: ${score}`, this.width / 2, this.height / 2);
        this.context.fillText('Press ENTER to Restart', this.width / 2, this.height / 2 + 48);
    }

    clearScreen() {
        //очищаем холст
        this.context.clearRect(0, 0, this.width, this.height);
    }

    renderPlayfield({ playfield }) {
        //перебираем массив playfield и на каждый элемент, который не является пустым рисуем
        for (let y = 0; y < playfield.length; y++) {
            for (let x = 0; x < playfield[y].length; x++) {
                const block = playfield[y][x];

                //проверяем пустая ли ячейка
                //если ячейка не пустая, то рисуем блок
                if (block) {
                    this.renderBlock(
                        this.playfieldX - 1 + (x * this.blockWidth), 
                        this.playfieldY - 1 + (y * this.blockHeight), 
                        this.blockWidth, 
                        this.blockHeight, 
                        View.colors[block]
                    );
                }
            }
        }

        this.context.strokeStyle = 'white';
        this.context.lineWidth = this.playfieldBorderWidth;
        this.context.strokeRect(0, 0, this.playfieldInnerWidth, this.playfieldInnerHeight);
    }

    //боковая панель
    renderPanel({ level, score, lines, nextPiece }) {
        this.context.textAlign = 'start';
        this.context.textBaseline = 'top';
        this.context.fillStyle = 'white';
        this.context.font = '14px "Press Start 2P"';

        this.context.fillText(`Score: ${score}`, this.panelX, this.panelY + 0);
        this.context.fillText(`Lines: ${lines}`, this.panelX, this.panelY + 24);
        this.context.fillText(`Level: ${level}`, this.panelX, this.panelY + 48);
        this.context.fillText('Next:', this.panelX, this.panelY + 96);

        for (let y = 0; y < nextPiece.blocks.length; y++) {
            for (let x = 0; x < nextPiece.blocks[y].length; x++) {
                const block = nextPiece.blocks[y][x];

                if (block) {
                    this.renderBlock(
                        this.panelX + (x * this.blockWidth * 0.6),
                        this.panelY + 100 + (y * this.blockHeight * 0.6),
                        this.blockWidth * 0.6,
                        this.blockHeight * 0.6,
                        View.colors[block]
                    );
                }
            }
        }
    }

    renderBlock(x, y, width, height, color) {
        this.context.fillStyle = color; //цвет заливки
        this.context.strokeStyle = 'black'; //цвет линий
        this.context.lineWidth = 1; //ширина линий

        this.context.fillRect(x, y, width, height); //рисуем квадрат
        this.context.strokeRect(x, y, width, height); //обводка
    }

}

