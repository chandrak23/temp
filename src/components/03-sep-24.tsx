import * as React from 'react';
import { Upload } from '@progress/kendo-react-upload';

const App = () => {
  // Custom function to handle file uploads
  const handleUpload = async (event) => {
    const files = event.affectedFiles;
    for (let file of files) {
      if (file.state === 'selected') {
        const formData = new FormData();
        formData.append('file', file.getRawFile());

        try {
          // Replace 'YOUR_CUSTOM_UPLOAD_URL' with your custom endpoint
          const response = await fetch('YOUR_CUSTOM_UPLOAD_URL', {
            method: 'POST',
            body: formData,
            // Add any headers if needed
          });

          if (!response.ok) {
            throw new Error('File upload failed');
          }

          const data = await response.json();
          console.log('File uploaded successfully:', data);

          // Optionally update the file status in the upload component
          event.data = data;
        } catch (error) {
          console.error('Error uploading file:', error);
        }
      }
    }
  };

  return (
    <Upload
      batch={false}
      multiple={true}
      defaultFiles={[]}
      withCredentials={false}
      onAdd={handleUpload} // Handle file add event to trigger upload
    />
  );
};

export default App;
