import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Activity, Info, ArrowRight, Shield, Users, Zap } from 'lucide-react';

const Home = () => {
  const features = [
    {
      icon: Activity,
      title: 'AI Destekli Tahmin',
      description: 'Gelişmiş makine öğrenmesi algoritmaları ile KOAH riskini değerlendirin.',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      icon: Shield,
      title: 'Güvenli Analiz',
      description: 'Hasta verileriniz güvenle işlenir ve korunur.',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      icon: Users,
      title: 'Uzman Desteği',
      description: 'Sağlık profesyonelleri tarafından geliştirilmiş sistem.',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      icon: Zap,
      title: 'Hızlı Sonuç',
      description: 'Saniyeler içinde detaylı analiz sonuçları alın.',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  const stats = [
    { number: '95%', label: 'Doğruluk Oranı' },
    { number: '< 30s', label: 'Analiz Süresi' },
    { number: '17', label: 'Özellik Analizi' },
    { number: '24/7', label: 'Kullanılabilirlik' }
  ];

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mb-6">
              <Heart className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              KOAH Tahminleme
              <span className="block text-blue-600">AI Sistemi</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Yapay zeka destekli sistem ile KOAH hastalığını erken tespit edin. 
              Nefes ve ses verilerinizi analiz ederek sağlık durumunuzu değerlendirin.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/prediction" className="btn-primary inline-flex items-center">
                <Activity className="w-5 h-5 mr-2" />
                Hemen Başla
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <Link to="/health-info" className="btn-secondary inline-flex items-center">
                <Info className="w-5 h-5 mr-2" />
                Daha Fazla Bilgi
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white rounded-2xl shadow-lg">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Sistem Performansı
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Neden KOAH AI?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="card text-center hover:shadow-xl transition-shadow duration-300">
                  <div className={`inline-flex items-center justify-center w-16 h-16 ${feature.bgColor} rounded-full mb-6`}>
                    <Icon className={`w-8 h-8 ${feature.color}`} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">
            Sağlığınız İçin Hemen Başlayın
          </h2>
          <p className="text-xl mb-8 opacity-90">
            KOAH'ın erken teşhisi hayat kurtarır. AI destekli sistemimiz ile 
            sağlık durumunuzu değerlendirin.
          </p>
          <Link to="/prediction" className="bg-white text-blue-600 hover:bg-gray-50 font-semibold py-4 px-8 rounded-lg inline-flex items-center transition-colors duration-200">
            <Activity className="w-5 h-5 mr-2" />
            Ücretsiz Analiz Yap
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-12 bg-white rounded-2xl shadow-lg">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            KOAH Hakkında
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Kronik Obstrüktif Akciğer Hastalığı (KOAH), dünya genelinde milyonlarca insanı etkileyen 
            ciddi bir solunum hastalığıdır. Erken teşhis ve tedavi, hastalığın ilerlemesini yavaşlatmak 
            ve yaşam kalitesini korumak için kritik öneme sahiptir.
          </p>
          <Link to="/health-info" className="btn-primary inline-flex items-center">
            <Info className="w-5 h-5 mr-2" />
            Detaylı Bilgi Al
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home; 