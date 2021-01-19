document.addEventListener('DOMContentLoaded', () => {
   function testWebP(callback) {
	let webP = new Image();
	webP.onload = webP.onerror = function () {
		callback(webP.height == 2);
	};
	webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
}

testWebP(function(support) {

	if (support == true) {
		document.querySelector('body').classList.add('webp');
	} else {
		document.querySelector('body').classList.add('no-webp');
	}
});
const videos = document.querySelectorAll('video')
videos.forEach(video => {
   if (video.classList.contains('_autoplay')) {
      video.play()
   }
})

$(document).ready(function () {
   $('.goto').click(function () {
      var el = $(this).attr('href').replace('#', '')
      var offset = 0
      $('body,html').animate(
         {
            scrollTop: $('.' + el).offset().top + offset - $('header').height(),
         },
         700,
         function () {},
      )

      if ($('.menu__body').hasClass('active')) {
         $('.menu__body,.icon-menu').removeClass('active')
			$('body').removeClass('lock')
			$('.header__logo').removeClass('active')
      }
      return false
   })
})

let iconMenu = document.querySelector('.icon-menu')
let body = document.querySelector('body')
let menuBody = document.querySelector('.menu__body')

if (iconMenu) {
   iconMenu.addEventListener('click', function () {
      iconMenu.classList.toggle('active')
      body.classList.toggle('lock')
      menuBody.classList.toggle('active')
   })
}

window.addEventListener('scroll', () => {
   let header = document.querySelector('.header')
   if (window.scrollY > 50) {
      header.classList.add('scrolled')
   } else {
      header.classList.remove('scrolled')
   }
})

$('.pl').click(function (event) {
   var pl = $(this).attr('href').replace('#', '')
   popupOpen(pl)
   return false
})
function popupOpen(pl) {
   $('.popup').removeClass('active').hide()
   setTimeout(function () {
      $('body').addClass('lock')
   }, 300)

   history.pushState('', '', '#' + pl)
   $('.popup-' + pl)
      .fadeIn(300)
      .delay(300)
      .addClass('active')

   if ($('.popup-' + pl).find('.slick-slider').length > 0) {
      $('.popup-' + pl)
         .find('.slick-slider')
         .slick('setPosition')
   }
}
function popupClose() {
   $('.popup').removeClass('active').fadeOut(300)
   if (!$('.menu__body').hasClass('active')) {
      $('body').removeClass('lock')
   }
   history.pushState('', '', window.location.href.split('#')[0])
}
$('.popup-close,.popup__close').click(function (event) {
   popupClose()
   return false
})
$('.popup').click(function (e) {
   if (
      !$(e.target).is('.popup>.popup__container *') ||
      $(e.target).is('.popup-close') ||
      $(e.target).is('.popup__close')
   ) {
      popupClose()
      return false
   }
})
$(document).on('keydown', function (e) {
   if (e.which == 27) {
      popupClose()
   }
})
const forms = () => {
   const forms = document.forms

   for (let i = 0; i < forms.length; i++) {
      const form = forms[i]

      form.addEventListener('submit', e => {
         e.preventDefault()
         sendForm(form)
      })
   }

   async function sendForm(form) {
      let formMessage = form.querySelector('.form__message')
      if (formMessage) formMessage.textContent = ''

      let error = validateForm(form)

      let formData = new FormData(form)

      if (error === 0) {
         form.classList.add('_sending')
         let response = await fetch('sendmail.php', {
            method: 'POST',
            body: formData,
         })
         if (response.ok) {
            let result = await response.json()
            popupOpen('succes')
            form.reset()
            form.classList.remove('_sending')
         } else {
            popupOpen('fail')
            form.classList.remove('_sending')
         }
      } else {
         if (formMessage) {
            formMessage.textContent =
               'Ошибка в одном или нескольких полях, проверьте коректность введенных данных'
            formMessage.classList.add('active')
         }
      }
   }

   function validateForm(form) {
      let error = 0
      const formReq = form.querySelectorAll('._req')

      for (let i = 0; i < formReq.length; i++) {
         const input = formReq[i]
         removeFormError(input)
         if (input.classList.contains('_email')) {
            if (!validateEmail(input)) {
               addFormError(input)
               error++
            }
         } else if (input.classList.contains('_phone')) {
            if (!validatePhone(input)) {
               addFormError(input)
               error++
            }
         } else {
            if (input.value.trim().length <= 1) {
               addFormError(input)
               error++
            }
         }
      }

      return error
   }

   function addFormError(input) {
      input.parentElement.classList.add('_error')
      input.classList.add('_error')
   }
   function removeFormError(input) {
      input.parentElement.classList.remove('_error')
      input.classList.remove('_error')
   }

   function validateEmail(input) {
      const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      return re.test(String(input.value).toLowerCase())
   }
   function validatePhone(input) {
      const re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im
      return re.test(String(input.value).toLowerCase())
   }
}
forms()
	
})
