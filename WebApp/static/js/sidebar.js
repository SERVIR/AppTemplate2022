(function($) {
  "use strict"; // Start of use strict

  // Toggle the side navigation
  $("#sidebarToggle, #sidebarToggleTop").on('click', function(e) {
    $("body").toggleClass("sidebar-toggled");
    $(".sidebar").toggleClass("toggled");
    if ($(".sidebar").hasClass("toggled")) {
      $('.sidebar .collapse').collapse('hide');
    }
  });

  // Close any open menu accordions when window is resized below 768px
  $(window).resize(function() {
    if ($(window).width() < 768) {
      $('.sidebar .collapse').collapse('hide');
    }
    
    // Toggle the side navigation when window is resized below 480px
    if ($(window).width() < 480 && !$(".sidebar").hasClass("toggled")) {
      $("body").addClass("sidebar-toggled");
      $(".sidebar").addClass("toggled");
      $('.sidebar .collapse').collapse('hide');
    }
  });

  // Prevent the content wrapper from scrolling when the fixed side navigation hovered over
  $('body.fixed-nav .sidebar').on('mousewheel DOMMouseScroll wheel', function(e) {
    if ($(window).width() > 768) {
      var e0 = e.originalEvent,
        delta = e0.wheelDelta || -e0.detail;
      this.scrollTop += (delta < 0 ? 1 : -1) * 30;
      e.preventDefault();
    }
  });

  // Scroll to top button appear
  $(document).on('scroll', function() {
    var scrollDistance = $(this).scrollTop();
    if (scrollDistance > 100) {
      $('.scroll-to-top').fadeIn();
    } else {
      $('.scroll-to-top').fadeOut();
    }
  });

  // Smooth scrolling using jQuery easing
  $(document).on('click', 'a.scroll-to-top', function(e) {
    var $anchor = $(this);
    $('html, body').stop().animate({
      scrollTop: ($($anchor.attr('href')).offset().top)
    }, 1000, 'easeInOutExpo');
    e.preventDefault();
  });

})(jQuery); // End of use strict
var dropdown = document.getElementsByClassName("dropdown-btn");
var i;
var indexOfSelectedElement = window.location.pathname;

for (i = 0; i < dropdown.length; i++) {
  dropdown[i].addEventListener("click", function() {
    var dropdownContent = this.nextElementSibling;

    Array.from(document.querySelectorAll('.dropdown-container')).forEach(el => {
		//hide the nonclicked
        if (el !== dropdownContent) {
			el.style.display = 'none';
		}
    });
    if (dropdownContent.style.display === "block")
		dropdownContent.style.display = "none";
    else
		dropdownContent.style.display = "block";
  });
}
//get the three Dropdowns

const dropdowns = document.querySelectorAll(".dropdownSideBar");
dropdowns.forEach(el => {
	const button = el.querySelector(".dropdown-btn");
	button.addEventListener("click", () => {
		const caret = document.getElementById('caret');
		// Close all
		[...dropdowns].filter(x => x != el).forEach(el => el.classList.remove("is-open"));
		// Toggle one
		el.classList.toggle("is-open");

  });
});
 $
  $(".navi_map").click(function(){
    $(".navi_map .fa-chevron-right").toggleClass("rtoate180");
  });
 $(".navi_chart").click(function(){
    $(".navi_chart .fa-chevron-right").toggleClass("rtoate180");
  });

