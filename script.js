/* ============================================================
   Muhammad Zubair ul Hassan — portfolio engine
   Scene 1: SVG "camera" world (viewBox = camera)
   Scene 2: page-turn book
   Scene 3: stone wall + curved dotted hill
   ============================================================ */
(() => {
  "use strict";

  const hasGSAP = !!(window.gsap && window.ScrollTrigger);
  if (!hasGSAP) {
    document.documentElement.classList.add("no-anim");
    const n = document.getElementById("name");
    if (n) n.textContent = "Muhammad Zubair ul Hassan";
    return;
  }

  gsap.registerPlugin(ScrollTrigger);
  gsap.config({ nullTargetWarn: false });
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  window.scrollTo(0, 0);

  const REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let lenis = null; // declared early — referenced by the intro below
  const NS = "http://www.w3.org/2000/svg";
  const svgEl = (t, a = {}, p) => {
    const e = document.createElementNS(NS, t);
    for (const k in a) e.setAttribute(k, a[k]);
    if (p) p.appendChild(e);
    return e;
  };
  const rand = (a, b) => a + Math.random() * (b - a);

  /* ------------------------------------------------------------
     WORLD GEOMETRY
     ------------------------------------------------------------ */
  const NAME = "Muhammad Zubair ul Hassan";
  const WORLD = {
    nameX: 1600, nameY: 486,
    orbRest: { x: 1600, y: 400 },
    trunk: "M 1600 610 L 1600 800",
    branches: [
      "M 1600 800 C 1600 900 850 880 850 985",
      "M 1600 800 L 1600 985",
      "M 1600 800 C 1600 900 2350 880 2350 985",
    ],
    children: [
      { x: 850,  y: 985, l1: "8 Years of",  l2: "Experience",  anchor: "end",   lx: 826 },
      { x: 1600, y: 985, l1: "Full Stack",  l2: "Development", anchor: "start", lx: 1626 },
      { x: 2350, y: 985, l1: "Experience",  l2: "",            anchor: "start", lx: 2376 },
    ],
    laneY: 1160,
    techX: [1090, 1320, 1550, 1780, 2010, 2240, 2470, 2700],
    laneEnd: 2840,
    stackX: 1660, stackR: 58,
    stackYs: [1330, 1560, 1790, 2020, 2250, 2480],
    dropEnd: 2660,
  };

  const TECHS = [
    { id: "react",    label: "React" },
    { id: "next",     label: "Next.js" },
    { id: "ts",       label: "TypeScript" },
    { id: "tailwind", label: "Tailwind" },
    { id: "node",     label: "Node.js" },
    { id: "graphql",  label: "GraphQL" },
    { id: "three",    label: "Three.js" },
    { id: "test",     label: "Testing" },
  ];

  /* the full-stack spine: nodes alternate sides of the trunk and each one
     unrolls its own mini tech-lane, drawn badge by badge */
  const STACK = [
    { t: "Frontend Engineering", icon: "frontend", side: -1, techs: ["react", "next", "ts", "tailwind"] },
    { t: "Backend & APIs",       icon: "backend",  side:  1, techs: ["node", "graphql", "rest", "rsc"] },
    { t: "Databases",            icon: "db",       side: -1, techs: ["sql", "nosql", "orm", "tune"] },
    { t: "Testing & Quality",    icon: "testing",  side:  1, techs: ["jest", "vitest", "rtl", "playwright"] },
    { t: "DevOps & Delivery",    icon: "devops",   side: -1, techs: ["docker", "cicd", "git", "vercel"] },
    { t: "Performance & A11y",   icon: "perf",     side:  1, techs: ["cwv", "wcag", "aria", "lazy"] },
  ];
  const MINI = {
    react: { icon: "react" }, next: { icon: "next" }, ts: { icon: "ts" }, tailwind: { icon: "tailwind" },
    node: { icon: "node" }, graphql: { icon: "graphql" }, vercel: { icon: "vercel" },
    rest: { mono: "REST" }, rsc: { mono: "RSC" }, sql: { mono: "SQL" }, nosql: { mono: "NoSQL" },
    orm: { mono: "ORM" }, tune: { mono: "TUNE" }, jest: { mono: "JEST" }, vitest: { mono: "VIT" },
    rtl: { mono: "RTL" }, playwright: { mono: "PW" }, docker: { mono: "DK" }, cicd: { mono: "CI/CD" },
    git: { mono: "GIT" }, cwv: { mono: "CWV" }, wcag: { mono: "WCAG" }, aria: { mono: "ARIA" }, lazy: { mono: "LAZY" },
  };
  const MINI_LABEL = {
    react: "React", next: "Next.js", ts: "TS", tailwind: "Tailwind", node: "Node.js", graphql: "GraphQL",
    vercel: "Vercel", rest: "REST", rsc: "RSC / routes", sql: "SQL", nosql: "NoSQL", orm: "ORM",
    tune: "Query tuning", jest: "Jest", vitest: "Vitest", rtl: "RTL", playwright: "Playwright",
    docker: "Docker", cicd: "CI / CD", git: "Git", cwv: "Web Vitals", wcag: "WCAG", aria: "ARIA", lazy: "Lazy load",
  };

  /* ------------------------------------------------------------
     BUILD THE WORLD
     ------------------------------------------------------------ */
  const world = document.getElementById("world");
  const treeG = document.getElementById("tree");
  const decorG = document.getElementById("decor");
  const burstG = document.getElementById("burst-layer");

  // backdrop
  svgEl("rect", { x: -600, y: -900, width: 5200, height: 4600, fill: "url(#dots)", opacity: .55 }, decorG);
  const blob = (x, y, r, fill, op) =>
    svgEl("circle", { cx: x, cy: y, r, fill, "fill-opacity": op }, decorG);
  blob(300, 700, 420, "url(#softViolet)", .5);
  blob(2950, 620, 500, "url(#softTeal)", .45);
  blob(1050, 1950, 480, "url(#softAmber)", .38);
  blob(2450, 1050, 330, "url(#softAmber)", .45);
  blob(1600, 2560, 520, "url(#softTeal)", .32);
  blob(350, -80, 380, "url(#softTeal)", .25);

  // trunk + branches
  const trunkPath = svgEl("path", { d: WORLD.trunk, class: "line" }, treeG);
  const branchPaths = WORLD.branches.map(d => svgEl("path", { d, class: "line branch" }, treeG));

  // child nodes + halos + labels
  const nodes = [], halos = [], childLabels = [];
  WORLD.children.forEach(c => {
    halos.push(svgEl("circle", { cx: c.x, cy: c.y, r: 18, class: "halo" }, treeG));
    nodes.push(svgEl("circle", { cx: c.x, cy: c.y, r: 15, class: "node-dot", "data-x": c.x, "data-y": c.y }, treeG));
    const t1 = svgEl("text", { x: c.lx, y: 1042, "text-anchor": c.anchor, class: "w-label" }, treeG);
    const t2 = svgEl("text", { x: c.lx, y: 1080, "text-anchor": c.anchor, class: "w-label" }, treeG);
    t1.textContent = c.l1; t2.textContent = c.l2;
    childLabels.push([t1, t2]);
  });

  // branch 1 — the toolkit lane (wrapped in its own layer so the stack
  // can push it back as a background when the spine rises over it)
  const toolkitG = svgEl("g", { id: "toolkit-layer" }, treeG);
  const laneDrop = svgEl("path", { d: `M 850 1000 L 850 ${WORLD.laneY}`, class: "line" }, toolkitG);
  const laneStops = [...WORLD.techX, WORLD.laneEnd];
  /* segments run edge-to-edge: they stop at a circle's rim, never cross it */
  const laneSegs = laneStops.map((sx, i) => svgEl("path", {
    d: `M ${i === 0 ? 850 : laneStops[i - 1] + 60} ${WORLD.laneY} L ${sx - (i === TECHS.length ? 14 : 60)} ${WORLD.laneY}`,
    class: "line",
  }, toolkitG));
  svgEl("text", { x: 880, y: 1092, class: "w-caption" }, toolkitG).textContent = "The daily toolkit";
  const laneGem = svgEl("g", { "data-x": WORLD.laneEnd, "data-y": WORLD.laneY }, toolkitG);
  svgEl("rect", {
    x: WORLD.laneEnd - 8, y: WORLD.laneY - 8, width: 16, height: 16, rx: 3,
    fill: "#f5a524", transform: `rotate(45 ${WORLD.laneEnd} ${WORLD.laneY})`,
  }, laneGem);

  // icons (drawn around 0,0 — placed via translate)
  const ICONS = {
    react: `<ellipse rx="26" ry="10.5"/><ellipse rx="26" ry="10.5" transform="rotate(60)"/><ellipse rx="26" ry="10.5" transform="rotate(120)"/><circle r="4.5" class="icon fill amber"/>`,
    next: `<circle r="27"/><text y="10" text-anchor="middle" font-family="Syne, sans-serif" font-size="30" font-weight="800" fill="#6fd3c7">N</text>`,
    ts: `<rect x="-24" y="-24" width="48" height="48" rx="9"/><text y="8" text-anchor="middle" font-family="'Space Grotesk', sans-serif" font-size="22" font-weight="700" fill="#6fd3c7">TS</text>`,
    tailwind: `<path d="M -27 -4 C -20 -18 -12 -18 -5 -4 C 2 10 10 10 17 -4"/><path d="M -27 10 C -20 -4 -12 -4 -5 10 C 2 24 10 24 17 10"/>`,
    node: `<polygon points="26,0 13,22.5 -13,22.5 -26,0 -13,-22.5 13,-22.5"/><text y="6" text-anchor="middle" font-family="'Space Grotesk', sans-serif" font-size="17" font-weight="700" fill="#6fd3c7">JS</text>`,
    graphql: `<polygon points="0,-24 21,12 -21,12"/><circle cx="0" cy="-24" r="4.5" class="icon fill amber"/><circle cx="21" cy="12" r="4.5" class="icon fill amber"/><circle cx="-21" cy="12" r="4.5" class="icon fill amber"/>`,
    three: `<polygon points="0,-22 19,-11 0,0 -19,-11"/><polygon points="0,0 19,-11 19,11 0,22"/><polygon points="0,0 -19,-11 -19,11 0,22"/>`,
    test: `<path d="M -10 -22 L -6 -22 L -6 -6 L -17 15 Q -20 22 -13 22 L 13 22 Q 20 22 17 15 L 6 -6 L 6 -22 L 10 -22"/><circle cx="0" cy="10" r="3" class="icon fill amber"/><circle cx="-7" cy="16" r="2" class="icon fill amber"/><circle cx="6" cy="17" r="2" class="icon fill amber"/>`,
    vercel: `<polygon points="0,-13 13,11 -13,11" class="icon fill amber"/>`,
  };
  const STACK_ICONS = {
    frontend: `<rect x="-20" y="-17" width="40" height="29" rx="4"/><path d="M -8 18 L 8 18 M 0 12 L 0 18"/>`,
    backend: `<rect x="-18" y="-23" width="36" height="14" rx="3"/><rect x="-18" y="-5" width="36" height="14" rx="3"/><rect x="-18" y="13" width="36" height="14" rx="3"/><circle cx="-12" cy="-16" r="2" class="icon fill amber"/><circle cx="-12" cy="2" r="2" class="icon fill amber"/><circle cx="-12" cy="20" r="2" class="icon fill amber"/>`,
    db: `<ellipse cy="-14" rx="18" ry="7"/><path d="M -18 -14 L -18 14 A 18 7 0 0 0 18 14 L 18 -14"/><path d="M -18 0 A 18 7 0 0 0 18 0"/>`,
    testing: `<path d="M 0 -22 C 8 -18 16 -16 22 -16 C 22 -2 18 12 0 22 C -18 12 -22 -2 -22 -16 C -16 -16 -8 -18 0 -22 Z"/><path d="M -9 0 L -2 8 L 10 -6"/>`,
    devops: `<path d="M -20 2 A 20 20 0 1 1 12 15"/><path d="M 18 4 L 21 20 L 6 16 Z" class="icon fill amber"/>`,
    perf: `<path d="M -20 10 A 22 22 0 1 1 20 10"/><path d="M 0 6 L 12 -8"/><circle r="3.5" class="icon fill amber"/>`,
  };

  // tech circles
  const techGroups = [];
  TECHS.forEach((t, i) => {
    const x = WORLD.techX[i], y = WORLD.laneY;
    const g = svgEl("g", { class: "tech-g", "data-x": x, "data-y": y }, toolkitG);
    g.innerHTML = `
      <circle cx="${x}" cy="${y}" r="60" class="tech-circle"/>
      <g class="icon" transform="translate(${x} ${y})">${ICONS[t.id]}</g>
      <text x="${x}" y="${y + 94}" text-anchor="middle" class="w-tech-label">${t.label}</text>`;
    techGroups.push(g);
  });

  // branch 2 — the full-stack spine: each node alternates sides of the
  // trunk and unrolls its own mini tech-lane, badge by badge
  // (wrapped in its own layer so the drop act can recede it)
  const spineG = svgEl("g", { id: "spine-layer" }, treeG);
  const stackConnector = svgEl("path", {
    d: "M 1600 1000 C 1600 1060 1660 1060 1660 1120 L 1660 1128 A 30 30 0 0 1 1660 1188 L 1660 1272",
    class: "line",
  }, spineG);
  const stackInSegs = [], stackNodes = [];  STACK.forEach((s, i) => {
    const x = WORLD.stackX, y = WORLD.stackYs[i], sg = s.side;
    if (i > 0) {
      const y0 = WORLD.stackYs[i - 1] + WORLD.stackR, y1 = y - WORLD.stackR;
      stackInSegs.push(svgEl("path", { d: `M ${x} ${y0} L ${x} ${y1}`, class: "line" }, spineG));
    }
    const g = svgEl("g", { class: "tech-g", "data-x": x, "data-y": y }, spineG);
    g.innerHTML = `
      <circle cx="${x}" cy="${y}" r="${WORLD.stackR}" class="stack-circle"/>
      <g class="icon" transform="translate(${x} ${y}) scale(.92)">${STACK_ICONS[s.icon]}</g>
      <text x="${x - sg * 78}" y="${y - 6}" text-anchor="${sg > 0 ? "end" : "start"}" class="w-stack-title">${s.t}</text>`;
    const segs = [], badges = [];
    s.techs.forEach((id, j) => {
      const bx = x + sg * (150 + j * 105), by = y;
      /* edge-to-edge: from the previous rim to just before this rim */
      const fromX = j === 0 ? x + sg * WORLD.stackR : x + sg * (150 + (j - 1) * 105) + sg * 34;
      segs.push(svgEl("path", { d: `M ${fromX} ${by} L ${bx - sg * 34} ${by}`, class: "line" }, spineG));
      const bg = svgEl("g", { class: "tech-g", "data-x": bx, "data-y": by }, spineG);
      const spec = MINI[id];
      const inner = spec.icon
        ? `<g class="icon" transform="translate(${bx} ${by}) scale(.62)">${ICONS[spec.icon]}</g>`
        : `<text x="${bx}" y="${by + 5}" text-anchor="middle" class="w-mono" font-size="${spec.mono.length <= 3 ? 14 : spec.mono.length === 4 ? 12 : 10}">${spec.mono}</text>`;
      bg.innerHTML = `
        <circle cx="${bx}" cy="${by}" r="34" class="tech-circle"/>
        ${inner}
        <text x="${bx}" y="${by + 58}" text-anchor="middle" class="w-mini-label">${MINI_LABEL[id]}</text>`;
      badges.push(bg);
    });
    stackNodes.push({ g, segs, badges });
  });

  // branch 3 — the line just keeps running to the bottom of the world;
  // the companies scene then slides up over it like a parallax layer
  const dropConnector = svgEl("path", {
    d: `M 2350 1000 L 2350 1128 A 25 25 0 0 1 2350 1178 L 2350 ${WORLD.dropEnd - 40}`,
    class: "line",
  }, treeG);
  const dropDot = svgEl("g", { class: "tech-g", "data-x": 2350, "data-y": WORLD.dropEnd }, treeG);
  dropDot.innerHTML = `<circle cx="2350" cy="${WORLD.dropEnd}" r="15" class="node-dot"/>`;
  const dropHalo = svgEl("circle", { cx: 2350, cy: WORLD.dropEnd, r: 18, class: "halo" }, treeG);

  // camera
  const cam = { x: 800, y: 30, w: 1700 };
  const aspect = () => window.innerWidth / Math.max(1, window.innerHeight);
  const WF = gsap.utils.clamp(0.68, 1, aspect() / 1.45);
  const applyCam = () => {
    const a = aspect(), h = cam.w / a;
    world.setAttribute("viewBox", `${cam.x} ${cam.y} ${cam.w} ${h}`);
  };
  applyCam();

  const camTo = (tl, at, dur, kf, ease = "power2.inOut") => {
    const w = kf.w * WF, a = aspect();
    tl.to(cam, {
      x: kf.cx - w / 2, y: kf.cy - (w / a) / 2, w, duration: dur, ease,
      onUpdate: applyCam,
    }, at);
  };

  // pre-hide everything that pops later (scrubbed fromTo tweens only
  // apply their "from" state once the playhead reaches them)
  nodes.forEach(n => gsap.set(n, { scale: 0, opacity: 0, svgOrigin: `${n.dataset.x} ${n.dataset.y}` }));
  [...techGroups, ...stackNodes.map(n => n.g), dropDot].forEach(g =>
    gsap.set(g, { scale: 0, opacity: 0, svgOrigin: `${g.dataset.x} ${g.dataset.y}` }));
  stackNodes.forEach(n => n.badges.forEach(b =>
    gsap.set(b, { scale: 0, opacity: 0, svgOrigin: `${b.dataset.x} ${b.dataset.y}` })));
  gsap.set(laneGem, { scale: 0, opacity: 0, svgOrigin: `${WORLD.laneEnd} ${WORLD.laneY}` });
  childLabels.flat().forEach(t => gsap.set(t, { opacity: 0, y: 18 }));

  /* ------------------------------------------------------------
     INTRO — drop, click, burst, typewriter
     ------------------------------------------------------------ */
  const orb = document.getElementById("orb");
  const orbBall = document.getElementById("orb-ball");
  gsap.set(orb, { autoAlpha: 0 }); // hidden until the drop begins
  const nameText = document.getElementById("name");
  const caret = document.getElementById("caret");
  const subtitle = document.getElementById("subtitle");
  let startX = 1200, introDone = false, seqStarted = false;
  let burstX = 1150, burstY = 448;

  // measure the name once fonts are ready
  const fontsReady = Promise.race([
    document.fonts ? document.fonts.ready : Promise.resolve(),
    new Promise(r => setTimeout(r, 2600)),
  ]);

  fontsReady.then(() => {
    nameText.textContent = NAME;
    const w = nameText.getComputedTextLength();
    startX = WORLD.nameX - w / 2;
    burstX = startX - 46;
    nameText.setAttribute("x", startX);
    nameText.textContent = "";
    startDrop();
  });

  function startDrop() {
    gsap.set(orb, { x: WORLD.orbRest.x, y: -240, autoAlpha: 1 });
    const drop = gsap.timeline({
      onComplete: () => {
        orb.addEventListener("click", beginSequence);
        orb.addEventListener("keydown", e => {
          if (e.key === "Enter" || e.key === " ") { e.preventDefault(); beginSequence(); }
        });
        scheduleNudges();
      },
    });
    drop.to(orb, { y: WORLD.orbRest.y, duration: 1.55, ease: "bounce.out" })
        .to(orbBall, { scaleY: .7, scaleX: 1.24, duration: .13, ease: "power1.out" })
        .to(orbBall, { scaleY: 1, scaleX: 1, duration: .6, ease: "elastic.out(1,.4)" });
    // pulsing invitation ring
    gsap.to("#orb-ring", { attr: { r: 96 }, opacity: 0, duration: 1.7, repeat: -1, ease: "power1.out" });
    gsap.set("#orb-ring", { attr: { r: 62 }, opacity: .6 });
    if (!REDUCED) {
      gsap.to(orb, { y: WORLD.orbRest.y - 9, duration: 2.3, yoyo: true, repeat: -1, ease: "sine.inOut", delay: 2.4, svgOrigin: `${WORLD.orbRest.x} ${WORLD.orbRest.y}` });
    }
  }

  let nudgeTimer, autoTimer;
  function scheduleNudges() {
    nudgeTimer = setTimeout(() => {
      if (!introDone && !seqStarted)
        gsap.to(orb, { scale: 1.14, duration: .18, yoyo: true, repeat: 3, ease: "power1.inOut", svgOrigin: `${burstX} ${burstY}` });
    }, 6000);
    autoTimer = setTimeout(() => { if (!introDone && !seqStarted) beginSequence(); }, 17000);
  }

  function burst(x, y) {
    const cols = ["#f5a524", "#ece7db", "#6fd3c7", "#e0883c"];
    for (let i = 0; i < 34; i++) {
      const c = svgEl("circle", { cx: x, cy: y, r: rand(2.4, 6.4), fill: cols[i % 4] }, burstG);
      const a = Math.random() * Math.PI * 2, d = rand(70, 270);
      gsap.to(c, {
        cx: x + Math.cos(a) * d, cy: y + Math.sin(a) * d * .9,
        opacity: 0, duration: rand(.6, 1.15), ease: "power3.out",
        onComplete: () => c.remove(),
      });
    }
    for (let i = 0; i < 12; i++) {
      const r = svgEl("rect", { x: x - 4, y: y - 2.5, width: 8, height: 5, rx: 1.4, fill: cols[(i + 1) % 4] }, burstG);
      const a = Math.random() * Math.PI * 2, d = rand(90, 300);
      gsap.to(r, {
        x: x + Math.cos(a) * d - 4, y: y + Math.sin(a) * d - 2.5,
        rotation: rand(-260, 260), opacity: 0, duration: rand(.7, 1.2), ease: "power3.out",
        svgOrigin: `${x} ${y}`, onComplete: () => r.remove(),
      });
    }
    const ring = svgEl("circle", { cx: x, cy: y, r: 12, fill: "none", stroke: "#f5a524", "stroke-width": 3 }, burstG);
    gsap.to(ring, { attr: { r: 160 }, opacity: 0, duration: .75, ease: "power2.out", onComplete: () => ring.remove() });
  }

  function beginSequence() {
    if (seqStarted || introDone) return;
    seqStarted = true;
    clearTimeout(nudgeTimer); clearTimeout(autoTimer);
    gsap.globalTimeline.getChildren(true, true, true).forEach(t => {
      if (t.targets && t.targets().includes(orb) && t.repeat === -1) t.kill();
    });
    gsap.killTweensOf("#orb-ring");

    const typing = { v: 0 };
    const seq = gsap.timeline({
      onComplete: finishIntro,
    });
    seq.to("#orb-hint", { opacity: 0, duration: .2 }, 0)
       .to(orb, { x: burstX, y: burstY, duration: .8, ease: "power2.inOut" }, 0)
       .to(orbBall, { scaleX: 1.28, scaleY: .78, duration: .14, ease: "power1.out" }, .62)
       .to(orb, { scale: 0, duration: .3, ease: "back.in(2.2)", svgOrigin: `${burstX} ${burstY}` }, .78)
       .to("#orb-ring", { opacity: 0, duration: .2 }, .78)
       .add(() => burst(burstX, burstY), .95)
       .add(() => {
         caret.setAttribute("x", startX);
         gsap.to(caret, { opacity: 1, duration: .1 });
         gsap.to(caret, { opacity: 0, duration: .32, repeat: -1, yoyo: true, ease: "steps(1)" });
       }, 1.05)
       .to(typing, {
         v: 1, duration: Math.max(1.1, NAME.length * .062), ease: "none",
         onUpdate: () => {
           const n = Math.round(typing.v * NAME.length);
           nameText.textContent = NAME.slice(0, n);
           const w = n ? nameText.getSubStringLength(0, n) : 0;
           caret.setAttribute("x", startX + w + 6);
         },
       }, 1.15);
  }

  function finishIntro() {
    introDone = true;
    gsap.killTweensOf(caret);
    gsap.to(caret, { opacity: 0, duration: .4 });
    gsap.fromTo(subtitle, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: .8, ease: "power2.out" });
    if (!hintHidden) gsap.to("#hint-scroll", { opacity: 1, duration: .6, delay: .5 });
    gsap.to("#lock-note", { opacity: 0, duration: .4 });
    if (lenis) lenis.start();
  }

  /* ------------------------------------------------------------
     SCENE 1 TIMELINE — the camera journey (scrubbed)
     ------------------------------------------------------------ */
  if (lenis) lenis.stop();

  const KF = {
    overview: { cx: 1600, cy: 800, w: 2100 },
    child1:   { cx: 900,  cy: 1080, w: 1200 },
    stackTop: { cx: 1700, cy: 1350, w: 1250 },
    child3:   { cx: 2350, cy: 1420, w: 1250 },
    child3End:{ cx: 2000, cy: 2210, w: 1900 },
  };

  const chip = document.getElementById("chip");
  const setChip = t => { chip.textContent = t; };
  let hintHidden = false;

  /* one big scrubbed journey; the ScrollTrigger (pin + scroll length) is
     attached after the acts are built so the pin distance scales with the
     choreography */
  const marks = {};
  const tl = gsap.timeline({ defaults: { ease: "none" } });

  const draw = (p, at, dur, ease = "none") => {
    const L = p.getTotalLength();
    p.style.strokeDasharray = L;
    p.style.strokeDashoffset = L;
    tl.to(p, { strokeDashoffset: 0, duration: dur, ease }, at);
  };
  const pop = (g, at, rot = -24, ease = "back.out(1.8)") => {
    const o = `${g.dataset.x} ${g.dataset.y}`;
    tl.fromTo(g,
      { scale: 0, rotation: rot, opacity: 0, svgOrigin: o },
      { scale: 1, rotation: 0, opacity: 1, duration: .5, ease, svgOrigin: o }, at);
  };
  const ping = (h, at) => {
    tl.to(h, {
      ease: "none",
      keyframes: [
        { attr: { r: 20 }, opacity: .9, duration: .06, ease: "power1.out" },
        { attr: { r: 54 }, opacity: 0, duration: .74, ease: "power1.out" },
      ],
    }, at);
  };

  // — act 1: the tree grows —
  draw(trunkPath, 0, .45);
  branchPaths.forEach((b, i) => draw(b, .3 + i * .08, .8, "power1.inOut"));
  nodes.forEach((n, i) => pop(n, .95 + i * .07, -90, "back.out(2)"));
  childLabels.flat().forEach((t, i) =>
    tl.fromTo(t, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: .4 }, 1.0 + i * .05));
  camTo(tl, .2, 1.1, KF.overview);

  // — act 2: focus child 1 —
  camTo(tl, 1.35, 1.15, KF.child1);
  ping(halos[0], 1.45); ping(halos[0], 2.2);

  // — act 3: the toolkit lane, drawn tech by tech —
  // the line runs up to each circle, the circle pops, then the line moves on
  const laneStart = 2.55; marks.lane = laneStart;
  draw(laneDrop, laneStart, .3);
  let laneT = laneStart + .3;
  TECHS.forEach((_, i) => {
    draw(laneSegs[i], laneT, .26);
    pop(techGroups[i], laneT + .26, 0, "back.out(1.9)");
    laneT += .5;
  });
  draw(laneSegs[TECHS.length], laneT, .26);      // into the end gem
  pop(laneGem, laneT + .26, 45, "back.out(3)");
  /* the camera rides the lane: it slides in close on each tech as it pops */
  TECHS.forEach((_, i) =>
    camTo(tl, 2.89 + i * .5, .46, { cx: WORLD.techX[i], cy: WORLD.laneY, w: 820 }));
  camTo(tl, 6.93, .4, { cx: WORLD.laneEnd - 50, cy: WORLD.laneY, w: 760 });

  // — act 4: the full-stack spine — one node at a time, each unrolling
  // its own mini-lane while the camera visits it, then back to the trunk
  const stackStart = 7.7; marks.stack = stackStart;
  camTo(tl, 7.55, .75, KF.stackTop);
  ping(halos[1], 7.75);
  // the toolkit recedes to a background layer as the spine rises over it
  tl.to("#toolkit-layer", { opacity: .26, duration: .5, ease: "power1.inOut" }, stackStart + .2);
  draw(stackConnector, stackStart + .25, .55, "power1.inOut");
  const nodeKF  = (y, sg) => ({ cx: WORLD.stackX + sg * 90, cy: y + 10, w: 1150 });
  const spineKF = (y)     => ({ cx: 1720, cy: y + 200, w: 1300 });
  STACK.forEach((s, i) => {
    const s0 = 8.55 + i * 2.4, sg = s.side, N = stackNodes[i], y = WORLD.stackYs[i];
    if (i > 0) draw(stackInSegs[i - 1], s0, .2);
    pop(N.g, s0 + .22, sg * 8, "back.out(1.8)");
    camTo(tl, s0 + .15, .55, nodeKF(y, sg));
    N.segs.forEach((sp, j) => draw(sp, s0 + .66 + j * .34, .2));
    N.badges.forEach((bg, j) => {
      const bx = WORLD.stackX + sg * (150 + j * 105);
      pop(bg, s0 + .86 + j * .34, sg * 30, "back.out(2)");
      /* the camera leans into each badge right as it pops */
      camTo(tl, s0 + .72 + j * .34, .3, { cx: bx, cy: y, w: 640 });
    });
    camTo(tl, s0 + 2.08, .3, spineKF(y), "power1.inOut");
  });

  // — act 5: child 3 just keeps drawing to the bottom of the world —
  // the line lands with a small burst, then the book slides over everything
  const dropStart = 23.1; marks.drop = dropStart;
  camTo(tl, 22.95, .8, KF.child3);
  ping(halos[2], dropStart + .1);
  draw(dropConnector, dropStart + .25, 1.25, "power1.inOut");
  pop(dropDot, dropStart + 1.7, 0, "back.out(2)");
  ping(dropHalo, dropStart + 1.65);
  camTo(tl, dropStart + 1.15, .95, KF.child3End);
  /* the earlier acts recede to a backdrop; the companies scene arrives next */
  tl.to(["#toolkit-layer", "#spine-layer"], { opacity: .18, duration: .6, ease: "power1.inOut" }, dropStart + .05);
  tl.to({}, { duration: .3 }); // hold so the burst lands before the handoff

  /* the stage pin is sized from the finished timeline: one tl unit ≈ 818px */
  const stageTotal = tl.duration();
  const TH = { lane: marks.lane / stageTotal, stack: marks.stack / stageTotal, drop: marks.drop / stageTotal };
  ScrollTrigger.create({
    trigger: "#stage", start: "top top",
    end: () => "+=" + Math.round(stageTotal * 818),
    pin: true, scrub: 1, anticipatePin: 1,
    animation: tl,
    onUpdate: self => {
      const p = self.progress;
      if (!hintHidden && p > .03) { hintHidden = true; gsap.to("#hint-scroll", { opacity: 0, duration: .4 }); }
      if (self.isActive) setChip(
        p < .04 ? "01 · Hello" :
        p < TH.lane ? "01 · The Tree" :
        p < TH.stack ? "02 · The Toolkit" :
        p < TH.drop ? "03 · Full-Stack" : "04 · The Drop");
    },
  });

  /* ------------------------------------------------------------
     SCENE 2 — the book of five companies
     ------------------------------------------------------------ */
  const COMPANIES = [
    {
      co: "TRUEY INC", role: "Senior Frontend Engineer", dates: "Oct 2025 — Nov 2026",
      pts: [
        "Built the Next.js frontend — complex carousels, component layouts and pure-CSS responsive structure.",
        "Delivered ~30% faster with AI-assisted workflows (Claude, Codex): skills, agents, context engineering.",
        "Shipped Inneractive & AuraPhoto on Strapi CMS — Figma pixel-perfect, Tailwind token mapping, automation scripts.",
        "Storybook components with full variants & theming; GSAP + Lenis motion and design-token fixes.",
      ],
      tags: ["Next.js", "Storybook", "GSAP", "Lenis", "Strapi", "Tailwind"],
    },
    {
      co: "USTAFF360", role: "Senior Frontend Developer", dates: "Sep 2024 — Mar 2025",
      pts: [
        "Architected the initial Next.js + TypeScript app (server components, API routes) for the TIBERBU healthcare suite.",
        "Converted it into a pnpm monorepo: AFYALINK, TEEDU, HEALTHPRO.",
        "Recoil + Base UI + shadcn/ui; facility-certification and consent-approval workflows.",
        "RSC container patterns and custom hooks cut component complexity by 40%.",
      ],
      tags: ["Next.js", "TypeScript", "pnpm", "Recoil", "shadcn/ui"],
    },
    {
      co: "CARE", role: "Senior Design Engineer", dates: "Sep 2023 — Jul 2024",
      pts: [
        "Greenfield renovation of the JOGET low-code platform — decoupled its Java Spring MVC logic from the UI layer.",
        "Fresh custom React theme: vertical & horizontal sidebars, RTL support, new layout patterns.",
        "Rebuilt forms, list views, fonts and color schemes; large-scale refactoring with backend teams.",
      ],
      tags: ["React", "JOGET", "RTL", "Design Systems"],
    },
    {
      co: "Embrace-It", role: "Frontend Engineer", dates: "Jan 2022 — Mar 2023",
      pts: [
        "Migrated the Geniebelt codebase from AngularJS 1.x to React + TypeScript with Recoil state management.",
        "Built test suites and data factories with Fishery; introduced the master-plan copy feature.",
        "Fixed critical PWA layout & state issues; polished icon animations and transitions.",
      ],
      tags: ["React", "TypeScript", "Recoil", "PWA", "Fishery"],
    },
    {
      co: "CARE", role: "Design Engineer", dates: "Sep 2018 — Dec 2022",
      pts: [
        "Built JOGET no-code ERP themes (Blueberry, Classic) — user configs, colors, fonts, icons, carousels.",
        "Kendo UI-based themed form elements (inputs, selects, editors) and list-view components.",
        "Onboarded 20+ departments from manual processes to full ERP automation; residential on-premise engineer.",
      ],
      tags: ["Kendo UI", "jQuery", "LESS", "ERP"],
    },
  ];

  const book = document.getElementById("book");
  const baseEl = book.querySelector(".page.base");
  const pages = COMPANIES.map((c, i) => {
    const p = document.createElement("div");
    p.className = "page";
    p.innerHTML = `
      <div class="front">
        <div class="p-stamp big">${c.co[0]}</div>
        <div class="p-head"><span class="p-index">0${i + 1} / 05</span><span class="p-dates">${c.dates}</span></div>
        <h3 class="p-company">${c.co}</h3>
        <p class="p-role">${c.role}</p>
        <ul class="p-list">${c.pts.map(pt => `<li>${pt}</li>`).join("")}</ul>
        <div class="p-tags">${c.tags.map(t => `<span>${t}</span>`).join("")}</div>
      </div>
      <div class="back">
        <span class="initial">${c.co[0]}</span>
        <span class="bignum">0${i + 1}</span>
        <span class="flip-note">page turned</span>
      </div>`;
    book.insertBefore(p, baseEl);
    return p;
  });
  pages.forEach((p, i) => { p.style.zIndex = 10 - i; });
  baseEl.style.zIndex = 0;

  /* the companies scene arrives like a parallax layer: its glow blobs
     drift slower than the section itself while it slides over the tree */
  gsap.fromTo(".companies-bg .bg-blob", { yPercent: 30 }, {
    yPercent: -30, ease: "none",
    scrollTrigger: { trigger: "#companies", start: "top bottom", end: "top top", scrub: true },
  });

  const dotsWrap = document.getElementById("book-dots");
  COMPANIES.forEach(() => dotsWrap.appendChild(document.createElement("i")));
  const dots = [...dotsWrap.children];

  const FLIP_AT = .95, FLIP_DUR = .85, FLIP_STEP = .95;
  /* page stacking + dots live on the timeline's own onUpdate: it fires on
     every animation tick (including scrub catch-up), not just scroll events */
  const bookTl = gsap.timeline({
    onUpdate: () => {
      const t = bookTl.time();
      let flipped = 0;
      pages.forEach((p, i) => {
        const pr = gsap.utils.clamp(0, 1, (t - (FLIP_AT + i * FLIP_STEP)) / FLIP_DUR);
        p.style.zIndex = pr >= .5 ? i + 1 : 10 - i;
        if (pr >= 1) flipped++;
      });
      dots.forEach((d, i) => d.classList.toggle("on", i < flipped));
    },
    scrollTrigger: {
      trigger: "#companies", start: "top top", end: "+=6200",
      pin: true, scrub: 1, anticipatePin: 1,
      onUpdate: self => { if (self.isActive) setChip("05 · Companies"); },
      onLeaveBack: () => setChip("04 · The Drop"),
    },
  });
  bookTl.from("#book", { y: 130, rotationX: 9, opacity: 0, duration: .7, ease: "power2.out", transformOrigin: "50% 100%" }, 0)
        .from(".book-dots", { opacity: 0, duration: .4 }, .45);
  /* pages don't fold flat to -180°: the held cover tilts toward the reader,
     so a flat page would slide behind it. Instead each page rests fanned
     against the cover — a touch steeper than the cover and lifted toward
     the reader, like a real half-open book being thumbed through */
  pages.forEach((p, i) =>
    bookTl.to(p, {
      rotationY: -(124 - i * 3),   // bottom of the pile flatter, top steeper
      z: 8 + i * 15,               // stack thickness toward the reader
      duration: FLIP_DUR, ease: "power2.inOut",
    }, FLIP_AT + i * FLIP_STEP));
  bookTl.to({}, { duration: .55 }); // hold on the summary page

  /* ------------------------------------------------------------
     SCENE 3 — contact
     ------------------------------------------------------------ */
  gsap.from("#contact .contact-inner > *", {
    y: 50, opacity: 0, stagger: .12, duration: .8, ease: "power3.out",
    scrollTrigger: { trigger: "#contact", start: "top 68%" },
  });
  gsap.from(".wall", {
    y: 150, opacity: 0, duration: 1, ease: "power3.out",
    scrollTrigger: { trigger: ".wall", start: "top 88%" },
  });
  gsap.set("#hang", { rotation: -1.4, transformOrigin: "50% 8px" });
  const hangIn = gsap.from("#hang", {
    y: -170, opacity: 0, rotation: 3.5, duration: 1.15, ease: "back.out(1.3)",
    transformOrigin: "50% 8px",
    scrollTrigger: { trigger: ".wall", start: "top 58%" },
    onComplete: () => {
      if (!REDUCED) gsap.to("#hang", { rotation: 1.6, duration: 2.8, ease: "sine.inOut", yoyo: true, repeat: -1, transformOrigin: "50% 8px" });
    },
  });
  if (!REDUCED) {
    gsap.from(".landscape", {
      y: 90, ease: "none",
      scrollTrigger: { trigger: "#contact", start: "top bottom", end: "bottom bottom", scrub: true },
    });
  }

  /* ------------------------------------------------------------
     chrome
     ------------------------------------------------------------ */
  ScrollTrigger.create({
    trigger: "#contact", start: "top 60%", end: "bottom bottom",
    onEnter: () => setChip("06 · Contact"),
    onEnterBack: () => setChip("06 · Contact"),
    onLeaveBack: () => setChip("05 · Companies"),
  });
  gsap.to("#progress", {
    scaleX: 1, ease: "none",
    scrollTrigger: { trigger: document.body, start: "top top", end: "max", scrub: .3 },
  });

  /* ------------------------------------------------------------
     smooth scroll (Lenis)
     ------------------------------------------------------------ */
  try {
    if (window.Lenis && !REDUCED) {
      lenis = new Lenis({ lerp: .09, smoothWheel: true });
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(t => lenis.raf(t * 1000));
      gsap.ticker.lagSmoothing(0);
    }
  } catch (e) { lenis = null; }
  window.__lenis = lenis;

  window.addEventListener("resize", applyCam);
})();
