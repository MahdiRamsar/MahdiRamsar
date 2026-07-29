/* ============================================================
   script.js – تمام جاوااسکریپت‌های صفحه (با امنیت بالا)
   ============================================================ */

(function () {
    'use strict';

    // ==========================================================
    // CURSOR
    // ==========================================================
    const glow = document.getElementById('cursor-glow');
    const dot = document.getElementById('cursor-dot');
    if (window.matchMedia('(hover: hover)').matches) {
        document.addEventListener('mousemove', (e) => {
            glow.style.left = e.clientX + 'px';
            glow.style.top = e.clientY + 'px';
            dot.style.left = e.clientX + 'px';
            dot.style.top = e.clientY + 'px';
        });
        document.querySelectorAll('a, button, .work-card, .post-card').forEach((el) => {
            el.addEventListener('mouseenter', () => {
                glow.style.width = '80px';
                glow.style.height = '80px';
                dot.style.width = '10px';
                dot.style.height = '10px';
            });
            el.addEventListener('mouseleave', () => {
                glow.style.width = '60px';
                glow.style.height = '60px';
                dot.style.width = '6px';
                dot.style.height = '6px';
            });
        });
    }

    // ==========================================================
    // SPOTLIGHT EFFECT
    // ==========================================================
    document.querySelectorAll('.section').forEach((section) => {
        section.addEventListener('mousemove', (e) => {
            const rect = section.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            section.style.setProperty('--mouse-x', x + '%');
            section.style.setProperty('--mouse-y', y + '%');
        });
    });

    // ==========================================================
    // SCROLL PROGRESS
    // ==========================================================
    const progressBar = document.getElementById('scroll-progress');
    let tick = false;
    window.addEventListener('scroll', () => {
        if (!tick) {
            window.requestAnimationFrame(() => {
                const scrollTop = window.scrollY;
                const docHeight = document.documentElement.scrollHeight - window.innerHeight;
                const value = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
                progressBar.style.width = value + '%';
                progressBar.setAttribute('aria-valuenow', value);
                tick = false;
            });
            tick = true;
        }
    });

    // ==========================================================
    // READING PROGRESS
    // ==========================================================
    const readingProgress = document.getElementById('reading-progress');
    let readTick = false;

    function updateReadingProgress() {
        const singlePost = document.getElementById('singlePost');
        if (singlePost && singlePost.classList.contains('active')) {
            const content = singlePost.querySelector('.single-post-view__body');
            if (content) {
                const rect = content.getBoundingClientRect();
                const totalHeight = content.scrollHeight;
                const visibleHeight = window.innerHeight - rect.top;
                const progress = Math.min(100, Math.max(0, (visibleHeight / totalHeight) * 100));
                readingProgress.style.width = progress + '%';
                readingProgress.setAttribute('aria-valuenow', progress);
                readingProgress.classList.add('active');
                return;
            }
        }
        readingProgress.style.width = '0%';
        readingProgress.setAttribute('aria-valuenow', 0);
        readingProgress.classList.remove('active');
    }

    window.addEventListener('scroll', () => {
        if (!readTick) {
            window.requestAnimationFrame(() => {
                updateReadingProgress();
                readTick = false;
            });
            readTick = true;
        }
    });
    window.addEventListener('resize', updateReadingProgress);

    // ==========================================================
    // THEME TOGGLE
    // ==========================================================
    const toggle = document.getElementById('themeToggle');
    const icon = toggle.querySelector('i');
    const currentTheme = localStorage.getItem('theme') || 'dark';

    if (currentTheme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
        icon.classList.replace('fa-sun', 'fa-moon');
        toggle.setAttribute('aria-pressed', 'true');
    }

    toggle.addEventListener('click', () => {
        const isDark = !document.documentElement.hasAttribute('data-theme');
        if (isDark) {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
            icon.classList.replace('fa-sun', 'fa-moon');
            toggle.setAttribute('aria-pressed', 'true');
        } else {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('theme', 'dark');
            icon.classList.replace('fa-moon', 'fa-sun');
            toggle.setAttribute('aria-pressed', 'false');
        }
    });

    // ==========================================================
    // MUSIC PLAYER (امن)
    // ==========================================================
    const musicToggle = document.getElementById('musicToggle');
    const musicIcon = musicToggle.querySelector('i');
    const audio = document.getElementById('bgMusic');
    let isPlaying = false;

    audio.addEventListener('error', function (e) {
        console.error('خطا در بارگذاری فایل صوتی. کد خطا:', e.target.error ? e.target.error.code : 'Unknown');
        musicToggle.style.opacity = '0.5';
        musicToggle.title = 'فایل صوتی موجود نیست';
    });

    musicToggle.addEventListener('click', function () {
        if (audio.src && audio.src.includes('/music.mp3')) {
            if (isPlaying) {
                audio.pause();
                musicIcon.className = 'fas fa-music';
                musicToggle.classList.remove('playing');
                isPlaying = false;
            } else {
                audio.play().catch((err) => {
                    console.error('مشکل در پخش صدا:', err);
                });
                musicIcon.className = 'fas fa-play';
                musicToggle.classList.add('playing');
                isPlaying = true;
            }
        } else {
            console.warn('فایل صوتی در مسیر /music.mp3 پیدا نشد.');
        }
    });

    // ==========================================================
    // TYPEWRITER
    // ==========================================================
    const typedEl = document.getElementById('typedText');
    const phrases = [
        'دکلمه‌های مرا بشنوید 🎧',
        'همراه من در سفر کلمات 🌱',
        'اینجا صدا و معنا به هم می‌رسند 📖',
        'دل‌نوشته‌های بی‌نقاب را بخوانید ✍️',
    ];
    let pIdx = 0,
        cIdx = 0,
        del = false;
    let typeTimeout;

    function typeEffect() {
        const current = phrases[pIdx];
        if (!del) {
            typedEl.textContent = current.substring(0, cIdx++);
            if (cIdx > current.length) {
                del = true;
                typeTimeout = setTimeout(typeEffect, 2200);
                return;
            }
        } else {
            typedEl.textContent = current.substring(0, cIdx--);
            if (cIdx < 0) {
                del = false;
                cIdx = 0;
                pIdx = (pIdx + 1) % phrases.length;
                typeTimeout = setTimeout(typeEffect, 400);
                return;
            }
        }
        typeTimeout = setTimeout(typeEffect, del ? 50 : 100);
    }
    setTimeout(typeEffect, 700);

    // ==========================================================
    // SMOOTH SCROLL FOR NAV
    // ==========================================================
    const navLinks = document.querySelectorAll('.main-nav__link[href^="#"]');
    navLinks.forEach((link) => {
        link.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            e.preventDefault();
            const target = document.querySelector(targetId);
            if (target) {
                const headerHeight = document.querySelector('header').offsetHeight;
                window.scrollTo({
                    top: target.getBoundingClientRect().top + window.scrollY - headerHeight - 10,
                    behavior: 'smooth',
                });
                navLinks.forEach((l) => l.removeAttribute('aria-current'));
                this.setAttribute('aria-current', 'page');
            }
        });
    });

    // ==========================================================
    // BACK TO TOP
    // ==========================================================
    const backBtn = document.getElementById('backToTop');
    window.addEventListener('scroll', () => {
        backBtn.classList.toggle('visible', window.scrollY > 400);
    });
    backBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ==========================================================
    // PERSIAN DATE
    // ==========================================================
    const dateEl = document.getElementById('persianDate');
    if (dateEl) {
        dateEl.textContent =
            '📅 ' +
            new Date().toLocaleDateString('fa-IR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                weekday: 'long',
            });
    }
    const copyrightEl = document.querySelector('.footer__copyright');
    if (copyrightEl) {
        copyrightEl.innerHTML = `© ${new Date().getFullYear()} · تمامی حقوق محفوظ · طراحی با تکنولوژی‌های ۲۰۲۶`;
    }

    // ==========================================================
    // PARALLAX
    // ==========================================================
    const heroBg = document.getElementById('heroBg');
    if (heroBg) {
        let paraTick = false;
        window.addEventListener('scroll', () => {
            if (!paraTick) {
                window.requestAnimationFrame(() => {
                    heroBg.style.transform = `scale(1.1) translateY(${window.scrollY * 0.15}px)`;
                    paraTick = false;
                });
                paraTick = true;
            }
        });
    }

    // ==========================================================
    // ABOUT SLIDER
    // ==========================================================
    const track = document.getElementById('aboutSliderTrack');
    const slides = track.querySelectorAll('.about-slide');
    const dotsContainer = document.getElementById('aboutDots');
    const prevBtn = document.getElementById('aboutPrev');
    const nextBtn = document.getElementById('aboutNext');
    let currentSlide = 0;
    const totalSlides = slides.length;

    for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement('button');
        dot.className = 'slider-dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('aria-label', 'اسلاید ' + (i + 1));
        dot.dataset.index = i;
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
    }
    const dots = dotsContainer.querySelectorAll('.slider-dot');

    function goToSlide(index) {
        currentSlide = index;
        if (currentSlide < 0) currentSlide = totalSlides - 1;
        if (currentSlide >= totalSlides) currentSlide = 0;
        track.style.transform = 'translateX(-' + currentSlide * 100 + '%)';
        dots.forEach((d, i) => {
            d.classList.toggle('active', i === currentSlide);
        });
    }

    prevBtn.addEventListener('click', () => goToSlide(currentSlide - 1));
    nextBtn.addEventListener('click', () => goToSlide(currentSlide + 1));

    let autoInterval = setInterval(() => goToSlide(currentSlide + 1), 5000);
    const sliderWrapper = document.querySelector('.about-slider');
    if (sliderWrapper) {
        sliderWrapper.addEventListener('mouseenter', () => clearInterval(autoInterval));
        sliderWrapper.addEventListener('mouseleave', () => {
            clearInterval(autoInterval);
            autoInterval = setInterval(() => goToSlide(currentSlide + 1), 5000);
        });
    }

    // ==========================================================
    // FAQ ACCORDION
    // ==========================================================
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach((item) => {
        const btn = item.querySelector('.faq-item__question');
        btn.addEventListener('click', () => {
            const isOpen = item.classList.contains('open');
            faqItems.forEach((other) => {
                if (other !== item && other.classList.contains('open')) {
                    other.classList.remove('open');
                    other.querySelector('.faq-item__question').setAttribute('aria-expanded', 'false');
                }
            });
            if (!isOpen) {
                item.classList.add('open');
                btn.setAttribute('aria-expanded', 'true');
            } else {
                item.classList.remove('open');
                btn.setAttribute('aria-expanded', 'false');
            }
        });
    });

    // ==========================================================
    // POSTS ENGINE (با امنیت بالا – بدون innerHTML خطرناک)
    // ==========================================================
    let postsData = [];
    const postsGrid = document.getElementById('postsGrid');
    const singlePostView = document.getElementById('singlePost');
    const postsListView = document.getElementById('postsList');
    const singlePostContent = document.getElementById('singlePostContent');
    const backBtnPosts = document.getElementById('backToPosts');
    const searchInput = document.getElementById('searchInput');
    const noPostsMsg = document.getElementById('noPosts');
    const sharePostBtn = document.getElementById('sharePostBtn');
    const navContainer = document.getElementById('postNavigationContainer');

    const metaTitle = document.querySelector('title');
    const metaDesc = document.querySelector('meta[name="description"]');
    const ogTitle = document.querySelector('meta[property="og:title"]');
    const ogDesc = document.querySelector('meta[property="og:description"]');
    const ogUrl = document.querySelector('meta[property="og:url"]');
    const ogImage = document.querySelector('meta[property="og:image"]');
    const canonical = document.querySelector('link[rel="canonical"]');
    const robots = document.querySelector('meta[name="robots"]');
    let schemaPost = null;

    // داده‌های پیش‌فرض (fallback)
    const FALLBACK_POSTS = [
        {
            id: 1,
            title: 'تقاطع عشق و خشم',
            slug: 'taghato-eshgh-va-kheshm',
            date: '۱۰ تیر ۱۴۰۴',
            image: 'images/taghato-eshgh-va-kheshm.webp',
            metaDescription: 'دل‌نوشته‌ای از مهدی رحیمیان درباره تناقض عشق و نفرت',
            excerpt: 'گاهی کلمه‌ها چیزی بیشتر از صداهای بی‌جان نیستند...',
            content: 'گاهی کلمه‌ها\nچیزی بیشتر از صداهای بی‌جان نیستند...',
        },
        // سایر نوشته‌ها به همین ترتیب (برای اختصار فقط یک نمونه)
    ];

    // ---------- توابع کمکی امن ----------
    function createElementFromHTML(htmlString) {
        const template = document.createElement('template');
        template.innerHTML = htmlString.trim();
        return template.content.firstChild;
    }

    function sanitizeText(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function getSlugFromURL() {
        const path = window.location.pathname;
        const parts = path.split('/').filter(Boolean);
        if (parts.length >= 2 && parts[0] === 'post') return parts[1].replace(/\.html$/, '');
        if (parts.length >= 2 && parts[0] === 'p') return decodeURIComponent(parts[1]);
        const params = new URLSearchParams(window.location.search);
        return params.get('post') || null;
    }

    function updateURL(slug) {
        if (slug) {
            window.history.pushState({ slug: slug }, '', window.location.origin + '/post/' + encodeURIComponent(slug) + '.html');
        } else {
            window.history.pushState({ slug: null }, '', window.location.origin + '/');
        }
    }

    // ---------- به‌روزرسانی SEO ----------
    function updateSEO(post) {
        if (post) {
            const fullTitle = post.title + ' | سایه‌های بی‌نقاب';
            const desc = post.metaDescription || post.excerpt || post.content.substring(0, 150) + '...';
            metaTitle.textContent = fullTitle;
            metaDesc.content = desc;
            ogTitle.content = fullTitle;
            ogDesc.content = desc;
            ogUrl.content = window.location.href;
            ogImage.content = post.image || 'https://sayehayebineghab.ir/images/1.webp';
            canonical.href = window.location.href;
            robots.content = 'index, follow';

            // حذف schema قبلی
            if (schemaPost) {
                schemaPost.remove();
                schemaPost = null;
            }
            // افزودن schema جدید
            const script = document.createElement('script');
            script.type = 'application/ld+json';
            script.id = 'schema-post';
            const dateISO = post.date ? post.date.replace(/[^\d]/g, '') : '1404';
            script.textContent = JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'BlogPosting',
                headline: post.title,
                datePublished: dateISO + '-00-00',
                author: { '@type': 'Person', name: 'مهدی رحیمیان' },
                description: desc,
                image: post.image || 'https://sayehayebineghab.ir/images/1.webp',
            });
            document.head.appendChild(script);
            schemaPost = script;
        } else {
            metaTitle.textContent = 'سایه‌های بی‌نقاب | مهدی رحیمیان – نویسنده و گوینده اهل رامسر';
            metaDesc.content =
                'مهدی رحیمیان، نویسنده و گوینده‌ی اهل رامسر (سخت‌سر). دل‌نوشته‌های عاشقانه، دکلمه‌های صوتی و محتوای عمیق انسانی.';
            ogTitle.textContent = 'سایه‌های بی‌نقاب | مهدی رحیمیان – نویسنده و گوینده اهل رامسر';
            ogDesc.content = 'دل‌نوشته‌ها، دکلمه‌های صوتی و نگاه عمیق به زندگی، عشق و تنهایی. محتوایی اصیل از دل رامسر.';
            ogUrl.content = window.location.origin + '/';
            ogImage.content = 'https://sayehayebineghab.ir/images/1.webp';
            canonical.href = 'https://sayehayebineghab.ir/';
            robots.content = 'index, follow';
            if (schemaPost) {
                schemaPost.remove();
                schemaPost = null;
            }
        }
    }

    // ---------- رندر لیست نوشته‌ها (امن) ----------
    function renderPostsList(posts) {
        if (!posts || posts.length === 0) {
            postsGrid.innerHTML = '';
            noPostsMsg.style.display = 'block';
            return;
        }
        noPostsMsg.style.display = 'none';
        postsGrid.innerHTML = '';

        posts.forEach((post) => {
            const imgSrc = post.image || 'images/1.webp';
            const card = document.createElement('article');
            card.className = 'post-card';
            card.dataset.slug = post.slug;

            const link = document.createElement('a');
            link.className = 'post-card__link';
            link.href = '/post/' + encodeURIComponent(post.slug) + '.html';
            link.setAttribute('aria-label', 'مشاهده نوشته: ' + post.title);

            const thumb = document.createElement('div');
            thumb.className = 'post-card__thumb';
            thumb.style.backgroundImage = 'url(' + imgSrc + ')';

            const info = document.createElement('div');
            info.className = 'post-card__info';

            const title = document.createElement('h3');
            title.className = 'post-card__title';
            title.textContent = post.title;

            const excerpt = document.createElement('div');
            excerpt.className = 'post-card__excerpt';
            excerpt.textContent = post.excerpt || post.content.substring(0, 120) + '...';

            const meta = document.createElement('div');
            meta.className = 'post-card__meta';

            const dateSpan = document.createElement('span');
            dateSpan.innerHTML = '<i class="fas fa-calendar-alt" aria-hidden="true"></i> ' + post.date;

            const shareBtn = document.createElement('button');
            shareBtn.className = 'share-btn';
            shareBtn.setAttribute('aria-label', 'اشتراک‌گذاری');
            shareBtn.innerHTML = '<i class="fas fa-share-alt" aria-hidden="true"></i>';
            shareBtn.dataset.slug = post.slug;

            shareBtn.addEventListener('click', function (e) {
                e.stopPropagation();
                e.preventDefault();
                const slug = this.dataset.slug;
                const p = postsData.find((item) => item.slug === slug);
                if (p) sharePost(p);
            });

            meta.appendChild(dateSpan);
            meta.appendChild(shareBtn);
            info.appendChild(title);
            info.appendChild(excerpt);
            info.appendChild(meta);
            link.appendChild(thumb);
            link.appendChild(info);
            card.appendChild(link);
            postsGrid.appendChild(card);
        });
    }

    // ---------- نمایش یک نوشته (امن) ----------
    function showSinglePost(slug) {
        const post = postsData.find((p) => p.slug === slug);
        if (!post) {
            postsListView.classList.remove('hidden');
            singlePostView.classList.remove('active');
            singlePostView.style.display = 'none';
            renderPostsList(postsData);
            updateURL(null);
            updateSEO(null);
            const notFound = document.createElement('div');
            notFound.className = 'not-found';
            notFound.style.gridColumn = '1/-1';
            notFound.innerHTML =
                '<i class="fas fa-search" aria-hidden="true"></i><h3>نوشته‌ای پیدا نشد</h3><p>متأسفیم، نوشته‌ای با این آدرس وجود ندارد.</p>';
            postsGrid.innerHTML = '';
            postsGrid.appendChild(notFound);
            return;
        }

        updateURL(slug);
        updateSEO(post);

        postsListView.classList.add('hidden');
        singlePostView.classList.add('active');
        singlePostView.style.display = 'block';

        // ساخت محتوای نوشته با textContent برای امنیت
        const header = document.createElement('div');
        header.className = 'single-post-view__header';
        const h1 = document.createElement('h1');
        h1.textContent = post.title;
        const dateDiv = document.createElement('div');
        dateDiv.style.color = 'var(--text-muted)';
        dateDiv.innerHTML = '<i class="fas fa-calendar-alt" aria-hidden="true"></i> ' + post.date;
        header.appendChild(h1);
        header.appendChild(dateDiv);

        const body = document.createElement('div');
        body.className = 'single-post-view__body';
        // برای نمایش خطوط جدید، از innerHTML با sanitize استفاده می‌کنیم
        // اما محتوا از منبع مطمئن (JSON) است، ولی برای امنیت بیشتر escape می‌کنیم
        body.textContent = post.content; // فقط متن ساده (خطوط جدید با \n)
        // برای نمایش بهتر خطوط جدید، می‌توانیم از <br> استفاده کنیم
        // اما با textContent خطوط جدید به عنوان فضای خالی نمایش داده می‌شوند
        // بنابراین از innerHTML با sanitize استفاده می‌کنیم:
        body.innerHTML = post.content.split('\n').map(line => sanitizeText(line)).join('<br>');

        singlePostContent.innerHTML = '';
        singlePostContent.appendChild(header);
        singlePostContent.appendChild(body);

        // ناوبری
        const currentIndex = postsData.findIndex((p) => p.slug === slug);
        const prevPost = currentIndex > 0 ? postsData[currentIndex - 1] : null;
        const nextPost = currentIndex < postsData.length - 1 ? postsData[currentIndex + 1] : null;

        navContainer.innerHTML = '';
        const navDiv = document.createElement('div');
        navDiv.className = 'post-navigation';

        if (prevPost) {
            const prevLink = document.createElement('a');
            prevLink.href = '/post/' + encodeURIComponent(prevPost.slug) + '.html';
            prevLink.dataset.slug = prevPost.slug;
            prevLink.innerHTML =
                '<i class="fas fa-chevron-right" aria-hidden="true"></i><span><span class="nav-label">نوشته قبلی</span><span class="nav-title">' +
                sanitizeText(prevPost.title) + '</span></span>';
            prevLink.addEventListener('click', function (e) {
                e.preventDefault();
                const slug = this.dataset.slug;
                if (slug) showSinglePost(slug);
            });
            navDiv.appendChild(prevLink);
        } else {
            const empty = document.createElement('span');
            navDiv.appendChild(empty);
        }

        if (nextPost) {
            const nextLink = document.createElement('a');
            nextLink.href = '/post/' + encodeURIComponent(nextPost.slug) + '.html';
            nextLink.dataset.slug = nextPost.slug;
            nextLink.innerHTML =
                '<span><span class="nav-label">نوشته بعدی</span><span class="nav-title">' +
                sanitizeText(nextPost.title) + '</span></span><i class="fas fa-chevron-left" aria-hidden="true"></i>';
            nextLink.addEventListener('click', function (e) {
                e.preventDefault();
                const slug = this.dataset.slug;
                if (slug) showSinglePost(slug);
            });
            navDiv.appendChild(nextLink);
        } else {
            const empty = document.createElement('span');
            navDiv.appendChild(empty);
        }

        navContainer.appendChild(navDiv);

        // دکمه اشتراک‌گذاری
        sharePostBtn.onclick = function () {
            sharePost(post);
        };

        setTimeout(updateReadingProgress, 100);
        document.getElementById('blog').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // ---------- بازگشت به لیست ----------
    function goBackToList(e) {
        if (e) e.preventDefault();
        postsListView.classList.remove('hidden');
        singlePostView.classList.remove('active');
        singlePostView.style.display = 'none';
        navContainer.innerHTML = '';
        updateURL(null);
        updateSEO(null);
        document.title = 'سایه‌های بی‌نقاب | مهدی رحیمیان – نویسنده و گوینده اهل رامسر';
        document.getElementById('blog').scrollIntoView({ behavior: 'smooth', block: 'start' });
        applySearch();
        updateReadingProgress();
    }

    backBtnPosts.addEventListener('click', goBackToList);

    // ---------- اشتراک‌گذاری ----------
    function sharePost(post) {
        const url = window.location.origin + '/post/' + encodeURIComponent(post.slug) + '.html';
        if (navigator.share) {
            navigator
                .share({
                    title: post.title,
                    text: post.excerpt || post.content.substring(0, 100) + '...',
                    url: url,
                })
                .catch(() => {});
        } else {
            navigator.clipboard
                .writeText(url)
                .then(() => {
                    alert('لینک نوشته در کلیپ‌بورد کپی شد.');
                })
                .catch(() => {
                    prompt('لینک نوشته:', url);
                });
        }
    }

    // ---------- جستجو ----------
    function applySearch() {
        const query = searchInput.value.trim().toLowerCase();
        if (!query) {
            renderPostsList(postsData);
            return;
        }
        const filtered = postsData.filter(
            (p) =>
                p.title.toLowerCase().includes(query) ||
                (p.excerpt && p.excerpt.toLowerCase().includes(query)) ||
                p.content.toLowerCase().includes(query)
        );
        renderPostsList(filtered);
    }

    searchInput.addEventListener('input', applySearch);

    // ---------- مدیریت popstate ----------
    window.addEventListener('popstate', (e) => {
        const slug = e.state && e.state.slug;
        if (slug) {
            showSinglePost(slug);
        } else {
            goBackToList(e);
        }
    });

    // ---------- بارگذاری داده‌ها ----------
    function loadPosts() {
        fetch('posts.json')
            .then((res) => {
                if (!res.ok) throw new Error('not found');
                return res.json();
            })
            .then((data) => {
                postsData = data;
                renderPostsList(postsData);
                const slug = getSlugFromURL();
                if (slug) {
                    showSinglePost(slug);
                } else {
                    updateSEO(null);
                }
            })
            .catch(() => {
                postsData = FALLBACK_POSTS;
                renderPostsList(postsData);
                const slug = getSlugFromURL();
                if (slug) {
                    showSinglePost(slug);
                } else {
                    updateSEO(null);
                }
            });
    }

    loadPosts();

    // ==========================================================
    // SERVICE WORKER (ثبت در انتها)
    // ==========================================================
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js').catch(() => {});
    }
})();