"use strict";

import Game from './src/game.js';
import View from './src/view.js';
import Controller from './src/controller.js';

const tetris = document.querySelector('#tetris');

const game = new Game();
const view = new View(tetris, 480, 640, 20, 10);
const controller = new Controller(game, view);

window.game = game;//добавляем свойство game, для того что бы получить доступ к объекту game
window.view = view;
window.controller = controller;

