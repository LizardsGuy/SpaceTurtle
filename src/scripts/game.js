document.addEventListener("DOMContentLoaded", () => {

    console.log("hey");

    // Player
    const player = { name: "SpaceTurtle", HP: 50, energy: 3 }
    // Monster

    // All Cards
    const cards = [
        { name: "Fire", attack: 6, defense: 0, cost: 1, description: 'Deal 6 damage' },
        { name: "Defend", attack: 0, defense: 5, cost: 1, description: 'Gain 5 defense' },
        { name: "Double Down", attack: 10, defense: 6, cost: 2, description: 'Deal 10 damage. Gain 6 defense' }
    ]

    // Deck
    const deck = [
        { name: "Fire", attack: 6, defense: 0, cost: 1, description: 'Deal 6 damage' },
        { name: "Fire", attack: 6, defense: 0, cost: 1, description: 'Deal 6 damage' },
        { name: "Fire", attack: 6, defense: 0, cost: 1, description: 'Deal 6 damage' },
        { name: "Fire", attack: 6, defense: 0, cost: 1, description: 'Deal 6 damage' },
        { name: "Fire", attack: 6, defense: 0, cost: 1, description: 'Deal 6 damage' },
        { name: "Defend", attack: 0, defense: 5, cost: 1, description: 'Gain 5 defense' },
        { name: "Defend", attack: 0, defense: 5, cost: 1, description: 'Gain 5 defense' },
        { name: "Defend", attack: 0, defense: 5, cost: 1, description: 'Gain 5 defense' },
        { name: "Defend", attack: 0, defense: 5, cost: 1, description: 'Gain 5 defense' },
        { name: "Defend", attack: 0, defense: 5, cost: 1, description: 'Gain 5 defense' },
        { name: "Double Down", attack: 10, defense: 6, cost: 2, description: 'Deal 10 damage. Gain 6 defense' }
    ];

    // Hand
    let hand = []
    let drawAmount = 5

    // Turn
    function playerTurn() {
        hand = []
        let cardList = document.querySelector('.card-list')
        // Draw Cards
        for (let draw = drawAmount; draw > 0; draw--) {
            let random = Math.round(Math.random() * deck.length);
            let card = deck[random];
            deck.splice(random, 1);
            hand.push(card);
            let cardLi = document.createElement("li")
            cardLi.innerHTML = card.name
            cardList.appendChild(cardLi)
        }
    }

    //Gameplay
    debugger
    playerTurn();

})
