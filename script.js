function getFirstMora(word) {
    const yoon = ["ゃ", "ゅ", "ょ", "ぁ", "ぃ", "ぅ", "ぇ", "ぉ"];
    if (word.length > 1 && yoon.includes(word[1])) return word.substring(0, 2);
    return word[0];
}

function isRepeatWord(word) {
    if (word.length < 4) return false;
    const half = word.length / 2;
    return word.substring(0, half) === word.substring(half);
}

function generateQuestionHTML(word1, word2) {
    const m1 = getFirstMora(word1);
    const m2 = getFirstMora(word2);
    let w1HTML = isRepeatWord(word1) ? word1.split(m1).join(`<span class="highlight">${m1}</span>`) : `<span class="highlight">${m1}</span>${word1.substring(m1.length)}`;
    let w2HTML = isRepeatWord(word2) ? word2.split(m2).join(`<span class="highlight">${m2}</span>`) : `<span class="highlight">${m2}</span>${word2.substring(m2.length)}`;
    return `${w1HTML}　${w2HTML}`;
}

function generateAnswerHTML(word1, word2) {
    const m1 = getFirstMora(word1);
    const m2 = getFirstMora(word2);
    let res1HTML = isRepeatWord(word1) ? word1.split(m1).join(`<span class="highlight">${m2}</span>`) : `<span class="highlight">${m2}</span>${word1.substring(m1.length)}`;
    let res2HTML = isRepeatWord(word2) ? word2.split(m2).join(`<span class="highlight">${m1}</span>`) : `<span class="highlight">${m1}</span>${word2.substring(m2.length)}`;
    return `${res1HTML}　${res2HTML}`;
}

let shuffledQueue = [];
let currentRawQuestion = "";
let isFavoriteMode = false;

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function resetQueue() {
    if (isFavoriteMode) {
        const favs = getFavorites();
        if (favs.length === 0) {
            alert("おきにいりが ありません！つうじょうもーどに もどります。");
            document.getElementById('mode-toggle').checked = false;
            isFavoriteMode = false;
            shuffledQueue = shuffle([...questions]);
        } else {
            shuffledQueue = shuffle([...favs]);
        }
    } else {
        shuffledQueue = shuffle([...questions]);
    }
}

const qDisplay = document.getElementById('question');
const aDisplay = document.getElementById('answer');
const aBox = document.getElementById('answer-box');
const btnAns = document.getElementById('btn-ans');
const btnNext = document.getElementById('btn-next');
const btnFav = document.getElementById('btn-fav');
const progressDisplay = document.getElementById('progress');
const modeToggle = document.getElementById('mode-toggle');
const favList = document.getElementById('fav-list');

function getFavorites() {
    return JSON.parse(localStorage.getItem('rirekai_favorites') || '[]');
}

function updateFavButtonUI() {
    const favorites = getFavorites();
    if (favorites.includes(currentRawQuestion)) {
        btnFav.innerHTML = "🌟 はいってる"; // 登録済みの表示
        btnFav.classList.add('active');
    } else {
        btnFav.innerHTML = "⭐ おきにいり"; // 未登録の表示
        btnFav.classList.remove('active');
    }
}

function renderFavoriteList() {
    const favorites = getFavorites();
    favList.innerHTML = "";
    favorites.forEach((item) => {
        const li = document.createElement('li');
        li.innerHTML = `<span>${item}</span>`;
        const delBtn = document.createElement('button');
        delBtn.innerText = "けす";
        delBtn.className = "outline secondary";
        delBtn.onclick = () => removeFavorite(item);
        li.appendChild(delBtn);
        favList.appendChild(li);
    });
}

function toggleFavorite() {
    let favorites = getFavorites();
    if (favorites.includes(currentRawQuestion)) {
        favorites = favorites.filter(f => f !== currentRawQuestion);
    } else {
        favorites.push(currentRawQuestion);
    }
    localStorage.setItem('rirekai_favorites', JSON.stringify(favorites));
    updateFavButtonUI();
    renderFavoriteList();
}

function removeFavorite(item) {
    let favorites = getFavorites();
    favorites = favorites.filter(f => f !== item);
    localStorage.setItem('rirekai_favorites', JSON.stringify(favorites));
    updateFavButtonUI();
    renderFavoriteList();
}

function updateProgress() {
    const total = isFavoriteMode ? getFavorites().length : questions.length;
    const nowCount = total - shuffledQueue.length;
    progressDisplay.innerText = `${nowCount} / ${total} もんめ ${isFavoriteMode ? '(⭐もーど)' : ''}`;
}

function updateQuestion() {
    if (shuffledQueue.length === 0) {
        alert("ぜんぶ おわりました！もういちど はじめます。");
        resetQueue();
    }
    const q = shuffledQueue.pop();
    currentRawQuestion = q;
    const parts = q.split(" ");
    qDisplay.innerHTML = generateQuestionHTML(parts[0], parts[1]);
    aDisplay.innerHTML = generateAnswerHTML(parts[0], parts[1]);
    aBox.classList.add('hidden');
    btnAns.innerText = "こたえをみる";
    updateProgress();
    updateFavButtonUI();
}

btnAns.addEventListener('click', () => {
    const isHidden = aBox.classList.contains('hidden');
    if (isHidden) {
        aBox.classList.remove('hidden');
        btnAns.innerText = "こたえをかくす";
    } else {
        aBox.classList.add('hidden');
        btnAns.innerText = "こたえをみる";
    }
});

btnNext.addEventListener('click', updateQuestion);
btnFav.addEventListener('click', toggleFavorite);
modeToggle.addEventListener('change', (e) => {
    isFavoriteMode = e.target.checked;
    resetQueue();
    updateQuestion();
});

resetQueue();
updateQuestion();
renderFavoriteList();