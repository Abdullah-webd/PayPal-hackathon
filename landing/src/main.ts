import "./fonts.css";
import "./style.css";
import "lenis/dist/lenis.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger, SplitText);
ScrollTrigger.config({ ignoreMobileResize: true });
gsap.defaults({ ease: "expo.out", duration: 0.9 });

const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const $ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) => root.querySelector<T>(sel)!;
const $$ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) => Array.from(root.querySelectorAll<T>(sel));

/* ---------- Smooth scroll ---------- */
let lenis: Lenis | null = null;
if (!reduce) {
  lenis = new Lenis({ lerp: 0.09, anchors: { offset: -70 } });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((t) => lenis!.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
}
document.fonts?.ready.then(() => ScrollTrigger.refresh());

/* ---------- Nav: solid after the hero starts, hides on scroll down ---------- */
const nav = $(".nav");
ScrollTrigger.create({
  start: 0,
  end: "max",
  onUpdate(self) {
    const y = self.scroll();
    nav.classList.toggle("is-solid", y > 40);
    nav.classList.toggle("is-hidden", y > 500 && self.direction === 1);
  },
});

/* ---------- Hero chat: messages arrive one by one ----------
   Every message stays in the layout; the chat column slides up with a transform,
   so new messages never shift the page layout. */
const chatWin = $(".hero-phone .chat");
const chatInner = $(".chat-inner");
const chatMsgs = $$("[data-msg]");
const typing = $(".typing");
let chatTl: gsap.core.Timeline | null = null;

// How far to move the column so this message sits at the bottom of the window.
const offsetFor = (m: HTMLElement, extra = 0) => chatWin.clientHeight - (m.offsetTop + m.offsetHeight) - 12 - extra;

function showWholeChat() {
  gsap.set(chatMsgs, { autoAlpha: 1, y: 0, scale: 1 });
  gsap.set(typing, { autoAlpha: 0 });
  gsap.set(chatInner, { y: offsetFor(chatMsgs[chatMsgs.length - 1]) });
}

function playChat(delay = 0) {
  chatTl?.kill();
  gsap.set(chatMsgs, { autoAlpha: 0 });
  gsap.set(typing, { autoAlpha: 0 });
  gsap.set(chatInner, { y: chatWin.clientHeight });
  const tl = gsap.timeline({ delay });
  chatMsgs.forEach((m) => {
    const isBot = m.classList.contains("bot");
    if (isBot) {
      tl.to(chatInner, { y: () => offsetFor(m, 0) - 44 + m.offsetHeight, duration: 0.3, ease: "power3.out" }, "+=0.15")
        .to(typing, { autoAlpha: 1, duration: 0.15, ease: "power2.out" }, "<")
        .to(typing.children, { y: -3, duration: 0.2, stagger: 0.08, yoyo: true, repeat: 1, ease: "sine.inOut" }, "<")
        .to(typing, { autoAlpha: 0, duration: 0.1 });
    } else {
      tl.to({}, { duration: 0.4 });
    }
    tl.to(chatInner, { y: () => offsetFor(m), duration: 0.4, ease: "expo.out" })
      .fromTo(m, { autoAlpha: 0, y: 12, scale: 0.94, transformOrigin: isBot ? "0% 100%" : "100% 100%" },
        { autoAlpha: 1, y: 0, scale: 1, duration: 0.4, ease: "expo.out" }, "<");
  });
  chatTl = tl;
}

/* ---------- Intro ---------- */
function intro() {
  const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
  tl.to(".intro-curtain", { scaleY: 0, transformOrigin: "50% 0%", duration: 0.85, ease: "expo.inOut" })
    .from(".hero-line > span", { yPercent: 110, duration: 1.0, stagger: 0.08 }, "-=0.45")
    .from(".hero-phone", { y: 90, rotate: 4, autoAlpha: 0, duration: 1.1 }, "<0.1")
    .from(".hero-meta > *", { y: 18, autoAlpha: 0, duration: 0.6, stagger: 0.06 }, "-=0.8")
    .from(".nav", { autoAlpha: 0, duration: 0.5, ease: "power2.out" }, "<")
    .set(".intro-curtain", { display: "none" });
  playChat(1.2);
}

$(".replay").addEventListener("click", () => playChat(0));

/* ---------- Scroll set-pieces ---------- */
function problem() {
  SplitText.create(".manifesto", {
    type: "words",
    aria: "none", // words stay readable in order; no label needed on a <p>
    autoSplit: true,
    onSplit(self) {
      return gsap.fromTo(self.words, { opacity: 0.2 }, {
        opacity: 1, stagger: 0.1, ease: "none",
        scrollTrigger: { trigger: ".manifesto", start: "top 78%", end: "bottom 45%", scrub: true },
      });
    },
  });

  // The receipt prints out of a POS machine: it unrolls from the top, then the lines appear.
  const tl = gsap.timeline({ scrollTrigger: { trigger: ".receipt-wrap", start: "top 75%", once: true } });
  tl.fromTo(".receipt", { clipPath: "inset(0% 0% 100% 0%)", y: -40 }, { clipPath: "inset(0% 0% 0% 0%)", y: 0, duration: 1.6, ease: "power3.out" })
    .from(".r-items li, .r-total", { autoAlpha: 0, x: -8, duration: 0.4, stagger: 0.07, ease: "power2.out" }, 0.25)
    .from(".r-stub-big", { yPercent: 60, autoAlpha: 0, duration: 0.7 }, "-=0.2");
}

function goal() {
  SplitText.create(".goal-line", {
    type: "lines",
    mask: "lines",
    autoSplit: true,
    onSplit(self) {
      return gsap.from(self.lines, {
        yPercent: 110, rotate: 3, transformOrigin: "0% 100%", duration: 1.1, stagger: 0.12,
        scrollTrigger: { trigger: ".goal-line", start: "top 78%", once: true },
      });
    },
  });
  gsap.from(".goal-sub", { autoAlpha: 0, y: 24, duration: 0.8, scrollTrigger: { trigger: ".goal-sub", start: "top 90%", once: true } });
}

/* How it works: one phone, five screens */
const steps = $$(".step");
const screens = $$(".screen");
let current = 0;

function setStep(i: number, instant = false) {
  if (i === current && !instant) return;
  const prev = screens[current];
  const next = screens[i];
  const dir = i > current ? 1 : -1;
  steps.forEach((s, k) => s.classList.toggle("is-active", k === i));
  if (instant || reduce) {
    screens.forEach((s, k) => { s.classList.toggle("is-active", k === i); gsap.set(s, { clearProps: "all" }); });
  } else if (prev !== next) {
    gsap.killTweensOf([prev, next]);
    gsap.to(prev, { autoAlpha: 0, y: -40 * dir, duration: 0.35, ease: "power2.in", onComplete: () => prev.classList.remove("is-active") });
    next.classList.add("is-active");
    gsap.fromTo(next, { autoAlpha: 0, y: 50 * dir }, { autoAlpha: 1, y: 0, duration: 0.6, ease: "expo.out", delay: 0.12 });
    const bits = next.querySelectorAll(".msg, .p, .share-list li, .sms, .store-hero, .lock-time");
    gsap.fromTo(bits, { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.06, delay: 0.25, ease: "expo.out" });
  }
  current = i;
}

function how(desktop: boolean) {
  if (desktop) {
    ScrollTrigger.create({
      trigger: ".how-pin",
      start: "top top",
      end: () => "+=" + window.innerHeight * 3.2,
      pin: true,
      pinType: "transform",
      anticipatePin: 1,
      invalidateOnRefresh: true,
      snap: { snapTo: 1 / 4, duration: { min: 0.2, max: 0.5 }, delay: 0.05, ease: "power1.inOut" },
      onUpdate(self) {
        setStep(Math.round(self.progress * 4));
        gsap.set(".progress i", { scaleX: 0.2 + self.progress * 0.8 });
      },
    });
    gsap.from(".how-phone", { y: 80, rotate: -3, duration: 1.1, scrollTrigger: { trigger: ".how", start: "top 70%", once: true } });
  } else {
    steps.forEach((step, i) => {
      ScrollTrigger.create({
        // The phone stays pinned at the top on small screens, so a step is "current"
        // while its heading sits in the visible area below the phone.
        trigger: step, start: "top 95%", end: "top 55%",
        onEnter: () => setStep(i),
        onEnterBack: () => setStep(i),
      });
    });
  }
}

function approach(desktop: boolean) {
  const track = $(".h-track");
  if (desktop) {
    const dist = () => Math.max(0, track.scrollWidth - window.innerWidth);
    const tween = gsap.to(track, {
      x: () => -dist(), ease: "none",
      scrollTrigger: {
        trigger: ".approach", start: "top top", end: () => "+=" + dist(),
        scrub: 1, pin: true, pinType: "transform", anticipatePin: 1, invalidateOnRefresh: true,
      },
    });
    $$(".block").forEach((b, i) => {
      gsap.fromTo(b, { y: 60 + (i % 2) * 40, rotate: i % 2 ? 2.5 : -2 }, {
        y: 0, rotate: 0, ease: "none",
        scrollTrigger: { trigger: b, containerAnimation: tween, start: "left 100%", end: "left 60%", scrub: true },
      });
    });
  } else {
    gsap.from(".block", { y: 50, autoAlpha: 0, stagger: 0.08, duration: 0.9, scrollTrigger: { trigger: ".h-wrap", start: "top 85%", once: true } });
  }
  SplitText.create(".approach-title", {
    type: "lines", mask: "lines", autoSplit: true,
    onSplit(self) {
      return gsap.from(self.lines, { yPercent: 105, duration: 1, stagger: 0.1, scrollTrigger: { trigger: ".approach-title", start: "top 82%", once: true } });
    },
  });
}

function team() {
  const tl = gsap.timeline({ scrollTrigger: { trigger: ".team", start: "top 70%", once: true } });
  tl.fromTo(".ticket", { clipPath: "inset(0% 100% 0% 0%)", rotate: -10, y: 30 }, { clipPath: "inset(0% 0% 0% 0%)", rotate: -3, y: 0, duration: 1.3, ease: "expo.out" })
    .from(".ticket-stub span", { yPercent: 40, autoAlpha: 0, duration: 0.8 }, 0.5);

  SplitText.create(".team-title", {
    type: "lines", mask: "lines", autoSplit: true,
    onSplit(self) {
      return gsap.from(self.lines, { yPercent: 105, duration: 1, stagger: 0.1, scrollTrigger: { trigger: ".team-title", start: "top 82%", once: true } });
    },
  });
  gsap.fromTo(".team-copy [data-reveal]", { autoAlpha: 0, y: 24 }, {
    autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.1, ease: "expo.out",
    scrollTrigger: { trigger: ".team-copy", start: "top 75%", once: true },
  });
}

function join() {
  gsap.fromTo(".plaid-inner", { xPercent: 0 }, {
    xPercent: -25, ease: "none",
    scrollTrigger: { trigger: ".join", start: "top bottom", end: "bottom top", scrub: true },
  });
  SplitText.create(".join-title", {
    type: "lines", mask: "lines", autoSplit: true,
    onSplit(self) {
      return gsap.from(self.lines, { yPercent: 110, rotate: -2, transformOrigin: "100% 100%", duration: 1, stagger: 0.1, scrollTrigger: { trigger: ".join-title", start: "top 85%", once: true } });
    },
  });
  gsap.from(".form > .field, .btn-submit", { y: 26, autoAlpha: 0, duration: 0.8, stagger: 0.08, scrollTrigger: { trigger: ".form", start: "top 85%", once: true } });
}

/* ---------- Form ---------- */
const form = $<HTMLFormElement>(".form");
const err = $(".form-error");
const done = $(".form-done");
const submit = $<HTMLButtonElement>(".btn-submit");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = form.elements.namedItem("name") as HTMLInputElement;
  const phone = form.elements.namedItem("phone") as HTMLInputElement;
  $$(".field", form).forEach((f) => f.classList.remove("has-error"));
  let problemField: HTMLInputElement | null = null;
  if (!name.value.trim()) { problemField = name; err.textContent = "Add your business name so we know who you are."; }
  else if (phone.value.replace(/\D/g, "").length < 7) { problemField = phone; err.textContent = "Add a WhatsApp number we can message, including the country code."; }
  if (problemField) {
    const field = problemField.closest(".field")!;
    field.classList.add("has-error");
    if (!reduce) gsap.fromTo(field, { x: 0 }, { keyframes: { x: [0, -6, 6, -3, 3, 0] }, duration: 0.3, ease: "none" });
    problemField.focus();
    return;
  }
  err.textContent = "";
  submit.disabled = true;
  $(".btn-label", submit).textContent = "Sending…";
  // Frontend only: no data leaves the page.
  setTimeout(() => {
    gsap.to($$(".field, .btn-submit, .form-error", form), {
      autoAlpha: 0, y: -10, duration: 0.25, stagger: 0.04, ease: "power2.in",
      onComplete() {
        $$(".field, .btn-submit, .form-error", form).forEach((el) => (el.style.display = "none"));
        done.hidden = false;
        gsap.fromTo(done, { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.6 });
      },
    });
  }, 700);
});

/* ---------- Boot ---------- */
if (reduce) {
  showWholeChat();
  gsap.set(".intro-curtain", { display: "none" });
  gsap.set("[data-reveal]", { autoAlpha: 1 });
  steps.forEach((s, i) => ScrollTrigger.create({ trigger: s, start: "top 70%", end: "bottom 70%", onToggle: (self) => self.isActive && setStep(i) }));
} else {
  intro();
  // Scroll set-pieces are set up right after the hero starts, so the first paint stays light.
  const setUpScroll = () => {
    problem();
    goal();
    const mm = gsap.matchMedia();
    mm.add({ desktop: "(min-width: 800px)", mobile: "(max-width: 799px)" }, (ctx) => {
      const { desktop } = ctx.conditions as { desktop: boolean };
      how(desktop);
      approach(desktop);
      return () => setStep(0, true);
    });
    team();
    join();
    ScrollTrigger.refresh();
  };
  if ("requestIdleCallback" in window) requestIdleCallback(setUpScroll, { timeout: 500 });
  else setTimeout(setUpScroll, 150);
  // Safety net: nothing stays hidden if a trigger never fires.
  setTimeout(() => gsap.set(".hero-meta > *, .nav", { autoAlpha: 1 }), 4000);
}
