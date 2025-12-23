class VerticalNovelReader {
    constructor() {
        this.currentPage = 1;
        this.totalPages = 0;
        this.isAnimating = false;
        this.pages = [];
        
        this.init();
    }
    
    init() {
        // DOM要素の取得
        this.bookContainer = document.querySelector('.book-container');
        this.prevBtn = document.getElementById('prev-btn');
        this.nextBtn = document.getElementById('next-btn');
        this.currentPageSpan = document.getElementById('current-page');
        this.totalPagesSpan = document.getElementById('total-pages');
        this.settingsToggle = document.getElementById('settings-toggle');
        this.settingsPanel = document.querySelector('.settings-panel');
        this.fontSizeSlider = document.getElementById('font-size');
        this.fontSizeValue = document.getElementById('font-size-value');
        this.themeToggle = document.getElementById('theme-toggle');
        
        // ページ要素の収集
        this.pages = Array.from(document.querySelectorAll('.page'));
        this.totalPages = this.pages.length;
        this.totalPagesSpan.textContent = this.totalPages;
        
        // 初期ページを表示
        this.showPage(this.currentPage);
        
        // イベントリスナーの設定
        this.setupEventListeners();
        
        // スワイプ操作の設定
        this.setupSwipe();
        
        // キーボード操作の設定
        this.setupKeyboard();
        
        // 設定パネルの状態を初期化
        this.settingsPanel.classList.add('hidden');
    }
    
    setupEventListeners() {
        // 前のページボタン
        this.prevBtn.addEventListener('click', () => {
            this.prevPage();
        });
        
        // 次のページボタン
        this.nextBtn.addEventListener('click', () => {
            this.nextPage();
        });
        
        // 設定パネルの表示/非表示
        this.settingsToggle.addEventListener('click', () => {
            this.settingsPanel.classList.toggle('hidden');
        });
        
        // フォントサイズの変更
        this.fontSizeSlider.addEventListener('input', (e) => {
            const fontSize = e.target.value + 'px';
            document.querySelectorAll('.vertical-text').forEach(text => {
                text.style.fontSize = fontSize;
            });
            this.fontSizeValue.textContent = fontSize;
        });
        
        // テーマ切り替え
        this.themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            this.themeToggle.textContent = document.body.classList.contains('dark-mode') 
                ? '☀️ ライトモード' 
                : '🌙 ダークモード';
        });
        
        // ページクリック（進む/戻る）
        this.bookContainer.addEventListener('click', (e) => {
            // 設定パネルが開いている場合は無視
            if (!this.settingsPanel.classList.contains('hidden')) return;
            
            const rect = this.bookContainer.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const containerWidth = rect.width;
            
            // 右側2/3をクリックで次ページ、左側1/3で前ページ
            if (clickX > containerWidth * 0.66) {
                this.nextPage();
            } else if (clickX < containerWidth * 0.33) {
                this.prevPage();
            }
        });
    }
    
    setupSwipe() {
        let startX = 0;
        let startY = 0;
        let startTime = 0;
        
        this.bookContainer.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            startTime = Date.now();
        }, { passive: true });
        
        this.bookContainer.addEventListener('touchend', (e) => {
            if (!startX) return;
            
            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;
            const endTime = Date.now();
            
            const diffX = startX - endX;
            const diffY = startY - endY;
            const timeDiff = endTime - startTime;
            
            // 横スワイプを検出（縦スクロール防止）
            if (Math.abs(diffX) > Math.abs(diffY) && 
                Math.abs(diffX) > 30 && 
                timeDiff < 300) {
                if (diffX > 0) {
                    this.nextPage(); // 左にスワイプ
                } else {
                    this.prevPage(); // 右にスワイプ
                }
            }
            
            startX = 0;
            startY = 0;
        });
    }
    
    setupKeyboard() {
        document.addEventListener('keydown', (e) => {
            // 設定パネルが開いている場合は無視
            if (!this.settingsPanel.classList.contains('hidden')) return;
            
            if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
                e.preventDefault();
                this.nextPage();
            } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
                e.preventDefault();
                this.prevPage();
            }
        });
    }
    
    nextPage() {
        if (this.isAnimating || this.currentPage >= this.totalPages) return;
        this.showPage(this.currentPage + 1);
    }
    
    prevPage() {
        if (this.isAnimating || this.currentPage <= 1) return;
        this.showPage(this.currentPage - 1);
    }
    
    showPage(pageNumber) {
        if (this.isAnimating || pageNumber < 1 || pageNumber > this.totalPages) return;
        
        this.isAnimating = true;
        
        // 現在のページを非アクティブに
        const currentActivePage = this.pages[this.currentPage - 1];
        const direction = pageNumber > this.currentPage ? 'next' : 'prev';
        
        currentActivePage.classList.remove('active');
        currentActivePage.classList.add(direction === 'next' ? 'previous' : 'next');
        
        // 新しいページをアクティブに
        const newPage = this.pages[pageNumber - 1];
        newPage.classList.remove('previous', 'next');
        newPage.classList.add('active');
        
        // 状態を更新
        this.currentPage = pageNumber;
        this.currentPageSpan.textContent = pageNumber;
        
        // ボタンの状態を更新
        this.prevBtn.disabled = pageNumber === 1;
        this.nextBtn.disabled = pageNumber === this.totalPages;
        
        // URLハッシュを更新（ブックマーク用）
        window.location.hash = `page-${pageNumber}`;
        
        // アニメーション完了後に状態をリセット
        setTimeout(() => {
            currentActivePage.classList.remove('previous', 'next');
            this.isAnimating = false;
        }, 500);
    }
    
    // 外部からのページジャンプ用
    goToPage(pageNumber) {
        if (pageNumber >= 1 && pageNumber <= this.totalPages) {
            this.showPage(pageNumber);
        }
    }
}

// ページ読み込み時に初期化
document.addEventListener('DOMContentLoaded', () => {
    const reader = new VerticalNovelReader();
    
    // グローバルにアクセスできるように（開発用）
    window.novelReader = reader;
    
    // ハッシュからページを読み込む
    if (window.location.hash) {
        const match = window.location.hash.match(/page-(\d+)/);
        if (match) {
            const pageNum = parseInt(match[1]);
            setTimeout(() => reader.goToPage(pageNum), 100);
        }
    }
    
    // 設定パネル外をクリックで閉じる
    document.addEventListener('click', (e) => {
        const settingsPanel = document.querySelector('.settings-panel');
        const settingsToggle = document.getElementById('settings-toggle');
        
        if (!settingsPanel.classList.contains('hidden') && 
            !settingsPanel.contains(e.target) && 
            !settingsToggle.contains(e.target)) {
            settingsPanel.classList.add('hidden');
        }
    });
});