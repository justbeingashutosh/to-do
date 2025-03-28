const toggle = document.querySelector('#button-addon2')
const register = document.querySelector('#register')
const submitBtn = document.querySelector('#submitbtn')
const passwordInput = document.querySelector("#formGroupExampleInput2")
const usernameInput = document.querySelector("#autoSizingInputGroup")
toggle.addEventListener('click', ()=>{
    let current = passwordInput.getAttribute('type')
    if(current=="password"){
        passwordInput.setAttribute('type', 'text')
    }else{
        passwordInput.setAttribute('type', 'password')
    }
})

register.addEventListener('click', ()=>{
    window.location = '/register'
})
