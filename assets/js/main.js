/**
 * CANİKOĞLU İNŞAAT & KENTSEL DÖNÜŞÜM
 * Ana JavaScript Dosyası (main.js)
 * Hesaplama Motoru, Proje Filtresi, Lightbox ve Form Entegrasyonları
 */

document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  // 1. NAVBAR SCROLL EFEKTİ & AKTİF MENÜ TAKİBİ
  const navbar = document.querySelector('.main-navbar');
  const navLinks = document.querySelectorAll('.nav-link-custom');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', function () {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Aktif bölümü menüde işaretle
    let currentScroll = window.pageYOffset + 120;
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (currentScroll >= sectionTop && currentScroll < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + sectionId) {
            link.classList.add('active');
          }
        });
      }
    });
  });

  // Mobil Menü Kapatma (Bağlantıya tıklandığında)
  const navCollapse = document.getElementById('navbarCanikContent');
  if (navCollapse) {
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth < 992 && navCollapse.classList.contains('show')) {
          const bsCollapse = bootstrap.Collapse.getInstance(navCollapse);
          if (bsCollapse) bsCollapse.hide();
        }
      });
    });
  }

  const calcAreaInput = document.getElementById('calcArea');
  const calcAreaRange = document.getElementById('calcAreaRange');
  const calcAreaDisplay = document.getElementById('calcAreaDisplay');
  const calcUnitsInput = document.getElementById('calcUnits');
  const calcTypeSelect = document.getElementById('calcType');

  const resTotalCost = document.getElementById('resTotalCost');
  const resTotalHibe = document.getElementById('resTotalHibe');
  const resTotalKredi = document.getElementById('resTotalKredi');
  const resTotalSupport = document.getElementById('resTotalSupport');
  const resNetUnitCost = document.getElementById('resNetUnitCost');

  // Sayı formatlayıcı (TL)
  function formatMoney(amount) {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      maximumFractionDigits: 0
    }).format(amount);
  }

  function calculateCosts() {
    if (!calcAreaInput || !calcUnitsInput) return;

    let area = parseFloat(calcAreaInput.value) || 0;
    let units = parseInt(calcUnitsInput.value) || 1;
    let typeMultiplier = parseFloat(calcTypeSelect ? calcTypeSelect.value : 1.0);

    if (calcAreaDisplay) {
      calcAreaDisplay.textContent = new Intl.NumberFormat('tr-TR').format(area);
    }

    // 2026-2027 Çevre ve Şehircilik Bakanlığı standartlarında yaklaşık lüks C35/40 radye temel m² inşaat birim maliyeti
    const baseCostPerM2 = 25000; 
    let estimatedTotalCost = area * baseCostPerM2 * typeMultiplier;

    // "Yarısı Bizden" Kampanyası Resmi Destek Tutarları (2026/2027)
    // Daire başı: 875.000 TL Hibe (Geri Ödemesiz) + 875.000 TL Kredi (Düşük Faizli)
    const hibePerUnit = 875000;
    const krediPerUnit = 875000;

    let totalHibe = units * hibePerUnit;
    let totalKredi = units * krediPerUnit;
    let totalSupport = totalHibe + totalKredi;

    // Daire başı düşen kalan net maliyet (Varsa)
    let netRemainingTotal = Math.max(0, estimatedTotalCost - totalHibe);
    let netCostPerUnit = units > 0 ? (netRemainingTotal / units) : 0;

    // Ekran değerlerini güncelle
    if (resTotalCost) resTotalCost.textContent = formatMoney(estimatedTotalCost);
    if (resTotalHibe) resTotalHibe.textContent = formatMoney(totalHibe);
    if (resTotalKredi) resTotalKredi.textContent = formatMoney(totalKredi);
    if (resTotalSupport) resTotalSupport.textContent = formatMoney(totalSupport);
    if (resNetUnitCost) resNetUnitCost.textContent = formatMoney(netCostPerUnit);
  }

  // Hesaplama girdisi senkronizasyonu
  if (calcAreaInput && calcAreaRange) {
    calcAreaRange.addEventListener('input', function () {
      calcAreaInput.value = this.value;
      calculateCosts();
    });

    calcAreaInput.addEventListener('input', function () {
      calcAreaRange.value = this.value;
      calculateCosts();
    });
  }

  if (calcUnitsInput) calcUnitsInput.addEventListener('input', calculateCosts);
  if (calcTypeSelect) calcTypeSelect.addEventListener('change', calculateCosts);

  // Sayfa yüklendiğinde ilk hesaplamayı yap
  calculateCosts();

  // Hesaplama sonucunu başvuru formuna aktarma butonu
  const btnTransferCalc = document.getElementById('btnTransferCalc');
  if (btnTransferCalc) {
    btnTransferCalc.addEventListener('click', function () {
      const area = calcAreaInput ? calcAreaInput.value : '';
      const units = calcUnitsInput ? calcUnitsInput.value : '';
      
      const formArea = document.getElementById('formM2');
      const formUnits = document.getElementById('formUnits');
      const formNote = document.getElementById('formMessage');

      if (formArea) formArea.value = area;
      if (formUnits) formUnits.value = units;
      if (formNote) {
        formNote.value = `Hesaplama Aracı Verisi: ${area} m² inşaat alanı, ${units} bağımsız bölüm için Yarısı Bizden destekli kentsel dönüşüm keşif ve teklifi talep ediyorum.`;
      }

      // Başvuru modalını veya bölümünü aç/odakla
      const contactSection = document.getElementById('iletisim');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // 3. PROJE FİLTRELEME & LIGHTBOX DETAY MODALI
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectItems = document.querySelectorAll('.project-grid-item');

  filterButtons.forEach(button => {
    button.addEventListener('click', function () {
      filterButtons.forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');

      const filterVal = this.getAttribute('data-filter');

      projectItems.forEach(item => {
        if (filterVal === 'all' || item.getAttribute('data-category').includes(filterVal)) {
          item.style.display = 'block';
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
          }, 50);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'translateY(15px)';
          setTimeout(() => {
            item.style.display = 'none';
          }, 250);
        }
      });
    });
  });

  // Proje Detay & Lightbox Verileri
  const projectDetails = {
    'proje-1': {
      title: 'Canikoğlu Park Konutları - Kentsel Dönüşüm Projesi',
      location: 'İstanbul / Bağcılar - Güneşli',
      image: 'assets/images/projects/proje-1-konut-bloklari.jpg',
      badge: 'Kaba İnşaat Devam Ediyor (%65)',
      badgeClass: 'status-ongoing',
      scope: 'Depreme riskli 4 adet eski apartman bloğunun yıkılarak yerine C35/40 betonarme ve radye temel ile modern yaşam sitesi inşası.',
      specs: [
        { label: 'İnşaat Alanı', val: '14.500 m²' },
        { label: 'Bağımsız Bölüm', val: '124 Daire + 8 Ticari Dükkan' },
        { label: 'Yapı Sistemi', val: 'Radye Jeneral Temel + Tünel Kalıp' },
        { label: 'Sosyal Alan', val: '2 Kat Kapalı Otopark + Peyzaj & Park' }
      ]
    },
    'proje-2': {
      title: 'Marmara Vizyon Blokları - Anahtar Teslim Yapım',
      location: 'İstanbul / Bahçelievler - Güngören',
      image: 'assets/images/projects/proje-2-santiye-kaba-yapi.jpg',
      badge: 'Şantiye Kaba İmalat Aşaması',
      badgeClass: 'status-ongoing',
      scope: 'Ada bazlı kentsel dönüşüm taahhüt projesi. Zemin iyileştirme, ağır iş makineleri ve kule vinçlerle yüksek güvenlik standartlarında devam eden şantiye sahamız.',
      specs: [
        { label: 'İnşaat Alanı', val: '22.000 m²' },
        { label: 'Blok Sayısı', val: '4 Blok (Zemin + 12 Kat)' },
        { label: 'Beton Sınıfı', val: 'C35/40 Hazır Beton & B420C Çelik' },
        { label: 'Teslim Modeli', val: 'A\'dan Z\'ye Anahtar Teslim' }
      ]
    },
    'proje-3': {
      title: 'Modern Şehir Konutları - Dış Cephe & İnce İşçilik',
      location: 'İstanbul / Bakırköy - Kartaltepe',
      image: 'assets/images/projects/proje-3-cephe-ve-ince-isler.jpg',
      badge: 'İnce İşler & İskân Aşaması',
      badgeClass: 'status-inspection',
      scope: 'Tasarımından mimarisine Canikoğlu İnşaat imzası taşıyan projede A+ taşyünü cephe mantolaması, kompozit kaplama ve lüks iç dekorasyon imalatları.',
      specs: [
        { label: 'Toplam Daire', val: '48 Lüks Rezidans' },
        { label: 'Isı & Ses Yalıtımı', val: '150 kg/m³ Taşyünü A1 Yanmaz' },
        { label: 'Doğrama & Cam', val: 'Konfor Isıcamlı 76mm PVC Sistem' },
        { label: 'İç Mimari', val: 'Özel Tasarım Lake Mutfak & Banyo' }
      ]
    },
    'proje-4': {
      title: 'Endüstriyel Çelik Yapı & Yangın Güvenlik Merdiveni',
      location: 'Kocaeli / Gebze Organize Sanayi Bölgesi',
      image: 'assets/images/projects/proje-4-celik-konstruksiyon.jpg',
      badge: 'Başarıyla Teslim Edildi',
      badgeClass: 'status-completed',
      scope: 'Ağır sanayi tesisinde deprem ve yangın yönetmeliklerine %100 uyumlu, statik hesaplamaları mühendislerimizce yapılmış ağır çelik yangın kaçış merdiveni ve taşıyıcı konstrüksiyon imalatı.',
      specs: [
        { label: 'Çelik Ağırlığı', val: '45 Ton Yapısal Çelik (S275/S355)' },
        { label: 'Yükseklik', val: '24 Metre (6 Kat Çıkış)' },
        { label: 'Kaplama', val: 'Sıcak Daldırma Galvaniz + Epoksi Astar' },
        { label: 'Denetim', val: 'Röntgen & Ultrasonik Kaynak Testi' }
      ]
    },
    'proje-5': {
      title: 'Spor & Yaşam Kompleksi - Prekast Tribün & Çatı',
      location: 'İstanbul / Başakşehir',
      image: 'assets/images/projects/proje-5-tribun-stadyum-yapi.jpg',
      badge: 'Tamamlandı & Hizmete Açıldı',
      badgeClass: 'status-completed',
      scope: 'Özel statik mühendislik çözümü gerektiren geniş açıklıklı çelik uzay kafes çatı sistemi, prekast betonarme tribün basamakları ve çevre altyapı işleri.',
      specs: [
        { label: 'Kapasite', val: '12.500 Seyirci Kapasitesi' },
        { label: 'Çatı Konstrüksiyon', val: '72 Metre Açıklıklı Çelik Kafes Kiriş' },
        { label: 'Prekast İmalat', val: '3.400 Adet Yüksek Mukavemetli Eleman' },
        { label: 'Teslim Süresi', val: '14 Ayda Eksiksiz Teslim' }
      ]
    },
    'proje-6': {
      title: 'Vadi Rezidans - Derin Kazı, Fore Kazık & İksa Güçlendirme',
      location: 'İstanbul / Zeytinburnu - Kazlıçeşme',
      image: 'assets/images/projects/proje-6-derin-kazi-iksa-hafriyat.jpg',
      badge: 'Zemin İksa Tamamlandı',
      badgeClass: 'status-completed',
      scope: 'Sıfır risk prensibiyle çevre binaların güvenliğini sağlayan -18 metre derin hafriyat kazısı, donatılı fore kazıklar, öngermeli ankraj iksa perdeleri ve zemin drenaj sistemleri.',
      specs: [
        { label: 'Kazı Hacmi', val: '48.000 m³ Derin Hafriyat' },
        { label: 'Fore Kazık', val: '320 Adet (80cm Çap, 22m Derinlik)' },
        { label: 'Ankraj', val: '4 Kademeli Kendinden Delen Ankraj' },
        { label: 'Ekipman', val: 'Daewoo 340 LCV & Kule İksa Makineleri' }
      ]
    }
  };

  // Lightbox Modal Tetikleyicileri
  const projectModalElement = document.getElementById('projectDetailsModal');
  let bsProjectModal = null;
  if (projectModalElement) {
    bsProjectModal = new bootstrap.Modal(projectModalElement);
  }

  document.querySelectorAll('.open-project-modal').forEach(btn => {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      const projKey = this.getAttribute('data-project');
      const data = projectDetails[projKey];

      if (data && projectModalElement) {
        document.getElementById('modalProjTitle').textContent = data.title;
        document.getElementById('modalProjLoc').textContent = data.location;
        document.getElementById('modalProjImg').src = data.image;
        document.getElementById('modalProjScope').textContent = data.scope;

        const badgeElem = document.getElementById('modalProjBadge');
        badgeElem.textContent = data.badge;
        badgeElem.className = 'badge ' + data.badgeClass;

        // Teknik özellikler listesi
        const specsContainer = document.getElementById('modalProjSpecs');
        specsContainer.innerHTML = '';
        data.specs.forEach(s => {
          const col = document.createElement('div');
          col.className = 'col-6 mb-2';
          col.innerHTML = `
            <div class="p-2 border rounded bg-light">
              <small class="text-muted d-block">${s.label}</small>
              <strong class="text-dark">${s.val}</strong>
            </div>
          `;
          specsContainer.appendChild(col);
        });

        bsProjectModal.show();
      }
    });
  });

  // 4. BAŞVURU VE WHATSAPP DOĞRUDAN MESAJ ENTEGRASYONU
  const applicationForm = document.getElementById('canikApplicationForm');
  if (applicationForm) {
    applicationForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const name = document.getElementById('formName').value.trim();
      const phone = document.getElementById('formPhone').value.trim();
      const district = document.getElementById('formDistrict').value;
      const service = document.getElementById('formService').value;
      const m2 = document.getElementById('formM2').value.trim();
      const units = document.getElementById('formUnits').value.trim();
      const notes = document.getElementById('formMessage').value.trim();

      if (!name || !phone) {
        alert('Lütfen adınızı ve telefon numaranızı eksiksiz doldurunuz.');
        return;
      }

      // WhatsApp mesaj şablonu oluştur
      let waMessage = `Merhaba Canikoğlu İnşaat,\n\nKentsel Dönüşüm / İnşaat Hizmeti için teklif ve bilgi almak istiyorum:\n`;
      waMessage += `👤 *Ad Soyad:* ${name}\n`;
      waMessage += `📞 *Telefon:* ${phone}\n`;
      waMessage += `📍 *İlçe/Lokasyon:* ${district}\n`;
      waMessage += `🏗️ *Talep Türü:* ${service}\n`;
      if (m2) waMessage += `📐 *Tahmini Alan:* ${m2} m²\n`;
      if (units) waMessage += `🏢 *Daire/Bölüm Sayısı:* ${units}\n`;
      if (notes) waMessage += `📝 *Notlar:* ${notes}\n`;
      waMessage += `\nEn kısa sürede dönüşünüzü rica ederim.`;

      const encodedMsg = encodeURIComponent(waMessage);
      const waNumber = '905320000000'; // Firma iletişim numarası
      const waUrl = `https://wa.me/${waNumber}?text=${encodedMsg}`;

      // Kullanıcıya teşekkür bildirimi göster ve WhatsApp'a yönlendir
      const submitBtn = applicationForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<i class="fas fa-check-circle me-2"></i> Talebiniz Alındı! WhatsApp Açılıyor...';
      submitBtn.disabled = true;

      setTimeout(() => {
        window.open(waUrl, '_blank');
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        applicationForm.reset();
      }, 1000);
    });
  }

  // 5. ÇEREZ BİLDİRİMİ (Evveko Stili)
  const cookieBanner = document.getElementById('cookieConsentBanner');
  const btnAcceptCookie = document.getElementById('btnAcceptCookie');

  if (cookieBanner) {
    if (!localStorage.getItem('canik_cookie_accepted')) {
      setTimeout(() => {
        cookieBanner.style.display = 'block';
      }, 1500);
    }

    if (btnAcceptCookie) {
      btnAcceptCookie.addEventListener('click', function () {
        localStorage.setItem('canik_cookie_accepted', 'true');
        cookieBanner.style.display = 'none';
      });
    }
  }

  console.log('Canikoğlu İnşaat web platformu başarıyla yüklendi.');
});
