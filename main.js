const body = document.querySelector('body');
const avatar = document.querySelector('.chat-list-img');

let ready = false;
let choosenAvatar = null;

function preloadData() {

}

function loadAnimation() {
    const full = document.querySelector('.full-screen');
    const position = JSON.parse(localStorage.getItem('position'));
    
    position ? full.classList.add('clear-right') : full.classList.add('clear-left');

    setTimeout(() => {
        full.remove();
    }, 600);
}

function avatarChoose() {
    let choosenAvatarIndex = null;

    const background = document.createElement('div');
    background.classList.add('popup-screen');
    background.classList.add('show')
    body.appendChild(background);

    const chooseContainer = document.createElement('div');
    chooseContainer.classList.add('popup-container')
    background.appendChild(chooseContainer);

    const header = document.createElement('h1');
    header.classList.add('header-name');
    header.textContent = 'Choose avatar';
    chooseContainer.appendChild(header)

    const list = document.createElement('ul');
    list.classList.add('popup-list')
    chooseContainer.appendChild(list);

    const button = document.createElement('button');
    button.classList.add('avatar-button');
    button.textContent = 'Apply';
    button.addEventListener('click', () => {
        if(choosenAvatar) {
            avatar.src = `assets/avatar-${choosenAvatarIndex}.jpg`;
            background.classList.remove('show');
            background.classList.add('transparent');
            const e = document.querySelector('.transparent');
            console.log(e)

            setTimeout(() => {
                background.remove();
            },300)
            
        }        
    })
    chooseContainer.appendChild(button);

    for(let i = 0; i < 4; i++) {
        let chooseOption = document.createElement('li');
        chooseOption.classList.add('popup-items');
        chooseOption.style.backgroundImage = `url('assets/avatar-${i + 1}.jpg')`;
        chooseOption.addEventListener('click', () => {
            if(choosenAvatar) {
                choosenAvatar.classList.remove('choosen')
            }

            choosenAvatar = chooseOption;
            choosenAvatarIndex = i + 1;
            chooseOption.classList.add('choosen');
            button.classList.add('active-avatar-btn');
        })
        list.appendChild(chooseOption);
    }
}

window.addEventListener('pageshow', (event) => {
    if(event.persisted) {
        window.location.reload();
    }
})
setTimeout(() => {
    loadAnimation()
    setTimeout(() => {
        avatarChoose()
    }, 600)
}, 100)

