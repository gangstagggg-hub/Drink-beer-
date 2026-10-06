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

  // Skjult knapp: "du har drukket for mye"
  const TOOMUCH_TITLES = [
    "Du har drukket for mye",
    "Nå er det nok",
    "Skanneren sier stopp",
    "Rødt lys, venn",
  ];

  const TOOMUCH_COMMENTS = [
    "Skanneren ser to av deg. Begge ser slitne ut.",
    "Ansiktet ditt har forlatt samtalen. Resten av deg bør følge etter.",
    "Du fikk 0 av 10 i kategorien «rett linje». Vann nå, takk.",
    "Øynene dine peker i hver sin retning. Imponerende, men på tide å stoppe.",
    "Skanneren har sett nok. Den ba om en pause og et glass vann.",
    "Smilet ditt er fortsatt her, men resten av ansiktet er på vei hjem.",
    "Resultat: ikke en til. Anbefaling: vann, litt brød og en venn som følger deg hjem.",
    "Skanneren klarte ikke å fokusere på deg. Det sier mer om deg enn om kameraet.",
    "Du har nådd nivået der alle er din beste venn. Vennene dine er ikke enige.",
    "Ansiktet ditt sier «jeg har det helt fint». Algoritmen sier «jeg tviler».",
    "Du svaier. Skanneren prøvde å kalibrere seg etter deg, men ble sjøsyk.",
    "Blikket glir av som såpe i dusjen. Ta en pause.",
    "Skanneren gir deg rødt kort. Det er ikke straff, men omsorg.",
    "Vi anbefaler vann først, deretter kebab.",
    "Bartenderen har fått beskjed. Svaret hans var «vi vet».",
    "Du er så glad at skanneren lurte på om du hadde vunnet noe. Det har du ikke. I kveld vinner vannet.",
  ];

  const TOOMUCH_NOCAM_COMMENTS = [
    "Auraen din er uskarp i kantene og lukter litt lørdag.",
    "Auraen din har begynt å vibrere. Det er et dårlig tegn.",
    "Telefonens indre luktsensor har ikke peiling, men selv den snudde seg bort.",
    "Auraen din har gått fra gylden til «kanskje en kebab».",
    "Luktsensoren kan ikke lukte alkohol, men den er ganske sikker på at du trenger en vannpause.",
    "Auraen din ser ut som en bildekk i en dusj. Ta det med ro nå.",
  ];

  const TOOMUCH_METRICS = [
    ["Blikkfokus", () => rnd(8, 34) + " %"],
    ["Rett linje", () => "Ikke funnet"],
    ["Ansiktsbalanse", () => "Svaiende"],
    ["Kinnholdning", () => "Gir seg"],
    ["Vannbehov", () => "Kritisk"],
    ["Kebabbehov", () => "Høyt"],
    ["Sosialt filter", () => "Av"],
    ["Danseevne", () => "Overvurdert"],
    ["Øyebrynskontroll", () => "Mistet"],
  ];

  const TOOMUCH_NOCAM_METRICS = [
    ["Aurafarge", () => "Uskarp"],
    ["Auraens stabilitet", () => rnd(10, 35) + " %"],
    ["Luktsensor", () => "Trekker på skuldrene"],
    ["Vannbehov", () => "Kritisk"],
    ["Kebabbehov", () => "Høyt"],
  ];

  // Når kameraet ikke kan brukes: alltid aura eller luktsensor
  const NOCAM_TITLES = [
    "Auraen din er strålende",
    "Auraen sier grønt lys",
    "Luktsensoren slår ikke ut",
    "Ingen alkohol påvist",
  ];

  const NOCAM_COMMENTS = [
    "Auraen din er grønn, gylden og ganske tiltalende. Ta en til hvis du vil.",
    "Auraen din lyser så sterkt at skanneren måtte skru ned lysstyrken.",
    "Skanneren leser en rolig, klar aura. Du kan drikke mer, eller bare nyte stemningen.",
    "Auraen din har høy stemning og null røde flagg.",
    "Ingen kamera, ingen problem. Auraen din sier ja til en til.",
    "Auraen din er så klar at den kunne vært vann.",
    "Telefonens indre luktsensor kan dessverre ikke registrere alkohol. Så offisielt er du edru.",
    "Luktsensoren i telefonen snuste rundt, men fant ingenting. Den er ikke særlig god, men du slipper unna.",
    "Indre luktsensor: ingen alkohol påvist. Sensoren har aldri påvist noe som helst, men likevel.",
    "Telefonens indre luktsensor er sist kalibrert på bløtkake, så alkohol er utenfor kompetanseområdet.",
    "Luktsensoren sa «hmm», trakk på skuldrene og ga deg grønt lys.",
    "Telefonens luktsensor er ikke i stand til å lukte alkohol, så du er trygg. Teknisk sett.",
  ];

  const NOCAM_STEPS = [
    "Fant ikke kameraet. Bytter til aura-modus …",
    "Leser auraen din …",
    "Kalibrerer telefonens indre luktsensor …",
    "Måler auraens gyldenhet …",
    "Snuser etter alkohol …",
    "Tolker auraen …",
  ];

  const NOCAM_METRICS = [
    ["Aurafarge", () => "Gylden"],
    ["Auraens styrke", () => rnd(91, 99) + " %"],
    ["Luktsensor", () => "Ingen utslag"],
    ["Aurastemning", () => "Høy"],
    ["Sensorens treffsikkerhet", () => "Ukjent"],
    ["Sosial aura", () => "På topp"],
  ];

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

  async function scan(tooMuch) {
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
    const steps = hasCam ? STEPS : NOCAM_STEPS;

    for (let i = 0; i < steps.length; i++) {
      statusEl.textContent = steps[i];
      bar.style.width = ((i + 1) / steps.length) * 100 + "%";
      await wait(rnd(560, 800));
    }

    showResult(hasCam, !!tooMuch);
    busy = false;
  }

  function showResult(hasCam, tooMuch) {
    const kind = tooMuch ? "mye" : hasCam ? pickKind() : "nocam";
    const n = nextCount();
    const shuffle = (list) => list.slice().sort(() => Math.random() - 0.5);

    // Fryser bildet i øyeblikket
    if (hasCam) video.pause();

    let title, comment, rows;
    if (tooMuch) {
      title = pickFresh("title-mye", TOOMUCH_TITLES);
      comment = hasCam
        ? pickFresh("comment-mye", TOOMUCH_COMMENTS)
        : pickFresh("comment-mye-nocam", TOOMUCH_NOCAM_COMMENTS);
      rows = shuffle(hasCam ? TOOMUCH_METRICS : TOOMUCH_NOCAM_METRICS).slice(0, 3);
    } else if (!hasCam) {
      title = pickFresh("title-nocam", NOCAM_TITLES);
      comment = pickFresh("comment-nocam", NOCAM_COMMENTS);
      rows = shuffle(NOCAM_METRICS).slice(0, 3);
    } else {
      title = pickFresh("title-" + kind, TITLES[kind]);
      if (n >= 3 && Math.random() < 0.4) {
        comment = pickFresh("repeat", REPEAT)(n);
      } else {
        comment = pickFresh("comment-" + kind, COMMENTS[kind]);
      }
      rows = [KIND_METRIC[kind], ...shuffle(METRICS).slice(0, 2)];
    }

    verdictEl.textContent = title;
    commentEl.textContent = comment;

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

    app.dataset.verdict = tooMuch ? "mye" : "ok";
    app.dataset.state = "result";
    resultEl.hidden = false;
    go.disabled = false;
    go.textContent = "Skann på nytt";
    if (navigator.share || navigator.clipboard) shareBtn.hidden = false;

    if (navigator.vibrate) navigator.vibrate(tooMuch ? [90, 50, 90, 50, 180] : [30, 50, 70]);
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

  // Skjult sone: de ytterste ~30 px på høyre kant av hovedknappen
  go.addEventListener("click", (e) => {
    const r = go.getBoundingClientRect();
    const hidden = e.clientX > 0 && e.clientX >= r.right - 30;
    scan(hidden);
  });
  shareBtn.addEventListener("click", share);

  /* ---------- Offline / installasjon ---------- */

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("sw.js").catch(() => {});
    });
  }
})();
