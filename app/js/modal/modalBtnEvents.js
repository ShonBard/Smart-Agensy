const arrowBtn = document.querySelector('.menu-arrow')
const	menuWrap = document.querySelector('.menu-wrap') 
const overlay = document.querySelector('#overlay')


function addBtnEvents() {
	arrowBtn.classList.add('menu-arrow-active')
	menuWrap.classList.add('menu-wrap-active')
	overlay.classList.add('overlay-menu')
}

function removeBtnEvents() {
	arrowBtn.classList.remove('menu-btn-active')
	menuWrap.classList.remove('menu-wrap-active')
	overlay.classList.remove('overlay-menu')
}


export {addBtnEvents, removeBtnEvents}