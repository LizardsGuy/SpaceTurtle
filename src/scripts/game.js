document.addEventListener("DOMContentLoaded", () => {
    // add event listener to end turn (research how to just add it to the html?)
    document.getElementById('end-turn').addEventListener('click',
    function(){
        endTurn();
    })

    let soundOn = true;

    let start = document.querySelector(".start");
    start.addEventListener('click',
        function () {
            let main = document.querySelector(".main");
            let start = document.querySelector(".startScreen");
            let how = document.querySelector(".howToScreen");
            let git = document.querySelector(".gitHub");
            
            start.style.display = "none";
            how.style.display = "none";
            main.style.display = "flex";
            git.style.display = "none";
            drawHand();
            playMusic();
        }
    )

    let startNoSound = document.querySelector(".startNoSound");
    startNoSound.addEventListener('click',
        function () {
            let main = document.querySelector(".main");
            let start = document.querySelector(".startScreen");
            let how = document.querySelector(".howToScreen");
            let git = document.querySelector(".gitHub");
            git.style.display = "none";
            start.style.display = "none";
            how.style.display = "none";
            main.style.display = "flex";
            drawHand();
            soundOn = false;
        }
    )

    let howTo = document.querySelector(".howToOpen");
    howTo.addEventListener('click',
        function (){
            let howToScreen = document.querySelector(".howToScreen");
            let start = document.querySelector(".startScreen");
            let how = document.querySelector(".howToScreen");
            let git = document.querySelector(".gitHub");
            git.style.display = "none";
            start.style.display = "none";
            how.style.display = "none";
            howToScreen.style.display = "flex";
            howToScreen.addEventListener('click',
            function(){
                location.reload();
            })        
        }
    )

    // Player
    const player = { name: "SpaceTurtle", baseStrength: 0, strength: 0, defense: 0, maxHealth:50, hitPoints: 50, maxEnergy:3, energy: 3}
  

    // Monster
    let enemy = {
        name: "Grumby", maxHealth: 40, hitPoints: 40, defense: 0, strength: 0, vulnerable: 0, weak: 0, moves: [
            { name: 'Bop', impact: "attack", attack: 6, sound:`./src/sounds/grumbyAttack` },
            { name: 'Cower', impact: "defend", defense: 6, sound:`./src/sounds/grumbyDefend` }
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
        },
        {
            name: "The Goblin King",
            maxHealth: 160,
            hitPoints: 160,
            defense: 0,
            strength: 0,
            vulnerable: 0,
            weak: 0,
            moves: [
                { name: "'What are you doing here little turtle?'", impact: "brutalize", attack: 10, defense: 10 },
                { name: "'Tiny turtle get smash'", impact: "brutalize",attack: 12, defense: 12 },
                { name: "'Go away I want to sleep'", impact: "embiggen", attack: 10, gainStrength: 1 },
                { name: "'Yawwwnn'", impact: "embolden", defense: 10, gainStrength: 1 },
                { name: "'I have to do some stuff'", impact: "brutalize", attack: 10, defense: 10 },
            ]
        }
    ]

    let intentMove = {};

    let currentLevel = 0;
    let levelChecker = 0;

    // All Cards

    const allCards = [
        // { name: "Defend", defense: 5, cost: 1, description: 'Gain 5 defense'},
        // { name: "Punch", attack: 6, cost: 1, description: 'Deal 6 damage', img: "url('./src/styles/cards/card.jpg')" },
        // { name: "Really Angry Yelling", attack: 8, cost: 2, applyVulnerable: 2, description: 'Deal 8 damage. Apply 2 Vulnerable (enemy takes 50% more damage).', img: "url('./src/styles/cards/reallyAngryYelling.png')"},
        { name: "Shell Harden", cost: 2, gainStrength: 2, exhaust: true, description: 'Gain 2 strength this combat. Exhaust (card removed this battle).', img: "url('./src/styles/cards/shellHarden.png')" },
        { name: "Defensive Attack", attack: 5, defense: 5, cost: 1, description: 'Deal 5 damage. Gain 5 defense', img: "url('./src/styles/cards/defensiveAttack.png')" },
        { name: "Tip-Top-Tep-Tup-Tap", attack: 1, defense: 0, cost: 1, description: 'Deal 1 damage 5 times.', img: "url('./src/styles/cards/tipTap.png')"},
        { name: "Shrug It Off", defense: 8, cost: 1, description: "Gain 8 defense. Draw 1 card", img: "url('./src/styles/cards/shakeItOff.png')"},
        { name: "Body Slam", attack: player.defense, cost: 1, description: "Deal damage equal to your defense", img: "url('./src/styles/cards/bodySlam.png')"}
        // { name: "Growing Rage", attack: 7, cost: 0, description: "Attack for 7. Add a copy of this card to your discard"}
        // { name: "Thwack", attack: 10, applyWeak: 2, cost: 2, description: 'Deal 10 damage. Apply 2 Weak (enemy deals 50% less damage).'},
        // { name: "Flex", gainTurnStrength: 3, cost: 0, description: "Gain 3 Strength. At the end of the turn, lose 3 strength."},
        // { name: "Powerful Bomp", attack: 14, cost: 2, description: "Deal 14 damage. Strength affects this card 3 times."}
    ]

    let exhaustCards = []

    // Deck
    let deck = [
        { name: "Punch", attack: 6, cost: 1, description: `Deal ${6} damage`, img: "url('./src/styles/cards/punch.png')"},
        { name: "Punch", attack: 6, cost: 1, description: `Deal ${6} damage`, img: "url('./src/styles/cards/punch.png')"  },
        { name: "Punch", attack: 6, cost: 1, description: `Deal ${6} damage`, img: "url('./src/styles/cards/punch.png')"  },
        { name: "Punch", attack: 6, cost: 1, description: `Deal ${6} damage`, img: "url('./src/styles/cards/punch.png')"  },
        { name: "Punch", attack: 6, cost: 1, description: `Deal ${6} damage`, img: "url('./src/styles/cards/punch.png')" },
        { name: "Defend", defense: 5, cost: 1, description: 'Gain 5 defense', img: "url('./src/styles/cards/defend.png')" },
        { name: "Defend", defense: 5, cost: 1, description: 'Gain 5 defense', img: "url('./src/styles/cards/defend.png')" },
        { name: "Defend", defense: 5, cost: 1, description: 'Gain 5 defense', img: "url('./src/styles/cards/defend.png')" },
        { name: "Defend", defense: 5, cost: 1, description: 'Gain 5 defense', img: "url('./src/styles/cards/defend.png')" },
        { name: "Defend", defense: 5, cost: 1, description: 'Gain 5 defense', img: "url('./src/styles/cards/defend.png')" },
        { name: "Really Angry Yelling", attack: 8, defense: 0, cost: 2, applyVulnerable: 2, description: `Deal 8 damage. Apply 2 Vulnerable (enemy takes 50% more damage)`, img: "url('./src/styles/cards/reallyAngryYelling.png')"}
    ];

    // Discard

    let discard = []

    // Hand
    let hand = []
    let handSize = 0;
    let maxHandSize = 5;
    let drawAmount = 5; 

    // Gameplay Functions
    let cardBlocker = false;
    function drawHand() {
        // Draw Cards
        endTurnDisabler = true;
        cardBlocker = true;
        handSize = 0;
        const drawInterval = setInterval(() => {
            if (handSize < drawAmount) {
                drawCard();
            } else {
                clearInterval(drawInterval);
                endTurnDisabler = false;
                cardBlocker = false;
            }
        }, 300);
    }

    function checkEnemyDeath(){
        if(enemy.hitPoints <= 0){
            if(currentLevel + 1 === enemies.length){
                winGame();
            } else {
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
            exhaustCards = [];
            hand = [];
            addCard();
            currentLevel += 1;
            enemy = enemies[currentLevel];
            intention();
            enemy.weak = 0;
            enemy.vulnerable = 0;
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
        let restart = document.querySelector(".restart");
        let start = document.querySelector(".endScreen");
        let main = document.querySelector(".main");
        let text = document.querySelector(".winLoss");
        text.innerHTML = `You have lost to ${enemy.name}`
        start.style.display = "flex";
        main.style.display = "none";
        restart.addEventListener('click',
            function () {
                location.reload();
            }
        )
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
        health.innerHTML = `${player.hitPoints} / ${player.maxHealth}`;
        stats.innerHTML = `Energy: ${player.energy} / ${player.maxEnergy}`;
        if(player.defense > 0){
            stats.innerHTML += `<br> Defense: ${player.defense}`;
        }
        if(player.strength > 0){
            stats.innerHTML += `<br> Strength: ${player.strength}`;
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
        let text = document.querySelector(".addCard")
        text.innerHTML = ``
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
                intent.innerHTML = `Intent: Attack ${intentMove.attack}`;
                break;
            case "defend":
                intent.innerHTML = `Intent: Defend ${intentMove.defense}`;
                break;
            case "brutalize":
                intent.innerHTML = `Intent: Attack ${intentMove.attack}, Defend ${intentMove.defense}`;
                break;
            case "embolden":
                intent.innerHTML = `Intent: Defend ${intentMove.defense}, Strength Gain ${intentMove.gainStrength}`
                break;
            case "embiggen":
                intent.innerHTML = `Intent: Attack ${intentMove.attack}, Strength Gain ${intentMove.gainStrength}`
                break;
            default:
                break;
        }
    }

    function enemyTurn(){
        enemy.defense = 0;
        switch (intentMove.impact){
            case "attack":
                if(soundOn === true){
                var audio = `${intentMove.sound}${Math.floor(Math.random() * 3)}.mp3`
                playAudio(audio);
                };
                let attackValue = (intentMove.attack + enemy.strength);
                while (attackValue > 0 && player.defense > 0){
                    player.defense -= 1;
                    attackValue -= 1;
                }
                player.hitPoints -= attackValue;
                break;
            case "defend":
                if(soundOn === true){
                var audio = `${intentMove.sound}${Math.floor(Math.random() * 2)}.mp3`
                playAudio(audio);
                };
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
            case "brutalize":
                let attackValue3 = (intentMove.attack + enemy.strength);
                while (attackValue3 > 0 && player.defense > 0) {
                    player.defense -= 1;
                    attackValue3 -= 1;
                }
                player.hitPoints -= attackValue3;
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

    function drawCard(){
        if (soundOn === true) {
            var audio = `./src/sounds/cardDraw.mp3`
            playAudio(audio, true);
        };
        let cardList = document.querySelector('.card-list');
        if (handSize >= maxHandSize){
            let text = document.querySelector(".addCard")
            text.innerHTML = `Your hand is full!`
            setTimeout(function () { text.innerHTML = "" }, 4000);
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
              if (cardBlocker === false){
                if (player.energy >= card.cost) {
                    player.energy -= card.cost;
                    let attackValue = (card.attack + player.strength);
                    if (enemy.vulnerable > 0) {
                        attackValue *= 1.5
                    }
                    switch (card.name) {
                        case "Body Slam":
                            if (soundOn === true) {
                                var audio = `./src/sounds/bodySlam.mp3`
                                playAudio(audio);
                            };
                            damageApply(player.defense);
                            break;
                        case "Defend":
                            if (soundOn === true) {
                                var audio = `./src/sounds/defense.mp3`
                                playAudio(audio);
                            };
                            player.defense += card.defense;
                            handSize -= 1;
                            break;
                        case "Defensive Attack":
                            if (soundOn === true) {
                                var audio = `./src/sounds/defensiveAttack.mp3`
                                playAudio(audio);
                            };
                            damageApply(attackValue);
                            player.defense += card.defense;
                            handSize -= 1;
                            break;
                        case "Punch":
                            if (soundOn === true) {
                                var audio = `./src/sounds/punch.mp3`
                                playAudio(audio);
                            };
                            damageApply(attackValue);
                            handSize -= 1;
                            break;
                        case "Really Angry Yelling":
                            if (soundOn === true) {
                                var audio = `./src/sounds/reallyAngry.mp3`
                                playAudio(audio);
                            };
                            damageApply(attackValue);
                            enemy.vulnerable += card.applyVulnerable;
                            handSize -= 1;
                            break;
                        case "Shell Harden":
                            if (soundOn === true) {
                                var audio = `./src/sounds/harden.mp3`
                                playAudio(audio);
                            };
                            player.strength += card.gainStrength;
                            handSize -= 1;
                            exhaust(card);
                            this.remove(this);
                            break;
                        case "Shrug It Off":
                            if (soundOn === true) {
                                var audio = `./src/sounds/defense.mp3`
                                playAudio(audio);
                            };
                            if (soundOn === true) {
                                var audio = `./src/sounds/cardDraw.mp3`
                                playAudio(audio);
                            };
                            player.defense += card.defense;
                            handSize -= 1;
                            drawCard();
                            break;
                        case "Tip-Top-Tep-Tup-Tap":
                            if (soundOn === true) {
                                var audio = `./src/sounds/tipTap.mp3`
                                playAudio(audio);
                            };
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
                    let text = document.querySelector(".addCard")
                    text.innerHTML = `You have not enough energy`
                    setTimeout(function () { text.innerHTML = "" }, 4000);
                }
              } 
            })
        }
    }

    function addCard(){
        let main = document.querySelector(".main2");
        main.style.display = "none";
        let text = document.querySelector(".addCard")
        text.innerHTML = `You have defeated ${enemy.name}.<br><br>Choose a card to add to your deck.`
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
            if(card.img === undefined){
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
                cardLi.style.backgroundImage = "url('./src/styles/cards/card.jpg')"
                cardText.appendChild(cardName);
                cardText.appendChild(cardCost);
                cardText.appendChild(cardDescription);
                cardLi.appendChild(cardText);
            } else {
                cardLi.style.backgroundImage = `${card.img}`
            }
            cardLi.className = 'Card';
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
                    let main = document.querySelector(".main2");
                    main.style.display = "";
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

    function playAudio(url, card) {
        var audio = new Audio(url)
        audio.volume = 0.2;
        if(card === true){
            audio.volume = 0.05;
        }
        audio.play();
    }

    function playMusic() {
        var audio = new Audio("background.mp3")
        audio.volume = 0.2;
        audio.play();
        audio.loop = true;
    }


     // Game start
    updatePlayer();
    updateEnemy();
    intention();
})