// 1モーラ（拗音対応）を抽出
function getFirstMora(word) {
    const yoon = ["ゃ", "ゅ", "ょ", "ぁ", "ぃ", "ぅ", "ぇ", "ぉ"];
    if (word.length > 1 && yoon.includes(word[1])) {
        return word.substring(0, 2);
    }
    return word[0];
}

// 繰り返し語（ABAC/ABAB）かどうかを判定
function isRepeatWord(word) {
    if (word.length < 4) return false;
    const half = word.length / 2;
    return word.substring(0, half) === word.substring(half);
}

// お題表示用のHTML生成
function generateQuestionHTML(word1, word2) {
    const m1 = getFirstMora(word1);
    const m2 = getFirstMora(word2);

    let w1HTML = isRepeatWord(word1)
        ? word1.split(m1).join(`<span class="highlight">${m1}</span>`)
        : `<span class="highlight">${m1}</span>${word1.substring(m1.length)}`;

    let w2HTML = isRepeatWord(word2)
        ? word2.split(m2).join(`<span class="highlight">${m2}</span>`)
        : `<span class="highlight">${m2}</span>${word2.substring(m2.length)}`;

    return `${w1HTML}　${w2HTML}`;
}

// 答え表示用のHTML生成
function generateAnswerHTML(word1, word2) {
    const m1 = getFirstMora(word1);
    const m2 = getFirstMora(word2);

    let res1HTML = isRepeatWord(word1)
        ? word1.split(m1).join(`<span class="highlight">${m2}</span>`)
        : `<span class="highlight">${m2}</span>${word1.substring(m1.length)}`;

    let res2HTML = isRepeatWord(word2)
        ? word2.split(m2).join(`<span class="highlight">${m1}</span>`)
        : `<span class="highlight">${m1}</span>${word2.substring(m2.length)}`;

    return `${res1HTML}　${res2HTML}`;
}

// --- 出題管理 ---
let shuffledQueue = [];
let totalCount = questions.length;

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function resetQueue() {
    shuffledQueue = shuffle([...questions]);
}

// UI要素の取得
const qDisplay = document.getElementById('question');
const aDisplay = document.getElementById('answer');
const aBox = document.getElementById('answer-box');
const btnAns = document.getElementById('btn-ans');
const btnNext = document.getElementById('btn-next');
const progressDisplay = document.getElementById('progress'); // ここで「じゅんび中」を書き換えます

// 進捗の更新
function updateProgress() {
    const currentNum = totalCount - shuffledQueue.length;
    progressDisplay.innerText = `${currentNum} / ${totalCount} 問目`;
}

function updateQuestion() {
    if (shuffledQueue.length === 0) {
        alert("すべての問題をクリアしました！最初からやりなおします。");
        resetQueue();
    }

    const q = shuffledQueue.pop();
    const parts = q.split(" ");
    
    qDisplay.innerHTML = generateQuestionHTML(parts[0], parts[1]);
    aDisplay.innerHTML = generateAnswerHTML(parts[0], parts[1]);
    
    aBox.classList.add('hidden');
    btnAns.innerText = "答えを見る";
    updateProgress(); // ここで数字を更新
}

btnAns.addEventListener('click', () => {
    aBox.classList.toggle('hidden');
    btnAns.innerText = aBox.classList.contains('hidden') ? "答えを見る" : "答えを隠す";
});

btnNext.addEventListener('click', updateQuestion);

// スタート
resetQueue();
updateQuestion();