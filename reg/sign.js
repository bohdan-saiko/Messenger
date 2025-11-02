const body = document.querySelector('body');
const changeButton = document.querySelector('.change');
const coloredSide = document.querySelector('.colored');
const formSide = document.querySelector('.form');

const coloredContainer = document.querySelector('.colored-container')
const colorHeader = document.querySelector('.colored-header');
const sentence = document.querySelector('.sentence');

const header = document.querySelector('#header');
const article = document.querySelector('.minor-text');
const inputWrapper = document.querySelector('#input-wrapper');
const nameInput = document.querySelector('#name');
const emailInput = document.querySelector('#email');
const passwordInput = document.querySelector('#password')
const regButton = document.querySelector('#main-button');
const eye = document.querySelector('.eye')

const url = 'http://localhost:3000';
let nameInputCop = nameInput;
let position = true;
let isPassword = true;
let isPopup = false;

async function registration() {
    const response = await fetch(url + '/reg', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: nameInput.value,
            email: emailInput.value,
            password: passwordInput.value
        })
    })

    const data = await response.json();

    if(!response.ok) {
        createPopUp(data.message, false)
    } else {
        translate()
    }
}

async function login() {
    const response = await fetch(url + '/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: emailInput.value,
            password: passwordInput.value
        })
    })

    const data = await response.json();

    if(!response.ok) {
        createPopUp(data.message, false)
    } else {
        translate()
    }

    
}

function createPopUp(text, type) {
    isPopup = true;

    coloredContainer.classList.remove('text-pop-up')

    if(position) {
        
        coloredSide.classList.remove('to-left');
        formSide.classList.remove('to-right');
        
        coloredSide.classList.add('to-right-pop');
        formSide.classList.add('to-left-pop');
    } else {
        coloredSide.classList.remove('to-right');
        formSide.classList.remove('to-left');

        coloredSide.classList.add('to-right-pop');
        formSide.classList.add('to-left-pop');
    }

    void coloredContainer.offsetWidth;
    coloredContainer.classList.add('text-pop-up')

    setTimeout( () => {
        if(isPopup){
        type ? colorHeader.innerHTML = 'Successfuly' : colorHeader.innerHTML = 'Something wrong';
        sentence.innerHTML = text;
        changeButton.innerHTML = 'Close'
        changeButton.addEventListener('click', () => {
            coloredContainer.classList.remove('text-pop-up')
            void coloredContainer.offsetWidth;
            coloredContainer.classList.add('text-pop-up')

            if(position) {
                coloredSide.classList.remove('to-right-pop');
                formSide.classList.remove('to-left-pop');
                setTimeout(() => {
                    colorHeader.innerHTML = 'Welcome back!';
                    sentence.innerHTML = 'To keep connected with us please login with your personal info';
                    changeButton.innerHTML = 'Sign in';
                }, 200)
                
            } else {
                coloredSide.classList.remove('to-right-pop');
                formSide.classList.remove('to-left-pop');
                coloredSide.classList.add('to-right');
                formSide.classList.add('to-left');
                setTimeout(() => {
                    colorHeader.innerHTML = 'Hello, friend!';
                    sentence.innerHTML = 'Enter some personal details about you and start journey with us';
                changeButton.innerHTML = 'Sign up';
                }, 200)                
            }

            isPopup = false;
        })
        }
    }, 225)
}

function translate() {
    localStorage.setItem('position', JSON.stringify(position));

    coloredContainer.classList.add('full-transparent');
    formSide.classList.add('full-transparent');
    
    setTimeout(() => {
        formSide.remove();
        if(!position) {
            coloredSide.classList.add('to-left');
        }
        coloredSide.classList.add('full-screen');

        setTimeout(() => {
            window.location.href = './main.html'
        }, 600)
    }, 450)
}

changeButton.addEventListener('click', () => {
    if(isPopup) { return }

    if (position) {
        formSide.classList.remove('to-right');
        formSide.classList.add('to-left');

        coloredContainer.classList.remove('text-to-left');
        coloredContainer.classList.add('text-to-right');
        setTimeout(() => {           
            colorHeader.textContent = 'Hello, friend!';
            sentence.textContent = 'Enter some personal details about you and start journey with us';
            changeButton.textContent = 'Sign up';

            header.textContent = 'Sign in';
            article.textContent = 'or use your account';
            nameInput.remove();
            regButton.textContent = 'Sign in';
        }, 400)

        coloredSide.classList.remove('to-left');
        coloredSide.classList.add('to-right');

        position = false;
    } else {
        formSide.classList.remove('to-left');
        formSide.classList.add('to-right');

        coloredContainer.classList.remove('text-to-right');
        coloredContainer.classList.add('text-to-left');
        setTimeout(() => {           
            colorHeader.textContent = 'Welcome back!';
            sentence.textContent = 'To keep connected with us please login with your personal info';
            changeButton.textContent = 'Sign in';

            header.textContent = 'Create your account';
            article.textContent = 'or use your email for registration';
            inputWrapper.appendChild(nameInputCop);
            regButton.textContent = 'Sign up';
        }, 400)

        coloredSide.classList.remove('to-right');
        coloredSide.classList.add('to-left');

        position = true;
    }
})

eye.addEventListener('click', () => {
    if(isPassword) {
        eye.setAttribute('src', '../assets/dis-eye.svg');
        isPassword = false;
        passwordInput.setAttribute('type', 'text');
    } else {
        eye.setAttribute('src', '../assets/eye.svg');
        isPassword = true;
        passwordInput.setAttribute('type', 'password');
    }
})

regButton.addEventListener('click', (event) => {
    event.preventDefault()

    if(position) {
        if(nameInput.value === '' || emailInput.value === '' || passwordInput.value === '') {
            createPopUp('Всі поля мають бути заповнинеми', false)
            return
        }

        registration(nameInput.value, emailInput.value, passwordInput.value);
    } else {
        if(emailInput.value === '' || passwordInput.value === '') {
            createPopUp('Всі поля мають бути заповнинеми', false)
            return
        }

        login(emailInput.value, passwordInput.value)
    }
})

window.addEventListener('pageshow', (event) => {
    if(event.persisted) {
        window.location.reload();
    }
})