document.addEventListener("DOMContentLoaded", () => {
    // add event listener to end turn (research how to just add it to the html?)
    document.getElementById('end-turn').addEventListener('click',
    function(){
        endTurn();
    })

    // Player
    const player = { name: "SpaceTurtle", baseStrength: 0, strength: 0, defense: 0, maxHealth:50, hitPoints: 50, maxEnergy:3, energy: 3}
  

    // Monster
    let enemy = {
        name: "Slimey", maxHealth: 40, hitPoints: 40, defense: 0, strength: 0, vulnerable: 0, weak: 0, moves: [
            { name: 'Bop', impact: "attack", attack: 5 },
            { name: 'Cower', impact: "defend", defense: 5 }
        ]}
    const enemies = [
        { name: "Grumby", 
                    maxHealth: 40,             
                    hitPoints: 40,             
                    defense: 0,            
                    strength: 0,             
                    vulnerable: 0,               
                    weak: 0,
                    moves: [
                        { name: '"Bop"', impact: "attack", attack: 5 },
                        { name: 'Cower', impact: "defend", defense: 5 }
                    ]
        },
        { name: "Grumby's Angry Older Brother, Charles", 
                    maxHealth: 60, 
                    hitPoints: 60, 
                    defense: 0, 
                    strength: 0, 
                    vulnerable: 0, 
                    weak: 0,           
                    moves: [
                    { name: "'Where's my brudda?'", impact: "defend", defense: 15},
                    { name: "'Ima bop ya!'", impact: "attack", attack: 8 },
                    { name: "'Ima smash ya!'", impact: "attack", attack: 12 },
                    { name: "'Ima have to sit this one out'", impact: "defend", defense: 10}
                    ]
        },
        { name: "The Goblin Kings assasin",
                maxHealth: 120,
                hitPoints: 120,
                defense: 0,
                strength: 0,
                vulnerable: 0,
                weak: 0,
                moves: [
                    {name: "'You've been causing problems'", impact: "embolden", defense: 15, gainStrength: 1},
                    {name: "'Sharpening my blades...'", impact: "embolden", defense: 8, gainStrength: 2},
                    {name: "'You will pay for your incursion...'", impact: "attack", attack: 1},
                    {name: "'You will pay for your incursion...'", impact: "attack", attack: 1 },
                    {name: "' LeAvE No W ww W '", impact: "attack", attack: 4},
                    {name: "' huh...huh...'", impact: "defend", defense: 10}
                ]
        }
    ]
    // const enemyMoves = [
    //     {name: 'Attack', attack: 5},
    //     {name: 'Defend', defense: 5}
    // ]
    let intentMove = {};

    let currentLevel = 0;
    let levelChecker = 0;

    // All Cards

    const allCards = [
        { name: "Defend", defense: 5, cost: 1, description: 'Gain 5 defense' },
        { name: "Punch", attack: 6, cost: 1, description: 'Deal 6 damage' },
        { name: "Really Angry Yelling", attack: 8, cost: 2, applyVulnerable: 2, description: 'Deal 8 damage. Apply 2 Vulnerable (enemy takes 50% more damage)'},
        { name: "Shell Harden", cost: 2, gainStrength: 2, description: 'Gain 2 strength this combat' },
        { name: "Shell Slam", attack: 5, defense: 5, cost: 1, description: 'Deal 5 damage. Gain 5 defense' }
    ]

    // Deck

                                                                // interpolaton doesnt update
    let deck = [
        { name: "Punch", attack: 6, cost: 1, description: `Deal ${6 + player.strength} damage` },
        { name: "Punch", attack: 6, cost: 1, description: `Deal ${6 + player.strength} damage`  },
        { name: "Punch", attack: 6, cost: 1, description: `Deal ${6 + player.strength} damage`  },
        { name: "Punch", attack: 6, cost: 1, description: `Deal ${6 + player.strength} damage`  },
        { name: "Punch", attack: 6, cost: 1, description: `Deal ${6 + player.strength} damage` },
        { name: "Defend", defense: 5, cost: 1, description: 'Gain 5 defense' },
        { name: "Defend", defense: 5, cost: 1, description: 'Gain 5 defense' },
        { name: "Defend", defense: 5, cost: 1, description: 'Gain 5 defense' },
        { name: "Defend", defense: 5, cost: 1, description: 'Gain 5 defense' },
        { name: "Defend", defense: 5, cost: 1, description: 'Gain 5 defense' },
        { name: "Shell Harden", cost: 2, gainStrength: 2, description: 'Gain 2 strength this combat' },
        { name: "Really Angry Yelling", attack: 8, defense: 0, cost: 2, applyVulnerable: 2, description: `Deal ${8 + player.strength} damage. Apply 2 Vulnerable (enemy takes 50% more damage)` },
        // { name: "Shell Slam", attack: 5, defense: 5, cost: 1, description: 'Deal 5 damage. Gain 5 defense' },
    ];

    // Discard

    let discard = []

    // Hand
    let hand = []
    let handSize = 0;
    let maxHandSize = 5;
    let drawAmount = 5; 

    // Gameplay Functions
    function drawHand() {
        let cardList = document.querySelector('.card-list');
        // Draw Cards
        for (let draw = 0; draw < drawAmount && handSize !== maxHandSize; draw++) {
     
            if (deck.length === 0) {
                deck = discard.slice();
                shuffle(deck);
                discard = [];
            }
         
            handSize += 1;
            let random = Math.floor(Math.random() * deck.length);
            let card = deck[random];
            deck.splice(random, 1);
            hand.push(card);
            let cardLi = document.createElement("li");
            let cardText = document.createElement("div");
            cardText.className = "cardText";
            let cardName = document.createElement("div");
            cardName.className = "cardName";
            cardName.innerHTML = `${card.name}`;
            let cardCost = document.createElement("div");
            cardCost.className = "cardCost";
            cardCost.innerHTML = `(${card.cost})`;
            let cardDescription = document.createElement("div");
            cardDescription.className = "cardDescription";
            cardDescription.innerHTML = `${card.description}`;
            cardLi.className = 'Card';
            cardText.appendChild(cardName);
            cardText.appendChild(cardCost);
            cardText.appendChild(cardDescription);
            cardLi.appendChild(cardText);
            cardList.appendChild(cardLi);

            // playing a card
            cardLi.addEventListener('click',
    
                    function () {
                        if (player.energy >= card.cost){
                                player.energy -= card.cost;
                                let attackValue = (card.attack + player.strength);
                                if (enemy.vulnerable > 0) {
                                    attackValue *= 1.5
                                }
                                switch (card.name) {
                                    case "Defend":
                                        player.defense += card.defense;
                                        break;
                                    case "Punch":
                                        damageApply(attackValue);
                                        break;
                                    case "Really Angry Yelling":
                                        damageApply(attackValue);
                                        enemy.vulnerable += card.applyVulnerable;
                                        break;
                                    case "Shell Harden":
                                        player.strength += card.gainStrength;
                                        updatePlayer();
                                        break;
                                    case "Shell Slam":
                                        damageApply(attackValue);
                                        player.defense += card.defense;
                                        break;
                                    default:
                                        break;
                                }
                                updatePlayer();
                                updateEnemy();
                                if(checkEnemyDeath() === true){
                                } else { 
                                    debugger;
                                index = hand.indexOf(card);
                                discard.push(card);
                                hand.splice(index, 1);
                                this.remove(this);
                                handSize -= 1;
                                }
                        } else {
                            alert("You have not enough energy");
                        }
                    })
        }
    }

    function checkEnemyDeath(){
        if(enemy.hitPoints <= 0){
            currentLevel += 1;
            alert(`You have defeated the enemy! Welcome to level ${currentLevel + 1}`)
            enemy = enemies[currentLevel];
            intention();
            enemy.weak = 0;
            enemy.vulnerable = 0;
            updateEnemy();
            cards = document.querySelectorAll('li');
            cards.forEach(function (card) {
                card.remove();
            })
            hand.forEach(function (card) {
                discard.push(card);
                handSize -= 1;
            })
            hand = [];
            drawHand();
            player.strength = player.baseStrength;
            player.energy = player.maxEnergy;
            player.defense = 0;
            updatePlayer();
            return true;
        } else{
            return false;
        }
    }

    function checkPlayerDeath(){
        if(player.hitPoints <= 0){
            alert('you lose');
        }
    }

    function damageApply(attackValue){
        while (attackValue > 0 && enemy.defense > 0) {
            enemy.defense -= 1;
            attackValue -= 1;
        }
        enemy.hitPoints -= attackValue;
    }

    function updatePlayer() {
        let stats = document.querySelector(".stats");
        let health = document.querySelector(".health");
        health.innerHTML = `Hit Points: ${player.hitPoints} / ${player.maxHealth}`
        stats.innerHTML = `Energy: ${player.energy} / ${player.maxEnergy}`;
        if(player.defense > 0){
            stats.innerHTML += `<br> Defense: ${player.defense}`
        }
        if(player.strength > 0){
            stats.innerHTML += `<br> Strength: ${player.strength}`
        }
    }

    function updateEnemy() {
        let name = document.querySelector(".enemyName");
        name.innerHTML = `${enemy.name}`;
        let enemyStats = document.querySelector(".enemy-stats");
        enemyStats.innerHTML = `Hit Points: ${enemy.hitPoints} / ${enemy.maxHealth}`;
        if (levelChecker !== currentLevel){
        let enemyImg = document.querySelector(`.enemyImg${levelChecker}`);
        enemyImg.className = `enemyImg${currentLevel}`;
        levelChecker += 1;
        }
        document.getElementsByClassName("myEle").class
        if (enemy.defense > 0) {
            enemyStats.innerHTML += ` <br> Defense: ${enemy.defense}`;
        }
        if (enemy.strength > 0) {
            enemyStats.innerHTML += `<br> Strength: ${enemy.strength}`
        }
        if (enemy.vulnerable > 0){
            enemyStats.innerHTML += ` <br> Vulnerable: ${enemy.vulnerable}`;
        }
    }
    
    function endTurn(){
        cards = document.querySelectorAll('li');
        cards.forEach(function(card){
            card.remove();
        })
        hand.forEach(function(card){
            discard.push(card);
            handSize -= 1;
        })
        enemyTurn();
    }

    function intention() {
        let random = Math.floor(Math.random() * enemy.moves.length)
        let intent = document.querySelector('.intent');
        let intentName = document.querySelector('.intentName');
        intentMove = enemy.moves[random];
        intentName.innerHTML = `${intentMove.name}`
        switch (intentMove.impact) {
            case "attack":
                intent.innerHTML = `Attack: ${intentMove.attack}`;
                break;
            case "defend":
                intent.innerHTML = `Defend: ${intentMove.defense}`;
                break;
            case "embolden":
                intent.innerHTML = `Defend: ${intentMove.defense} Strength Gain: ${intentMove.gainStrength}`
                break;
            default:
                break;
        }
    }

    function enemyTurn(){
        enemy.defense = 0;
        switch (intentMove.impact){
            case "attack":
                let attackValue = (intentMove.attack + enemy.strength);
                while (attackValue > 0 && player.defense > 0){
                    player.defense -= 1;
                    attackValue -= 1;
                }
                player.hitPoints -= attackValue;
            case "defend":
                enemy.defense += intentMove.defense;
                updateEnemy();
                break;
            case "embolden":
                enemy.strength += intentMove.gainStrength;
                enemy.defense += intentMove.defense;
                updateEnemy();
                break;
            default:
                break;
        }
        if(enemy.vulnerable > 0){
            enemy.vulnerable -= 1;
        }
        if(enemy.weak > 0){
            enemy.weak -= 1;
        }
        hand = [];
        drawHand();
        player.energy = player.maxEnergy;
        player.defense = 0;
        updatePlayer();
        checkPlayerDeath();
        intention();
        updateEnemy();
    }

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }


     // Turn
    updatePlayer();
    updateEnemy();
    drawHand();
    intention();
    
})
