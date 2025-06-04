document.addEventListener('DOMContentLoaded', function() {
            const hamburger = document.querySelector('.hamburger');
            const navMenu = document.querySelector('.nav-menu');
            const testimonialsContainer = document.querySelector('.testimonials-grid');
            const testimonialDotsContainer = document.querySelector('.slider-dots');
            const testimonials = document.querySelectorAll('.testimonial');
            let currentTestimonialIndex = 0;
            let testimonialInterval; // Declare interval variable globally for clearInterval

            // --- Hamburger menu toggle ---
            // Ensure elements exist before adding listener
            if (hamburger && navMenu) {
                hamburger.addEventListener('click', () => {
                    hamburger.classList.toggle('active');
                    navMenu.classList.toggle('active');
                });
            }

            // Close mobile menu when a navigation link is clicked
            document.querySelectorAll('.nav-menu a').forEach(item => {
                item.addEventListener('click', () => {
                    if (hamburger && navMenu) { // Ensure elements exist
                        hamburger.classList.remove('active');
                        navMenu.classList.remove('active');
                    }
                });
            });

            // --- Modal Functionality ---
            // Function to open any modal
            window.openModal = function(modalId, serviceName = '') {
                const modal = document.getElementById(modalId);
                if (modal) {
                    // Set display to flex first, then add 'show' class for transition
                    modal.style.display = "flex";
                    // Using setTimeout to ensure display change registers before transition
                    setTimeout(() => {
                        modal.classList.add('show');
                    }, 10); // A very small delay
                    
                    if (modalId === 'bookingModal' && serviceName) {
                        const modalServiceSelect = document.getElementById('modalService');
                        if (modalServiceSelect) { // Ensure the select element exists
                            modalServiceSelect.value = serviceName;
                        }
                    }
                }
            }

            // Function to close any modal
            window.closeModal = function(modalId) {
                const modal = document.getElementById(modalId);
                if (modal) {
                    modal.classList.remove('show'); // Start fade-out/slide-up transition
                    // After transition, set display to none
                    // Use a named function for the event listener to allow removal
                    const handler = function() {
                        modal.style.display = "none";
                        modal.removeEventListener('transitionend', handler); // Remove listener after execution
                    };
                    // Add listener to the modal itself, for its 'opacity' transition
                    modal.addEventListener('transitionend', handler);
                }
            }

            // Close modal when clicking outside content (on the modal overlay)
            window.onclick = function(event) {
                // Check if the clicked element is a modal overlay (has 'modal' class but not 'modal-content' or its children)
                if (event.target.classList.contains('modal')) {
                    closeModal(event.target.id);
                }
            }

            // --- Form Submission Handling ---
            function handleFormSubmission(event) {
                event.preventDefault(); // Prevent default form submission (page reload)
                const form = event.target;
                const formData = new FormData(form);
                const data = {};
                for (let [key, value] of formData.entries()) {
                    data[key] = value;
                }
                console.log('Booking Data:', data); // Log form data for debugging

                // Close the booking modal (if it was opened from a modal)
                const parentModal = form.closest('.modal');
                if (parentModal) {
                    closeModal(parentModal.id);
                }
                
                form.reset(); // Reset the form fields
                openModal('thankYouModal'); // Show the thank you popup
            }

            // Attach event listeners to both main and modal booking forms
            const mainBookingForm = document.getElementById('mainBookingForm');
            const modalBookingForm = document.getElementById('modalBookingForm');

            if (mainBookingForm) {
                mainBookingForm.addEventListener('submit', handleFormSubmission);
            }
            if (modalBookingForm) {
                modalBookingForm.addEventListener('submit', handleFormSubmission);
            }

            // Set min date for date input to today to prevent past date selection
            const today = new Date();
            const dd = String(today.getDate()).padStart(2, '0');
            const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
            const YYYY = today.getFullYear();
            const minDate = YYYY + '-' + mm + '-' + dd;

            const mainDateInput = document.getElementById('mainDate');
            const modalDateInput = document.getElementById('modalDate');

            if (mainDateInput) {
                mainDateInput.setAttribute('min', minDate);
            }
            if (modalDateInput) {
                modalDateInput.setAttribute('min', minDate);
            }

            // --- Testimonials Slider Functionality ---
            function showTestimonial(index) {
                // Ensure testimonials container and testimonials exist
                if (!testimonialsContainer || testimonials.length === 0) {
                    console.warn("Testimonials slider elements not found or no testimonials.");
                    return; // Exit if elements are missing
                }

                // Loop the index if it goes out of bounds
                if (index >= testimonials.length) {
                    currentTestimonialIndex = 0;
                } else if (index < 0) {
                    currentTestimonialIndex = testimonials.length - 1;
                } else {
                    currentTestimonialIndex = index;
                }

                // Calculate the translation needed to show the current testimonial
                const offset = -currentTestimonialIndex * 100;
                testimonialsContainer.style.transform = `translateX(${offset}%)`;

                // Update active dot indicator
                document.querySelectorAll('.dot').forEach((dot, i) => {
                    if (i === currentTestimonialIndex) {
                        dot.classList.add('active');
                    } else {
                        dot.classList.remove('active');
                    }
                });
            }

            // Function to change testimonial by a given step (+1 for next, -1 for prev)
            window.changeTestimonial = function(step) {
                clearInterval(testimonialInterval); // Clear auto-advance on manual navigation
                showTestimonial(currentTestimonialIndex + step);
                startTestimonialAutoAdvance(); // Restart auto-advance after manual change
            };

            function createDots() {
                if (!testimonialDotsContainer || testimonials.length === 0) {
                    return; // Exit if elements are missing
                }
                testimonialDotsContainer.innerHTML = ''; // Clear any existing dots
                testimonials.forEach((_, i) => {
                    const dot = document.createElement('span');
                    dot.classList.add('dot');
                    dot.addEventListener('click', () => {
                        clearInterval(testimonialInterval); // Clear auto-advance on dot click
                        showTestimonial(i);
                        startTestimonialAutoAdvance(); // Restart auto-advance
                    });
                    testimonialDotsContainer.appendChild(dot);
                });
                showTestimonial(0); // Show the first testimonial initially
            }

            function startTestimonialAutoAdvance() {
                clearInterval(testimonialInterval); // Clear any existing interval to prevent duplicates
                testimonialInterval = setInterval(() => {
                    showTestimonial(currentTestimonialIndex + 1);
                }, 5000); // Change testimonial every 5 seconds
            }

            // Initialize dots and auto-advance only if testimonials exist
            if (testimonials.length > 0) {
                createDots(); // Initialize dots
                startTestimonialAutoAdvance(); // Start auto-advance on load
            }

            // Pause auto-advance on hover for the entire slider container
            const sliderContainer = document.querySelector('.testimonials-slider-container');
            if (sliderContainer) {
                sliderContainer.addEventListener('mouseover', () => clearInterval(testimonialInterval));
                sliderContainer.addEventListener('mouseleave', () => startTestimonialAutoAdvance());
            }
        });