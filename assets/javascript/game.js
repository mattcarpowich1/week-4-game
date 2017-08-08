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
var obiWanKenobi = new Character("Obi-Wan Kenobi", "obi", 120, 8, 10, "obi-wan-kenobi");
var lukeSkywalker = new Character("Luke Skywalker", "luke", 100, 10, 5, "luke-skywalker");
var darthSidious = new Character("Darth Sidious", "sidious", 150, 7, 20, "darth-sidious");
var darthMaul = new Character("Darth Maul", "maul", 180, 5, 25, "darth-maul");

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
}

//instantiate game
var game = new Game();

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

    //add .enemy class to each defender and append to #enemies div
    for (var i = 0; i < game.defenders.length; i++) {
      game.defenders[i].element.addClass("enemy");
      $("#enemies").append(game.defenders[i].element);
    }

  }

});
