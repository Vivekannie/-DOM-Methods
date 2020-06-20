//html in js file
let documentBody = document.querySelector("body")
let mainElement = document.createElement("main");
mainElement.classList.add("main")
documentBody.append(mainElement)
mainElement.append("Main")

let imageDiv = document.createElement("img")
imageDiv.classList.add("image")
imageDiv.src = "https://media-eng.dhakatribune.com/uploads/2020/04/seh3nsg4rmiv2s6srjpy-1587396515663.jfif"
mainElement.append(imageDiv)

let navDiv = document.createElement("a")
navDiv.classList.add("link")
navDiv.append("Link")
navDiv.href = 'https://www.kenzie.academy/'
mainElement.append(navDiv)

let button = document.createElement("Button")
button.append("Button")
documentBody.append(button)
button.addEventListener("click", function () {
    mainElement.remove()

})