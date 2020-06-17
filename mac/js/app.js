const cardsContainers = document.querySelectorAll('.deck')
const allCheckbox = document.querySelectorAll('.select-checkbox') 
const inputsNumber = document.querySelectorAll('.number-of-cards')
const selects = document.querySelectorAll('.select')
const options = document.querySelectorAll('.option')
const addButtons = document.querySelectorAll('.add-button')
const startGameButton = document.querySelector('.start-game')
const decksDiscarded = document.querySelectorAll('.deckDiscarded')
let animationRunning = false
let gameFinished = false

document.querySelector('.button.play').addEventListener('click', ()=>{
	playDefaultGame()
})

document.querySelector('.button.settings').addEventListener('click', ()=>{
	document.querySelector('.home').style.display = "none"
	document.querySelector('.settings-view').style.display = "flex"
})

document.querySelector('.button.graphics').addEventListener('click', ()=>{
	document.querySelector('.settings-view').style.display = "none"
	document.querySelector('.config').style.display = "grid"
	document.querySelector('.game-area').style.display = "grid"
})

document.querySelector('.button.file').addEventListener('click', ()=>{
	const inputFile = document.querySelector('#fileConfiguration')
	inputFile.click()
	inputFile.addEventListener('change', (e)=>{
		const event =e
		const file = inputFile.files[0]

		const reader = new FileReader()

		reader.onload = (e) =>{
			const dataText = e.target.result
			uploadConfigurationFile(dataText)
		}
		reader.readAsText(file)
	})
})


addButtons.forEach(button =>{
	button.addEventListener('click', ()=>{
		button.style.display = 'none'
		const checkbox = button.parentNode.querySelector('.config-checkbox')
		checkbox.checked = true

		const cancelButton = button.parentNode.querySelector('.actions .cancel')
		cancelButton.addEventListener('click', ()=>{
			button.style.display = 'block'
			checkbox.checked = false
			resetConfigCard(button.parentNode)
		})

		const confirmButton = button.parentNode.querySelector('.actions .confirm')
		confirmButton.addEventListener('click', ()=>{
			if(confirmButton.classList.contains('active')){
				const numberDeck = button.parentNode.classList[1].slice(-1)
				const deck = document.querySelector(`.deck${numberDeck}`)
				const configCard = confirmButton.parentNode.parentNode

				const numberCards = configCard.querySelector(`.number-of-cards`).value
				const suit = configCard.querySelector(`.suit`).textContent
				const cardInSuit = configCard.querySelector(`.card-in-suit`).textContent

				addCardsInDeck(deck, {numberCards, suit, cardInSuit})
				ordenDeck(deck)
				checkStatusConfig()

				button.style.display = 'block'
				checkbox.checked = false
				resetConfigCard(button.parentNode)
				confirmButton.classList.remove('active')
			}
		})
	})
})


selects.forEach(select =>{
	select.addEventListener('click',(e)=>{
		allCheckbox.forEach(checkbox =>{
			if(select.contains(checkbox)){
				checkbox.checked = !checkbox.checked;
			}else{
				checkbox.checked = false;
			}
		})
	})
})

options.forEach(option => {
	option.addEventListener('click', (e)=>{
		const value = e.target.textContent
		e.target.parentNode.parentNode.parentNode.querySelector('.title').textContent = value

		checkConfigCard(option.parentNode.parentNode.parentNode.parentNode)
	})
})

inputsNumber.forEach(input =>{
	input.addEventListener('keyup',(e)=>{
		const value = e.target.value
		e.target.value = Math.round(parseFloat(value))
		if(e.target.value > 52){
			e.target.value = 52
		}
		checkConfigCard(input.parentNode)
	})
}) 

startGameButton.addEventListener('click', ()=>{
	if(startGameButton.classList.contains('active')){
		document.querySelector('.game-area').classList.remove('mode-config')
		ordenDecks()
		document.querySelector('.config').style.display = 'none'
		document.body.style.fontSize = "13px"
		window.scrollTo(0, (document.querySelectorAll('.deck')[0].offsetTop / 2))
	}
}) 


cardsContainers.forEach(cardsContainer =>{
	cardsContainer.addEventListener('click', (e)=>{
		if(!animationRunning && cardsContainer.childElementCount > 1 && !e.target.classList.contains('select-button') && !gameFinished){
			animationRunning = true
			const cardsCount = cardsContainer.querySelectorAll('.card').length - 1
			const cardNumber = getRandomIntInclusive(0, cardsCount)
			const cardRandom = cardsContainer.querySelectorAll('.card')[cardNumber]

			const cardForAnimation = cardsContainer.querySelectorAll('.card')[cardsCount]
			const cardForAnimationContent = cardForAnimation.innerHTML
			const cardRandomContent = cardRandom.innerHTML

			cardRandom.innerHTML = cardForAnimationContent
			cardForAnimation.innerHTML = cardRandomContent
			
			const deckNumber = cardsContainer.classList[1].slice(-1)
			const deckDiscarded = document.querySelector(`.deckDiscarded${deckNumber}`)
			
			cardForAnimation.style.zIndex = "100"

			cardForAnimation.style.transition = "all 0.6s ease"	

			cardForAnimation.style.webkitTransform = `rotateY(0deg)`
			cardForAnimation.style.transform = `rotateY(0deg)`
			
			setTimeout(()=>{
				cardForAnimation.style.top = `calc(-100% - 2em)`
				setTimeout(()=>{
					deckDiscarded.appendChild(cardForAnimation)
					ordenDeckDiscarded(deckDiscarded)
					animationRunning = false
				},600)
			},800)

		}else if(e.target.classList.contains('select-button')){

			if(document.querySelectorAll('.select-button.selected').length == 0){
				e.target.textContent = "Selected"
				e.target.classList.add('selected')
				gameFinished = true 

			}else if(e.target.classList.contains('selected')){
				e.target.textContent = "Select"
				e.target.classList.remove('selected')
				gameFinished = false
			}

		}
	})

})

function getRandomIntInclusive(min, max){
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function ordenDeck(deck){
	const cards = deck.querySelectorAll('.card')
	for(let i=0; i<cards.length; i++){
			const translateX = Math.random() * 15
			const translateY = Math.random() * 15
			cards[i].style.webkitTransform = `translate(${translateX}px, ${translateY}px) rotateY(0deg)`
			cards[i].style.transform = `translate(${translateX}px, ${translateY}px) rotateY(0deg)`
	}
}

function ordenDecks(){
	for(let i=0; i < cardsContainers.length; i++){
		const cards = cardsContainers[i].querySelectorAll('.card')
		for(let i=0; i<cards.length; i++){
			const translateX = Math.random() * 15
			const translateY = Math.random() * 15

			cards[i].style.webkitTransform = `translate(${translateX}px, ${translateY}px) rotateY(-180deg)`
			cards[i].style.transform = `translate(${translateX}px, ${translateY}px) rotateY(-180deg)`
		}
	}
}

function ordenDeckDiscarded(deckDiscarded){
	const cards = deckDiscarded.querySelectorAll('.card')


	if(deckDiscarded.childElementCount - 2 >= 0){
		const card = cards[deckDiscarded.childElementCount - 2]

		const position = deckDiscarded.childElementCount - 1
		cards[position].style.transition = "none"
		cards[position].style.webkitTransform = "translate3d(0,0,0)"		
		cards[position].style.transform = "translate3d(0,0,0)"		
		cards[position].style.zIndex = `${position}`
		cards[position].style.position = "absolute"
		const translateX = Math.random() * 10
		const translateY = Math.random() * 10
		cards[position].style.lef = `${translateX}px`
		cards[position].style.top = `${translateY}px`

	}else{
		cards[0].style.transition = "none"
		cards[0].style.webkitTransform = "translate3d(0,0,0)"
		cards[0].style.transform = "translate3d(0,0,0)"
		cards[0].style.zIndex = "0"
		cards[0].style.position = "absolute"
		const translateX = Math.random() * 10
		const translateY = Math.random() * 10
		cards[0].style.left = `${translateX}px`
		cards[0].style.top = `${translateY}px`

	}
}

function checkConfigCard(configCard){
	const confirmButton = configCard.querySelector('.actions .confirm')
	const numberCards = configCard.querySelector(`.number-of-cards`).value
	const suit = configCard.querySelector(`.suit`).textContent
	const cardInSuit = configCard.querySelector(`.card-in-suit`).textContent

	if(numberCards == '' || suit == 'Suit' || cardInSuit == 'Card in suit'){
		confirmButton.classList.remove('active')
		return
	}
	confirmButton.classList.add('active')
}

function checkStatusConfig(){
	const deck1 = document.querySelector('.deck1')
	const deck2 = document.querySelector('.deck2')
	const deck3 = document.querySelector('.deck3')
	if(deck1.childElementCount == 1 || deck2.childElementCount == 1 || deck3.childElementCount == 1){
		startGameButton.classList.remove('active')
	}else{
		startGameButton.classList.add('active')
	}
}

function resetConfigCard(configCard){
	const numberCards = configCard.querySelector(`.number-of-cards`).value = '1'
	const suit = configCard.querySelector(`.suit`).textContent = 'Suit'
	const cardInSuit = configCard.querySelector(`.card-in-suit`).textContent = 'Card in suit'
}

function addCardsInDeck(deck, configCard){

	const {numberCards, suit, cardInSuit} = configCard

	let CIS
	if(isNaN(parseInt(cardInSuit))){
		CIS = cardInSuit[0]
	}else{
		CIS = cardInSuit
	}

	for(let i=0; i<numberCards; i++){
		const card = document.createElement('div')
		card.setAttribute('class', 'card')
		card.innerHTML = `
				<div class="front">
					<img src="./img/cards/${CIS}${suit[0]}.png">
				</div>
				<div class="reverse"></div>
		`
		deck.appendChild(card)
	}
}


function uploadConfigurationFile(dataText){
	let data = dataText.replace(/ /g, "")
	data = data.replace(/\r?\n|\r/g, " ")
	data = data.toUpperCase()

	let configuration = data.split("DECK")
	configuration = configuration.filter(deck => deck)


	for(let i = 0; i < configuration.length; i++){
		configuration[i] = configuration[i].trim()
		if(configuration[i] != ''){
			const deck = configuration[i].split(' ')
			for(let j=0; j<deck.length; j++){

				const card = deck[j].split(',')
				const numberCards = card.length == 3? card[0] : 1
				const cardInSuit = card.length == 3? card[1] : card[0]
				const suit = card.length == 3? card[2] : card[1]
				
				addCardsInDeck(document.querySelector(`.deck${i+1}`), {numberCards, suit, cardInSuit})
			}
		}
	}

	document.querySelector('.settings-view').style.display = "none"
	document.querySelector('.home').style.display = "none"
	document.querySelector('.game-area').style.display = "grid"
	
	startGameButton.classList.add('active')
	startGameButton.click()
}

async function playDefaultGame(){
	const res = await fetch('./configuration.txt')
	const dataText = await res.text()
	uploadConfigurationFile(dataText)
}