var teamInput = $("#team-select").val();
var teamID = 0;
var currentRoster = [];
var addedPlayers = [];
var playerCount = 0;
var sort = "goals";
var sortOrder = "desc";
var teamChange = true;

function updateRoster() {
  teamID = $("#team-select").val();
  season = $("#season-select").val();
  $.ajax({
    url: "https://statsapi.web.nhl.com/api/v1/teams/" + teamID + "/?expand=team.roster&season=" + season,
  }).then(function (response) {
    currentRoster = response.teams[0].roster.roster
    playerList();
  })
}

// When team is changed, generate player list
$("#team-select").on("change", function () {
  updateRoster();
});



// When season is changed, generate player list
$("#season-select").on("change", function () {
  updateRoster();
});


// Generate player options based on currentRoster
function playerList() {
  $("#player-select").html("");
  for (var i = 0; i < currentRoster.length; i++) {
    var option = $("<option>" + currentRoster[i].person.fullName + "</option>");
    option.attr("value", currentRoster[i].person.id);
    $("#player-select").append(option);
  }
}

// Add selected team to the addedTeams array
function addPlayer() {
  playerID = $("#player-select").val();
  season = $("#season-select").val();
    $.ajax({
      url: "https://statsapi.web.nhl.com/api/v1/people/" + playerID + "/stats/?stats=statsSingleSeason&season=" + season,
      method: "GET"
    }).then(function (response) {
      playerName = $("#player-select option:selected").text()  + " " + "(" + $("#season-select option:selected").text() + ")";
      addedPlayers.push({
        name: playerName,
        goals: response.stats[0].splits[0].stat.goals,
        assists: response.stats[0].splits[0].stat.assists,
        gamesPlayed: response.stats[0].splits[0].stat.games,
        shots: response.stats[0].splits[0].stat.shots,
        hits: response.stats[0].splits[0].stat.hits
      });
      playerCount++;
      addedPlayers.sort(sortBy(sort, sortOrder));
      console.log(addedPlayers);
      renderTable();
    })
};
// Render the table
function renderTable() {
  $("#stats-table").html("<th>Name</th><th>GP</th><th>Goals</th><th>Assists</th><th>Shots</th><th>Hits</th>")
  for (var i = 0; i < addedPlayers.length; i++) {
    var newRow = $("<tr>");
    var nameTd = $("<td>").text(addedPlayers[i].name);
    var gpTd = $("<td>").text(addedPlayers[i].gamesPlayed);
    var goalsTd = $("<td>").text(addedPlayers[i].goals);
    var assistsTd = $("<td>").text(addedPlayers[i].assists);
    var shotsTd = $("<td>").text(addedPlayers[i].shots);
    var hitsTd = $("<td>").text(addedPlayers[i].hits);
    newRow.append(nameTd, gpTd, goalsTd, assistsTd, shotsTd, hitsTd);
    $("#stats-table").append(newRow);
  }
}
// Sort the array by selected key
function sortBy(key, order = 'asc') {
  return function innerSort(a, b) {
    if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
      // property doesn't exist on either object
      return 0;
    }

    const varA = (typeof a[key] === 'string')
      ? a[key].toUpperCase() : a[key];
    const varB = (typeof b[key] === 'string')
      ? b[key].toUpperCase() : b[key];

    let comparison = 0;
    if (varA > varB) {
      comparison = 1;
    } else if (varA < varB) {
      comparison = -1;
    }
    return (
      (order === 'desc') ? (comparison * -1) : comparison
    );
  };
}

// When add team button is pushed
$("#add-player").on("click", function () {
  addPlayer();
})

// When sort button is pushed
$("#sort-btn").on("click", function () {
  sort = $("#sort-by").val();
  console.log(sort);
  addedPlayers.sort(sortBy(sort, sortOrder));
  renderTable();
})

// When the clear button is pushed
$("#clear-btn").on("click", function () {
  addedPlayers = [];
  renderTable();
})

updateRoster();


