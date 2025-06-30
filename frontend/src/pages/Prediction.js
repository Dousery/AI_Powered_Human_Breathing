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
          title: 'Normal Durum',
          description: 'Hasta normal solunum fonksiyonlarına sahip görünüyor.',
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          icon: CheckCircle
        };
      case 1:
        return {
          title: 'Orta Risk',
          description: 'Hastada hafif solunum problemleri tespit edildi. Takip önerilir.',
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-50',
          icon: AlertCircle
        };
      case 2:
        return {
          title: 'Yüksek Risk',
          description: 'Hastada ciddi solunum problemleri tespit edildi. Acil değerlendirme gerekli.',
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          icon: XCircle
        };
      default:
        return {
          title: 'Bilinmeyen',
          description: 'Tahmin sonucu belirlenemedi.',
          color: 'text-gray-600',
          bgColor: 'bg-gray-50',
          icon: AlertCircle
        };
    }
  };

  const handleSubmit = async () => {
    if (!files.breath || !files.audio || !files.metadata) {
      setError('Lütfen tüm dosyaları yükleyin.');
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
      setError(err.response?.data?.detail || 'Tahmin sırasında bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const chartData = prediction ? [
    { name: 'Normal', value: prediction.probabilities[0], color: '#10b981' },
    { name: 'Orta Risk', value: prediction.probabilities[1], color: '#f59e0b' },
    { name: 'Yüksek Risk', value: prediction.probabilities[2], color: '#ef4444' }
  ] : [];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">KOAH Tahminleme</h1>
        <p className="text-xl text-gray-600">
          Nefes ve ses verilerinizi yükleyerek AI destekli KOAH risk analizi yapın
        </p>
      </div>

      {/* File Upload Section */}
      <div className="card">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Veri Dosyalarını Yükleyin</h2>
        
        <div className="grid md:grid-cols-3 gap-6">
          {/* Breath Sensor Data */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nefes Sensörü Verisi (column1.txt)
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
                  {files.breath ? files.breath.name : 'Dosya seçin'}
                </p>
              </label>
            </div>
          </div>

          {/* Audio Sensor Data */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ses Sensörü Verisi (column3.txt)
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
                  {files.audio ? files.audio.name : 'Dosya seçin'}
                </p>
              </label>
            </div>
          </div>

          {/* Metadata */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hasta Bilgileri (metadata.txt)
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
                  {files.metadata ? files.metadata.name : 'Dosya seçin'}
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
                Analiz Ediliyor...
              </>
            ) : (
              <>
                <Activity className="w-5 h-5 mr-2" />
                Tahmin Et
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
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Tahmin Sonucu</h2>
            
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
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Tahmin Olasılıkları</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => [`${(value * 100).toFixed(1)}%`, 'Olasılık']}
                    labelFormatter={(label) => `${label} Durumu`}
                  />
                  <Bar dataKey="value" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Detailed Probabilities */}
          <div className="card">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Detaylı Olasılıklar</h3>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { name: 'Normal', prob: prediction.probabilities[0], color: 'bg-green-100 text-green-800' },
                { name: 'Orta Risk', prob: prediction.probabilities[1], color: 'bg-yellow-100 text-yellow-800' },
                { name: 'Yüksek Risk', prob: prediction.probabilities[2], color: 'bg-red-100 text-red-800' }
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
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Öneriler</h3>
            <div className="space-y-4">
              {prediction.prediction === 0 && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">Normal Durum İçin Öneriler:</h4>
                  <ul className="text-green-700 space-y-1">
                    <li>• Düzenli sağlık kontrollerinizi yaptırın</li>
                    <li>• Sigara içiyorsanız bırakın</li>
                    <li>• Düzenli egzersiz yapın</li>
                    <li>• Sağlıklı beslenin</li>
                  </ul>
                </div>
              )}
              
              {prediction.prediction === 1 && (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <h4 className="font-semibold text-yellow-800 mb-2">Orta Risk İçin Öneriler:</h4>
                  <ul className="text-yellow-700 space-y-1">
                    <li>• Bir göğüs hastalıkları uzmanına başvurun</li>
                    <li>• Solunum fonksiyon testleri yaptırın</li>
                    <li>• Sigarayı mutlaka bırakın</li>
                    <li>• Düzenli takip altında olun</li>
                  </ul>
                </div>
              )}
              
              {prediction.prediction === 2 && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <h4 className="font-semibold text-red-800 mb-2">Yüksek Risk İçin Öneriler:</h4>
                  <ul className="text-red-700 space-y-1">
                    <li>• Acil olarak bir göğüs hastalıkları uzmanına başvurun</li>
                    <li>• Detaylı solunum fonksiyon testleri yaptırın</li>
                    <li>• Gerekirse hastane ortamında değerlendirme</li>
                    <li>• Tedavi planı oluşturun</li>
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