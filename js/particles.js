/* ============================================
   PARTICLE NETWORK — Hero Background
   Interactive neural-network-style particles
   ============================================ */

class ParticleNetwork {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: null, y: null, radius: 180 };
        this.animationId = null;
        this.isRunning = false;

        // Configuration
        this.config = {
            particleCount: this.getParticleCount(),
            maxDistance: 160,
            particleMinSize: 1,
            particleMaxSize: 3,
            speed: 0.4,
            colors: {
                particle: 'rgba(0, 240, 255, 0.8)',
                particleAlt: 'rgba(176, 38, 255, 0.6)',
                line: 'rgba(0, 240, 255, ##OPACITY##)',
                linePurple: 'rgba(176, 38, 255, ##OPACITY##)',
                glow: 'rgba(0, 240, 255, 0.3)'
            }
        };

        this.init();
    }

    getParticleCount() {
        const width = window.innerWidth;
        if (width < 480) return 30;
        if (width < 768) return 45;
        if (width < 1200) return 65;
        return 85;
    }

    init() {
        this.resize();
        this.createParticles();
        this.addEventListeners();
        this.isRunning = true;
        this.animate();
    }

    resize() {
        const rect = this.canvas.parentElement.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
    }

    createParticles() {
        this.particles = [];
        for (let i = 0; i < this.config.particleCount; i++) {
            const isPurple = Math.random() > 0.7;
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * this.config.speed,
                vy: (Math.random() - 0.5) * this.config.speed,
                size: this.config.particleMinSize + Math.random() * (this.config.particleMaxSize - this.config.particleMinSize),
                color: isPurple ? this.config.colors.particleAlt : this.config.colors.particle,
                isPurple: isPurple,
                pulsePhase: Math.random() * Math.PI * 2,
                pulseSpeed: 0.01 + Math.random() * 0.02
            });
        }
    }

    addEventListeners() {
        // Mouse tracking
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouse.x = e.clientX - rect.left;
            this.mouse.y = e.clientY - rect.top;
        });

        this.canvas.addEventListener('mouseleave', () => {
            this.mouse.x = null;
            this.mouse.y = null;
        });

        // Resize handling
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.resize();
                this.config.particleCount = this.getParticleCount();
                this.createParticles();
            }, 250);
        });

        // Pause when not visible
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.isRunning = false;
                cancelAnimationFrame(this.animationId);
            } else {
                this.isRunning = true;
                this.animate();
            }
        });
    }

    updateParticles() {
        for (const p of this.particles) {
            // Update pulse
            p.pulsePhase += p.pulseSpeed;

            // Move
            p.x += p.vx;
            p.y += p.vy;

            // Bounce off edges (with padding)
            if (p.x < 0 || p.x > this.canvas.width) p.vx *= -1;
            if (p.y < 0 || p.y > this.canvas.height) p.vy *= -1;

            // Clamp position
            p.x = Math.max(0, Math.min(this.canvas.width, p.x));
            p.y = Math.max(0, Math.min(this.canvas.height, p.y));

            // Mouse interaction — gentle push
            if (this.mouse.x !== null && this.mouse.y !== null) {
                const dx = p.x - this.mouse.x;
                const dy = p.y - this.mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < this.mouse.radius) {
                    const force = (this.mouse.radius - dist) / this.mouse.radius;
                    const angle = Math.atan2(dy, dx);
                    p.vx += Math.cos(angle) * force * 0.15;
                    p.vy += Math.sin(angle) * force * 0.15;
                }
            }

            // Speed dampening (prevent runaway particles)
            const maxSpeed = 1.5;
            const currentSpeed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
            if (currentSpeed > maxSpeed) {
                p.vx = (p.vx / currentSpeed) * maxSpeed;
                p.vy = (p.vy / currentSpeed) * maxSpeed;
            }

            // Gradual speed recovery to base
            p.vx += (((Math.random() - 0.5) * this.config.speed) - p.vx) * 0.005;
            p.vy += (((Math.random() - 0.5) * this.config.speed) - p.vy) * 0.005;
        }
    }

    drawParticles() {
        for (const p of this.particles) {
            const pulse = 1 + Math.sin(p.pulsePhase) * 0.3;
            const size = p.size * pulse;

            // Glow
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, size * 3, 0, Math.PI * 2);
            const gradient = this.ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, size * 3);
            gradient.addColorStop(0, p.isPurple ? 'rgba(176, 38, 255, 0.15)' : 'rgba(0, 240, 255, 0.15)');
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
            this.ctx.fillStyle = gradient;
            this.ctx.fill();

            // Core particle
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
            this.ctx.fillStyle = p.color;
            this.ctx.fill();
        }
    }

    drawConnections() {
        const maxDist = this.config.maxDistance;
        const particles = this.particles;
        const len = particles.length;

        for (let i = 0; i < len; i++) {
            for (let j = i + 1; j < len; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < maxDist) {
                    const opacity = ((maxDist - dist) / maxDist) * 0.25;
                    const usePurple = particles[i].isPurple || particles[j].isPurple;

                    this.ctx.beginPath();
                    this.ctx.moveTo(particles[i].x, particles[i].y);
                    this.ctx.lineTo(particles[j].x, particles[j].y);

                    if (usePurple) {
                        this.ctx.strokeStyle = `rgba(176, 38, 255, ${opacity})`;
                    } else {
                        this.ctx.strokeStyle = `rgba(0, 240, 255, ${opacity})`;
                    }
                    this.ctx.lineWidth = 0.6;
                    this.ctx.stroke();
                }
            }
        }

        // Draw connections to mouse
        if (this.mouse.x !== null && this.mouse.y !== null) {
            for (const p of particles) {
                const dx = p.x - this.mouse.x;
                const dy = p.y - this.mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < this.mouse.radius) {
                    const opacity = ((this.mouse.radius - dist) / this.mouse.radius) * 0.4;
                    this.ctx.beginPath();
                    this.ctx.moveTo(p.x, p.y);
                    this.ctx.lineTo(this.mouse.x, this.mouse.y);
                    this.ctx.strokeStyle = `rgba(0, 240, 255, ${opacity})`;
                    this.ctx.lineWidth = 0.8;
                    this.ctx.stroke();
                }
            }

            // Mouse glow
            const mouseGradient = this.ctx.createRadialGradient(
                this.mouse.x, this.mouse.y, 0,
                this.mouse.x, this.mouse.y, 60
            );
            mouseGradient.addColorStop(0, 'rgba(0, 240, 255, 0.08)');
            mouseGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
            this.ctx.beginPath();
            this.ctx.arc(this.mouse.x, this.mouse.y, 60, 0, Math.PI * 2);
            this.ctx.fillStyle = mouseGradient;
            this.ctx.fill();
        }
    }

    animate() {
        if (!this.isRunning) return;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.updateParticles();
        this.drawConnections();
        this.drawParticles();

        this.animationId = requestAnimationFrame(() => this.animate());
    }
}
