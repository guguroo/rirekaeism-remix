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

// --- 出題キューの管理ロジック ---
let shuffledQueue = [];
let totalCount = questions.length;

// 配列をシャッフルする関数（フィッシャー–イェーツのシャッフル）
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// キューを初期化（未出題リストを作成）
function resetQueue() {
    shuffledQueue = shuffle([...questions]);
}

// UI制御用
const qDisplay = document.getElementById('question');
const aDisplay = document.getElementById('answer');
const aBox = document.getElementById('answer-box');
const btnAns = document.getElementById('btn-ans');
const btnNext = document.getElementById('btn-next');

// 進捗表示用の要素（もしHTMLにあれば更新する）
function updateProgress() {
    const progressText = `残り: ${shuffledQueue.length} / ${totalCount}`;
    console.log(progressText); // コンソールで確認用
    // HTMLに <small id="progress"></small> などがあれば表示可能
}

function updateQuestion() {
    // キューが空になったらリセット（全問終了時）
    if (shuffledQueue.length === 0) {
        alert("全問終了しました！最初からループします。");
        resetQueue();
    }

    // キューの最後から1つ取り出す（これにより重複がなくなる）
    const q = shuffledQueue.pop();
    const parts = q.split(" ");
    
    qDisplay.innerHTML = generateQuestionHTML(parts[0], parts[1]);
    aDisplay.innerHTML = generateAnswerHTML(parts[0], parts[1]);
    
    aBox.classList.add('hidden');
    btnAns.innerText = "答えを見る";
    updateProgress();
}

btnAns.addEventListener('click', () => {
    aBox.classList.toggle('hidden');
    btnAns.innerText = aBox.classList.contains('hidden') ? "答えを見る" : "答えを隠す";
});

btnNext.addEventListener('click', updateQuestion);

// 起動時にキューを作成して初回の出題
resetQueue();
updateQuestion();