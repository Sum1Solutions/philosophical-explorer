import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Chip,
  TextField,
  Autocomplete,
  Grid,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  CardActions
} from '@mui/material';
import { Add, Clear, Compare, Info } from '@mui/icons-material';
import { Tradition, FilterCategory } from '../types';
import { traditions } from '../data/traditions';
import TraditionDetailView from './TraditionDetailView';

interface TraditionSelectorProps {
  selectedTraditions: string[];
  onSelectionChange: (traditionIds: string[]) => void;
  onCompare: () => void;
}

const TraditionSelector: React.FC<TraditionSelectorProps> = ({
  selectedTraditions,
  onSelectionChange,
  onCompare
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<FilterCategory>('all');
  const [quickCompareA, setQuickCompareA] = useState<string>('');
  const [quickCompareB, setQuickCompareB] = useState<string>('');
  const [selectedTraditionForDetail, setSelectedTraditionForDetail] = useState<Tradition | null>(null);
  const [isDetailViewOpen, setIsDetailViewOpen] = useState(false);

  const categories = [
    { value: 'all', label: 'All Traditions' },
    { value: 'religion', label: 'Religions' },
    { value: 'philosophy', label: 'Philosophy' },
    { value: 'eastern', label: 'Eastern' },
    { value: 'western', label: 'Western' }
  ];

  const filteredTraditions = traditions.filter(tradition => {
    const matchesSearch = tradition.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tradition.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesCategory = true;
    switch (categoryFilter) {
      case 'religion':
        matchesCategory = tradition.category.includes('Theology') || 
                         tradition.category.includes('Buddhism') ||
                         tradition.category.includes('Hindu');
        break;
      case 'philosophy':
        matchesCategory = tradition.category.includes('Philosophy');
        break;
      case 'eastern':
        matchesCategory = tradition.category.includes('Hindu') ||
                         tradition.category.includes('Buddhist') ||
                         tradition.category.includes('Eastern');
        break;
      case 'western':
        matchesCategory = tradition.category.includes('Western') ||
                         tradition.category.includes('Christian') ||
                         tradition.category.includes('Islamic');
        break;
    }
    
    return matchesSearch && matchesCategory;
  });

  const handleTraditionToggle = (traditionId: string) => {
    if (selectedTraditions.includes(traditionId)) {
      onSelectionChange(selectedTraditions.filter(id => id !== traditionId));
    } else {
      onSelectionChange([...selectedTraditions, traditionId]);
    }
  };

  const handleQuickCompare = () => {
    if (quickCompareA && quickCompareB && quickCompareA !== quickCompareB) {
      onSelectionChange([quickCompareA, quickCompareB]);
      onCompare();
    }
  };

  // Auto-fill first tradition when selecting a second one in quick compare
  const handleQuickCompareAChange = (newValue: Tradition | null) => {
    setQuickCompareA(newValue?.id || '');
    // Auto-select this tradition
    if (newValue && !selectedTraditions.includes(newValue.id)) {
      onSelectionChange([...selectedTraditions, newValue.id]);
    }
  };

  const handleQuickCompareBChange = (newValue: Tradition | null) => {
    setQuickCompareB(newValue?.id || '');
    // Auto-select this tradition and trigger comparison if both are selected
    if (newValue) {
      const newSelections = [...selectedTraditions];
      if (!newSelections.includes(newValue.id)) {
        newSelections.push(newValue.id);
      }
      // If we now have the quick compare pair, auto-compare
      if (quickCompareA && newSelections.includes(quickCompareA) && newSelections.includes(newValue.id)) {
        onSelectionChange([quickCompareA, newValue.id]);
        setTimeout(() => onCompare(), 100); // Small delay to ensure state is updated
      } else {
        onSelectionChange(newSelections);
      }
    }
  };

  const clearSelection = () => {
    onSelectionChange([]);
  };

  const getTraditionName = (id: string) => {
    return traditions.find(t => t.id === id)?.name || id;
  };

  const handleTraditionClick = (tradition: Tradition) => {
    // Auto-select the tradition if it's not already selected
    if (!selectedTraditions.includes(tradition.id)) {
      handleTraditionToggle(tradition.id);
    }
    setSelectedTraditionForDetail(tradition);
    setIsDetailViewOpen(true);
  };

  const handleCardHeaderClick = (tradition: Tradition, e: React.MouseEvent) => {
    e.stopPropagation();
    // Auto-select on header click
    if (!selectedTraditions.includes(tradition.id)) {
      handleTraditionToggle(tradition.id);
    }
  };

  const handleDetailViewClose = () => {
    setIsDetailViewOpen(false);
    setSelectedTraditionForDetail(null);
  };

  const handleAddToCompareFromDetail = (traditionId: string) => {
    handleTraditionToggle(traditionId);
  };

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h5" gutterBottom>
        Select Philosophical Traditions to Compare
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Click any tradition to auto-select it for comparison. Click headers, cards, or buttons to add multiple traditions.
      </Typography>

      {/* Search and Filter */}
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <TextField
              fullWidth
              label="Search traditions"
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Category</InputLabel>
              <Select
                value={categoryFilter}
                label="Category"
                onChange={(e) => setCategoryFilter(e.target.value as FilterCategory)}
              >
                {categories.map(category => (
                  <MenuItem key={category.value} value={category.value}>
                    {category.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>

      {/* Selected Traditions Display */}
      {selectedTraditions.length > 0 && (
        <Box sx={{ 
          mb: 3, 
          p: 3, 
          bgcolor: selectedTraditions.length >= 2 ? 'success.light' : 'warning.light', 
          borderRadius: 2,
          border: '2px solid',
          borderColor: selectedTraditions.length >= 2 ? 'success.main' : 'warning.main',
          color: (theme) => theme.palette.mode === 'dark' ? 'text.primary' : 'inherit'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Typography variant="h6" sx={{ 
              color: (theme) => {
                const isDark = theme.palette.mode === 'dark';
                if (selectedTraditions.length >= 2) {
                  return isDark ? 'success.light' : 'success.dark';
                } else {
                  return isDark ? 'warning.light' : 'warning.dark';
                }
              },
              fontWeight: 'bold' 
            }}>
              {selectedTraditions.length >= 2 ? '✓ Ready to Compare' : `Select ${2 - selectedTraditions.length} More`} ({selectedTraditions.length})
            </Typography>
            <Button
              size="small"
              onClick={clearSelection}
              startIcon={<Clear />}
              color="secondary"
              variant="outlined"
            >
              Clear All
            </Button>
            <Button
              variant="contained"
              onClick={onCompare}
              startIcon={<Compare />}
              disabled={selectedTraditions.length < 2}
              size="large"
              sx={{
                boxShadow: 3,
                animation: selectedTraditions.length >= 2 ? 'pulse 2s infinite' : 'none',
                '@keyframes pulse': {
                  '0%': { boxShadow: 3 },
                  '50%': { boxShadow: 6 },
                  '100%': { boxShadow: 3 }
                },
                '&:hover': {
                  boxShadow: 6
                }
              }}
            >
              {selectedTraditions.length >= 2 ? `🔍 Compare Now!` : `Need ${2 - selectedTraditions.length} More`}
            </Button>
          </Box>
          <Box sx={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: 1, 
            p: 2, 
            bgcolor: (theme) => theme.palette.mode === 'dark' ? 'grey.800' : 'grey.50', 
            borderRadius: 1 
          }}>
            {selectedTraditions.map((id, index) => (
              <Chip
                key={id}
                label={`${index + 1}. ${getTraditionName(id)}`}
                onDelete={() => handleTraditionToggle(id)}
                color="primary"
                variant="filled"
                sx={{
                  fontSize: '0.9rem',
                  height: 36,
                  '& .MuiChip-label': {
                    fontWeight: 'bold'
                  }
                }}
              />
            ))}
          </Box>
        </Box>
      )}

      {/* Help text when no traditions selected */}
      {selectedTraditions.length === 0 && (
        <Box sx={{ 
          mb: 3, 
          p: 2, 
          bgcolor: 'info.light', 
          borderRadius: 1,
          textAlign: 'center'
        }}>
          <Typography variant="body1" color="info.dark">
            💡 <strong>Quick Start:</strong> Click any tradition name or card to auto-select it. 
            Select 2+ traditions to enable comparison.
          </Typography>
        </Box>
      )}

      {/* Tradition Grid */}
      <Grid container spacing={2}>
        {filteredTraditions.map(tradition => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={tradition.id}>
            <Card 
              sx={{ 
                bgcolor: selectedTraditions.includes(tradition.id) 
                  ? 'primary.light' 
                  : 'background.paper',
                border: selectedTraditions.includes(tradition.id)
                  ? '2px solid'
                  : '1px solid',
                borderColor: selectedTraditions.includes(tradition.id)
                  ? 'primary.main'
                  : 'divider',
                transform: selectedTraditions.includes(tradition.id)
                  ? 'scale(1.02)'
                  : 'scale(1)',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  boxShadow: 4,
                  transform: 'scale(1.02)'
                }
              }}
            >
              <CardContent
                sx={{ 
                  cursor: 'pointer',
                  position: 'relative',
                  '&:hover': {
                    bgcolor: selectedTraditions.includes(tradition.id) 
                      ? 'primary.dark' 
                      : (theme) => theme.palette.mode === 'dark' ? 'grey.700' : 'grey.50'
                  }
                }}
                onClick={() => handleTraditionClick(tradition)}
              >
                <Typography 
                  variant="h6" 
                  component="h3" 
                  gutterBottom
                  onClick={(e) => handleCardHeaderClick(tradition, e)}
                  sx={{
                    cursor: 'pointer',
                    '&:hover': {
                      textDecoration: 'underline',
                      color: 'primary.main'
                    }
                  }}
                >
                  {tradition.name}
                  {selectedTraditions.includes(tradition.id) && (
                    <Chip 
                      label={`#${selectedTraditions.indexOf(tradition.id) + 1}`}
                      size="small"
                      color="primary"
                      sx={{ ml: 1, fontSize: '0.7rem' }}
                    />
                  )}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {tradition.category}
                </Typography>
                {tradition.subSchool && (
                  <Typography variant="caption" display="block">
                    {tradition.subSchool}
                  </Typography>
                )}
                <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                  {tradition.adherents} adherents
                </Typography>
                <Box sx={{ mt: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Chip 
                    label={`${(tradition.confidence * 100).toFixed(0)}% confidence`}
                    size="small"
                    color={tradition.confidence > 0.9 ? 'success' : 'warning'}
                  />
                  <Info color="action" fontSize="small" />
                </Box>
              </CardContent>
              <CardActions sx={{ justifyContent: 'space-between' }}>
                <Button 
                  size="small" 
                  startIcon={<Info />}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleTraditionClick(tradition);
                  }}
                  color="info"
                >
                  Details
                </Button>
                {selectedTraditions.includes(tradition.id) ? (
                  <Button 
                    size="small" 
                    color="secondary" 
                    startIcon={<Clear />}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTraditionToggle(tradition.id);
                    }}
                  >
                    Remove
                  </Button>
                ) : (
                  <Button 
                    size="small" 
                    color="primary" 
                    startIcon={<Add />}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTraditionToggle(tradition.id);
                    }}
                  >
                    Add to Compare
                  </Button>
                )}
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Quick Compare Tool - Positioned after browsing traditions */}
      <Card sx={{ 
        mt: 4,
        mb: 3, 
        bgcolor: 'primary.main', 
        color: 'primary.contrastText',
        '& .MuiTextField-root': {
          '& .MuiOutlinedInput-root': {
            bgcolor: 'background.paper',
            '& fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.3)'
            },
            '&:hover fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.5)'
            }
          }
        }
      }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Quick Compare Any Two
          </Typography>
          <Typography variant="body2" sx={{ mb: 2, opacity: 0.9 }}>
            Already know which traditions you want to compare? Select them directly here:
          </Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <Autocomplete
                options={traditions}
                getOptionLabel={(option) => option.name}
                value={traditions.find(t => t.id === quickCompareA) || null}
                onChange={(_, newValue) => handleQuickCompareAChange(newValue)}
                renderInput={(params) => (
                  <TextField {...params} label="First Tradition" variant="outlined" size="small" />
                )}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Autocomplete
                options={traditions}
                getOptionLabel={(option) => option.name}
                value={traditions.find(t => t.id === quickCompareB) || null}
                onChange={(_, newValue) => handleQuickCompareBChange(newValue)}
                renderInput={(params) => (
                  <TextField {...params} label="Second Tradition" variant="outlined" size="small" />
                )}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleQuickCompare}
                disabled={!quickCompareA || !quickCompareB || quickCompareA === quickCompareB}
                startIcon={<Compare />}
                fullWidth
              >
                Compare
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {filteredTraditions.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body1" color="text.secondary">
            No traditions found matching your search criteria.
          </Typography>
        </Box>
      )}

      {/* Tradition Detail View Dialog */}
      <TraditionDetailView
        tradition={selectedTraditionForDetail}
        isOpen={isDetailViewOpen}
        onClose={handleDetailViewClose}
        onAddToCompare={handleAddToCompareFromDetail}
        isAlreadySelected={selectedTraditionForDetail ? selectedTraditions.includes(selectedTraditionForDetail.id) : false}
      />
    </Paper>
  );
};

export default TraditionSelector;