# Philosophical Traditions Data Structure

This directory contains the data for philosophical and religious traditions used in the Philo Explorer application.

## Directory Structure

```
src/data/
├── json/
│   ├── traditions.json    # All tradition data in JSON format
│   └── sources.json       # Source links for texts and concepts
├── loaders.ts            # Data loading utilities and functions
├── traditions.ts         # Backward compatibility wrapper (deprecated)
├── sources.ts            # Backward compatibility wrapper (deprecated)
└── README.md            # This file
```

## Data Files

### `json/traditions.json`
Contains an array of tradition objects with the following structure:
- `id`: Unique identifier
- `name`: Display name
- `category`: Classification (e.g., "Hindu Philosophy", "Islamic Theology")
- `subSchool`: Optional sub-classification
- `metaphysics`: Core metaphysical beliefs
- `epistemology`: Sources of knowledge (array)
- `ethics`: Moral principles (array)
- `liberation`: Ultimate goal and path
- `critiques`: Inter-tradition criticisms
- `primaryTexts`: Key texts (array)
- `adherents`: Number of followers
- `originDate`: Historical origin
- `keyFigures`: Important figures (array)
- `confidence`: Data reliability score (0-1)
- `lastUpdated`: Last modification date
- `sources`: Citation array

### `json/sources.json`
Maps text/concept names to arrays of source links with:
- `name`: Display name of the source
- `url`: Direct link to the resource
- `description`: Brief description
- `source`: Platform type (archive.org, wikisource, etc.)
- `language`: Optional language specification
- `translation`: Optional translator information

## Usage

### Importing Data
```typescript
import { loadTraditions, loadSources, getSourceLinks } from '../data/loaders';

// Load all traditions
const traditions = loadTraditions();

// Get source links for a specific text
const links = getSourceLinks('Four Noble Truths');
```

### Helper Functions Available
- `loadTraditions()`: Returns all traditions
- `loadSources()`: Returns source links mapping
- `getSourceLinks(textName)`: Gets links for specific text
- `getTraditionById(id)`: Find tradition by ID
- `getTraditionsByCategory(category)`: Filter by category
- `searchTraditions(term)`: Search across traditions

## Adding New Data

### Adding a New Tradition
1. Edit `json/traditions.json`
2. Add new tradition object following existing structure
3. Ensure all required fields are present
4. Update `lastUpdated` field
5. Test the application

### Adding Source Links
1. Edit `json/sources.json`
2. Add new key-value pair where key is the text/concept name
3. Provide array of source link objects
4. Test links are working and accessible

## Data Validation

The TypeScript interfaces in `../types/index.ts` provide compile-time validation for the data structure. The confidence score indicates data reliability:

- **0.95-1.0**: Extremely well-documented (Christianity, Islam)
- **0.85-0.94**: Well-documented with minor uncertainties  
- **0.70-0.84**: Good sources but some gaps/debates
- **Below 0.70**: Limited sources or scholarly disagreement

## Benefits of JSON Structure

1. **Easy Editing**: Non-technical users can edit JSON files
2. **Version Control**: Clear diffs when data changes
3. **Validation**: Schema validation possible
4. **Import/Export**: Easy backup and sharing
5. **Agnostic UI**: Interface automatically reflects data changes
6. **Maintainability**: Separate data from code logic

## Migration Notes

The old `traditions.ts` and `sources.ts` files now act as compatibility wrappers that import from the JSON files via `loaders.ts`. This ensures existing components continue to work while providing the new JSON-based architecture.