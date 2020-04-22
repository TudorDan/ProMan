url_api = 'http://127.0.0.1:5000/api/';
url_boards = url_api + "get-boards";
url_cards = url_api + "get-cards/";


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
        });

}







// function showCards(cards) {
//     let collapse = document.createElement('div');
//     collapse.setAttribute("class", "collapse")
//     collapse.setAttribute("id", "collapse")
//     let table = document.createElement('table')
//     let tableHeader = document.createElement('thead')
//     let tableHeadRow = document.createElement('tr')
//     let ths = `<th>New</th>
//                 <th>In Progress</th>
//                 <th>Testing</th>
//                 <th>Done</th>`
//     tableHeadRow.innerHTML = ths
//     tableHeader.appendChild(tableHeadRow)
//     table.appendChild(tableHeader)
//     for (let card of cards){
//         let tbody = `<tbody>
//                        <tr>
//                        <td>${card.card_title}</td>
//                         </tr>
//                     </tbody>`
//         table.innerHTML +=tbody
//     }
//     collapse.appendChild(table)
//
// }


function showBoards(boards) {
    for (board of boards) {
        boards_container = document.getElementById('boards-container');
        card_template = `<div class="card mb-2">
        <div class="card-body" >
        <h5 class="card-title" id="board-title-` + board.id + `" contenteditable="true" onfocusout="updateBoardTitle(` + board.id + `)">` + board.title + `</h5>
        <a href="#collapseExample`+ board.id + `" role="button" aria-expanded="false" aria-controls="collapseExample`+ board.id + `"
         class="showcards" data-toggle="collapse" onClick="getCardsForBoard(` + board.id + `)">▼</a>
        </div>
        <div class="collapse" id="collapseExample`+ board.id + `">
         <div class="card card-body mb-5" >
            <table class="table table-bordered">
            <thead>
            <tr>
            <th scope="col" style="width: 25%">New</th>
            <th scope="col" style="width: 25%">In Progress</th>
            <th scope="col" style="width: 25%">Testing</th>
            <th scope="col" style="width: 25%">Done</th>
            </tr>
            </thead>
            </table>
        </div>
        </div>
        </div>`
        boards_container.innerHTML += card_template;
    }
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