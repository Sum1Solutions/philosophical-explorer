import React, { useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Typography,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Tooltip
} from '@mui/material';
import { Info, Source } from '@mui/icons-material';
import { Tradition, Citation } from '../types';
import { traditions } from '../data/traditions';
import { getTooltipContent } from '../utils/philosophicalTopics';

interface ComparisonMatrixProps {
  selectedTraditions: string[];
  aspectFilter?: string;
}

const ComparisonMatrix: React.FC<ComparisonMatrixProps> = ({
  selectedTraditions,
  aspectFilter = 'all'
}) => {
  const [expandedCells, setExpandedCells] = useState<Set<string>>(new Set());
  const [showCitations, setShowCitations] = useState(false);

  const filteredTraditions = useMemo(() => {
    return traditions.filter(t => selectedTraditions.includes(t.id));
  }, [selectedTraditions]);

  const aspects = [
    { key: 'metaphysics.ultimateReality', label: 'Ultimate Reality', category: 'metaphysics' },
    { key: 'metaphysics.viewOfWorld', label: 'View of World', category: 'metaphysics' },
    { key: 'metaphysics.viewOfSelf', label: 'View of Self', category: 'metaphysics' },
    { key: 'metaphysics.afterlife', label: 'Afterlife', category: 'metaphysics' },
    { key: 'epistemology', label: 'Knowledge Sources', category: 'epistemology' },
    { key: 'ethics', label: 'Moral Laws', category: 'ethics' },
    { key: 'liberation.goal', label: 'Liberation Goal', category: 'liberation' },
    { key: 'liberation.path', label: 'Liberation Path', category: 'liberation' },
  ];

  const filteredAspects = aspectFilter === 'all' 
    ? aspects 
    : aspects.filter(a => a.category === aspectFilter);

  const getValue = (tradition: Tradition, aspectKey: string): any => {
    const keys = aspectKey.split('.');
    let value: any = tradition;
    
    for (const key of keys) {
      value = value?.[key];
    }
    
    return value;
  };

  const renderValue = (value: any, tradition: Tradition, aspectKey: string): React.ReactNode => {
    if (Array.isArray(value)) {
      return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          {value.map((item, index) => (
            <Chip key={index} label={item} size="small" variant="outlined" />
          ))}
        </Box>
      );
    }
    
    if (typeof value === 'string') {
      const cellKey = `${tradition.id}-${aspectKey}`;
      const isExpanded = expandedCells.has(cellKey);
      const shouldTruncate = value.length > 100;
      
      return (
        <Box>
          <Typography 
            variant="body2" 
            sx={{ 
              cursor: shouldTruncate ? 'pointer' : 'default',
              wordBreak: 'break-word'
            }}
            onClick={() => {
              if (shouldTruncate) {
                setExpandedCells(prev => {
                  const newSet = new Set(prev);
                  if (isExpanded) {
                    newSet.delete(cellKey);
                  } else {
                    newSet.add(cellKey);
                  }
                  return newSet;
                });
              }
            }}
          >
            {shouldTruncate && !isExpanded 
              ? `${value.substring(0, 100)}...` 
              : value
            }
          </Typography>
          {showCitations && tradition.sources && (
            <Box sx={{ mt: 1 }}>
              {tradition.sources.map((citation, index) => (
                <CitationChip key={index} citation={citation} />
              ))}
            </Box>
          )}
        </Box>
      );
    }
    
    return <Typography variant="body2">{String(value)}</Typography>;
  };

  const getCritiqueForTradition = (tradition: Tradition, otherTraditionId: string): string | null => {
    const otherTradition = traditions.find(t => t.id === otherTraditionId);
    if (!otherTradition) return null;
    
    return tradition.critiques[otherTradition.name] || null;
  };

  return (
    <Box>
      <Box sx={{ mb: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
        <FormControl size="small">
          <InputLabel>Show Citations</InputLabel>
          <Select
            value={showCitations ? 'yes' : 'no'}
            onChange={(e) => setShowCitations(e.target.value === 'yes')}
          >
            <MenuItem value="no">No</MenuItem>
            <MenuItem value="yes">Yes</MenuItem>
          </Select>
        </FormControl>
        
        <Typography variant="body2" color="text.secondary">
          Comparing {filteredTraditions.length} traditions across {filteredAspects.length} aspects
        </Typography>
      </Box>

      <TableContainer component={Paper} sx={{ maxHeight: 800 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', minWidth: 150 }}>
                Aspect
              </TableCell>
              {filteredTraditions.map(tradition => (
                <TableCell 
                  key={tradition.id} 
                  sx={{ 
                    fontWeight: 'bold', 
                    minWidth: 200,
                    bgcolor: 'primary.light',
                    color: 'primary.contrastText'
                  }}
                >
                  <Box>
                    <Typography variant="h6">{tradition.name}</Typography>
                    <Typography variant="caption">
                      {tradition.category}
                    </Typography>
                    <Box sx={{ mt: 1 }}>
                      <Chip 
                        label={`Confidence: ${(tradition.confidence * 100).toFixed(0)}%`}
                        size="small"
                        color={tradition.confidence > 0.9 ? 'success' : 'warning'}
                      />
                    </Box>
                  </Box>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAspects.map(aspect => (
              <TableRow key={aspect.key} hover>
                <TableCell 
                  component="th" 
                  scope="row" 
                  sx={{ fontWeight: 'bold' }}
                >
                  <Tooltip title={getTooltipContent(aspect.category)} arrow>
                    <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'help' }}>
                      {aspect.label}
                      <Info sx={{ ml: 1, fontSize: '1rem', opacity: 0.6 }} />
                    </Box>
                  </Tooltip>
                </TableCell>
                {filteredTraditions.map(tradition => (
                  <TableCell key={`${tradition.id}-${aspect.key}`}>
                    {renderValue(getValue(tradition, aspect.key), tradition, aspect.key)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
            
            {/* Critiques Row */}
            <TableRow sx={{ bgcolor: 'grey.50' }}>
              <TableCell 
                component="th" 
                scope="row" 
                sx={{ fontWeight: 'bold' }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  Inter-tradition Critiques
                  <Tooltip title="How each tradition critiques the others">
                    <IconButton size="small">
                      <Info />
                    </IconButton>
                  </Tooltip>
                </Box>
              </TableCell>
              {filteredTraditions.map(tradition => (
                <TableCell key={`${tradition.id}-critiques`}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {filteredTraditions
                      .filter(other => other.id !== tradition.id)
                      .map(other => {
                        const critique = getCritiqueForTradition(tradition, other.id);
                        return critique ? (
                          <Box key={other.id}>
                            <Typography variant="caption" color="primary">
                              vs {other.name}:
                            </Typography>
                            <Typography variant="body2">
                              {critique}
                            </Typography>
                          </Box>
                        ) : null;
                      })}
                  </Box>
                </TableCell>
              ))}
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

const CitationChip: React.FC<{ citation: Citation }> = ({ citation }) => (
  <Tooltip title={citation.text}>
    <Chip
      icon={<Source />}
      label={citation.source}
      size="small"
      variant="outlined"
      color={citation.confidence === 'high' ? 'success' : citation.confidence === 'medium' ? 'warning' : 'error'}
      sx={{ mr: 0.5, mb: 0.5 }}
    />
  </Tooltip>
);

export default ComparisonMatrix;