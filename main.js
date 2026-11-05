/* Woodfiy – Hauptskript (Phase 1): Navigation, Rendering, Animation, Kontaktformular */
(function () {
  "use strict";
  var D = window.WOODFIY;

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  /* Mobile Navigation */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("main-nav");
  function setNav(open) {
    nav.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Menü schließen" : "Menü öffnen");
  }
  toggle.addEventListener("click", function () { setNav(!nav.classList.contains("is-open")); });
  nav.addEventListener("click", function (e) { if (e.target.tagName === "A") setNav(false); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") setNav(false); });

  /* Kategorien */
  var catGrid = document.getElementById("category-grid");
  catGrid.innerHTML = D.categories.map(function (c) {
    var href = c.href || "#kategorien"; // Phase 2: pages/kategorie.html?c=<id>
    return '<a class="cat-card" href="' + href + '" style="--c1:' + c.c1 + ";--c2:" + c.c2 + ";--angle:" + c.angle + '">' +
      "<div><h3>" + esc(c.name) + "</h3><small>" + esc(c.note || "Bald verfügbar") + "</small></div></a>";
  }).join("");

  document.getElementById("footer-cats").innerHTML = D.categories.map(function (c) {
    return '<li><a href="' + (c.href || "#kategorien") + '">' + esc(c.name) + "</a></li>";
  }).join("");

  /* Produktkarten */
  function cards(list) {
    return list.map(function (p) {
      return '<article class="product-card"><div class="img" style="--c1:' + p.c1 + ";--c2:" + p.c2 + '"></div>' +
        '<div class="body">' + (p.badge ? '<span class="badge">' + esc(p.badge) + "</span>" : "") +
        "<h3>" + esc(p.name) + "</h3><p style=\"margin:0;font-size:.85rem\">" + esc(p.cat) + '</p><p class="price" style="margin:.3rem 0 0">' + esc(p.price) + "</p></div></article>";
    }).join("");
  }
  document.getElementById("popular-grid").innerHTML = cards(D.popular);
  document.getElementById("new-grid").innerHTML = cards(D.news);

  /* Jahr im Footer */
  document.getElementById("year").textContent = new Date().getFullYear();

  /* Einblend-Animation */
  var items = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("is-visible"); io.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* Kontaktformular: Validierung + mailto (bis ein Backend angebunden ist) */
  var form = document.getElementById("contact-form");
  var status = document.getElementById("form-status");
  var CONTACT_EMAIL = ""; // TODO: echte E-Mail-Adresse von Woodfiy eintragen
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var name = form.name.value.trim(), mail = form.email.value.trim(), msg = form.message.value.trim();
    if (!name || !/^\S+@\S+\.\S+$/.test(mail) || !msg) {
      status.textContent = "Bitte Name, eine gültige E-Mail-Adresse und eine Nachricht eingeben.";
      return;
    }
    if (!CONTACT_EMAIL) {
      status.textContent = "Eingaben sind gültig. Es ist noch keine Empfänger-Adresse hinterlegt (CONTACT_EMAIL in js/main.js).";
      return;
    }
    window.location.href = "mailto:" + CONTACT_EMAIL + "?subject=" + encodeURIComponent("Anfrage von " + name) +
      "&body=" + encodeURIComponent(msg + "\n\nAntwort an: " + mail);
  });
})();
