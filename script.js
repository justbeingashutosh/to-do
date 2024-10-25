// function updateDone(){
//     let doneCount = doneTab.children.length;
//     if (doneCount >= 0){
//         let doneCounter = document.createElement('div')
//         doneCounter.className = "doneCounter"
//         doneCounter.textContent = `Done ${doneCount}`
//     } 

// }


function openTodo(){
    todoTab.style.visibility = 'visible'
    doneTab.style.visibility = 'hidden'
    todo.style.border = 'solid white 3px'
    done.style.border = 'none'
}
function openDone(){
    done.style.border = 'solid white 3px'
    todo.style.border = 'none'
    todoTab.style.visibility = 'hidden'
    doneTab.style.visibility = 'visible'
}
function createtask(){
    taskWin.style.visibility = 'visible'
}
function savetask(){
    taskWin.style.visibility = 'hidden'
    task = taskInput.value.toString()

    let newTask = document.createElement('div')
    let taskContent = document.createElement('div')
    taskContent.className = 'taskcontent'
    newTask.className = "task"
    taskContent.textContent = task
    todoTab.appendChild(newTask)

    let doneButton = document.createElement('button');
    doneButton.textContent = "Done";
    doneButton.className = "done-btn";
    newTask.appendChild(taskContent)
    newTask.appendChild(doneButton)

    
    doneButton.addEventListener('click', ()=>{
        doneTab.prepend(newTask)
        doneButton.remove()
        let undo = document.createElement('button');
        undo.textContent = 'Undo';
        undo.className = 'undo';
        newTask.appendChild(undo)
        undo.addEventListener('click', ()=>{
            todoTab.appendChild(newTask)
            undo.remove()
            newTask.appendChild(doneButton)
        })
        updateDone()
    })
    console.log(task)//for debugging
}
function canceltask(){
    taskWin.style.visibility = 'hidden'
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
