

 // Style constants
 // @type {Object}
 
const STYLE = {
  SHOW: 'block',
  HIDE: 'none'
}
 // Class constants
 
const CLASS = {
  OVERLAY: 'tightbox-overlay',
  CONTAINER: 'tightbox-container',
  IMAGE: 'tightbox-image',
  BUTTON: {
    DEFAULT: 'tightbox-button',
    LEFT: 'tightbox-button-left',
    RIGHT: 'tightbox-button-right'
  }
}

 //@type {Object}
 
const SELECTOR = {
  TIGHTBOX: '[data-tightbox]'
}

 //Key constants
 // @type {Object}
 
const KEY = {
  ESC: 27,
  LEFT: 37,
  RIGHT: 39
}
 //Time constants
 // @type {Object}
 
const TIME = {
  FADE: {
    DEFAULT: 300,
    SHORT: 100
  },
  THROTTLE: 100
}

 //Links to trigger the tightbox
 //@type {Nodelist}
 
const links = document.querySelectorAll(SELECTOR.TIGHTBOX)
const overlay = document.createElement('div')
const container = document.createElement('div')
const image = document.createElement('img')
const buttonLeft = document.createElement('a')
const buttonRight = document.createElement('a')


 //Groups of links to cycle through, as defined by the data-tightbox  attribute
 //@type {Object}
 
const groups = Array.from(links).reduce((carry, link) => {
  const group = link.dataset.tightbox

  carry[group] = carry[group] || []
  carry[group].push(link)
  return carry
}, {})


 //Thunk for binding an event listener once
 // @param  {HTMLElement} element
 // @param  {String} event
 // @param  {Function} callback
 
const once = (element, event, callback) => {
  element.addEventListener(event, callback, {
    once: true
  })
}

 // Function to throttle the execution of event handlers
 //@param  {Function} callback
 // @param  {Number|undefined} delay
 // @return {Function}
 
const throttle = (callback, delay) => {
  let hold = false
  delay = delay || TIME.THROTTLE

  return function handleEvent (...args) {
    if (hold) return

    hold = true
    callback.apply(this, args)

    window.setTimeout(() => {
      hold = false
    }, delay)
  }
}


 //Function to fade an element
 // @param  {HTMLElement} element
 // @param  {Number} from
 //@param  {Number} to
 // @param  {Number} [duration=300]
 
const fade = (element, from, to, duration) => {
  const start = window.performance.now()

  if (from === -1) {
    from = 1 * window
      .getComputedStyle(element)
      .getPropertyValue('opacity')
  }

  duration = duration || TIME.FADE.DEFAULT
  element.style.display = STYLE.SHOW

  window.requestAnimationFrame(function step (timestamp) {
    const progress = timestamp - start
    element.style.opacity = from + (progress / duration) * (to - from)

    if (progress < duration) {
      window.requestAnimationFrame(step)
    } else if (element.style.opacity <= 0) {
      element.style.display = STYLE.HIDE
    }
  })
}


 //Fade in shorthand
 //@param  {HTMLElement} element
 //@param  {Number|undefined} duration
 
const fadeIn = (element, duration) => {
  fade(element, -1, 1, duration)
}


 //Fade out shorthand
 // @param  {HTMLElement} element
 // @param  {Number|undefined} duration
 
const fadeOut = (element, duration) => {
  fade(element, -1, 0, duration)
}


 //Function to center a (visible) element to its
 //top/left coordinates
 //@param  {HTMLElement} element
 
const center = element => {
  Object.assign(element.style, {
    marginLeft: element.offsetWidth / -2 + 'px',
    marginTop: element.offsetHeight / -2 + 'px'
  })
}


 //Hide the tightbox
 //@param  {Event} event
 
const hideBox = event => {
  fadeOut(overlay)
  document.removeEventListener('keydown', keyHandler)  
  event.preventDefault()    
}


 //Show the previous image in the current group
 //@param  {Event} event
 
const showPrev = event => {
  const group = groups[current.dataset.tightbox]
  const index = group.indexOf(current)
  const prev = index === 0 ? group.length - 1 : index - 1

  current = group[prev]
  image.src = current.href
  once(image, 'load', () => center(container))
  event.preventDefault()    
}


const showNext = event => {
  const group = groups[current.dataset.tightbox]
  const index = group.indexOf(current)
  const next = index === group.length - 1 ? 0 : index + 1

  current = group[next]
  image.src = current.href
  once(image, 'load', () => center(container))  
  event.preventDefault()    
}

const keyHandler = event => {
  const group = groups[current.dataset.tightbox]
  const index = group.indexOf(current)

  switch (event.which) {
    case KEY.ESC: {
      hideBox(event)
      break
    }

    case KEY.LEFT: {
      showPrev(event)
      break
    }

    case KEY.RIGHT: {
      showNext(event)
    }
  }
}

// Initialize the tightbox
buttonLeft.href = buttonRight.href = '#'

overlay.classList.add(CLASS.OVERLAY)
container.classList.add(CLASS.CONTAINER)
image.classList.add(CLASS.IMAGE)
buttonLeft.classList.add(CLASS.BUTTON.DEFAULT, CLASS.BUTTON.LEFT)
buttonRight.classList.add(CLASS.BUTTON.DEFAULT, CLASS.BUTTON.RIGHT)

container.appendChild(image)
container.appendChild(buttonLeft)
container.appendChild(buttonRight)
overlay.appendChild(container)
document.body.appendChild(overlay)

// Hide the tightbox when clicking somewhere on the overlay
overlay.addEventListener('click', event => {
  if (event.target !== overlay) return

  hideBox(event)
})

// Navigate forward/backward in the current group
buttonLeft.addEventListener('click', showPrev)
buttonRight.addEventListener('click', showNext)

// Show the tightbox when clicking a corresponding link
document.addEventListener('click', event => {
  const {target} = event

  if (!target.matches(SELECTOR.TIGHTBOX)) return

  event.preventDefault()
  current = target
  image.src = current.href

  once(image, 'load', () => {
    document.addEventListener('keydown', keyHandler)
    fadeIn(overlay)
    center(container)
  })
})

// Show the navigation buttons when hovering the image
image.addEventListener('mousemove', throttle(event => {
  if (event.offsetX < event.target.offsetWidth / 2) {
    fadeIn(buttonLeft, TIME.FADE.SHORT)
    fadeOut(buttonRight, TIME.FADE.SHORT)
  } else {
    fadeOut(buttonLeft, TIME.FADE.SHORT)
    fadeIn(buttonRight, TIME.FADE.SHORT)
  }
}))