# Philosophy & Religion Explorer

An interactive educational web application that allows users to explore, compare, and understand 29 major philosophical and religious traditions from across human history. The application provides comprehensive analysis across four fundamental dimensions: Metaphysics (nature of reality), Epistemology (sources of knowledge), Ethics (moral principles), and Liberation/Salvation (ultimate goals and paths).

## What This Application Does

**Philosophy & Religion Explorer** serves as a comprehensive digital library and comparison tool for understanding the world's major wisdom traditions. Whether you're a student, educator, researcher, or simply curious about different worldviews, this application provides:

- **Interactive Timeline Visualization**: Explore traditions chronologically from 10,000 BCE to present day
- **Side-by-Side Comparisons**: Compare up to multiple traditions simultaneously across all four philosophical dimensions  
- **Detailed Tradition Profiles**: Deep-dive into each tradition's beliefs, practices, key figures, and primary texts
- **AI-Powered Debates**: Watch simulated debates between representatives of different philosophical traditions
- **Exportable Knowledge Base**: Print or download complete documentation for offline study and verification
- **Responsive Design**: Seamless experience across desktop, tablet, and mobile devices
- **Dark/Light Theme**: Comfortable reading in any lighting condition

The application transforms complex philosophical and religious concepts into accessible, structured information while maintaining scholarly accuracy and providing primary source references.

## Features

- **Tradition Comparison**: Side-by-side analysis of 29 philosophical and religious traditions
- **Interactive Timeline**: Chronological visualization with two positioning modes
- **Detailed Tradition Views**: Exploration of each tradition's core beliefs
- **Source Integration**: Links to primary texts and foundational documents
- **Theme Support**: Dark and light mode interface
- **Knowledge Export**: Print and download complete philosophical knowledge base
- **AI Debate Mode**: Watch AI representatives debate fundamental questions

## Covered Traditions (29 Total)

### Buddhism
- **Theravada Buddhism** - Liberation through the Noble Eightfold Path
- **Mahayana Buddhism** - Compassionate service and bodhisattva ideal  
- **Zen Buddhism** - Direct insight through meditation

### Abrahamic Traditions
- **Judaism** - Covenant relationship with God and ethical living
- **Christianity** - Salvation through faith in Jesus Christ
- **Eastern Orthodox Christianity** - Theosis (deification) through divine participation
- **Islam (Sunni)** - Submission to Allah through the Five Pillars
- **Islam (Shia)** - Following divinely appointed Imams' guidance
- **Mormonism (LDS Church)** - Exaltation through restored gospel and temple ordinances

### Indian Philosophy
- **Hinduism (Advaita Vedanta)** - Liberation through knowledge of Brahman
- **Hinduism (Vaishnavism)** - Devotional love and service to Vishnu/Krishna
- **Jainism** - Liberation through non-violence and purification
- **Sikhism** - Union with the divine through devotion and service

### East Asian Traditions
- **Confucianism** - Social harmony through virtue and propriety
- **Daoism (Taoism)** - Harmony with natural order
- **Shintoism** - Connection with kami and nature

### Western Philosophy

#### Classical
- **Stoicism** - Virtue through reason and acceptance

#### Modern
- **Utilitarianism** - Maximum welfare for all
- **Marxism** - Historical materialism and class analysis
- **Pragmatism** - Truth through practical application
- **Secular Humanism** - Human dignity and scientific method

#### Contemporary
- **Existentialism** - Authentic existence and responsibility
- **Absurdism (Camus)** - Acceptance of life's meaninglessness
- **Postmodernism** - Critique of universal narratives
- **Analytic Philosophy** - Logical analysis and precision
- **New Age Spirituality** - Synthesis of Eastern and Western practices (includes Alan Watts)
- **Environmental Philosophy** - Deep ecology and Earth-centered ethics
- **Effective Altruism** - Evidence-based global impact maximization

#### Other
- **Indigenous Wisdom** - Sacred relationship with land and ancestors

## Data Structure

Each tradition is analyzed across four philosophical dimensions:

### 1. Metaphysics
- Ultimate Reality: What exists at the deepest level
- View of World: How physical reality is understood
- View of Self: Human nature and consciousness
- Afterlife: What happens after death

### 2. Epistemology
- Sources of Knowledge: Scripture, reason, experience, revelation, intuition

### 3. Ethics
- Moral Principles: What makes actions right or wrong
- Virtue Systems: Character traits to be cultivated

### 4. Liberation/Salvation
- Ultimate Goal: The highest human aspiration
- Path/Method: How to achieve this goal

## File Structure

```
src/data/
├── json/
│   ├── traditions.json     # Complete tradition data
│   └── sources.json        # Online source links
├── loaders.ts             # Data loading utilities
└── traditions.ts          # Data exports
```

## Source Integration

The application links to primary texts from:

- **Academic Institutions**: University of Leeds, Tufts University, USC, IIT Kanpur, Calvin University
- **Digital Projects**: Chinese Text Project, SuttaCentral, Access to Insight, Sefaria
- **Archives**: Project Gutenberg, Sacred Texts Archive, Archive.org, Wikisource

## Timeline Features

### Timeline Modes
- **Accurate Mode**: Proportional historical spacing with era labels at historical centers
- **Linear Mode**: Even spacing with evenly distributed era labels

### Interface
- Single horizontal timeline with color-coded tradition markers
- Hover tooltips with tradition details
- Click markers to open detailed tradition information
- Category filtering by philosophical families
- Tabbed organization for Historical Eras and Philosophical Categories

### Era Distribution
- **Ancient (before 0 CE)**: Indigenous Wisdom, Judaism, Jainism, Confucianism, Shintoism, Daoism, Stoicism, Theravada Buddhism, Mahayana Buddhism
- **Classical (0-500 CE)**: Christianity, Zen Buddhism  
- **Medieval (500-1500 CE)**: Sunni Islam, Hinduism (Advaita Vedanta), Sikhism
- **Early Modern (1500-1800 CE)**: Utilitarianism, Marxism, Pragmatism
- **Modern (1800+ CE)**: Analytic Philosophy, Alan Watts, Secular Humanism, Existentialism, Absurdism, Postmodernism

## Data Quality

### Confidence Scoring
- **95-100%**: Well-documented traditions (Christianity, Islam, Buddhism)
- **85-94%**: Good documentation with minor uncertainties
- **70-84%**: Good sources with some gaps
- **Below 70%**: Limited sources or scholarly disagreement

## Installation

### Prerequisites
- Node.js 18+
- npm or yarn

### Setup
```bash
git clone [repository-url]
cd philo-explorer
npm install
npm start
```

### Build
```bash
npm run build    # Production build
npm run lint     # Code linting
```

## Deployment

### Cloudflare Pages

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigate to Pages → Create a project → Connect to Git
3. Select the repository and configure:
   - **Project name**: philosophical-explorer
   - **Production branch**: main
   - **Framework preset**: Create React App
   - **Build command**: npm run build
   - **Build output directory**: build
4. Click "Save and Deploy"

The app will be available at: `https://philosophical-explorer.pages.dev`

### CLI Deployment
```bash
npm install -g wrangler
wrangler login
npm run build
wrangler pages deploy build --project-name=philosophical-explorer
```

## Known Issues & Improvements Needed

### Source Links Quality
- Several traditions lack comprehensive source links
- Some traditions have repetitive or outdated links  
- Need validation and improvement of academic and primary source references
- Priority areas: Environmental Philosophy, New Age Spirituality, Effective Altruism

### Planned Enhancements
- **Alan Watts Deep Dive**: Integration with dedicated Alan Watts project for expanded exploration
- **Enhanced Source Validation**: Comprehensive review and update of all tradition source links
- **Additional Traditions**: Potential expansion to include more regional philosophical traditions
- **Quiz Mode**: Interactive assessment to discover aligned philosophical traditions (currently disabled)

## Contributing

### Data Improvement
1. Review tradition data in `src/data/json/traditions.json`
2. Verify against scholarly sources - **urgent need for source link validation**
3. Submit improvements with citations
4. Update confidence scores based on source reliability
5. Focus on traditions with limited or poor-quality sources

### Code Contributions
1. Follow TypeScript and React best practices
2. Maintain accessibility standards
3. Test across different themes and screen sizes
4. Consider integration patterns for external philosophical projects

## License

MIT License - see LICENSE file for details.

## Technical Details

- **Framework**: React 19 with TypeScript
- **UI Library**: Material-UI v5
- **Build Size**: ~201KB gzipped
- **Data**: JSON-based with 29 philosophical traditions
- **Deployment**: Cloudflare Pages with global CDN

---

This application is for educational purposes. Users are encouraged to consult primary sources and scholarly works for authoritative information.