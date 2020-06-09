"use strict";

var startGameButton = document.querySelector('.start-game');
var addButtons = document.querySelectorAll('.add-button');
addButtons.forEach(function (button) {
  button.addEventListener('click', function () {
    button.style.display = 'none';
    var checkbox = button.parentNode.querySelector('.config-checkbox');
    checkbox.checked = true;
    var cancelButton = button.parentNode.querySelector('.actions .cancel');
    cancelButton.addEventListener('click', function () {
      button.style.display = 'block';
      checkbox.checked = false;
      resetConfigCard(button.parentNode);
    });
    var confirmButton = button.parentNode.querySelector('.actions .confirm');
    confirmButton.addEventListener('click', function () {
      if (confirmButton.classList.contains('active')) {
        var numberDeck = button.parentNode.classList[1].slice(-1);
        var deck = document.querySelector(".deck".concat(numberDeck));
        var configCard = confirmButton.parentNode.parentNode;
        addCardsInDeck(deck, configCard);
        button.style.display = 'block';
        checkbox.checked = false;
        resetConfigCard(button.parentNode);
        confirmButton.classList.remove('active');
      }
    });
  });
});
var allCheckbox = document.querySelectorAll('.select-checkbox');
var selects = document.querySelectorAll('.select');
selects.forEach(function (select) {
  select.addEventListener('click', function (e) {
    allCheckbox.forEach(function (checkbox) {
      if (select.contains(checkbox)) {
        checkbox.checked = !checkbox.checked;
      } else {
        checkbox.checked = false;
      }
    });
  });
});
var options = document.querySelectorAll('.option');
options.forEach(function (option) {
  option.addEventListener('click', function (e) {
    var value = e.target.textContent;
    e.target.parentNode.parentNode.parentNode.querySelector('.title').textContent = value;
    checkConfigCard(option.parentNode.parentNode.parentNode.parentNode);
  });
});
var inputsNumber = document.querySelectorAll('.number-of-cards');
inputsNumber.forEach(function (input) {
  input.addEventListener('keyup', function (e) {
    var value = e.target.value;
    e.target.value = Math.round(parseFloat(value));

    if (e.target.value > 52) {
      e.target.value = 52;
    }

    checkConfigCard(input.parentNode);
  });
});
startGameButton.addEventListener('click', function () {
  if (startGameButton.classList.contains('active')) {
    document.querySelector('.game-area').classList.remove('mode-config');
    ordenDecks();
    document.querySelector('.config').style.display = 'none';
  }
});
var cardsContainers = document.querySelectorAll('.deck');
var decksDiscarded = document.querySelectorAll('.deckDiscarded');
var animationRunning = false;
cardsContainers.forEach(function (cardsContainer) {
  cardsContainer.addEventListener('click', function () {
    if (!animationRunning && cardsContainer.childElementCount > 0) {
      animationRunning = true;
      var cardsCount = cardsContainer.childElementCount - 1;
      var cardNumber = Math.round(Math.random() * cardsCount);
      var cardRandom = cardsContainer.querySelectorAll('.card')[cardNumber];
      var cardForAnimation = cardsContainer.querySelectorAll('.card')[cardsCount];
      var cardForAnimationContent = cardForAnimation.innerHTML;
      var cardRandomContent = cardRandom.innerHTML;
      cardForAnimation.innerHTML = cardRandomContent;
      cardRandom.innerHTML = cardForAnimationContent;
      cardForAnimation.classList.add('see');
      setTimeout(function () {
        var deckNumber = cardsContainer.classList[1].slice(-1);
        var deckDiscarded = document.querySelector(".deckDiscarded".concat(deckNumber));
        deckDiscarded.appendChild(cardForAnimation);
        ordenDecksDiscarded(cardForAnimation);
        animationRunning = false;
      }, 3000);
    }
  });
});

function ordenDeck(deck) {
  var cards = deck.querySelectorAll('.card');
  var space = 5;

  for (var i = 0; i < cards.length; i++) {
    cards[i].style.transform = "translate(0px, -".concat(space, "px) rotateX(-70deg) rotateY(0deg) rotateZ(10deg)");
    cards[i].style.zIndex = i;
    space += 5;
  }
}

function ordenDecks() {
  for (var i = 0; i < cardsContainers.length; i++) {
    var cards = cardsContainers[i].querySelectorAll('.card');
    var space = 5;

    for (var _i = 0; _i < cards.length; _i++) {
      cards[_i].style.transform = "translate(0px, -".concat(space, "px) rotateX(-70deg) rotateY(180deg) rotateZ(-10deg)");
      cards[_i].style.zIndex = _i;
      space += 5;
    }
  }
}

function ordenDecksDiscarded() {
  for (var i = 0; i < decksDiscarded.length; i++) {
    var cards = decksDiscarded[i].querySelectorAll('.card');
    var space = 5;

    for (var _i2 = 0; _i2 < cards.length; _i2++) {
      cards[_i2].classList.remove('see');

      cards[_i2].style.transform = "translate(0px, -".concat(space, "px) rotateX(-70deg) rotateY(0deg) rotateZ(10deg)");
      cards[_i2].style.zIndex = _i2;
      space += 5;
    }
  }
}

function checkConfigCard(configCard) {
  var confirmButton = configCard.querySelector('.actions .confirm');
  var numberCards = configCard.querySelector(".number-of-cards").value;
  var suit = configCard.querySelector(".suit").textContent;
  var cardInSuit = configCard.querySelector(".card-in-suit").textContent;

  if (numberCards == '' || suit == 'Suit' || cardInSuit == 'Card in suit') {
    confirmButton.classList.remove('active');
    return;
  }

  confirmButton.classList.add('active');
}

function checkStatusConfig() {
  var deck1 = document.querySelector('.deck1');
  var deck2 = document.querySelector('.deck2');
  var deck3 = document.querySelector('.deck3');

  if (deck1.childElementCount == 0 || deck2.childElementCount == 0 || deck3.childElementCount == 0) {
    startGameButton.classList.remove('active');
  } else {
    startGameButton.classList.add('active');
  }
}

function resetConfigCard(configCard) {
  var numberCards = configCard.querySelector(".number-of-cards").value = '1';
  var suit = configCard.querySelector(".suit").textContent = 'Suit';
  var cardInSuit = configCard.querySelector(".card-in-suit").textContent = 'Card in suit';
}

function addCardsInDeck(deck, configCard) {
  var numberCards = configCard.querySelector(".number-of-cards").value;
  var suit = configCard.querySelector(".suit").textContent;
  var cardInSuit = configCard.querySelector(".card-in-suit").textContent;
  var CIS;

  if (isNaN(parseInt(cardInSuit))) {
    CIS = cardInSuit[0];
  } else {
    CIS = cardInSuit;
  }

  for (var i = 0; i < numberCards; i++) {
    var card = document.createElement('div');
    card.setAttribute('class', 'card');
    card.innerHTML = "\n\t\t\t\t<div class=\"front\">\n\t\t\t\t\t<img src=\"./img/cards/".concat(CIS).concat(suit[0], ".png\">\n\t\t\t\t</div>\n\t\t\t\t<div class=\"reverse\"></div>\n\t\t");
    deck.appendChild(card);
  }

  ordenDeck(deck);
  checkStatusConfig();
}