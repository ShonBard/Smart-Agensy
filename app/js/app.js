import {addBtnEvents, removeBtnEvents } from './modal/modalBtnEvents.js';

import Swiper, { Navigation, Pagination } from 'swiper'
 // configure Swiper to use modules
Swiper.use([Navigation, Pagination]);

document.addEventListener('DOMContentLoaded', () => {

	const burgerBtn = document.querySelector('.menu-btn')
	const arrowBtn = document.querySelector('.menu-arrow')

	const	menuWrap = document.querySelector('.menu-wrap') 
	const menuNode = document.querySelector('.menu') 
	const overlay = document.querySelector('#overlay')

	const allSection = document.querySelectorAll('.section')
	const menuLinks = document.querySelectorAll('.menu__link')

	const activeClassLink = 'highlight'


	// SLIDER
	const swiper = new Swiper('.swiper', {
		loop: false,
		speed: 2400, 

		navigation: {
			nextEl: '.swiper-button-next',
			prevEl: '.swiper-button-prev',
		},
		pagination: {
			el: '.swiper-pagination',
			type: 'bullets',
			clickable: 'true',
		},
		// Responsive breakpoints
		breakpoints: {
			320: {
				direction: 'vertical',
				slidesPerView: 1,
				spaceBetween: 10
			},
			768: {
				direction: 'vertical',
				slidesPerView: 1,
				spaceBetween: 10
			},
			992: {
				direction: 'vertical',
				slidesPerView: 1,
				spaceBetween: 10
			},
			1200: {
				slidesPerView: 2,
				spaceBetween: 30,
				slidesPerGroup: 2,
			},
			1400: {
				slidesPerView: 2,
				spaceBetween: 30,
				slidesPerGroup: 2,
			},
		},
	})

	// BURGER BTN
	burgerBtn.onclick = (event) => {
		event.preventDefault() 
		addBtnEvents()
	}
	arrowBtn.onclick = (event) => {
		event.preventDefault() 
		removeBtnEvents()
	}
	overlay.onclick = () => {
		menuWrap.classList.remove('menu-wrap-active')
		overlay.classList.remove('overlay-menu')
	}


	menuNode.addEventListener( 'click', event => {
		const menuLink = event.target; 

		if (!menuLink) return 
		if (!menuNode.contains(menuLink)) return
		highlight(menuLink);
	})
	function highlight(menuLink) {
		clearingAllLinks() 

		let selectedMenuLink
		selectedMenuLink = menuLink;
		selectedMenuLink.classList.add(activeClassLink); 
	}


	menuNode.addEventListener( 'click', event => {
		event.preventDefault() 
		const menuLink = event.target;

		if (!menuLink) return 
		if (!menuNode.contains(menuLink)) return
		const getsectionId = menuLink.getAttribute('href').substring(1)
		console.log(getsectionId)
		
		const getsectionById = document.getElementById(getsectionId)
		moveToSection(getsectionById.offsetTop)
	})
	function moveToSection(selectedSection) {
		window.scrollTo(0, selectedSection)
	}	


	window.addEventListener('scroll', () => {
		setActiveLinkByScroll()
	})
	function setActiveLinkByScroll() {
		clearingAllLinks() 
		let currentActiveSection 

		for (const section of allSection) {
			if (window.scrollY + 101 >= section.offsetTop) { 
				currentActiveSection = section.getAttribute('id')
			}
		}

		for (const menuLink of menuLinks) {
			let valueLink = menuLink.getAttribute('href').substring(1)

			if (valueLink === currentActiveSection) {
				menuLink.classList.add(activeClassLink)
			}
		}
	}
	function clearingAllLinks() {
		menuLinks.forEach(link => link.classList.remove(activeClassLink))
	}

})





