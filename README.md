# Philosophical Explorer

A comprehensive React application for comparing philosophical and religious traditions across four fundamental areas: Metaphysics, Epistemology, Ethics, and Liberation/Salvation.

## 🌟 Features

- **Interactive Tradition Comparison**: Side-by-side analysis of 23 major philosophical and religious traditions
- **Enhanced Interactive Timeline**: Fully interactive chronological visualization with era filtering, hover effects, animated transitions, and detailed tradition tooltips
- **Detailed Tradition Views**: In-depth exploration of each tradition's core beliefs and practices
- **AI-Powered Debates**: Watch AI representatives from different traditions engage in philosophical discussions
- **Educational Tooltips**: Hover explanations for philosophical concepts and terminology
- **Verified Source Integration**: Direct links to primary texts and foundational documents from authoritative academic institutions and digital libraries
- **Dark/Light Themes**: Fully accessible interface with theme consistency

## 📚 Covered Traditions (23 Total)

### Major Religious Traditions

#### **Buddhism** 🧘‍♂️
- **Theravada Buddhism** - Conservative tradition emphasizing individual liberation
- **Mahayana Buddhism** - Great Vehicle emphasizing universal salvation and bodhisattva ideal  
- **Zen Buddhism** - Direct realization through meditation and sudden enlightenment

#### **Abrahamic Traditions** ✡️☪️✝️
- **Judaism** - Covenant relationship with God and ethical living
- **Christianity** - Salvation through faith in Jesus Christ
- **Islam (Sunni)** - Submission to Allah through the Five Pillars

#### **Indian Philosophical Traditions** 🕉️
- **Hinduism (Advaita Vedanta)** - Non-dual liberation through knowledge of Brahman
- **Jainism** - Liberation through non-violence and spiritual purification
- **Sikhism** - Union with the divine through devotion and service

#### **East Asian Traditions** ☯️⛩️
- **Confucianism** - Social harmony through virtue and ritual propriety
- **Daoism (Taoism)** - Harmony with the natural order (Dao)
- **Shintoism** - Connection with kami and natural harmony

#### **Other Wisdom Traditions** 🌍
- **Indigenous Wisdom** - Sacred relationship with land and ancestral guidance

### Western Philosophical Schools

#### **Ancient & Classical** 🏛️
- **Stoicism** - Virtue and tranquility through reason and acceptance

#### **Modern Ethics & Political Philosophy** ⚖️
- **Utilitarianism** - Greatest good for the greatest number  
- **Marxism** - Historical materialism and class struggle analysis

#### **American Philosophy** 🇺🇸
- **Pragmatism** - Truth through practical consequences
- **Secular Humanism** - Human dignity and scientific rationalism

#### **20th Century Continental** 🌍
- **Existentialism** - Authentic existence and personal responsibility
- **Absurdism (Camus)** - Embrace of life's inherent meaninglessness
- **Postmodernism** - Critique of grand narratives and power structures

#### **Analytic Tradition** 🧠
- **Analytic Philosophy** - Logical analysis and linguistic precision

#### **Contemporary Synthesis** 🌟
- **Alan Watts** - Western interpretation of Eastern wisdom

## 🏗️ Data Structure Framework

### Core Philosophy Areas
Each tradition is analyzed across four fundamental philosophical dimensions:

#### 1. **Metaphysics** 🧠
- **Ultimate Reality**: What exists at the deepest level?
- **View of World**: How is physical reality understood?
- **View of Self**: What is human nature and consciousness?
- **Afterlife**: What happens after death?

#### 2. **Epistemology** 📖
- **Sources of Knowledge**: How do we know what we know?
- Examples: Scripture, reason, experience, revelation, intuition

#### 3. **Ethics** ⚖️
- **Moral Principles**: What makes actions right or wrong?
- **Virtue Systems**: What character traits should be cultivated?

#### 4. **Liberation/Salvation** ✈️
- **Ultimate Goal**: What is the highest human aspiration?
- **Path/Method**: How do we achieve this goal?

### Data Organization

```
src/data/
├── json/
│   ├── traditions.json     # Complete tradition data
│   └── sources.json        # Online source links
├── loaders.ts             # Data loading utilities
└── sources.ts             # Source link management
```

### Tradition Data Schema

```typescript
interface Tradition {
  id: string;
  name: string;
  category: 'Religion' | 'Philosophy';
  subSchool: string;
  originDate: string;
  keyFigures: string[];
  adherents: string;
  confidence: number;        // 0-1 scale for data reliability
  
  metaphysics: {
    ultimateReality: string;
    viewOfWorld: string;
    viewOfSelf: string;
    afterlife: string;
  };
  
  epistemology: string[];    // Sources of knowledge
  ethics: string[];          // Moral principles
  
  liberation: {
    goal: string;            // Ultimate aspiration
    path: string[];          // Steps to achieve goal
  };
  
  primaryTexts: string[];    // Foundational writings
  sources?: Citation[];      // Academic references
  critiques: Record<string, string>; // Inter-tradition critiques
  lastUpdated: string;
}
```

## 🔗 Source Integration

### Verified Academic Sources
The application integrates with authoritative academic institutions and digital libraries:

#### **Academic Institutions (.edu domains)**
- **University of Leeds** - Quranic Arabic Corpus with linguistic analysis
- **Tufts University** - Perseus Digital Library for Greek and Roman texts
- **University of Southern California** - Comprehensive hadith database
- **IIT Kanpur** - Bhagavad Gita Supersite
- **Calvin University** - Christian Classics Ethereal Library

#### **Digital Humanities Projects**
- **Chinese Text Project** (ctext.org) - Complete Chinese philosophical texts with translations
- **SuttaCentral** - Critical editions of early Buddhist texts
- **Access to Insight** - Comprehensive Theravada Buddhist canon
- **Sefaria** - Jewish texts with commentary and translations

#### **Established Archives**
- **Project Gutenberg** - Modern philosophy and literature
- **Sacred Texts Archive** - Religious and spiritual traditions
- **Archive.org** - Historical documents and manuscripts
- **Wikisource** - Community-verified primary sources

### Adding New Sources
Sources are managed in `src/data/json/sources.json`:

```json
{
  "Bible": [
    {
      "name": "King James Bible",
      "source": "Archive.org",
      "url": "https://archive.org/details/kingjamesbible",
      "type": "full_text"
    }
  ]
}
```

## 🎯 LLM Review Framework

### Review Criteria for Tradition Data

When reviewing and updating tradition data, focus on these areas:

#### 1. **Accuracy & Authenticity**
- Are core beliefs represented accurately?
- Do descriptions reflect mainstream understanding?
- Are there significant misrepresentations or oversimplifications?

#### 2. **Completeness**
- Are all four philosophical areas (metaphysics, epistemology, ethics, liberation) adequately covered?
- Are key concepts and practices included?
- Are important figures and texts listed?

#### 3. **Balance & Fairness**
- Are positive and challenging aspects both represented?
- Are critiques fair and scholarly rather than dismissive?
- Is the tradition presented in its own terms?

#### 4. **Source Quality**
- Are primary texts correctly identified?
- Do source links work and lead to reliable content?
- Are there better online resources available?

#### 5. **Consistency**
- Does the confidence score (0-1) accurately reflect source reliability?
- Are similar traditions described with comparable depth?
- Is terminology consistent across traditions?

### Review Process

1. **Load Current Data**: Review existing tradition data in `src/data/json/traditions.json`
2. **Scholarly Verification**: Cross-check against academic sources and primary texts
3. **Source Enhancement**: Find better online links for primary texts and concepts
4. **Gap Analysis**: Identify missing information or incomplete sections
5. **Quality Improvement**: Suggest specific improvements for accuracy and completeness
6. **Documentation**: Update confidence scores and last-updated timestamps

### Improvement Suggestions Format

For each tradition, provide:
```
TRADITION: [Name]
ACCURACY: [Issues found / Corrections needed]
COMPLETENESS: [Missing information]
SOURCES: [Better links / Additional texts]
CONFIDENCE: [Recommended score with justification]
SPECIFIC CHANGES: [Detailed improvement suggestions]
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation
```bash
git clone [repository-url]
cd philo-explorer
npm install
npm start
```

### Development
```bash
npm run build    # Production build
npm run lint     # Code linting
npm run test     # Run tests (when implemented)
```

## 🎨 User Interface

### Navigation
- **Select Traditions**: Browse and choose traditions for comparison
- **Enhanced Interactive Timeline**: View traditions chronologically with multiple interaction modes
- **Compare**: Side-by-side analysis of selected traditions
- **AI Debate**: Watch philosophical discussions between tradition representatives
- **Quiz Mode**: Discover aligned traditions (coming soon)

### Enhanced Timeline Features 🕒

#### **Timeline Modes**
- **Accurate Mode**: Proportional historical spacing showing true chronological gaps with era labels positioned at historical centers
- **Linear Mode**: Even spacing for easy comparison while maintaining chronological order with evenly distributed era labels

#### **Clean, Modern Design**
- **Simplified Visual Layout**: Single horizontal timeline with color-coded tradition markers
- **Smart Era Labels**: Responsive positioning - evenly spaced in Linear mode, historically accurate in Accurate mode
- **Color-Coded Categories**: Each philosophical family has its own color (Buddhism=Orange, Abrahamic=Blue, etc.)
- **Clean Tooltips**: Simple, informative hover cards with essential tradition details

#### **Interactive Elements**
- **Click for Details**: Click any tradition marker to open detailed tradition information
- **Hover Effects**: Smooth scaling and glow effects on tradition markers
- **Category Filtering**: Browse by philosophical families (Buddhism, Abrahamic, Indian Philosophy, etc.)
- **Tabbed Organization**: Switch between Historical Eras and Philosophical Categories views
- **Smooth Transitions**: Animated mode switching with 0.3s ease-in-out effects

#### **Era Distribution**
- **Ancient (before 0 CE)**: Indigenous Wisdom, Judaism, Jainism, Confucianism, Shintoism, Daoism, Stoicism, Theravada Buddhism, Mahayana Buddhism
- **Classical (0-500 CE)**: Christianity, Zen Buddhism  
- **Medieval (500-1500 CE)**: Sunni Islam, Hinduism (Advaita Vedanta), Sikhism
- **Early Modern (1500-1800 CE)**: Utilitarianism, Marxism, Pragmatism
- **Modern (1800+ CE)**: Analytic Philosophy, Alan Watts, Secular Humanism, Existentialism, Absurdism, Postmodernism

### General Interactive Features
- **Educational Tooltips**: Hover over philosophical terms for explanations
- **Verified Source Links**: Click primary texts to access authoritative online versions
- **Theme Toggle**: Switch between dark and light modes with consistent readability
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices

## 📊 Data Quality

### Confidence Scoring
- **95-100%**: Extremely well-documented (Christianity, Islam, Buddhism)
- **85-94%**: Well-documented with minor uncertainties
- **70-84%**: Good sources but some gaps or scholarly debates
- **Below 70%**: Limited sources or significant scholarly disagreement

### Last Updated
All tradition data includes timestamps showing when information was last reviewed and verified.

## 🤝 Contributing

### Data Improvement
To improve tradition data:
1. Review current information in `src/data/json/traditions.json`
2. Verify against scholarly sources and primary texts
3. Submit improvements with citations and justifications
4. Update confidence scores based on source reliability

### Adding Traditions
To add new traditions:
1. Follow the schema in `src/types.ts`
2. Include all four philosophical areas
3. Provide primary text sources with online links when possible
4. Set appropriate confidence score based on available sources

### Code Contributions
1. Follow TypeScript and React best practices
2. Maintain accessibility standards
3. Include tooltips for philosophical terminology
4. Test across different themes and screen sizes

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Academic sources and scholarly traditions represented
- Online repositories making primary texts accessible
- Open source community for React and Material-UI frameworks

---

**Note**: This application is designed for educational purposes. While every effort is made to represent traditions accurately and fairly, users are encouraged to consult primary sources and scholarly works for authoritative information.
