const fastFashionSites = [
  { name: "Shein", domain: "shein.com" },
  { name: "Zara", domain: "zara.com" },
  { name: "H&M", domain: "hm.com" },
  { name: "Forever 21", domain: "forever21.com" },
  { name: "Fashion Nova", domain: "fashionnova.com" },
  { name: "Boohoo", domain: "boohoo.com" }
];

function getCurrentFastFashionSite() {
  return fastFashionSites.find(site =>
    window.location.hostname.includes(site.domain)
  );
}

function showModal(data) {
  if (document.getElementById("btq-modal")) return;

  const modal = document.createElement("div");
  modal.id = "btq-modal";
  modal.innerHTML = `
    <div class="btq-box">
      <h2>THINK BEFORE YOU BUY!</h2>
      <p class="subtitle">
        You are visiting <b>${data.siteName}</b>, a fast-fashion retailer.
      </p>
      <p>Visits to ${data.siteName}: <b>${data.siteVisits}</b></p>
      <p>Ethical alternatives clicked: <b>${data.ethical}</b></p>
      <p>Continued anyway: <b>${data.anyway}</b></p>
      <div class="btq-buttons">
        <button id="ethical">Ethical Alternatives</button>
        <button id="anyway">Continue Anyway</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  document.getElementById("ethical").onclick = () => {
    chrome.storage.local.set({ ethical: data.ethical + 1 });
    window.location.href = "https://goodonyou.eco/";
  };

  document.getElementById("anyway").onclick = () => {
    chrome.storage.local.set({ anyway: data.anyway + 1 });
    modal.remove();
  };
}

const currentSite = getCurrentFastFashionSite();

if (currentSite) {
  chrome.storage.local.get(
    ["siteVisits", "ethical", "anyway"],
    (res) => {
      const siteVisits = res.siteVisits || {};
      const siteName = currentSite.name;

      siteVisits[siteName] = (siteVisits[siteName] || 0) + 1;

      chrome.storage.local.set({ siteVisits });

      showModal({
        siteName,
        siteVisits: siteVisits[siteName],
        ethical: res.ethical || 0,
        anyway: res.anyway || 0
      });
    }
  );
}
