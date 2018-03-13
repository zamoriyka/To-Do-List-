/**
 * Created by Ann on 2/27/2018.
 */
var addButton = document.getElementById('add');
var inputTask = document.getElementById('new-task');
var finishedTasks = document.getElementById('finished-tasks');
var unfinishedTasks = document.getElementById('unfinished-tasks');

function createNewElement(task, finish) {
    var listItem = document.createElement('li');
    var checkbox = document.createElement('button');
    checkbox.className = "material-icons checkbox";
    checkbox.innerHTML = "<i class='material-icons'>check_box_outline_blank</i>";
    if (finish) {
        checkbox.className = "material-icons checkbox";
        checkbox.innerHTML = "<i class='material-icons'>check_box</i>";
    } else {
        checkbox.className = "material-icons checkbox";
        checkbox.innerHTML = "<i class='material-icons'>check_box_outline_blank</i>";
    }

    var deleteButton = document.createElement('button');
    deleteButton.className = "material-icons delete";
    deleteButton.innerHTML = "<i class='material-icons'>delete</i>";

    var editButton = document.createElement('button');
    editButton.className = "material-icons edit";
    editButton.innerHTML =  "<i class='material-icons'>edit</i>";

    var input = document.createElement('input');
    input.type = "text";

    var label = document.createElement('label');
    label.innerHTML = task;

    listItem.appendChild(checkbox);
    listItem.appendChild(label);
    listItem.appendChild(input);
    listItem.appendChild(deleteButton);
    listItem.appendChild(editButton);

    return listItem;
}

function addTask() {
    if (inputTask.value) {
        var listItem = createNewElement(inputTask.value, false);
        unfinishedTasks.appendChild(listItem);
        bindEvents(listItem);
        inputTask.value = "";
        bindEvents(listItem, finishTasks);
        localStorageSave();
    }
}

addButton.onclick = addTask;

function deleteItem() {
    var listItem = this.parentNode;
    var ul = listItem.parentNode;
    ul.removeChild(listItem);
}

function editItem() {
    var editButton = this;
    var listItem = this.parentNode;
    var label = listItem.querySelector('label');
    var input = listItem.querySelector('[type="text"]');

    var contains = listItem.classList.contains('editMode');
    if (contains) {
        label.innerHTML = input.value;
        editButton.className = "material-icons edit";
        editButton.innerHTML =  "<i class='material-icons'>edit</i>";
        localStorageSave();
    } else {
        input.value = label.innerHTML;
        editButton.className = "material-icons save";
        editButton.innerHTML =  "<i class='material-icons'>save</i>";
    }

    listItem.classList.toggle('editMode');
}

function finishTasks() {
    var listItem = this.parentNode;
    var checkbox = listItem.querySelector('button.checkbox');
    checkbox.className = "material-icons checkbox";
    checkbox.innerHTML = "<i class='material-icons'>check_box</i>";
    finishedTasks.appendChild(listItem);
    bindEvents(listItem, unfinishedTask);
    localStorageSave();
}

function unfinishedTask() {
    var listItem = this.parentNode;
    var checkbox = listItem.querySelector('button.checkbox');
    checkbox.className = "material-icons checkbox";
    checkbox.innerHTML = "<i class='material-icons'>check_box_outline_blank</i>";
    unfinishedTasks.appendChild(listItem);
    bindEvents(listItem, finishTasks);
    localStorageSave();
}

function localStorageSave() {

    var unfinishedTasksArr = [];
    for (var i=0; i<unfinishedTasks.children.length; i++){
        unfinishedTasksArr.push(unfinishedTasks.children[i].getElementsByTagName('label')[0].innerText);
    }

    var finishedTasksArr = [];
    for (var i=0; i<finishedTasks.children.length; i++){
        finishedTasksArr.push(finishedTasks.children[i].getElementsByTagName('label')[0].innerText);
    }

    localStorage.removeItem('todo');
    localStorage.setItem('todo', JSON.stringify({
        unfinishedTasks: unfinishedTasksArr,
        finishedTasks: finishedTasksArr
    }));
}

function load() {
    return JSON.parse(localStorage.getItem('todo'));
}

var todoData = load();
for (var i=0; i<todoData.finishedTasks.length; i++){
    var listItem = createNewElement(todoData.finishedTasks[i], true);
    finishedTasks.appendChild(listItem);
    bindEvents(listItem, finishTasks);
}

for (var i=0; i<todoData.unfinishedTasks.length; i++) {
    var listItem = createNewElement(todoData.unfinishedTasks[i], false);
    unfinishedTasks.appendChild(listItem);
    bindEvents(listItem, unfinishedTask);
}

function bindEvents(listItem, checkEvents) {
    var deleteButton = listItem.querySelector('button.delete');
    var editButton = listItem.querySelector('button.edit');
    var checkbox = listItem.querySelector('button.checkbox');

    deleteButton.onclick = deleteItem;
    editButton.onclick = editItem;
    checkbox.onclick = checkEvents;
}
