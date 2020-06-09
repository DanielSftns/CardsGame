const startGameButton = document.querySelector('.start-game')

const addButtons = document.querySelectorAll('.add-button')
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
				addCardsInDeck(deck, configCard)

				button.style.display = 'block'
				checkbox.checked = false
				resetConfigCard(button.parentNode)
				confirmButton.classList.remove('active')
			}
		})
	})
})


const allCheckbox = document.querySelectorAll('.select-checkbox') 
const selects = document.querySelectorAll('.select')
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

const options = document.querySelectorAll('.option')
options.forEach(option => {
	option.addEventListener('click', (e)=>{
		const value = e.target.textContent
		e.target.parentNode.parentNode.parentNode.querySelector('.title').textContent = value

		checkConfigCard(option.parentNode.parentNode.parentNode.parentNode)
	})
})

const inputsNumber = document.querySelectorAll('.number-of-cards')
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
	}
}) 

const cardsContainers = document.querySelectorAll('.deck') 
const decksDiscarded = document.querySelectorAll('.deckDiscarded')
let animationRunning = false

cardsContainers.forEach(cardsContainer =>{
	cardsContainer.addEventListener('click', ()=>{
		if(!animationRunning && cardsContainer.childElementCount > 0){
			animationRunning = true
			const cardsCount = cardsContainer.childElementCount - 1
			
			const cardNumber = Math.round(Math.random() * cardsCount)
			const cardRandom = cardsContainer.querySelectorAll('.card')[cardNumber]
			const cardForAnimation = cardsContainer.querySelectorAll('.card')[cardsCount]
			const cardForAnimationContent = cardForAnimation.innerHTML
			const cardRandomContent = cardRandom.innerHTML

			cardForAnimation.innerHTML = cardRandomContent
			cardRandom.innerHTML = cardForAnimationContent

			cardForAnimation.classList.add('see')
			setTimeout(()=>{
				const deckNumber = cardsContainer.classList[1].slice(-1)
				const deckDiscarded = document.querySelector(`.deckDiscarded${deckNumber}`)
				deckDiscarded.appendChild(cardForAnimation)
				ordenDecksDiscarded(cardForAnimation)
				animationRunning = false
			},3000)
		}
	})

})

function ordenDeck(deck){
	const cards = deck.querySelectorAll('.card')
	let space = 5;
	for(let i=0; i<cards.length; i++){
		cards[i].style.transform = `translate(0px, -${space}px) rotateX(-70deg) rotateY(0deg) rotateZ(10deg)`
		cards[i].style.zIndex = i;
		space += 5
	}
}

function ordenDecks(){
	for(let i=0; i < cardsContainers.length; i++){
		const cards = cardsContainers[i].querySelectorAll('.card')
		let space = 5;
		for(let i=0; i<cards.length; i++){
			cards[i].style.transform = `translate(0px, -${space}px) rotateX(-70deg) rotateY(180deg) rotateZ(-10deg)`
			cards[i].style.zIndex = i;
			space += 5
		}
	}
}

function ordenDecksDiscarded(){
	for(let i=0; i < decksDiscarded.length; i++){
		const cards = decksDiscarded[i].querySelectorAll('.card')
		let space = 5;
		for(let i=0; i<cards.length; i++){
			cards[i].classList.remove('see')
			cards[i].style.transform = `translate(0px, -${space}px) rotateX(-70deg) rotateY(0deg) rotateZ(10deg)`
			cards[i].style.zIndex = i
			space += 5
		}
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
	if(deck1.childElementCount == 0 || deck2.childElementCount == 0 || deck3.childElementCount == 0){
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
	const numberCards = configCard.querySelector(`.number-of-cards`).value
	const suit = configCard.querySelector(`.suit`).textContent
	const cardInSuit = configCard.querySelector(`.card-in-suit`).textContent

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
	ordenDeck(deck)
	checkStatusConfig()
}

