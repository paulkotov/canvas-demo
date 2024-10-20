        const canvas = document.getElementById('particleCanvas');
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        let particlesArray = [];

        // Mouse object to hold all properties
        const mouse = {
            x: null,
            y: null
        };

        // Function to create a particle object
        function createParticle(x, y) {
            const size = Math.random() * 5 + 1;  // Random size between 1 and 6
            const speedX = (Math.random() * 2) - 1;  // Horizontal speed
            const speedY = (Math.random() * 2) - 1;  // Vertical speed
            const color = `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`;  // Random color

            return { x, y, size, speedX, speedY, color };
        }

        // Function to handle clicks and animate based on mouse movement
        function handleMouse(event) {
            mouse.x = event.clientX;
            mouse.y = event.clientY;

            particlesArray.push(createParticle(mouse.x, mouse.y));
        }

        // Update particles' positions and draw them
        function updateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);  // Clear canvas
            for (let i = 0; i < particlesArray.length; i++) {
                const p = particlesArray[i];
                p.x += p.speedX;
                p.y += p.speedY;
                p.size *= 0.98;  // Slowly shrink the particle

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.fill();

                // Remove small particles
                if (p.size < 0.2) {
                    particlesArray.splice(i, 1);
                    i--;
                }
            }
        }

        // Animation loop
        function animate() {
            updateParticles();
            requestAnimationFrame(animate);
        }

        window.addEventListener('click', handleMouse);
        animate();
