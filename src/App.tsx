import React, { useState, useEffect } from 'react';
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Container,
  AppBar,
  Toolbar,
  Typography,
  Box,
  Tab,
  Tabs,
  Paper,
  IconButton,
  Tooltip
} from '@mui/material';
import { School, Psychology, Quiz, Chat, DarkMode, LightMode, Timeline } from '@mui/icons-material';
import TraditionSelector from './components/TraditionSelector';
import ComparisonMatrix from './components/ComparisonMatrix';
import AIDebateChat from './components/AIDebateChat';
import TimelineView from './components/TimelineView';
import TraditionDetailView from './components/TraditionDetailView';
import BottomBar from './components/BottomBar';
import { UserProfile } from './types';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [currentTab, setCurrentTab] = useState(0);
  const [selectedTraditions, setSelectedTraditions] = useState<string[]>([]);
  const [selectedTraditionForDetail, setSelectedTraditionForDetail] = useState<any>(null);
  const [isDetailViewOpen, setIsDetailViewOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    id: 'user-1',
    savedComparisons: [],
    quizResults: {},
    preferences: {
      perspective: '',
      showCitations: true,
      confidenceThreshold: 0.7
    }
  });

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: '#1976d2',
      },
      secondary: {
        main: '#dc004e',
      },
      background: {
        default: darkMode ? '#121212' : '#fafafa',
        paper: darkMode ? '#1e1e1e' : '#ffffff',
      },
      text: {
        primary: darkMode ? '#ffffff' : '#000000',
        secondary: darkMode ? '#b3b3b3' : '#666666',
      },
    },
    typography: {
      h4: {
        fontWeight: 600,
      },
      h5: {
        fontWeight: 600,
      },
      h6: {
        fontWeight: 600,
      },
      body1: {
        lineHeight: 1.6,
      },
      body2: {
        lineHeight: 1.5,
      },
    },
    components: {
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            backgroundColor: darkMode ? '#1e1e1e' : '#1976d2',
          },
        },
      },
    },
  });

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  const handleCompare = () => {
    setCurrentTab(2); // Switch to comparison tab
  };

  const handleTraditionSelectionChange = (traditionIds: string[]) => {
    setSelectedTraditions(traditionIds);
  };

  const handleTraditionClick = (tradition: any) => {
    setSelectedTraditionForDetail(tradition);
    setIsDetailViewOpen(true);
    // Also add to selection if not already selected
    if (!selectedTraditions.includes(tradition.id)) {
      setSelectedTraditions([...selectedTraditions, tradition.id]);
    }
  };

  const handleDetailViewClose = () => {
    setIsDetailViewOpen(false);
    setSelectedTraditionForDetail(null);
  };

  const handleAddToCompareFromDetail = (traditionId: string) => {
    if (!selectedTraditions.includes(traditionId)) {
      setSelectedTraditions([...selectedTraditions, traditionId]);
    }
  };

  // Load user preferences from localStorage
  useEffect(() => {
    const savedProfile = localStorage.getItem('philo-explorer-profile');
    if (savedProfile) {
      try {
        setUserProfile(JSON.parse(savedProfile));
      } catch (error) {
        console.error('Failed to load user profile:', error);
      }
    }
  }, []);

  // Save user preferences to localStorage
  useEffect(() => {
    localStorage.setItem('philo-explorer-profile', JSON.stringify(userProfile));
  }, [userProfile]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ flexGrow: 1, minHeight: '100vh' }}>
        <AppBar position="static" elevation={0}>
          <Toolbar>
            <Tooltip title="Explore and compare philosophical and religious traditions through four main areas: Metaphysics (reality), Epistemology (knowledge), Ethics (morality), and Liberation (ultimate goals)" arrow>
              <School sx={{ mr: 2, cursor: 'help' }} />
            </Tooltip>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Philosophy & Religion Explorer
            </Typography>
            <IconButton
              color="inherit"
              onClick={() => setDarkMode(!darkMode)}
            >
              {darkMode ? <LightMode /> : <DarkMode />}
            </IconButton>
          </Toolbar>
        </AppBar>

        <Container maxWidth="xl" sx={{ mt: 2 }}>
          <Paper sx={{ width: '100%', mb: 2 }}>
            <Tabs
              value={currentTab}
              onChange={handleTabChange}
              indicatorColor="primary"
              textColor="primary"
              variant="fullWidth"
            >
              <Tooltip title="View traditions arranged chronologically through history and by philosophical categories" arrow>
                <Tab
                  label="Philosophy & Religious Traditions Timeline"
                  icon={<Timeline />}
                  iconPosition="start"
                />
              </Tooltip>
              <Tooltip title="Browse and select philosophical and religious traditions to compare" arrow>
                <Tab
                  label="Select Traditions"
                  icon={<Psychology />}
                  iconPosition="start"
                />
              </Tooltip>
              <Tooltip title="Side-by-side comparison of selected traditions' beliefs and practices" arrow>
                <Tab
                  label={`Compare (${selectedTraditions.length})`}
                  icon={<School />}
                  iconPosition="start"
                  disabled={selectedTraditions.length < 2}
                />
              </Tooltip>
              <Tooltip title="Watch AI representatives from different traditions engage in philosophical debates" arrow>
                <Tab
                  label="AI Debate"
                  icon={<Chat />}
                  iconPosition="start"
                  disabled={selectedTraditions.length < 2}
                />
              </Tooltip>
              <Tooltip title="Discover which philosophical traditions align with your worldview (Coming Soon)" arrow>
                <Tab
                  label="Quiz Mode"
                  icon={<Quiz />}
                  iconPosition="start"
                  disabled // Coming soon
                />
              </Tooltip>
            </Tabs>
          </Paper>

          {/* Tab Panels */}
          <TabPanel value={currentTab} index={0}>
            <TimelineView
              selectedTraditions={selectedTraditions}
              onTraditionClick={handleTraditionClick}
            />
          </TabPanel>

          <TabPanel value={currentTab} index={1}>
            <TraditionSelector
              selectedTraditions={selectedTraditions}
              onSelectionChange={handleTraditionSelectionChange}
              onCompare={handleCompare}
              userProfile={userProfile}
              onProfileUpdate={setUserProfile}
            />
          </TabPanel>

          <TabPanel value={currentTab} index={2}>
            {selectedTraditions.length >= 2 ? (
              <ComparisonMatrix
                selectedTraditions={selectedTraditions}
              />
            ) : (
              <Paper sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="h6" color="text.secondary">
                  Select at least 2 traditions to compare
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                  Go to the "Select Traditions" tab to choose philosophical or religious traditions for comparison.
                </Typography>
              </Paper>
            )}
          </TabPanel>

          <TabPanel value={currentTab} index={3}>
            {selectedTraditions.length >= 2 ? (
              <AIDebateChat
                selectedTraditions={selectedTraditions}
                topic="The nature of ultimate reality and human existence"
              />
            ) : (
              <Paper sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="h6" color="text.secondary">
                  Select at least 2 traditions for AI debate
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                  Watch AI representatives from different philosophical traditions engage in structured debates about fundamental questions.
                </Typography>
              </Paper>
            )}
          </TabPanel>

          <TabPanel value={currentTab} index={4}>
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h6" color="text.secondary">
                Quiz Mode - Coming Soon
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                Discover which philosophical traditions align with your worldview through our comprehensive quiz system.
              </Typography>
            </Paper>
          </TabPanel>
        </Container>

        {/* Bottom Bar */}
        <BottomBar selectedTraditions={selectedTraditions} />

        {/* Global Tradition Detail View */}
        <TraditionDetailView
          tradition={selectedTraditionForDetail}
          isOpen={isDetailViewOpen}
          onClose={handleDetailViewClose}
          onAddToCompare={handleAddToCompareFromDetail}
          isAlreadySelected={selectedTraditionForDetail ? selectedTraditions.includes(selectedTraditionForDetail.id) : false}
        />
      </Box>
    </ThemeProvider>
  );
}

export default App;
