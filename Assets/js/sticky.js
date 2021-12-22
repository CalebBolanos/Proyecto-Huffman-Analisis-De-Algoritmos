window.addEventListener("load", function(){
    window.onscroll = function() {stickyNav()};

    var navbar = document.getElementById("navbar");

    // var sticky = navbar.offsetTop;

    function stickyNav() {
        var y = window.scrollY;
        // console.log(y);
        if (y > 0) {
            navbar.classList.add("sticky");
            // console.log("Sticky");
        } else {
            navbar.classList.remove("sticky");
            // console.log("NO Sticky");
        }
    }

    calcularLinks();
      
    function clickHandler(e) {
        e.preventDefault();
        const href = this.getAttribute("href");
        // const offsetTop = document.querySelector(href).offsetTop;

        var element = document.querySelector(href);
        var position = element.getBoundingClientRect();
        // var x = position.left;
        var y = position.top;
        // console.log('x : ' + x + ' -- y : ' + y);

        console.log(href);
        // console.log(offsetTop);
        scroll({
          top: y - 200,
          behavior: "smooth"
        });    
    }

    function calcularLinks(){
        const links = document.querySelectorAll(".animacion_link");

        for (const link of links) {
            link.addEventListener("click", clickHandler);
        }
    }


});

