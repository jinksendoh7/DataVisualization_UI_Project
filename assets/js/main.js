
    setTimeout(()=>{
        document.getElementById('spinner').style.display = 'none'
        document.getElementById('div').style.display = 'block';
    },1000)


// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function() {scrollFunction()};
let mybutton = document.getElementById("scrollToTop");
function scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
      mybutton.style.display = "block";
    } else {
      mybutton.style.display = "none";
    }
  }
  
  // When the user clicks on the button, scroll to the top of the document
  function topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }

 
  $(function() {
    $('.chip-primary-outline').click(function() {
      $("#chips>div").removeClass("chip-primary").addClass('chip-primary-outline');
      $(this).removeClass('chip-primary-outline').addClass('chip-primary');
      var chipText = $(this)[0].innerText.toLowerCase() + '.html';
      location.assign(chipText);
   });
   $('.chip-primary').click(function() {
     $("#chips>div").removeClass("chip-primary").addClass('chip-primary-outline');
      $(this).removeClass('chip-primary-outline').addClass('chip-primary');
      var chipText = ($(this)[0].innerText).toLowerCase() + '.html';
      location.assign(chipText);
   
    });
  });