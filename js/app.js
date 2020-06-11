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

				const numberCards = configCard.querySelector(`.number-of-cards`).value
				const suit = configCard.querySelector(`.suit`).textContent
				const cardInSuit = configCard.querySelector(`.card-in-suit`).textContent

				addCardsInDeck(deck, {numberCards, suit, cardInSuit})

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
		document.body.style.minHeight = "65em"
	}
}) 

const cardsContainers = document.querySelectorAll('.deck') 
const decksDiscarded = document.querySelectorAll('.deckDiscarded')
let animationRunning = false


cardsContainers.forEach(cardsContainer =>{
	cardsContainer.addEventListener('click', ()=>{
		if(!animationRunning && cardsContainer.childElementCount > 0){
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


			let space = 0

			if(deckDiscarded.childElementCount > 0){
				space = getSpace(deckDiscarded.querySelectorAll('.card')[deckDiscarded.childElementCount - 1].style.transform)
			}

			cardForAnimation.style.transition = "all 1s ease"			
			cardForAnimation.style.transform = `rotateX(0deg) rotateY(0deg) rotateZ(0deg)`
			cardForAnimation.style.top = `calc(-100% - ${space}px)`
			
			setTimeout(()=>{
				cardForAnimation.style.top = `calc(-100% - ${space}px)`
					setTimeout(()=>{
					cardForAnimation.style.transform = `rotateX(-70deg) rotateY(0deg) rotateZ(10deg)`
					
					setTimeout(()=>{
						deckDiscarded.appendChild(cardForAnimation)
						ordenDeckDiscarded(deckDiscarded)
						animationRunning = false
					},1000)
				},200)
			},1000)

		}
	})

})

function getSpace(cardStyle){
	const param1 = cardStyle.indexOf('-') + 1
	const param2 = cardStyle.indexOf(')')
	return parseInt(cardStyle.slice(param1,param2))
}

function getRandomIntInclusive(min, max){
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

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

function ordenDeckDiscarded(deckDiscarded){
	const cards = deckDiscarded.querySelectorAll('.card')
	if(deckDiscarded.childElementCount - 2 >= 0){
		const card = cards[deckDiscarded.childElementCount - 2]
		const zIndex = card.style.zIndex
		const space = getSpace(card.style.transform)
		const position = deckDiscarded.childElementCount - 1
		cards[position].style.transition = "none"
		cards[position].style.top = "0"
		cards[position].style.zIndex = `${parseInt(zIndex)+1}`
		cards[position].style.transform = `translate(0px, -${space+5}px) rotateX(-70deg) rotateY(0deg) rotateZ(10deg)`

	}else{
		cards[0].style.transition = "none"
		cards[0].style.top = "0"
		cards[0].style.zIndex = "0"
		cards[0].style.transform = `translate(0px, -5px) rotateX(-70deg) rotateY(0deg) rotateZ(10deg)`
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
	ordenDeck(deck)
	checkStatusConfig()
}


async function uploadConfigurationFile(dataText){
	let data = dataText.replace(/ /g, "")
	data = data.replace(/\r?\n|\r/g, " ")
	data = data.toUpperCase()

	let configuration = data.split("DECK")
	configuration = configuration.filter(deck => deck)

	for(let i = 0; i < 3; i++){
		configuration[i] = configuration[i].trim()
		const deck = configuration[i].split(' ')
		for(let j=0; j<deck.length; j++){
			const card = deck[j].split(',')
			const numberCards = card[0]
			const cardInSuit = card[1]
			const suit = card[2]
			addCardsInDeck(document.querySelector(`.deck${i+1}`), {numberCards, suit, cardInSuit})
		}

	}
}

document.querySelector('.btn-upload').addEventListener('click', ()=>{
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

