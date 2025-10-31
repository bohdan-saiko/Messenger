const body = document.querySelector('body');

let ready = false;

function preloadData() {
    const isFirst = JSON.parse(localStorage.getItem('isFirst'));

    if(!isFirst) {
        loadAnimation();

        localStorage.setItem('isFirst', JSON.stringify(true));
    }
}

function loadAnimation() {
    const full = document.querySelector('.full-screen');
    full.classList.add('clear');
}

function avatarChoose() {
    let background = document.createElement('div');
    background.classList.add('full-screen');
    background.classList.add('popup');
    body.appendChild(background)

    let chooseContainer = document.createElement('div');
    chooseContainer.classList.add('popup-container')
    background.appendChild(chooseContainer);
}

window.addEventListener('pageshow', (event) => {
    if(event.persisted) {
        window.location.reload();
    }
})

setTimeout(() => {
    loadAnimation()
    avatarChoose()
}, 100)
