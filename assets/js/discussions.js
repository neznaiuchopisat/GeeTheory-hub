// ========================================
// DISCUSSIONS MANAGEMENT SYSTEM
// ========================================

let currentReplyId = null;
let discussions = [];

// Initialize discussions on page load
document.addEventListener('DOMContentLoaded', function() {
    loadDiscussions();
    renderDiscussions();
});

// ========================================
// LOAD AND SAVE DISCUSSIONS
// ========================================

function loadDiscussions() {
    const saved = localStorage.getItem('geetheory_discussions');
    if (saved) {
        discussions = JSON.parse(saved);
    } else {
        // Create default discussion
        discussions = [
            {
                id: Date.now(),
                title: 'Самия "Цундере" персонаж в Deltarune',
                content: 'Мисля, че Noelle е най-добрия пример на цундере архетип в Deltarune. През първата част виждаме как тя е мразовна към Kris, но с течение на времето вижда нейната истинска природа - деликатна и загрижена. Но в "Snowgrave" рутата... е вещо совсем различно. Цунцунцун характера й се преобразува в нещо по-мрачно и по-сложно. Какво мислите вие? Има ли друг персонаж, който притежава тези черти по-добре от Noelle?',
                game: 'deltarune',
                author: 'GeeTheory Admin',
                timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
                likes: 23,
                dislikes: 2,
                userLiked: false,
                userDisliked: false,
                replies: [
                    {
                        id: Date.now() + 1,
                        author: 'Теория фен',
                        content: 'Согласен! Noelle е наистина интересен персонаж. Цунцунцун характера й е много добре написан.',
                        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
                        likes: 8,
                        dislikes: 0,
                        userLiked: false,
                        userDisliked: false
                    },
                    {
                        id: Date.now() + 2,
                        author: 'Undertale фенат',
                        content: 'Но аз мисля, че Alphys е по-добър цундере персонаж, ако го мислим на това ниво.',
                        timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
                        likes: 5,
                        dislikes: 3,
                        userLiked: false,
                        userDisliked: false
                    }
                ]
            }
        ];
        saveDiscussions();
    }
}

function saveDiscussions() {
    localStorage.setItem('geetheory_discussions', JSON.stringify(discussions));
}

// ========================================
// RENDER DISCUSSIONS
// ========================================

function renderDiscussions() {
    const container = document.getElementById('discussionsContainer');
    container.innerHTML = '';

    if (discussions.length === 0) {
        container.innerHTML = '<div class="empty-discussions"><p>Все още няма дискусии. Създай първата!</p></div>';
        return;
    }

    discussions.forEach(discussion => {
        const discussionEl = createDiscussionElement(discussion);
        container.appendChild(discussionEl);
    });
}

function createDiscussionElement(discussion) {
    const div = document.createElement('div');
    div.className = 'discussion-card';
    
    const gameColors = {
        'fnaf': '#8B6BA8',
        'undertale': '#000000',
        'deltarune': '#000000',
        'mario': '#D4A500',
        'zelda': '#7CB342',
        'resident-evil': '#8B6B47',
        'roblox': '#FFFFFF',
        'other': '#816FD1'
    };

    const gameNames = {
        'fnaf': 'FNAF',
        'undertale': 'Undertale',
        'deltarune': 'Deltarune',
        'mario': 'Mario',
        'zelda': 'Zelda',
        'resident-evil': 'Resident Evil',
        'roblox': 'Roblox',
        'other': 'Друга'
    };

    const timeAgo = getTimeAgo(discussion.timestamp);
    const gameColor = gameColors[discussion.game] || '#816FD1';
    const gameName = gameNames[discussion.game] || 'Неизвестна';

    div.innerHTML = `
        <div class="discussion-header">
            <div class="discussion-title-section">
                <h3 class="discussion-title">${escapeHtml(discussion.title)}</h3>
                <span class="game-tag" style="background-color: ${gameColor}; color: ${getContrastColor(gameColor)};">
                    ${gameName}
                </span>
            </div>
            <div class="discussion-meta">
                <span class="discussion-author">от ${escapeHtml(discussion.author)}</span>
                <span class="discussion-time">${timeAgo}</span>
            </div>
        </div>

        <div class="discussion-content">
            ${escapeHtml(discussion.content)}
        </div>

        <div class="discussion-footer">
            <div class="discussion-actions">
                <button class="action-btn like-btn ${discussion.userLiked ? 'active' : ''}" 
                        onclick="toggleLike(${discussion.id})">
                    👍 ${discussion.likes}
                </button>
                <button class="action-btn dislike-btn ${discussion.userDisliked ? 'active' : ''}" 
                        onclick="toggleDislike(${discussion.id})">
                    👎 ${discussion.dislikes}
                </button>
                <button class="action-btn reply-btn" onclick="openReplyModal(${discussion.id})">
                    💬 Отговори (${discussion.replies ? discussion.replies.length : 0})
                </button>
            </div>
        </div>

        <div class="discussion-replies" id="replies-${discussion.id}">
            ${renderReplies(discussion.replies, discussion.id)}
        </div>
    `;

    return div;
}

function renderReplies(replies, discussionId) {
    if (!replies || replies.length === 0) {
        return '';
    }

    let html = '<div class="replies-section">';
    replies.forEach(reply => {
        const timeAgo = getTimeAgo(reply.timestamp);
        html += `
            <div class="reply-card">
                <div class="reply-header">
                    <strong class="reply-author">${escapeHtml(reply.author)}</strong>
                    <span class="reply-time">${timeAgo}</span>
                </div>
                <div class="reply-content">
                    ${escapeHtml(reply.content)}
                </div>
                <div class="reply-actions">
                    <button class="reply-action-btn ${reply.userLiked ? 'active' : ''}" 
                            onclick="toggleReplyLike(${discussionId}, ${reply.id})">
                        👍 ${reply.likes}
                    </button>
                    <button class="reply-action-btn ${reply.userDisliked ? 'active' : ''}" 
                            onclick="toggleReplyDislike(${discussionId}, ${reply.id})">
                        👎 ${reply.dislikes}
                    </button>
                </div>
            </div>
        `;
    });
    html += '</div>';
    return html;
}

// ========================================
// CREATE DISCUSSION
// ========================================

function toggleCreateForm() {
    const form = document.getElementById('createForm');
    form.classList.toggle('hidden');
}

function createDiscussion(event) {
    event.preventDefault();

    const title = document.getElementById('titleInput').value;
    const content = document.getElementById('contentInput').value;
    const game = document.getElementById('gameInput').value;

    if (!title || !content || !game) {
        alert('Моля, попълни всички полета!');
        return;
    }

    const newDiscussion = {
        id: Date.now(),
        title: title,
        content: content,
        game: game,
        author: 'Ти',
        timestamp: new Date().toISOString(),
        likes: 0,
        dislikes: 0,
        userLiked: false,
        userDisliked: false,
        replies: []
    };

    discussions.unshift(newDiscussion);
    saveDiscussions();
    renderDiscussions();

    // Clear form
    document.getElementById('titleInput').value = '';
    document.getElementById('contentInput').value = '';
    document.getElementById('gameInput').value = '';
    
    toggleCreateForm();
    alert('Твоята дискусия е публикувана! Благодаря на теб! 🎉');
}

// ========================================
// LIKES AND DISLIKES
// ========================================

function toggleLike(discussionId) {
    const discussion = discussions.find(d => d.id === discussionId);
    if (!discussion) return;

    if (discussion.userLiked) {
        discussion.likes--;
        discussion.userLiked = false;
    } else {
        discussion.likes++;
        discussion.userLiked = true;
        if (discussion.userDisliked) {
            discussion.dislikes--;
            discussion.userDisliked = false;
        }
    }

    saveDiscussions();
    renderDiscussions();
}

function toggleDislike(discussionId) {
    const discussion = discussions.find(d => d.id === discussionId);
    if (!discussion) return;

    if (discussion.userDisliked) {
        discussion.dislikes--;
        discussion.userDisliked = false;
    } else {
        discussion.dislikes++;
        discussion.userDisliked = true;
        if (discussion.userLiked) {
            discussion.likes--;
            discussion.userLiked = false;
        }
    }

    saveDiscussions();
    renderDiscussions();
}

function toggleReplyLike(discussionId, replyId) {
    const discussion = discussions.find(d => d.id === discussionId);
    if (!discussion) return;

    const reply = discussion.replies.find(r => r.id === replyId);
    if (!reply) return;

    if (reply.userLiked) {
        reply.likes--;
        reply.userLiked = false;
    } else {
        reply.likes++;
        reply.userLiked = true;
        if (reply.userDisliked) {
            reply.dislikes--;
            reply.userDisliked = false;
        }
    }

    saveDiscussions();
    renderDiscussions();
}

function toggleReplyDislike(discussionId, replyId) {
    const discussion = discussions.find(d => d.id === discussionId);
    if (!discussion) return;

    const reply = discussion.replies.find(r => r.id === replyId);
    if (!reply) return;

    if (reply.userDisliked) {
        reply.dislikes--;
        reply.userDisliked = false;
    } else {
        reply.dislikes++;
        reply.userDisliked = true;
        if (reply.userLiked) {
            reply.likes--;
            reply.userLiked = false;
        }
    }

    saveDiscussions();
    renderDiscussions();
}

// ========================================
// REPLIES
// ========================================

function openReplyModal(discussionId) {
    currentReplyId = discussionId;
    document.getElementById('replyModal').classList.remove('hidden');
    document.getElementById('replyText').focus();
}

function closeReplyModal() {
    document.getElementById('replyModal').classList.add('hidden');
    document.getElementById('replyText').value = '';
    currentReplyId = null;
}

function submitReply(event) {
    event.preventDefault();

    if (currentReplyId === null) return;

    const discussion = discussions.find(d => d.id === currentReplyId);
    if (!discussion) return;

    const replyText = document.getElementById('replyText').value;
    if (!replyText.trim()) {
        alert('Моля, напиши отговор!');
        return;
    }

    const newReply = {
        id: Date.now(),
        author: 'Ти',
        content: replyText,
        timestamp: new Date().toISOString(),
        likes: 0,
        dislikes: 0,
        userLiked: false,
        userDisliked: false
    };

    if (!discussion.replies) {
        discussion.replies = [];
    }
    discussion.replies.push(newReply);

    saveDiscussions();
    renderDiscussions();
    closeReplyModal();
    
    // Scroll to discussion
    const discussionElement = document.querySelector('[data-discussion-id="' + currentReplyId + '"]');
    if (discussionElement) {
        discussionElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

// ========================================
// UTILITY FUNCTIONS
// ========================================

function getTimeAgo(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    if (seconds < 60) return 'преди няколко секунди';
    if (seconds < 3600) return 'преди ' + Math.floor(seconds / 60) + ' минути';
    if (seconds < 86400) return 'преди ' + Math.floor(seconds / 3600) + ' часа';
    if (seconds < 604800) return 'преди ' + Math.floor(seconds / 86400) + ' дни';
    
    return date.toLocaleDateString('bg-BG');
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function getContrastColor(hexcolor) {
    if (!hexcolor || hexcolor === "transparent") return "white";
    if (hexcolor === "#FFFFFF") return "black";
    if (hexcolor === "#000000") return "white";
    
    const cleanHex = hexcolor.replace('#', '');
    const r = parseInt(cleanHex.slice(0, 2), 16);
    const g = parseInt(cleanHex.slice(2, 4), 16);
    const b = parseInt(cleanHex.slice(4, 6), 16);
    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return (yiq >= 128) ? 'black' : 'white';
}

// Close modal when clicking outside
document.addEventListener('click', function(event) {
    const modal = document.getElementById('replyModal');
    if (event.target === modal) {
        closeReplyModal();
    }
});
