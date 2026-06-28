import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Mic, MessageCircle, Infinity as InfinityIcon } from "lucide-react";
import houseImage from "@/assets/fairytale-house.jpg";
import logoAsset from "@/assets/echo-logo-white.png.asset.json";
import { OnboardingFlow } from "@/components/OnboardingFlow";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Echo — Memory, preserved." },
      {
        name: "description",
        content:
          "Echo preserves the voice, personality, and memories of those you love — a private, family-controlled living legacy.",
      },
      { property: "og:title", content: "Echo — Memory, preserved." },
      {
        property: "og:description",
        content:
          "Preserve the voice, presence, and stories of a loved one — or create your own living memory to pass down.",
      },
      { property: "og:image", content: houseImage },
    ],
  }),
  component: Index,
});

function useReveal() {
  const ref = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.classList.add("is-revealed");
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            (e.target as HTMLElement).classList.add("is-revealed");
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

function Reveal({
  as: As = "div",
  className = "",
  children,
}: {
  as?: any;
  className?: string;
  children: React.ReactNode;
}) {
  const ref = useReveal();
  return (
    <As ref={ref as any} className={`reveal ${className}`}>
      {children}
    </As>
  );
}

function Index() {
  const [onboardingOpen, setOnboardingOpen] = useState(false);
  return (
    <main className="relative w-full bg-[#1a0f24] text-[#f3e8d8]">
      <OnboardingFlow open={onboardingOpen} onClose={() => setOnboardingOpen(false)} />
      {/* ============ HERO ============ */}
      <section className="relative h-screen min-h-[640px] w-full overflow-hidden bg-[#1a0f24]">
        <div className="absolute inset-0 bg-gradient-to-b from-[#2a1640] via-[#1a0f24] to-[#0f0818]" />

        <div className="absolute inset-0 flex items-center justify-center">
          <img
            src={houseImage}
            alt="A luminous cross-section of a cozy cottage at twilight, with softly glowing rooms"
            width={1920}
            height={1088}
            className="ken-burns max-h-screen w-full object-contain md:absolute md:inset-0 md:h-full md:max-h-none md:w-full md:object-cover"
          />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_55%,_rgba(15,8,24,0.85)_100%)]" />
        </div>

        <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
          <img
            src={logoAsset.url}
            alt="Echo"
            width={1024}
            height={1024}
            className="w-24 h-auto drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)] sm:w-32 lg:w-36"
          />
          <h1 className="font-serif text-5xl italic tracking-tight text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)] sm:text-7xl lg:text-8xl">
            Welcome home
          </h1>
          <p className="mt-4 font-serif text-lg tracking-wide text-white/90 drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)] sm:text-xl lg:text-2xl">
            Where memories come to life
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a
              href="#story"
              className="inline-flex cursor-pointer items-center justify-center rounded-full border border-white/20 bg-white/10 px-8 py-3 font-serif text-sm tracking-widest text-white uppercase backdrop-blur-sm transition-all duration-300 hover:bg-white/20 hover:shadow-[0_0_20px_rgba(253,230,138,0.25)]"
            >
              Learn more
            </a>
            <button
              onClick={() => setOnboardingOpen(true)}
              className="inline-flex cursor-pointer items-center justify-center rounded-full border border-[#c9a96a]/40 bg-[#c9a96a]/15 px-8 py-3 font-serif text-sm tracking-widest text-[#fde68a] uppercase backdrop-blur-sm transition-all duration-300 hover:bg-[#c9a96a]/25 hover:shadow-[0_0_20px_rgba(253,230,138,0.3)]"
            >
              Get Started
            </button>
          </div>
        </div>

        <div className="pointer-events-none absolute inset-0 z-0">
          <span className="mote mote-1" />
          <span className="mote mote-2" />
          <span className="mote mote-3" />
          <span className="mote mote-4" />
          <span className="mote mote-5" />
          <span className="mote mote-6" />
        </div>
      </section>

      {/* ============ SECTION 1: PAST / PRESENT / FUTURE ============ */}
      <section id="story" className="relative px-6 py-28 sm:py-36">
        <div className="mx-auto max-w-6xl">
          <Reveal as="header" className="mx-auto max-w-3xl text-center">
            <h2 className="font-serif text-4xl italic leading-tight text-[#f3e8d8] sm:text-5xl lg:text-6xl">
              Bring your past, present, and future to life
            </h2>
            <p className="mt-6 font-sans text-base font-light leading-relaxed text-[#d4c3a8]/80 sm:text-lg">
              Some voices we never want to lose. Echo gives them a home.
            </p>
          </Reveal>

          <div className="mt-20 grid gap-14 sm:grid-cols-3 sm:gap-10">
            {[
              {
                icon: Mic,
                title: "Memory Profiles",
                body: "Upload voice recordings, letters, photographs, and stories. Echo learns the texture of a person — the way your mother paused before a joke, the words your father always reached for.",
              },
              {
                icon: MessageCircle,
                title: "Conversational Presence",
                body: "Family members can sit down and have a real conversation. Ask the questions you never got to ask. Hear the stories you've heard a thousand times — in her voice.",
              },
              {
                icon: InfinityIcon,
                title: "Living Legacy",
                body: "Create your own Echo now, while you're here. A gift for your children, and your children's children — your laugh, your beliefs, the way you tell a story.",
              },
            ].map(({ icon: Icon, title, body }, i) => (
              <Reveal
                key={title}
                className="flex flex-col items-start"
                {...({ style: { transitionDelay: `${i * 120}ms` } } as any)}
              >
                <div className="mb-7 flex h-12 w-12 items-center justify-center rounded-full border border-[#c9a96a]/40">
                  <Icon strokeWidth={1} className="h-6 w-6 text-[#e8c987]" />
                </div>
                <h3 className="font-serif text-2xl text-[#f3e8d8] sm:text-[1.6rem]">
                  {title}
                </h3>
                <p className="mt-4 font-sans text-[15px] font-light leading-[1.75] text-[#d4c3a8]/75">
                  {body}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto h-px w-32 bg-[#c9a96a]/30" />

      {/* ============ SECTION 2: HOW IT WORKS ============ */}
      <section className="relative px-6 py-28 sm:py-36">
        <div className="mx-auto max-w-3xl">
          <Reveal as="header" className="mb-20">
            <p className="font-sans text-xs uppercase tracking-[0.3em] text-[#c9a96a]">
              How it works
            </p>
            <h2 className="mt-4 font-serif text-4xl italic text-[#f3e8d8] sm:text-5xl">
              A quiet, careful process
            </h2>
          </Reveal>

          <ol className="relative space-y-16 border-l border-[#c9a96a]/40 pl-10 sm:pl-14">
            {[
              {
                t: "Gather",
                b: "Upload what you have. Voice memos. Home videos. Journals. Letters. Even just a few hours of conversation. There is no right amount — only what is yours.",
              },
              {
                t: "Shape",
                b: "Echo builds a profile — not a chatbot, but a presence. Every detail is reviewed and guided by you, until it feels like them.",
              },
              {
                t: "Connect",
                b: "Invite the people who loved them. Let your children ask questions. Let your grandchildren hear stories they never got to hear in person.",
              },
              {
                t: "Preserve",
                b: "Your Echo lives in your family's private space. Passed down through generations. Protected. Yours, always.",
              },
            ].map((s, i) => (
              <Reveal as="li" key={s.t} className="relative">
                <span className="absolute -left-[51px] flex h-6 w-6 items-center justify-center rounded-full border border-[#c9a96a]/60 bg-[#1a0f24] font-serif text-xs text-[#e8c987] sm:-left-[67px] sm:h-7 sm:w-7 sm:text-sm">
                  {i + 1}
                </span>
                <h3 className="font-serif text-2xl italic text-[#f3e8d8] sm:text-3xl">
                  {s.t}
                </h3>
                <p className="mt-3 font-sans text-[15px] font-light leading-[1.8] text-[#d4c3a8]/80">
                  {s.b}
                </p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* ============ SECTION 3: STORY / PULL QUOTE ============ */}
      <section className="relative overflow-hidden bg-[#2a1a2e] px-6 py-32 sm:py-44">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(232,201,135,0.08)_0%,_transparent_65%)]" />
        <Reveal className="relative mx-auto max-w-4xl text-center">
          <span className="font-serif text-6xl leading-none text-[#c9a96a]/50">
            “
          </span>
          <blockquote className="-mt-6 font-display text-3xl italic leading-[1.4] text-[#f5ead4] sm:text-4xl lg:text-5xl">
            I wanted my grandchildren to know who their grandfather really
            was — not just a name on a photo. Echo gave him back to us.
          </blockquote>
          <p className="mt-10 font-sans text-sm tracking-wide text-[#c9a96a]">
            — Margaret, who created an Echo of her husband, David
          </p>
        </Reveal>
      </section>

      {/* ============ SECTION 4: ETHICS ============ */}
      <section className="relative px-6 py-32 sm:py-44">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="font-sans text-xs uppercase tracking-[0.3em] text-[#c9a96a]">
            Our promise
          </p>
          <h2 className="mt-6 font-serif text-4xl italic text-[#f3e8d8] sm:text-5xl">
            Built with care. Held with care.
          </h2>
          <div className="mx-auto mt-10 h-px w-16 bg-[#c9a96a]/40" />
          <p className="mt-10 font-sans text-base font-light leading-[1.9] text-[#d4c3a8]/85 sm:text-lg">
            What Echo holds is sacred — a voice, a presence, the shape of
            someone loved. We honor that weight in every decision we make.
            Echoes are created with consent, controlled by your family, and
            kept entirely private. We will never make an Echo public. We
            will never sell or share what it contains. And at any moment, a
            family may ask for everything to be deleted — and it will be,
            completely.
          </p>
          <p className="mt-8 font-serif text-lg italic text-[#e8c987]/90">
            This is a promise, not a policy.
          </p>
        </Reveal>
      </section>

      {/* ============ FOOTER ============ */}
      <footer className="border-t border-[#c9a96a]/15 px-6 py-20">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-10 text-center">
          <div className="flex flex-col items-center gap-3">
            <svg
              width="56"
              height="20"
              viewBox="0 0 56 20"
              fill="none"
              aria-hidden="true"
              className="text-[#e8c987]"
            >
              <path
                d="M1 10 Q 7 10, 9 6 T 17 14 T 25 4 T 33 16 T 41 6 T 49 12 T 55 10"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinecap="round"
                fill="none"
              />
            </svg>
            <p className="font-serif text-lg italic text-[#f3e8d8]">
              Memory, preserved.
            </p>
          </div>

          <nav className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 font-sans text-sm font-light text-[#d4c3a8]/70">
            <a href="#" className="transition-colors hover:text-[#e8c987]">
              About
            </a>
            <span className="text-[#c9a96a]/30">·</span>
            <a href="#" className="transition-colors hover:text-[#e8c987]">
              Ethics
            </a>
            <span className="text-[#c9a96a]/30">·</span>
            <a href="#" className="transition-colors hover:text-[#e8c987]">
              Privacy
            </a>
            <span className="text-[#c9a96a]/30">·</span>
            <a href="#" className="transition-colors hover:text-[#e8c987]">
              Contact
            </a>
          </nav>

          <p className="max-w-xl font-sans text-xs font-light leading-relaxed text-[#d4c3a8]/55">
            Echo is a private, family-controlled platform. We will never
            sell, share, or commercialize your loved one's memory.
          </p>
        </div>
      </footer>

      <style>{`
        @keyframes drift-mote {
          0%, 100% { transform: translate(0, 0); opacity: 0.35; }
          50% { transform: translate(8px, -14px); opacity: 0.9; }
        }
        .mote {
          position: absolute;
          width: 4px; height: 4px;
          border-radius: 9999px;
          background: #fde68a;
          box-shadow: 0 0 12px 2px rgba(253, 230, 138, 0.7);
          animation: drift-mote 8s ease-in-out infinite;
        }
        .mote-1 { top: 22%; left: 18%; animation-delay: 0s; }
        .mote-2 { top: 38%; left: 72%; animation-delay: 1.4s; }
        .mote-3 { top: 60%; left: 32%; animation-delay: 2.8s; }
        .mote-4 { top: 74%; left: 84%; animation-delay: 4.2s; }
        .mote-5 { top: 48%; left: 50%; animation-delay: 5.6s; width: 3px; height: 3px; }
        .mote-6 { top: 30%; left: 40%; animation-delay: 3.5s; width: 5px; height: 5px; }

        @keyframes ken-burns {
          0%   { transform: scale(1) translate(0, 0); }
          100% { transform: scale(1.06) translate(-0.6%, -0.8%); }
        }
        .ken-burns { animation: ken-burns 32s ease-in-out infinite alternate; transform-origin: center; }

        .reveal { opacity: 0; transform: translateY(18px); transition: opacity 400ms ease-out, transform 400ms ease-out; }
        .reveal.is-revealed { opacity: 1; transform: translateY(0); }

        html { scroll-behavior: smooth; }

        @media (prefers-reduced-motion: reduce) {
          .ken-burns, .mote { animation: none !important; }
          .reveal { opacity: 1 !important; transform: none !important; transition: none !important; }
          html { scroll-behavior: auto; }
        }
      `}</style>
    </main>
  );
}
