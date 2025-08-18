// Explanations of main philosophical topics for tooltips

export interface PhilosophicalTopic {
  name: string;
  shortDescription: string;
  detailedDescription: string;
  keyQuestions: string[];
  examples: string[];
}

export const philosophicalTopics: Record<string, PhilosophicalTopic> = {
  metaphysics: {
    name: "Metaphysics",
    shortDescription: "The fundamental nature of reality, existence, and being",
    detailedDescription: "Metaphysics explores the most basic questions about what exists and what it means to exist. It investigates the fundamental structure of reality beyond what we can directly observe.",
    keyQuestions: [
      "What is ultimately real?",
      "What is the nature of existence?",
      "What is the relationship between mind and matter?",
      "Is there a God or ultimate reality?",
      "What is the nature of time and space?"
    ],
    examples: [
      "Christianity: God as ultimate reality",
      "Buddhism: Emptiness and interdependence",
      "Materialism: Only physical matter exists",
      "Idealism: Reality is fundamentally mental"
    ]
  },

  epistemology: {
    name: "Epistemology",
    shortDescription: "How we know what we know - the study of knowledge and belief",
    detailedDescription: "Epistemology examines the nature, sources, limitations, and validity of knowledge. It asks what makes beliefs justified or unjustified, and how we can distinguish truth from falsehood.",
    keyQuestions: [
      "How do we acquire knowledge?",
      "What makes a belief justified?",
      "Can we have certain knowledge?",
      "What are the limits of human knowledge?",
      "How do we distinguish truth from opinion?"
    ],
    examples: [
      "Empiricism: Knowledge through experience",
      "Rationalism: Knowledge through reason",
      "Religious traditions: Revelation and scripture",
      "Scientific method: Observation and testing"
    ]
  },

  ethics: {
    name: "Ethics",
    shortDescription: "Moral principles about right and wrong, good and evil",
    detailedDescription: "Ethics investigates questions of morality - what actions are right or wrong, what character traits are virtuous or vicious, and what constitutes a good life worth living.",
    keyQuestions: [
      "What makes an action right or wrong?",
      "What virtues should we cultivate?",
      "How should we treat others?",
      "What do we owe to society?",
      "What is the meaning of a good life?"
    ],
    examples: [
      "Utilitarianism: Maximize happiness for all",
      "Deontology: Act according to moral rules",
      "Virtue ethics: Cultivate good character",
      "Religious ethics: Follow divine commands"
    ]
  },

  liberation: {
    name: "Liberation/Salvation",
    shortDescription: "The ultimate goal and path to human flourishing or spiritual freedom",
    detailedDescription: "This explores the highest human aspiration - whether it's called salvation, liberation, enlightenment, or flourishing. It examines both the ultimate goal and the practical path to achieve it.",
    keyQuestions: [
      "What is the highest human good?",
      "How do we overcome suffering?",
      "What is the path to fulfillment?",
      "Is there life after death?",
      "How do we achieve lasting peace?"
    ],
    examples: [
      "Buddhism: Nirvana through the Eightfold Path",
      "Christianity: Salvation through faith in Christ",
      "Stoicism: Tranquility through virtue",
      "Existentialism: Authentic self-creation"
    ]
  },

  psychology: {
    name: "Psychology/Mind",
    shortDescription: "Understanding human consciousness, behavior, and mental processes",
    detailedDescription: "The study of mind, consciousness, and human behavior, often overlapping with philosophical questions about the nature of mental states and personal identity.",
    keyQuestions: [
      "What is consciousness?",
      "How does the mind work?",
      "What makes us who we are?",
      "Are we free or determined?",
      "What is the self?"
    ],
    examples: [
      "Buddhist psychology: No-self doctrine",
      "Western psychology: Individual identity",
      "Cognitive science: Mental processes",
      "Behaviorism: Observable actions"
    ]
  },

  politics: {
    name: "Political Philosophy", 
    shortDescription: "Questions about government, justice, rights, and social organization",
    detailedDescription: "Political philosophy examines the nature of government, political authority, rights, justice, and the ideal organization of society.",
    keyQuestions: [
      "What justifies political authority?",
      "What rights do individuals have?",
      "What is justice?",
      "How should society be organized?",
      "What do we owe each other?"
    ],
    examples: [
      "Liberalism: Individual rights and freedom",
      "Socialism: Collective ownership and equality", 
      "Confucianism: Harmonious social hierarchy",
      "Anarchism: No coercive authority"
    ]
  }
};

export const getTopicExplanation = (topicKey: string): PhilosophicalTopic | null => {
  return philosophicalTopics[topicKey.toLowerCase()] || null;
};

export const getTooltipContent = (topicKey: string): string => {
  const topic = getTopicExplanation(topicKey.toLowerCase());
  if (!topic) return '';
  
  return `${topic.name}: ${topic.shortDescription}`;
};

export const getDetailedTooltipContent = (topicKey: string): string => {
  const topic = getTopicExplanation(topicKey.toLowerCase());
  if (!topic) return '';
  
  return `${topic.name}: ${topic.shortDescription}\n\nKey Questions: ${topic.keyQuestions.slice(0, 2).join(' • ')}`;
};