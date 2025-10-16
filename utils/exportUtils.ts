import type { ScoredNiche } from '../types';

const convertToCSV = (data: ScoredNiche[]): string => {
  const headers = Object.keys(data[0]);
  const csvRows = [headers.join(',')];

  for (const row of data) {
    const values = headers.map(header => {
      const value = row[header as keyof ScoredNiche];
      const escaped = ('' + (value !== null && value !== undefined ? value : '')).replace(/"/g, '\\"');
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