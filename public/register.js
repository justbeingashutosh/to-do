const toggle = document.querySelector("#button-addon2")
const passwordInput = document.querySelector("#formGroupExampleInput2")
const loginBtn = document.querySelector("#login")
toggle.addEventListener('click', ()=>{
    let current = passwordInput.getAttribute('type')
    if(current=="password"){
        passwordInput.setAttribute('type', 'text')
    }else{
        passwordInput.setAttribute('type', 'password')
    }
})
loginBtn.addEventListener('click', ()=>{
    window.location = "/login"
})