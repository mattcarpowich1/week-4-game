function Character(name, id, healthPoints, attackPower, counterAttackPower, imgPath) {
  this.name = name;
  this.id = id;
  this.healthPoints = healthPoints;
  this.baseHealthPoints = healthPoints;
  this.attackPower = attackPower;
  this.baseAttackPower = attackPower;
  this.counterAttackPower = counterAttackPower;
  this.imgPath = "assets/images/" + imgPath + ".png";
  this.element = null;
}

var pikachu = new Character("Pikachu", "pikachu", 120, 8, 12, "pikachu");
var bulbasaur = new Character("Bulbasaur", "bulbasaur", 100, 15, 8, "bulbasaur");
var charizard = new Character("Charizard", "charizard", 150, 6, 15, "charizard");
var squirtle = new Character("Squirtle", "squirtle", 180, 3, 25, "squirtle");

var characters = [pikachu, bulbasaur, charizard, squirtle];

var $pikachu = $("<div>");
var $bulbasaur = $("<div>");
var $charizard = $("<div>");
var $squirtle = $("<div>");

var charElements = [$pikachu, $bulbasaur, $charizard, $squirtle];

//dynamically create jquery elements for each character
for (var i = 0; i < characters.length; i++) {
  
  charElements[i].addClass("char-container");

  charElements[i].attr("id", characters[i].id);

  //add a header displaying the character's name
  var $head = $("<h3>");
  $head.text(characters[i].name);
  charElements[i].append($head);

  //add an image of the character
  var $img = $("<img>");
  $img.attr("src", characters[i].imgPath);
  $img.attr("alt", characters[i].name);
  charElements[i].append($img);

  //add character's health points to element
  var $hp = $("<p>");
  $hp.text(characters[i].healthPoints);
  charElements[i].append($hp);

  characters[i].element = charElements[i];

  $("#characters").append(charElements[i]);

}

//game object holds the state of the game
function Game() {
  this.state = "selection";
  this.player = null;
  this.defenders = [];
  this.currentDefender = null;
}

var game = new Game();

$("#your_character").hide();
$("#enemies_available").hide();
$("#fight_section").hide();
$("#defender_section").hide();
$("#message").hide();
$("#restart").hide();


$(".char-container").on("click", function(event) {

  if (game.state === "selection") {

    //whichever character is picked, assign game.player to that character
    switch ($(this).attr("id")) {
      case "pikachu":
        game.player = pikachu;
        break;
      case "bulbasaur":
        game.player = bulbasaur;
        break;
      case "charizard":
        game.player = charizard;
        break;
      case "squirtle":
        game.player = squirtle;
        break;
    }

    game.state = "defender selection";

    for (var i = 0; i < characters.length; i++) {
      if (characters[i] !== game.player) {
        game.defenders.push(characters[i]);
      }
    }

    $("#you").append(game.player.element);

    for (var i = 0; i < game.defenders.length; i++) {
      game.defenders[i].element.addClass("enemy");
      $("#enemies").append(game.defenders[i].element);
    }

    //show the your_character and enemies_available divs
    $("#your_character").show();
    $("#enemies_available").show();
    $("#character_select").hide();

  }

});


$("#enemies").on("click", ".enemy", function(event) {

  if (game.state === 'defender selection') {

    $("#message p").text("");
    $("#message").show();
    $("#fight_section").show();

    //assign game.currentDefender to the chosen character
    switch ($(this).attr("id")) {
      case "pikachu":
        game.currentDefender = pikachu;
        break;
      case "bulbasaur":
        game.currentDefender = bulbasaur;
        break;
      case "charizard":
        game.currentDefender = charizard;
        break;
      case "squirtle":
        game.currentDefender = squirtle;
        break;
    }
 
    game.state = 'battle';

    $("#defender").append(game.currentDefender.element);
    game.currentDefender.element.removeClass("enemy");
    game.currentDefender.element.addClass("defender");
    
    $("#defender_section").show();

  }

});


$("#attack").on("click", function(event) {

  if (game.state === 'defender selection') {
    $("#message p").text("No enemy here.");
  }

  if (game.state === "battle") {

    game.currentDefender.healthPoints -= game.player.attackPower;

    game.player.attackPower += game.player.baseAttackPower;

    if (game.currentDefender.healthPoints <= 0) {

      game.currentDefender.element.detach();

      //remove this character from game.defenders array
      var defenderIndex = game.defenders.indexOf(game.currentDefender);
      game.defenders.splice(defenderIndex, 1);

      //if there are no remaining defenders...
      if (game.defenders.length === 0) {

        game.state = "over";

        $("#message p").text("You won! GAME OVER!!!");
        $("#enemies_available").hide();
        $("#defender_section").hide();
        $("#fight_section").hide();

      } else {

        game.state = "defender selection";

        $("#defender_section").hide();
        // $("#message").hide();

        $("#message p").text("You have defeated " + game.currentDefender.name + 
          "! Choose another enemy.");

      }

    } else {

      game.player.healthPoints -= game.currentDefender.counterAttackPower;

      game.player.element.find("p").text(game.player.healthPoints); 
      game.currentDefender.element.find("p").text(game.currentDefender.healthPoints);

      //if player is dead...
      if (game.player.healthPoints <= 0) {

        game.state = "over";

        $("#message p").text("You have been defeated...GAME OVER!!!");
        $("#enemies_available").hide();
        $("#your_character").hide();
        $("#fight_section").hide();

      } else {

        //display the damage each character inflicts upon the other
        var lastAttack = game.player.attackPower - game.player.baseAttackPower;
        $("#message p").text("You attacked " + game.currentDefender.name + " for " + 
          lastAttack + " damage. " + game.currentDefender.name +
          " attacked for " + game.currentDefender.counterAttackPower + " damage.");

      }

    }

    if (game.state === "over") {
      $("#restart").show();
    }

  }

});

$("#restart").on("click", function(event) {

  game.player.attackPower = game.player.baseAttackPower;

  for (var i = 0; i < characters.length; i++) {
    characters[i].healthPoints = characters[i].baseHealthPoints;
  }

  game = new Game();

  for (var i = 0; i < charElements.length; i++) {

    $("#characters").append(charElements[i]);

    charElements[i].removeClass("enemy").removeClass("defender");

    charElements[i].find("p").text(characters[i].healthPoints);

  }

  $("#message p").text("");
  $("#defender_section").hide();
  $("#message").hide();
  $("#your_character").hide();
  $("#character_select").show();
  $("#restart").hide();

});
