//create a character object that has all the data each character needs
function Character(name, id, healthPoints, attackPower, counterAttackPower, imgPath) {
  this.name = name;
  this.id = id;
  this.healthPoints = healthPoints;
  this.baseHealthPoints = healthPoints;
  this.attackPower = attackPower;
  this.baseAttackPower = attackPower;
  this.counterAttackPower = counterAttackPower;
  this.imgPath = "assets/images/" + imgPath + ".jpg";
  this.element = null;
}

//instantiate characters, assigning each to a variable
var obiWanKenobi = new Character("Obi-Wan Kenobi", "obi", 120, 8, 12, "obi-wan-kenobi");
var lukeSkywalker = new Character("Luke Skywalker", "luke", 100, 15, 8, "luke-skywalker");
var darthSidious = new Character("Darth Sidious", "sidious", 150, 6, 15, "darth-sidious");
var darthMaul = new Character("Darth Maul", "maul", 180, 3, 25, "darth-maul");

//store characters in an array
var characters = [obiWanKenobi, lukeSkywalker, darthSidious, darthMaul];

//create jquery elements for each character, to be appended to the character selection area
var $obi = $("<div>");
var $luke = $("<div>");
var $sidious = $("<div>");
var $maul = $("<div>");

//store the jquery character elements in an array
var charElements = [$obi, $luke, $sidious, $maul];

//for each character
for (var i = 0; i < characters.length; i++) {

  //give the corresponding charElement className 'char-container'
  charElements[i].addClass("char-container");

  //give the corresponding charElement a unique id
  charElements[i].attr("id", characters[i].id);

  //insert a header into the corresponding charElement
  var $head = $("<h3>");
  $head.text(characters[i].name);
  charElements[i].append($head);

  //insert an image into the corresponding charElement
  var $img = $("<img>");
  $img.attr("src", characters[i].imgPath);
  $img.attr("alt", characters[i].name);
  charElements[i].append($img);

  //insert the character's hp into the corresponding charElement
  var $hp = $("<p>");
  $hp.text(characters[i].healthPoints);
  charElements[i].append($hp);

  //set the character's element property to the corresponding charElement
  characters[i].element = charElements[i];

  //append the character jquery selection to the #characters div
  $("#characters").append(charElements[i]);

}

//game object constructor
//this holds all the information about the state of the game
function Game() {
  this.state = "selection";
  this.player = null;
  this.defenders = [];
  this.currentDefender = null;
}

//instantiate game
var game = new Game();

//hide restart button
$("#restart").hide();

//clicking character chooses player in 'selection' state,
//picks defender in defender selection state
$(".char-container").on("click", function(event) {

  //if the game is in selection mode,
  //set game.player equal to the player clicked
  //and add the others to the defenders array
  if (game.state === "selection") {

    //whichever character is picked, assign game.player to that character
    switch ($(this).attr("id")) {
      case "obi":
        game.player = obiWanKenobi;
        break;
      case "luke":
        game.player = lukeSkywalker;
        break;
      case "sidious":
        game.player = darthSidious;
        break;
      case "maul":
        game.player = darthMaul;
        break;
    }

    //set the game state to 'defender selection'
    game.state = "defender selection";

    //add the other characters to the defenders array
    for (var i = 0; i < characters.length; i++) {
      if (characters[i] !== game.player) {
        game.defenders.push(characters[i]);
      }
    }

    //append the selected player to #you div
    $("#you").append(game.player.element);
    // game.player.element.hide().fadeIn(200).show();

    //add .enemy class to each defender and append to #enemies div
    for (var i = 0; i < game.defenders.length; i++) {
      game.defenders[i].element.addClass("enemy");
      $("#enemies").append(game.defenders[i].element);
      // game.defenders[i].element.hide().fadeIn(200 * (i + 1)).show();
    }

  }

});


//if one of the enemies is clicked during 'defender selection' state...
$("#enemies").on("click", ".enemy", function(event) {

  //if game.state is 'defender selection'
  if (game.state === 'defender selection') {

    //whichever enemy is picked, assign game.currentDefender to that character
    switch ($(this).attr("id")) {
      case "obi":
        game.currentDefender = obiWanKenobi;
        break;
      case "luke":
        game.currentDefender = lukeSkywalker;
        break;
      case "sidious":
        game.currentDefender = darthSidious;
        break;
      case "maul":
        game.currentDefender = darthMaul;
        break;
    }

    //change game state to 'battle' 
    game.state = 'battle';

    //move the enemy to the #defender div and add class .defender
    $("#defender").append(game.currentDefender.element);
    game.currentDefender.element.removeClass("enemy");
    game.currentDefender.element.addClass("defender");
    
  }

});

//when the attack button is clicked... 
$("#attack").on("click", function(event) {

  //if game state is 'defender selection', display a message that no enemy is here
  if (game.state === 'defender selection') {
    $("#message p").text("No enemy here.");
  }

  //if game state is 'battle'
  if (game.state === "battle") {

    //subtract appropriate amount of health points from defender
    game.currentDefender.healthPoints -= game.player.attackPower;

    //increase player's attack power by base attack power
    game.player.attackPower += game.player.baseAttackPower;

    //if current defender is dead...
    if (game.currentDefender.healthPoints <= 0) {

      //detach defender from #defender div
      game.currentDefender.element.detach();

      //remove defender from array
      var defenderIndex = game.defenders.indexOf(game.currentDefender);
      game.defenders.splice(defenderIndex, 1);

      //if there are no remaining defenders...
      if (game.defenders.length === 0) {

        //set game state to 'over'
        game.state = "over";

        //display message indicating the player has won
        $("#message p").text("You won! GAME OVER!!!");

      } else {

        //otherwise, make player select next defender
        game.state = "defender selection";

        //display message indicating the player has defeated this defender
        $("#message p").text("You have defeated " + game.currentDefender.name + "! You can choose to fight another enemy.");

      }

    } else {

      //subtract defenders counter attack power from player
      game.player.healthPoints -= game.currentDefender.counterAttackPower;

      //display the current health points for player and defender
      game.player.element.find("p").text(game.player.healthPoints); 
      game.currentDefender.element.find("p").text(game.currentDefender.healthPoints);

      //if player is dead, end game
      if (game.player.healthPoints <= 0) {

        //set game state to 'over'
        game.state = "over";

        //display message indicating the player has been defeated
        $("#message p").text("You have been defeated...GAME OVER!!!");

      } else {

        //display message indicating your attack damage and 
        //the defender's counter attack damage
        var lastAttack = game.player.attackPower - game.player.baseAttackPower;
        $("#message p").text("You attacked " + game.currentDefender.name + " for " + 
          lastAttack + " damage. " + game.currentDefender.name +
          " attacked for " + game.currentDefender.counterAttackPower + " damage.");

      }

    }

    //if the game is over...
    if (game.state === "over") {

      //show the restart button
      $("#restart").show();

    }

  }

});

//when restart button is clicked...
$("#restart").on("click", function(event) {

  //reset attack power for the character you played with
  game.player.attackPower = game.player.baseAttackPower;

  //reset the health points for all characters
  for (var i = 0; i < characters.length; i++) {
    characters[i].healthPoints = characters[i].baseHealthPoints;
  }

  //create new game instance
  game = new Game();

  //for all character elements...
  for (var i = 0; i < charElements.length; i++) {

    //append to character selection div
    $("#characters").append(charElements[i]);

    //hide element and then fade in
    // charElements[i].hide().fadeIn(200 * i).show();

    //remove .enemy and .defender class from all of these elements
    charElements[i].removeClass("enemy").removeClass("defender");

    //set the health points text to the current health points
    charElements[i].find("p").text(characters[i].healthPoints);

  }

  //clear the message
  $("#message p").text("");

  //hide the restart button
  $("#restart").hide();

});


