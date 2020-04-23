url_api = 'http://127.0.0.1:5000/api/';
url_boards = url_api + "get-boards";
url_cards = url_api + "get-cards/";
url_statuses = url_api + '/get-statuses';


document.addEventListener("DOMContentLoaded", createBoards);

function getStatuses(boardId) {
    fetch(url_statuses)
        .then((serverResponse) => {
            return serverResponse.json();
        })
        .then((jsonResponse) => {
            console.log(jsonResponse)
            makeTableHeaders(jsonResponse, boardId);
        });
}

function makeTableHeaders (statuses, boardid){
    let table = document.querySelector(".tableHead-" + boardid)
    for (let status of statuses) {
        let th = '';
        if (status.board_id === boardid) {
            th += `<th scope="col" id="status-title-` + status.id + `" contenteditable="true" 
            onfocusout="updateStatusTitle(${status.id})"> ${status.title} </th>`;
            table.innerHTML += th;
        } else {
            th = ""
        }
    }
}

function createBoards() {
    let button = document.querySelector('#sendBoardTitle');
    button.addEventListener('click', (e) => {
        let title = document.querySelector('#title').value;
        let titleDict = {'title': title}
        sendBoard(titleDict);
    });
}

const sendBoard = async (data) => {
    const location = window.location + 'api/create-board'
    const setting =
        {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }
    const response = await fetch(location, setting)
    if (!response.ok) throw Error(response.message);
}

function getBoards() {
    fetch(url_boards)
        .then((serverResponse) => {
            return serverResponse.json();
        })
        .then((jsonResponse) => {
            console.log(jsonResponse);
            showBoards(jsonResponse);
        });
}

function getCardsForBoard(id) {
    //fetch
    fetch(url_cards + id)
        .then((serverResponse) => {
            return serverResponse.json();
        })
        .then((jsonResponse) => {
            console.table(jsonResponse);
            showCards(jsonResponse);
        });

}

function showCards(cards) {
    for (let card of cards) {
        let table_header = document.querySelector('.tableHead-' + card.board_id);
        let len = table_header.children.length;
        let card_container = document.querySelector('.tablebody-' + card.board_id);
        card_container.innerHTML = '';
        let tr = '';
        for (let i = 1; i <= len; i++) {
            if (parseInt(card.status_id) === i) {
                tr += `<td>${card.card_title}</td>`;
            } else {
                tr += `<td></td>`;
            }
        }
        let card_template = `
        <tr>
            ${tr}
        </tr>
        `;
        card_container.innerHTML += card_template;
    }
}

function addCardsToColumn(container) {
    const cardElement = createCard(
        'New',
        'Task 1');
    document.querySelector(`#${container}`).appendChild(cardElement);
}

const createCard = function (title, text) {
    const container = document.createElement('div');
    container.classList.add('card');

    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body');

    const cardTitle = document.createElement('h5');
    cardTitle.classList.add('card-title');
    cardTitle.textContent = title;
    cardBody.appendChild(cardTitle);

    const cardText = document.createElement('p');
    cardText.classList.add('card-text');
    cardText.textContent = text;
    cardBody.appendChild(cardText);

    container.appendChild(cardBody);

    return container;
};

function showBoards(boards) {
    for (board of boards) {
        boards_container = document.getElementById('boards-container');
        card_template = `
        <div class="card mb-2">
            <div class="card-body" >
                <h5 class="card-title" id="board-title-` + board.id + `" contenteditable="true" 
                onfocusout="updateBoardTitle(` + board.id + `)">` + board.title + `</h5>
                
                <a href="#collapseExample` + board.id + `" role="button" aria-expanded="false" 
                aria-controls="collapseExample` + board.id + `"
                 class="showcards" data-toggle="collapse" onClick="getCardsForBoard(` + board.id + `) ">▼</a>
            </div>
            
            <div class="collapse" id="collapseExample` + board.id + `">
                <button type="button" class="btn btn-success btn-sm ml-5 float-left" data-toggle="modal" 
                data-target="#statusModal" onclick="newColumn(${board.id})">Add Column</button><br><br>
                
                 <div class="card card-body mb-5" >
                    <button type="button" class="btn btn-outline-success taskButton">Add Card</button>
                    <table class="table table-bordered table-dark">
                        <thead >
                            <tr class="tableHead-${board.id}">
                                
                            </tr>
                        </thead>
                        <tbody class="tablebody-${board.id}"></tbody>
                    </table>
                </div>
            </div>
        </div>`
        boards_container.innerHTML += card_template;
        getStatuses(board.id);
    }
}

function newColumn(boardid) {
    let button = document.querySelector('#sendStatusTitle');
    button.addEventListener('click', (e) => {
        let title = document.querySelector('#statusTitle').value;
        let titleDict = {'title': title, 'board_id': boardid};
        sendStatus(titleDict);

        let tablehead = document.querySelector(".tableHead-" + boardid);
        console.log(tablehead);
        let th = `<th class="col" contenteditable="true">${title}</th>`;
        tablehead.innerHTML += th;
    });
}

const sendStatus = async (data) => {
    const location = window.location + 'api/create-status'
    const setting =
        {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }
    const response = await fetch(location, setting)
    if (!response.ok) throw Error(response.message);

}

function updateStatusTitle(statusId) {
    elementToSelect = "status-title-" + statusId;
    titleValue = document.getElementById(elementToSelect);
    console.log(titleValue);
    data = {
        'id': statusId,
        'title': titleValue.innerText,
    }

    settings = {
        'method': 'POST',
        'headers': {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(data),
    }

    fetch('/api/update-status', settings)
        .then((serverResponse) => {
            return serverResponse.json();
        })
        .then((jsonResponse) => {
            console.log(jsonResponse);
        })
}

function updateBoardTitle(boardId) {
    elementToSelect = "board-title-" + boardId;
    titleValue = document.getElementById(elementToSelect);

    data = {
        'id': boardId,
        'title': titleValue.innerText,
    }

    settings = {
        'method': 'POST',
        'headers': {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(data),
    }

    fetch('/api/update-board', settings)
        .then((serverResponse) => {
            return serverResponse.json();
        })
        .then((jsonResponse) => {
            console.log(jsonResponse);
        })
}


getBoards();