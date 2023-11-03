$(function() {
let firstusername = JSON.parse(sessionStorage.getItem('firstusername'))
let secondusername = JSON.parse(sessionStorage.getItem('secondusername'))
let firstscore = JSON.parse(sessionStorage.getItem('firstscore'))
let secondscore = JSON.parse(sessionStorage.getItem('secondscore'))
$('#leaderboard1').append(`<p class="text">${firstusername}</p>`)
  .append(`<p class="text">Score: ${firstscore}</p>`)
  $('#leaderboard2').append(`<p class="text">${secondusername}</p>`)
  .append(`<p class="text">Score: ${secondscore}</p>`)
if(firstscore > secondscore) {
  $('#leaderboard1').css(`background-color`, 'green')
  $('#leaderboard2').css(`background-color`, 'red')
}
if(firstscore < secondscore) {
  $('#leaderboard2').css(`background-color`, 'green')
  $('#leaderboard1').css(`background-color`, 'red')
}

$('#back').click(function() {
  location.href = location.href += '../'
})

})