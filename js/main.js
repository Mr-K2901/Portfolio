/* ============================================
   MAIN.JS — Hybrid Portfolio Interactions
   Showcase projects from data.js + Live GitHub stats
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    // --- Particle Network ---
    const particleNet = new ParticleNetwork('particle-canvas');

    // --- Core UI ---
    initTypewriter();
    initNavigation();
    initScrollAnimations();

    // --- Hybrid Projects ---
    renderHybridProjects();
    initProjectFiltering();
    init3DCardTilt();

    // --- Other sections ---
    renderSkillsGrid();
    renderTimeline();
    initContactForm();
    initSmoothScroll();
});


/* =====================
   TYPEWRITER EFFECT
   ===================== */
function initTypewriter() {
    const element = document.getElementById('typewriter-text');
    if (!element) return;
    const text = PROFILE.tagline;
    element.textContent = '';
    let i = 0;
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, 40 + Math.random() * 30);
        } else {
            element.classList.add('done');
        }
    }
    setTimeout(type, 800);
}


/* =====================
   NAVIGATION
   ===================== */
function initNavigation() {
    const nav = document.getElementById('main-nav');
    const hamburger = document.getElementById('nav-hamburger');
    const navLinks = document.getElementById('nav-links');
    const navItems = document.querySelectorAll('.nav-link');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('open');
        });
    }

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            hamburger?.classList.remove('active');
            navLinks?.classList.remove('open');
        });
    });

    const sections = document.querySelectorAll('section[id]');
    const scrollSpy = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navItems.forEach(link => link.classList.remove('active'));
                const activeLink = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
                activeLink?.classList.add('active');
            }
        });
    }, { rootMargin: '-20% 0px -80% 0px' });
    sections.forEach(section => scrollSpy.observe(section));

    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;
        nav.classList.toggle('scrolled', currentScroll > 80);
        if (currentScroll > lastScroll && currentScroll > 400) {
            nav.classList.add('hidden');
        } else {
            nav.classList.remove('hidden');
        }
        lastScroll = currentScroll;
    });
}


/* =====================
   SCROLL ANIMATIONS
   ===================== */
let scrollObserver;

function initScrollAnimations() {
    scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('animated');
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    document.querySelectorAll('.animate-on-scroll').forEach(el => scrollObserver.observe(el));
}

/** Re-observe dynamically added elements */
function observeNewElements() {
    if (!scrollObserver) return;
    document.querySelectorAll('.animate-on-scroll:not(.animated)').forEach(el => scrollObserver.observe(el));
}


/* ==============================================
   HYBRID PROJECT RENDERING
   Curated projects (data.js) + Live GitHub stats
   ============================================== */

/**
 * Helper: find a GitHub repo by name
 */
function findGitHubRepo(repoName) {
    if (!repoName || typeof GITHUB_REPOS === 'undefined') return null;
    return GITHUB_REPOS.find(r => r.name === repoName) || null;
}

/**
 * Main render function
 */
function renderHybridProjects() {
    // --- GitHub stats bar ---
    renderGitHubStats();

    // --- Category filter buttons ---
    renderCategoryFilter();

    // --- Featured showcase cards (from PROJECTS + merged GitHub stats) ---
    renderShowcaseCards();

    // --- "More Work" compact cards (remaining GitHub repos) ---
    renderMoreWork();

    // --- Re-observe dynamically created elements ---
    observeNewElements();
}

function renderGitHubStats() {
    const statsBar = document.getElementById('github-stats');
    if (!statsBar || typeof GITHUB_REPOS === 'undefined' || !GITHUB_REPOS.length) return;

    const totalStars = GITHUB_REPOS.reduce((s, r) => s + (r.stars || 0), 0);
    const totalForks = GITHUB_REPOS.reduce((s, r) => s + (r.forks || 0), 0);
    const meta = typeof GITHUB_META !== 'undefined' ? GITHUB_META : null;

    statsBar.innerHTML = `
        <div class="github-stat">📦 <span class="stat-value">${meta?.totalRepos || GITHUB_REPOS.length}</span> Repos</div>
        <div class="github-stat">🌐 <span class="stat-value">${meta?.publicRepos || '—'}</span> Public</div>
        <div class="github-stat">🔒 <span class="stat-value">${meta?.privateRepos || '—'}</span> Private</div>
        <div class="github-stat">⭐ <span class="stat-value">${totalStars}</span> Stars</div>
        <div class="github-stat">🍴 <span class="stat-value">${totalForks}</span> Forks</div>
    `;
}

function renderCategoryFilter() {
    const container = document.getElementById('projects-filter');
    if (!container || typeof CATEGORIES === 'undefined') return;

    container.innerHTML = CATEGORIES.map(cat =>
        `<button class="filter-btn ${cat.id === 'all' ? 'active' : ''}" data-category="${cat.id}">${cat.icon} ${cat.label}</button>`
    ).join('');
}

function renderShowcaseCards() {
    const grid = document.getElementById('featured-grid');
    if (!grid || typeof PROJECTS === 'undefined') return;

    grid.innerHTML = PROJECTS.map(project => {
        // Merge GitHub data if available
        const ghRepo = findGitHubRepo(project.githubRepo);

        // Build tech tags
        const techTags = project.techStack.slice(0, 5).map(tech =>
            `<span class="tech-tag">${tech}</span>`
        ).join('') + (project.techStack.length > 5
            ? `<span class="tech-tag more">+${project.techStack.length - 5}</span>` : '');

        // GitHub stats (only if repo exists)
        const statsHtml = ghRepo ? `
            <div class="card-stats">
                <span class="repo-meta-item">⭐ ${ghRepo.stars}</span>
                <span class="repo-meta-item">🍴 ${ghRepo.forks}</span>
                <span class="repo-meta-item">${ghRepo.isPrivate ? '🔒' : '🌐'}</span>
            </div>
        ` : `<div class="card-stats"><span class="repo-meta-item" style="color: var(--text-muted); font-size: 0.68rem;">Local Project</span></div>`;

        // Language bar from GitHub
        const langBar = ghRepo?.languageBreakdown?.length > 0
            ? `<div class="repo-lang-bar" style="margin-top: 12px;">
                ${ghRepo.languageBreakdown.filter(l => l.percentage > 0).map(l =>
                `<div class="repo-lang-segment" style="width:${l.percentage}%;background:${l.color}" title="${l.name} ${l.percentage}%"></div>`
            ).join('')}
               </div>` : '';

        return `
        <a href="project.html?id=${project.id}" class="project-card animate-on-scroll"
           data-category="${project.category}"
           style="--card-accent: ${project.accent}">
            <div class="card-glow"></div>
            <div class="card-content">
                <div class="card-header">
                    <span class="card-category">${project.categoryLabel}</span>
                </div>
                <h3 class="card-title">${project.title}</h3>
                <p class="card-tagline">${project.tagline}</p>
                <p class="card-description">${project.shortDescription}</p>
                <div class="card-tech">${techTags}</div>
                ${langBar}
                <div class="card-footer">
                    ${statsHtml}
                    <span class="card-link-text">View Details <span class="arrow">→</span></span>
                </div>
            </div>
        </a>`;
    }).join('');
}

function renderMoreWork() {
    const grid = document.getElementById('repos-grid');
    const divider = document.getElementById('other-divider');
    if (!grid || typeof GITHUB_REPOS === 'undefined') return;

    // Get showcase repo names to exclude
    const showcaseRepoNames = new Set(
        PROJECTS.filter(p => p.githubRepo).map(p => p.githubRepo)
    );

    // Filter to repos NOT in the showcase
    const otherRepos = GITHUB_REPOS.filter(r => !showcaseRepoNames.has(r.name));

    if (otherRepos.length === 0) {
        if (divider) divider.style.display = 'none';
        return;
    }

    if (divider) divider.style.display = 'flex';

    grid.innerHTML = otherRepos.map(repo => {
        const updatedDate = new Date(repo.pushedAt || repo.updatedAt).toLocaleDateString('en-US', {
            year: 'numeric', month: 'short'
        });
        const isLink = !repo.isPrivate;
        const tag = isLink ? `a href="${repo.url}" target="_blank" rel="noopener"` : 'div';
        const closeTag = isLink ? 'a' : 'div';
        const category = repo.category || 'other';

        const langBar = repo.languageBreakdown?.length > 0
            ? `<div class="repo-lang-bar">${repo.languageBreakdown.filter(l => l.percentage > 0).map(l =>
                `<div class="repo-lang-segment" style="width:${l.percentage}%;background:${l.color}" title="${l.name} ${l.percentage}%"></div>`
            ).join('')}</div>` : '';

        return `
        <${tag} class="repo-card animate-on-scroll" data-category="${category}">
            <div class="repo-header">
                <span class="repo-icon">${repo.isPrivate ? '🔒' : '📂'}</span>
                <span class="repo-name">${repo.displayName}</span>
                <span class="repo-visibility ${repo.isPrivate ? 'private' : 'public'}">
                    ${repo.isPrivate ? 'Private' : 'Public'}
                </span>
            </div>
            <p class="repo-description">${repo.description}</p>
            <div class="repo-meta">
                ${repo.language && repo.language !== 'Unknown' ? `<div class="repo-meta-item">
                    <span class="repo-lang-dot" style="background:${repo.languageColor}"></span> ${repo.language}
                </div>` : ''}
                <div class="repo-meta-item">⭐ ${repo.stars}</div>
                <div class="repo-meta-item">🍴 ${repo.forks}</div>
            </div>
            ${langBar}
            <div class="repo-updated">Updated ${updatedDate}</div>
        </${closeTag}>`;
    }).join('');
}


/* =====================
   PROJECT FILTERING
   ===================== */
function initProjectFiltering() {
    const filterContainer = document.getElementById('projects-filter');
    if (!filterContainer) return;

    filterContainer.addEventListener('click', (e) => {
        const btn = e.target.closest('.filter-btn');
        if (!btn) return;

        filterContainer.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const category = btn.dataset.category;

        // Filter showcase cards
        document.querySelectorAll('#featured-grid .project-card').forEach(card => {
            card.classList.toggle('hidden', category !== 'all' && card.dataset.category !== category);
        });

        // Filter compact cards
        document.querySelectorAll('#repos-grid .repo-card').forEach(card => {
            card.classList.toggle('hidden-repo', category !== 'all' && card.dataset.category !== category);
        });

        // Show/hide divider
        const divider = document.getElementById('other-divider');
        if (divider) {
            const anyVisible = document.querySelectorAll('#repos-grid .repo-card:not(.hidden-repo)').length > 0;
            divider.style.display = anyVisible ? 'flex' : 'none';
        }
    });
}


/* =====================
   3D CARD TILT EFFECT
   ===================== */
function init3DCardTilt() {
    document.addEventListener('mousemove', (e) => {
        const card = e.target.closest('.project-card');
        if (!card) return;

        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        card.style.transform = `perspective(1000px) rotateX(${((y - centerY) / centerY) * -6}deg) rotateY(${((x - centerX) / centerX) * 6}deg) scale3d(1.02, 1.02, 1.02)`;

        const glow = card.querySelector('.card-glow');
        if (glow) {
            glow.style.background = `radial-gradient(circle at ${x}px ${y}px, var(--card-accent), transparent 60%)`;
            glow.style.opacity = '0.15';
        }
    });

    document.getElementById('featured-grid')?.addEventListener('mouseout', (e) => {
        const card = e.target.closest('.project-card');
        if (card && !card.contains(e.relatedTarget)) {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
            const glow = card.querySelector('.card-glow');
            if (glow) glow.style.opacity = '0';
        }
    });
}


/* =====================
   SKILLS HEX GRID
   ===================== */
function renderSkillsGrid() {
    const container = document.getElementById('skills-hex-grid');
    if (!container) return;

    const rows = [
        SKILLS.slice(0, 5), SKILLS.slice(5, 9),
        SKILLS.slice(9, 14), SKILLS.slice(14, 18)
    ];

    container.innerHTML = rows.map((row, i) => `
        <div class="hex-row ${i % 2 === 1 ? 'offset' : ''}">
            ${row.map(skill => `
                <div class="hex-item animate-on-scroll">
                    <div class="hex-shape"><div class="hex-inner">
                        <span class="hex-icon">${skill.icon}</span>
                        <span class="hex-name">${skill.name}</span>
                        <div class="hex-bar"><div class="hex-bar-fill" style="width: ${skill.proficiency}%"></div></div>
                    </div></div>
                </div>
            `).join('')}
        </div>
    `).join('');

    const barObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const fill = entry.target.querySelector('.hex-bar-fill');
                if (fill) setTimeout(() => fill.classList.add('animate'), 300);
            }
        });
    }, { threshold: 0.5 });
    container.querySelectorAll('.hex-item').forEach(item => barObserver.observe(item));
}


/* =====================
   TIMELINE
   ===================== */
function renderTimeline() {
    const container = document.getElementById('timeline-container');
    if (!container) return;

    container.innerHTML = EXPERIENCE.map((exp, i) => `
        <div class="timeline-item animate-on-scroll" style="--delay: ${i * 0.15}s">
            <div class="timeline-marker"><div class="timeline-dot"></div></div>
            <div class="timeline-content">
                <div class="timeline-date"><span class="terminal-prompt">$</span> git log --date="${exp.date}"</div>
                <h3 class="timeline-role">${exp.role}</h3>
                <span class="timeline-company">${exp.company}</span>
                <p class="timeline-description">${exp.description}</p>
                <div class="timeline-tags">${exp.tags.map(t => `<span class="timeline-tag">${t}</span>`).join('')}</div>
            </div>
        </div>
    `).join('');
}


/* =====================
   CONTACT FORM
   ===================== */
function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = form.querySelector('.submit-btn');
        const originalText = btn.innerHTML;

        btn.innerHTML = '<span class="btn-text">⏳ Transmitting...</span>';
        btn.disabled = true;
        btn.classList.add('sending');

        setTimeout(() => {
            btn.innerHTML = '<span class="btn-text">✅ Message Transmitted!</span>';
            btn.classList.remove('sending');
            btn.classList.add('sent');
            setTimeout(() => {
                form.reset();
                btn.innerHTML = originalText;
                btn.disabled = false;
                btn.classList.remove('sent');
            }, 3000);
        }, 1500);
    });
}


/* =====================
   SMOOTH SCROLLING
   ===================== */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = anchor.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (target) {
                const navHeight = document.getElementById('main-nav')?.offsetHeight || 0;
                window.scrollTo({
                    top: target.getBoundingClientRect().top + window.scrollY - navHeight - 20,
                    behavior: 'smooth'
                });
            }
        });
    });
}
