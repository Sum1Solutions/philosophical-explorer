import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  Avatar,
  Chip,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Card,
  CardContent,
  Divider
} from '@mui/material';
import {
  Send,
  PlayArrow,
  Pause,
  Settings,
  Source,
  Warning,
  CheckCircle
} from '@mui/icons-material';
import { AIDebate, DebateMessage, Tradition, Citation } from '../types';
import { traditions } from '../data/traditions';

interface AIDebateChatProps {
  selectedTraditions: string[];
  topic?: string;
}

interface GuardrailResult {
  isValid: boolean;
  confidence: number;
  issues: string[];
  suggestedSources: Citation[];
}

const AIDebateChat: React.FC<AIDebateChatProps> = ({
  selectedTraditions,
  topic = "The nature of ultimate reality"
}) => {
  const [messages, setMessages] = useState<DebateMessage[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isDebateRunning, setIsDebateRunning] = useState(false);
  const [currentSpeaker, setCurrentSpeaker] = useState(0);
  const [userParticipating, setUserParticipating] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [moderatorMode, setModeratorMode] = useState(true);
  const [guardrailResults, setGuardrailResults] = useState<GuardrailResult | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const debateInterval = useRef<NodeJS.Timeout | null>(null);

  const participatingTraditions = traditions.filter(t => 
    selectedTraditions.includes(t.id)
  );

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Simulated AI response with guardrails
  const generateAIResponse = async (tradition: Tradition, topic: string, context: DebateMessage[]): Promise<DebateMessage> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock responses based on tradition
    const responses: Record<string, string> = {
      'advaita-vedanta': `From the Advaitic perspective, ultimate reality is Brahman - pure, non-dual consciousness. The apparent world is mithyā, neither completely real nor completely unreal. As the Upaniṣads declare: "Sarvam khalvidam brahma" - all this is indeed Brahman.`,
      
      'existentialism': `The existentialist position rejects any predetermined essence or ultimate reality. We are "thrown" into existence and must create our own meaning. As Sartre argued, existence precedes essence - we exist first, then define ourselves through our choices and actions.`,
      
      'theravada-buddhism': `Buddhism teaches that there is no ultimate, unchanging reality or self. The Three Characteristics (tilakkhana) show us that all formations are impermanent (anicca), suffering (dukkha), and without self (anātman). Liberation comes through seeing this truth clearly.`,
      
      'sunni-islam': `From the Islamic viewpoint, ultimate reality is Allah - the One, eternal, transcendent Creator. The Qur'an states: "He is Allah, [who is] One, Allah, the Eternal Refuge." The creation is distinct from the Creator, and recognizing this tawhīd is fundamental to faith.`,
      
      'stoicism': `The Stoics teach that ultimate reality is the Logos - the divine reason that governs the cosmos. We find peace by aligning ourselves with this rational order and accepting what fate brings, while focusing our efforts only on what is truly under our control.`
    };

    const content = responses[tradition.id] || `Speaking from the ${tradition.name} tradition, I must consider our fundamental teachings about reality, knowledge, and the human condition...`;
    
    // Mock citations
    const citations: Citation[] = [
      {
        text: "Primary source reference",
        source: tradition.primaryTexts[0] || "Traditional text",
        confidence: 'high'
      }
    ];

    return {
      tradition: tradition.name,
      content,
      citations,
      timestamp: new Date().toISOString(),
      confidence: 0.85 + Math.random() * 0.1 // Mock confidence score
    };
  };

  // Guardrail system to validate responses
  const validateResponse = (message: DebateMessage, tradition: Tradition): GuardrailResult => {
    const issues: string[] = [];
    let confidence = 0.9;

    // Check for off-topic content
    if (!message.content.toLowerCase().includes('reality') && 
        !message.content.toLowerCase().includes('existence') &&
        !message.content.toLowerCase().includes('truth')) {
      issues.push('Response may be off-topic');
      confidence -= 0.2;
    }

    // Check for tradition-specific terminology
    const traditionTerms: Record<string, string[]> = {
      'Advaita Vedanta': ['brahman', 'atman', 'maya', 'moksha'],
      'Buddhism': ['dharma', 'karma', 'nirvana', 'dukkha'],
      'Islam': ['allah', 'tawhid', 'quran'],
      'Existentialism': ['existence', 'essence', 'authenticity', 'absurd'],
      'Stoicism': ['logos', 'virtue', 'fate', 'reason']
    };

    const terms = traditionTerms[message.tradition] || [];
    const hasTerms = terms.some(term => 
      message.content.toLowerCase().includes(term.toLowerCase())
    );
    
    if (!hasTerms && terms.length > 0) {
      issues.push('Response lacks tradition-specific terminology');
      confidence -= 0.1;
    }

    // Validate citations
    if (!message.citations || message.citations.length === 0) {
      issues.push('No citations provided');
      confidence -= 0.15;
    }

    return {
      isValid: confidence > 0.5 && issues.length < 3,
      confidence,
      issues,
      suggestedSources: tradition.sources || []
    };
  };

  const startDebate = async () => {
    if (participatingTraditions.length < 2) return;
    
    setIsDebateRunning(true);
    setMessages([]);
    
    // Introduction message
    const introMessage: DebateMessage = {
      tradition: 'Moderator',
      content: `Welcome to this philosophical debate on "${topic}". Today we have representatives from ${participatingTraditions.map(t => t.name).join(', ')}. Each tradition will present their perspective, and we encourage respectful dialogue that illuminates the deep questions of human existence.`,
      citations: [],
      timestamp: new Date().toISOString(),
      confidence: 1.0
    };
    
    setMessages([introMessage]);

    // Start AI debate loop
    debateInterval.current = setInterval(async () => {
      if (currentSpeaker < participatingTraditions.length) {
        const tradition = participatingTraditions[currentSpeaker];
        const aiMessage = await generateAIResponse(tradition, topic, messages);
        
        // Validate with guardrails
        const validation = validateResponse(aiMessage, tradition);
        setGuardrailResults(validation);
        
        if (validation.isValid) {
          setMessages(prev => [...prev, aiMessage]);
          setCurrentSpeaker(prev => (prev + 1) % participatingTraditions.length);
        } else {
          // Generate a fallback message if validation fails
          const fallbackMessage: DebateMessage = {
            tradition: tradition.name,
            content: `I need to reflect more deeply on this question from our ${tradition.name} perspective. Let me consult our primary sources and return to this discussion.`,
            citations: tradition.sources || [],
            timestamp: new Date().toISOString(),
            confidence: 0.6
          };
          setMessages(prev => [...prev, fallbackMessage]);
        }
      }
    }, 3000);
  };

  const pauseDebate = () => {
    setIsDebateRunning(false);
    if (debateInterval.current) {
      clearInterval(debateInterval.current);
    }
  };

  const handleUserMessage = async () => {
    if (!userInput.trim()) return;

    const userMessage: DebateMessage = {
      tradition: 'User',
      content: userInput,
      citations: [],
      timestamp: new Date().toISOString(),
      confidence: 1.0
    };

    setMessages(prev => [...prev, userMessage]);
    setUserInput('');

    // If user is participating, continue the debate
    if (userParticipating && isDebateRunning) {
      setCurrentSpeaker(prev => (prev + 1) % participatingTraditions.length);
    }
  };

  const getTraditionColor = (traditionName: string): string => {
    const colors = ['#1976d2', '#388e3c', '#f57c00', '#7b1fa2', '#c62828'];
    const index = participatingTraditions.findIndex(t => t.name === traditionName);
    return colors[index % colors.length];
  };

  const getConfidenceColor = (confidence: number): 'success' | 'warning' | 'error' => {
    if (confidence >= 0.8) return 'success';
    if (confidence >= 0.6) return 'warning';
    return 'error';
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5">
            AI Tradition Debate: {topic}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {!isDebateRunning ? (
              <Button
                variant="contained"
                startIcon={<PlayArrow />}
                onClick={startDebate}
                disabled={participatingTraditions.length < 2}
              >
                Start Debate
              </Button>
            ) : (
              <Button
                variant="contained"
                color="warning"
                startIcon={<Pause />}
                onClick={pauseDebate}
              >
                Pause
              </Button>
            )}
            <IconButton onClick={() => setShowSettings(true)}>
              <Settings />
            </IconButton>
          </Box>
        </Box>

        {/* Participants */}
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {participatingTraditions.map(tradition => (
            <Chip
              key={tradition.id}
              label={tradition.name}
              avatar={
                <Avatar sx={{ bgcolor: getTraditionColor(tradition.name) }}>
                  {tradition.name.charAt(0)}
                </Avatar>
              }
            />
          ))}
          {userParticipating && (
            <Chip
              label="You"
              avatar={<Avatar>U</Avatar>}
              color="primary"
            />
          )}
        </Box>
      </Paper>

      {/* Guardrail Status */}
      {guardrailResults && (
        <Alert 
          severity={guardrailResults.isValid ? 'success' : 'warning'}
          sx={{ mb: 2 }}
          icon={guardrailResults.isValid ? <CheckCircle /> : <Warning />}
        >
          Last response validation: {(guardrailResults.confidence * 100).toFixed(0)}% confidence
          {guardrailResults.issues.length > 0 && (
            <Box sx={{ mt: 1 }}>
              <Typography variant="caption">
                Issues: {guardrailResults.issues.join(', ')}
              </Typography>
            </Box>
          )}
        </Alert>
      )}

      {/* Messages */}
      <Paper sx={{ flex: 1, p: 2, overflow: 'auto', mb: 2 }}>
        <List>
          {messages.map((message, index) => (
            <ListItem key={index} sx={{ flexDirection: 'column', alignItems: 'flex-start', pb: 2 }}>
              <Card sx={{ width: '100%', mb: 1 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Avatar 
                      sx={{ 
                        bgcolor: message.tradition === 'Moderator' 
                          ? 'grey.600' 
                          : message.tradition === 'User'
                          ? 'primary.main'
                          : getTraditionColor(message.tradition),
                        mr: 2 
                      }}
                    >
                      {message.tradition.charAt(0)}
                    </Avatar>
                    <Typography variant="h6">
                      {message.tradition}
                    </Typography>
                    <Box sx={{ ml: 'auto', display: 'flex', gap: 1 }}>
                      <Chip
                        label={`${(message.confidence * 100).toFixed(0)}%`}
                        size="small"
                        color={getConfidenceColor(message.confidence)}
                      />
                    </Box>
                  </Box>
                  
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {message.content}
                  </Typography>
                  
                  {message.citations.length > 0 && (
                    <Box>
                      <Divider sx={{ mb: 1 }} />
                      <Typography variant="caption" color="text.secondary">
                        Sources:
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
                        {message.citations.map((citation, citIndex) => (
                          <Chip
                            key={citIndex}
                            icon={<Source />}
                            label={citation.source}
                            size="small"
                            variant="outlined"
                            color={citation.confidence === 'high' ? 'success' : 'warning'}
                          />
                        ))}
                      </Box>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </ListItem>
          ))}
        </List>
        <div ref={messagesEndRef} />
      </Paper>

      {/* Input */}
      <Paper sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            fullWidth
            multiline
            maxRows={3}
            placeholder="Join the debate or ask a question..."
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleUserMessage();
              }
            }}
          />
          <Button
            variant="contained"
            endIcon={<Send />}
            onClick={handleUserMessage}
            disabled={!userInput.trim()}
          >
            Send
          </Button>
        </Box>
      </Paper>

      {/* Settings Dialog */}
      <Dialog open={showSettings} onClose={() => setShowSettings(false)}>
        <DialogTitle>Debate Settings</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>User Participation</InputLabel>
            <Select
              value={userParticipating ? 'yes' : 'no'}
              onChange={(e) => setUserParticipating(e.target.value === 'yes')}
            >
              <MenuItem value="no">Observer Only</MenuItem>
              <MenuItem value="yes">Active Participant</MenuItem>
            </Select>
          </FormControl>
          
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Moderator Mode</InputLabel>
            <Select
              value={moderatorMode ? 'yes' : 'no'}
              onChange={(e) => setModeratorMode(e.target.value === 'yes')}
            >
              <MenuItem value="yes">Guided Discussion</MenuItem>
              <MenuItem value="no">Free Debate</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowSettings(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AIDebateChat;