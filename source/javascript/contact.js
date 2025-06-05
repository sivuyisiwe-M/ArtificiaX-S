// Theme toggler functionality
$(document).ready(function() {
    if (typeof Typed !== 'undefined' && document.querySelector(".typing-text")) {
        var typed = new Typed(".typing-text", {
            strings: ["AI Engineer","frontend development", "backend development", "web designing", "android development", "web development"],
            loop: true,
            typeSpeed: 50,
            backSpeed: 25,
            backDelay: 500,
        });
    }

    // Theme toggler
    $('.theme-toggler span').each(function(index) {
        $(this).click(function() {
            // Reset any previous theme classes
            $('body').removeClass('theme-1 theme-2 theme-3 theme-4 theme-5');
            
            // Add theme class based on clicked span
            $('body').addClass('theme-' + (index + 1));
        });
    });

    // Responsive menu toggle (from original script)
    $('#menu').click(function () {
        $(this).toggleClass('fa-times');
        $('.navbar').toggleClass('nav-toggle');
    });

    // Scroll and navigation handling
    $(window).on('scroll load', function () {
        $('#menu').removeClass('fa-times');
        $('.navbar').removeClass('nav-toggle');

        // Scroll top button
        if (window.scrollY > 60) {
            document.querySelector('#scroll-top').classList.add('active');
        } else {
            document.querySelector('#scroll-top').classList.remove('active');
        }

        // Scroll spy
        $('section').each(function () {
            let height = $(this).height();
            let offset = $(this).offset().top - 200;
            let top = $(window).scrollTop();
            let id = $(this).attr('id');

            if (top > offset && top < offset + height) {
                $('.navbar ul li a').removeClass('active');
                $('.navbar').find(`[href="#${id}"]`).addClass('active');
            }
        });
    });
    
    // Load skills from skills.json
    console.log('Document ready, attempting to load skills...');
    loadSkills();
    
    // Smooth scrolling
    $('a[href*="#"]').on('click', function (e) {
        e.preventDefault();
        $('html, body').animate({
            scrollTop: $($(this).attr('href')).offset().top,
        }, 500, 'linear')
    });
});

// Function to load skills from skills.json
function loadSkills() {
    console.log('loadSkills function called');
    
    // Try loading the file with a complete error handler
    $.ajax({
        url: './skills.json',
        dataType: 'json',
        success: function(data) {
            console.log('Skills loaded successfully:', data);
            const skillsContainer = document.getElementById('skillsContainer');
            
            // Make sure the container exists
            if (!skillsContainer) {
                console.error('Skills container not found!');
                return;
            }
            
            // Clear the container first
            skillsContainer.innerHTML = '';
            
            // Loop through each skill and create HTML elements
            data.forEach(skill => {
                const skillDiv = document.createElement('div');
                skillDiv.className = 'bar';
                
                skillDiv.innerHTML = `
                    <div class="info">
                        <img src="${skill.icon}" alt="${skill.name}"/>
                        <span>${skill.name}</span>
                    </div>
                `;
                
                skillsContainer.appendChild(skillDiv);
            });
        },
        error: function(xhr, status, error) {
            console.error('Error details:');
            console.error('Status:', status);
            console.error('Error:', error);
            console.error('Response:', xhr.responseText);
            
            // Check if skillsContainer exists before trying to access it
            const skillsContainer = document.getElementById('skillsContainer');
            if (skillsContainer) {
                skillsContainer.innerHTML = '<p>Failed to load skills. Please check the console for errors.</p>';
            } else {
                console.error('Skills container not found!');
            }
        }
    });
}


// Start of Tawk.to Live Chat
// var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
// (function(){
// var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
// s1.async=true;
// s1.src='https://embed.tawk.to/6800e4a6c5e333190b5b7a56/1ip1nqb1d';
// s1.charset='UTF-8';
// s1.setAttribute('crossorigin','*');
// s0.parentNode.insertBefore(s1,s0);
// })();
// End of Tawk.to Live Chat


// Page title and favicon change
document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === "visible") {
        document.title = "Portfolio | Sivuyisiwe Mgijima";
        $("#favicon").attr("href", "assets/images/favicon.png");
    } else {
        document.title = "Come Back To Portfolio";
        $("#favicon").attr("href", "assets/images/favhand.png");
    }
});


document.head.insertAdjacentHTML('beforeend', themeStyles);