const KEY = "todoList"
let todoArr = [];
let todoListSection = document.querySelector("section")

main();

function main() {
    //localStorage.clear();

    showLocalFiles();
    let addBtn = document.querySelector("form button");

    addBtn.addEventListener("click", e => {
        e.preventDefault();

        if (addBtn.parentElement.children[0].value === "") {
            alert("please input some text")
            return;
        }

        if (addBtn.parentElement.children[1].value === "") {
            alert("Please input date")
            return;
        }

        let date = addBtn.parentElement.children[1].value;
        let text = addBtn.parentElement.children[0].value;

        for (let i = 0; i < todoArr.length; i++) {
            if (todoArr[i].date === date && todoArr[i].text === text) {
                alert("This todo event already exist");
                return;
            }
        }

        let newEvent = new TodoEvent(text, date);
        add(newEvent);

        let div = createEventInSection(newEvent);
        setCompleteAndDeleteBtn(div, newEvent);

        addBtn.parentElement.children[0].value = "";
        addBtn.parentElement.children[1].value = "";
    });

    sortEventsOrder();
}

function add(newEvent) {
    todoArr.push(newEvent);
    localStorage.setItem(KEY, JSON.stringify(todoArr));

    // printData("add");
}

function remove(event) {
    for (let i = 0; i < todoArr.length; i++) {
        if (todoArr[i].text == event.text && todoArr[i].date == event.date) {
            todoArr.splice(i, 1);
            localStorage.setItem(KEY, JSON.stringify(todoArr));
            return;
        }
    }
}

function updateStatus(event) {
    event.isFinished = !event.isFinished;
    localStorage.setItem(KEY, JSON.stringify(todoArr));
}

function sortEventsOrder() {
    let sortBtn = document.querySelector("div.sort");

    sortBtn.addEventListener("click", () => {
        clearAllEventsDiv();

        todoArr = _mergeSort(todoArr);

        // printData("sortEventsOrder");

        localStorage.setItem(KEY, JSON.stringify(todoArr));

        for (let i = 0; i < todoArr.length; i++) {
            let div = createEventInSection(todoArr[i]);
            if (todoArr[i].isFinished == true)
                div.classList.add("done");
            setCompleteAndDeleteBtn(div, todoArr[i]);
        }
    })
}

function showLocalFiles() {
    let local = JSON.parse(localStorage.getItem(KEY));

    if (local == null)
        return;

    todoArr = local;

    for (let i = 0; i < todoArr.length; i++) {
        let div = createEventInSection(todoArr[i]);
        if (todoArr[i].isFinished == true)
            div.classList.add("done");
        setCompleteAndDeleteBtn(div, todoArr[i]);
    }
}

function createEventInSection(event) {
    let todoEvent = document.createElement("div");
    todoEvent.classList.add("todo-event")

    let todoText = document.createElement("p");
    todoText.classList.add("todo-text");

    todoText.innerText = event.text;

    let todoDate = document.createElement("p");
    todoDate.classList.add("todo-time");
    todoDate.innerText = event.date;

    todoEvent.appendChild(todoText);
    todoEvent.appendChild(todoDate);

    todoListSection.appendChild(todoEvent);

    todoEvent.style.animation = "scaleUp 0.3s forwards";

    return todoEvent;
}

function setCompleteAndDeleteBtn(eventDiv, eventFile) {

    // set complete button

    // create btn
    let completeBtn = document.createElement("button");
    completeBtn.classList.add("complete");
    completeBtn.innerHTML = '<i class="fas fa-check"></i>'

    // set listener
    completeBtn.addEventListener("click", e => {
        eventDiv.classList.toggle("done")
        updateStatus(eventFile);
        // printData("setCompleteAndDeleteBtn");
    })
    eventDiv.appendChild(completeBtn);

    // set delete btn

    // create btn
    let deleteBtn = document.createElement("button");
    deleteBtn.classList.add("trash");
    deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';

    deleteBtn.addEventListener("click", e => {

        eventDiv.addEventListener("animationend", () => {
            eventDiv.remove();
            remove(eventFile);
            printData("setCompleteAndDeleteBtn");
        })

        eventDiv.style.animation = "scaleDown 0.3s forwards";
    })
    eventDiv.appendChild(deleteBtn);
}

function printData(from) {
    console.log("------------From " + from + " function------------")
    for (let i = 0; i < todoArr.length; i++) {
        console.log(todoArr[i].text, todoArr[i].date, todoArr[i].isFinished);
    }

    console.log(localStorage.getItem(KEY));
}

function clearAllEventsDiv() {
    let n = todoListSection.children.length;

    for (let i = 0; i < n; i++) {
        todoListSection.children[0].remove();
    }
}

function _mergeSort(arr) {
    if (arr.length <= 1)
        return arr;

    let half = arr.length / 2;

    let left = arr.splice(0, half);
    let right = arr;

    return _merge(_mergeSort(left), _mergeSort(right));
}

function _merge(left, right) {
    let sortedArr = [];

    while (left.length && right.length) {
        // insert the smallest element to the sortedArr
        if (compare(left[0], right[0]) == false) {
            sortedArr.push(left.shift());
        } else {
            sortedArr.push(right.shift());
        }
    }

    return [...sortedArr, ...left, ...right];
}

function compare(left, right) {
    if (parseInt(left.dateDetail[0]) > parseInt(right.dateDetail[0]))
        return true;

    if (parseInt(left.dateDetail[1]) > parseInt(right.dateDetail[1]))
        return true;

    if (parseInt(left.dateDetail[2]) > parseInt(right.dateDetail[2]))
        return true;

    return false;
}

class TodoEvent {
    constructor(text, date) {
        this.text = text;
        this.date = date;
        this.isFinished = false;
        this.dateDetail = date.split("-");
    }
}