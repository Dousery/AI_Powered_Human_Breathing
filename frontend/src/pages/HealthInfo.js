import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Heart, AlertTriangle, Info, Shield, Users, Activity, BookOpen } from 'lucide-react';

const HealthInfo = () => {
  const [healthInfo, setHealthInfo] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchHealthInfo();
  }, []);

  const fetchHealthInfo = async () => {
    try {
      const response = await axios.get('/health-info');
      setHealthInfo(response.data.health_info);
    } catch (err) {
      setError('An error occurred while loading health information.');
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'general':
        return Info;
      case 'symptoms':
        return AlertTriangle;
      case 'risk':
        return Shield;
      case 'diagnosis':
        return Activity;
      case 'prevention':
        return Heart;
      case 'treatment':
        return Users;
      default:
        return BookOpen;
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'general':
        return 'bg-blue-50 text-blue-600 border-blue-200';
      case 'symptoms':
        return 'bg-red-50 text-red-600 border-red-200';
      case 'risk':
        return 'bg-orange-50 text-orange-600 border-orange-200';
      case 'diagnosis':
        return 'bg-green-50 text-green-600 border-green-200';
      case 'prevention':
        return 'bg-purple-50 text-purple-600 border-purple-200';
      case 'treatment':
        return 'bg-cyan-50 text-cyan-600 border-cyan-200';
      default:
        return 'bg-gray-50 text-gray-600 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <p className="text-red-600 text-lg">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">COPD Information</h1>
        <p className="text-xl text-gray-600">
          Comprehensive information about Chronic Obstructive Pulmonary Disease
        </p>
      </div>

      {/* Info Cards */}
      <div className="grid md:grid-cols-2 gap-8">
        {healthInfo.map((info, index) => {
          const Icon = getCategoryIcon(info.category);
          const categoryColor = getCategoryColor(info.category);
          
          return (
            <div key={index} className="card hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-start space-x-4">
                <div className={`p-3 rounded-lg border ${categoryColor}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {info.title}
                  </h3>
                  <div className="text-gray-600 whitespace-pre-line">
                    {info.content}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Additional Information */}
      <div className="card">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Additional Information About COPD</h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Prevalence */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Prevalence of COPD</h3>
            <div className="space-y-3 text-gray-600">
              <p>• Approximately 384 million people worldwide are affected by COPD</p>
              <p>• 3 million people die each year due to COPD</p>
              <p>• 1 in 5 people over the age of 40 in Turkey has COPD</p>
              <p>• COPD is the 3rd leading cause of death worldwide</p>
            </div>
          </div>

          {/* Risk Factors */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Factors</h3>
            <div className="space-y-3 text-gray-600">
              <p>• <strong>Smoking:</strong> The most important risk factor (80-90%)</p>
              <p>• <strong>Passive smoking:</strong> Also poses a risk for non-smokers</p>
              <p>• <strong>Occupational exposure:</strong> Dust, chemicals, smoke</p>
              <p>• <strong>Air pollution:</strong> Indoor and outdoor air pollution</p>
              <p>• <strong>Genetic factors:</strong> Family history</p>
              <p>• <strong>Age:</strong> Risk increases over 40 years old</p>
            </div>
          </div>
        </div>
      </div>

      {/* Prevention Tips */}
      <div className="card bg-gradient-to-r from-blue-50 to-cyan-50">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Ways to Prevent COPD</h2>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Quit Smoking</h3>
            <p className="text-gray-600">
              Quitting smoking is the most effective way to reduce the risk of COPD.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Activity className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Regular Exercise</h3>
            <p className="text-gray-600">
              Do exercises that strengthen your respiratory muscles.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Healthy Nutrition</h3>
            <p className="text-gray-600">
              Balanced nutrition supports lung health.
            </p>
          </div>
        </div>
      </div>

      {/* Warning Signs */}
      <div className="card bg-red-50 border-red-200">
        <h2 className="text-2xl font-semibold text-red-800 mb-6">Emergency Warning Signs</h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-red-800 mb-4">When Should You Seek Emergency Help?</h3>
            <ul className="space-y-2 text-red-700">
              <li>• Severe shortness of breath</li>
              <li>• Bluish lips and fingers</li>
              <li>• Chest pain</li>
              <li>• High fever</li>
              <li>• Bloody sputum</li>
              <li>• Confusion</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-red-800 mb-4">What Should You Do?</h3>
            <ul className="space-y-2 text-red-700">
              <li>• Immediately go to the nearest healthcare facility</li>
              <li>• Call emergency services (112)</li>
              <li>• Use your oxygen device if you have one</li>
              <li>• Sit in a comfortable position</li>
              <li>• Try to stay calm</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Take Action for Your Health
        </h2>
        <p className="text-lg text-gray-600 mb-6">
          Early diagnosis of COPD saves lives. If you have suspicious symptoms, be sure to consult a pulmonologist.
        </p>
      </div>
    </div>
  );
};

export default HealthInfo; 