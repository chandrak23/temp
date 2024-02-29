import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [data, setData] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get('/kafka-data');
      setData(response.data);
    };
    fetchData();
  }, []);

  return (
    <div>
      <h1>Kafka Data:</h1>
      <p>{data}</p>
    </div>
  );
};

export default App;
