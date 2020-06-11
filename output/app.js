"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

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
        var numberCards = configCard.querySelector(".number-of-cards").value;
        var suit = configCard.querySelector(".suit").textContent;
        var cardInSuit = configCard.querySelector(".card-in-suit").textContent;
        addCardsInDeck(deck, {
          numberCards: numberCards,
          suit: suit,
          cardInSuit: cardInSuit
        });
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
    document.body.style.minHeight = "65em";
  }
});
var cardsContainers = document.querySelectorAll('.deck');
var decksDiscarded = document.querySelectorAll('.deckDiscarded');
var animationRunning = false;
cardsContainers.forEach(function (cardsContainer) {
  cardsContainer.addEventListener('click', function () {
    if (!animationRunning && cardsContainer.childElementCount > 0) {
      animationRunning = true;
      var cardsCount = cardsContainer.querySelectorAll('.card').length - 1;
      var cardNumber = getRandomIntInclusive(0, cardsCount);
      var cardRandom = cardsContainer.querySelectorAll('.card')[cardNumber];
      var cardForAnimation = cardsContainer.querySelectorAll('.card')[cardsCount];
      var cardForAnimationContent = cardForAnimation.innerHTML;
      var cardRandomContent = cardRandom.innerHTML;
      cardRandom.innerHTML = cardForAnimationContent;
      cardForAnimation.innerHTML = cardRandomContent;
      var deckNumber = cardsContainer.classList[1].slice(-1);
      var deckDiscarded = document.querySelector(".deckDiscarded".concat(deckNumber));
      cardForAnimation.style.zIndex = "100";
      var space = 0;

      if (deckDiscarded.childElementCount > 0) {
        space = getSpace(deckDiscarded.querySelectorAll('.card')[deckDiscarded.childElementCount - 1].style.transform);
      }

      cardForAnimation.style.transition = "all 1s ease";
      cardForAnimation.style.transform = "rotateX(0deg) rotateY(0deg) rotateZ(0deg)";
      cardForAnimation.style.top = "calc(-100% - ".concat(space, "px)");
      setTimeout(function () {
        cardForAnimation.style.top = "calc(-100% - ".concat(space, "px)");
        setTimeout(function () {
          cardForAnimation.style.transform = "rotateX(-70deg) rotateY(0deg) rotateZ(10deg)";
          setTimeout(function () {
            deckDiscarded.appendChild(cardForAnimation);
            ordenDeckDiscarded(deckDiscarded);
            animationRunning = false;
          }, 1000);
        }, 200);
      }, 1000);
    }
  });
});

function getSpace(cardStyle) {
  var param1 = cardStyle.indexOf('-') + 1;
  var param2 = cardStyle.indexOf(')');
  return parseInt(cardStyle.slice(param1, param2));
}

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

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

function ordenDeckDiscarded(deckDiscarded) {
  var cards = deckDiscarded.querySelectorAll('.card');

  if (deckDiscarded.childElementCount - 2 >= 0) {
    var card = cards[deckDiscarded.childElementCount - 2];
    var zIndex = card.style.zIndex;
    var space = getSpace(card.style.transform);
    var position = deckDiscarded.childElementCount - 1;
    cards[position].style.transition = "none";
    cards[position].style.top = "0";
    cards[position].style.zIndex = "".concat(parseInt(zIndex) + 1);
    cards[position].style.transform = "translate(0px, -".concat(space + 5, "px) rotateX(-70deg) rotateY(0deg) rotateZ(10deg)");
  } else {
    cards[0].style.transition = "none";
    cards[0].style.top = "0";
    cards[0].style.zIndex = "0";
    cards[0].style.transform = "translate(0px, -5px) rotateX(-70deg) rotateY(0deg) rotateZ(10deg)";
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
  var numberCards = configCard.numberCards,
      suit = configCard.suit,
      cardInSuit = configCard.cardInSuit;
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

function uploadConfigurationFile(_x) {
  return _uploadConfigurationFile.apply(this, arguments);
}

function _uploadConfigurationFile() {
  _uploadConfigurationFile = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(dataText) {
    var data, configuration, i, deck, j, card, numberCards, cardInSuit, suit;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            data = dataText.replace(/ /g, "");
            data = data.replace(/\r?\n|\r/g, " ");
            data = data.toUpperCase();
            configuration = data.split("DECK");
            configuration = configuration.filter(function (deck) {
              return deck;
            });

            for (i = 0; i < 3; i++) {
              configuration[i] = configuration[i].trim();
              deck = configuration[i].split(' ');

              for (j = 0; j < deck.length; j++) {
                card = deck[j].split(',');
                numberCards = card[0];
                cardInSuit = card[1];
                suit = card[2];
                addCardsInDeck(document.querySelector(".deck".concat(i + 1)), {
                  numberCards: numberCards,
                  suit: suit,
                  cardInSuit: cardInSuit
                });
              }
            }

          case 6:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _uploadConfigurationFile.apply(this, arguments);
}

document.querySelector('.btn-upload').addEventListener('click', function () {
  var inputFile = document.querySelector('#fileConfiguration');
  inputFile.click();
  inputFile.addEventListener('change', function (e) {
    var event = e;
    var file = inputFile.files[0];
    var reader = new FileReader();

    reader.onload = function (e) {
      var dataText = e.target.result;
      uploadConfigurationFile(dataText);
    };

    reader.readAsText(file);
  });
});