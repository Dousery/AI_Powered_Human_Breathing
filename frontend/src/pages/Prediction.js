import React, { useState } from 'react';
import axios from 'axios';
import { Upload, FileText, Activity, AlertCircle, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Prediction = () => {
  const [files, setFiles] = useState({
    breath: null,
    audio: null,
    metadata: null
  });
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (fileType, file) => {
    setFiles(prev => ({
      ...prev,
      [fileType]: file
    }));
    setError('');
  };

  const getRiskLevelInfo = (prediction) => {
    switch (prediction) {
      case 0:
        return {
          title: 'Normal',
          description: 'The patient appears to have normal respiratory function.',
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          icon: CheckCircle
        };
      case 1:
        return {
          title: 'Moderate Risk',
          description: 'Mild respiratory problems detected. Follow-up is recommended.',
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-50',
          icon: AlertCircle
        };
      case 2:
        return {
          title: 'High Risk',
          description: 'Serious respiratory problems detected. Urgent evaluation required.',
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          icon: XCircle
        };
      default:
        return {
          title: 'Unknown',
          description: 'Prediction result could not be determined.',
          color: 'text-gray-600',
          bgColor: 'bg-gray-50',
          icon: AlertCircle
        };
    }
  };

  const handleSubmit = async () => {
    if (!files.breath || !files.audio || !files.metadata) {
      setError('Please upload all files.');
      return;
    }

    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('breath_file', files.breath);
    formData.append('audio_file', files.audio);
    formData.append('metadata_file', files.metadata);

    try {
      const response = await axios.post('/predict', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setPrediction(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'An error occurred during prediction.');
    } finally {
      setLoading(false);
    }
  };

  const chartData = prediction ? [
    { name: 'Normal', value: prediction.probabilities[0], color: '#10b981' },
    { name: 'Moderate Risk', value: prediction.probabilities[1], color: '#f59e0b' },
    { name: 'High Risk', value: prediction.probabilities[2], color: '#ef4444' }
  ] : [];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">COPD Prediction</h1>
        <p className="text-xl text-gray-600">
          Upload your breath and sound data to perform AI-powered COPD risk analysis
        </p>
      </div>

      {/* File Upload Section */}
      <div className="card">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Upload Data Files</h2>
        
        <div className="grid md:grid-cols-3 gap-6">
          {/* Breath Sensor Data */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Breath Sensor Data (column1.txt)
            </label>
            <div className="file-upload">
              <input
                type="file"
                accept=".txt"
                onChange={(e) => handleFileChange('breath', e.target.files[0])}
                className="hidden"
                id="breath-file"
              />
              <label htmlFor="breath-file" className="cursor-pointer">
                <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-gray-600">
                  {files.breath ? files.breath.name : 'Select file'}
                </p>
              </label>
            </div>
          </div>

          {/* Audio Sensor Data */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sound Sensor Data (column3.txt)
            </label>
            <div className="file-upload">
              <input
                type="file"
                accept=".txt"
                onChange={(e) => handleFileChange('audio', e.target.files[0])}
                className="hidden"
                id="audio-file"
              />
              <label htmlFor="audio-file" className="cursor-pointer">
                <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-gray-600">
                  {files.audio ? files.audio.name : 'Select file'}
                </p>
              </label>
            </div>
          </div>

          {/* Metadata */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Patient Information (metadata.txt)
            </label>
            <div className="file-upload">
              <input
                type="file"
                accept=".txt"
                onChange={(e) => handleFileChange('metadata', e.target.files[0])}
                className="hidden"
                id="metadata-file"
              />
              <label htmlFor="metadata-file" className="cursor-pointer">
                <FileText className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-gray-600">
                  {files.metadata ? files.metadata.name : 'Select file'}
                </p>
              </label>
            </div>
          </div>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <XCircle className="w-5 h-5 text-red-600 mr-2" />
              <span className="text-red-800">{error}</span>
            </div>
          </div>
        )}

        <div className="mt-6">
          <button
            onClick={handleSubmit}
            disabled={loading || !files.breath || !files.audio || !files.metadata}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Activity className="w-5 h-5 mr-2" />
                Predict
              </>
            )}
          </button>
        </div>
      </div>

      {/* Results Section */}
      {prediction && (
        <div className="space-y-6">
          {/* Prediction Result */}
          <div className="card">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Prediction Result</h2>
            {/* Patient Info */}
            {prediction.patient_info && (
              <div className="mb-6 flex flex-wrap gap-6 items-center bg-blue-50 border border-blue-100 rounded-lg p-4">
                <div>
                  <span className="font-semibold text-gray-700">Name:</span> {prediction.patient_info.name}
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Age:</span> {prediction.patient_info.age}
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Smoking:</span> {prediction.patient_info.smoking}
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Test Date:</span> {prediction.patient_info.test_date}
                </div>
              </div>
            )}
            {(() => {
              const riskInfo = getRiskLevelInfo(prediction.prediction);
              const Icon = riskInfo.icon;
              
              return (
                <div className={`p-6 rounded-lg ${riskInfo.bgColor} border-l-4 border-l-current ${riskInfo.color}`}>
                  <div className="flex items-center mb-4">
                    <Icon className={`w-8 h-8 mr-3 ${riskInfo.color}`} />
                    <h3 className={`text-2xl font-bold ${riskInfo.color}`}>
                      {riskInfo.title}
                    </h3>
                  </div>
                  <p className="text-gray-700 text-lg">{riskInfo.description}</p>
                </div>
              );
            })()}
          </div>

          {/* Probability Chart */}
          <div className="card">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Prediction Probabilities</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => [`${(value * 100).toFixed(1)}%`, 'Probability']}
                    labelFormatter={(label) => `${label} Status`}
                  />
                  <Bar dataKey="value" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Detailed Probabilities */}
          <div className="card">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Detailed Probabilities</h3>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { name: 'Normal', prob: prediction.probabilities[0], color: 'bg-green-100 text-green-800' },
                { name: 'Moderate Risk', prob: prediction.probabilities[1], color: 'bg-yellow-100 text-yellow-800' },
                { name: 'High Risk', prob: prediction.probabilities[2], color: 'bg-red-100 text-red-800' }
              ].map((item, index) => (
                <div key={index} className="text-center p-4 rounded-lg">
                  <div className={`text-2xl font-bold mb-2 ${item.color}`}>
                    {(item.prob * 100).toFixed(1)}%
                  </div>
                  <div className="text-gray-600">{item.name}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommendations */}
          <div className="card">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Recommendations</h3>
            <div className="space-y-4">
              {prediction.prediction === 0 && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">Recommendations for Normal:</h4>
                  <ul className="text-green-700 space-y-1">
                    <li>• Have regular health check-ups</li>
                    <li>• Quit smoking if you smoke</li>
                    <li>• Exercise regularly</li>
                    <li>• Eat healthy</li>
                  </ul>
                </div>
              )}
              
              {prediction.prediction === 1 && (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <h4 className="font-semibold text-yellow-800 mb-2">Recommendations for Moderate Risk:</h4>
                  <ul className="text-yellow-700 space-y-1">
                    <li>• Consult a pulmonologist</li>
                    <li>• Take pulmonary function tests</li>
                    <li>• Absolutely quit smoking</li>
                    <li>• Be under regular follow-up</li>
                  </ul>
                </div>
              )}
              
              {prediction.prediction === 2 && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <h4 className="font-semibold text-red-800 mb-2">Recommendations for High Risk:</h4>
                  <ul className="text-red-700 space-y-1">
                    <li>• Consult a pulmonologist urgently</li>
                    <li>• Take detailed pulmonary function tests</li>
                    <li>• Get evaluated in a hospital setting if necessary</li>
                    <li>• Create a treatment plan</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Prediction; 