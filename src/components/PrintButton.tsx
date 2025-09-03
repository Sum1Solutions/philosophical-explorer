import React from 'react';
import { Button, ButtonGroup, Tooltip } from '@mui/material';
import { Print, Download } from '@mui/icons-material';
import traditionsData from '../data/json/traditions.json';

interface PrintButtonProps {
  className?: string;
  selectedTraditions?: string[];
}

const PrintButton: React.FC<PrintButtonProps> = ({ className = '', selectedTraditions = [] }) => {
  const generateMarkdown = () => {
    // Filter data based on user selections if any
    const dataToExport = selectedTraditions.length > 0 
      ? traditionsData.filter(t => selectedTraditions.includes(t.id))
      : traditionsData;
    let markdown = `# ${selectedTraditions.length > 0 ? 'Selected ' : 'Complete '}Philosophies and Religions Knowledge Base

${selectedTraditions.length > 0 ? `*Filtered to ${selectedTraditions.length} selected traditions*

` : ''}## Table of Contents

${dataToExport.map((tradition, index) => `${index + 1}. [${tradition.name}](#${tradition.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')})`).join('\n')}

---

`;

    dataToExport.forEach((tradition) => {
      markdown += `## ${tradition.name}

**Category:** ${tradition.category}  
${tradition.subSchool ? `**Sub-School:** ${tradition.subSchool}  \n` : ''}**Origin:** ${tradition.originDate || `${Math.abs(tradition.firstYear || 0)} ${(tradition.firstYear || 0) < 0 ? 'BCE' : 'CE'}`}  
${tradition.adherents ? `**Adherents:** ${tradition.adherents}  \n` : ''}${tradition.keyFigures ? `**Key Figures:** ${tradition.keyFigures.join(', ')}  \n` : ''}

### Metaphysics
- **Ultimate Reality:** ${tradition.metaphysics.ultimateReality}
- **View of World:** ${tradition.metaphysics.viewOfWorld}
- **View of Self:** ${tradition.metaphysics.viewOfSelf}
- **Afterlife:** ${tradition.metaphysics.afterlife}

### Epistemology
${Array.isArray(tradition.epistemology) ? tradition.epistemology.map(item => `- ${item}`).join('\n') : `- ${tradition.epistemology}`}

### Ethics
${Array.isArray(tradition.ethics) ? tradition.ethics.map(item => `- ${item}`).join('\n') : `- ${tradition.ethics}`}

### Liberation
**Goal:** ${tradition.liberation.goal}  
**Path:**
${Array.isArray(tradition.liberation.path) ? tradition.liberation.path.map(step => `- ${step}`).join('\n') : `- ${tradition.liberation.path}`}

### Primary Texts
${tradition.primaryTexts.map(text => 
  typeof text === 'string' ? `- ${text}` : `- **${text.title}:** ${text.description || ''}`
).join('\n')}

${tradition.sources && tradition.sources.length > 0 ? `### Key Quotes
${tradition.sources.map(source => `> "${source.text}"  
> — ${source.source}`).join('\n\n')}

` : ''}---

`;
    });

    markdown += `## Summary Statistics

- **Total Traditions Documented:** ${dataToExport.length}
- **Categories Represented:** ${Array.from(new Set(dataToExport.map(t => t.category))).join(', ')}

---

*This document was dynamically generated from the Philosophy & Religion Explorer application.*  
*Last Generated: ${new Date().toLocaleDateString()}*  
*Copyright © 2025 Sum1Solutions, LLC*`;

    return markdown;
  };

  const handlePrint = () => {
    const markdown = generateMarkdown();
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Philosophy & Religion Explorer - Complete Knowledge Base</title>
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 20px; font-size: 12pt; }
              h1 { color: #333; font-size: 16pt; font-weight: bold; margin: 1em 0 0.5em 0; border-bottom: 1px solid #ccc; }
              h2 { color: #333; font-size: 14pt; font-weight: bold; margin: 1.5em 0 0.5em 0; border-bottom: 1px solid #ddd; }
              h3 { color: #555; font-size: 12pt; font-weight: bold; margin: 1em 0 0.3em 0; }
              p { margin: 0.5em 0; }
              blockquote { border-left: 2px solid #ccc; margin-left: 0; padding-left: 12px; font-style: italic; color: #666; }
              ul { padding-left: 16px; margin: 0.5em 0; }
              li { margin: 2px 0; list-style-type: disc; }
              strong { font-weight: bold; }
            </style>
          </head>
          <body>
            <div>${markdown.replace(/\n/g, '<br>').replace(/^# (.+)$/gm, '<h1>$1</h1>').replace(/^## (.+)$/gm, '<h2>$1</h2>').replace(/^### (.+)$/gm, '<h3>$1</h3>').replace(/^\- (.+)$/gm, '<li>$1</li>').replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>').replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')}</div>
          </body>
        </html>
      `);
      printWindow.document.close();
      setTimeout(() => {
        printWindow.print();
      }, 500);
    }
  };

  const handleDownload = () => {
    try {
      const markdown = generateMarkdown();
      const blob = new Blob([markdown], { type: 'text/markdown' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `philosophy-religion-explorer-${new Date().toISOString().split('T')[0]}.md`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading file:', error);
      alert('Unable to generate download. Please try again.');
    }
  };

  return (
    <ButtonGroup variant="contained" size="small" className={className}>
      <Tooltip title="Print complete knowledge base of all philosophies and religions">
        <Button 
          onClick={handlePrint}
          startIcon={<Print />}
          aria-label="Print complete knowledge base"
          sx={{ textTransform: 'none' }}
        >
          Print
        </Button>
      </Tooltip>
      <Tooltip title="Download complete knowledge base as markdown file">
        <Button 
          onClick={handleDownload}
          startIcon={<Download />}
          aria-label="Download complete knowledge base as markdown"
          sx={{ textTransform: 'none' }}
        >
          Download
        </Button>
      </Tooltip>
    </ButtonGroup>
  );
};

export default PrintButton;