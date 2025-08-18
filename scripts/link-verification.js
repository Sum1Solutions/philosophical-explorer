#!/usr/bin/env node

/**
 * Comprehensive Link Verification System for Philosophical Traditions Dataset
 * 
 * This script:
 * 1. Checks existing URLs for validity (HTTP status)
 * 2. Finds authoritative replacement sources for broken/missing links
 * 3. Suggests high-quality academic sources for each tradition's primary texts
 * 4. Outputs a detailed report of link status and recommended replacements
 */

const fs = require('fs').promises;
const https = require('https');
const http = require('http');
const path = require('path');

class LinkVerificationSystem {
    constructor() {
        this.traditions = [];
        this.sources = {};
        this.report = {
            summary: {
                totalTraditions: 0,
                totalSources: 0,
                workingLinks: 0,
                brokenLinks: 0,
                missingLinks: 0,
                recommendedSources: 0
            },
            brokenLinks: [],
            missingSources: [],
            recommendations: [],
            detailedReport: []
        };
        
        // Authoritative source databases
        this.authorativedomains = {
            academic: ['.edu', 'plato.stanford.edu', 'sep.stanford.edu', 'oxford.com', 'cambridge.org'],
            libraries: ['archive.org', 'sacred-texts.com', 'wikisource.org', 'gutenberg.org'],
            specialized: {
                buddhist: ['accesstoinsight.org', 'buddhanet.net', 'dhammatalks.org', 'tipitaka.org'],
                christian: ['newadvent.org', 'ccel.org', 'biblehub.com', 'biblegateway.com'],
                islamic: ['sunnah.com', 'quran.com', 'islamic-awareness.org'],
                hindu: ['vedabase.com', 'hinduwebsite.com', 'bharatadesam.com'],
                jewish: ['chabad.org', 'sefaria.org', 'jewishencyclopedia.com'],
                chinese: ['ctext.org', 'chinaknowledge.de', 'wengu.tartarie.com'],
                western: ['marxists.org', 'constitution.org', 'bartleby.com']
            }
        };
        
        // Academic and scholarly source suggestions by tradition
        this.sourceRecommendations = {
            'buddhism': {
                'Pāli Canon (Tipitaka)': [
                    {
                        title: 'Access to Insight - Tipitaka',
                        url: 'https://accesstoinsight.org/tipitaka/index.html',
                        description: 'Comprehensive Theravada Buddhist canon with scholarly translations',
                        authority: 'Established Buddhist studies resource'
                    },
                    {
                        title: 'SuttaCentral',
                        url: 'https://suttacentral.net/',
                        description: 'Academic Buddhist text repository with critical editions',
                        authority: 'International Buddhist studies collaboration'
                    }
                ],
                'Dhammapada': [
                    {
                        title: 'Dhammapada (Max Müller translation)',
                        url: 'https://archive.org/details/dhammapada00ml',
                        description: 'Classic 19th century scholarly translation',
                        authority: 'Internet Archive - academic translation'
                    }
                ]
            },
            'christianity': {
                'Bible (Old & New Testament)': [
                    {
                        title: 'Bible Hub - Interlinear Bible',
                        url: 'https://biblehub.com/interlinear/',
                        description: 'Hebrew/Greek interlinear with multiple scholarly translations',
                        authority: 'Academic biblical studies resource'
                    },
                    {
                        title: 'NET Bible',
                        url: 'https://netbible.org/',
                        description: 'Modern translation with extensive scholarly notes',
                        authority: 'Biblical Studies Foundation'
                    }
                ]
            },
            'hinduism-advaita': {
                'Upaniṣads': [
                    {
                        title: 'Principal Upanishads (Radhakrishnan)',
                        url: 'https://archive.org/details/PrincipalUpanishads',
                        description: 'Scholarly translation with Sanskrit text and commentary',
                        authority: 'Oxford University Press academic edition'
                    }
                ],
                'Bhagavad Gītā': [
                    {
                        title: 'Bhagavad Gita (Radhakrishnan translation)',
                        url: 'https://archive.org/details/BhagavadGitaRadhakrishnan',
                        description: 'Academic translation with philosophical commentary',
                        authority: 'Oxford scholarly edition'
                    }
                ]
            },
            'sunni-islam': {
                'Qur\'an': [
                    {
                        title: 'Corpus Coranicum',
                        url: 'https://corpuscoranicum.de/en/',
                        description: 'Critical scholarly edition with historical context',
                        authority: 'Berlin-Brandenburg Academy of Sciences'
                    },
                    {
                        title: 'The Quranic Arabic Corpus',
                        url: 'https://corpus.quran.com/',
                        description: 'Linguistic analysis and multiple translations',
                        authority: 'University of Leeds'
                    }
                ]
            },
            'judaism': {
                'Tanakh (Hebrew Bible)': [
                    {
                        title: 'Sefaria Library',
                        url: 'https://www.sefaria.org/',
                        description: 'Comprehensive Jewish text library with commentaries',
                        authority: 'Collaborative Jewish scholarship platform'
                    },
                    {
                        title: 'Jewish Publication Society Tanakh',
                        url: 'https://www.sefaria.org/texts/Tanakh',
                        description: 'Authoritative Jewish translation',
                        authority: 'Jewish Publication Society'
                    }
                ]
            },
            'daoism': {
                'Dao De Jing': [
                    {
                        title: 'Chinese Text Project - Dao De Jing',
                        url: 'https://ctext.org/dao-de-jing',
                        description: 'Chinese text with multiple English translations',
                        authority: 'Digital Sinology platform'
                    },
                    {
                        title: 'Dao De Jing (D.C. Lau translation)',
                        url: 'https://archive.org/details/DaoDeJingDCLau',
                        description: 'Scholarly critical translation',
                        authority: 'Penguin Classics academic edition'
                    }
                ],
                'Zhuangzi': [
                    {
                        title: 'Chinese Text Project - Zhuangzi',
                        url: 'https://ctext.org/zhuangzi',
                        description: 'Complete Chinese text with translations',
                        authority: 'Digital Sinology platform'
                    }
                ]
            },
            'confucianism': {
                'Analects': [
                    {
                        title: 'Chinese Text Project - Analects',
                        url: 'https://ctext.org/analects',
                        description: 'Chinese text with scholarly translations',
                        authority: 'Digital Sinology platform'
                    },
                    {
                        title: 'Analects (D.C. Lau translation)',
                        url: 'https://archive.org/details/AnalectsConfuciusDCLau',
                        description: 'Critical scholarly translation',
                        authority: 'Penguin Classics academic edition'
                    }
                ]
            },
            'stoicism': {
                'Meditations': [
                    {
                        title: 'Perseus Digital Library - Marcus Aurelius',
                        url: 'http://www.perseus.tufts.edu/hopper/text?doc=Perseus%3Atext%3A2008.01.0641',
                        description: 'Greek text with scholarly apparatus',
                        authority: 'Tufts University classical studies'
                    }
                ],
                'Discourses': [
                    {
                        title: 'Perseus Digital Library - Epictetus',
                        url: 'http://www.perseus.tufts.edu/hopper/text?doc=Perseus%3Atext%3A1999.01.0236',
                        description: 'Greek text with translations',
                        authority: 'Tufts University classical studies'
                    }
                ]
            },
            'existentialism': {
                'Being and Nothingness': [
                    {
                        title: 'Stanford Encyclopedia - Sartre',
                        url: 'https://plato.stanford.edu/entries/sartre/',
                        description: 'Scholarly overview of Sartre\'s philosophy',
                        authority: 'Stanford Encyclopedia of Philosophy'
                    }
                ]
            },
            'analytic-philosophy': {
                'Tractus Logico-Philosophicus': [
                    {
                        title: 'Project Gutenberg - Tractatus',
                        url: 'https://www.gutenberg.org/ebooks/5740',
                        description: 'Open access text of Wittgenstein\'s work',
                        authority: 'Project Gutenberg'
                    }
                ]
            }
        };
    }

    async loadData() {
        try {
            const traditionsPath = path.join(__dirname, '../src/data/json/traditions.json');
            const sourcesPath = path.join(__dirname, '../src/data/json/sources.json');
            
            this.traditions = JSON.parse(await fs.readFile(traditionsPath, 'utf8'));
            this.sources = JSON.parse(await fs.readFile(sourcesPath, 'utf8'));
            
            console.log(`Loaded ${this.traditions.length} traditions and ${Object.keys(this.sources).length} source categories`);
        } catch (error) {
            console.error('Error loading data:', error);
            throw error;
        }
    }

    async checkUrl(url, timeout = 10000) {
        return new Promise((resolve) => {
            const isHttps = url.startsWith('https:');
            const client = isHttps ? https : http;
            
            const req = client.request(url, { method: 'HEAD', timeout }, (res) => {
                resolve({
                    url,
                    status: res.statusCode,
                    working: res.statusCode >= 200 && res.statusCode < 400,
                    redirected: res.statusCode >= 300 && res.statusCode < 400,
                    finalUrl: res.headers.location || url
                });
            });

            req.on('error', (error) => {
                resolve({
                    url,
                    status: 0,
                    working: false,
                    error: error.message
                });
            });

            req.on('timeout', () => {
                req.destroy();
                resolve({
                    url,
                    status: 0,
                    working: false,
                    error: 'Request timeout'
                });
            });

            req.end();
        });
    }

    extractUrlsFromSources() {
        const urls = new Set();
        
        // Extract URLs from sources.json
        Object.values(this.sources).forEach(sourceArray => {
            if (Array.isArray(sourceArray)) {
                sourceArray.forEach(source => {
                    if (source.url) {
                        urls.add(source.url);
                    }
                });
            }
        });
        
        return Array.from(urls);
    }

    analyzeTraditionSources() {
        const analysis = [];
        
        this.traditions.forEach(tradition => {
            const traditionAnalysis = {
                id: tradition.id,
                name: tradition.name,
                category: tradition.category,
                issues: [],
                primaryTexts: tradition.primaryTexts || [],
                sources: tradition.sources || [],
                missingSources: [],
                recommendations: []
            };

            // Check for missing URLs in primary texts
            if (tradition.primaryTexts) {
                tradition.primaryTexts.forEach(text => {
                    if (typeof text === 'string' && text.includes('(') && text.includes('verified)')) {
                        traditionAnalysis.issues.push({
                            type: 'placeholder_text',
                            text: text,
                            description: 'Contains placeholder text but no actual URL'
                        });
                    }
                    
                    // Check if we have sources for this text
                    if (!this.sources[text]) {
                        traditionAnalysis.missingSources.push(text);
                    }
                });
            }

            // Check for missing source URLs in quotes
            if (tradition.sources) {
                tradition.sources.forEach(sourceItem => {
                    if (!sourceItem.url && !sourceItem.source.startsWith('http')) {
                        traditionAnalysis.issues.push({
                            type: 'missing_url',
                            quote: sourceItem.text,
                            source: sourceItem.source,
                            description: 'Quote source has no URL'
                        });
                    }
                });
            }

            // Add recommendations for this tradition
            if (this.sourceRecommendations[tradition.id]) {
                traditionAnalysis.recommendations = this.sourceRecommendations[tradition.id];
            }

            analysis.push(traditionAnalysis);
        });
        
        return analysis;
    }

    async verifyAllLinks() {
        console.log('Extracting URLs from sources...');
        const urls = this.extractUrlsFromSources();
        console.log(`Found ${urls.length} unique URLs to verify`);

        const results = [];
        const batchSize = 5; // Check 5 URLs at a time to be respectful

        for (let i = 0; i < urls.length; i += batchSize) {
            const batch = urls.slice(i, i + batchSize);
            console.log(`Checking batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(urls.length/batchSize)}...`);
            
            const batchResults = await Promise.all(
                batch.map(url => this.checkUrl(url))
            );
            
            results.push(...batchResults);
            
            // Small delay between batches
            if (i + batchSize < urls.length) {
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }

        return results;
    }

    generateReport(linkResults, traditionAnalysis) {
        console.log('Generating comprehensive report...');
        
        // Count statistics
        const workingLinks = linkResults.filter(r => r.working).length;
        const brokenLinks = linkResults.filter(r => !r.working).length;
        
        this.report.summary = {
            totalTraditions: this.traditions.length,
            totalSources: Object.keys(this.sources).length,
            totalUrls: linkResults.length,
            workingLinks: workingLinks,
            brokenLinks: brokenLinks,
            workingPercentage: Math.round((workingLinks / linkResults.length) * 100),
            traditionsMissingRecommendations: traditionAnalysis.filter(t => t.recommendations.length === 0).length
        };

        // Broken links
        this.report.brokenLinks = linkResults
            .filter(r => !r.working)
            .map(r => ({
                url: r.url,
                error: r.error || `HTTP ${r.status}`,
                foundIn: this.findUrlUsage(r.url)
            }));

        // Missing sources analysis
        this.report.missingSources = traditionAnalysis
            .filter(t => t.missingSources.length > 0 || t.issues.length > 0)
            .map(t => ({
                tradition: t.name,
                id: t.id,
                missingTexts: t.missingSources,
                issues: t.issues
            }));

        // Recommendations
        this.report.recommendations = traditionAnalysis
            .filter(t => t.recommendations && Object.keys(t.recommendations).length > 0)
            .map(t => ({
                tradition: t.name,
                id: t.id,
                recommendedSources: t.recommendations
            }));

        // Priority recommendations for traditions without any
        const priorityTraditions = traditionAnalysis.filter(t => 
            t.missingSources.length > 0 && (!t.recommendations || Object.keys(t.recommendations).length === 0)
        );

        this.report.priorityRecommendations = priorityTraditions.map(t => ({
            tradition: t.name,
            id: t.id,
            missingTexts: t.missingSources,
            suggestedDomains: this.suggestDomainsForTradition(t)
        }));

        return this.report;
    }

    findUrlUsage(url) {
        const usage = [];
        
        Object.entries(this.sources).forEach(([textName, sourceArray]) => {
            if (Array.isArray(sourceArray)) {
                sourceArray.forEach((source, index) => {
                    if (source.url === url) {
                        usage.push(`${textName} [source ${index + 1}]`);
                    }
                });
            }
        });
        
        return usage;
    }

    suggestDomainsForTradition(tradition) {
        const suggestions = [];
        
        // Suggest specific domains based on tradition category/type
        if (tradition.id.includes('buddhis')) {
            suggestions.push(...this.authorativedomains.specialized.buddhist);
        } else if (tradition.id.includes('christian')) {
            suggestions.push(...this.authorativedomains.specialized.christian);
        } else if (tradition.id.includes('islam')) {
            suggestions.push(...this.authorativedomains.specialized.islamic);
        } else if (tradition.id.includes('hindu') || tradition.id.includes('jain')) {
            suggestions.push(...this.authorativedomains.specialized.hindu);
        } else if (tradition.id.includes('judaism')) {
            suggestions.push(...this.authorativedomains.specialized.jewish);
        } else if (tradition.id.includes('daoism') || tradition.id.includes('confucianism')) {
            suggestions.push(...this.authorativedomains.specialized.chinese);
        } else if (tradition.id.includes('stoicism') || tradition.id.includes('existentialism') || 
                   tradition.id.includes('marxism') || tradition.id.includes('pragmatism')) {
            suggestions.push(...this.authorativedomains.specialized.western);
        }
        
        // Always suggest general academic sources
        suggestions.push(...this.authorativedomains.academic);
        suggestions.push(...this.authorativedomains.libraries);
        
        return [...new Set(suggestions)]; // Remove duplicates
    }

    async saveReport(report) {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = path.join(__dirname, `link-verification-report-${timestamp}.json`);
        
        await fs.writeFile(filename, JSON.stringify(report, null, 2));
        console.log(`\nDetailed report saved to: ${filename}`);
        
        // Also save a human-readable summary
        const summaryFilename = path.join(__dirname, `link-verification-summary-${timestamp}.md`);
        const summary = this.generateMarkdownSummary(report);
        await fs.writeFile(summaryFilename, summary);
        console.log(`Human-readable summary saved to: ${summaryFilename}`);
        
        return { detailedReport: filename, summary: summaryFilename };
    }

    generateMarkdownSummary(report) {
        return `# Link Verification Report
Generated: ${new Date().toISOString()}

## Summary Statistics
- **Total Traditions**: ${report.summary.totalTraditions}
- **Total Source Categories**: ${report.summary.totalSources}
- **Total URLs Checked**: ${report.summary.totalUrls}
- **Working Links**: ${report.summary.workingLinks} (${report.summary.workingPercentage}%)
- **Broken Links**: ${report.summary.brokenLinks}
- **Traditions Missing Recommendations**: ${report.summary.traditionsMissingRecommendations}

## Critical Issues

### Broken Links (${report.brokenLinks.length})
${report.brokenLinks.map(link => 
    `- **${link.url}**\n  - Error: ${link.error}\n  - Used in: ${link.foundIn.join(', ')}`
).join('\n\n')}

### Traditions with Missing Sources (${report.missingSources.length})
${report.missingSources.map(tradition => 
    `- **${tradition.tradition}** (${tradition.id})\n  - Missing texts: ${tradition.missingTexts.join(', ')}\n  - Issues: ${tradition.issues.length} problems found`
).join('\n\n')}

## Priority Actions Needed

### High Priority Traditions Needing Sources
${report.priorityRecommendations.map(tradition =>
    `- **${tradition.tradition}**\n  - Missing sources for: ${tradition.missingTexts.join(', ')}\n  - Suggested domains: ${tradition.suggestedDomains.slice(0, 5).join(', ')}`
).join('\n\n')}

## Available Recommendations (${report.recommendations.length} traditions)
${report.recommendations.map(tradition =>
    `- **${tradition.tradition}**: ${Object.keys(tradition.recommendedSources).length} text categories with recommendations`
).join('\n')}

## Next Steps
1. Fix broken links identified above
2. Add missing sources for priority traditions
3. Implement recommended authoritative sources
4. Consider adding academic .edu domain sources
5. Verify all placeholder texts have actual URLs

---
*Report generated by Link Verification System*
`;
    }

    async run() {
        try {
            console.log('🔍 Starting Link Verification System...\n');
            
            // Load data
            await this.loadData();
            
            // Analyze tradition sources
            console.log('📊 Analyzing tradition sources...');
            const traditionAnalysis = this.analyzeTraditionSources();
            
            // Verify all links
            console.log('🌐 Verifying all URLs...');
            const linkResults = await this.verifyAllLinks();
            
            // Generate report
            const report = this.generateReport(linkResults, traditionAnalysis);
            
            // Save report
            const filePaths = await this.saveReport(report);
            
            // Display summary
            console.log('\n' + '='.repeat(60));
            console.log('📋 VERIFICATION SUMMARY');
            console.log('='.repeat(60));
            console.log(`Traditions analyzed: ${report.summary.totalTraditions}`);
            console.log(`URLs checked: ${report.summary.totalUrls}`);
            console.log(`Working links: ${report.summary.workingLinks} (${report.summary.workingPercentage}%)`);
            console.log(`Broken links: ${report.summary.brokenLinks}`);
            console.log(`Traditions needing sources: ${report.summary.traditionsMissingRecommendations}`);
            
            if (report.summary.brokenLinks > 0) {
                console.log('\n🚨 BROKEN LINKS FOUND:');
                report.brokenLinks.slice(0, 5).forEach(link => {
                    console.log(`  - ${link.url} (${link.error})`);
                });
                if (report.brokenLinks.length > 5) {
                    console.log(`  ... and ${report.brokenLinks.length - 5} more`);
                }
            }
            
            if (report.priorityRecommendations.length > 0) {
                console.log('\n⚠️  PRIORITY TRADITIONS NEEDING SOURCES:');
                report.priorityRecommendations.slice(0, 5).forEach(tradition => {
                    console.log(`  - ${tradition.tradition}: ${tradition.missingTexts.join(', ')}`);
                });
            }
            
            console.log(`\n📄 Reports saved:`);
            console.log(`  - Detailed: ${filePaths.detailedReport}`);
            console.log(`  - Summary: ${filePaths.summary}`);
            
            return report;
            
        } catch (error) {
            console.error('❌ Error running verification:', error);
            throw error;
        }
    }
}

// Run if called directly
if (require.main === module) {
    const verifier = new LinkVerificationSystem();
    verifier.run().catch(console.error);
}

module.exports = LinkVerificationSystem;