import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  Paper,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Close,
  Add,
  Remove,
  Source,
  Info,
  Timeline,
  Psychology,
  Gavel,
  FlightTakeoff
} from '@mui/icons-material';
import { Tradition } from '../types';
import { getSourceLinks } from '../data/sources';
import { getAdherentsComparison, getOriginComparison, getConfidenceComparison } from '../utils/comparative';
import { getTooltipContent } from '../utils/philosophicalTopics';

interface TraditionDetailViewProps {
  tradition: Tradition | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCompare: (traditionId: string) => void;
  isAlreadySelected: boolean;
}

const TraditionDetailView: React.FC<TraditionDetailViewProps> = ({
  tradition,
  isOpen,
  onClose,
  onAddToCompare,
  isAlreadySelected
}) => {
  if (!tradition) return null;

  const handleAddToCompare = () => {
    onAddToCompare(tradition.id);
  };

  const renderSection = (
    title: string, 
    icon: React.ReactNode, 
    content: React.ReactNode,
    topicKey?: string
  ) => (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Tooltip title={topicKey ? getTooltipContent(topicKey) : title} arrow>
          <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'help' }}>
            {icon}
          </Box>
        </Tooltip>
        <Typography variant="h6" sx={{ ml: 1, fontWeight: 'bold' }}>
          {title}
        </Typography>
      </Box>
      <Paper sx={{ 
        p: 2, 
        bgcolor: (theme) => theme.palette.mode === 'dark' ? 'grey.800' : 'grey.50',
        color: 'text.primary'
      }}>
        {content}
      </Paper>
    </Box>
  );

  const renderMetaphysics = () => (
    <Box>
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle2" color="primary" gutterBottom>
          Ultimate Reality
        </Typography>
        <Typography variant="body2">
          {tradition.metaphysics.ultimateReality}
        </Typography>
      </Box>
      
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle2" color="primary" gutterBottom>
          View of World
        </Typography>
        <Typography variant="body2">
          {tradition.metaphysics.viewOfWorld}
        </Typography>
      </Box>
      
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle2" color="primary" gutterBottom>
          View of Self
        </Typography>
        <Typography variant="body2">
          {tradition.metaphysics.viewOfSelf}
        </Typography>
      </Box>
      
      <Box>
        <Typography variant="subtitle2" color="primary" gutterBottom>
          Afterlife/Future
        </Typography>
        <Typography variant="body2">
          {tradition.metaphysics.afterlife}
        </Typography>
      </Box>
    </Box>
  );

  const renderEpistemology = () => (
    <Box>
      <Typography variant="subtitle2" color="primary" gutterBottom>
        Sources of Knowledge
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
        {tradition.epistemology.map((source, index) => {
          const links = getSourceLinks(source);
          const hasLinks = links.length > 0;
          
          return (
            <Tooltip 
              key={index}
              title={hasLinks ? `Click to explore ${source}` : source}
              arrow
            >
              <Chip
                label={source}
                variant="outlined"
                size="small"
                color="primary"
                clickable={hasLinks}
                onClick={hasLinks ? () => {
                  // Open source selection dialog or primary link
                  if (links.length === 1) {
                    window.open(links[0].url, '_blank');
                  } else {
                    // TODO: Could implement a selection dialog for multiple sources
                    window.open(links[0].url, '_blank');
                  }
                } : undefined}
                sx={hasLinks ? {
                  '&:hover': {
                    backgroundColor: 'primary.light',
                    color: 'primary.contrastText'
                  }
                } : {}}
              />
            </Tooltip>
          );
        })}
      </Box>
    </Box>
  );

  const renderEthics = () => (
    <Box>
      <Typography variant="subtitle2" color="primary" gutterBottom>
        Moral Principles
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
        {tradition.ethics.map((ethic, index) => (
          <Chip
            key={index}
            label={ethic}
            variant="outlined"
            size="small"
            color="secondary"
          />
        ))}
      </Box>
    </Box>
  );

  const renderLiberation = () => (
    <Box>
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle2" color="primary" gutterBottom>
          Ultimate Goal
        </Typography>
        <Typography variant="body2">
          {tradition.liberation.goal}
        </Typography>
      </Box>
      
      <Box>
        <Typography variant="subtitle2" color="primary" gutterBottom>
          Path/Method
        </Typography>
        <List dense>
          {tradition.liberation.path.map((step, index) => (
            <ListItem key={index} sx={{ py: 0.5 }}>
              <ListItemText 
                primary={`${index + 1}. ${step}`}
                primaryTypographyProps={{ variant: 'body2' }}
              />
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );

  const renderCritiques = () => (
    <Box>
      <Typography variant="subtitle2" color="primary" gutterBottom>
        How this tradition critiques others:
      </Typography>
      {Object.keys(tradition.critiques).length > 0 ? (
        <List>
          {Object.entries(tradition.critiques).map(([target, critique], index) => (
            <ListItem key={index} sx={{ flexDirection: 'column', alignItems: 'flex-start', py: 1 }}>
              <Typography variant="body2" color="error" fontWeight="bold">
                vs {target}:
              </Typography>
              <Typography variant="body2" sx={{ mt: 0.5 }}>
                {critique}
              </Typography>
              {index < Object.entries(tradition.critiques).length - 1 && (
                <Divider sx={{ width: '100%', mt: 1 }} />
              )}
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography variant="body2" color="text.secondary">
          No specific critiques recorded
        </Typography>
      )}
    </Box>
  );

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { minHeight: '80vh' }
      }}
    >
      <DialogTitle sx={{ 
        bgcolor: 'primary.main', 
        color: 'primary.contrastText',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        pb: 3
      }}>
        <Box>
          <Typography variant="h5" component="div" sx={{ mb: 1 }}>
            {tradition.name}
          </Typography>
          <Typography variant="subtitle2" sx={{ opacity: 0.8 }}>
            {tradition.category} • {tradition.subSchool}
          </Typography>
        </Box>
        <IconButton
          edge="end"
          color="inherit"
          onClick={onClose}
          aria-label="close"
        >
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3, pt: 4 }}>
        {/* Overview */}
        <Box sx={{ mb: 3, mt: 2 }}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            gap: 2,
            mb: 2 
          }}>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Tooltip 
                title={
                  <Box sx={{ p: 1 }}>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                      Adherents Comparison
                    </Typography>
                    <Typography variant="body2">
                      {getAdherentsComparison(tradition).comparison}
                    </Typography>
                    <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
                      {getAdherentsComparison(tradition).details}
                    </Typography>
                  </Box>
                }
                arrow
                placement="top"
                componentsProps={{
                  tooltip: {
                    sx: {
                      bgcolor: 'grey.900',
                      color: 'white',
                      maxWidth: 320,
                      '& .MuiTooltip-arrow': {
                        color: 'grey.900'
                      }
                    }
                  }
                }}
              >
                <Chip 
                  label={`${tradition.adherents} adherents`} 
                  color="info" 
                  size="small"
                  clickable
                  sx={{
                    '&:hover': { 
                      backgroundColor: 'info.dark',
                      color: 'info.contrastText'
                    }
                  }}
                />
              </Tooltip>
              
              <Tooltip 
                title={
                  <Box sx={{ p: 1 }}>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                      Historical Age Comparison
                    </Typography>
                    <Typography variant="body2">
                      {getOriginComparison(tradition).comparison}
                    </Typography>
                    <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
                      {getOriginComparison(tradition).details}
                    </Typography>
                  </Box>
                }
                arrow
                placement="top"
                componentsProps={{
                  tooltip: {
                    sx: {
                      bgcolor: 'grey.900',
                      color: 'white',
                      maxWidth: 320,
                      '& .MuiTooltip-arrow': {
                        color: 'grey.900'
                      }
                    }
                  }
                }}
              >
                <Chip 
                  label={`Origin: ${tradition.originDate}`} 
                  color="default" 
                  size="small"
                  clickable
                  sx={{
                    '&:hover': { 
                      backgroundColor: 'grey.600',
                      color: 'white'
                    }
                  }}
                />
              </Tooltip>
            </Box>
            
            <Tooltip 
              title={
                <Box sx={{ p: 1, maxWidth: 320 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Information Quality Score
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    {getConfidenceComparison(tradition).comparison}
                  </Typography>
                  
                  <Typography variant="caption" sx={{ fontWeight: 'bold', display: 'block', mb: 1 }}>
                    📊 Confidence Scale:
                  </Typography>
                  <Typography variant="caption" sx={{ display: 'block', color: '#4caf50' }}>
                    • 95-100%: Extremely well-documented (Christianity, Islam)
                  </Typography>
                  <Typography variant="caption" sx={{ display: 'block', color: '#4caf50' }}>
                    • 85-94%: Well-documented with minor uncertainties
                  </Typography>
                  <Typography variant="caption" sx={{ display: 'block', color: '#ff9800' }}>
                    • 70-84%: Good sources but some gaps/debates
                  </Typography>
                  <Typography variant="caption" sx={{ display: 'block', color: '#f44336' }}>
                    • Below 70%: Limited sources or scholarly disagreement
                  </Typography>
                  
                  <Typography variant="caption" sx={{ mt: 2, display: 'block' }}>
                    {getConfidenceComparison(tradition).details}
                  </Typography>
                  <Typography variant="caption" sx={{ mt: 1, display: 'block', fontWeight: 'bold' }}>
                    💡 Based on: scholarly consensus, primary source availability, historical documentation
                  </Typography>
                </Box>
              }
              arrow
              placement="top"
              componentsProps={{
                tooltip: {
                  sx: {
                    bgcolor: 'grey.900',
                    color: 'white',
                    maxWidth: 320,
                    '& .MuiTooltip-arrow': {
                      color: 'grey.900'
                    }
                  }
                }
              }}
            >
              <Chip 
                label={`Confidence: ${(tradition.confidence * 100).toFixed(0)}%`}
                color={tradition.confidence > 0.9 ? 'success' : 'warning'}
                size="small"
                clickable
                sx={{
                  '&:hover': { 
                    backgroundColor: tradition.confidence > 0.9 ? 'success.dark' : 'warning.dark',
                    color: 'white'
                  }
                }}
              />
            </Tooltip>
          </Box>
          
          <Typography variant="body2" color="text.secondary">
            Key figures: {tradition.keyFigures.join(', ')}
          </Typography>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Core Philosophy Sections */}
        {renderSection(
          "Metaphysics",
          <Psychology color="primary" />,
          renderMetaphysics(),
          "metaphysics"
        )}

        {renderSection(
          "Epistemology",
          <Info color="primary" />,
          renderEpistemology(),
          "epistemology"
        )}

        {renderSection(
          "Ethics",
          <Gavel color="primary" />,
          renderEthics(),
          "ethics"
        )}

        {renderSection(
          "Liberation/Salvation",
          <FlightTakeoff color="primary" />,
          renderLiberation(),
          "liberation"
        )}

        {renderSection(
          "Inter-tradition Critiques",
          <Timeline color="error" />,
          renderCritiques()
        )}

        {/* Primary Texts */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Tooltip title="Primary Texts: Foundational writings and scriptures that define this tradition's core teachings" arrow>
              <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'help' }}>
                <Source color="primary" />
              </Box>
            </Tooltip>
            <Typography variant="h6" sx={{ ml: 1, fontWeight: 'bold' }}>
              Primary Texts
            </Typography>
          </Box>
          <Paper sx={{ 
        p: 2, 
        bgcolor: (theme) => theme.palette.mode === 'dark' ? 'grey.800' : 'grey.50',
        color: 'text.primary'
      }}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {tradition.primaryTexts.map((text, index) => {
                // Handle both string and object formats for primaryTexts
                const textTitle = typeof text === 'string' ? text : text.title;
                const textUrl = typeof text === 'string' ? null : text.url;
                const textDescription = typeof text === 'string' ? null : text.description;
                
                // Try to get source links, or use the embedded URL if available
                const sourceLinks = getSourceLinks(textTitle);
                const hasSourceLinks = sourceLinks.length > 0;
                const hasEmbeddedUrl = textUrl !== null && textUrl !== undefined;
                const hasLinks = hasSourceLinks || hasEmbeddedUrl;
                
                return (
                  <Tooltip 
                    key={index}
                    title={hasLinks ? (
                      <Box>
                        <Typography variant="caption" display="block">
                          Click to read "{textTitle}" online
                        </Typography>
                        {textDescription && (
                          <Typography variant="caption" display="block" sx={{ fontStyle: 'italic', mb: 1 }}>
                            {textDescription}
                          </Typography>
                        )}
                        {hasEmbeddedUrl && (
                          <Typography variant="caption" display="block">
                            • Direct link available
                          </Typography>
                        )}
                        {sourceLinks.slice(0, 3).map((link, i) => (
                          <Typography key={i} variant="caption" display="block">
                            • {link.name} ({link.source})
                          </Typography>
                        ))}
                      </Box>
                    ) : `${textTitle} - No online version found`}
                    arrow
                  >
                    <Chip
                      label={textTitle}
                      variant={hasLinks ? "filled" : "outlined"}
                      size="small"
                      icon={<Source />}
                      color={hasLinks ? "primary" : "default"}
                      clickable={hasLinks}
                      onClick={hasLinks ? () => {
                        if (hasEmbeddedUrl) {
                          window.open(textUrl, '_blank');
                        } else if (sourceLinks.length === 1) {
                          window.open(sourceLinks[0].url, '_blank');
                        } else if (sourceLinks.length > 0) {
                          // Open first available source link
                          window.open(sourceLinks[0].url, '_blank');
                        }
                      } : undefined}
                      sx={hasLinks ? {
                        cursor: 'pointer',
                        '&:hover': {
                          backgroundColor: 'primary.dark',
                          color: 'primary.contrastText'
                        }
                      } : {}}
                    />
                  </Tooltip>
                );
              })}
            </Box>
            
            {/* Show available links summary */}
            <Box sx={{ mt: 2 }}>
              <Typography variant="caption" color="text.secondary">
                📚 Blue texts are available to read online • Click to explore primary sources
              </Typography>
            </Box>
          </Paper>
        </Box>

        {/* Sources */}
        {tradition.sources && tradition.sources.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              Key Citations
            </Typography>
            {tradition.sources.map((source, index) => (
              <Paper key={index} sx={{ 
                p: 2, 
                mb: 1, 
                bgcolor: (theme) => theme.palette.mode === 'dark' ? 'grey.800' : 'grey.50',
                color: 'text.primary'
              }}>
                <Typography variant="body2" sx={{ fontStyle: 'italic', mb: 1 }}>
                  "{source.text}"
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="caption" color="text.secondary">
                    — {source.source}
                    {source.page && `, p. ${source.page}`}
                    {source.verse && `, ${source.verse}`}
                  </Typography>
                  <Chip
                    label={`${source.confidence} confidence`}
                    size="small"
                    color={source.confidence === 'high' ? 'success' : source.confidence === 'medium' ? 'warning' : 'error'}
                  />
                </Box>
              </Paper>
            ))}
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ 
        p: 3, 
        bgcolor: (theme) => theme.palette.mode === 'dark' ? 'grey.800' : 'grey.50'
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          <Typography variant="caption" color="text.secondary">
            Last updated: {tradition.lastUpdated}
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button onClick={onClose} color="secondary">
              Close
            </Button>
            
            <Tooltip 
              title={isAlreadySelected ? 'Remove from comparison' : 'Add to comparison'}
            >
              <span>
                <Button
                  variant={isAlreadySelected ? "outlined" : "contained"}
                  startIcon={isAlreadySelected ? <Remove /> : <Add />}
                  onClick={handleAddToCompare}
                  color="primary"
                >
                  {isAlreadySelected ? 'Remove from Compare' : 'Add to Compare'}
                </Button>
              </span>
            </Tooltip>
          </Box>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default TraditionDetailView;