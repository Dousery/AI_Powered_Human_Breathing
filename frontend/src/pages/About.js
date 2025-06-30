import React from 'react';
import { Heart, Code, Database, Brain, Shield, Users, Award } from 'lucide-react';

const About = () => {
  const features = [
    {
      icon: Brain,
      title: 'Yapay Zeka Teknolojisi',
      description: 'Gelişmiş makine öğrenmesi algoritmaları ile yüksek doğruluk oranında tahminleme.',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      icon: Database,
      title: 'Kapsamlı Veri Analizi',
      description: 'Nefes ve ses sensörü verilerinden 17 farklı özellik analizi.',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      icon: Shield,
      title: 'Güvenli Veri İşleme',
      description: 'Hasta verileriniz güvenle işlenir ve korunur.',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      icon: Users,
      title: 'Uzman Desteği',
      description: 'Sağlık profesyonelleri tarafından geliştirilmiş ve onaylanmış sistem.',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  const team = [
    {
      name: 'AI Geliştirme Ekibi',
      role: 'Makine Öğrenmesi & Veri Analizi',
      description: 'Yapay zeka algoritmaları ve veri işleme konularında uzman ekip.'
    },
    {
      name: 'Sağlık Uzmanları',
      role: 'Tıbbi Danışmanlık',
      description: 'Göğüs hastalıkları uzmanları ve sağlık profesyonelleri.'
    },
    {
      name: 'Yazılım Geliştiriciler',
      role: 'Sistem Geliştirme',
      description: 'Modern web teknolojileri ile kullanıcı dostu arayüz geliştirme.'
    }
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
      category: 'Veri İşleme',
      items: ['Pandas', 'Joblib', 'Signal Analysis', 'Audio Processing']
    }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-16">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Hakkımızda</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          KOAH AI, yapay zeka teknolojisi ile KOAH hastalığının erken teşhisini 
          kolaylaştırmak amacıyla geliştirilmiş yenilikçi bir sağlık uygulamasıdır.
        </p>
      </div>

      {/* Mission & Vision */}
      <div className="grid md:grid-cols-2 gap-8">
        <div className="card">
          <div className="flex items-center mb-4">
            <Heart className="w-8 h-8 text-red-500 mr-3" />
            <h2 className="text-2xl font-semibold text-gray-900">Misyonumuz</h2>
          </div>
          <p className="text-gray-600 leading-relaxed">
            KOAH hastalığının erken teşhisini kolaylaştırarak, hastaların yaşam kalitesini 
            artırmak ve hastalığın ilerlemesini yavaşlatmak için yapay zeka destekli 
            çözümler sunmak. Herkesin erişebileceği, güvenilir ve kullanıcı dostu 
            sağlık teknolojileri geliştirmek.
          </p>
        </div>

        <div className="card">
          <div className="flex items-center mb-4">
            <Award className="w-8 h-8 text-blue-500 mr-3" />
            <h2 className="text-2xl font-semibold text-gray-900">Vizyonumuz</h2>
          </div>
          <p className="text-gray-600 leading-relaxed">
            Sağlık teknolojileri alanında öncü olmak ve yapay zeka destekli 
            teşhis sistemlerini yaygınlaştırmak. KOAH ve benzeri solunum 
            hastalıklarının erken teşhisinde standart haline gelmek ve 
            global sağlık hizmetlerine katkıda bulunmak.
          </p>
        </div>
      </div>

      {/* Features */}
      <div>
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Sistem Özellikleri
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

      {/* Technology Stack */}
      <div className="card">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Teknoloji Altyapısı
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
          Geliştirme Ekibi
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {team.map((member, index) => (
            <div key={index} className="card text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Users className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{member.name}</h3>
              <p className="text-blue-600 font-medium mb-3">{member.role}</p>
              <p className="text-gray-600">{member.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Model Information */}
      <div className="card bg-gradient-to-r from-blue-50 to-cyan-50">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          AI Model Bilgileri
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Model Özellikleri</h3>
            <ul className="space-y-3 text-gray-600">
              <li>• <strong>Model Tipi:</strong> Ensemble Model</li>
              <li>• <strong>Özellik Sayısı:</strong> 17 seçili özellik</li>
              <li>• <strong>Sınıf Sayısı:</strong> 3 (Normal, Orta Risk, Yüksek Risk)</li>
              <li>• <strong>Doğruluk Oranı:</strong> Yüksek performans</li>
              <li>• <strong>Analiz Süresi:</strong> 30 saniyeden az</li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Analiz Edilen Veriler</h3>
            <ul className="space-y-3 text-gray-600">
              <li>• <strong>Nefes Sensörü Verisi:</strong> Solunum gücü ve paterni</li>
              <li>• <strong>Ses Sensörü Verisi:</strong> Solunum sesleri analizi</li>
              <li>• <strong>Hasta Bilgileri:</strong> Yaş, sigara durumu, vb.</li>
              <li>• <strong>Sinyal İşleme:</strong> FFT, MFCC, istatistiksel özellikler</li>
              <li>• <strong>Makine Öğrenmesi:</strong> Özellik seçimi ve sınıflandırma</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Contact & Support */}
      <div className="card">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          İletişim ve Destek
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="text-center">
            <Code className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Teknik Destek</h3>
            <p className="text-gray-600">
              Sistem kullanımı ve teknik sorunlar için destek alabilirsiniz.
            </p>
          </div>
          <div className="text-center">
            <Heart className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Sağlık Danışmanlığı</h3>
            <p className="text-gray-600">
              KOAH hakkında bilgi ve sağlık önerileri için danışmanlık hizmeti.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-8">
        <p className="text-gray-600 mb-4">
          KOAH AI - Yapay Zeka Destekli Sağlık Teknolojisi
        </p>
        <p className="text-sm text-gray-500">
          © 2024 Tüm hakları saklıdır. Bu uygulama tıbbi teşhis yerine geçmez.
        </p>
      </div>
    </div>
  );
};

export default About; 