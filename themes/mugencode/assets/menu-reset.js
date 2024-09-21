(function() {

    function setTheme(themeName) {
	localStorage.setItem('theme', themeName);
    }

    // Function to toggle the theme
    function toggleTheme() {
	if (localStorage.getItem('theme') === 'dark') {
	    setTheme('light');
	    if(switchThreeTheme){
		switchThreeTheme("light");
	    }
	    
	} else {
	    if(switchThreeTheme) {
		switchThreeTheme("dark");
	    }
	    setTheme('dark');
	}
	document.documentElement.classList.toggle('dark');

    }


  // var menu = document.querySelector("aside .book-menu-content");
  // addEventListener("beforeunload", function(event) {
  //     localStorage.setItem("menu.scrollTop", menu.scrollTop);
  // });
    document.addEventListener('DOMContentLoaded', function(){
	var menuToggles = document.querySelectorAll(".menu-toggle");

	Array.from(menuToggles).forEach(menuToggle => {
	    menuToggle.addEventListener("click", function(event) {
		document.querySelector(".fullscreen-nav").classList.add("active");
	    });
	});

	var closeMenu = document.querySelector(".close-btn");
	closeMenu.addEventListener("click", function(event) {
	    document.querySelector(".fullscreen-nav").classList.remove("active");
	});

	const themeToggles = document.querySelectorAll('.theme-toggle');
	console.log(themeToggles);
	Array.from(themeToggles).forEach(themeToggle => {
	    themeToggle.addEventListener('click', () => {
		toggleTheme();
	    });
	});



    }, false);


    function highlightMatchingLink() {
	// Get the current URL fragment
	const fragment = window.location.hash.slice(1);

	// Find all links in the document
	const links = document.getElementsByTagName('a');

	// Loop through the links
	for (let i = 0; i < links.length; i++) {
	    const link = links[i];
	    
	    // Check if the link's href matches the fragment
	    if (link.getAttribute('href') === '#' + fragment) {
		// Highlight the matching link
		link.parentNode.classList.add('active');
	    } else {
		link.parentNode.classList.remove('active');
	    }
	}
    }

    // Call the function when the DOM is fully loaded
    document.addEventListener('DOMContentLoaded', highlightMatchingLink);

    // Call the function every time the hash changes
    window.addEventListener('hashchange', highlightMatchingLink);    


})();
