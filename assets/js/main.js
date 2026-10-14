/**
 * CANİKOĞLU & TOPÇU MİMARLIK
 * İNŞ. TİC. TURZM. KENTSEL DÖNÜŞÜM LTD. ŞTİ.
 * Ana JavaScript Dosyası (main.js)
 * Hesaplama Motoru (B 3 Sınıfı Proje: 33.900 TL/m²), Şantiye Portföyü ve Sosyal Destekler
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

  // 2. İNTERAKTİF MALİYET & YARISI BİZDEN DEVLET DESTEĞİ HESAPLAMA MOTORU
  // Müşteri Talimatı: "B 3 sınıfı proje için Maliyet 33.900 TL" (Çevre ve Şehircilik Bakanlığı III. Sınıf B Grubu Standartları)
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
  const resB3UnitCost = document.getElementById('resB3UnitCost');

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

    // B 3 Sınıfı Yapı (III. Sınıf B Grubu Konut) Resmi Kentsel Dönüşüm Taban Maliyeti: 33.900 TL/m²
    const baseCostPerM2 = 33900;
    const currentM2Cost = baseCostPerM2 * typeMultiplier;
    let estimatedTotalCost = area * currentM2Cost;

    if (resB3UnitCost) {
      resB3UnitCost.textContent = formatMoney(currentM2Cost) + " / m²";
    }

    // "Yarısı Bizden" Kampanyası Resmi Destek Tutarları (2026/2027)
    // Daire başı: 875.000 TL Hibe (Geri Ödemesiz) + 875.000 TL Kredi (Düşük Faizli) = 1.750.000 TL
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
        formNote.value = `Hesaplama Aracı Verisi: ${area} m² B 3 Sınıfı proje (33.900 TL/m² tabanlı), ${units} daire için Yarısı Bizden destekli kentsel dönüşüm keşif ve teklifi talep ediyorum.`;
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

  // Müşterinin Bildirdiği Gerçek Proje ve Şantiye Verileri
  const projectDetails = {
    'proje-1': {
      title: 'Esenyurt Kentsel Dönüşüm & Rezidans Blokları',
      location: 'İstanbul / Esenyurt',
      image: 'assets/images/projects/proje-1-konut-bloklari.jpg',
      badge: 'Kule Vinç & Betonarme Kaba Yapı',
      badgeClass: 'status-ongoing',
      scope: 'Esenyurt bölgesinde kentsel dönüşüm kapsamında riskli binaların yıkılarak yerine kule vinçler, C35/40 dayanımlı betonarme ve radye temel ile inşa edilen çok katlı modern konut projesi.',
      specs: [
        { label: 'Lokasyon', val: 'Esenyurt / İstanbul' },
        { label: 'Yapı Sınıfı', val: 'B 3 Sınıfı Betonarme' },
        { label: 'Donatı', val: 'Kule Vinç & Tünel Kalıp' },
        { label: 'Sosyal Alan', val: 'Kapalı Otopark & Peyzaj' }
      ]
    },
    'proje-2': {
      title: 'Marmara Vizyon Şantiye Sahası & Kaba Yapı',
      location: 'İstanbul / Güngören - Bahçelievler',
      image: 'assets/images/projects/proje-2-santiye-kaba-yapi.jpg',
      badge: 'Şantiye Kaba İmalat Aşaması',
      badgeClass: 'status-ongoing',
      scope: 'Ada bazlı kentsel dönüşüm taahhüdümüz kapsamında zemin iyileştirmesi, ağır iş makineleri (Daewoo ekskavatör, vinçler) ve yüksek güvenlik standartlarında devam eden şantiye sahamız.',
      specs: [
        { label: 'Proje Tipi', val: 'Kentsel Dönüşüm Taahhüt' },
        { label: 'Makine Parkı', val: 'Daewoo Ekskavatör & Vinçler' },
        { label: 'Beton Sınıfı', val: 'C35/40 Hazır Beton & B420C' },
        { label: 'Teslim Modeli', val: 'A\'dan Z\'ye Anahtar Teslim' }
      ]
    },
    'proje-3': {
      title: 'Kartal Kız Öğrenci Yurdu Binası',
      location: 'İstanbul / Kartal',
      image: 'assets/images/projects/proje-3-cephe-ve-ince-isler.jpg',
      badge: 'Giriş Alüminyum Doğrama & İnce İşler',
      badgeClass: 'status-inspection',
      scope: 'Kartal Kız Yurdu Binası projesinde; bina giriş alüminyum doğramaları, iskele üzeri A1 sınıfı taşyünü ısı ve ses mantolaması, kompozit cephe ve lüks iç ince işçilik imalatları.',
      specs: [
        { label: 'Proje Adı', val: 'Kartal Kız Yurdu Binası' },
        { label: 'Cephe İmalatı', val: 'Giriş Alüminyum Doğrama' },
        { label: 'Yalıtım', val: '150 kg/m³ A1 Taşyünü Mantolama' },
        { label: 'Durum', val: 'İnce İşçilik & Teslim Aşaması' }
      ]
    },
    'proje-4': {
      title: 'Cerrahpaşa Tıp Fakültesi Hastane Çelik Yapı Projesi',
      location: 'İstanbul / Fatih - Cerrahpaşa',
      image: 'assets/images/projects/proje-4-celik-konstruksiyon.jpg',
      badge: 'Hastanede Başarıyla Teslim Edildi',
      badgeClass: 'status-completed',
      scope: 'Cerrahpaşa Hastanesi projesinde; deprem ve yangın güvenlik yönetmeliklerine %100 uyumlu ağır yapısal çelik taşıyıcı bina, acil çıkış ve yangın kaçış merdiveni imalatı.',
      specs: [
        { label: 'Sağlık Kurumu', val: 'Cerrahpaşa Hastanesi' },
        { label: 'Yapı Sistemi', val: 'Ağır Yapısal Çelik İskelet' },
        { label: 'İmalat Kapsamı', val: 'Yangın Güvenlik Merdiveni & Katlar' },
        { label: 'Kalite Testi', val: 'Galvaniz Kaplama & Röntgen Testi' }
      ]
    },
    'proje-5': {
      title: 'Başakşehir 17.000 Kişilik Stadyum & Spor Kompleksi',
      location: 'İstanbul / Başakşehir',
      image: 'assets/images/projects/proje-5-tribun-stadyum-yapi.jpg',
      badge: '17.000 Kişilik Kapasite — Tamamlandı',
      badgeClass: 'status-completed',
      scope: 'Başakşehir 17.000 kişilik stadyum projesinde; özel statik mühendislik çözümü gerektiren 72 metre açıklıklı çelik uzay kafes çatı sistemi, prekast betonarme tribün basamakları ve çevre altyapı işleri.',
      specs: [
        { label: 'Kapasite', val: '17.000 Kişilik Stadyum' },
        { label: 'Lokasyon', val: 'Başakşehir / İstanbul' },
        { label: 'Çatı Sistemi', val: '72 Metre Çelik Uzay Kafes' },
        { label: 'Tribün', val: 'Prekast Betonarme İmalat' }
      ]
    },
    'proje-6': {
      title: 'Zeytinburnu Vadi Rezidans Derin Kazı, Fore Kazık & İksa',
      location: 'İstanbul / Zeytinburnu - Kazlıçeşme',
      image: 'assets/images/projects/proje-6-derin-kazi-iksa-hafriyat.jpg',
      badge: 'Zemin İksa & Kazık Tamamlandı',
      badgeClass: 'status-completed',
      scope: 'Çevre binaların güvenliğini sıfır risk prensibiyle koruyan -18 metre derin hafriyat kazısı, 320 adet donatılı fore kazık, öngermeli ankraj iksa perdeleri ve zemin güçlendirme çalışmaları.',
      specs: [
        { label: 'Kazı Derinliği', val: '-18 Metre Derin Hafriyat' },
        { label: 'Fore Kazık', val: '320 Adet Donatılı Kazık' },
        { label: 'İksa Sistemi', val: 'Öngermeli Ankraj Perdeleri' },
        { label: 'Makine Parkı', val: 'Daewoo 340 LCV & Ağır İksa' }
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
      const isSehitGazi = document.getElementById('formSehitGazi') ? document.getElementById('formSehitGazi').checked : false;
      const isLowIncome = document.getElementById('formLowIncome') ? document.getElementById('formLowIncome').checked : false;
      const notes = document.getElementById('formMessage').value.trim();

      if (!name || !phone) {
        alert('Lütfen adınızı ve telefon numaranızı eksiksiz doldurunuz.');
        return;
      }

      // WhatsApp mesaj şablonu oluştur
      let waMessage = `Merhaba Canikoğlu & Topçu Mimarlık,\n\nKentsel Dönüşüm / Mimari İnşaat Hizmeti için teklif ve ücretsiz keşif almak istiyorum:\n`;
      waMessage += `👤 *Ad Soyad:* ${name}\n`;
      waMessage += `📞 *Telefon:* ${phone}\n`;
      waMessage += `📍 *İlçe/Lokasyon:* ${district}\n`;
      waMessage += `🏗️ *Talep Türü:* ${service}\n`;
      if (m2) waMessage += `📐 *Tahmini Alan:* ${m2} m² (B 3 Sınıfı Proje)\n`;
      if (units) waMessage += `🏢 *Daire/Bölüm Sayısı:* ${units}\n`;
      if (isSehitGazi) waMessage += `🎖️ *Özel Durum:* Şehit / Gazi Ailesi (Ücretsiz Dönüşüm & Tam Kira Talebi)\n`;
      if (isLowIncome) waMessage += `💼 *Gelir Durumu:* 30.000 TL altı hane geliri (Tam Kira Desteği Talebi)\n`;
      if (notes) waMessage += `📝 *Notlar:* ${notes}\n`;
      waMessage += `\nTaşınma masraflarının firmanızca üstlenilmesi ve Yarısı Bizden devlet desteğiyle ilgili görüşmek rica olunur.`;

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

  // 5. ÇEREZ BİLDİRİMİ
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

  console.log('Canikoğlu & Topçu Mimarlık web platformu başarıyla yüklendi.');
});
