// script.js

document.addEventListener('DOMContentLoaded', () => {
    document.body.classList.add('loaded');

    const searchInput = document.querySelector('.search-input');
    const allCards = document.querySelectorAll('.card:not(.no-results)');
    const noResultsMsg = document.querySelector('.no-results');
    const categoryButtons = document.querySelectorAll('.category-btn');

    // === ПОИСК (ваша логика сохранена) ===
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const filter = e.target.value.toLowerCase().trim();
            let hasVisibleCards = false;

            // Сбросить фильтр категорий при поиске
            if (filter !== '') {
                categoryButtons.forEach(btn => btn.classList.remove('active'));
                document.querySelector('.category-btn[data-category="all"]')?.classList.add('active');
            }

            allCards.forEach(card => {
                // Если поиск пуст:
                if (filter === '') {
                    // Если у карточки есть класс search-only, скрываем её
                    if (card.classList.contains('search-only')) {
                        card.classList.add('hidden');
                    } else {
                        // Топовые 4 показываем
                        card.classList.remove('hidden');
                    }
                    hasVisibleCards = true; 
                } else {
                    // Если поиск активен - ищем везде
                    const title = card.querySelector('h3')?.innerText.toLowerCase() || '';
                    const desc = card.querySelector('p')?.innerText.toLowerCase() || '';

                    if (title.includes(filter) || desc.includes(filter)) {
                        card.classList.remove('hidden');
                        hasVisibleCards = true;
                    } else {
                        card.classList.add('hidden');
                    }
                }
            });

            // Управление сообщением "Ничего не найдено"
            if (noResultsMsg) {
                noResultsMsg.style.display = (hasVisibleCards || filter === '') ? 'none' : 'block';
            }
        });
    }

    // === ФИЛЬТРЫ ПО КАТЕГОРИЯМ (новое) ===
    categoryButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const category = btn.dataset.category;
            
            // Обновить активную кнопку
            categoryButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Очистить поиск
            if (searchInput) searchInput.value = '';
            
            // Фильтрация карточек
            let hasVisibleCards = false;
            
            allCards.forEach(card => {
                const cardCategories = card.dataset.category || '';
                
                if (category === 'all') {
                    // Для "All Tools" показываем только топовые (без search-only)
                    if (card.classList.contains('search-only')) {
                        card.classList.add('hidden');
                    } else {
                        card.classList.remove('hidden');
                        hasVisibleCards = true;
                    }
                } else {
                    // Для конкретной категории показываем все подходящие
                    const isMatch = cardCategories.includes(category);
                    
                    if (isMatch) {
                        card.classList.remove('hidden');
                        hasVisibleCards = true;
                    } else {
                        card.classList.add('hidden');
                    }
                }
            });
            
            // Показать "Ничего не найдено"
            if (noResultsMsg) {
                noResultsMsg.style.display = hasVisibleCards ? 'none' : 'block';
            }
        });
    });
});

// === ПЛАВНЫЙ ПЕРЕХОД (ваш код сохранен) ===
document.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (!href || href.startsWith('#') || this.getAttribute('target') === '_blank') return;
        e.preventDefault();
        document.body.classList.remove('loaded');
        setTimeout(() => window.location.href = href, 500);
    });
});

// === ЭФФЕКТ СВЕЧЕНИЯ КУРСОРА НА КАРТОЧКАХ (ваш код сохранен) ===
document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
        card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
    });
});