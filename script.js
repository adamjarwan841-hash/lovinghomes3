// تطبيق الحجم عند تحميل أي صفحة
document.addEventListener("DOMContentLoaded", function() {
    const savedSize = localStorage.getItem('globalFontSize');
    if (savedSize) {
        applyFontSize(savedSize);
        const slider = document.getElementById('fontSizeSlider');
        const label = document.getElementById('fontSizeLabel');
        if (slider) slider.value = savedSize;
        if (label) label.innerText = "حجم الخط: " + savedSize + "px";
    }
    
    // تطبيق الوضع الليلي المحفوظ
    applySavedTheme();
    
    // تفعيل زر الحجز
    setupBookingButton();
    
    // تفعيل الأسئلة الشائعة (FAQ)
    setupFAQ();
    
    // إضافة تأثيرات للأزرار
    setupButtonEffects();
    
    // تفعيل التحميل الكسول للصور
    initLazyLoading();
    
    // تفعيل سلوك الهيدر على الجوال
    initMobileHeaderScroll();
});

// ===== دوال الوضع الليلي =====
function toggleNightMode() {
    document.body.classList.toggle('night-mode');
    
    // حفظ الاختيار
    if (document.body.classList.contains('night-mode')) {
        localStorage.setItem('theme', 'night');
        showNotification('🌙 تم تفعيل الوضع الليلي', 'info');
    } else {
        localStorage.setItem('theme', 'day');
        showNotification('☀️ تم تفعيل الوضع النهاري', 'info');
    }
}

function applySavedTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'night') {
        document.body.classList.add('night-mode');
    }
}

// ===== دوال الإشعارات =====
function showNotification(message, type = 'success') {
    // إزالة أي إشعار سابق
    const oldNotification = document.querySelector('.notification-toast');
    if (oldNotification) oldNotification.remove();
    
    // إنشاء الإشعار الجديد
    const notification = document.createElement('div');
    notification.className = `notification-toast ${type}`;
    
    let icon = '✅';
    if (type === 'info') icon = 'ℹ️';
    if (type === 'warning') icon = '⚠️';
    
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">${icon}</span>
            <span class="notification-message">${message}</span>
        </div>
        <div class="notification-progress"></div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => notification.classList.add('show'), 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ===== رسالة الشكر البسيطة =====
function showThankYouMessage() {
    // رسالة تأكيد بسيطة
    alert("✅ شكراً لك! تم إرسال طلب الحجز بنجاح");
    
    // التوجيه إلى الصفحة الرئيسية بعد ثانية واحدة
    setTimeout(function() {
        window.location.href = 'home.html';
    }, 1000);
}
// ===== دوال الإعدادات =====
function openSettings() {
    document.getElementById('settingsModal').style.display = "flex";
    
    // إضافة زر الوضع الليلي للإعدادات إذا لم يكن موجوداً
    const modalContent = document.querySelector('.modal-content');
    if (!document.getElementById('nightModeBtn')) {
        const nightModeBtn = document.createElement('button');
        nightModeBtn.id = 'nightModeBtn';
        nightModeBtn.className = 'night-mode-btn';
        nightModeBtn.innerHTML = document.body.classList.contains('night-mode') ? '☀️ الوضع النهاري' : '🌙 الوضع الليلي';
        nightModeBtn.onclick = function() {
            toggleNightMode();
            this.innerHTML = document.body.classList.contains('night-mode') ? '☀️ الوضع النهاري' : '🌙 الوضع الليلي';
        };
        
        // إضافة قبل زر الإغلاق
        const closeBtn = modalContent.querySelector('.close-red-btn');
        modalContent.insertBefore(nightModeBtn, closeBtn);
    }
}

function closeSettings() {
    document.getElementById('settingsModal').style.display = "none";
}

function changeFontSize(size) {
    applyFontSize(size);
    localStorage.setItem('globalFontSize', size);
    document.getElementById('fontSizeLabel').innerText = "حجم الخط: " + size + "px";
}

function applyFontSize(size) {
    document.documentElement.style.fontSize = size + "px";
    
    const elements = document.querySelectorAll('body, p, h1, h2, h3, a, li, label, button, input, textarea');
    elements.forEach(el => {
        el.style.fontSize = size + "px";
    });
}

// إغلاق عند النقر خارج الصندوق
window.onclick = function(event) {
    const modal = document.getElementById('settingsModal');
    if (event.target == modal) {
        closeSettings();
    }
}

// ===== دوال الأسئلة الشائعة (FAQ) =====
function setupFAQ() {
    const faqBlocks = document.querySelectorAll('.faq-block');
    
    faqBlocks.forEach((block, index) => {
        // الحصول على السؤال والجواب
        const question = block.querySelector('h3');
        const answer = block.querySelector('p');
        
        if (question && answer) {
            // إنشاء هيكل جديد للـ FAQ
            const questionText = question.textContent;
            const answerText = answer.innerHTML;
            
            block.innerHTML = `
                <div class="faq-question" data-index="${index}">
                    <span>${questionText}</span>
                    <i class="fas fa-chevron-down"></i>
                </div>
                <div class="faq-answer">
                    <p>${answerText}</p>
                </div>
            `;
            
            // إضافة حدث النقر
            const newQuestion = block.querySelector('.faq-question');
            const answerDiv = block.querySelector('.faq-answer');
            
            newQuestion.addEventListener('click', function() {
                // إغلاق البقية
                document.querySelectorAll('.faq-question').forEach(q => {
                    if (q !== this) {
                        q.classList.remove('active');
                        q.nextElementSibling.classList.remove('show');
                    }
                });
                
                // فتح/غلق الحالي
                this.classList.toggle('active');
                answerDiv.classList.toggle('show');
            });
        }
    });
}

// ===== دوال زر الحجز =====
// ===== دوال زر الحجز مع التحقق والرسائل =====
function setupBookingButton() {
    const termsCheckbox = document.getElementById('terms');
    const bookingBtn = document.getElementById('bookingBtn');
    const bookingForm = document.querySelector('.booking-form');
    
    if (termsCheckbox && bookingBtn && bookingForm) {
        // الحقول المطلوبة
        const requiredFields = bookingForm.querySelectorAll('input[required]:not([type="checkbox"])');
        
        // إضافة رسائل خطأ لكل حقل
        requiredFields.forEach(field => {
            // إنشاء عنصر رسالة الخطأ
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.innerHTML = '<i class="fas fa-exclamation-circle"></i> هذا الحقل مطلوب';
            
            // إضافة رسالة الخطأ بعد الحقل
            field.parentElement.appendChild(errorDiv);
        });
        
        function checkFormValidity() {
            let allFilled = true;
            
            requiredFields.forEach(field => {
                const parentRow = field.parentElement;
                const errorMsg = parentRow.querySelector('.error-message');
                
                if (field.value.trim() === '') {
                    allFilled = false;
                    parentRow.classList.add('error');
                    if (errorMsg) errorMsg.classList.add('show');
                } else {
                    parentRow.classList.remove('error');
                    if (errorMsg) errorMsg.classList.remove('show');
                }
            });
            
            bookingBtn.disabled = !(allFilled && termsCheckbox.checked);
            
            // تحسين مظهر الزر
            if (!bookingBtn.disabled) {
                bookingBtn.style.background = 'linear-gradient(135deg, #ff8c00, #ff6b00)';
                bookingBtn.style.transform = 'scale(1.02)';
            } else {
                bookingBtn.style.background = '#ccc';
                bookingBtn.style.transform = 'scale(1)';
            }
        }
        
        // التحقق عند التغيير
        requiredFields.forEach(field => {
            field.addEventListener('input', checkFormValidity);
            field.addEventListener('focus', function() {
                this.parentElement.style.transform = 'scale(1.02)';
                this.parentElement.style.boxShadow = '0 5px 20px rgba(255,140,0,0.2)';
            });
            field.addEventListener('blur', function() {
                this.parentElement.style.transform = 'scale(1)';
                this.parentElement.style.boxShadow = 'none';
            });
        });
        
        termsCheckbox.addEventListener('change', checkFormValidity);
        
        // التحقق الأولي
        checkFormValidity();
        
        // عند الضغط على الزر
        bookingBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // التحقق مرة أخيرة قبل الإرسال
            let allFilled = true;
            requiredFields.forEach(field => {
                if (field.value.trim() === '') {
                    allFilled = false;
                }
            });
            
            if (!allFilled || !termsCheckbox.checked) {
                alert('❌ الرجاء تعبئة جميع الحقول المطلوبة والموافقة على الشروط');
                return;
            }
            
            if (!this.disabled) {
                // رسالة شكر بسيطة
                alert("✅ شكراً لك! تم إرسال طلب الحجز بنجاح");
                
                // التوجيه إلى الصفحة الرئيسية بعد ثانية واحدة
                setTimeout(function() {
                    window.location.href = 'home.html';
                }, 1000);
            }
        });
    }
}

// حفظ بيانات الحجز
function saveBookingData() {
    const form = document.querySelector('.booking-form');
    if (!form) return;
    
    const bookingData = {
        package: document.querySelector('.form-title')?.textContent || 
                 document.querySelector('.form-title-classic')?.textContent ||
                 document.querySelector('.form-title-day')?.textContent ||
                 'حزمة',
        date: new Date().toLocaleString('ar-SA'),
        ownerName: form.querySelector('input[name="owner-name"]')?.value || '',
        phone: form.querySelector('input[name="phone"]')?.value || ''
    };
    
    localStorage.setItem('lastBooking', JSON.stringify(bookingData));
}

// ===== تأثيرات الأزرار المحسنة =====
function setupButtonEffects() {
    // جميع الأزرار
    const buttons = document.querySelectorAll('button, .btn-orange, .booking-btn, .submit-btn, nav ul li a');
    
    buttons.forEach(btn => {
        btn.addEventListener('mousedown', function() {
            this.style.transform = 'scale(0.95)';
        });
        
        btn.addEventListener('mouseup', function() {
            this.style.transform = 'scale(1)';
        });
        
        btn.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });
    
    // تأثيرات إضافية لبطاقات الحزم
    const packageCards = document.querySelectorAll('.package-card');
    packageCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-15px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

// ===== تأثيرات التمرير =====
window.addEventListener('scroll', function() {
    const scrollPosition = window.scrollY;
    
    // إظهار/إخفاء زر العودة للأعلى (إذا كان موجوداً)
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
        if (scrollPosition > 300) {
            backToTop.style.display = 'flex';
        } else {
            backToTop.style.display = 'none';
        }
    }
});

// ===== التحميل الكسول للصور (Lazy Loading) =====
function initLazyLoading() {
    // استخدام Intersection Observer لتحميل الصور عند ظهورها في الشاشة
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    // إذا كانت الصورة تحتوي على data-src، نقلها إلى src
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        img.classList.add('loaded');
                    }
                    // أزل التحقق من الصورة بعد تحميلها
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px 0px', // يبدأ التحميل قبل ظهور الصورة بـ 50px
            threshold: 0.01
        });

        // مراقبة جميع الصور التي تحتوي على data-src
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    } else {
        // إذا لم يدعم المتصفح Intersection Observer، حمل جميع الصور مباشرة
        document.querySelectorAll('img[data-src]').forEach(img => {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            img.classList.add('loaded');
        });
    }
}

// ===== سلوك الهيدر على الجوال (إخفاء عند التمرير لأسفل، إظهار عند التمرير لأعلى) =====
function initMobileHeaderScroll() {
    // تحقق من أن الشاشة أصغر من 768px
    const isMobile = window.innerWidth < 768;
    
    if (!isMobile) return; // لا تفعيل على الشاشة الكبيرة
    
    let lastScrollTop = 0;
    const header = document.querySelector('header');
    
    if (!header) return;
    
    // متغير للتحكم في حالة الهيدر
    let isHeaderHidden = false;
    
    window.addEventListener('scroll', function() {
        const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // تجاهل التمرير الصغير (أقل من 10px)
        if (Math.abs(currentScrollTop - lastScrollTop) < 10) return;
        
        if (currentScrollTop > lastScrollTop) {
            // تمرير لأسفل - إخفاء الهيدر
            if (!isHeaderHidden) {
                header.classList.add('header-hidden');
                isHeaderHidden = true;
            }
        } else {
            // تمرير لأعلى - إظهار الهيدر
            if (isHeaderHidden) {
                header.classList.remove('header-hidden');
                isHeaderHidden = false;
            }
        }
        
        lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop;
    }, { passive: true });
}

// ===== Package Recommender Functions =====
let currentStep = 1;
let userSelections = {
    dogSize: '',
    dogAge: '',
    activityLevel: '',
    budget: ''
};

// Open the recommender modal
function openPackageRecommender() {
    const modal = document.getElementById('packageRecommenderModal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        resetRecommender();
    }
}

// Close the recommender modal
function closePackageRecommender() {
    const modal = document.getElementById('packageRecommenderModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

// Reset the recommender
function resetRecommender() {
    currentStep = 1;
    userSelections = {
        dogSize: '',
        dogAge: '',
        activityLevel: '',
        budget: ''
    };
    
    // Hide all steps and result
    document.querySelectorAll('.recommender-step').forEach(step => {
        step.classList.remove('active');
        step.style.display = 'none';
    });
    document.getElementById('recommendationResult').style.display = 'none';
    document.getElementById('backBtn').style.display = 'none';
    
    // Show first step
    document.getElementById('step1').style.display = 'block';
    document.getElementById('step1').classList.add('active');
}

// Restart the recommender
function restartRecommender() {
    resetRecommender();
}

// Go back to previous step
function goBack() {
    if (currentStep > 1) {
        document.getElementById('step' + currentStep).style.display = 'none';
        document.getElementById('step' + currentStep).classList.remove('active');
        currentStep--;
        document.getElementById('step' + currentStep).style.display = 'block';
        document.getElementById('step' + currentStep).classList.add('active');
        
        if (currentStep === 1) {
            document.getElementById('backBtn').style.display = 'none';
        }
    }
}

// Select dog size
function selectDogSize(size) {
    userSelections.dogSize = size;
    goToStep(2);
}

// Select dog age
function selectDogAge(age) {
    userSelections.dogAge = age;
    goToStep(3);
}

// Select activity level
function selectActivityLevel(level) {
    userSelections.activityLevel = level;
    goToStep(4);
}

// Select budget
function selectBudget(budget) {
    userSelections.budget = budget;
    showRecommendation();
}

// Go to specific step
function goToStep(step) {
    document.getElementById('step' + currentStep).style.display = 'none';
    document.getElementById('step' + currentStep).classList.remove('active');
    currentStep = step;
    document.getElementById('step' + currentStep).style.display = 'block';
    document.getElementById('step' + currentStep).classList.add('active');
    
    // Show/hide back button
    if (currentStep > 1) {
        document.getElementById('backBtn').style.display = 'block';
    }
}

// Show recommendation based on user selections
function showRecommendation() {
    const recommendation = calculateRecommendation();
    
    // Hide all steps
    document.querySelectorAll('.recommender-step').forEach(step => {
        step.style.display = 'none';
        step.classList.remove('active');
    });
    document.getElementById('backBtn').style.display = 'none';
    
    // Show result
    const resultDiv = document.getElementById('recommendationResult');
    resultDiv.style.display = 'block';
    
    // Update recommended package display
    const packageDiv = document.getElementById('recommendedPackage');
    const reasonDiv = document.getElementById('recommendationReason');
    const bookBtn = document.getElementById('bookRecommendedBtn');
    
    let packageName, packagePrice, packageIcon, packageLink;
    
    if (recommendation.package === 'day') {
        packageName = 'الحزمة اليوم';
        packagePrice = '$25';
        packageIcon = 'fa-sun';
        packageLink = 'daypackage.html';
    } else if (recommendation.package === 'classic') {
        packageName = 'الحزمة الكلاسيكية';
        packagePrice = '$45';
        packageIcon = 'fa-star';
        packageLink = 'classicpackage.html';
    } else {
        packageName = 'الحزمة المميزة';
        packagePrice = '$65';
        packageIcon = 'fa-crown';
        packageLink = 'premiumpackage.html';
    }
    
    packageDiv.innerHTML = `
        <div class="package-result-card">
            <i class="fas ${packageIcon}"></i>
            <h3>${packageName}</h3>
            <div class="result-price">${packagePrice} <span>/ يوم</span></div>
        </div>
    `;
    
    reasonDiv.innerHTML = `
        <div class="reason-box">
            <i class="fas fa-lightbulb"></i>
            <p>${recommendation.reason}</p>
        </div>
    `;
    
    bookBtn.href = packageLink;
}

// Calculate recommendation based on user selections
function calculateRecommendation() {
    const { dogSize, dogAge, activityLevel, budget } = userSelections;
    
    // Decision logic
    let package = 'classic';
    let reason = '';
    
    // Budget-based primary decision
    if (budget === 'low') {
        package = 'day';
        reason = 'بناءً على ميزانيتك المحدودة، نوصي بـ "حزمة اليوم" وهي الخيار الأكثر اقتصادية وتوفر الرعاية الأساسية لكلبك.';
        
        // Adjust based on other factors
        if (activityLevel === 'very_active' || dogSize === 'large') {
            package = 'classic';
            reason = 'على الرغم من الميزانية المحدودة، نظراً لحجم كلبك الكبير ونشاطه العالي، نوصي بالترقية إلى "الحزمة الكلاسيكية" لمساحة أكبر وأنشطة أكثر.';
        }
    } else if (budget === 'high') {
        package = 'premium';
        reason = 'بناءً على ميزانيتك العالية، نوصي بـ "الحزمة المميزة" التي توفر أعلى مستوى من الرعاية والرفاهية لكلبك.';
    } else {
        // Medium budget - use other factors
        if (activityLevel === 'very_active' || dogSize === 'large') {
            package = 'premium';
            reason = 'نظراً لحجم كلبك الكبير ونشاطه العالي، "الحزمة المميزة" هي الأنسب提供一个更大的活动空间和更多的日常锻炼.';
        } else if (activityLevel === 'calm' || dogAge === 'senior') {
            package = 'classic';
            reason = 'بناءً على شخصية كلبك الهادئة/المسن، نوصي بـ "الحزمة الكلاسيكية" التي توفر توازناً مثالياً بين الراحة والنشاط.';
        } else if (dogAge === 'puppy') {
            package = 'classic';
            reason = 'الجراء تحتاج إلى اهتمام إضافي وأنشطة مناسبة لأعمارهم، والحزمة الكلاسيكية مثالية لذلك.';
        } else {
            reason = 'بناءً على اختياراتك، "الحزمة الكلاسيكية" هي الخيار الأمثل提供良好的护理服务和活动量的完美结合.';
        }
    }
    
    // Override for puppies with low budget
    if (dogAge === 'puppy' && budget === 'low') {
        package = 'day';
        reason = 'للجراء ذات الميزانية المحدودة، "حزمة اليوم" توفر الرعاية الأساسية الآمنة في بيئة مناسبة.';
    }
    
    return { package, reason };
}

// Close modal when clicking outside
document.addEventListener('DOMContentLoaded', function() {
    const recommenderModal = document.getElementById('packageRecommenderModal');
    
    if (recommenderModal) {
        recommenderModal.addEventListener('click', function(e) {
            if (e.target === recommenderModal) {
                closePackageRecommender();
            }
        });
    }
});

