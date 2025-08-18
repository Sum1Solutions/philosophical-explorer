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
  Slide
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
          📅 Historical Timeline of Philosophical Traditions
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

      {/* Enhanced Interactive Timeline */}
      <Box sx={{ 
        mb: 4, 
        position: 'relative', 
        height: timelineMode === 'linear' ? 120 : 100,
        transition: 'height 0.3s ease-in-out',
        background: (theme) => theme.palette.mode === 'dark' 
          ? 'linear-gradient(45deg, rgba(25,25,25,0.8), rgba(40,40,40,0.9))' 
          : 'linear-gradient(45deg, rgba(245,245,245,0.8), rgba(250,250,250,0.9))',
        borderRadius: 2,
        padding: 2,
        boxShadow: (theme) => theme.palette.mode === 'dark' ? 3 : 1
      }}>
        {/* Enhanced Main Timeline Line with Glow Effect */}
        <Box sx={{
          height: 6,
          background: 'linear-gradient(to right, #8B4513, #4A90E2, #7B68EE, #20B2AA, #32CD32)',
          borderRadius: 3,
          mb: 4,
          position: 'relative',
          boxShadow: isAnimating ? '0 0 20px rgba(75, 144, 226, 0.6)' : '0 0 10px rgba(0,0,0,0.2)',
          transition: 'box-shadow 0.3s ease-in-out',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: -1,
            left: 0,
            right: 0,
            bottom: -1,
            background: 'linear-gradient(to right, #8B4513, #4A90E2, #7B68EE, #20B2AA, #32CD32)',
            borderRadius: 3,
            opacity: 0.3,
            filter: 'blur(3px)'
          }
        }}>
          {/* Enhanced Era Markers with Interaction */}
          {[0, 500, 1500, 1800].map((year, index) => {
            const position = getTimelinePosition(year);
            const eraRange = timelineRanges.find(r => year >= r.min && year < r.max);
            const isSelected = selectedEra === eraRange?.label;
            return (
              <Zoom key={year} in={true} style={{ transitionDelay: `${index * 100}ms` }}>
                <Box sx={{
                  position: 'absolute',
                  left: `${position}%`,
                  top: -10,
                  width: isSelected ? 24 : 18,
                  height: isSelected ? 24 : 18,
                  bgcolor: 'background.paper',
                  border: '3px solid',
                  borderColor: getTimelineColor(year),
                  borderRadius: '50%',
                  transform: 'translateX(-50%)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease-in-out',
                  boxShadow: isSelected ? `0 0 15px ${getTimelineColor(year)}60` : 2,
                  zIndex: 5,
                  '&:hover': {
                    transform: 'translateX(-50%) scale(1.2)',
                    boxShadow: `0 0 20px ${getTimelineColor(year)}80`
                  }
                }}>
                  <Tooltip 
                    title={
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="subtitle2">{year <= 0 ? `${Math.abs(year)} BCE` : `${year} CE`}</Typography>
                        <Typography variant="caption">{eraRange?.label}</Typography>
                      </Box>
                    } 
                    placement="top" 
                    arrow
                  >
                    <Box 
                      sx={{ width: '100%', height: '100%', cursor: 'pointer' }}
                      onClick={() => setSelectedEra(isSelected ? null : eraRange?.label || null)}
                    />
                  </Tooltip>
                </Box>
              </Zoom>
            );
          })}
        </Box>

        {/* Enhanced Interactive Tradition Markers */}
        {timelineData.map((tradition, index) => {
          const position = getTimelinePosition(tradition.timelineInfo.year, index);
          const isHovered = hoveredTradition === tradition.id;
          const isSelected = tradition.isSelected;
          const shouldShow = !selectedEra || !!timelineRanges.find(r => r.label === selectedEra && 
            tradition.timelineInfo.year >= r.min && tradition.timelineInfo.year < r.max);
          
          if (!shouldShow) return null;
          
          return (
            <Fade key={tradition.id} in={shouldShow} timeout={300}>
              <Box
                sx={{
                  position: 'absolute',
                  left: `${position}%`,
                  top: 25,
                  transform: 'translateX(-50%)',
                  cursor: 'pointer',
                  zIndex: isSelected ? 15 : isHovered ? 10 : 5
                }}
                onMouseEnter={() => setHoveredTradition(tradition.id)}
                onMouseLeave={() => setHoveredTradition(null)}
                onClick={() => {
                  onTraditionClick?.(tradition);
                  setIsAnimating(true);
                  setTimeout(() => setIsAnimating(false), 600);
                }}
              >
                <Tooltip 
                  title={
                    <Card sx={{ minWidth: 250, bgcolor: 'background.paper' }}>
                      <CardContent sx={{ p: 2 }}>
                        <Typography variant="h6" color="primary" gutterBottom>
                          {tradition.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          {tradition.timelineInfo.display}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {tradition.category} • {tradition.subSchool}
                        </Typography>
                        {tradition.adherents && (
                          <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                            📊 {tradition.adherents} adherents
                          </Typography>
                        )}
                      </CardContent>
                    </Card>
                  }
                  placement="top"
                  arrow
                  PopperProps={{
                    sx: {
                      '& .MuiTooltip-tooltip': {
                        bgcolor: 'transparent',
                        maxWidth: 'none'
                      }
                    }
                  }}
                >
                  <Box sx={{
                    width: isSelected ? 20 : isHovered ? 16 : 14,
                    height: isSelected ? 20 : isHovered ? 16 : 14,
                    bgcolor: getTimelineColor(tradition.timelineInfo.year),
                    border: isSelected ? '4px solid' : '3px solid',
                    borderColor: isSelected ? 'primary.main' : isHovered ? 'secondary.main' : 'background.paper',
                    borderRadius: '50%',
                    boxShadow: isSelected ? `0 0 20px ${getTimelineColor(tradition.timelineInfo.year)}80` : 
                              isHovered ? `0 0 15px ${getTimelineColor(tradition.timelineInfo.year)}60` : 2,
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    transform: isSelected ? 'scale(1.2)' : isHovered ? 'scale(1.1)' : 'scale(1)',
                    '&::after': isSelected || isHovered ? {
                      content: '""',
                      position: 'absolute',
                      top: -2,
                      left: -2,
                      right: -2,
                      bottom: -2,
                      borderRadius: '50%',
                      background: `conic-gradient(from 0deg, ${getTimelineColor(tradition.timelineInfo.year)}, transparent, ${getTimelineColor(tradition.timelineInfo.year)})`,
                      animation: isSelected ? 'spin 2s linear infinite' : 'none',
                      zIndex: -1
                    } : {}
                  }} />
                </Tooltip>
                
                {/* Enhanced tradition labels */}
                {(timelineMode === 'linear' || isHovered || isSelected) && (
                  <Slide 
                    direction="up" 
                    in={timelineMode === 'linear' || isHovered || isSelected} 
                    timeout={200}
                  >
                    <Typography 
                      variant="caption" 
                      sx={{
                        position: 'absolute',
                        top: 25,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        fontSize: isSelected ? '0.8rem' : '0.7rem',
                        fontWeight: isSelected ? 'bold' : 'normal',
                        whiteSpace: 'nowrap',
                        color: isSelected ? 'primary.main' : 'text.secondary',
                        bgcolor: (theme) => theme.palette.mode === 'dark' 
                          ? isSelected ? 'rgba(25,25,25,0.95)' : 'rgba(25,25,25,0.8)'
                          : isSelected ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.8)',
                        padding: isSelected ? '3px 6px' : '2px 4px',
                        borderRadius: '6px',
                        pointerEvents: 'none',
                        boxShadow: isSelected ? 2 : 1,
                        border: isSelected ? '1px solid' : 'none',
                        borderColor: isSelected ? 'primary.main' : 'transparent'
                      }}
                    >
                      {tradition.name}
                    </Typography>
                  </Slide>
                )}
              </Box>
            </Fade>
          );
        })}
      </Box>

      {/* Era-based groupings */}
      <Box sx={{ mt: 6 }}>
        <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
          Traditions by Historical Era
        </Typography>
        
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