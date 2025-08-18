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
  FormLabel
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
  // Parse origin dates for timeline sorting
  const parseOrigin = (originStr: string): { year: number, era: string, display: string } => {
    const str = originStr.toLowerCase();
    if (str.includes('bce')) {
      const match = str.match(/(\d+)/);
      const year = match ? -parseInt(match[1]) : 0;
      return { year, era: 'BCE', display: originStr };
    }
    if (str.includes('ce') || str.includes('century')) {
      const match = str.match(/(\d+)/);
      const year = match ? parseInt(match[1]) : 2000;
      return { year, era: 'CE', display: originStr };
    }
    if (str.includes('prehistoric')) {
      return { year: -3000, era: 'Prehistoric', display: originStr };
    }
    return { year: 2000, era: 'Modern', display: originStr };
  };

  // Prepare timeline data
  const timelineData = traditions
    .map(tradition => ({
      ...tradition,
      timelineInfo: parseOrigin(tradition.originDate),
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

      {/* Linear Timeline Visualization */}
      <Box sx={{ 
        mb: 4, 
        position: 'relative', 
        height: timelineMode === 'linear' ? 80 : 60,
        transition: 'height 0.3s ease-in-out'
      }}>
        {/* Main timeline line */}
        <Box sx={{
          height: 4,
          background: 'linear-gradient(to right, #8B4513, #4A90E2, #7B68EE, #20B2AA, #32CD32)',
          borderRadius: 2,
          mb: 4,
          position: 'relative'
        }}>
          {/* Era markers */}
          {[0, 500, 1500, 1800].map((year, index) => {
            const position = getTimelinePosition(year);
            return (
              <Box key={year} sx={{
                position: 'absolute',
                left: `${position}%`,
                top: -8,
                width: 16,
                height: 16,
                bgcolor: 'background.paper',
                border: '2px solid',
                borderColor: getTimelineColor(year),
                borderRadius: '50%',
                transform: 'translateX(-50%)'
              }}>
                <Tooltip title={`${year} ${year <= 0 ? 'BCE' : 'CE'}`}>
                  <Box sx={{ width: '100%', height: '100%', cursor: 'pointer' }} />
                </Tooltip>
              </Box>
            );
          })}
        </Box>

        {/* Tradition markers on timeline */}
        {timelineData.map((tradition, index) => {
          const position = getTimelinePosition(tradition.timelineInfo.year, index);
          return (
            <Tooltip key={tradition.id} title={`${tradition.name} (${tradition.timelineInfo.display})`}>
              <Box
                sx={{
                  position: 'absolute',
                  left: `${position}%`,
                  top: 20,
                  transform: 'translateX(-50%)',
                  cursor: 'pointer',
                  zIndex: tradition.isSelected ? 10 : 1
                }}
                onClick={() => onTraditionClick?.(tradition)}
              >
                <Box sx={{
                  width: tradition.isSelected ? 16 : 12,
                  height: tradition.isSelected ? 16 : 12,
                  bgcolor: getTimelineColor(tradition.timelineInfo.year),
                  border: tradition.isSelected ? '3px solid' : '2px solid',
                  borderColor: tradition.isSelected ? 'primary.main' : 'background.paper',
                  borderRadius: '50%',
                  boxShadow: tradition.isSelected ? 3 : 1,
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'scale(1.3)',
                    boxShadow: 4
                  }
                }} />
                {/* Show tradition name in linear mode for better identification */}
                {timelineMode === 'linear' && (
                  <Typography 
                    variant="caption" 
                    sx={{
                      position: 'absolute',
                      top: 20,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      fontSize: '0.7rem',
                      whiteSpace: 'nowrap',
                      color: 'text.secondary',
                      bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.8)',
                      padding: '2px 4px',
                      borderRadius: '4px',
                      pointerEvents: 'none'
                    }}
                  >
                    {tradition.name}
                  </Typography>
                )}
              </Box>
            </Tooltip>
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
                <Tooltip key={tradition.id} title={`Click to learn about ${tradition.name}`}>
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

      {/* Legend */}
      <Box sx={{ 
        mt: 4, 
        p: 2, 
        bgcolor: (theme) => theme.palette.mode === 'dark' ? 'grey.800' : 'grey.50',
        borderRadius: 1 
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
    </Paper>
  );
};

export default TimelineView;