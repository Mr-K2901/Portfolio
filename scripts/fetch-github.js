/**
 * ============================================
 * GITHUB REPO FETCHER — Unified Portfolio Build
 * ============================================
 * 
 * Fetches all repos from GitHub, merges with
 * "featured" config for rich project details,
 * and outputs a single unified data file.
 * 
 * Usage:  node scripts/fetch-github.js
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// --- Load environment ---
try {
    require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
} catch (e) {
    console.error('❌ dotenv not installed. Run: npm install dotenv');
    process.exit(1);
}

// --- Load config ---
const CONFIG_PATH = path.join(__dirname, 'config.json');
let config;
try {
    config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));
} catch (e) {
    console.error(`❌ Could not read config: ${CONFIG_PATH}`);
    process.exit(1);
}

const TOKEN = process.env.GITHUB_TOKEN;
const USERNAME = config.username;

if (!TOKEN || TOKEN === 'ghp_your_token_here') {
    console.error('❌ No valid GITHUB_TOKEN found in .env file.');
    process.exit(1);
}

// --- GitHub API helper ---
function githubRequest(urlPath) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'api.github.com',
            path: urlPath,
            method: 'GET',
            headers: {
                'User-Agent': 'Portfolio-Fetch-Script',
                'Authorization': `Bearer ${TOKEN}`,
                'Accept': 'application/vnd.github+json',
                'X-GitHub-Api-Version': '2022-11-28'
            }
        };

        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                if (res.statusCode === 200) {
                    resolve(JSON.parse(data));
                } else {
                    reject(new Error(`GitHub API ${res.statusCode}: ${data}`));
                }
            });
        });

        req.on('error', reject);
        req.end();
    });
}

// --- Fetch all repos (paginated) ---
async function fetchAllRepos() {
    let allRepos = [];
    let page = 1;

    console.log(`\n📡 Fetching repos for @${USERNAME}...\n`);

    while (true) {
        const repos = await githubRequest(
            `/user/repos?per_page=100&page=${page}&sort=${config.sort_by || 'updated'}&direction=${config.sort_order || 'desc'}&affiliation=owner`
        );
        if (repos.length === 0) break;
        allRepos = allRepos.concat(repos);
        if (repos.length < 100) break;
        page++;
    }

    return allRepos;
}

// --- Fetch languages for a repo ---
async function fetchLanguages(repoName) {
    try {
        return await githubRequest(`/repos/${USERNAME}/${repoName}/languages`);
    } catch { return {}; }
}

// --- Fetch topics for a repo ---
async function fetchTopics(repoName) {
    try {
        const result = await githubRequest(`/repos/${USERNAME}/${repoName}/topics`);
        return result.names || [];
    } catch { return []; }
}

// --- Slugify repo name to ID ---
function slugify(name) {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

// --- Format repo name ---
function formatRepoName(name) {
    return name.replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

// --- Process a single repo ---
async function processRepo(repo) {
    const override = config.overrides?.[repo.name] || {};
    const featured = config.featured?.[repo.name] || null;
    const languages = await fetchLanguages(repo.name);
    const topics = await fetchTopics(repo.name);

    // Category
    const category = override.category || config.category_map?.[repo.language] || 'other';
    const langColor = config.language_colors?.[repo.language] || '#8b8b8b';

    // Language breakdown
    const totalBytes = Object.values(languages).reduce((a, b) => a + b, 0);
    const languageBreakdown = Object.entries(languages).map(([lang, bytes]) => ({
        name: lang,
        percentage: totalBytes > 0 ? Math.round((bytes / totalBytes) * 100) : 0,
        color: config.language_colors?.[lang] || '#8b8b8b'
    })).sort((a, b) => b.percentage - a.percentage);

    // Base repo data
    const result = {
        id: slugify(repo.name),
        name: repo.name,
        displayName: override.display_name || formatRepoName(repo.name),
        description: override.description || repo.description || 'No description available.',
        category: category,
        language: repo.language || 'Unknown',
        languageColor: langColor,
        languageBreakdown: languageBreakdown,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        watchers: repo.watchers_count,
        topics: topics.length > 0 ? topics : [],
        isPrivate: repo.private,
        isFork: repo.fork,
        isArchived: repo.archived,
        url: repo.html_url,
        homepage: repo.homepage || null,
        defaultBranch: repo.default_branch,
        size: repo.size,
        createdAt: repo.created_at,
        updatedAt: repo.updated_at,
        pushedAt: repo.pushed_at,

        // Featured flag & rich data
        isFeatured: !!featured,
        tagline: featured?.tagline || null,
        accent: featured?.accent || langColor,
        categoryLabel: featured?.categoryLabel || formatCategory(category),
        fullDescription: featured?.fullDescription || null,
        features: featured?.features || [],
        architecture: featured?.architecture || null,
        challenges: featured?.challenges || null
    };

    return result;
}

// --- Format category to label ---
function formatCategory(cat) {
    const map = {
        'ml': 'Machine Learning',
        'nlp': 'NLP',
        'cv': 'Computer Vision',
        'iot': 'IoT',
        'fullstack': 'Full Stack',
        'mobile': 'Mobile',
        'devops': 'DevOps',
        'other': 'Other'
    };
    return map[cat] || cat;
}

// --- Filter repos ---
function shouldInclude(repo) {
    if (config.exclude?.includes(repo.name)) return false;
    if (!config.include_forks && repo.fork) return false;
    if (!config.include_archived && repo.archived) return false;
    return true;
}

// --- Generate output file ---
function generateOutputFile(repos) {
    const timestamp = new Date().toISOString();
    const featured = repos.filter(r => r.isFeatured);
    const other = repos.filter(r => !r.isFeatured);

    // Sort: featured first (in config order), then others by date
    const featuredOrder = Object.keys(config.featured || {});
    featured.sort((a, b) => featuredOrder.indexOf(a.name) - featuredOrder.indexOf(b.name));
    other.sort((a, b) => new Date(b.pushedAt) - new Date(a.pushedAt));

    const sorted = [...featured, ...other];

    const output = `/* ============================================
   AUTO-GENERATED — Do not edit manually!
   Generated by: node scripts/fetch-github.js
   Timestamp: ${timestamp}
   Total: ${repos.length} | Featured: ${featured.length} | Other: ${other.length}
   ============================================ */

const GITHUB_REPOS = ${JSON.stringify(sorted, null, 2)};

const GITHUB_META = {
  username: "${USERNAME}",
  profileUrl: "https://github.com/${USERNAME}",
  avatarUrl: "https://avatars.githubusercontent.com/u/129107732?v=4",
  totalRepos: ${repos.length},
  publicRepos: ${repos.filter(r => !r.isPrivate).length},
  privateRepos: ${repos.filter(r => r.isPrivate).length},
  featuredCount: ${featured.length},
  lastFetched: "${timestamp}"
};
`;

    const outputPath = path.join(__dirname, '..', 'js', 'github-data.js');
    fs.writeFileSync(outputPath, output, 'utf-8');
    return outputPath;
}

// --- Main ---
async function main() {
    console.log('🚀 Portfolio Unified Build Script');
    console.log('==================================\n');

    try {
        const rawRepos = await fetchAllRepos();
        console.log(`   Found ${rawRepos.length} total repositories\n`);

        const filteredRepos = rawRepos.filter(shouldInclude);
        console.log(`   After filtering: ${filteredRepos.length} repos\n`);

        console.log('📦 Processing repositories...\n');
        const processedRepos = [];

        for (const repo of filteredRepos) {
            const isFeatured = !!config.featured?.[repo.name];
            const icon = repo.private ? '🔒' : '🌐';
            const star = isFeatured ? ' ⭐ FEATURED' : '';
            process.stdout.write(`   ${icon} ${repo.name}${star}...`);

            const processed = await processRepo(repo);
            processedRepos.push(processed);
            console.log(` ✅`);
        }

        const outputPath = generateOutputFile(processedRepos);
        const featured = processedRepos.filter(r => r.isFeatured);
        const other = processedRepos.filter(r => !r.isFeatured);

        console.log('\n==================================');
        console.log('✅ Done!\n');
        console.log(`   📄 Output: ${outputPath}`);
        console.log(`   ⭐ Featured: ${featured.length} projects`);
        console.log(`   📦 Other: ${other.length} repos`);
        console.log(`   🌐 Public: ${processedRepos.filter(r => !r.isPrivate).length}`);
        console.log(`   🔒 Private: ${processedRepos.filter(r => r.isPrivate).length}`);

        console.log('\n   Featured projects:');
        featured.forEach(r => console.log(`     ⭐ ${r.displayName} (${r.categoryLabel})`));

        console.log('\n🎉 Refresh your portfolio to see the changes!\n');

    } catch (error) {
        console.error('\n❌ Error:', error.message);
        if (error.message.includes('401')) {
            console.error('   Token invalid/expired. Regenerate at: https://github.com/settings/tokens?type=beta');
        }
        process.exit(1);
    }
}

main();
