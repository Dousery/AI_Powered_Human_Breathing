import React from 'react';
import { Heart, Code, Database, Brain, Shield, Users, Award } from 'lucide-react';

const About = () => {
  const features = [
    {
      icon: Brain,
      title: 'Artificial Intelligence Technology',
      description: 'Prediction with advanced machine learning algorithms and high accuracy.',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      icon: Database,
      title: 'Comprehensive Data Analysis',
      description: 'Analysis of 17 different features from breath and sound sensor data.',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      icon: Shield,
      title: 'Secure Data Processing',
      description: 'Your patient data is processed and protected securely.',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ];

  const team = [
    {
      name: 'AI & Software Developer\n(Doğuser Yarar)',
      role: 'AI & Software Development',
      description: 'Developed the AI model and a user-friendly interface.',
      photo: '/team/doguser.jpg'
    },
    {
      name: 'Hardware Designer\n(Yunus Emre Dangaç)',
      role: 'Hardware Design',
      description: 'Developed the custom breathing sensor hardware.',
      photo: '/team/yunus.jpg'
    },
  ];

  const technology = [
    {
      category: 'Backend',
      items: ['FastAPI', 'Python', 'Scikit-learn', 'NumPy', 'SciPy']
    },
    {
      category: 'Frontend',
      items: ['React', 'Tailwind CSS', 'Recharts', 'Axios']
    },
    {
      category: 'AI/ML',
      items: ['Ensemble Models', 'Feature Engineering', 'Signal Processing', 'MFCC Analysis']
    },
    {
      category: 'Data Processing',
      items: ['Pandas', 'Joblib', 'Signal Analysis', 'Audio Processing']
    }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-16">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">About Us</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          KOAH AI is an innovative health application developed to facilitate the early diagnosis of COPD with artificial intelligence technology.
        </p>
      </div>

      {/* Mission & Vision */}
      <div className="grid md:grid-cols-2 gap-8">
        <div className="card">
          <div className="flex items-center mb-4">
            <Heart className="w-8 h-8 text-red-500 mr-3" />
            <h2 className="text-2xl font-semibold text-gray-900">Our Mission</h2>
          </div>
          <p className="text-gray-600 leading-relaxed">
            To facilitate the early diagnosis of COPD, increase the quality of life of patients, and slow the progression of the disease by offering AI-powered solutions. To develop reliable and user-friendly health technologies accessible to everyone.
          </p>
        </div>

        <div className="card">
          <div className="flex items-center mb-4">
            <Award className="w-8 h-8 text-blue-500 mr-3" />
            <h2 className="text-2xl font-semibold text-gray-900">Our Vision</h2>
          </div>
          <p className="text-gray-600 leading-relaxed">
            To be a pioneer in health technologies and to popularize AI-powered diagnostic systems. To become the standard in the early diagnosis of COPD and similar respiratory diseases and to contribute to global healthcare services.
          </p>
        </div>
      </div>

      {/* Features */}
      <div>
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          System Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-center place-items-center">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="card text-center hover:shadow-xl transition-shadow duration-300 w-full min-w-[300px] flex flex-col h-full justify-center"
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 ${feature.bgColor} rounded-full mb-6 mx-auto`}>
                  <Icon className={`w-8 h-8 ${feature.color}`} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Technology Stack */}
      <div className="card">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Technology Stack
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {technology.map((tech, index) => (
            <div key={index} className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{tech.category}</h3>
              <div className="space-y-2">
                {tech.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="px-3 py-2 bg-gray-50 rounded-lg text-gray-700">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Team */}
      <div>
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Development Team
        </h2>
        <div className="w-full flex flex-col items-center">
          <div className="grid md:grid-cols-2 gap-8 justify-center place-items-center">
            {team.map((member, index) => (
              <div key={index} className="card text-center w-[300px] h-[350px] max-w-full flex flex-col items-center justify-center">
                {member.photo ? (
                  <img
                    src={member.photo}
                    alt={member.name}
                    className="w-28 h-28 rounded-full mx-auto mb-4 object-cover border-4 border-white shadow"
                  />
                ) : (
                  <div className="w-28 h-28 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Users className="w-14 h-14 text-white" />
                  </div>
                )}
                <div className="whitespace-pre-line">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{member.name}</h3>
                </div>
                <p className="text-blue-600 font-medium mb-3">{member.role}</p>
                <p className="text-gray-600">{member.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Model Information */}
      <div className="card bg-gradient-to-r from-blue-50 to-cyan-50">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          AI Model Information
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Model Features</h3>
            <ul className="space-y-3 text-gray-600">
              <li>• <strong>Model Tipi:</strong> Ensemble Model</li>
              <li>• <strong>Özellik Sayısı:</strong> 17 selected features</li>
              <li>• <strong>Sınıf Sayısı:</strong> 3 (Normal, Medium Risk, High Risk)</li>
              <li>• <strong>Doğruluk Oranı:</strong> High performance</li>
              <li>• <strong>Analiz Süresi:</strong> Less than 5 seconds</li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Analyzed Data</h3>
            <ul className="space-y-3 text-gray-600">
              <li>• <strong>Breath Sensor Data:</strong> Breath power and pattern</li>
              <li>• <strong>Sound Sensor Data:</strong> Breath sound analysis</li>
              <li>• <strong>Patient Data:</strong> Age, smoking status, etc.</li>
              <li>• <strong>Signal Processing:</strong> FFT, MFCC, statistical features</li>
              <li>• <strong>Machine Learning:</strong> Feature Selection and Classification</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Contact & Support */}
      <div className="card">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Contact & Support
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="text-center">
            <Code className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Technical Support</h3>
            <p className="text-gray-600">
              You can get support for system usage and technical problems.
            </p>
          </div>
          <div className="text-center">
            <Heart className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Health Consultancy</h3>
            <p className="text-gray-600">
              Consultancy service for information and health recommendations about COPD.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-8">
        <p className="text-gray-600 mb-4">
          KOAH AI - AI-Powered Health Technology
        </p>
        <p className="text-sm text-gray-500">
          © 2025 All rights reserved. This application is not a substitute for medical diagnosis.
        </p>
      </div>
    </div>
  );
};

export default About; 