import type { ScoredNiche } from '../types';

const convertToCSV = (data: ScoredNiche[]): string => {
  if (data.length === 0) return '';
  
  // Define columns in an order that makes sense for a business report
  const columns = [
    'niche', 'score', 'averagePrice', 'demand', 'competition', 'trend', 
    'description', 'gigTitles', 'keywords', 'battlePlan', 'faqs'
  ];
  
  const headers = columns.join(',');
  const csvRows = [headers];

  for (const row of data) {
    const values = columns.map(header => {
      let value = row[header as keyof ScoredNiche];
      
      // Handle special formatting for complex fields
      if (header === 'gigTitles' && Array.isArray(value)) {
        value = value.join(' | ');
      } else if (header === 'keywords' && Array.isArray(value)) {
        value = value.join(', ');
      } else if (header === 'faqs' && Array.isArray(value)) {
        value = value.map(f => `Q: ${f.question} A: ${f.answer}`).join(' || ');
      }
      
      const escaped = ('' + (value !== null && value !== undefined ? value : '')).replace(/"/g, '""');
      return `"${escaped}"`;
    });
    csvRows.push(values.join(','));
  }
  return csvRows.join('\n');
};

const downloadFile = (content: string, fileName: string, mimeType: string) => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const exportToCSV = (data: ScoredNiche[], fileName: string): boolean => {
  if (!data || data.length === 0) {
    return false;
  }
  const csvContent = convertToCSV(data);
  downloadFile(csvContent, fileName, 'text/csv;charset=utf-8;');
  return true;
};

export const exportToJSON = (data: ScoredNiche[], fileName: string): boolean => {
  if (!data || data.length === 0) {
    return false;
  }
  const jsonContent = JSON.stringify(data, null, 2);
  downloadFile(jsonContent, fileName, 'application/json;charset=utf-8;');
  return true;
};