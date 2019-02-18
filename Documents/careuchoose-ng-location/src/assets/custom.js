$(document).ready(function () {
    $('.sidenav').sidenav();
    $('sidenav-1').sidenav({ edge: 'left' });
    $('sidenav-2').sidenav({ edge: 'right' });
    $(".dropdown-button").dropdown();
    $('.modal').modal();
    $(".signup-toggle").click(function () {
      $(this).hide();
      $(".signupForm").show(300);
      $(".policy").css("visibility", "visible");
    });
    $('.tooltipped').tooltip();

  });
