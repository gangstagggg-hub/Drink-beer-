(() => {
  "use strict";

  const $ = (s) => document.querySelector(s);
  const app = $("#app");
  const video = $("#cam");
  const statusEl = $("#status");
  const bar = $("#bar");
  const go = $("#go");
  const shareBtn = $("#share");
  const resultEl = $("#result");
  const verdictEl = $("#verdict");
  const commentEl = $("#comment");
  const metricsEl = $("#metrics");
  const countEl = $("#count");
  const dotsEl = $("#dots");

  /* ---------- Innhold ---------- */

  const TITLES = {
    mer: ["Du kan drikke mer", "Grønt lys for en til", "Godkjent for påfyll"],
    edru: ["Du ser edru ut", "Edru som en dommer", "Klar i blikket"],
  };

  const COMMENTS = {
    mer: [
      "Ansiktet ditt sier «helt fint». Skanneren er enig. Skål!",
      "Ingen tegn til problemer. Bartenderen er varslet.",
      "Du har fortsatt full kontroll på øyenbrynene. Det er et godt tegn.",
      "Skanneren har sett verre. Mye verre. Ta en til.",
      "Kinnene dine har fortsatt god holdning. Fyll på.",
      "Blikket er skarpt, smilet er ekte. Glasset er derimot tomt.",
      "Algoritmen har snakket, og den vil ha deg tilbake på dansegulvet.",
      "Resultat: kjempefin. Anbefaling: en halvliter og et glass vann ved siden av.",
      "Skanneren fant ikke én eneste grunn til å stoppe nå.",
      "Ansiktet ditt fikk full pott i kategorien «en til går bra».",
      "Øynene dine sier «ja», ørene sier «absolutt», og nesen er nøytral.",
      "Pannen er rynkefri. Det er tegn på indre ro, og indre ro tåler en pils.",
      "Du gikk gjennom skanneren med glans. Nå venter baren.",
      "Gratulerer! Du har bestått en test vi nettopp fant på.",
      "Analysen er klar: du har kapasitet til minst én til. Vi dømmer ikke.",
      "Høy stemning, lav risiko. Skanneren kaller det en vinn-vinn.",
      "Smilebåndene dine jobber på overtid, og de ser ut til å trives.",
      "Kapasitet funnet. Skanneren anbefaler å bruke den med stil.",
    ],
    edru: [
      "Edru som en dommer på mandagsmorgen.",
      "Du ser så klar ut at vi lurer på om du er kveldens livvakt.",
      "Skanneren finner ingen spor av kvelden. Imponerende, eller mistenkelig.",
      "Du ser ut som du har drukket vann hele kvelden. Eller så er du bare veldig god.",
      "Edruelighetsnivå: pensjonert biskop.",
      "Blikket er rolig, smilet sitter. Du er i praksis nyfødt.",
      "Resultat: edru. Det kan fikses, men det er opp til deg.",
      "Hjernen din svarer innen 0,3 sekunder. Skål for det.",
      "Du ser så våken ut at du kunne holdt foredrag om pensjonssparing.",
      "Ansiktet ditt sier edru. Det er ikke kritikk, bare en observasjon.",
      "Vi har sett mer rufsete fjes på en søndagstur i skogen.",
      "Du ser ut som en som husker alt i morgen. Ikke alle kan skryte av det.",
      "Kinnfargen er normal og blikket er klart. Du er enten edru eller en dyktig skuespiller.",
      "Du består som edru. Baren venter fortsatt, men skanneren tvinger ingen.",
      "Selv en Ola Nordmann på 17. mai er mer ustø enn dette ansiktet.",
      "Null tegn til kveldens eskapader. Er du sikker på at du var med?",
    ],
  };

  // Kommentarer som passer uansett utfall, og som bruker antall skann
  const REPEAT = [
    (n) => `Skann nummer ${n}. Maskinen er sliten, men fjeset ditt holder koken.`,
    (n) => `Du har skannet ${n} ganger. Resultatet har ikke endret seg, og det kommer det ikke til å gjøre heller.`,
    (n) => `Skann nummer ${n}. Vi begynner å tro at du bare liker lyden av grønn hake.`,
    (n) => `${n} skann i kveld. Ansiktsgjenkjenningen din er nå offisielt overarbeidet.`,
  ];

  const STEPS = [
    "Finner ansiktet ditt …",
    "Måler blikkfokus …",
    "Teller øyevipper …",
    "Leser smilebånd …",
    "Sjekker kinnenes holdning …",
    "Sammenligner med 12 000 fjes …",
    "Konsulterer skålmodulen …",
  ];

  const rnd = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;

  const METRICS = [
    ["Blikkfokus", () => rnd(92, 99) + " %"],
    ["Smilets ekthet", () => rnd(90, 99) + " %"],
    ["Øyebrynskontroll", () => "Full"],
    ["Ansiktsbalanse", () => "Utmerket"],
    ["Kinnholdning", () => "Upåklagelig"],
    ["Stemning", () => "Høy"],
    ["Sosial energi", () => "På topp"],
    ["Dansevilje", () => "Til stede"],
    ["Pokerfjes", () => rnd(88, 97) + " %"],
  ];

  const KIND_METRIC = {
    mer: ["Påfyllskapasitet", () => "God"],
    edru: ["Edruelighet", () => rnd(96, 100) + " %"],
  };

  /* ---------- Hjelpere ---------- */

  const lastPick = {};
  function pickFresh(key, list) {
    let i;
    do { i = Math.floor(Math.random() * list.length); }
    while (list.length > 1 && i === lastPick[key]);
    lastPick[key] = i;
    return list[i];
  }

  let history = [];
  function pickKind() {
    let kind = Math.random() < 0.5 ? "mer" : "edru";
    const n = history.length;
    if (n >= 2 && history[n - 1] === kind && history[n - 2] === kind) {
      kind = kind === "mer" ? "edru" : "mer";
    }
    history.push(kind);
    return kind;
  }

  function nextCount() {
    const KEY = "enda-en-count";
    const now = Date.now();
    try {
      const saved = JSON.parse(localStorage.getItem(KEY) || "null");
      let n = 1;
      if (saved && now - saved.t < 8 * 3600 * 1000) n = saved.n + 1;
      localStorage.setItem(KEY, JSON.stringify({ n, t: now }));
      return n;
    } catch (_) {
      nextCount.local = (nextCount.local || 0) + 1;
      return nextCount.local;
    }
  }

  /* ---------- Prikker på ansiktet ---------- */

  const POINTS = [
    [50, 22], [36, 30], [64, 30], [40, 40], [60, 40], [50, 46], [32, 52],
    [68, 52], [44, 58], [56, 58], [50, 66], [38, 70], [62, 70], [50, 78], [42, 84], [58, 84],
  ];
  POINTS.forEach(([x, y], i) => {
    const d = document.createElement("i");
    d.style.left = x + "%";
    d.style.top = y + "%";
    d.style.animationDelay = (i * 0.09).toFixed(2) + "s";
    dotsEl.appendChild(d);
  });

  /* ---------- Kamera ---------- */

  let stream = null;

  async function startCamera() {
    if (stream) {
      try { await video.play(); } catch (_) {}
      return true;
    }
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return false;
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 720 }, height: { ideal: 720 } },
        audio: false,
      });
      video.srcObject = stream;
      await video.play();
      video.classList.add("on");
      return true;
    } catch (_) {
      stream = null;
      return false;
    }
  }

  function stopCamera() {
    if (stream) stream.getTracks().forEach((t) => t.stop());
    stream = null;
    video.srcObject = null;
    video.classList.remove("on");
  }

  // Slå av kameraet når appen forlates
  document.addEventListener("visibilitychange", () => {
    if (document.hidden && app.dataset.state !== "scanning") stopCamera();
  });

  /* ---------- Skanning ---------- */

  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  let busy = false;

  async function scan() {
    if (busy) return;
    busy = true;

    app.dataset.state = "scanning";
    resultEl.hidden = true;
    shareBtn.hidden = true;
    go.disabled = true;
    go.textContent = "Skanner …";
    bar.style.width = "0%";
    statusEl.textContent = "Starter kamera …";

    const hasCam = await startCamera();
    if (!hasCam) {
      statusEl.textContent = "Fant ikke kameraet, så vi skanner auraen din i stedet …";
      await wait(1400);
    }

    for (let i = 0; i < STEPS.length; i++) {
      statusEl.textContent = STEPS[i];
      bar.style.width = ((i + 1) / STEPS.length) * 100 + "%";
      await wait(rnd(520, 760));
    }

    showResult();
    busy = false;
  }

  function showResult() {
    const kind = pickKind();
    const n = nextCount();

    // Fryser bildet i det grønne øyeblikket
    video.pause();

    const title = pickFresh("title-" + kind, TITLES[kind]);
    let comment;
    if (n >= 3 && Math.random() < 0.4) {
      comment = pickFresh("repeat", REPEAT)(n);
    } else {
      comment = pickFresh("comment-" + kind, COMMENTS[kind]);
    }

    verdictEl.textContent = title;
    commentEl.textContent = comment;

    // Tre målinger: én som passer utfallet + to tilfeldige
    const pool = METRICS.slice().sort(() => Math.random() - 0.5).slice(0, 2);
    const rows = [KIND_METRIC[kind], ...pool];
    metricsEl.textContent = "";
    rows.forEach(([label, val]) => {
      const row = document.createElement("div");
      const dt = document.createElement("dt");
      const dd = document.createElement("dd");
      dt.textContent = label;
      dd.textContent = val();
      row.append(dt, dd);
      metricsEl.appendChild(row);
    });

    countEl.textContent = n === 1 ? "Første skann i kveld" : `Skann nummer ${n} i kveld`;

    app.dataset.state = "result";
    resultEl.hidden = false;
    go.disabled = false;
    go.textContent = "Skann på nytt";
    if (navigator.share || navigator.clipboard) shareBtn.hidden = false;

    if (navigator.vibrate) navigator.vibrate([30, 50, 70]);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function share() {
    const text = `${verdictEl.textContent}. ${commentEl.textContent}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: "Enda en?", text, url: location.href });
      } else {
        await navigator.clipboard.writeText(`${text} ${location.href}`);
        shareBtn.textContent = "Kopiert!";
        setTimeout(() => (shareBtn.textContent = "Del resultatet"), 1600);
      }
    } catch (_) { /* brukeren avbrøt */ }
  }

  go.addEventListener("click", scan);
  shareBtn.addEventListener("click", share);

  /* ---------- Offline / installasjon ---------- */

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("sw.js").catch(() => {});
    });
  }
})();
