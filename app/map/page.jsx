"use client"
import React, { useState, useEffect } from 'react';

const DiseaseMap = () => {
  const [diseases, setDiseases] = useState([]);

  // Generate random disease data
  useEffect(() => {
    // List of 20 Indian states
    const states = [
      { name: 'Uttar Pradesh', lat: 27.1767, lng: 79.0167 },
      { name: 'Maharashtra', lat: 19.7515, lng: 75.7139 },
      { name: 'Punjab', lat: 31.1471, lng: 75.3412 },
      { name: 'Haryana', lat: 29.0588, lng: 76.0856 },
      { name: 'Bihar', lat: 25.0961, lng: 85.3131 },
      { name: 'Tamil Nadu', lat: 11.1276, lng: 78.6569 },
      { name: 'Karnataka', lat: 15.3173, lng: 75.7139 },
      { name: 'West Bengal', lat: 22.9868, lng: 87.8550 },
      { name: 'Andhra Pradesh', lat: 15.9129, lng: 79.7400 },
      { name: 'Kerala', lat: 10.8505, lng: 76.2711 },
      { name: 'Gujarat', lat: 22.2587, lng: 71.1924 },
      { name: 'Rajasthan', lat: 27.0238, lng: 74.2179 },
      { name: 'Madhya Pradesh', lat: 23.4731, lng: 77.9470 },
      { name: 'Odisha', lat: 20.4625, lng: 85.2987 },
      { name: 'Chhattisgarh', lat: 21.2787, lng: 81.6550 },
      { name: 'Assam', lat: 26.2006, lng: 92.9376 },
      { name: 'Jharkhand', lat: 23.6102, lng: 85.2799 },
      { name: 'Nagaland', lat: 26.1584, lng: 94.5624 },
      { name: 'Goa', lat: 15.2993, lng: 74.1240 },
      { name: 'Himachal Pradesh', lat: 32.0707, lng: 77.1734 }
    ];

    // List of 40 crop diseases
    const diseaseTypes = [
      'Wheat Rust', 'Rice Blast', 'Potato Blight', 'Cotton Wilt', 'Corn Leaf Blight',
      'Tomato Mosaic Virus', 'Sugarcane Borer', 'Soybean Rust', 'Groundnut Rot', 'Rice Sheath Blight',
      'Banana Bunchy Top Disease', 'Citrus Greening', 'Apple Scab', 'Mango Anthracnose', 'Chili Wilt',
      'Onion White Rot', 'Cabbage Yellowing', 'Pea Downy Mildew', 'Mustard White Rust', 'Maize Streak Virus',
      'Pulses Wilt', 'Millet Rust', 'Barley Yellow Dwarf', 'Grape Downy Mildew', 'Cucumber Mosaic Virus',
      'Beans Rust', 'Coriander Yellowing', 'Pumpkin Yellowing', 'Carrot Root Rot', 'Tomato Early Blight',
      'Avocado Brown Rot', 'Papaya Ringspot Virus', 'Potato Late Blight', 'Sunflower Rust', 'Tobacco Mosaic Virus',
      'Peanut Bud Necrosis', 'Apple Fire Blight', 'Peach Leaf Curl', 'Pear Scab', 'Strawberry Leaf Spot'
    ];

    // Generate random data for disease monitoring
    const generateData = () => {
      return states.map(state => ({
        ...state,
        severity: Math.floor(Math.random() * 100),
        disease: diseaseTypes[Math.floor(Math.random() * diseaseTypes.length)],
        affectedArea: Math.floor(Math.random() * 1000) + 100
      }));
    };

    setDiseases(generateData());

    const interval = setInterval(() => setDiseases(generateData()), 10000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  // Function to determine the color based on disease severity
  const getSeverityColor = (severity) => {
    if (severity > 75) return '#ff0000'; // Critical (Red)
    if (severity > 50) return '#ff4500'; // High (Orange)
    if (severity > 25) return '#ffa500'; // Medium (Yellow)
    return '#ffd700'; // Low (Light Yellow)
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">India Plant Disease Monitor</h1>

        {/* Legend */}
        <div className="flex gap-4 mb-6 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-yellow-400"></div>
            <span>Low Severity (0-25%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-orange-400"></div>
            <span>Medium Severity (26-50%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-orange-600"></div>
            <span>High Severity (51-75%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-red-600"></div>
            <span>Critical Severity (76-100%)</span>
          </div>
        </div>

        {/* Map Visualization */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {diseases.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-lg p-4 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-bold">{item.name}</h3>
                <div
                  className="w-6 h-6 rounded-full"
                  style={{ backgroundColor: getSeverityColor(item.severity) }}
                ></div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Disease:</span>
                  <span className="font-medium">{item.disease}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Severity:</span>
                  <span className="font-medium">{item.severity}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Affected Area:</span>
                  <span className="font-medium">{item.affectedArea} hectares</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div
                    className="h-2 rounded-full transition-all duration-500"
                    style={{
                      width: `${item.severity}%`,
                      backgroundColor: getSeverityColor(item.severity)
                    }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 text-sm text-gray-600 text-center">
          Data updates every minute • Last updated: {new Date().toLocaleString()}
        </div>
      </div>
    </div>
  );
};

export default DiseaseMap;
