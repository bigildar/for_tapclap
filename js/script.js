let main = document.querySelector('.main');
let bonus = document.querySelector('#shuffle');
let restart = document.querySelector('.restart');

const N = 8;       // размер поля
const M = 8;    //размер поля
const C = 4;   //количество цветов
const S = 3;    //количество доступных перемешиваний
const X = 10;  //количестов доступных ходов
const Y = 50;   //требуемое количество очков


let temp_S = S;
let temp_X = X;
let temp_Y = 0;
let flag_click = true;

const color = ['Black', 'Gray', 'Silver', 'White', 'Fuchsia', 'Purple', 'Red', 'Maroon', 'Yellow', 'Olive', 'Lime', 'Green', 'Aqua', 'Teal', 'Blue', 'Navy'];
let temp_color;


function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }

}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function draw() {
    let mainInnerHtml = '';
    for (let y = 0; y < N; y++) {
        for (let x = 0; x < M; x++) {
            mainInnerHtml += `<div class="cell"></div>`
        }
    }
    main.innerHTML = mainInnerHtml;

    let color_cel = document.querySelectorAll('.cell');
    let k = 0;

    for (let y = 0; y < N; y++) {
        for (let x = 0; x < M; x++) {
            color_cel[k].setAttribute('posx', x)
            color_cel[k].setAttribute('posy', y)
            color_cel[k].style.backgroundColor = temp_color[getRandomInt(C)];
            k++;
        }
    }
}

function draw_interface() {
    let bs = document.querySelectorAll('.shuffle_btn');
    let mov = document.querySelectorAll('.moves');
    let points = document.querySelectorAll('.points');

    if (temp_S >= 0) {
        bs[0].innerHTML = temp_S.toString();
        if (search_possibility() == false) {
            bs[0].style.backgroundColor = '#45ba3f';
        } else {
            bs[0].style.backgroundColor = 'rgb(48,0,78)';
        }
    }

    if (temp_X >= 0) {
        mov[0].innerHTML = temp_X.toString();
    }

    if (temp_Y < Y) {
        points[0].innerHTML = temp_Y.toString();
    } else {
        points[0].innerHTML = temp_Y.toString();
        endGame(true);
    }

}

function click(elem) {
    elem.classList.remove("cell")
    elem.classList.add("empty_cell");
    elem.style.backgroundColor = ' #0d233d'
}

function search(array) {
    let n = array.length;
    let el;

    for (el of array) {
        let xc = el.getAttribute('posx');
        let yc = el.getAttribute('posy');
        let color = el.style.backgroundColor;

        for (let x = 0; x < N; x++) {
            for (let y = 0; y < M; y++) {
                if ((x == xc && Math.abs(y - yc) == 1) || (y == yc && Math.abs(x - xc) == 1)) {
                    let tail = document.querySelector(`[posx = "${x}"][posy = "${y}"]`);
                    if (tail.style.backgroundColor == color && array.includes(tail) === false) {
                        array.push(tail);
                    }
                }
            }
        }
    }

    if (array.length > n) {
        search(array);
    } else if (array.length > 1) {
        array.forEach(element => click(element));
        temp_Y += array.length;
        temp_X--;
    }
}

function search_possibility() {
    for (let y = 0; y < N; y++) {
        for (let x = 0; x < M; x++) {
            let tail = document.querySelector(`[posx = "${x}"][posy = "${y}"]`);
            let near_tail = [
                document.querySelector(`[posx = "${x + 1}"][posy = "${y}"]`),
                document.querySelector(`[posx = "${x - 1}"][posy = "${y}"]`),
                document.querySelector(`[posx = "${x}"][posy = "${y + 1}"]`),
                document.querySelector(`[posx = "${x}"][posy = "${y - 1}"]`),
            ]

            for (nt of near_tail) {
                if (nt != null) {
                    if (tail.style.backgroundColor == nt.style.backgroundColor) {
                        return true;
                    }
                }
            }

        }
    }
    return false;
}

function move() {
    setTimeout(function () {
        for (let y = N - 2; y >= 0; y--) {
            for (let x = 0; x < M; x++) {
                let up_tail = document.querySelector(`[posx = "${x}"][posy = "${y}"]`);
                let down_tail = document.querySelector(`[posx = "${x}"][posy = "${y + 1}"]`);
                if (down_tail.classList.contains("empty_cell") && up_tail.classList.contains("cell")) {
                    let color = up_tail.style.backgroundColor;


                    down_tail.classList.remove("empty_cell");
                    down_tail.classList.add("cell");
                    down_tail.style.backgroundColor = color;

                    up_tail.classList.remove("cell");
                    up_tail.classList.add("empty_cell");
                    up_tail.style.backgroundColor = '#0d233d';
                }
            }
        }

        create();

        if (check_empty()) {
            move();
        } else {
            if (temp_X == 0) {
                endGame(false);
            }
            flag();
            draw_interface();
        }
    }, 100);

}

function create() {
    for (let x = 0; x < M; x++) {
        let up_tail = document.querySelector(`[posx = "${x}"][posy = "0"]`);
        if (up_tail.classList.contains("empty_cell")) {
            up_tail.classList.remove("empty_cell");
            up_tail.classList.add("cell");
            up_tail.style.backgroundColor = color[getRandomInt(C)]
        }
    }
}

function check_empty() {
    let k = false;
    for (let y = 0; y < N; y++) {
        for (let x = 0; x < M; x++) {
            let tail = document.querySelector(`[posx = "${x}"][posy = "${y}"]`);
            if (tail.classList.contains("empty_cell")) {
                k = true;
            }
        }
    }
    return k;
}

function flag() {
    if (flag_click) {
        flag_click = false;
    } else {
        flag_click = true;
    }

}

function shuffle_cell() {
    let array = []
    let old_tail = document.querySelectorAll('.cell');
    let new_tail = document.querySelectorAll('.cell');

    old_tail.forEach(element => array.push(element.style.backgroundColor));
    shuffle(array);

    for (let i = 0; i < array.length; i++) {
        new_tail[i].style.backgroundColor = array[i];
    }
}

function endGame(bool) {
    let game = document.querySelector('.game');
    let modal = document.querySelector('.modal');
    let result = document.querySelector('.result');
    let start = document.querySelector('.start');
    let restart = document.querySelector('.restart');

    start.innerHTML = 'Ваш результат:';
    restart.innerHTML = 'Сыграть еще!';

    game.style.opacity = '0.2';
    game.style.zIndex = '-1';

    modal.style.opacity = '1';
    modal.style.zIndex = '80';

    if (bool) {
        result.innerHTML = 'Вы победили!!!';
    } else {
        result.innerHTML = 'Вы проиграли!!!';
    }
    return;
}

function startGame() {
    let game = document.querySelector('.game');
    let modal = document.querySelector('.modal');
    let result = document.querySelector('.result');

    game.style.opacity = '1';
    game.style.zIndex = '80';

    modal.style.opacity = '0';
    modal.style.zIndex = '-1';

    shuffle(color);
    temp_color = color.slice(0, C);
    draw();
}


function Game() {
    shuffle(color);
    temp_color = color.slice(0, C);
    draw();
    //draw_interface()

    main.onclick = function (e) {
        if (e.target.classList.contains('cell') && flag_click == true) {
            flag();
            search([e.target]);
            move();

        }
    }
    bonus.onclick = function (e) {
        if (search_possibility() == false && temp_S >= 0) {
            temp_S--;
            shuffle_cell()
            draw_interface()
        }
    }
    restart.onclick = function (e) {
        temp_S = S;
        temp_X = X;
        temp_Y = 0;
        draw_interface();
        startGame();
    }

}

Game();







