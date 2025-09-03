import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Chip,
  Tooltip,
  ToggleButton,
  ToggleButtonGroup,
  FormControl,
  FormLabel,
  Card,
  CardContent,
  Fade,
  Zoom,
  Tabs,
  Tab
} from '@mui/material';
import { Timeline, LinearScale } from '@mui/icons-material';
import { traditions } from '../data/traditions';
import { Tradition } from '../types';

interface TimelineViewProps {
  selectedTraditions?: string[];
  onTraditionClick?: (tradition: Tradition) => void;
}

const TimelineView: React.FC<TimelineViewProps> = ({ 
  selectedTraditions = [], 
  onTraditionClick 
}) => {
  const [timelineMode, setTimelineMode] = useState<'accurate' | 'linear'>('accurate');
  const [hoveredTradition, setHoveredTradition] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [selectedEra, setSelectedEra] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<number>(0);
  // Get year for timeline positioning - use firstYear if available, otherwise parse originDate
  const getTimelineYear = (tradition: Tradition): { year: number, era: string, display: string } => {
    // Use firstYear if it exists (our new field)
    if ('firstYear' in tradition && typeof tradition.firstYear === 'number') {
      const year = tradition.firstYear;
      const era = year < 0 ? 'BCE' : 'CE';
      const absYear = Math.abs(year);
      const display = year < 0 ? `${absYear} BCE` : `${year} CE`;
      return { year, era, display };
    }

    // Fallback to parsing originDate string (legacy support)
    const str = tradition.originDate?.toLowerCase() || '';
    if (str.includes('bce')) {
      const match = str.match(/(\d+)/);
      const year = match ? -parseInt(match[1]) : 0;
      return { year, era: 'BCE', display: tradition.originDate || '' };
    }
    if (str.includes('ce') || str.includes('century')) {
      const match = str.match(/(\d+)/);
      const year = match ? parseInt(match[1]) : 2000;
      return { year, era: 'CE', display: tradition.originDate || '' };
    }
    if (str.includes('prehistoric')) {
      return { year: -10000, era: 'Prehistoric', display: tradition.originDate || '' };
    }
    return { year: 2000, era: 'Modern', display: tradition.originDate || '' };
  };

  // Prepare timeline data
  const timelineData = traditions
    .map(tradition => ({
      ...tradition,
      timelineInfo: getTimelineYear(tradition),
      isSelected: selectedTraditions.includes(tradition.id)
    }))
    .sort((a, b) => a.timelineInfo.year - b.timelineInfo.year);

  // Define timeline ranges for visual grouping
  const timelineRanges = [
    { label: 'Ancient (before 0 CE)', min: -Infinity, max: 0, color: '#8B4513' },
    { label: 'Classical (0-500 CE)', min: 0, max: 500, color: '#4A90E2' },
    { label: 'Medieval (500-1500 CE)', min: 500, max: 1500, color: '#7B68EE' },
    { label: 'Early Modern (1500-1800 CE)', min: 1500, max: 1800, color: '#20B2AA' },
    { label: 'Modern (1800+ CE)', min: 1800, max: Infinity, color: '#32CD32' }
  ];

  const getTimelineColor = (year: number) => {
    const range = timelineRanges.find(r => year >= r.min && year < r.max);
    return range?.color || '#666';
  };

  // Define category groupings for philosophical traditions
  const categoryGroups = [
    { 
      label: 'Buddhism', 
      color: '#FF9800', 
      icon: '🧘‍♂️',
      traditions: ['theravada-buddhism', 'mahayana-buddhism', 'zen-buddhism'] 
    },
    { 
      label: 'Abrahamic', 
      color: '#2196F3', 
      icon: '📖',
      traditions: ['judaism', 'christianity', 'sunni-islam'] 
    },
    { 
      label: 'Indian Philosophy', 
      color: '#E91E63', 
      icon: '🕉️',
      traditions: ['hinduism-advaita', 'jainism', 'sikhism'] 
    },
    { 
      label: 'East Asian', 
      color: '#4CAF50', 
      icon: '☯️',
      traditions: ['confucianism', 'daoism', 'shintoism'] 
    },
    { 
      label: 'Western Classical', 
      color: '#9C27B0', 
      icon: '🏛️',
      traditions: ['stoicism'] 
    },
    { 
      label: 'Modern Western', 
      color: '#607D8B', 
      icon: '🌍',
      traditions: ['utilitarianism', 'marxism', 'pragmatism', 'analytic-philosophy', 'existentialism', 'absurdism', 'postmodernism'] 
    },
    { 
      label: 'Contemporary', 
      color: '#795548', 
      icon: '🌟',
      traditions: ['alan-watts', 'secular-humanism'] 
    },
    { 
      label: 'Indigenous', 
      color: '#8BC34A', 
      icon: '🌍',
      traditions: ['indigenous-wisdom'] 
    }
  ];

  const getCategoryColor = (traditionId: string) => {
    const category = categoryGroups.find(cat => cat.traditions.includes(traditionId));
    return category?.color || '#666';
  };


  // Calculate timeline position (0-100%)
  const minYear = Math.min(...timelineData.map(t => t.timelineInfo.year));
  const maxYear = Math.max(...timelineData.map(t => t.timelineInfo.year));
  const yearRange = maxYear - minYear;

  const getTimelinePosition = (year: number, index?: number) => {
    if (timelineMode === 'linear') {
      // Linear mode: evenly space traditions regardless of actual time gaps
      const totalTraditions = timelineData.length;
      if (index !== undefined) {
        return (index / (totalTraditions - 1)) * 100;
      }
      // For era markers in linear mode, still use proportional positioning
      return ((year - minYear) / yearRange) * 100;
    } else {
      // Accurate mode: use actual historical positioning
      return ((year - minYear) / yearRange) * 100;
    }
  };

  // Group traditions by era for better organization
  const groupedTraditions = timelineRanges.map(range => ({
    ...range,
    traditions: timelineData.filter(t => 
      t.timelineInfo.year >= range.min && t.timelineInfo.year < range.max
    )
  })).filter(group => group.traditions.length > 0);

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          📅 Philosophy & Religious Traditions Timeline
        </Typography>
        
        <FormControl>
          <FormLabel component="legend" sx={{ mb: 1, fontSize: '0.875rem' }}>
            Timeline Mode
          </FormLabel>
          <ToggleButtonGroup
            value={timelineMode}
            exclusive
            onChange={(_, newMode) => newMode && setTimelineMode(newMode)}
            size="small"
            aria-label="timeline mode"
          >
            <ToggleButton value="accurate" aria-label="accurate timeline">
              <Timeline sx={{ mr: 1 }} />
              Accurate
            </ToggleButton>
            <ToggleButton value="linear" aria-label="linear spacing">
              <LinearScale sx={{ mr: 1 }} />
              Linear
            </ToggleButton>
          </ToggleButtonGroup>
        </FormControl>
      </Box>
      
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        {timelineMode === 'accurate' 
          ? 'Traditions positioned proportionally by their actual historical dates. Large gaps show periods with fewer traditions.'
          : 'Traditions evenly spaced for easy comparison. Historical chronology maintained but time gaps ignored.'
        }
        <br />Click any tradition to learn more.
      </Typography>

      {/* Simplified Clean Timeline */}
      <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        {/* Simple timeline container */}
        <Box sx={{ 
          position: 'relative',
          height: 80,
          width: '100%',
          background: (theme) => theme.palette.mode === 'dark' 
            ? 'linear-gradient(to right, #333, #444, #333)'
            : 'linear-gradient(to right, #f5f5f5, #e0e0e0, #f5f5f5)',
          borderRadius: 1,
          border: '1px solid',
          borderColor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
          overflow: 'visible'
        }}>
          
          {/* Simple timeline line */}
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '5%',
            right: '5%',
            height: 3,
            bgcolor: 'primary.main',
            borderRadius: 1.5,
            transform: 'translateY(-50%)'
          }} />
          
          {/* Era labels - responsive to timeline mode */}
          {timelineRanges.map((range, index) => {
            let position;
            
            if (timelineMode === 'linear') {
              // Fixed even spacing for linear mode
              const positions = [10, 30, 50, 70, 90];
              position = positions[index] || 50;
            } else {
              // Accurate historical positioning
              const startPos = getTimelinePosition(range.min === -Infinity ? minYear : range.min);
              const endPos = getTimelinePosition(range.max === Infinity ? maxYear : range.max);
              position = startPos + (endPos - startPos) / 2;
              // Ensure labels don't go off edges
              position = Math.max(8, Math.min(92, position));
            }
            
            return (
              <Typography
                key={index}
                variant="caption"
                sx={{
                  position: 'absolute',
                  left: `${position}%`,
                  top: 8,
                  transform: 'translateX(-50%)',
                  color: range.color,
                  fontWeight: 'bold',
                  fontSize: '0.65rem',
                  bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.9)',
                  padding: '1px 4px',
                  borderRadius: '3px',
                  border: `1px solid ${range.color}30`,
                  zIndex: 2,
                  transition: 'left 0.3s ease-in-out'
                }}
              >
                {range.label.split(' ')[0]}
              </Typography>
            );
          })}
          
          {/* Simple tradition markers */}
          {timelineData.map((tradition, index) => {
            const position = Math.max(5, Math.min(95, getTimelinePosition(tradition.timelineInfo.year, index)));
            const isHovered = hoveredTradition === tradition.id;
            const isSelected = tradition.isSelected;
            const shouldShow = (!selectedEra || !!timelineRanges.find(r => r.label === selectedEra && 
              tradition.timelineInfo.year >= r.min && tradition.timelineInfo.year < r.max)) &&
              (!selectedCategory || categoryGroups.find(c => c.label === selectedCategory)?.traditions.includes(tradition.id));
            
            if (!shouldShow) return null;
            
            return (
              <Tooltip
                key={tradition.id}
                title={
                  <Box sx={{ p: 1 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                      {tradition.name}
                    </Typography>
                    <Typography variant="caption" display="block">
                      {tradition.timelineInfo.display}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {tradition.category}
                    </Typography>
                  </Box>
                }
                placement="top"
                arrow
              >
                <Box
                  sx={{
                    position: 'absolute',
                    left: `${position}%`,
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: isSelected ? 16 : isHovered ? 14 : 12,
                    height: isSelected ? 16 : isHovered ? 14 : 12,
                    bgcolor: getCategoryColor(tradition.id),
                    border: '2px solid',
                    borderColor: isSelected ? 'primary.main' : 'background.paper',
                    borderRadius: '50%',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: isSelected ? 3 : isHovered ? 2 : 1,
                    zIndex: isSelected ? 10 : isHovered ? 5 : 1,
                    '&:hover': {
                      transform: 'translate(-50%, -50%) scale(1.2)'
                    }
                  }}
                  onMouseEnter={() => setHoveredTradition(tradition.id)}
                  onMouseLeave={() => setHoveredTradition(null)}
                  onClick={() => {
                    onTraditionClick?.(tradition);
                    setIsAnimating(true);
                    setTimeout(() => setIsAnimating(false), 600);
                  }}
                />
              </Tooltip>
            );
          })}
        </Box>
      </Paper>

      {/* Tabbed Groupings */}
      <Box sx={{ mt: 6 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs 
            value={activeTab} 
            onChange={(_, newValue) => setActiveTab(newValue)}
            aria-label="tradition grouping tabs"
          >
            <Tab label="ERAS" />
            <Tab label="CATEGORIES" />
          </Tabs>
        </Box>

        {/* Era-based groupings tab */}
        {activeTab === 0 && (
          <Fade in={true} timeout={300}>
            <Box>
              {groupedTraditions.map((group, groupIndex) => (
                <Box key={groupIndex} sx={{ mb: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box sx={{
                      width: 16,
                      height: 16,
                      bgcolor: group.color,
                      borderRadius: '50%',
                      mr: 2
                    }} />
                    <Typography variant="h6" sx={{ color: group.color, fontWeight: 'bold' }}>
                      {group.label}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
                      ({group.traditions.length} tradition{group.traditions.length !== 1 ? 's' : ''})
                    </Typography>
                  </Box>
                  
                  <Box sx={{ 
                    display: 'flex', 
                    flexWrap: 'wrap', 
                    gap: 1,
                    pl: 4,
                    borderLeft: '3px solid',
                    borderLeftColor: group.color + '40'
                  }}>
                    {group.traditions.map(tradition => (
                      <Tooltip key={tradition.id} title={`Click to learn about ${tradition.name}`} placement="top" arrow>
                        <Chip
                          label={`${tradition.name} (${tradition.timelineInfo.display})`}
                          onClick={() => onTraditionClick?.(tradition)}
                          sx={{
                            bgcolor: tradition.isSelected ? 'primary.main' : 'background.paper',
                            color: tradition.isSelected ? 'primary.contrastText' : 'text.primary',
                            border: '1px solid',
                            borderColor: tradition.isSelected ? 'primary.main' : group.color + '60',
                            fontWeight: tradition.isSelected ? 'bold' : 'normal',
                            transform: tradition.isSelected ? 'scale(1.05)' : 'scale(1)',
                            transition: 'all 0.2s ease-in-out',
                            cursor: 'pointer',
                            '&:hover': {
                              transform: 'scale(1.05)',
                              bgcolor: tradition.isSelected ? 'primary.dark' : group.color + '20',
                              boxShadow: 2
                            }
                          }}
                        />
                      </Tooltip>
                    ))}
                  </Box>
                </Box>
              ))}
            </Box>
          </Fade>
        )}

        {/* Category-based groupings tab */}
        {activeTab === 1 && (
          <Fade in={true} timeout={300}>
            <Box>
              {categoryGroups.map((category, categoryIndex) => {
                const categoryTraditions = timelineData.filter(t => category.traditions.includes(t.id));
                if (categoryTraditions.length === 0) return null;
                
                return (
                  <Box key={categoryIndex} sx={{ mb: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6" sx={{ mr: 1, fontSize: '1.2rem' }}>
                        {category.icon}
                      </Typography>
                      <Typography variant="h6" sx={{ color: category.color, fontWeight: 'bold' }}>
                        {category.label}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
                        ({categoryTraditions.length} tradition{categoryTraditions.length !== 1 ? 's' : ''})
                      </Typography>
                      <Box sx={{ flexGrow: 1 }} />
                      <Chip
                        label={selectedCategory === category.label ? 'Clear Filter' : 'Filter by Category'}
                        onClick={() => setSelectedCategory(selectedCategory === category.label ? null : category.label)}
                        size="small"
                        variant={selectedCategory === category.label ? "filled" : "outlined"}
                        sx={{ 
                          color: category.color,
                          borderColor: category.color,
                          bgcolor: selectedCategory === category.label ? category.color + '20' : 'transparent'
                        }}
                      />
                    </Box>
                    
                    <Box sx={{ 
                      display: 'flex', 
                      flexWrap: 'wrap', 
                      gap: 1,
                      pl: 4,
                      borderLeft: '3px solid',
                      borderLeftColor: category.color + '40'
                    }}>
                      {categoryTraditions
                        .sort((a, b) => a.timelineInfo.year - b.timelineInfo.year)
                        .map(tradition => (
                        <Tooltip key={tradition.id} title={`Click to learn about ${tradition.name}`} placement="top" arrow>
                          <Chip
                            label={`${tradition.name} (${tradition.timelineInfo.display})`}
                            onClick={() => onTraditionClick?.(tradition)}
                            sx={{
                              bgcolor: tradition.isSelected ? 'primary.main' : 'background.paper',
                              color: tradition.isSelected ? 'primary.contrastText' : 'text.primary',
                              border: '1px solid',
                              borderColor: tradition.isSelected ? 'primary.main' : category.color + '60',
                              fontWeight: tradition.isSelected ? 'bold' : 'normal',
                              transform: tradition.isSelected ? 'scale(1.05)' : 'scale(1)',
                              transition: 'all 0.2s ease-in-out',
                              cursor: 'pointer',
                              '&:hover': {
                                transform: 'scale(1.05)',
                                bgcolor: tradition.isSelected ? 'primary.dark' : category.color + '20',
                                boxShadow: 2
                              }
                            }}
                          />
                        </Tooltip>
                      ))}
                    </Box>
                  </Box>
                );
              })}
            </Box>
          </Fade>
        )}
      </Box>

      {/* Enhanced Legend with Animations */}
      <Fade in={true} timeout={1000}>
        <Box sx={{ 
          mt: 4, 
          p: 3, 
          bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(33,33,33,0.8)' : 'rgba(248,248,248,0.8)',
          borderRadius: 2,
          border: '1px solid',
          borderColor: (theme) => theme.palette.mode === 'dark' ? 'grey.700' : 'grey.200',
          backdropFilter: 'blur(10px)'
        }}>
        <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
          Timeline spans from {Math.abs(minYear)} {minYear < 0 ? 'BCE' : 'CE'} to {maxYear} CE
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
          💡 Click any tradition marker or chip to learn more. Selected traditions appear highlighted.
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'bold' }}>
          {timelineMode === 'accurate' 
            ? '📏 Accurate Mode: Positions reflect actual historical time gaps (e.g., large gap between Ancient Greek and Medieval periods)'
            : '📐 Linear Mode: All traditions evenly spaced for easy scanning and comparison (chronological order maintained)'
          }
        </Typography>
        </Box>
      </Fade>
      
      {/* Floating Era Filter */}
      {selectedEra && (
        <Zoom in={!!selectedEra}>
          <Card sx={{
            position: 'fixed',
            bottom: 20,
            right: 20,
            zIndex: 1000,
            bgcolor: 'primary.main',
            color: 'primary.contrastText'
          }}>
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Typography variant="subtitle2">
                Filtering: {selectedEra}
              </Typography>
              <Typography variant="caption" display="block">
                Click era markers to filter • Click again to clear
              </Typography>
            </CardContent>
          </Card>
        </Zoom>
      )}
    </Paper>
  );
};

export default TimelineView;