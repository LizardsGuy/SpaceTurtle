document.addEventListener("DOMContentLoaded", () => {

    // add event listener to end turn (research how to just add it to the html?)
    document.getElementById('end-turn').addEventListener('click',
    function(){
        endTurn();
    })

    // Player

    const player = { name: "SpaceTurtle", defense: 0, hitPoints: 50, energy: 3 }

    // Monster

    const enemy = {name: "Slimey", hitPoints: 10}
    const enemyMoves = [
        {name: 'Attack', attack: 5},
        {name: 'Defend', defense: 5}
    ]

    // All Cards

    const allCards = [
        { name: "Punch", attack: 6, defense: 0, cost: 1, description: 'Deal 6 damage' },
        { name: "Defend", attack: 0, defense: 5, cost: 1, description: 'Gain 5 defense' },
        { name: "Shell Slam", attack: 10, defense: 6, cost: 2, description: 'Deal 10 damage. Gain 6 defense' }
    ]

    // Deck

    const deck = [
        { name: "Punch", attack: 6, defense: 0, cost: 1, description: 'Deal 6 damage' },
        { name: "Punch", attack: 6, defense: 0, cost: 1, description: 'Deal 6 damage' },
        { name: "Punch", attack: 6, defense: 0, cost: 1, description: 'Deal 6 damage' },
        { name: "Punch", attack: 6, defense: 0, cost: 1, description: 'Deal 6 damage' },
        { name: "Punch", attack: 6, defense: 0, cost: 1, description: 'Deal 6 damage' },
        { name: "Defend", attack: 0, defense: 5, cost: 1, description: 'Gain 5 defense' },
        { name: "Defend", attack: 0, defense: 5, cost: 1, description: 'Gain 5 defense' },
        { name: "Defend", attack: 0, defense: 5, cost: 1, description: 'Gain 5 defense' },
        { name: "Defend", attack: 0, defense: 5, cost: 1, description: 'Gain 5 defense' },
        { name: "Defend", attack: 0, defense: 5, cost: 1, description: 'Gain 5 defense' },
        { name: "Shell Slam", attack: 10, defense: 6, cost: 2, description: 'Deal 10 damage. Gain 6 defense' }
    ];

    // Discard

    const discard = []

    // Hand
    let hand = []
    let handSize = 0
    let maxHandSize = 10;
    let drawAmount = 5;

    // Turn

    drawHand();

    // Gameplay Functions

    function drawHand() {
        let cardList = document.querySelector('.card-list');
        // Draw Cards
        for (let draw = drawAmount; draw > 0 && handSize !== maxHandSize; draw--) {
            handSize += 1;
            let random = Math.floor(Math.random() * deck.length);
            let card = deck[random];
            deck.splice(random, 1);
            hand.push(card);
            let cardLi = document.createElement("li")
            cardLi.innerHTML = `${card.name}    ${card.description}`
            cardLi.className = 'Card';
            // cardLi.setAttribute('Attack', `${card.attack}`)
            // cardLi.setAttribute('Defense', `${card.defense}`)
            // cardLi.setAttribute('Cost', `${card.cost}`)
            // cardLi.setAttribute('Description', `${card.description}`)
            cardList.appendChild(cardLi)
            // playing a card
            cardLi.addEventListener('click',
                    function () {
                        //bug - cant move hand objects to discard on click
                        if (player.energy >= card.cost){
                            console.log("You clicked on a card")
                                player.energy -= card.cost;
                                enemy.hitPoints -= card.attack;
                                player.defense += card.defense;
                                checkEnemyDeath();
                                discard.push(card);
                                hand.splice(card, 1);
                                this.remove(this);
                                handSize -= 1;
                                debugger
                        } else {
                            console.log("You have not enough energy");
                        }
                    })
        }
    }

    function checkEnemyDeath(){
        if(enemy.hitPoints <= 0){
            console.log('you win')
        }
    }

    //bug - pushing lis not card obj to discard.
    function endTurn(){
        cards = document.querySelectorAll('li');
        cards.forEach(function(card){
            discard.push(card);
            card.remove();
        })
    }

    
    
    
    
})
