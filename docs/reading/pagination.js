/**
 * 縦書き小説ページめくりシステム
 * Hand to Hand - Vertical Novel Reader
 */

class VerticalNovelReader {
    constructor() {
        // 状態管理
        this.currentPage = 1;
        this.totalPages = 0;
        this.isAnimating = false;
        this.pages = [];
        this.bookmarks = [];
        this.isMobile = false;
        
        // 設定
        this.settings = {
            fontSize: 18,
            lineHeight: 200,
            swipeSensitivity: 50,
            darkMode: false,
            lastReadPage: 1
        };
        
        // DOM要素
        this.elements = {};
        
        this.init();
    }
    
    /**
     * 初期化
     */
    init() {
        this.detectDevice();
        this.cacheElements();
        this.loadSettings();
        this.setupPages();
        this.setupEventListeners();
        this.setupSwipe();
        this.setupKeyboard();
        this.updateProgress();
        this.hideLoading();
        
        // デバッグ用にグローバルに公開
        window.novelReader = this;
    }
    
    /**
     * デバイス検出
     */
    detectDevice() {
        this.isMobile = window.innerWidth <= 768;
        console.log(`デバイス: ${this.isMobile ? 'モバイル' : 'デスクトップ'}`);
    }
    
    /**
     * DOM要素のキャッシュ
     */
    cacheElements() {
        this.elements = {
            // 本のコンテナ
            bookContainer: document.getElementById('book-container'),
            
            // ナビゲーション
            prevBtn: document.getElementById('prev-btn'),
            nextBtn: document.getElementById('next-btn'),
            currentPage: document.getElementById('current-page'),
            totalPages: document.getElementById('total-pages'),
            
            // 設定
            settingsToggle: document.getElementById('settings-toggle'),
            settingsPanel: document.getElementById('settings-panel'),
            closeSettings: document.getElementById('close-settings'),
            fontSize: document.getElementById('font-size'),
            fontSizeValue: document.getElementById('font-size-value'),
            lineHeight: document.getElementById('line-height'),
            lineHeightValue: document.getElementById('line-height-value'),
            swipeSensitivity: document.getElementById('swipe-sensitivity'),
            sensitivityValue: document.getElementById('sensitivity-value'),
            themeToggle: document.getElementById('theme-toggle'),
            
            // 目次
            tocToggle: document.getElementById('toc-toggle'),
            tocOverlay: document.getElementById('toc-overlay'),
            closeToc: document.getElementById('close-toc'),
            tocList: document.getElementById('toc-list'),
            
            // しおり
            bookmarkBtn: document.getElementById('bookmark-btn'),
            bookmarkOverlay: document.getElementById('bookmark-overlay'),
            closeBookmark: document.getElementById('close-bookmark'),
            bookmarkList: document.getElementById('bookmark-list'),
            addBookmark: document.getElementById('add-bookmark'),
            
            // 進捗
            progressFill: document.getElementById('progress-fill'),
            progressText: document.getElementById('progress-text'),
            
            // 操作案内
            swipeHint: document.getElementById('swipe-hint'),
            keyboardHint: document.getElementById('keyboard-hint'),
            
            // 読み込みインジケーター
            loadingIndicator: document.getElementById('loading-indicator')
        };
    }
    
    /**
     * 設定の読み込み
     */
    loadSettings() {
        const savedSettings = localStorage.getItem('novelReaderSettings');
        if (savedSettings) {
            this.settings = { ...this.settings, ...JSON.parse(savedSettings) };
        }
        
        // 最終読了ページの復元
        const lastPage = localStorage.getItem('lastReadPage');
        if (lastPage) {
            this.settings.lastReadPage = parseInt(lastPage);
        }
        
        // しおりの読み込み
        const savedBookmarks = localStorage.getItem('novelBookmarks');
        if (savedBookmarks) {
            this.bookmarks = JSON.parse(savedBookmarks);
        }
        
        // 設定の適用
        this.applySettings();
    }
    
    /**
     * 設定の適用
     */
    applySettings() {
        // フォントサイズ
        this.elements.fontSize.value = this.settings.fontSize;
        this.elements.fontSizeValue.textContent = `${this.settings.fontSize}px`;
        document.querySelectorAll('.vertical-text').forEach(text => {
            text.style.fontSize = `${this.settings.fontSize}px`;
        });
        
        // 行間
        this.elements.lineHeight.value = this.settings.lineHeight;
        this.elements.lineHeightValue.textContent = (this.settings.lineHeight / 100).toFixed(1);
        document.querySelectorAll('.vertical-text').forEach(text => {
            text.style.lineHeight = `${this.settings.lineHeight}%`;
        });
        
        // スワイプ感度
        this.elements.swipeSensitivity.value = this.settings.swipeSensitivity;
        this.updateSensitivityText();
        
        // ダークモード
        if (this.settings.darkMode) {
            document.body.classList.add('dark-mode');
            this.elements.themeToggle.innerHTML = '<i class="fas fa-sun"></i><span>ライトモード</span>';
        }
        
        // 最終読了ページへ移動
        this.goToPage(this.settings.lastReadPage);
    }
    
    /**
     * スワイプ感度のテキスト更新
     */
    updateSensitivityText() {
        const value = this.settings.swipeSensitivity;
        let text = '標準';
        
        if (value <= 30) text = '低';
        else if (value >= 70) text = '高';
        
        this.elements.sensitivityValue.textContent = text;
    }
    
    /**
     * ページのセットアップ
     */
    setupPages() {
        this.pages = Array.from(document.querySelectorAll('.page'));
        this.totalPages = this.pages.length;
        this.elements.totalPages.textContent = this.totalPages;
        
        // 目次の生成
        this.generateTableOfContents();
    }
    
    /**
     * 目次の生成
     */
    generateTableOfContents() {
        const tocList = this.elements.tocList;
        tocList.innerHTML = '';
        
        // 章を見つける
        const chapters = this.pages.filter(page => {
            return page.querySelector('.chapter-header') !== null;
        });
        
        if (chapters.length === 0) {
            // 章がない場合はすべてのページを目次に追加
            this.pages.forEach((page, index) => {
                const pageNum = index + 1;
                const li = document.createElement('li');
                li.className = 'toc-item';
                li.dataset.page = pageNum;
                li.innerHTML = `
                    <span class="toc-page">${pageNum}</span>
                    <span class="toc-title">ページ ${pageNum}</span>
                `;
                li.addEventListener('click', () => {
                    this.goToPage(pageNum);
                    this.closeTocOverlay();
                });
                tocList.appendChild(li);
            });
        } else {
            // 章ごとに目次を追加
            chapters.forEach((chapter, index) => {
                const pageNum = parseInt(chapter.dataset.page);
                const chapterHeader = chapter.querySelector('.chapter-header');
                const chapterMarker = chapterHeader.querySelector('.chapter-marker').textContent;
                const chapterTitle = chapterHeader.querySelector('.chapter-title').textContent;
                
                const li = document.createElement('li');
                li.className = 'toc-item';
                li.dataset.page = pageNum;
                li.innerHTML = `
                    <span class="toc-page">${pageNum}</span>
                    <span class="toc-title">${chapterMarker} ${chapterTitle}</span>
                `;
                li.addEventListener('click', () => {
                    this.goToPage(pageNum);
                    this.closeTocOverlay();
                });
                tocList.appendChild(li);
            });
        }
    }
    
    /**
     * イベントリスナーの設定
     */
    setupEventListeners() {
        // 前のページボタン
        this.elements.prevBtn.addEventListener('click', () => {
            this.prevPage();
        });
        
        // 次のページボタン
        this.elements.nextBtn.addEventListener('click', () => {
            this.nextPage();
        });
        
        // 設定パネル
        this.elements.settingsToggle.addEventListener('click', () => {
            this.toggleSettingsPanel();
        });
        
        this.elements.closeSettings.addEventListener('click', () => {
            this.closeSettingsPanel();
        });
        
        // 設定の変更
        this.elements.fontSize.addEventListener('input', (e) => {
            this.changeFontSize(e.target.value);
        });
        
        this.elements.lineHeight.addEventListener('input', (e) => {
            this.changeLineHeight(e.target.value);
        });
        
        this.elements.swipeSensitivity.addEventListener('input', (e) => {
            this.changeSwipeSensitivity(e.target.value);
        });
        
        // テーマ切り替え
        this.elements.themeToggle.addEventListener('click', () => {
            this.toggleTheme();
        });
        
        // 目次
        this.elements.tocToggle.addEventListener('click', () => {
            this.openTocOverlay();
        });
        
        this.elements.closeToc.addEventListener('click', () => {
            this.closeTocOverlay();
        });
        
        // しおり
        this.elements.bookmarkBtn.addEventListener('click', () => {
            this.openBookmarkOverlay();
        });
        
        this.elements.closeBookmark.addEventListener('click', () => {
            this.closeBookmarkOverlay();
        });
        
        this.elements.addBookmark.addEventListener('click', () => {
            this.addBookmark();
        });
        
        // ページクリック（進む/戻る）
        this.elements.bookContainer.addEventListener('click', (e) => {
            // 設定パネルや目次が開いている場合は無視
            if (this.elements.settingsPanel.classList.contains('active') ||
                this.elements.tocOverlay.classList.contains('active') ||
                this.elements.bookmarkOverlay.classList.contains('active')) {
                return;
            }
            
            const rect = this.elements.bookContainer.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const containerWidth = rect.width;
            
            // モバイルでは左右40%、デスクトップでは33%をタップ領域に
            const tapZoneRatio = this.isMobile ? 0.4 : 0.33;
            
            if (clickX > containerWidth * (1 - tapZoneRatio)) {
                this.nextPage(); // 右側タップで次ページ
            } else if (clickX < containerWidth * tapZoneRatio) {
                this.prevPage(); // 左側タップで前ページ
            }
        });
        
        // ウィンドウリサイズ
        window.addEventListener('resize', () => {
            this.detectDevice();
            this.updateSwipeHint();
        });
        
        // ハッシュ変更（ページ直接アクセス用）
        window.addEventListener('hashchange', () => {
            if (window.location.hash) {
                const match = window.location.hash.match(/page-(\d+)/);
                if (match) {
                    const pageNum = parseInt(match[1]);
                    this.goToPage(pageNum);
                }
            }
        });
        
        // 設定パネル外をクリックで閉じる
        document.addEventListener('click', (e) => {
            if (this.elements.settingsPanel.classList.contains('active') &&
                !this.elements.settingsPanel.contains(e.target) &&
                !this.elements.settingsToggle.contains(e.target)) {
                this.closeSettingsPanel();
            }
        });
    }
    
    /**
     * スワイプ操作の設定
     */
    setupSwipe() {
        let startX = 0;
        let startY = 0;
        let startTime = 0;
        
        // タッチ開始
        this.elements.bookContainer.addEventListener('touchstart', (e) => {
            // 設定パネルや目次が開いている場合は無視
            if (this.elements.settingsPanel.classList.contains('active') ||
                this.elements.tocOverlay.classList.contains('active') ||
                this.elements.bookmarkOverlay.classList.contains('active')) {
                return;
            }
            
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            startTime = Date.now();
        }, { passive: true });
        
        // タッチ移動（縦スクロール防止）
        this.elements.bookContainer.addEventListener('touchmove', (e) => {
            if (!startX) return;
            
            const currentX = e.touches[0].clientX;
            const diffX = startX - currentX;
            
            // 横スワイプがメインの場合、縦スクロールを防止
            if (Math.abs(diffX) > 10) {
                e.preventDefault();
            }
        }, { passive: false });
        
        // タッチ終了
        this.elements.bookContainer.addEventListener('touchend', (e) => {
            if (!startX) return;
            
            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;
            const endTime = Date.now();
            
            const diffX = startX - endX;
            const diffY = startY - endY;
            const timeDiff = endTime - startTime;
            
            // 縦スワイプが大きすぎる場合は無視（スクロールと区別）
            const maxVerticalSwipe = 30;
            if (Math.abs(diffY) > maxVerticalSwipe && Math.abs(diffY) > Math.abs(diffX)) {
                startX = 0;
                startY = 0;
                return;
            }
            
            // スワイプ速度と距離で判定
            const swipeVelocity = Math.abs(diffX) / timeDiff;
            const isFastSwipe = swipeVelocity > 0.3; // 速いスワイプ
            
            // 感度に基づく閾値
            const threshold = 50 - (this.settings.swipeSensitivity - 50) / 2;
            
            if (Math.abs(diffX) > threshold || isFastSwipe) {
                if (diffX > 0) {
                    this.nextPage(); // 左にスワイプで次ページ
                } else {
                    this.prevPage(); // 右にスワイプで前ページ
                }
            }
            
            startX = 0;
            startY = 0;
        });
    }
    
    /**
     * キーボード操作の設定
     */
    setupKeyboard() {
        document.addEventListener('keydown', (e) => {
            // 設定パネルや目次が開いている場合は無視
            if (this.elements.settingsPanel.classList.contains('active') ||
                this.elements.tocOverlay.classList.contains('active') ||
                this.elements.bookmarkOverlay.classList.contains('active')) {
                return;
            }
            
            // 入力フィールドにフォーカスがある場合は無視
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                return;
            }
            
            switch(e.key) {
                case 'ArrowRight':
                case ' ':
                case 'PageDown':
                    e.preventDefault();
                    this.nextPage();
                    break;
                    
                case 'ArrowLeft':
                case 'PageUp':
                    e.preventDefault();
                    this.prevPage();
                    break;
                    
                case 'Home':
                    e.preventDefault();
                    this.goToPage(1);
                    break;
                    
                case 'End':
                    e.preventDefault();
                    this.goToPage(this.totalPages);
                    break;
                    
                case 'Escape':
                    this.closeSettingsPanel();
                    this.closeTocOverlay();
                    this.closeBookmarkOverlay();
                    break;
                    
                case 'b':
                case 'B':
                    if (e.ctrlKey || e.metaKey) {
                        e.preventDefault();
                        this.openBookmarkOverlay();
                    }
                    break;
                    
                case 't':
                case 'T':
                    if (e.ctrlKey || e.metaKey) {
                        e.preventDefault();
                        this.openTocOverlay();
                    }
                    break;
            }
        });
    }
    
    /**
     * 前のページへ
     */
    prevPage() {
        if (this.isAnimating || this.currentPage <= 1) return;
        this.goToPage(this.currentPage - 1);
    }
    
    /**
     * 次のページへ
     */
    nextPage() {
        if (this.isAnimating || this.currentPage >= this.totalPages) return;
        this.goToPage(this.currentPage + 1);
    }
    
    /**
     * 指定したページへ移動
     */
    goToPage(pageNumber) {
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
        this.elements.currentPage.textContent = pageNumber;
        
        // ボタンの状態を更新
        this.elements.prevBtn.disabled = pageNumber === 1;
        this.elements.nextBtn.disabled = pageNumber === this.totalPages;
        
        // 進捗を更新
        this.updateProgress();
        
        // 目次アイテムのアクティブ状態を更新
        this.updateActiveTocItem();
        
        // URLハッシュを更新（ブックマーク用）
        window.history.replaceState(null, null, `#page-${pageNumber}`);
        
        // 最終読了ページを保存
        this.saveLastReadPage();
        
        // アニメーション完了後に状態をリセット
        setTimeout(() => {
            currentActivePage.classList.remove('previous', 'next');
            this.isAnimating = false;
        }, 500);
    }
    
    /**
     * 進捗の更新
     */
    updateProgress() {
        const progress = (this.currentPage / this.totalPages) * 100;
        this.elements.progressFill.style.width = `${progress}%`;
        this.elements.progressText.textContent = `${Math.round(progress)}%`;
    }
    
    /**
     * アクティブな目次アイテムの更新
     */
    updateActiveTocItem() {
        const tocItems = this.elements.tocList.querySelectorAll('.toc-item');
        tocItems.forEach(item => {
            const pageNum = parseInt(item.dataset.page);
            if (pageNum <= this.currentPage) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }
    
    /**
     * フォントサイズの変更
     */
    changeFontSize(size) {
        this.settings.fontSize = parseInt(size);
        this.elements.fontSizeValue.textContent = `${size}px`;
        
        document.querySelectorAll('.vertical-text').forEach(text => {
            text.style.fontSize = `${size}px`;
        });
        
        this.saveSettings();
    }
    
    /**
     * 行間の変更
     */
    changeLineHeight(height) {
        this.settings.lineHeight = parseInt(height);
        this.elements.lineHeightValue.textContent = (height / 100).toFixed(1);
        
        document.querySelectorAll('.vertical-text').forEach(text => {
            text.style.lineHeight = `${height}%`;
        });
        
        this.saveSettings();
    }
    
    /**
     * スワイプ感度の変更
     */
    changeSwipeSensitivity(sensitivity) {
        this.settings.swipeSensitivity = parseInt(sensitivity);
        this.updateSensitivityText();
        this.saveSettings();
    }
    
    /**
     * テーマの切り替え
     */
    toggleTheme() {
        this.settings.darkMode = !this.settings.darkMode;
        
        if (this.settings.darkMode) {
            document.body.classList.add('dark-mode');
            this.elements.themeToggle.innerHTML = '<i class="fas fa-sun"></i><span>ライトモード</span>';
        } else {
            document.body.classList.remove('dark-mode');
            this.elements.themeToggle.innerHTML = '<i class="fas fa-moon"></i><span>ダークモード</span>';
        }
        
        this.saveSettings();
    }
    
    /**
     * 設定パネルの開閉
     */
    toggleSettingsPanel() {
        this.elements.settingsPanel.classList.toggle('active');
    }
    
    /**
     * 設定パネルを閉じる
     */
    closeSettingsPanel() {
        this.elements.settingsPanel.classList.remove('active');
    }
    
    /**
     * 目次オーバーレイを開く
     */
    openTocOverlay() {
        this.elements.tocOverlay.classList.add('active');
    }
    
    /**
     * 目次オーバーレイを閉じる
     */
    closeTocOverlay() {
        this.elements.tocOverlay.classList.remove('active');
    }
    
    /**
     * しおりオーバーレイを開く
     */
    openBookmarkOverlay() {
        this.renderBookmarks();
        this.elements.bookmarkOverlay.classList.add('active');
    }
    
    /**
     * しおりオーバーレイを閉じる
     */
    closeBookmarkOverlay() {
        this.elements.bookmarkOverlay.classList.remove('active');
    }
    
    /**
     * しおりの追加
     */
    addBookmark() {
        const existingIndex = this.bookmarks.findIndex(b => b.page === this.currentPage);
        
        if (existingIndex !== -1) {
            // すでにしおりがある場合は削除
            this.bookmarks.splice(existingIndex, 1);
        } else {
            // 新しいしおりを追加
            const now = new Date();
            const bookmark = {
                page: this.currentPage,
                date: now.toISOString(),
                title: `ページ ${this.currentPage}`
            };
            
            // 章タイトルがあれば追加
            const currentPageEl = this.pages[this.currentPage - 1];
            const chapterHeader = currentPageEl.querySelector('.chapter-header');
            if (chapterHeader) {
                const chapterMarker = chapterHeader.querySelector('.chapter-marker').textContent;
                const chapterTitle = chapterHeader.querySelector('.chapter-title').textContent;
                bookmark.title = `${chapterMarker} ${chapterTitle}`;
            }
            
            this.bookmarks.push(bookmark);
            
            // 日付でソート（新しい順）
            this.bookmarks.sort((a, b) => new Date(b.date) - new Date(a.date));
        }
        
        // 保存
        this.saveBookmarks();
        
        // 表示を更新
        this.renderBookmarks();
        
        // ボタンのテキストを更新
        this.updateBookmarkButton();
    }
    
    /**
     * しおりの表示
     */
    renderBookmarks() {
        const bookmarkList = this.elements.bookmarkList;
        
        if (this.bookmarks.length === 0) {
            bookmarkList.innerHTML = `
                <div class="no-bookmarks">
                    <i class="far fa-bookmark" style="font-size: 2rem; margin-bottom: 10px; opacity: 0.5;"></i>
                    <p>しおりが保存されていません</p>
                </div>
            `;
            return;
        }
        
        bookmarkList.innerHTML = '';
        
        this.bookmarks.forEach((bookmark, index) => {
            const date = new Date(bookmark.date);
            const formattedDate = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
            
            const div = document.createElement('div');
            div.className = 'bookmark-item';
            div.innerHTML = `
                <div class="bookmark-info">
                    <div class="bookmark-page">${bookmark.title}</div>
                    <div class="bookmark-date">${formattedDate} 追加</div>
                </div>
                <div class="bookmark-actions">
                    <button class="bookmark-action-btn goto-bookmark" data-page="${bookmark.page}" title="このページへ移動">
                        <i class="fas fa-external-link-alt"></i>
                    </button>
                    <button class="bookmark-action-btn delete-bookmark" data-index="${index}" title="しおりを削除">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            
            bookmarkList.appendChild(div);
        });
        
        // イベントリスナーの追加
        document.querySelectorAll('.goto-bookmark').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const page = parseInt(e.currentTarget.dataset.page);
                this.goToPage(page);
                this.closeBookmarkOverlay();
            });
        });
        
        document.querySelectorAll('.delete-bookmark').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.currentTarget.dataset.index);
                this.bookmarks.splice(index, 1);
                this.saveBookmarks();
                this.renderBookmarks();
                this.updateBookmarkButton();
            });
        });
    }
    
    /**
     * しおりボタンの更新
     */
    updateBookmarkButton() {
        const hasBookmark = this.bookmarks.some(b => b.page === this.currentPage);
        const icon = hasBookmark ? 'fas' : 'far';
        
        this.elements.bookmarkBtn.innerHTML = `
            <i class="${icon} fa-bookmark"></i>
            <span>${hasBookmark ? 'しおり済み' : 'しおり'}</span>
        `;
    }
    
    /**
     * スワイプ案内の更新
     */
    updateSwipeHint() {
        if (this.isMobile) {
            this.elements.swipeHint.style.display = 'flex';
            this.elements.keyboardHint.style.display = 'none';
        } else {
            this.elements.swipeHint.style.display = 'none';
            this.elements.keyboardHint.style.display = 'flex';
        }
    }
    
    /**
     * 設定の保存
     */
    saveSettings() {
        localStorage.setItem('novelReaderSettings', JSON.stringify(this.settings));
    }
    
    /**
     * 最終読了ページの保存
     */
    saveLastReadPage() {
        localStorage.setItem('lastReadPage', this.currentPage.toString());
    }
    
    /**
     * しおりの保存
     */
    saveBookmarks() {
        localStorage.setItem('novelBookmarks', JSON.stringify(this.bookmarks));
        this.updateBookmarkButton();
    }
    
    /**
     * 読み込みインジケーターを隠す
     */
    hideLoading() {
        setTimeout(() => {
            this.elements.loadingIndicator.classList.add('hidden');
        }, 500);
    }
}

// ページ読み込み時に初期化
document.addEventListener('DOMContentLoaded', () => {
    const reader = new VerticalNovelReader();
    
    // ハッシュからページを読み込む
    if (window.location.hash) {
        const match = window.location.hash.match(/page-(\d+)/);
        if (match) {
            const pageNum = parseInt(match[1]);
            setTimeout(() => reader.goToPage(pageNum), 300);
        }
    }
});