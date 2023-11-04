$(function() {
  
  $('#start').click(function() {
    if(isNaN(parseFloat($('#room').val())) === true){
      $('#start').text('Not a room')
        
            setTimeout(() => {
              $('#start').text('Start')
            }, 2000)
      return;
    }
    if(Number($('#room').val()) >= 1 && Number($('#room').val()) <= 1000) {
      const data = {"room": $('#room').val()};
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)

      }
      
      fetch('/RoomInfo', options).then(res=>res.json()).then(json=>{
        if (json.room === true) {
          $('#start').text('Room Filled')
          setTimeout(() => {
            $('#start').text('Start')
          }, 2000)
          
        } else if (json.room === false) {
          
          
            sessionStorage.setItem('Username', JSON.stringify($('#username').val()))
            sessionStorage.setItem('Room', JSON.stringify($('#room').val()))
            location.href = location.href + '../Game'
        
            
          
        }
    
    })
    } else {
      $('#start').text('Not a room')
        
            setTimeout(() => {
              $('#start').text('Start')
            }, 2000)
    }
    
    
    
    
  })



})