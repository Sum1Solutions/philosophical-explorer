import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Slider,
  Alert,
  Chip,
  Button,
  Collapse,
  IconButton
} from '@mui/material';
import { ExpandMore, ExpandLess, Visibility, FilterList } from '@mui/icons-material';
import { Tradition, UserProfile } from '../types';
import { traditions } from '../data/traditions';

interface PerspectiveSelectorProps {
  userProfile: UserProfile;
  onProfileUpdate: (profile: UserProfile) => void;
  selectedTraditions: string[];
}

const PerspectiveSelector: React.FC<PerspectiveSelectorProps> = ({
  userProfile,
  onProfileUpdate,
  selectedTraditions
}) => {
  const [expanded, setExpanded] = useState(false);

  const handlePerspectiveChange = (traditionId: string) => {
    onProfileUpdate({
      ...userProfile,
      preferences: {
        ...userProfile.preferences,
        perspective: traditionId
      }
    });
  };

  const handleCitationToggle = (showCitations: boolean) => {
    onProfileUpdate({
      ...userProfile,
      preferences: {
        ...userProfile.preferences,
        showCitations
      }
    });
  };

  const handleConfidenceThreshold = (threshold: number) => {
    onProfileUpdate({
      ...userProfile,
      preferences: {
        ...userProfile.preferences,
        confidenceThreshold: threshold
      }
    });
  };

  const getCurrentPerspectiveTradition = () => {
    return traditions.find(t => t.id === userProfile.preferences.perspective);
  };

  const getRelevantTraditions = () => {
    const selectedTraditionObjects = traditions.filter(t => 
      selectedTraditions.includes(t.id)
    );
    
    // If no traditions selected, show all
    return selectedTraditionObjects.length > 0 ? selectedTraditionObjects : traditions.slice(0, 8);
  };

  const getPerspectiveDescription = (tradition?: Tradition) => {
    if (!tradition) return "Neutral, objective perspective";
    
    const descriptions: Record<string, string> = {
      'advaita-vedanta': 'Views reality through non-dual consciousness. Emphasizes the illusory nature of apparent differences and the fundamental unity of existence.',
      'existentialism': 'Emphasizes individual existence, freedom, and choice. Questions predetermined meanings and highlights personal responsibility.',
      'theravada-buddhism': 'Sees all phenomena as impermanent and interdependent. Focuses on the cessation of suffering through understanding.',
      'sunni-islam': 'Views everything through the lens of divine unity (Tawhīd) and submission to Allah\'s will.',
      'stoicism': 'Emphasizes virtue, rational acceptance of fate, and the distinction between what is and isn\'t under our control.'
    };
    
    return descriptions[tradition.id] || `Views reality through ${tradition.name} teachings and principles.`;
  };

  const getFilteredInfo = () => {
    const currentTradition = getCurrentPerspectiveTradition();
    const threshold = userProfile.preferences.confidenceThreshold;
    
    let info = [];
    
    if (currentTradition) {
      info.push(`Viewing from ${currentTradition.name} perspective`);
    } else {
      info.push('Neutral perspective');
    }
    
    if (threshold > 0.5) {
      info.push(`Only showing claims with ${(threshold * 100).toFixed(0)}%+ confidence`);
    }
    
    if (userProfile.preferences.showCitations) {
      info.push('Citations visible');
    }
    
    return info;
  };

  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'between', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="h6">
            View Perspective & Filters
          </Typography>
          <IconButton
            onClick={() => setExpanded(!expanded)}
            size="small"
          >
            {expanded ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {getFilteredInfo().map((info, index) => (
            <Chip
              key={index}
              label={info}
              size="small"
              icon={index === 0 ? <Visibility /> : <FilterList />}
              color={index === 0 ? 'primary' : 'default'}
            />
          ))}
        </Box>
      </Box>

      <Collapse in={expanded}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Perspective Selection */}
          <Box>
            <Typography variant="subtitle1" gutterBottom>
              Viewing Perspective
            </Typography>
            <FormControl fullWidth>
              <InputLabel>Select Tradition Perspective</InputLabel>
              <Select
                value={userProfile.preferences.perspective || ''}
                onChange={(e) => handlePerspectiveChange(e.target.value)}
              >
                <MenuItem value="">
                  <em>Neutral (No specific tradition lens)</em>
                </MenuItem>
                {getRelevantTraditions().map(tradition => (
                  <MenuItem key={tradition.id} value={tradition.id}>
                    {tradition.name} - {tradition.category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <Alert severity="info" sx={{ mt: 2 }}>
              <Typography variant="body2">
                <strong>Current Perspective:</strong> {getPerspectiveDescription(getCurrentPerspectiveTradition())}
              </Typography>
            </Alert>
          </Box>

          {/* Confidence Threshold */}
          <Box>
            <Typography variant="subtitle1" gutterBottom>
              Information Quality Filter
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Only show claims with confidence level of {(userProfile.preferences.confidenceThreshold * 100).toFixed(0)}% or higher
            </Typography>
            <Slider
              value={userProfile.preferences.confidenceThreshold}
              onChange={(_, value) => handleConfidenceThreshold(value as number)}
              min={0}
              max={1}
              step={0.1}
              marks={[
                { value: 0, label: '0%' },
                { value: 0.5, label: '50%' },
                { value: 0.8, label: '80%' },
                { value: 1, label: '100%' }
              ]}
              valueLabelDisplay="auto"
              valueLabelFormat={(value) => `${(value * 100).toFixed(0)}%`}
            />
          </Box>

          {/* Citations Toggle */}
          <Box>
            <FormControlLabel
              control={
                <Switch
                  checked={userProfile.preferences.showCitations}
                  onChange={(e) => handleCitationToggle(e.target.checked)}
                />
              }
              label="Show source citations and references"
            />
            <Typography variant="body2" color="text.secondary">
              Display primary text citations and scholarly sources for each claim
            </Typography>
          </Box>

          {/* Perspective Effects Info */}
          {getCurrentPerspectiveTradition() && (
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                How this perspective affects your view:
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Alert severity="info" sx={{ py: 1 }}>
                  <Typography variant="body2">
                    <strong>Interpretive Lens:</strong> Terms and concepts will be understood through {getCurrentPerspectiveTradition()?.name} frameworks
                  </Typography>
                </Alert>
                <Alert severity="warning" sx={{ py: 1 }}>
                  <Typography variant="body2">
                    <strong>Critical Analysis:</strong> Other traditions will be evaluated using {getCurrentPerspectiveTradition()?.name} criteria
                  </Typography>
                </Alert>
                <Alert severity="success" sx={{ py: 1 }}>
                  <Typography variant="body2">
                    <strong>Deep Understanding:</strong> You'll see how {getCurrentPerspectiveTradition()?.name} specifically responds to other viewpoints
                  </Typography>
                </Alert>
              </Box>
            </Box>
          )}

          {/* Reset Button */}
          <Box>
            <Button 
              variant="outlined" 
              onClick={() => handlePerspectiveChange('')}
              disabled={!userProfile.preferences.perspective}
            >
              Reset to Neutral Perspective
            </Button>
          </Box>
        </Box>
      </Collapse>
    </Paper>
  );
};

export default PerspectiveSelector;