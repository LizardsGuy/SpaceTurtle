document.addEventListener("DOMContentLoaded", () => {
    // add event listener to end turn (research how to just add it to the html?)
    document.getElementById('end-turn').addEventListener('click',
    function(){
        endTurn();
    })

    let start = document.querySelector(".start");
    start.addEventListener('click',
        function () {
            let main = document.querySelector(".main");
            let start = document.querySelector(".startScreen");
            let how = document.querySelector(".howTo");
            start.style.display = "none";
            how.style.display = "none";
            main.style.display = "flex";
            drawHand();
        }

    )

    // Player
    const player = { name: "SpaceTurtle", baseStrength: 0, strength: 0, defense: 0, maxHealth:50, hitPoints: 50, maxEnergy:3, energy: 3}
  

    // Monster
    let enemy = {
        name: "Grumby", maxHealth: 40, hitPoints: 40, defense: 0, strength: 0, vulnerable: 0, weak: 0, moves: [
            { name: 'Bop', impact: "attack", attack: 6 },
            { name: 'Cower', impact: "defend", defense: 6 }
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
                        { name: '"Bop"', impact: "attack", attack: 6 },
                        { name: 'Cower', impact: "defend", defense: 6 }
                    ]
        },
        { name: "Grumby's Older Brother, Charles", 
                    maxHealth: 60, 
                    hitPoints: 60, 
                    defense: 0, 
                    strength: 0, 
                    vulnerable: 0, 
                    weak: 0,           
                    moves: [
                    { name: "'Where's my brudda?'", impact: "defend", defense: 15},
                    { name: "'I'm bop ya!'", impact: "attack", attack: 8 },
                    { name: "'I'm smash ya!'", impact: "attack", attack: 12 },
                    { name: "'I'm take a break!'", impact: "defend", defense: 10}
                    ]
        },
        { name: "The Goblin Kings Assassin",
                maxHealth: 120,
                hitPoints: 120,
                defense: 0,
                strength: 0,
                vulnerable: 0,
                weak: 0,
                moves: [
                    {name: "'You've been causing problems...'", impact: "embolden", defense: 15, gainStrength: 1},
                    {name: "'Sharpening my blades...'", impact: "embolden", defense: 5, gainStrength: 2},
                    {name: "'You will pay for your incursion...'", impact: "embiggen", attack: 1, gainStrength: 1},
                    {name: "'These blades only get stronger...'", impact: "embiggen", attack: 1, gainStrength: 1},
                    {name: "' Better run kid...'", impact: "embiggen", attack: 1, gainStrength: 1},
                    {name: "' huh...'", impact: "defend", defense: 20}
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
        // { name: "Defend", defense: 5, cost: 1, description: 'Gain 5 defense'},
        // { name: "Punch", attack: 6, cost: 1, description: 'Deal 6 damage', img: "url('./src/styles/cards/card.jpg')" },
        { name: "Really Angry Yelling", attack: 8, cost: 2, applyVulnerable: 2, description: 'Deal 8 damage. Apply 2 Vulnerable (enemy takes 50% more damage).'},
        { name: "Shell Harden", cost: 2, gainStrength: 2, exhaust: true, description: 'Gain 2 strength this combat. Exhaust (card removed this battle).' },
        { name: "Defensive Attack", attack: 5, defense: 5, cost: 1, description: 'Deal 5 damage. Gain 5 defense' },
        { name: "Tip-Top-Tep-Tup-Tap", attack: 1, defense: 0, cost: 1, description: 'Deal 1 damage 5 times.'},
        { name: "Shrug It Off", defense: 8, cost: 1, description: "Gain 8 defense. Draw 1 card"},
        { name: "Body Slam", attack: player.defense, cost: 1, description: "Deal damage equal to your defense"}
        // { name: "Growing Rage", attack: 7, cost: 0, description: "Attack for 7. Add a copy of this card to your discard"}
        // { name: "Thwack", attack: 10, applyWeak: 2, cost: 2, description: 'Deal 10 damage. Apply 2 Weak (enemy deals 50% less damage).'},
        // { name: "Flex", gainTurnStrength: 3, cost: 0, description: "Gain 3 Strength. At the end of the turn, lose 3 strength."},
        // { name: "Powerful Bomp", attack: 14, cost: 2, description: "Deal 14 damage. Strength affects this card 3 times."}
    ]

    const exhaustCards = []

    // Deck

                                                                // interpolaton doesnt update
    let deck = [
        { name: "Punch", attack: 6, cost: 1, description: `Deal ${6 + player.strength} damage`, img: "url('./src/styles/cards/punch.png')"},
        { name: "Punch", attack: 6, cost: 1, description: `Deal ${6 + player.strength} damage`, img: "url('./src/styles/cards/punch.png')"  },
        { name: "Punch", attack: 6, cost: 1, description: `Deal ${6 + player.strength} damage`, img: "url('./src/styles/cards/punch.png')"  },
        { name: "Punch", attack: 6, cost: 1, description: `Deal ${6 + player.strength} damage`, img: "url('./src/styles/cards/punch.png')"  },
        { name: "Punch", attack: 6, cost: 1, description: `Deal ${6 + player.strength} damage`, img: "url('./src/styles/cards/punch.png')" },
        { name: "Defend", defense: 5, cost: 1, description: 'Gain 5 defense', img: "url('./src/styles/cards/defend.png')" },
        { name: "Defend", defense: 5, cost: 1, description: 'Gain 5 defense', img: "url('./src/styles/cards/defend.png')" },
        { name: "Defend", defense: 5, cost: 1, description: 'Gain 5 defense', img: "url('./src/styles/cards/defend.png')" },
        { name: "Defend", defense: 5, cost: 1, description: 'Gain 5 defense', img: "url('./src/styles/cards/defend.png')" },
        { name: "Defend", defense: 5, cost: 1, description: 'Gain 5 defense', img: "url('./src/styles/cards/defend.png')" },
        { name: "Really Angry Yelling", attack: 8, defense: 0, cost: 2, applyVulnerable: 2, description: `Deal 8 damage. Apply 2 Vulnerable (enemy takes 50% more damage)`}
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
        // Draw Cards
        endTurnDisabler = true;

        // crap hack to fix extra card draw on add card, figure out!
        // BUG - can play card before hand is fully drawn, allows for extra card draw.
        handSize = 0;
        const drawInterval = setInterval(() => {
            if (handSize < drawAmount) {
                drawCard();
            } else {
                clearInterval(drawInterval);
                endTurnDisabler = false;
            }
        }, 500);
    }

    function checkEnemyDeath(){
        if(enemy.hitPoints <= 0){
            currentLevel += 1;
            if(currentLevel === enemies.length){
                winGame();
            } else {
            debugger;
            alert(`You have defeated the enemy! Welcome to level ${currentLevel + 1}`)
            enemy = enemies[currentLevel];
            intention();
            enemy.weak = 0;
            enemy.vulnerable = 0;
            cards = document.querySelectorAll('li');
            cards.forEach(function (card) {
                card.remove();
            })
            hand.forEach(function (card) {
                discard.push(card);
                handSize -= 1;
            })
            exhaustCards.forEach(function (card){
                discard.push(card);
            })
            hand = [];
            addCard();
            // drawHand();
            updateEnemy();
            player.strength = player.baseStrength;
            player.energy = player.maxEnergy;
            player.defense = 0;
            updatePlayer();
            return true;
        }
        } else{
            return false;
        }
    }

    function checkPlayerDeath(){
        if(player.hitPoints <= 0){
            alert('you lose');
            location.reload();
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

    let endTurnDisabler = false;
    function endTurn(){
        if (endTurnDisabler === false){
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
            case "embiggen":
                intent.innerHTML = `Attack: ${intentMove.attack} Strength Gain: ${intentMove.gainStrength}`
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
            case "embiggen":
                let attackValue2 = (intentMove.attack + enemy.strength);
                while (attackValue2 > 0 && player.defense > 0) {
                    player.defense -= 1;
                    attackValue2 -= 1;
                }
                player.hitPoints -= attackValue2;
                enemy.strength += intentMove.gainStrength;
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

    function drawCard(){
        let cardList = document.querySelector('.card-list');
        if (handSize >= maxHandSize){
            alert('Your hand is full!');
        } else {
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
        if(card.img === undefined){
            cardLi.style.backgroundImage = "url('./src/styles/cards/card.jpg')"
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
            cardText.appendChild(cardName);
            cardText.appendChild(cardCost);
            cardText.appendChild(cardDescription);
            cardLi.appendChild(cardText);
        } else {
            cardLi.style.backgroundImage = `${card.img}`
        }
        cardLi.className = 'Card';
        cardList.appendChild(cardLi);

        // playing a card
        cardLi.addEventListener('click',

            function () {
                if (player.energy >= card.cost) {
                    player.energy -= card.cost;
                    let attackValue = (card.attack + player.strength);
                    if (enemy.vulnerable > 0) {
                        attackValue *= 1.5
                    }
                    switch (card.name) {
                        case "Body Slam":
                            damageApply(player.defense);
                            break;
                        case "Defend":
                            player.defense += card.defense;
                            handSize -= 1;
                            break;
                        case "Defensive Attack":
                            damageApply(attackValue);
                            player.defense += card.defense;
                            handSize -= 1;
                            break;
                        case "Punch":
                            damageApply(attackValue);
                            handSize -= 1;
                            break;
                        case "Really Angry Yelling":
                            damageApply(attackValue);
                            enemy.vulnerable += card.applyVulnerable;
                            handSize -= 1;
                            break;
                        case "Shell Harden":
                            player.strength += card.gainStrength;
                            handSize -= 1;
                            exhaust(card);
                            this.remove(this);
                            break;
                        case "Shrug It Off":
                            player.defense += card.defense;
                            handSize -= 1;
                            drawCard();
                            break;
                        case "Tip-Top-Tep-Tup-Tap":
                            let i = 0
                            while (i < 5) {
                                damageApply(attackValue);
                                i += 1
                            }
                            handSize -= 1;
                            break;
                        default:
                            break;
                        }
                    updatePlayer();
                    updateEnemy();
                    if (checkEnemyDeath() === false) {
                        index = hand.indexOf(card);
                        if(card.exhaust !== true){
                        discard.push(card);
                        hand.splice(index, 1);
                        }
                        this.remove(this);
                    }
                } else {
                    alert("You have not enough energy");
                }
            })
        }
    }

    function addCard(){
        let text = document.querySelector(".addCard")
        text.innerHTML = "CHOOSE A CARD TO ADD TO YOUR DECK"
        endTurnDisabler = true;
        let choices = [];
        let i = 0
        while(i < 3){
            let random = Math.floor(Math.random() * allCards.length)
            let card = allCards[random]
            index = allCards.indexOf(card);
            choices.push(card)
            allCards.splice(index, 1);
            i += 1
        }
        let choiceList = document.querySelector('.card-list');
        choices.forEach(function(card){
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
            cardLi.style.backgroundImage = "url('./src/styles/cards/card.jpg')"
            cardText.appendChild(cardName);
            cardText.appendChild(cardCost);
            cardText.appendChild(cardDescription);
            cardLi.appendChild(cardText);
            choiceList.appendChild(cardLi);
            cardLi.addEventListener('click',

                function () {
                    deck.push(card);
                    cards = document.querySelectorAll('li');
                    cards.forEach(function (card) {
                        card.remove();
                    })
                    choices.forEach(function (card){
                        allCards.push(card);
                    })
                    drawHand();
                    endTurnDisabler = false;
                    let text = document.querySelector(".addCard")
                    text.innerHTML = ""
                })
        })
    }

    // function winGame(){
    //     if 
    // }

    function exhaust(card){
        index = hand.indexOf(card);
        exhaustCards.push(card);
        hand.splice(index, 1);
    }

    function winGame(){
        let restart = document.querySelector(".restart");
        let start = document.querySelector(".endScreen");
        let main = document.querySelector(".main");
        start.style.display = "flex";
        main.style.display = "none";
        restart.addEventListener('click',
            function () {
                location.reload();
            }

        )
    }


     // Game start
    updatePlayer();
    updateEnemy();
    intention();
    
})
