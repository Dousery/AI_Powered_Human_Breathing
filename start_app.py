#!/usr/bin/env python3
"""
KOAH AI Uygulaması Başlatma Scripti
Bu script hem backend hem de frontend'i başlatır.
"""

import subprocess
import sys
import os
import time
import webbrowser
from pathlib import Path

def check_requirements():
    """Gerekli araçların yüklü olup olmadığını kontrol eder"""
    print("🔍 Gerekli araçlar kontrol ediliyor...")
    
    # Python kontrolü
    if sys.version_info < (3, 8):
        print("❌ Python 3.8 veya üzeri gerekli!")
        return False
    
    # Node.js kontrolü
    try:
        result = subprocess.run(["node", "--version"], check=True, capture_output=True, text=True)
        print(f"✅ Node.js bulundu (v{result.stdout.strip()})")
    except (subprocess.CalledProcessError, FileNotFoundError):
        print("❌ Node.js bulunamadı! Lütfen Node.js'i yükleyin.")
        return False
    
    # npm kontrolü - Windows için daha güvenilir
    try:
        result = subprocess.run(["npm", "--version"], check=True, capture_output=True, text=True, shell=True)
        print(f"✅ npm bulundu (v{result.stdout.strip()})")
    except (subprocess.CalledProcessError, FileNotFoundError):
        print("❌ npm bulunamadı! Lütfen npm'i yükleyin.")
        return False
    
    return True

def setup_backend():
    """Backend'i kurar ve başlatır"""
    print("\n🐍 Backend kurulumu...")
    
    backend_dir = Path("backend")
    if not backend_dir.exists():
        print("❌ Backend klasörü bulunamadı!")
        return None
    
    # Sanal ortam kontrolü
    venv_dir = backend_dir / "venv"
    if not venv_dir.exists():
        print("📦 Python sanal ortamı oluşturuluyor...")
        subprocess.run([sys.executable, "-m", "venv", "venv"], cwd=backend_dir)
    
    # Sanal ortamı aktifleştir
    if os.name == 'nt':  # Windows
        python_path = venv_dir / "Scripts" / "python.exe"
        pip_path = venv_dir / "Scripts" / "pip.exe"
    else:  # Linux/Mac
        python_path = venv_dir / "bin" / "python"
        pip_path = venv_dir / "bin" / "pip"
    
    # Bağımlılıkları yükle
    print("📦 Python bağımlılıkları yükleniyor...")
    subprocess.run([str(pip_path), "install", "-r", "requirements.txt"], cwd=backend_dir)
    
    # Backend'i başlat
    print("🚀 Backend başlatılıyor...")
    backend_process = subprocess.Popen([str(python_path), "main.py"], cwd=backend_dir)
    
    return backend_process

def setup_frontend():
    """Frontend'i kurar ve başlatır"""
    print("\n⚛️ Frontend kurulumu...")
    
    frontend_dir = Path("frontend")
    if not frontend_dir.exists():
        print("❌ Frontend klasörü bulunamadı!")
        return None
    
    # node_modules kontrolü
    node_modules = frontend_dir / "node_modules"
    if not node_modules.exists():
        print("📦 Node.js bağımlılıkları yükleniyor...")
        subprocess.run(["npm", "install"], cwd=frontend_dir, shell=True)
    
    # Frontend'i başlat
    print("🚀 Frontend başlatılıyor...")
    frontend_process = subprocess.Popen(["npm", "start"], cwd=frontend_dir, shell=True)
    
    return frontend_process

def main():
    """Ana fonksiyon"""
    print("🏥 KOAH AI Uygulaması Başlatılıyor...")
    print("=" * 50)
    
    # Gereksinimleri kontrol et
    if not check_requirements():
        print("\n❌ Gerekli araçlar eksik! Lütfen yükleyin.")
        return
    
    processes = []
    
    try:
        # Backend'i başlat
        backend_process = setup_backend()
        if backend_process:
            processes.append(backend_process)
            print("✅ Backend başlatıldı (http://localhost:8000)")
        
        # Frontend'i başlat
        frontend_process = setup_frontend()
        if frontend_process:
            processes.append(frontend_process)
            print("✅ Frontend başlatıldı (http://localhost:3000)")
        
        if processes:
            print("\n🎉 Uygulama başarıyla başlatıldı!")
            print("\n📱 Erişim adresleri:")
            print("   Frontend: http://localhost:3000")
            print("   Backend API: http://localhost:8000")
            print("   API Dokümantasyonu: http://localhost:8000/docs")
            
            # Tarayıcıda aç
            time.sleep(3)
            print("\n🌐 Tarayıcıda açılıyor...")
            webbrowser.open("http://localhost:3000")
            
            print("\n⏹️ Uygulamayı durdurmak için Ctrl+C tuşlayın...")
            
            # Sürekli çalış
            while True:
                time.sleep(1)
                
    except KeyboardInterrupt:
        print("\n\n🛑 Uygulama durduruluyor...")
        
    except Exception as e:
        print(f"\n❌ Hata oluştu: {e}")
        
    finally:
        # Tüm process'leri durdur
        for process in processes:
            try:
                process.terminate()
                process.wait(timeout=5)
            except:
                process.kill()
        
        print("✅ Uygulama durduruldu.")

if __name__ == "__main__":
    main() 