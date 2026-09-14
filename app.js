const config = window.GUEST_WIFI || {};

const greeting = document.getElementById("greeting");
const ssid = document.getElementById("ssid");
const password = document.getElementById("password");
const copyBtn = document.getElementById("copy-btn");
const copyLabel = copyBtn.querySelector(".copy-label");
const toast = document.getElementById("toast");

greeting.textContent = config.greeting || "Welcome Home";
ssid.textContent = config.ssid || "";
password.textContent = config.password || "";

async function writeClipboard(value) {
  try {
    await navigator.clipboard.writeText(value);
  } catch {
    const field = document.createElement("textarea");
    field.value = value;
    field.setAttribute("readonly", "");
    field.style.position = "fixed";
    field.style.opacity = "0";
    document.body.appendChild(field);
    field.select();
    document.execCommand("copy");
    document.body.removeChild(field);
  }
}

function burst(event) {
  const rect = copyBtn.getBoundingClientRect();
  const x = (event.clientX || rect.left + rect.width / 2) - rect.left;
  const y = (event.clientY || rect.top + rect.height / 2) - rect.top;

  const ripple = document.createElement("span");
  ripple.className = "ripple";
  ripple.style.left = `${x}px`;
  ripple.style.top = `${y}px`;
  copyBtn.appendChild(ripple);
  window.setTimeout(() => ripple.remove(), 700);

  for (let i = 0; i < 6; i += 1) {
    const drop = document.createElement("span");
    drop.className = "drop";
    drop.style.left = `${x + (Math.random() * 24 - 12)}px`;
    drop.style.top = `${y}px`;
    drop.style.animationDelay = `${i * 40}ms`;
    copyBtn.appendChild(drop);
    window.setTimeout(() => drop.remove(), 800);
  }
}

async function copyPassword(event) {
  const value = config.password || "";
  if (!value) return;

  await writeClipboard(value);
  if (navigator.vibrate) navigator.vibrate(12);

  burst(event);
  copyBtn.classList.remove("press");
  void copyBtn.offsetWidth;
  copyBtn.classList.add("press", "copied");
  copyLabel.textContent = "Copied";
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 2200);
}

copyBtn.addEventListener("click", copyPassword);
