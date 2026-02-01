import { customAlphabet } from "https://cdn.jsdelivr.net/npm/nanoid/index.browser.js";

const DEBUG = false;

const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const lowercase = "abcdefghijklmnopqrstuvwxyz";
const numbers = "0123456789";
const symbols = `~!@#$%^&*()_+-={}|[]\:";'<>?,./`;

const passwordEl = document.getElementById("password-text");
const copyEl = document.getElementById("copy");
const form = document.getElementById("setting");
const lengthEl = document.getElementById("length");
const lengthValueEl = document.getElementById("length-value");
const levelEl = document.getElementById('level');
const levelTextEl = document.getElementById('level-text');

if (lengthValueEl) {
  lengthValueEl.innerHTML = lengthEl.value;
  lengthEl?.addEventListener("input", (e) => {
    lengthValueEl.innerHTML = e.target.value;
  });
}

form?.addEventListener("submit", (e) => {
  e.preventDefault();

  const datas = Object.fromEntries(new FormData(form));

  let setting = "";

  if (datas.lowercase) setting += lowercase;
  if (datas.uppercase) setting += uppercase;
  if (datas.numbers) setting += numbers;
  if (datas.symbols) setting += symbols;
  if (setting === "") setting = lowercase;

  const password = (customAlphabet(setting, parseInt(lengthEl.value)))();

  if (!lengthValueEl || !passwordEl || !levelEl || !levelTextEl) return;

  passwordEl.innerHTML = password;
  passwordEl.classList.add("white");

  const result = zxcvbn(password);
  levelEl.dataset.level = result.score;
  
  switch (result.score) {
    case 1:
      levelTextEl.innerHTML = 'WEAK';
      break;
    case 2:
      levelTextEl.innerHTML = 'MEDIUM';
      break;
    case 3:
      levelTextEl.innerHTML = 'STRONG';
      break;
    case 4:
      levelTextEl.innerHTML = 'STRONGEST';
      break;
  
    default:
      break;
  }
});

copyEl?.addEventListener("click", async (e) => {
  const textToCopy = passwordEl.innerHTML;

  if (!textToCopy || textToCopy === "") return;

  try {
    await navigator.clipboard.writeText(textToCopy);

    copyEl.classList.add("copied");

    setTimeout(() => {
      copyEl.classList.remove("copied");
    }, 3000);
  } catch (err) {
    debug("error to copy: ", err);
  }
});

function debug(...content) {
  if (!DEBUG) return;

  console.log(content);
}
