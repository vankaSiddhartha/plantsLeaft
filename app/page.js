"use client"
import React, { useState } from 'react';
import { Upload, Loader, Leaf, AlertTriangle, FileCheck, ShieldCheck } from 'lucide-react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Home, MessageCircle, Map, Cloud } from 'lucide-react';
import NavigationBar from './components/menu';
import Navbar from './components/menu';

const AnalysisCard = ({ icon: Icon, title, content, color }) => (
  <div className="bg-white/90 p-6 rounded-xl shadow-md border border-gray-100">
    <div className="flex items-start space-x-4">
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div className="flex-1">
        <h3 className="font-semibold text-gray-800 mb-2">{title}</h3>
        <div className="text-gray-600 space-y-2">
          {Array.isArray(content) ? (
            <ul className="list-none">
              {content.map((item, idx) => (
                <li key={idx} className="mb-1">{item}</li>
              ))}
            </ul>
          ) : (
            <p>{content}</p>
          )}
        </div>
      </div>
    </div>
  </div>
);

const SeverityGauge = ({ severity }) => {
  const radius = 80;
  const circumference = radius * Math.PI;
  const progress = (severity / 100) * circumference;
  
  return (
    <div className="h-48 w-full flex flex-col items-center justify-center">
      <svg viewBox="0 0 200 200" className="w-48 h-48 transform -rotate-90">
        <path
          d="M 100,100 m 0,-80 a 80,80 0 1,1 0,160 a 80,80 0 1,1 0,-160"
          className="stroke-gray-200"
          fill="none"
          strokeWidth="16"
          strokeLinecap="round"
        />
        <path
          d="M 100,100 m 0,-80 a 80,80 0 1,1 0,160 a 80,80 0 1,1 0,-160"
          className="stroke-red-500"
          fill="none"
          strokeWidth="16"
          strokeLinecap="round"
          strokeDasharray={`${progress} ${circumference}`}
          style={{
            transition: 'stroke-dasharray 0.5s ease-in-out'
          }}
        />
        <text
          x="100"
          y="100"
          className="text-3xl font-bold transform rotate-90"
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#1F2937"
        >
          {severity}%
        </text>
      </svg>
      <p className="text-gray-600 mt-2">Severity Level</p>
    </div>
  );
};

const PlantDiseaseDetection = () => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [analysis, setAnalysis] = useState(null);

  // Initialize Gemini AI
  const genAI = new GoogleGenerativeAI('AIzaSyA0tKC9fEb3j_EHxktGaf6m2wDc_e60kd8');

  const parseAnalysisResponse = (text) => {
    try {
      // Split the response into sections based on markers we expect in the response
      const sections = text.split('\n\n');
      
      let result = {
        plantId: '',
        health: '',
        disease: {
          name: '',
          severity: 0,
          symptoms: []
        },
        treatment: [],
        prevention: []
      };

      // Parse each section
      sections.forEach(section => {
        if (section.includes('PLANT IDENTIFICATION:')) {
          result.plantId = section.split('PLANT IDENTIFICATION:')[1].trim();
        }
        else if (section.includes('HEALTH STATUS:')) {
          result.health = section.split('HEALTH STATUS:')[1].trim();
        }
        else if (section.includes('DISEASE:')) {
          const diseaseSection = section.split('DISEASE:')[1].trim();
          const diseaseParts = diseaseSection.split('\n');
          result.disease.name = diseaseParts[0].trim();
          
          // Extract severity if present (assuming format "Severity: X%")
          const severityMatch = diseaseSection.match(/Severity:\s*(\d+)%/);
          result.disease.severity = severityMatch ? parseInt(severityMatch[1]) : 0;
        }
        else if (section.includes('SYMPTOMS:')) {
          result.disease.symptoms = section
            .split('SYMPTOMS:')[1]
            .split('\n')
            .map(s => s.trim())
            .filter(s => s && !s.startsWith('-'));
        }
        else if (section.includes('TREATMENT:')) {
          result.treatment = section
            .split('TREATMENT:')[1]
            .split('\n')
            .map(s => s.trim())
            .filter(s => s && !s.startsWith('-'));
        }
        else if (section.includes('PREVENTION:')) {
          result.prevention = section
            .split('PREVENTION:')[1]
            .split('\n')
            .map(s => s.trim())
            .filter(s => s && !s.startsWith('-'));
        }
      });

      return result;
    } catch (err) {
      console.error('Error parsing analysis:', err);
      throw new Error('Failed to parse analysis results');
    }
  };

  const analyzeImage = async () => {
    try {
      setLoading(true);
      setError('');

      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

      // Convert image to correct format for Gemini
      const imageData = await fileToGenerativePart(image);

      // Structured prompt that asks for specific sections
      const prompt = `Analyze this plant image and provide a detailed assessment using the following format:

PLANT IDENTIFICATION:
[Plant name and scientific name]

HEALTH STATUS:
[Brief description of overall health]

DISEASE:
[Disease name if present, or "No disease detected"]
Severity: [0-100]%

SYMPTOMS:
[List each symptom on a new line]

TREATMENT:
[List each treatment recommendation on a new line]

PREVENTION:
[List each prevention measure on a new line]

Please provide specific, detailed information for each section.`;

      const result = await model.generateContent([prompt, imageData]);
      const response = await result.response;
      const text = response.text();
      
      // Parse the text response into our needed structure
      const analysisResult = parseAnalysisResponse(text);
      setAnalysis(analysisResult);
    } catch (err) {
      setError('Error analyzing image. Please try again.');
      console.error('Analysis error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fileToGenerativePart = async (file) => {
    const base64EncodedData = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result.split(',')[1]);
      reader.readAsDataURL(file);
    });
    
    return {
      inlineData: {
        data: base64EncodedData,
        mimeType: file.type
      }
    };
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
      setAnalysis(null); // Reset previous analysis
    }
  };

  return (
    
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100">
<div className="hidden md:block">
          <Navbar />
        </div>
      <div className="max-w-4xl mx-auto p-6 space-y-8 mt-0 md:mt-16">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-800">
            Plant Disease Detection
          </h1>
          <p className="text-gray-600">
            Upload a plant image to analyze its health and detect potential diseases
          </p>
        </div>

        <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-6">
          <div className="space-y-6">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 transition-colors hover:border-green-500">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="imageInput"
              />
              <label
                htmlFor="imageInput"
                className="flex flex-col items-center justify-center cursor-pointer"
              >
                {preview ? (
                  <div className="space-y-4">
                    <img
                      src={preview}
                      alt="Plant preview"
                      className="max-h-64 rounded-lg"
                    />
                    <p className="text-sm text-gray-500">
                      Click to upload a different image
                    </p>
                  </div>
                ) : (
                  <div className="text-center space-y-4">
                    <Upload className="w-12 h-12 mx-auto text-gray-400" />
                    <div>
                      <p className="text-base text-gray-700">
                        Click to upload a plant image
                      </p>
                      <p className="text-sm text-gray-500">
                        JPG, PNG or GIF (MAX. 800x800px)
                      </p>
                    </div>
                  </div>
                )}
              </label>
            </div>

            <button
              onClick={analyzeImage}
              disabled={!image || loading}
              className={`w-full py-3 px-4 rounded-md font-medium flex items-center justify-center space-x-2 
                ${!image || loading
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  <span>Analyzing...</span>
                </>
              ) : (
                <span>Analyze Plant</span>
              )}
            </button>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">
                <p>{error}</p>
              </div>
            )}

            {analysis && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <AnalysisCard
                    icon={Leaf}
                    title="Plant Identification"
                    content={analysis.plantId}
                    color="bg-green-500"
                  />
                  <AnalysisCard
                    icon={AlertTriangle}
                    title="Health Assessment"
                    content={analysis.health}
                    color="bg-yellow-500"
                  />
                </div>

                <div className="bg-white/90 p-6 rounded-xl shadow-md border border-gray-100">
                  <h3 className="font-semibold text-gray-800 mb-4">Disease Analysis</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <p className="font-medium text-gray-700 mb-2">Disease: {analysis.disease.name}</p>
                      <div className="space-y-2">
                        <p className="text-gray-600">Symptoms:</p>
                        <ul className="list-none text-gray-600">
                          {analysis.disease.symptoms.map((symptom, idx) => (
                            <li key={idx} className="mb-1">{symptom}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <SeverityGauge severity={analysis.disease.severity} />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <AnalysisCard
                    icon={FileCheck}
                    title="Treatment Recommendations"
                    content={analysis.treatment}
                    color="bg-blue-500"
                  />
                  <AnalysisCard
                    icon={ShieldCheck}
                    title="Prevention Tips"
                    content={analysis.prevention}
                    color="bg-purple-500"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlantDiseaseDetection;
