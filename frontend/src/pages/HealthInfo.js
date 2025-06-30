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
      setError('Sağlık bilgileri yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'genel':
        return Info;
      case 'belirtiler':
        return AlertTriangle;
      case 'risk':
        return Shield;
      case 'teşhis':
        return Activity;
      case 'önleme':
        return Heart;
      case 'tedavi':
        return Users;
      default:
        return BookOpen;
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'genel':
        return 'bg-blue-50 text-blue-600 border-blue-200';
      case 'belirtiler':
        return 'bg-red-50 text-red-600 border-red-200';
      case 'risk':
        return 'bg-orange-50 text-orange-600 border-orange-200';
      case 'teşhis':
        return 'bg-green-50 text-green-600 border-green-200';
      case 'önleme':
        return 'bg-purple-50 text-purple-600 border-purple-200';
      case 'tedavi':
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
        <h1 className="text-4xl font-bold text-gray-900 mb-4">KOAH Hakkında Bilgiler</h1>
        <p className="text-xl text-gray-600">
          Kronik Obstrüktif Akciğer Hastalığı hakkında kapsamlı bilgiler
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
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">KOAH Hakkında Ek Bilgiler</h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Prevalence */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">KOAH'ın Yaygınlığı</h3>
            <div className="space-y-3 text-gray-600">
              <p>• Dünya genelinde yaklaşık 384 milyon kişi KOAH'tan etkilenmektedir</p>
              <p>• Her yıl 3 milyon kişi KOAH nedeniyle hayatını kaybetmektedir</p>
              <p>• Türkiye'de 40 yaş üzeri her 5 kişiden 1'i KOAH hastasıdır</p>
              <p>• KOAH, dünya genelinde ölüm nedenleri arasında 3. sırada yer almaktadır</p>
            </div>
          </div>

          {/* Risk Factors */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Faktörleri</h3>
            <div className="space-y-3 text-gray-600">
              <p>• <strong>Sigara:</strong> En önemli risk faktörü (%80-90)</p>
              <p>• <strong>Pasif sigara:</strong> Sigara içmeyenlerde de risk oluşturur</p>
              <p>• <strong>Mesleki maruziyet:</strong> Toz, kimyasal, duman</p>
              <p>• <strong>Hava kirliliği:</strong> İç ve dış ortam hava kirliliği</p>
              <p>• <strong>Genetik faktörler:</strong> Aile öyküsü</p>
              <p>• <strong>Yaş:</strong> 40 yaş üzeri risk artar</p>
            </div>
          </div>
        </div>
      </div>

      {/* Prevention Tips */}
      <div className="card bg-gradient-to-r from-blue-50 to-cyan-50">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">KOAH'tan Korunma Yolları</h2>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Sigara Bırakma</h3>
            <p className="text-gray-600">
              Sigarayı bırakmak KOAH riskini azaltmanın en etkili yoludur.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Activity className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Düzenli Egzersiz</h3>
            <p className="text-gray-600">
              Solunum kaslarını güçlendiren egzersizler yapın.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Sağlıklı Beslenme</h3>
            <p className="text-gray-600">
              Dengeli beslenme akciğer sağlığını destekler.
            </p>
          </div>
        </div>
      </div>

      {/* Warning Signs */}
      <div className="card bg-red-50 border-red-200">
        <h2 className="text-2xl font-semibold text-red-800 mb-6">Acil Durum Belirtileri</h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-red-800 mb-4">Hangi Durumlarda Acil Başvuru Gerekir?</h3>
            <ul className="space-y-2 text-red-700">
              <li>• Şiddetli nefes darlığı</li>
              <li>• Dudaklarda ve parmaklarda morarma</li>
              <li>• Göğüs ağrısı</li>
              <li>• Yüksek ateş</li>
              <li>• Kanlı balgam</li>
              <li>• Bilinç bulanıklığı</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-red-800 mb-4">Ne Yapmalısınız?</h3>
            <ul className="space-y-2 text-red-700">
              <li>• Hemen en yakın sağlık kuruluşuna başvurun</li>
              <li>• Acil servisi arayın (112)</li>
              <li>• Varsa oksijen cihazınızı kullanın</li>
              <li>• Rahat bir pozisyonda oturun</li>
              <li>• Sakin kalmaya çalışın</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Sağlığınız İçin Harekete Geçin
        </h2>
        <p className="text-lg text-gray-600 mb-6">
          KOAH'ın erken teşhisi hayat kurtarır. Şüpheli belirtileriniz varsa 
          mutlaka bir göğüs hastalıkları uzmanına başvurun.
        </p>
        <button className="btn-primary inline-flex items-center">
          <Activity className="w-5 h-5 mr-2" />
          KOAH Risk Analizi Yap
        </button>
      </div>
    </div>
  );
};

export default HealthInfo; 