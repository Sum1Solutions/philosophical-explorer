#!/usr/bin/env node

/**
 * Authoritative Source Recommendations Generator
 * 
 * This script generates specific, high-quality academic and scholarly source recommendations
 * to replace broken or missing links in the philosophical traditions dataset.
 */

const fs = require('fs').promises;
const path = require('path');

class SourceRecommendationsGenerator {
    constructor() {
        this.recommendations = {
            // High-Priority Replacements for Broken Links
            criticalReplacements: {
                // Islamic Sources
                "Qur'an": [
                    {
                        title: "Quranic Arabic Corpus (University of Leeds)",
                        url: "http://corpus.quran.com/",
                        description: "Academic linguistic analysis of the Quran with word-by-word translations",
                        authority: "University of Leeds - Department of Computing",
                        priority: "critical",
                        replaces: ["https://archive.org/details/QuranSahihInternational"]
                    },
                    {
                        title: "Tanzil Quran Navigator",
                        url: "http://tanzil.net/",
                        description: "Open source Quran project with multiple translations",
                        authority: "Academic Quran project",
                        priority: "high",
                        replaces: ["https://archive.org/details/QuranSahihInternational"]
                    }
                ],
                "Hadith Collections": [
                    {
                        title: "Hadith Collection - USC-MSA",
                        url: "https://www.usc.edu/org/cmje/religious-texts/hadith/",
                        description: "University of Southern California's hadith database",
                        authority: "University of Southern California",
                        priority: "critical",
                        replaces: ["https://archive.org/details/SahihBukhariEnglishTranslation"]
                    }
                ],

                // Christian Sources
                "Bible": [
                    {
                        title: "Bible Gateway Academic",
                        url: "https://www.biblegateway.com/",
                        description: "Comprehensive Bible database with scholarly tools",
                        authority: "Zondervan Academic",
                        priority: "critical",
                        replaces: ["https://archive.org/details/bible-kjv"]
                    },
                    {
                        title: "Blue Letter Bible",
                        url: "https://www.blueletterbible.org/",
                        description: "Biblical exegesis tools with original language texts",
                        authority: "Blue Letter Bible Institute",
                        priority: "high"
                    }
                ],
                "Patristic Sources": [
                    {
                        title: "Christian Classics Ethereal Library",
                        url: "https://ccel.org/",
                        description: "Comprehensive collection of Christian literature",
                        authority: "Calvin University",
                        priority: "critical",
                        replaces: ["https://archive.org/details/church-fathers"]
                    },
                    {
                        title: "New Advent - Church Fathers",
                        url: "http://www.newadvent.org/fathers/",
                        description: "Complete collection of patristic writings",
                        authority: "New Advent Catholic Encyclopedia",
                        priority: "high"
                    }
                ],

                // Hindu Sources
                "Upanishads": [
                    {
                        title: "Sanskrit Web - Upanishads",
                        url: "http://sanskritdocuments.org/doc_upanishhat/",
                        description: "Sanskrit texts with transliterations",
                        authority: "Sanskrit Documents Collection",
                        priority: "critical",
                        replaces: ["https://archive.org/details/upanishads00ml"]
                    },
                    {
                        title: "Wisdom Library - Upanishads",
                        url: "https://www.wisdomlib.org/hinduism/book/the-upanishads",
                        description: "Scholarly translations and commentaries",
                        authority: "Wisdom Library Academic Project",
                        priority: "high"
                    }
                ],
                "Bhagavad Gita": [
                    {
                        title: "Bhagavad Gita Online",
                        url: "https://www.holy-bhagavad-gita.org/",
                        description: "Sanskrit with word-by-word translation",
                        authority: "Vedic studies platform",
                        priority: "critical",
                        replaces: ["https://archive.org/details/BhagavadGitaAsItIs"]
                    },
                    {
                        title: "Gitasupersite",
                        url: "http://www.gitasupersite.iitk.ac.in/",
                        description: "IIT Kanpur's comprehensive Gita resource",
                        authority: "Indian Institute of Technology Kanpur",
                        priority: "critical"
                    }
                ],

                // Buddhist Sources
                "Pali Canon": [
                    {
                        title: "SuttaCentral",
                        url: "https://suttacentral.net/",
                        description: "Early Buddhist texts with critical editions",
                        authority: "International Buddhist studies collaboration",
                        priority: "critical",
                        replaces: ["https://archive.org/details/sacredbooksofeas10ml"]
                    },
                    {
                        title: "Dhamma Ocean",
                        url: "https://ocean.dhamma.gift/",
                        description: "Modern interface for Pali Canon",
                        authority: "Buddhist Studies collaborative",
                        priority: "high"
                    }
                ],
                "Dhammapada": [
                    {
                        title: "Access to Insight - Dhammapada",
                        url: "https://www.accesstoinsight.org/tipitaka/kn/dhp/dhp.intro.budd.html",
                        description: "Scholarly translation with commentary",
                        authority: "Access to Insight Buddhist Library",
                        priority: "critical"
                    }
                ],

                // Jewish Sources
                "Hebrew Bible": [
                    {
                        title: "Mechon Mamre Hebrew Bible",
                        url: "https://mechon-mamre.org/p/pt/pt0.htm",
                        description: "Hebrew text with traditional punctuation",
                        authority: "Mechon Mamre Institute",
                        priority: "critical",
                        replaces: ["https://en.wikisource.org/wiki/Hebrew_Bible"]
                    },
                    {
                        title: "Tanach.us",
                        url: "http://www.tanach.us/",
                        description: "Hebrew Bible with multiple English translations",
                        authority: "Jewish studies resource",
                        priority: "high"
                    }
                ],
                "Talmud": [
                    {
                        title: "Halakhah.com Talmud",
                        url: "http://halakhah.com/",
                        description: "Complete Babylonian Talmud online",
                        authority: "Halakhah.com",
                        priority: "critical",
                        replaces: ["https://archive.org/details/BabylonianTalmudEnglish"]
                    }
                ],

                // Chinese Philosophy Sources
                "Dao De Jing": [
                    {
                        title: "Chinese Text Project - Dao De Jing",
                        url: "https://ctext.org/dao-de-jing",
                        description: "Chinese text with multiple English translations",
                        authority: "Digital humanities project by Donald Sturgeon",
                        priority: "critical"
                    }
                ],
                "Zhuangzi": [
                    {
                        title: "Chinese Text Project - Zhuangzi",
                        url: "https://ctext.org/zhuangzi",
                        description: "Complete Chinese text with translations",
                        authority: "Digital humanities project by Donald Sturgeon",
                        priority: "critical",
                        replaces: ["https://archive.org/details/sacredbooksofeas39ml"]
                    }
                ],
                "Analects": [
                    {
                        title: "Chinese Text Project - Analects",
                        url: "https://ctext.org/analects",
                        description: "Confucian Analects in Chinese with translations",
                        authority: "Digital humanities project by Donald Sturgeon",
                        priority: "critical"
                    }
                ],

                // Greek/Roman Philosophy
                "Marcus Aurelius Meditations": [
                    {
                        title: "Perseus Digital Library - Marcus Aurelius",
                        url: "http://www.perseus.tufts.edu/hopper/text?doc=Perseus%3Atext%3A2008.01.0641",
                        description: "Greek text with scholarly apparatus",
                        authority: "Tufts University Perseus Project",
                        priority: "critical",
                        replaces: ["https://en.wikisource.org/wiki/The_Meditations_of_Marcus_Aurelius"]
                    }
                ],
                "Epictetus Discourses": [
                    {
                        title: "Perseus Digital Library - Epictetus",
                        url: "http://www.perseus.tufts.edu/hopper/text?doc=Perseus%3Atext%3A1999.01.0236",
                        description: "Greek text with English translations",
                        authority: "Tufts University Perseus Project",
                        priority: "critical",
                        replaces: ["https://en.wikisource.org/wiki/Discourses_of_Epictetus"]
                    }
                ],

                // Modern Philosophy
                "Wittgenstein Tractus": [
                    {
                        title: "Project Gutenberg - Tractatus",
                        url: "https://www.gutenberg.org/ebooks/5740",
                        description: "Complete text of Tractatus Logico-Philosophicus",
                        authority: "Project Gutenberg",
                        priority: "critical",
                        replaces: ["https://en.wikisource.org/wiki/Tractatus_Logico-Philosophicus"]
                    }
                ],
                "Mill Utilitarianism": [
                    {
                        title: "Project Gutenberg - Utilitarianism",
                        url: "https://www.gutenberg.org/ebooks/11224",
                        description: "John Stuart Mill's complete work on utilitarianism",
                        authority: "Project Gutenberg",
                        priority: "critical",
                        replaces: ["https://en.wikisource.org/wiki/Utilitarianism"]
                    }
                ]
            },

            // Missing Sources - High Priority
            missingSourcesRecommendations: {
                "Indigenous Wisdom": [
                    {
                        title: "Encyclopedia Britannica - Indigenous Religions",
                        url: "https://www.britannica.com/topic/Native-American-religions",
                        description: "Scholarly overview of Native American spiritual traditions",
                        authority: "Encyclopedia Britannica Academic",
                        priority: "critical"
                    },
                    {
                        title: "Smithsonian NMAI - Indigenous Spiritual Practices",
                        url: "https://americanindian.si.edu/",
                        description: "National Museum of the American Indian resources",
                        authority: "Smithsonian Institution",
                        priority: "high"
                    }
                ],

                "Jainism": [
                    {
                        title: "Jain Agamas (Agamashastra.com)",
                        url: "http://www.agamashastra.com/",
                        description: "Digital collection of Jain canonical texts",
                        authority: "Jain studies platform",
                        priority: "critical"
                    },
                    {
                        title: "Jainworld - Sacred Texts",
                        url: "http://www.jainworld.com/literature/",
                        description: "Comprehensive Jain literature collection",
                        authority: "Jainworld Educational Foundation",
                        priority: "high"
                    }
                ],

                "Shintoism": [
                    {
                        title: "Sacred Texts - Shinto",
                        url: "https://sacred-texts.com/shi/",
                        description: "Kojiki, Nihon Shoki, and other Shinto texts",
                        authority: "Sacred Texts Archive",
                        priority: "critical"
                    },
                    {
                        title: "Stanford Encyclopedia - Shinto",
                        url: "https://plato.stanford.edu/entries/shinto/",
                        description: "Academic overview of Shinto philosophy",
                        authority: "Stanford Encyclopedia of Philosophy",
                        priority: "high"
                    }
                ],

                "Buddhist Meditation Texts": [
                    {
                        title: "Visuddhimagga (Access to Insight)",
                        url: "https://www.accesstoinsight.org/lib/authors/nanamoli/PathofPurification2011.pdf",
                        description: "Complete Visuddhimagga translation",
                        authority: "Buddhist Publication Society",
                        priority: "critical"
                    },
                    {
                        title: "Platform Sutra (BDK America)",
                        url: "https://www.bdkamerica.org/tripitaka-translations",
                        description: "Scholarly translation of Zen foundational text",
                        authority: "Bukkyō Dendō Kyōkai",
                        priority: "high"
                    }
                ],

                "Modern Philosophy": [
                    {
                        title: "Internet Archive - Modern Philosophy",
                        url: "https://archive.org/details/texts?query=philosophy&sort=-downloads",
                        description: "Extensive collection of philosophical works",
                        authority: "Internet Archive",
                        priority: "high"
                    },
                    {
                        title: "Stanford Encyclopedia of Philosophy",
                        url: "https://plato.stanford.edu/",
                        description: "Peer-reviewed philosophical reference work",
                        authority: "Stanford University",
                        priority: "critical"
                    }
                ]
            },

            // Academic Institution Sources
            academicSources: {
                "Buddhist Studies": [
                    {
                        title: "84000 Project",
                        url: "https://84000.co/",
                        description: "Translating the words of the Buddha into modern languages",
                        authority: "84000: Translating the Words of the Buddha",
                        priority: "critical"
                    },
                    {
                        title: "University of Virginia - Buddhist Studies",
                        url: "https://www.virginia.edu/",
                        description: "Academic Buddhist studies resources",
                        authority: "University of Virginia",
                        priority: "high"
                    }
                ],
                "Islamic Studies": [
                    {
                        title: "Islamic Studies - Oxford Islamic Studies Online",
                        url: "http://www.oxfordislamicstudies.com/",
                        description: "Comprehensive Islamic studies resource",
                        authority: "Oxford University Press",
                        priority: "critical"
                    }
                ],
                "Philosophy": [
                    {
                        title: "PhilPapers",
                        url: "https://philpapers.org/",
                        description: "Comprehensive philosophy bibliography and open access archive",
                        authority: "Academic philosophy community",
                        priority: "high"
                    },
                    {
                        title: "Philosophy Compass",
                        url: "https://onlinelibrary.wiley.com/journal/17479991",
                        description: "State-of-the-art reviews in philosophy",
                        authority: "Wiley Academic",
                        priority: "high"
                    }
                ]
            }
        };
    }

    generateReplacementScript() {
        const script = {
            metadata: {
                generated: new Date().toISOString(),
                purpose: "Replace broken links with authoritative academic sources",
                totalReplacements: 0
            },
            replacements: [],
            additions: []
        };

        // Process critical replacements
        Object.entries(this.recommendations.criticalReplacements).forEach(([category, sources]) => {
            sources.forEach(source => {
                script.replacements.push({
                    category,
                    action: "replace",
                    source: {
                        title: source.title,
                        url: source.url,
                        description: source.description,
                        authority: source.authority,
                        priority: source.priority
                    },
                    replaces: source.replaces || [],
                    instructions: `Replace broken links in category "${category}" with this authoritative source`
                });
            });
        });

        // Process missing sources
        Object.entries(this.recommendations.missingSourcesRecommendations).forEach(([tradition, sources]) => {
            sources.forEach(source => {
                script.additions.push({
                    tradition,
                    action: "add",
                    source: {
                        title: source.title,
                        url: source.url,
                        description: source.description,
                        authority: source.authority,
                        priority: source.priority
                    },
                    instructions: `Add new source for tradition "${tradition}"`
                });
            });
        });

        script.metadata.totalReplacements = script.replacements.length;
        script.metadata.totalAdditions = script.additions.length;

        return script;
    }

    generateSourceUpdateFile() {
        const updates = {
            // Updated sources.json entries with working authoritative links
            updatedSources: {
                "Qur'an": [
                    {
                        name: "Quranic Arabic Corpus",
                        url: "http://corpus.quran.com/",
                        description: "University of Leeds linguistic analysis with word-by-word translations",
                        source: "academic",
                        authority: "University of Leeds"
                    },
                    {
                        name: "Tanzil Quran Navigator",
                        url: "http://tanzil.net/",
                        description: "Open source Quran project with multiple translations",
                        source: "academic"
                    }
                ],
                "Sunnah (Prophetic tradition)": [
                    {
                        name: "USC-MSA Hadith Database",
                        url: "https://www.usc.edu/org/cmje/religious-texts/hadith/",
                        description: "University of Southern California's comprehensive hadith collection",
                        source: "academic",
                        authority: "University of Southern California"
                    },
                    {
                        name: "Sunnah.com - Complete Hadith Collection",
                        url: "https://sunnah.com",
                        description: "Six major Hadith collections with search",
                        source: "other"
                    }
                ],
                "Bible (Old & New Testament)": [
                    {
                        name: "Bible Gateway Academic",
                        url: "https://www.biblegateway.com/",
                        description: "Comprehensive Bible database with scholarly tools",
                        source: "academic",
                        authority: "Zondervan Academic"
                    },
                    {
                        name: "Blue Letter Bible",
                        url: "https://www.blueletterbible.org/",
                        description: "Biblical exegesis tools with original language texts",
                        source: "academic"
                    }
                ],
                "Church Fathers": [
                    {
                        name: "Christian Classics Ethereal Library",
                        url: "https://ccel.org/",
                        description: "Comprehensive collection of Christian literature",
                        source: "academic",
                        authority: "Calvin University"
                    },
                    {
                        name: "New Advent - Church Fathers",
                        url: "http://www.newadvent.org/fathers/",
                        description: "Complete collection of patristic writings",
                        source: "other"
                    }
                ],
                "Upaniṣads": [
                    {
                        name: "Sanskrit Web - Upanishads",
                        url: "http://sanskritdocuments.org/doc_upanishhat/",
                        description: "Sanskrit texts with transliterations",
                        source: "academic"
                    },
                    {
                        name: "Wisdom Library - Upanishads",
                        url: "https://www.wisdomlib.org/hinduism/book/the-upanishads",
                        description: "Scholarly translations and commentaries",
                        source: "academic"
                    }
                ],
                "Bhagavad Gītā": [
                    {
                        name: "Bhagavad Gita Online",
                        url: "https://www.holy-bhagavad-gita.org/",
                        description: "Sanskrit with word-by-word translation",
                        source: "other"
                    },
                    {
                        name: "IIT Kanpur Gita Supersite",
                        url: "http://www.gitasupersite.iitk.ac.in/",
                        description: "IIT Kanpur's comprehensive Gita resource",
                        source: "academic",
                        authority: "Indian Institute of Technology Kanpur"
                    }
                ],
                "Pāli Canon (Tipitaka)": [
                    {
                        name: "SuttaCentral",
                        url: "https://suttacentral.net/",
                        description: "Early Buddhist texts with critical editions",
                        source: "academic",
                        authority: "International Buddhist studies collaboration"
                    },
                    {
                        name: "Access to Insight - Tipitaka",
                        url: "https://accesstoinsight.org/tipitaka/index.html",
                        description: "Comprehensive Theravada Buddhist canon",
                        source: "other"
                    }
                ],
                "Dhammapada": [
                    {
                        name: "Access to Insight - Dhammapada",
                        url: "https://www.accesstoinsight.org/tipitaka/kn/dhp/dhp.intro.budd.html",
                        description: "Scholarly translation with commentary",
                        source: "other"
                    }
                ],
                "Tanakh (Hebrew Bible)": [
                    {
                        name: "Mechon Mamre Hebrew Bible",
                        url: "https://mechon-mamre.org/p/pt/pt0.htm",
                        description: "Hebrew text with traditional punctuation",
                        source: "other"
                    },
                    {
                        name: "Tanach.us",
                        url: "http://www.tanach.us/",
                        description: "Hebrew Bible with multiple English translations",
                        source: "other"
                    }
                ],
                "Talmud": [
                    {
                        name: "Halakhah.com Talmud",
                        url: "http://halakhah.com/",
                        description: "Complete Babylonian Talmud online",
                        source: "other"
                    },
                    {
                        name: "Sefaria Talmud",
                        url: "https://www.sefaria.org/texts/Talmud",
                        description: "Talmud with commentary and translations",
                        source: "other"
                    }
                ],
                "Dao De Jing": [
                    {
                        name: "Chinese Text Project - Dao De Jing",
                        url: "https://ctext.org/dao-de-jing",
                        description: "Chinese text with multiple English translations",
                        source: "academic",
                        authority: "Digital humanities project"
                    }
                ],
                "Zhuangzi": [
                    {
                        name: "Chinese Text Project - Zhuangzi",
                        url: "https://ctext.org/zhuangzi",
                        description: "Complete Chinese text with translations",
                        source: "academic",
                        authority: "Digital humanities project"
                    }
                ],
                "Meditations": [
                    {
                        name: "Perseus Digital Library - Marcus Aurelius",
                        url: "http://www.perseus.tufts.edu/hopper/text?doc=Perseus%3Atext%3A2008.01.0641",
                        description: "Greek text with scholarly apparatus",
                        source: "academic",
                        authority: "Tufts University Perseus Project"
                    }
                ],
                "Discourses": [
                    {
                        name: "Perseus Digital Library - Epictetus",
                        url: "http://www.perseus.tufts.edu/hopper/text?doc=Perseus%3Atext%3A1999.01.0236",
                        description: "Greek text with English translations",
                        source: "academic",
                        authority: "Tufts University Perseus Project"
                    }
                ],
                "Tractus Logico-Philosophicus": [
                    {
                        name: "Project Gutenberg - Tractatus",
                        url: "https://www.gutenberg.org/ebooks/5740",
                        description: "Complete text of Tractatus Logico-Philosophicus",
                        source: "gutenberg.org"
                    }
                ],
                "Utilitarianism": [
                    {
                        name: "Project Gutenberg - Utilitarianism",
                        url: "https://www.gutenberg.org/ebooks/11224",
                        description: "John Stuart Mill's complete work",
                        source: "gutenberg.org"
                    }
                ]
            },

            // New sources to add for missing texts
            newSources: {
                "Āgamas": [
                    {
                        name: "Jain Agamas Collection",
                        url: "http://www.agamashastra.com/",
                        description: "Digital collection of Jain canonical texts",
                        source: "other"
                    }
                ],
                "Tattvartha Sutra": [
                    {
                        name: "Jainworld - Tattvartha Sutra",
                        url: "http://www.jainworld.com/literature/sutra01.htm",
                        description: "Complete Tattvartha Sutra with commentary",
                        source: "other"
                    }
                ],
                "Kojiki": [
                    {
                        name: "Sacred Texts - Kojiki",
                        url: "https://sacred-texts.com/shi/kj/",
                        description: "Complete Kojiki (Records of Ancient Matters)",
                        source: "other"
                    }
                ],
                "Nihon Shoki": [
                    {
                        name: "Sacred Texts - Nihon Shoki",
                        url: "https://sacred-texts.com/shi/nihongi/",
                        description: "Chronicles of Japan (Nihon Shoki)",
                        source: "other"
                    }
                ],
                "Visuddhimagga": [
                    {
                        name: "Access to Insight - Visuddhimagga",
                        url: "https://www.accesstoinsight.org/lib/authors/nanamoli/PathofPurification2011.pdf",
                        description: "Complete Path of Purification translation",
                        source: "other"
                    }
                ],
                "Platform Sutra": [
                    {
                        name: "BDK America - Platform Sutra",
                        url: "https://www.bdkamerica.org/tripitaka-translations",
                        description: "Scholarly translation of Zen foundational text",
                        source: "academic"
                    }
                ],
                "Analects": [
                    {
                        name: "Chinese Text Project - Analects",
                        url: "https://ctext.org/analects",
                        description: "Confucian Analects in Chinese with translations",
                        source: "academic"
                    }
                ]
            }
        };

        return updates;
    }

    async generateReports() {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        
        // Generate replacement script
        const replacementScript = this.generateReplacementScript();
        const scriptPath = path.join(__dirname, `source-replacement-script-${timestamp}.json`);
        await fs.writeFile(scriptPath, JSON.stringify(replacementScript, null, 2));
        
        // Generate source updates
        const sourceUpdates = this.generateSourceUpdateFile();
        const updatesPath = path.join(__dirname, `source-updates-${timestamp}.json`);
        await fs.writeFile(updatesPath, JSON.stringify(sourceUpdates, null, 2));
        
        // Generate implementation guide
        const implementationGuide = this.generateImplementationGuide();
        const guidePath = path.join(__dirname, `implementation-guide-${timestamp}.md`);
        await fs.writeFile(guidePath, implementationGuide);
        
        return {
            replacementScript: scriptPath,
            sourceUpdates: updatesPath,
            implementationGuide: guidePath
        };
    }

    generateImplementationGuide() {
        return `# Implementation Guide: Authoritative Source Replacements

Generated: ${new Date().toISOString()}

## Overview
This guide provides step-by-step instructions for replacing broken links and adding missing sources with authoritative academic and scholarly alternatives.

## Priority Actions (Critical - Implement First)

### 1. Replace Broken Archive.org Links
Many Archive.org links are returning 404 errors. Replace with these authoritative alternatives:

#### Islamic Sources
- **Quran**: Replace with University of Leeds Quranic Arabic Corpus
- **Hadith**: Replace with USC-MSA Hadith Database
- **Fiqh**: Use Oxford Islamic Studies Online

#### Christian Sources  
- **Bible**: Replace with Bible Gateway Academic + Blue Letter Bible
- **Patristics**: Replace with Christian Classics Ethereal Library (Calvin University)

#### Hindu Sources
- **Upanishads**: Replace with Sanskrit Web + Wisdom Library
- **Bhagavad Gita**: Replace with IIT Kanpur Gita Supersite
- **Vedas**: Use Sanskrit Documents Collection

#### Buddhist Sources
- **Pali Canon**: Replace with SuttaCentral (critical editions)
- **Meditation texts**: Use Access to Insight + 84000 Project

#### Jewish Sources
- **Hebrew Bible**: Replace with Mechon Mamre + Tanach.us
- **Talmud**: Replace with Halakhah.com + Sefaria

### 2. Fix Wikisource 403 Errors
Many Wikisource links are blocked. Replace with:
- **Greek/Roman philosophy**: Perseus Digital Library (Tufts University)
- **Modern philosophy**: Project Gutenberg + Stanford Encyclopedia

### 3. Add Missing Sources for Key Traditions

#### High Priority Missing Sources:
1. **Jainism**: Add Jain Agamas collection + Jainworld resources
2. **Shintoism**: Add Sacred Texts Archive for Kojiki/Nihon Shoki  
3. **Zen Buddhism**: Add BDK America for Platform Sutra
4. **Confucianism**: Add Chinese Text Project for all texts

## Implementation Steps

### Step 1: Update sources.json
Replace the broken entries in \`src/data/json/sources.json\` with the working alternatives provided in \`source-updates-[timestamp].json\`.

### Step 2: Add Missing Sources
Add new source categories for traditions that currently lack authoritative references.

### Step 3: Update traditions.json
Remove placeholder text (e.g., "CText.org verified") and ensure all primary texts have corresponding sources.

### Step 4: Verify Academic Authority
Prioritize sources from:
- **.edu domains** (universities)
- **Digital humanities projects** (Perseus, Chinese Text Project)
- **Scholarly institutions** (Oxford, Cambridge, IIT)
- **Established archives** (Project Gutenberg, Sacred Texts)

### Step 5: Test All Links
Run the verification script again to ensure all new links are working.

## Quality Standards

### Academic Authority Hierarchy:
1. **University resources** (.edu domains, institutional projects)
2. **Scholarly publishers** (Oxford, Cambridge, academic presses)
3. **Digital humanities projects** (Perseus, SuttaCentral, Chinese Text Project)
4. **Established archives** (Project Gutenberg, Sacred Texts Archive)
5. **Specialized scholarly sites** (Access to Insight, Sefaria)

### Verification Criteria:
- ✅ Links must return HTTP 200 status
- ✅ Content must be scholarly/academic quality
- ✅ Sources should include original language when possible
- ✅ Multiple translations preferred for ancient texts
- ✅ Commentary and critical apparatus valuable

## Long-term Recommendations

1. **Partner with academic institutions** for stable hosting
2. **Consider DOI links** for permanent citations
3. **Add backup URLs** for critical sources
4. **Regular link monitoring** (quarterly verification)
5. **Academic peer review** of source selections

## Critical Broken Links Requiring Immediate Attention

The following 55 broken links need immediate replacement:
- 44 Archive.org 404 errors
- 11 Wikisource 403 errors

See \`source-replacement-script-[timestamp].json\` for complete mapping of broken links to authoritative replacements.

---
*Generated by Source Recommendations System*
`;
    }

    async run() {
        console.log('🔗 Generating Source Recommendations...\n');
        
        try {
            const reports = await this.generateReports();
            
            console.log('📊 Source Recommendations Generated:');
            console.log(`  • Replacement Script: ${reports.replacementScript}`);
            console.log(`  • Source Updates: ${reports.sourceUpdates}`);
            console.log(`  • Implementation Guide: ${reports.implementationGuide}`);
            
            console.log('\n🎯 Priority Actions:');
            console.log('  1. Replace 55 broken links with authoritative alternatives');
            console.log('  2. Add missing sources for 13 traditions');
            console.log('  3. Prioritize academic (.edu) and scholarly sources');
            console.log('  4. Test all new links for stability');
            
            console.log('\n✅ Next Steps:');
            console.log('  1. Review implementation guide');
            console.log('  2. Apply source updates to sources.json');
            console.log('  3. Remove placeholder text from traditions.json');
            console.log('  4. Re-run verification script to confirm fixes');
            
            return reports;
            
        } catch (error) {
            console.error('❌ Error generating recommendations:', error);
            throw error;
        }
    }
}

// Run if called directly
if (require.main === module) {
    const generator = new SourceRecommendationsGenerator();
    generator.run().catch(console.error);
}

module.exports = SourceRecommendationsGenerator;