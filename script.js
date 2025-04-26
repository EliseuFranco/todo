'use strict'

let tarefas = JSON.parse(localStorage.getItem('task')) || []
let id = tarefas.length > 0 ? tarefas[tarefas.length - 1].id : 0

const task = document.getElementById('task')
const btn_add = document.querySelector('.add')
const task_container = document.querySelector(".task-list")
const edit_container = document.querySelector(".edit_container")
let edit_task = document.getElementById("edit_task")
const btn_update = document.getElementById("atualizar")
let task_id_to_update;
const btn_dark = document.getElementById("moon")
const radio = document.querySelectorAll(".filter")
const mode = document.getElementById("mode")
let img;
const body = document.body
const alert_container = document.querySelector(".alert-container")
const alertBox = document.querySelector(".alert");
const btn_open_user_modal = document.querySelector(".open-user-modal")
const add_modal = document.querySelector(".user-container")
const user_entrance = document.querySelector(".task-content")
const btn_close_add = document.getElementById("close_add")
const task_description = document.querySelector("#description")
const task_description_edit = document.getElementById("task-description-edit")
const btn_delete_all = document.querySelector(".btn-all")



function closeAddModal(){
    add_modal.classList.remove("visible")
}


function showTask(task){

    const div = document.createElement('div')
    const div_info = document.createElement("div")
    const btn_delete = document.createElement("button")
    const btn_update = document.createElement("button")
    const div_actions = document.createElement("div")
    const checkbox = document.createElement("input")
    const p = document.createElement("p")
    const theme = localStorage.getItem("theme")
    const h2 = document.createElement("h2")
    const span = document.createElement("span")   

    checkbox.type = "checkbox"
    checkbox.setAttribute("class", "conclude")
    checkbox.setAttribute("id", `check${task.id}`)
    span.setAttribute("id", `d${task.id}`)
    span.setAttribute("class", "date")
    

    p.setAttribute("class", "paragrafo")
    p.setAttribute("id", `p${task.id}`)
    p.innerHTML = `${task.description}`
    h2.setAttribute("id", `t${task.id}`)
    h2.innerText = task.task
    span.innerText = task.date


    if (task.concluded){
        checkbox.checked = true
        p.classList.add("concluir")
        h2.classList.add("concluir")
    }

    div_info.setAttribute("class", "task-info")
    div_info.setAttribute("id", `${task.id}`)

    div.setAttribute('class', "task_content")
    div.setAttribute("id",  `c${task.id}`)
    div_actions.setAttribute("class", "actions")

    btn_update.innerHTML = "<img src='edit.svg' alt='edit-icon' class = 'action-icon'/> Update"
    btn_update.setAttribute("class", "update filho")
    btn_update.setAttribute("id", `update${task.id}`)

    btn_delete.innerHTML = "<img src='bin.svg' alt='bin-img' class='action-icon'/>Eliminar"
    btn_delete.setAttribute("class","eliminar")

    btn_delete.setAttribute("id", `id${task.id}`)
    div.appendChild(checkbox)
    div.appendChild(h2)
    div_info.appendChild(p)
    div_info.appendChild(btn_delete)
    div_info.appendChild(btn_update) 
    div.appendChild(div_info)
    div.appendChild(span)
    task_container.appendChild(div)
        
}

function renderAlltask(filter = false, filtradas){
    task_container.innerHTML = "";
    if(filter){
        filtradas.length !== 0 ?  filtradas.forEach(showTask) : task_container.innerHTML = "No task to show"
        return
    }
    tarefas.forEach(showTask)
}

function closeModal (){
    edit_container.classList.remove("visible")
}
function openModal (){
    edit_container.classList.add("visible")
}

function checkTaskValidate(){
    const date = new Date().toJSON().slice(0,10)
    let totalTask = 0;
    let message = ""
    tarefas.forEach(task => {
        if(task.date === date && !task.concluded){
            message += `A tarefa '${task.task}' vence hoje <br>`
            totalTask ++;
        }
    })


    if (totalTask > 0){
        alert_container.classList.add("visible")
        alertBox.innerHTML += `${message} ${totalTask} por vencer`

        setTimeout(()=>{
            alert_container.classList.remove("visible")
        }, 5000)
    } 
}
function saveTasks(){
    localStorage.setItem("task", JSON.stringify(tarefas))
}
// Carregar todos os alertas
checkTaskValidate()

// Carrega todas as tarefas no navegador
tarefas.forEach(showTask);

btn_add.addEventListener('click', ()=>{

    if (task.value && task_description.value){
        id ++;
        const new_task = {
            id: id,
            task: task.value,
            concluded: false,
            description: task_description.value,
            date: new Date().toJSON().slice(0,10)
        }
        tarefas.push(new_task)
        saveTasks()
        // localStorage.setItem("task", JSON.stringify(tarefas))
        showTask(new_task)
        task.value = ''
        task_description.value =''
        closeAddModal()
    }  else alert("Preencha todos os campos de entrada por favor!")
})

const infor = document.querySelectorAll(".task-info")

infor.forEach(info =>{
    info.addEventListener("click",(event)=>{
        if(event.target.classList.contains("eliminar")){
            const pai = event.target.parentElement
            console.log(pai)
        }
    })
})


task_container.addEventListener("click", (event)=>{
    
    if (event.target.classList.contains('eliminar')){
        
        const pai = event.target.closest(".task-info")
        const task_id_to_delete = parseInt(pai.id)

        tarefas.length === 1 ? tarefas = [] : tarefas = tarefas.filter((task) => task.id !== task_id_to_delete)
        localStorage.setItem('task', JSON.stringify(tarefas))
        const task_content = pai.parentElement
        task_content.remove()
    }

    if (event.target.classList.contains("update")){
        openModal()
        const pai = event.target.parentElement
        task_id_to_update = parseInt(pai.id)
        
        const task_to_edit = document.getElementById(`t${task_id_to_update}`).textContent
        const description_to_edit = document.getElementById(`p${task_id_to_update}`).textContent
        edit_task.value = task_to_edit
        task_description_edit.value = description_to_edit
    }

    if (event.target.classList.contains("conclude")){
        const pai = parseInt(event.target.parentElement.id[1])
        console.log(pai)
        const task_to_concludes = document.querySelector(`#p${pai}`)
        const task_title_to_concludes = document.querySelector(`#t${pai}`) 
        
        tarefas.forEach(task =>{
            if (task.id === pai){
                task.concluded ? task.concluded = false : task.concluded = true
                task_to_concludes.classList.toggle("concluir", task.concluded)
                task_title_to_concludes.classList.toggle("concluir", task.concluded)  
            }
            saveTasks()
            // localStorage.setItem("task", JSON.stringify(tarefas))
        })
    }
})
btn_update.addEventListener("click", ()=>{
            
            tarefas.forEach(tarefa =>{
                
                if (tarefa.id === task_id_to_update){
                    tarefa.task = edit_task.value
                    tarefa.description = task_description_edit.value
                }
            })
            // localStorage.setItem("task", JSON.stringify(tarefas))
            saveTasks()
            renderAlltask()
            closeModal()
            
        })

edit_container.addEventListener("click", (event)=>{
    if (event.target == edit_container){
        closeModal()
    }
})

document.querySelector(".close").addEventListener("click", closeModal)
btn_dark.addEventListener("click",()=>{
    img = body.classList.contains("dark-mode") ? "moon.svg" : "sun.svg"
    body.classList.toggle("dark-mode")
    btn_dark.src = img
    localStorage.setItem('theme', JSON.stringify(img))
})


radio.forEach(radio =>{
    radio.addEventListener("click",()=>{
        let filtradas = radio.id === 'concluded' ? tarefas.filter(task => task.concluded) : tarefas.filter(task => !task.concluded)
        if(radio.id === "all"){
            filtradas = tarefas
        }
        renderAlltask(true, filtradas)
    })
})

btn_open_user_modal.addEventListener("click",()=>{
    add_modal.classList.toggle("visible")
})

btn_close_add.addEventListener("click", closeAddModal)

user_entrance.addEventListener("click", (e) =>{
    if(e.target.classList.contains("user-container")){
        closeAddModal()
    }
})

btn_delete_all.addEventListener("click", ()=>{

    if(tarefas.length !== 0){
        const confirmation = confirm("Certeza que quer eliminar todas tarefas ?")
        if(confirmation){
            tarefas = []
            saveTasks()
            renderAlltask()
        }
    }
    else{
        alert("Sem tarefas para eliminar")
    }
})

document.querySelector(".close-alert").addEventListener("click", ()=>{
    alert_container.classList.remove("visible")
})