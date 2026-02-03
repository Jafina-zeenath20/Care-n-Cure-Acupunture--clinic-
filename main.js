// Main JavaScript

document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('open');
            const icon = mobileMenuBtn.querySelector('i');
            if (mobileMenu.classList.contains('open')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });

        // Close menu when a link is clicked
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('open');
                mobileMenuBtn.querySelector('i').classList.remove('fa-times');
                mobileMenuBtn.querySelector('i').classList.add('fa-bars');
            });
        });
    }

    // Sticky Header Effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
            navbar.style.padding = '0.5rem 0';
        } else {
            navbar.style.boxShadow = 'var(--shadow-sm)';
            navbar.style.padding = '1rem 0';
        }
    });

    // Smooth Scroll for Anchor Links (Handled by CSS scroll-behavior usually, but JS backup for older browsers/control)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Offset for sticky header
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    // Testimonial Navigation
    const track = document.querySelector('.testimonials-track');
    const nextBtn = document.querySelector('.next-btn');
    const prevBtn = document.querySelector('.prev-btn');

    if (track && nextBtn && prevBtn) {
        nextBtn.addEventListener('click', () => {
            track.scrollBy({ left: 300, behavior: 'smooth' });
        });

        prevBtn.addEventListener('click', () => {
            track.scrollBy({ left: -300, behavior: 'smooth' });
        });
    }

    // Intersection Observer for Animations
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Add animation class to sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.add('fade-up-element'); // Helper class to be added in CSS if needed
        observer.observe(section);
    });

    // Appointment Form Handling
    const appointmentForm = document.querySelector('.appointment-form');
    if (appointmentForm) {
        appointmentForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('name').value;
            const phone = document.getElementById('phone').value;
            const email = document.getElementById('email').value || 'Not provided';
            const treatment = document.getElementById('treatment').value;
            const date = document.getElementById('date').value;
            const time = document.getElementById('time').value;
            const message = document.getElementById('message').value || 'No specific message';

            // Format message for WhatsApp
            const whatsappMessage = `*New Appointment Request*
            
*Name:* ${name}
*Phone:* ${phone}
*Email:* ${email}
*Treatment:* ${treatment}
*Date:* ${date}
*Time:* ${time}
*Message:* ${message}
            
Please confirm my appointment.`;

            // Encode the message
            const encodedMessage = encodeURIComponent(whatsappMessage);
            const clinicPhone = '918825641943';

            // Redirect to WhatsApp
            window.open(`https://wa.me/${clinicPhone}?text=${encodedMessage}`, '_blank');

            // Optional: Reset form or show success message
            // appointmentForm.reset();
            alert('Thank you! Redirecting you to WhatsApp to send your details.');
        });
    }
});
