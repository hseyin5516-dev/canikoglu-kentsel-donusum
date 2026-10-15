/**
 * CANİKOĞLU & TOPÇU MİMARLIK
 * Main JavaScript Application
 */

document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. Sticky Header
       ========================================================================== */
    const siteHeader = document.querySelector('.site-header');
    const handleScroll = () => {
        if (window.scrollY > 80) {
            siteHeader.classList.add('is-sticky');
        } else {
            siteHeader.classList.remove('is-sticky');
        }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    /* ==========================================================================
       2. Mobile Navigation Toggle
       ========================================================================== */
    const navToggle = document.querySelector('.site-navigation__toggle');
    const navMenu = document.querySelector('.site-navigation__menu');
    const navOverlay = document.querySelector('.site-navigation__overlay');
    const menuLinks = document.querySelectorAll('.site-navigation__menu a');

    const toggleMenu = () => {
        const isActive = navMenu.classList.contains('is-active');
        if (isActive) {
            navMenu.classList.remove('is-active');
            navOverlay.classList.remove('is-active');
            navToggle.classList.remove('is-active');
            document.body.style.overflow = '';
        } else {
            navMenu.classList.add('is-active');
            navOverlay.classList.add('is-active');
            navToggle.classList.add('is-active');
            document.body.style.overflow = 'hidden';
        }
    };

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', toggleMenu);
        navOverlay.addEventListener('click', toggleMenu);
        menuLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (navMenu.classList.contains('is-active')) {
                    toggleMenu();
                }
            });
        });
    }

    /* ==========================================================================
       3. Hero Slider
       ========================================================================== */
    const heroSlides = document.querySelectorAll('.hero-slider__slide');
    const heroDots = document.querySelectorAll('.hero-slider__dot');
    const heroPrev = document.querySelector('.hero-slider__nav--prev');
    const heroNext = document.querySelector('.hero-slider__nav--next');
    let currentSlide = 0;
    let heroInterval = null;

    const showSlide = (index) => {
        heroSlides.forEach((slide, i) => {
            slide.classList.remove('active');
            if (heroDots[i]) heroDots[i].classList.remove('active');
        });
        currentSlide = (index + heroSlides.length) % heroSlides.length;
        heroSlides[currentSlide].classList.add('active');
        if (heroDots[currentSlide]) heroDots[currentSlide].classList.add('active');
    };

    const nextSlide = () => showSlide(currentSlide + 1);
    const prevSlide = () => showSlide(currentSlide - 1);

    const startHeroAutoplay = () => {
        stopHeroAutoplay();
        heroInterval = setInterval(nextSlide, 7000);
    };

    const stopHeroAutoplay = () => {
        if (heroInterval) clearInterval(heroInterval);
    };

    if (heroSlides.length > 0) {
        if (heroNext) {
            heroNext.addEventListener('click', () => {
                nextSlide();
                startHeroAutoplay();
            });
        }
        if (heroPrev) {
            heroPrev.addEventListener('click', () => {
                prevSlide();
                startHeroAutoplay();
            });
        }
        heroDots.forEach((dot, idx) => {
            dot.addEventListener('click', () => {
                showSlide(idx);
                startHeroAutoplay();
            });
        });

        // Touch swipe support for Hero
        const heroSlider = document.querySelector('.hero-slider');
        let touchStartX = 0;
        let touchEndX = 0;
        if (heroSlider) {
            heroSlider.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
                stopHeroAutoplay();
            }, { passive: true });
            heroSlider.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].screenX;
                if (touchStartX - touchEndX > 50) nextSlide();
                if (touchEndX - touchStartX > 50) prevSlide();
                startHeroAutoplay();
            }, { passive: true });
        }

        startHeroAutoplay();
    }

    /* ==========================================================================
       4. Tamamlanan Projeler Slider
       ========================================================================== */
    const projTrack = document.getElementById('projelerTrack');
    const projPrev = document.getElementById('projPrev');
    const projNext = document.getElementById('projNext');
    const projSlides = document.querySelectorAll('.home-projeler__slide');
    let projCurrent = 0;

    const updateProjSlider = () => {
        if (!projTrack || projSlides.length === 0) return;
        const slideWidth = projSlides[0].offsetWidth + 30; // slide width + gap
        projTrack.style.transform = `translateX(-${projCurrent * slideWidth}px)`;

        projSlides.forEach((slide, idx) => {
            if (idx === projCurrent) {
                slide.classList.add('active');
            } else {
                slide.classList.remove('active');
            }
        });
    };

    if (projNext && projPrev && projTrack) {
        projNext.addEventListener('click', () => {
            if (projCurrent < projSlides.length - 1) {
                projCurrent++;
            } else {
                projCurrent = 0;
            }
            updateProjSlider();
        });

        projPrev.addEventListener('click', () => {
            if (projCurrent > 0) {
                projCurrent--;
            } else {
                projCurrent = projSlides.length - 1;
            }
            updateProjSlider();
        });

        window.addEventListener('resize', updateProjSlider);
        updateProjSlider();
    }

    /* ==========================================================================
       5. Kentsel Dönüşüm & B 3 Sınıfı İnteraktif Hesaplayıcı
       ========================================================================== */
    const B3_TABAN_BIRIM_FIYAT = 33900; // TL/m²
    const DEVLET_DESTEGI_BIRIM = 1750000; // 875.000 Hibe + 875.000 Kredi

    const inputAlan = document.getElementById('calcAlan');
    const inputDaire = document.getElementById('calcDaire');
    const checkDevlet = document.getElementById('calcDevlet');
    const checkSehit = document.getElementById('calcSehit');
    const checkGelir = document.getElementById('calcGelir');

    const resToplamMaliyet = document.getElementById('resToplamMaliyet');
    const resDevletDestegi = document.getElementById('resDevletDestegi');
    const resNetDaireMaliyeti = document.getElementById('resNetDaireMaliyeti');
    const calcWhatsAppBtn = document.getElementById('calcWhatsAppBtn');

    const formatCurrency = (val) => {
        return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(val);
    };

    const calculateCost = () => {
        if (!inputAlan || !inputDaire) return;

        let alan = parseFloat(inputAlan.value) || 0;
        let daireSayisi = parseInt(inputDaire.value) || 1;
        if (daireSayisi < 1) daireSayisi = 1;

        // Toplam İnşaat Bedeli
        let toplamMaliyet = alan * B3_TABAN_BIRIM_FIYAT;

        // Devlet Desteği
        let toplamDestek = 0;
        if (checkDevlet && checkDevlet.checked) {
            toplamDestek = daireSayisi * DEVLET_DESTEGI_BIRIM;
            if (toplamDestek > toplamMaliyet) toplamDestek = toplamMaliyet;
        }

        // Şehit ve Gazi Ailesi Muafiyeti (%100 Ücretsiz)
        let isSehitGazi = checkSehit && checkSehit.checked;
        let isDarGelir = checkGelir && checkGelir.checked;

        let netToplam = toplamMaliyet - toplamDestek;
        if (isSehitGazi) {
            netToplam = 0;
            toplamDestek = toplamMaliyet;
        }

        let daireBasiNet = isSehitGazi ? 0 : (netToplam / daireSayisi);

        // Display results
        if (resToplamMaliyet) resToplamMaliyet.textContent = formatCurrency(toplamMaliyet);
        if (resDevletDestegi) {
            if (isSehitGazi) {
                resDevletDestegi.textContent = "%100 Ücretsiz (Şehit/Gazi Muafiyeti)";
            } else {
                resDevletDestegi.textContent = formatCurrency(toplamDestek);
            }
        }
        if (resNetDaireMaliyeti) {
            if (isSehitGazi) {
                resNetDaireMaliyeti.textContent = "0 ₺ (Ücretsiz)";
            } else {
                resNetDaireMaliyeti.textContent = formatCurrency(daireBasiNet);
            }
        }

        // Update WhatsApp CTA Message
        if (calcWhatsAppBtn) {
            let msg = `Merhaba Canikoğlu & Topçu Mimarlık, Kentsel Dönüşüm B3 projemiz için hesaplama yaptık:\n` +
                `- Toplam Alan: ${alan} m²\n` +
                `- Daire Sayısı: ${daireSayisi}\n` +
                `- Yarısı Bizden Desteği: ${checkDevlet.checked ? 'Evet' : 'Hayır'}\n` +
                `- Şehit/Gazi Ailesi: ${isSehitGazi ? 'Evet (%100 Ücretsiz)' : 'Hayır'}\n` +
                `- Dar Gelir Kira Desteği: ${isDarGelir ? 'Talep Ediliyor' : 'Hayır'}\n` +
                `- Tahmini Daire Başı Net: ${isSehitGazi ? '0 ₺' : formatCurrency(daireBasiNet)}\n\n` +
                `Detaylı yerinde keşif ve mimari inceleme için randevu rica ederiz.`;
            calcWhatsAppBtn.href = `https://wa.me/905320000000?text=${encodeURIComponent(msg)}`;
        }
    };

    [inputAlan, inputDaire, checkDevlet, checkSehit, checkGelir].forEach(el => {
        if (el) {
            el.addEventListener('input', calculateCost);
            el.addEventListener('change', calculateCost);
        }
    });
    calculateCost();

    /* ==========================================================================
       6. Proje Detay Modal Penceresi
       ========================================================================== */
    const projectData = {
        'kartal-yurt': {
            title: 'Kartal Kız Öğrenci Yurdu Binası',
            badge: 'Tamamlanan Proje',
            img: 'assets/images/proje-kartal-yurt.jpeg',
            desc: 'A1 Sınıfı taşyünü yangın yalıtımlı modern cephe kaplama sistemleri, alüminyum giydirme doğramalar, yangın kaçış koridorları ve anahtar teslim mimari ince işler.',
            specs: {
                'Konum': 'Kartal, İstanbul',
                'Kapsam': 'A1 Cephe & İnce İnşaat',
                'Yapı Tipi': 'Eğitim & Yurt Kompleksi'
            }
        },
        'cerrahpasa-hastane': {
            title: 'Cerrahpaşa Tıp Fakültesi Hastane Çelik Yapı Projesi',
            badge: 'Tamamlanan Proje',
            img: 'assets/images/proje-cerrahpasa-hastane.jpeg',
            desc: 'Ağır yapısal çelik iskelet, sismik izolatör uyumlu taşıyıcı sistem, yangın merdivenleri ve medikal teknoloji altyapısına uygun yüksek güvenlikli mühendislik projesi.',
            specs: {
                'Konum': 'Fatih, İstanbul',
                'Kapsam': 'Ağır Yapısal Çelik',
                'Yapı Tipi': 'Sağlık / Hastane Yapısı'
            }
        },
        'basaksehir-stadyum': {
            title: 'Başakşehir 17.000 Kişilik Stadyum & Spor Kompleksi',
            badge: 'Tamamlanan Proje',
            img: 'assets/images/proje-basaksehir-stadyum.jpeg',
            desc: 'Prekast betonarme tribün elemanları montajı, 72 metrelik uzay çatı çelik konstrüksiyonu, VIP loca mimarisi ve altyapı mühendisliği taahhüdü.',
            specs: {
                'Konum': 'Başakşehir, İstanbul',
                'Kapsam': 'Prekast Betonarme & Uzay Çatı',
                'Yapı Tipi': 'Spor & Stadyum Kompleksi'
            }
        },
        'zeytinburnu-iksa': {
            title: 'Zeytinburnu Vadi Rezidans Derin Kazı & İksa Projesi',
            badge: 'Tamamlanan Proje',
            img: 'assets/images/proje-zeytinburnu-iksa.jpeg',
            desc: '-18 metre derin kazı emniyeti, 320 adet donatılı fore kazık, zemin ankrajı ve yeraltı su tablası drenaj sistemleriyle sismik açıdan kusursuz temel altyapısı.',
            specs: {
                'Konum': 'Zeytinburnu, İstanbul',
                'Kapsam': '-18m Kazı & 320 Fore Kazık',
                'Yapı Tipi': 'Zemin Güçlendirme & İksa'
            }
        },
        'esenyurt-rezidans': {
            title: 'Esenyurt Kentsel Dönüşüm & Rezidans Blokları',
            badge: 'Yapım Aşamasında (Devam Ediyor)',
            img: 'assets/images/proje-esenyurt-rezidans.jpeg',
            desc: '14 katlı, çift bodrum kapalı otoparklı, C35 yüksek dayanımlı beton ve radye temel ile yükselen modern B 3 sınıfı depreme dayanıklı kentsel dönüşüm projesi.',
            specs: {
                'Konum': 'Esenyurt, İstanbul',
                'Kapsam': 'Kaba & İnce Kentsel Dönüşüm',
                'Yapı Tipi': 'Modern Rezidans & Yaşam Alanı'
            }
        },
        'marmara-vizyon': {
            title: 'Marmara Vizyon Şantiye Sahası (Güngören / Bahçelievler)',
            badge: 'Yapım Aşamasında (Devam Ediyor)',
            img: 'assets/images/proje-marmara-vizyon.jpeg',
            desc: 'Eski ve riskli yapıların güvenli yıkımı sonrası derin temel kazısı, radye jeneral temel dökümü ve kentsel dönüşüm kaba yapı imalatı.',
            specs: {
                'Konum': 'Güngören / Bahçelievler, İstanbul',
                'Kapsam': 'Yıkım, Temel & Betonarme Kaba',
                'Yapı Tipi': 'Kentsel Dönüşüm Konut'
            }
        }
    };

    const projectModal = document.getElementById('projectModal');
    const modalClose = document.getElementById('modalClose');
    const modalImg = document.getElementById('modalImg');
    const modalBadge = document.getElementById('modalBadge');
    const modalTitle = document.getElementById('modalTitle');
    const modalDesc = document.getElementById('modalDesc');
    const modalSpecs = document.getElementById('modalSpecs');
    const modalContactBtn = document.getElementById('modalContactBtn');

    document.querySelectorAll('[data-project]').forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            const projKey = trigger.getAttribute('data-project');
            const data = projectData[projKey];
            if (!data) return;

            modalImg.src = data.img;
            modalImg.alt = data.title;
            modalBadge.textContent = data.badge;
            modalTitle.textContent = data.title;
            modalDesc.textContent = data.desc;

            modalSpecs.innerHTML = '';
            for (const [key, val] of Object.entries(data.specs)) {
                modalSpecs.innerHTML += `
                    <div class="project-modal__spec-item">
                        <span>${key}</span>
                        <strong>${val}</strong>
                    </div>
                `;
            }

            modalContactBtn.href = `https://wa.me/905320000000?text=${encodeURIComponent('Merhaba, ' + data.title + ' projeniz hakkında bilgi almak istiyorum.')}`;

            projectModal.classList.add('is-active');
            document.body.style.overflow = 'hidden';
        });
    });

    const closeModal = () => {
        if (projectModal) {
            projectModal.classList.remove('is-active');
            document.body.style.overflow = '';
        }
    };

    if (modalClose) modalClose.addEventListener('click', closeModal);
    if (projectModal) {
        projectModal.addEventListener('click', (e) => {
            if (e.target === projectModal) closeModal();
        });
    }

    // Escape key closes modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && projectModal && projectModal.classList.contains('is-active')) {
            closeModal();
        }
    });

    /* ==========================================================================
       7. İletişim Formu Gönderim
       ========================================================================== */
    const contactForm = document.getElementById('mainContactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('cfName').value;
            const phone = document.getElementById('cfPhone').value;
            const topic = document.getElementById('cfTopic').value;
            const message = document.getElementById('cfMessage').value;

            const text = `*Yeni İletişim / Teklif Talebi*\n\n` +
                `👤 Ad Soyad: ${name}\n` +
                `📞 Telefon: ${phone}\n` +
                `🏢 Konu: ${topic}\n` +
                `📝 Mesaj: ${message}`;

            window.open(`https://wa.me/905320000000?text=${encodeURIComponent(text)}`, '_blank');
            contactForm.reset();
            alert('Talebiniz alınmıştır! WhatsApp üzerinden yetkili mimarımıza aktarılıyorsunuz.');
        });
    }

    /* ==========================================================================
       8. Scroll Reveal Animations (Intersection Observer)
       ========================================================================== */
    const animatedElements = document.querySelectorAll('.fade-in-up, .features-item__bar-fill');
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    if (entry.target.classList.contains('features-item__bar-fill')) {
                        const targetWidth = entry.target.getAttribute('data-width') || '100%';
                        entry.target.style.width = targetWidth;
                    }
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });

        animatedElements.forEach(el => observer.observe(el));
    } else {
        animatedElements.forEach(el => el.classList.add('is-visible'));
    }

    /* ==========================================================================
       9. Projeler Sayfası Kategori & Proje Filtreleme
       ========================================================================== */
    const archiveFilterBtns = document.querySelectorAll('.projeler-archive__filter-btn');
    const archiveCards = document.querySelectorAll('.proje-card');

    if (archiveFilterBtns.length > 0 && archiveCards.length > 0) {
        const applyProjectFilter = (filterVal) => {
            archiveFilterBtns.forEach(b => {
                b.classList.toggle('is-active', b.getAttribute('data-filter') === filterVal);
            });
            archiveCards.forEach(card => {
                const status = card.getAttribute('data-status');
                const projectKey = card.getAttribute('data-project');
                const show = (filterVal === 'all') || (status === filterVal) || (projectKey === filterVal);
                card.classList.toggle('is-hidden', !show);
            });
        };

        archiveFilterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                applyProjectFilter(btn.getAttribute('data-filter'));
            });
        });

        const urlParams = new URLSearchParams(window.location.search);
        const initialFilter = urlParams.get('filter');
        if (initialFilter) {
            applyProjectFilter(initialFilter);
        }
    }

});

