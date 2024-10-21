function openTodo(){
    
}
function openDone(){

}
function createtask(){
    taskWin.style.visibility = 'visible'
}
function savetask(){
    taskWin.style.visibility = 'hidden'
    task = taskInput.value.toString()

    let newTask = document.createElement('div')
    newTask.className = "task"
    newTask.textContent = task
    todoTab.appendChild(newTask)

    let doneButton = document.createElement('button');
    doneButton.textContent = "Done";
    doneButton.className = "done-btn";
    newTask.appendChild(doneButton)

    
    doneButton.addEventListener('click', ()=>{
        doneTab.prepend(newTask)
    })
    console.log(task)//for debugging
}
function canceltask(){
    taskWin.style.visibility = 'hidden'
}

const doneTab = document.getElementById('done-tab')
const todoTab =document.getElementById('todo-tab')
const taskInput = document.getElementById('newtask')
const taskWin = document.getElementById('task-win')
document.getElementById('todo').addEventListener('click', openTodo);
document.getElementById('done').addEventListener('click', openDone);
document.getElementById('newbtn').addEventListener('click', createtask);
document.getElementById('save').addEventListener('click', savetask);
document.getElementById('cancel').addEventListener('click', canceltask);
