(function() {
	"use strict";

	/* Easy selector helper function */
	const select = (el, all = false) => {
		el = el.trim()
		if (all) {
			return [...document.querySelectorAll(el)]
		} else {
			return document.querySelector(el)
		}
	}

	/* Easy event listener function */
	const on = (type, el, listener, all = false) => {
		let selectEl = select(el, all)
		if (selectEl) {
			if (all) {
				selectEl.forEach(e => e.addEventListener(type, listener))
			} else {
				selectEl.addEventListener(type, listener)
			}
		}
	}

	/* Easy on scroll event listener */
	const onscroll = (el, listener) => {
		el.addEventListener('scroll', listener)
	}

	/* Navbar links active state on scroll */
	let navbarlinks = select('#navbar .scrollto', true)
	const navbarlinksActive = () => {
		let position = window.scrollY + 200
		navbarlinks.forEach(navbarlink => {
			if (!navbarlink.hash) return
			let section = select(navbarlink.hash)
			if (!section) return
			if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
				navbarlink.classList.add('active')
			} else {
				navbarlink.classList.remove('active')
	  		}
		})
	}
	window.addEventListener('load', navbarlinksActive)
	onscroll(document, navbarlinksActive)

	/* Scrolls to an element with header offset */
	const scrollto = (el) => {
		let elementPos = select(el).offsetTop
		window.scrollTo({
			top: elementPos,
			behavior: 'smooth'
		})
	}

	/* Back to top button */
	let backtotop = select('.back-to-top')
	if (backtotop) {
		const toggleBacktotop = () => {
			if (window.scrollY > 100) {
				backtotop.classList.add('active')
			} else {
				backtotop.classList.remove('active')
			}
		}
		window.addEventListener('load', toggleBacktotop)
		onscroll(document, toggleBacktotop)
	}

	/* Mobile nav toggle */
	on('click', '.mobile-nav-toggle', function(e) {
		select('body').classList.toggle('mobile-nav-active')
		this.classList.toggle('bi-list')
		this.classList.toggle('bi-x')
	})

	/* Scroll with offset on links with a class name .scrollto */
	on('click', '.scrollto', function(e) {
		if (select(this.hash)) {
			e.preventDefault()
			let body = select('body')
			if (body.classList.contains('mobile-nav-active')) {
				body.classList.remove('mobile-nav-active')
				let navbarToggle = select('.mobile-nav-toggle')
				navbarToggle.classList.toggle('bi-list')
				navbarToggle.classList.toggle('bi-x')
			}
		scrollto(this.hash)
		}
	}, true)

	/* Scroll with offset on page load with hash links in the url */
	window.addEventListener('load', () => {
		if (window.location.hash) {
			if (select(window.location.hash)) {
				scrollto(window.location.hash)
			}
		}
	});

	/* Preloader */
	let preloader = select('#preloader');
	if (preloader) {
		window.addEventListener('load', () => {
			preloader.remove()
		});
	}

	/* Hero type effect */
	const typed = select('.typed')
	if (typed) {
		let typed_strings = typed.getAttribute('data-typed-items')
		typed_strings = typed_strings.split(',')
		new Typed('.typed', {
			strings: typed_strings,
			loop: true,
			typeSpeed: 100,
			backSpeed: 50,
			backDelay: 2000
		});
  	}

	/* Skills animation */
	let skilsContent = select('.skills-content');
	if (skilsContent) {
		new Waypoint({
			element: skilsContent,
			offset: '80%',
			handler: function(direction) {
				let progress = select('.progress .progress-bar', true);
				progress.forEach((el) => {
					el.style.width = el.getAttribute('aria-valuenow') + '%'
				});
	  		}
		})
	}

	/* Porfolio isotope and filter */
	window.addEventListener('load', () => {
		let portfolioContainer = select('.portfolio-container');
		if (portfolioContainer) {
			let portfolioIsotope = new Isotope(portfolioContainer, {
				itemSelector: '.portfolio-item'
			});
			let portfolioFilters = select('#portfolio-flters li', true);
			on('click', '#portfolio-flters li', function(e) {
				e.preventDefault();
				portfolioFilters.forEach(function(el) {
					el.classList.remove('filter-active');
				});
				this.classList.add('filter-active');
				portfolioIsotope.arrange({
					filter: this.getAttribute('data-filter')
				});
				portfolioIsotope.on('arrangeComplete', function() {
					AOS.refresh()
				});
	  		}, true);
		}
	});

	/* Initiate portfolio lightbox */
	const portfolioLightbox = GLightbox({
		selector: '.portfolio-lightbox'
	});

	/* Initiate portfolio details lightbox */
	const portfolioDetailsLightbox = GLightbox({
		selector: '.portfolio-details-lightbox',
		width: '90%',
		height: '90vh'
	});

	/* Portfolio details slider */
	new Swiper('.portfolio-details-slider', {
		speed: 400,
		loop: true,
		autoplay: {
			delay: 5000,
			disableOnInteraction: false
		},
		pagination: {
			el: '.swiper-pagination',
			type: 'bullets',
			clickable: true
		}
	});

	/* Testimonials slider */
	new Swiper('.testimonials-slider', {
		speed: 600,
		loop: true,
		autoplay: {
			delay: 5000,
			disableOnInteraction: false
		},
		slidesPerView: 'auto',
		pagination: {
			el: '.swiper-pagination',
			type: 'bullets',
			clickable: true
		}
	});

	/* Animation on scroll */
	window.addEventListener('load', () => {
		AOS.init({
			duration: 1000,
			easing: 'ease-in-out',
			once: true,
			mirror: true
		})
	});
})()

function themeify() {
	if (document.getElementById("theme").classList.contains("bx-moon")) {
		document.getElementById("theme").classList.remove("bx-moon");
		document.getElementById("theme").classList.add("bx-sun");
	} else if (document.getElementById("theme").classList.contains("bx-sun")) {
		document.getElementById("theme").classList.remove("bx-sun");
		document.getElementById("theme").classList.add("bx-moon");
	}
	toggleTheme();
	if (window.location.hash === "#theme") {
		window.location.hash = "";
		history.replaceState("", "", location.pathname)
	}
	let presentURL = window.location.href;
	if  ( presentURL.endsWith('#') ) {
		presentURL.replace(/#(\S)/g, '$1');
		window.location.href = presentURL;
	}
}

window.onload = function(){
	document.getElementById("theme").addEventListener("click", themeify);
	document.getElementById("theme2").addEventListener("click", themeify);
}

// function to toggle between day and night theme
function toggleTheme() {
	if (localStorage.getItem("theme") === "day"){
		setTheme("night");
	} else {
		setTheme("day");
	}
}
// function to set a given theme/color-scheme
function setTheme(themeName) {
	localStorage.setItem("theme", themeName);
	document.getElementById("themeify").className = themeName;
}
// Immediately invoked function to set the theme on initial load
(function () {
	if (localStorage.getItem("theme") === "night") {
		setTheme("night");
		document.getElementById("theme").classList.remove("bx-moon");
		document.getElementById("theme").classList.add("bx-sun");
	} else {
		setTheme("day");
		document.getElementById("theme").classList.remove("bx-sun");
		document.getElementById("theme").classList.add("bx-moon");
	}
 })();

/*var width2 = document.getElementById("img2").clientWidth;
document.getElementById("*iframe2").style.width = width2 + "px";*/
