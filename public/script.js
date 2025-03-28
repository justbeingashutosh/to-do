const doneCount = document.querySelector("#done-count")
const todoCount = document.querySelector("#todo-count")
const allSetLabel = document.querySelector("#all-set")
window.addEventListener('load', ()=>{
    doneCount.textContent = doneTab.childElementCount
    todoCount.textContent = todoTab.childElementCount-1
    if(todoTab.childElementCount == 1){
        allSetLabel.style.display = "block"
    }else{
        allSetLabel.style.display = "none"
    }
})

async function undoTask(id, e=event){
    let task = e.target.parentElement
    console.log(task)
    await axios.post(`/tasks/${id}/done`,{isDone: false})
    todoTab.appendChild(task)
    todoCount.textContent = parseInt(todoCount.textContent)+1
    doneCount.textContent = parseInt(doneCount.textContent)-1
    if(todoTab.childElementCount == 1){
        allSetLabel.style.display = "block"
    }else{
        allSetLabel.style.display = "none"
    }
    task.querySelector('.undo').remove()
    let doneButton = document.createElement('button');
    doneButton.textContent = "Done";
    doneButton.className = "done-btn";
    doneButton.addEventListener('click', function(event) {
        doneTask(id, event);
    })
    task.appendChild(doneButton)
    console.log(task)
}

async function doneTask(id, e=event){
    let task = e.target.parentElement
    await axios.post(`/tasks/${id}/done`,{isDone: true})
    doneTab.prepend(task)
    task.querySelector('.done-btn').remove()
    todoCount.textContent = parseInt(todoCount.textContent)-1
    doneCount.textContent = parseInt(doneCount.textContent)+1
    if(todoTab.childElementCount == 1){
        allSetLabel.style.display = "block"
    }else{
        allSetLabel.style.display = "none"
    }
    let undo = document.createElement('button');
    undo.textContent = 'Undo';
    undo.className = 'undo';
    task.appendChild(undo)
    undo.addEventListener('click', function(event) {
        undoTask(id, event);
    });
}

function openTodo(){
    todoTab.style.display = 'grid'
    doneTab.style.display = 'none'
    todo.style.border = 'solid white 3px'
    done.style.border = 'none'
}
function openDone(){
    done.style.border = 'solid white 3px'
    todo.style.border = 'none'
    todoTab.style.display = 'none'
    doneTab.style.display = 'grid'
}
function createtask(){
    taskWin.style.display = 'block'
}
async function savetask(){
    taskWin.style.display = 'none'
    task = taskInput.value.toString()

    let newTask = document.createElement('div')
    let taskContent = document.createElement('div')
    taskContent.className = 'taskcontent'
    newTask.className = "task"
    taskContent.textContent = task
    todoTab.appendChild(newTask)
    todoCount.textContent = parseInt(todoCount.textContent)+1
    if(todoTab.childElementCount == 1){
        allSetLabel.style.display = "block"
    }else{
        allSetLabel.style.display = "none"
    }
    let doneButton = document.createElement('button');
    doneButton.textContent = "Done";
    doneButton.className = "done-btn";
    newTask.appendChild(taskContent)
    newTask.appendChild(doneButton)
    let newId = await axios.post('/tasks',{task, isDone: false})
    
    doneButton.addEventListener('click', function(event) {
        doneTask(newId.data.id, event);
    });
    console.log(task)//for debugging
}
function canceltask(){
    taskWin.style.display = 'none'
}

const doneTab = document.getElementById('done-tab')
const todoTab =document.getElementById('todo-tab')
const done = document.getElementById('done')
const todo = document.getElementById('todo')
const taskInput = document.getElementById('newtask')
const taskWin = document.getElementById('task-win')
document.getElementById('todo').addEventListener('click', openTodo);
document.getElementById('done').addEventListener('click', openDone);
document.getElementById('newbtn').addEventListener('click', createtask);
document.getElementById('save').addEventListener('click', savetask);
document.getElementById('cancel').addEventListener('click', canceltask);
