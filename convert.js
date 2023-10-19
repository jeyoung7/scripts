const fs = require('fs');
const jsonFilePath = 'input.json'; // Replace with your JSON file path
const csvFilePath = 'output.csv'; // Replace with your desired CSV file path

// Function to convert JSON to CSV
function convertToCSV(json) {
  const dataPoints = json.datapoints;
  if (!dataPoints || dataPoints.length === 0) {
    return ''; // Return an empty string if there are no data points.
  }

  const headers = new Set();
  const csvContent = [];

  dataPoints.forEach((dataPoint) => {
    Object.keys(dataPoint).forEach((key) => {
      if (key === 'data' && typeof dataPoint[key] === 'object') {
        Object.keys(dataPoint[key]).forEach((nestedKey) => {
          headers.add(`data.${nestedKey}`);
        });
      } else {
        headers.add(key);
      }
    });

    const row = Array.from(headers).map((header) => {
      const [topLevelKey, nestedKey] = header.split('.');
      if (nestedKey) {
        return dataPoint[topLevelKey] && dataPoint[topLevelKey][nestedKey] ? dataPoint[topLevelKey][nestedKey] : '';
      } else {
        return dataPoint[header] ? dataPoint[header] : '';
      }
    });

    csvContent.push(row.join(','));
  });

  return Array.from(headers).join(',') + '\n' + csvContent.join('\n');
}

// Read the JSON file
fs.readFile(jsonFilePath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading JSON file:', err);
    return;
  }

  // Parse the JSON data
  try {
    const jsonData = JSON.parse(data);

    // Convert JSON data to CSV format
    const csvData = convertToCSV(jsonData);

    // Write the CSV data to a file
    fs.writeFile(csvFilePath, csvData, (err) => {
      if (err) {
        console.error('Error writing CSV file:', err);
      } else {
        console.log('CSV file has been created:', csvFilePath);
      }
    });
  } catch (parseError) {
    console.error('Error parsing JSON data:', parseError);
  }
});
