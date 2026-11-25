// ===== Edit your content here =====
const projects = [
  { title: "Port Scanner", type: "Security tools", desc: "Python tool that scans a host for open ports and reports common services. For use on your own systems only.", tags: ["Python", "Sockets"], live: "#", code: "https://github.com/23manas-14/port-scanner" },
  { title: "Password Strength Checker", type: "Security tools", desc: "Checks passwords for length, variety and common patterns, and gives clear tips to improve them.", tags: ["JavaScript", "Security"], live: "#", code: "https://github.com/23manas-14/password-checker" },
  { title: "Web Security Lab Notes", type: "Labs & CTF", desc: "Write-ups of OWASP Top 10 exercises solved on legal practice platforms such as DVWA and TryHackMe.", tags: ["OWASP", "Burp Suite"], live: "#", code: "https://github.com/23manas-14/security-notes" },
  { title: "Network Traffic Analysis", type: "Labs & CTF", desc: "Packet capture analysis with Wireshark: spotting suspicious traffic and explaining what happened.", tags: ["Wireshark", "TCP/IP"], live: "#", code: "https://github.com/23manas-14/traffic-analysis" }
];
const skills = [
  { name: "Networking & TCP/IP", level: 75 }, { name: "Linux & Command Line", level: 75 },
  { name: "Python", level: 70 }, { name: "Web Security (OWASP)", level: 65 },
  { name: "Wireshark, Nmap, Burp Suite", level: 60 }, { name: "Git & GitHub", level: 70 }
];
const learning = ["Ethical hacking", "Penetration testing", "Cloud security", "Incident response"];
// ==================================

const $ = (s) => document.querySelector(s);

// Theme (saved in localStorage)
const root = document.documentElement;
const themeBtn = $("#themeBtn");
function setTheme(t) {
  root.dataset.theme = t;
  themeBtn.textContent = t === "dark" ? "Light" : "Dark";
  try { localStorage.setItem("theme", t); } catch (e) {}
}
let saved = null;
try { saved = localStorage.getItem("theme"); } catch (e) {}
setTheme(saved || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"));
themeBtn.addEventListener("click", () => setTheme(root.dataset.theme === "dark" ? "light" : "dark"));

// Mobile menu
const menuBtn = document.querySelector(".menu-btn"), nav = $("#nav");
menuBtn.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", open);
});
nav.addEventListener("click", (e) => { if (e.target.tagName === "A") nav.classList.remove("open"); });

// Projects + filters
const filters = $("#filters"), grid = $("#projects");
const types = ["All", ...new Set(projects.map((p) => p.type))];
filters.innerHTML = types.map((t, i) => `<button class="${i ? "" : "on"}" data-t="${t}">${t}</button>`).join("");
function render(type) {
  grid.innerHTML = projects.filter((p) => type === "All" || p.type === type).map((p) => `
    <article class="card">
      <h3>${p.title}</h3><p>${p.desc}</p>
      <ul class="tags">${p.tags.map((t) => `<li>${t}</li>`).join("")}</ul>
      <div class="card-links"><a href="${p.live}">Live demo</a><a href="${p.code}" target="_blank" rel="noopener">Code</a></div>
    </article>`).join("");
}
filters.addEventListener("click", (e) => {
  if (e.target.tagName !== "BUTTON") return;
  filters.querySelectorAll("button").forEach((b) => b.classList.toggle("on", b === e.target));
  render(e.target.dataset.t);
});
render("All");

// Skill bars animate when scrolled into view
const list = $("#skills");
list.innerHTML = skills.map((s) => `<li><div class="skill-top"><span>${s.name}</span><span>${s.level}%</span></div><div class="bar"><i data-w="${s.level}"></i></div></li>`).join("");
new IntersectionObserver((entries, obs) => {
  entries.forEach((en) => { if (en.isIntersecting) { en.target.querySelectorAll("i").forEach((i) => (i.style.width = i.dataset.w + "%")); obs.unobserve(en.target); } });
}, { threshold: 0.3 }).observe(list);

// Typing effect
const typed = $("#typed");
let w = 0, c = 0, del = false;
(function type() {
  const word = learning[w];
  typed.textContent = word.slice(0, c);
  if (!del && c === word.length) { del = true; return setTimeout(type, 1400); }
  if (del && c === 0) { del = false; w = (w + 1) % learning.length; }
  c += del ? -1 : 1;
  setTimeout(type, del ? 50 : 100);
})();

// Highlight current section in nav
const links = [...nav.querySelectorAll("a")];
const io = new IntersectionObserver((entries) => {
  entries.forEach((en) => { if (en.isIntersecting) links.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + en.target.id)); });
}, { rootMargin: "-40% 0px -55% 0px" });
document.querySelectorAll("main section").forEach((s) => io.observe(s));

// Contact form: validates, then opens the visitor's email app (no backend needed)
const MY_EMAIL = "23manas865@gmail.com";
$("#contactForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const f = ["name", "email", "message"].map((id) => $("#" + id));
  const msg = $("#formMsg");
  f.forEach((el) => el.classList.toggle("error", !el.value.trim()));
  if (f.some((el) => !el.value.trim())) { msg.className = "form-msg err"; msg.textContent = "Please fill in every field."; return; }
  if (!/^\S+@\S+\.\S+$/.test(f[1].value)) { f[1].classList.add("error"); msg.className = "form-msg err"; msg.textContent = "Enter a valid email address."; return; }
  const body = encodeURIComponent(`${f[2].value}\n\n— ${f[0].value} (${f[1].value})`);
  location.href = `mailto:${MY_EMAIL}?subject=${encodeURIComponent("Portfolio message from " + f[0].value)}&body=${body}`;
  msg.className = "form-msg"; msg.textContent = "Opening your email app…";
});

$("#year").textContent = new Date().getFullYear();
