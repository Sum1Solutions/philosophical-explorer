import React from 'react';
import { Button, ButtonGroup, Tooltip } from '@mui/material';
import { Print, Download } from '@mui/icons-material';

interface PrintButtonProps {
  className?: string;
}

const PrintButton: React.FC<PrintButtonProps> = ({ className = '' }) => {
  const handlePrint = () => {
    const printWindow = window.open('/COMPLETE_PHILOSOPHIES_AND_RELIGIONS.md', '_blank');
    if (printWindow) {
      printWindow.addEventListener('load', () => {
        setTimeout(() => {
          printWindow.print();
        }, 500);
      });
    }
  };

  const handleDownload = async () => {
    try {
      const response = await fetch('/COMPLETE_PHILOSOPHIES_AND_RELIGIONS.md');
      const text = await response.text();
      const blob = new Blob([text], { type: 'text/markdown' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'complete_philosophies_and_religions.md';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading file:', error);
      alert('Unable to download. Please check if the file exists in the public folder.');
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