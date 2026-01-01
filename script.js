// 1モーラ（拗音対応）を抽出
function getFirstMora(word) {
    const yoon = ["ゃ", "ゅ", "ょ", "ぁ", "ぃ", "ぅ", "ぇ", "ぉ"];
    if (word.length > 1 && yoon.includes(word[1])) {
        return word.substring(0, 2);
    }
    return word[0];
}

// 入れ替えロジック
function getRirekai(word1, word2) {
    const m1 = getFirstMora(word1);
    const m2 = getFirstMora(word2);

    // ABAC判定: 1文字目と3文字目(または対応する拍)が同じか
    const m3 = getFirstMora(word1.substring(m1.length + 1)); // 2文字飛ばして次を確認
    const isABAC = word1.length >= 4 && m1 === getFirstMora(word1.substring(word1.length / 2));

    let res1;
    if (isABAC) {
        // ABAC型：すべてのAを入れ替える
        res1 = word1.split(m1).join(m2);
    } else {
        res1 = m2 + word1.substring(m1.length);
    }
    
    let res2 = m1 + word2.substring(m2.length);
    return `${res1} ${res2}`;
}

// UI制御
const qDisplay = document.getElementById('question');
const aDisplay = document.getElementById('answer');
const aBox = document.getElementById('answer-box');
const btnAns = document.getElementById('btn-ans');
const btnNext = document.getElementById('btn-next');

let currentIdx = 0;

function updateQuestion() {
    const q = questions[Math.floor(Math.random() * questions.length)];
    qDisplay.innerText = q;
    const parts = q.split(" ");
    aDisplay.innerText = getRirekai(parts[0], parts[1]);
    aBox.classList.add('hidden');
    btnAns.innerText = "答えを見る";
}

btnAns.addEventListener('click', () => {
    aBox.classList.toggle('hidden');
    btnAns.innerText = aBox.classList.contains('hidden') ? "答えを見る" : "答えを隠す";
});

btnNext.addEventListener('click', updateQuestion);

// 初期読み込み
updateQuestion();