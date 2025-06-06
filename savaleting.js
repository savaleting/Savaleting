document.addEventListener('DOMContentLoaded', function() {
            const hamburger = document.querySelector('.hamburger');
            const navMenu = document.querySelector('.nav-menu');
            const testimonialsContainer = document.querySelector('.testimonials-grid');
            const testimonialDotsContainer = document.querySelector('.slider-dots');
            const testimonials = document.querySelectorAll('.testimonial');
            let currentTestimonialIndex = 0;
            let testimonialInterval;

            // --- Hamburger menu toggle ---
            if (hamburger && navMenu) {
                hamburger.addEventListener('click', () => {
                    hamburger.classList.toggle('active');
                    navMenu.classList.toggle('active');
                });
            }

            // Close mobile menu when a navigation link is clicked
            document.querySelectorAll('.nav-menu a').forEach(item => {
                item.addEventListener('click', () => {
                    if (hamburger && navMenu) {
                        hamburger.classList.remove('active');
                        navMenu.classList.remove('active');
                    }
                });
            });

            // --- Modal Functionality ---
            window.openModal = function(modalId, serviceName = '') {
                const modal = document.getElementById(modalId);
                if (modal) {
                    modal.style.display = "flex";
                    setTimeout(() => {
                        modal.classList.add('show');
                    }, 10);
                    
                    if (modalId === 'bookingModal' && serviceName) {
                        const modalServiceSelect = document.getElementById('modalService');
                        if (modalServiceSelect) {
                            modalServiceSelect.value = serviceName;
                        }
                    }
                }
            }

            window.closeModal = function(modalId) {
                const modal = document.getElementById(modalId);
                if (modal) {
                    modal.classList.remove('show');
                    const handler = function() {
                        modal.style.display = "none";
                        modal.removeEventListener('transitionend', handler);
                    };
                    modal.addEventListener('transitionend', handler);
                }
            }

            window.onclick = function(event) {
                if (event.target.classList.contains('modal')) {
                    closeModal(event.target.id);
                }
            }

            // --- Form Submission Handling with EmailJS ---
            function handleFormSubmission(event) {
                event.preventDefault();
                const form = event.target;
                const formData = new FormData(form);
                const data = {};
                for (let [key, value] of formData.entries()) {
                    data[key] = value;
                }

                // Prepare the EmailJS template parameters
                const templateParams = {
                    name: data.name,
                    phonenumber: data.phone,
                    service: data.service,
                    Add: data.addon || 'None',
                    address: data.address,
                    housenumber: data.housenumber,
                    postcode: data.postcode,
                    preferreddate: data.date,
                    preferredtime: data.time,
                    message: data.message || 'No additional notes'
                };

                // Send the email using EmailJS
                emailjs.send('service_vqsum0k', 'template_6twuaeh', templateParams)
                    .then(function(response) {
                        console.log('SUCCESS!', response.status, response.text);
                        const parentModal = form.closest('.modal');
                        if (parentModal) {
                            closeModal(parentModal.id);
                        }
                        form.reset();
                        openModal('thankYouModal');
                    }, function(error) {
                        console.log('FAILED...', error);
                        alert('Failed to send booking request. Please try again or contact us directly.');
                    });
            }

            // Attach event listener to the booking form
            const modalBookingForm = document.getElementById('modalBookingForm');
            if (modalBookingForm) {
                modalBookingForm.addEventListener('submit', handleFormSubmission);
            }

            // Set min date for date input to today
            const today = new Date();
            const dd = String(today.getDate()).padStart(2, '0');
            const mm = String(today.getMonth() + 1).padStart(2, '0');
            const YYYY = today.getFullYear();
            const minDate = YYYY + '-' + mm + '-' + dd;

            const modalDateInput = document.getElementById('modalDate');
            if (modalDateInput) {
                modalDateInput.setAttribute('min', minDate);
            }

            // --- Testimonials Slider Functionality ---
            function showTestimonial(index) {
                if (!testimonialsContainer || testimonials.length === 0) return;

                if (index >= testimonials.length) {
                    currentTestimonialIndex = 0;
                } else if (index < 0) {
                    currentTestimonialIndex = testimonials.length - 1;
                } else {
                    currentTestimonialIndex = index;
                }

                const offset = -currentTestimonialIndex * 100;
                testimonialsContainer.style.transform = `translateX(${offset}%)`;

                document.querySelectorAll('.dot').forEach((dot, i) => {
                    dot.classList.toggle('active', i === currentTestimonialIndex);
                });
            }

            window.changeTestimonial = function(step) {
                clearInterval(testimonialInterval);
                showTestimonial(currentTestimonialIndex + step);
                startTestimonialAutoAdvance();
            };

            function createDots() {
                if (!testimonialDotsContainer || testimonials.length === 0) return;
                testimonialDotsContainer.innerHTML = '';
                testimonials.forEach((_, i) => {
                    const dot = document.createElement('span');
                    dot.classList.add('dot');
                    dot.addEventListener('click', () => {
                        clearInterval(testimonialInterval);
                        showTestimonial(i);
                        startTestimonialAutoAdvance();
                    });
                    testimonialDotsContainer.appendChild(dot);
                });
                showTestimonial(0);
            }

            function startTestimonialAutoAdvance() {
                clearInterval(testimonialInterval);
                testimonialInterval = setInterval(() => {
                    showTestimonial(currentTestimonialIndex + 1);
                }, 5000);
            }

            if (testimonials.length > 0) {
                createDots();
                startTestimonialAutoAdvance();
            }

            const sliderContainer = document.querySelector('.testimonials-slider-container');
            if (sliderContainer) {
                sliderContainer.addEventListener('mouseover', () => clearInterval(testimonialInterval));
                sliderContainer.addEventListener('mouseleave', () => startTestimonialAutoAdvance());
            }
        });