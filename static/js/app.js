url_api = 'http://127.0.0.1:5000/api/';
url_boards = url_api + "get-boards";
url_cards = url_api + "get-cards/";
url_statuses = url_api + '/get-statuses';

document.addEventListener("DOMContentLoaded",createBoards)

function createBoards() {
    let button = document.querySelector('#sendBoardTitle');
    button.addEventListener('click', (e) => {
        let title = document.querySelector('#title').value;
        let titleDict = { 'title': title }
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
            showCards(jsonResponse)
        });

}

function showCards(cards) {
    for (let card of cards) {
        let table_header = document.querySelector('.tableHeadrow-' + card.board_id);
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

function showBoards(boards) {
    for (board of boards) {
        boards_container = document.getElementById('boards-container');
        card_template = `<div class="card mb-2">
        <div class="card-body" >
        <h5 class="card-title" id="board-title-` + board.id + `" contenteditable="true" onfocusout="updateBoardTitle(` + board.id + `)">` + board.title + `</h5>
        <a href="#collapseExample`+ board.id + `" role="button" aria-expanded="false" aria-controls="collapseExample`+ board.id + `"
         class="showcards" data-toggle="collapse" onClick="getCardsForBoard(` + board.id + `) ">▼</a>
        </div>
        <div class="collapse" id="collapseExample`+ board.id + `">
        <button type="button" id="addColumn" class="btn btn-success btn-sm ml-5 float-left" data-toggle="modal"
            data-target="#statusModal" onclick="newColumn(${board.id})">Add Column</button><br><br>
         <div class="card card-body mb-5" >
            <table class="table-${board.id} table-bordered">
            <thead> 
            <tr class="tableHeadrow-${board.id}">
            </tr>
            <tbody class="tablebody-${board.id}" >
            
            </tbody>
            </tr>
            </thead>
            </table>
        </div>
        </div>
        </div>`
        boards_container.innerHTML += card_template;
        getStatuses(board.id)
    }
}

function newColumn (boardid) {
    // let tablehead = document.querySelector(".tableHeadrow-" + boardid)
    // console.log(tablehead)
    // let th = `<th class="col" contenteditable="true" style="width: 25%"> New Column</th>`
    // tablehead.innerHTML += th;

    let button = document.querySelector('#sendStatusTitle');
    button.addEventListener('click', (e) => {
        let title = document.querySelector('#StatusTitle').value;
        console.log(title)
        let titleDict = { 'title': title,
                          'board_id' :boardid}
        sendStatus(titleDict);
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

function getStatuses (boardid){
    fetch(url_statuses)
        .then((serverResponse) => {
            return serverResponse.json();
        })
        .then((jsonResponse) => {
            console.log(jsonResponse);
            makeTableHeaders(jsonResponse,boardid)
        });
}

function makeTableHeaders (statuses,boardid){
    let table = document.querySelector(".tableHeadrow-" + boardid)
    for (let status of statuses) {
        let th = '';
        if (status.board_id === boardid) {
            th += `<th class="col" contenteditable="true" style="width: 25%"> ${status.title} </th>`
            table.innerHTML += th;
        } else {
            th = ""
        }
    }
}


getBoards();