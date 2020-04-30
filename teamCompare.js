var teamInput = $("#team-select").val();
var teamID = 0;
var addedTeams = [];
var teamCount = 0;
var sort = "pts";
var sortOrder = "desc";

// Add selected team to the addedTeams array
function addTeam(ID) {
  teamID = ID;
  season = $("#season-select").val();
  $.ajax({
    url: "https://statsapi.web.nhl.com/api/v1/teams/" + teamID + "/stats?season=" + season,
    method: "GET"
  }).then(function (response) {
    teamName = response.stats[0].splits[0].team.name + " " + "(" + $("#season-select option:selected").text() + ")";
    addedTeams.push({
      name: teamName,
      gamesPlayed: response.stats[0].splits[0].stat.gamesPlayed,
      wins: response.stats[0].splits[0].stat.wins,
      losses: response.stats[0].splits[0].stat.losses,
      ot: response.stats[0].splits[0].stat.ot,
      pts: response.stats[0].splits[0].stat.pts
    });
    teamCount++;
    addedTeams.sort(sortBy(sort, sortOrder));
    renderTable();
  })
};
// Render the table
function renderTable() {
  $("#stats-table").html(" <th>Team</th><th>GP</th><th>W</th><th>L</th><th>OT</th><th>PTS</th>")
  for (var i = 0; i < addedTeams.length; i++) {
    var newRow = $("<tr>");
    var nameTd = $("<td>").text(addedTeams[i].name);
    var gpTd = $("<td>").text(addedTeams[i].gamesPlayed);
    var wTd = $("<td>").text(addedTeams[i].wins);
    var lTd = $("<td>").text(addedTeams[i].losses);
    var otTd = $("<td>").text(addedTeams[i].ot);
    var ptsTd = $("<td>").text(addedTeams[i].pts);
    newRow.append(nameTd, gpTd, wTd, lTd, otTd, ptsTd);
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
$("#add-team").on("click", function () {
  teamInput = $("#team-select").val();
  addTeam(teamInput);
})

// When sort button is pushed
$("#sort-btn").on("click", function () {
  sort = $("#sort-by").val();
  console.log(sort);
  addedTeams.sort(sortBy(sort, sortOrder));
  renderTable();
})

// When the clear button is pushed
$("#clear-btn").on("click", function () {
  addedTeams = [];
  renderTable();
})


