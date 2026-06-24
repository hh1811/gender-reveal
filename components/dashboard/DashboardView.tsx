"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Vote, VoteChoice, VotesPayload } from "@/lib/types";
import { useLiveVotes } from "@/lib/useLiveVotes";
import { useCountUp } from "@/lib/useCountUp";
import { useRevealPhase } from "@/lib/useRevealPhase";
import { relativeTimeSeconds } from "@/lib/voteDisplay";
import { Orb } from "@/components/shared/Orb";
import { Halo } from "@/components/shared/Halo";
import { Avatar } from "@/components/shared/Avatar";
import { Sparkles } from "@/components/reveal/Sparkles";
import { RevealScreen } from "@/components/reveal/RevealScreen";
import { SocialCarousel } from "@/components/dashboard/SocialCarousel";
import { AmbientParticles } from "@/components/dashboard/AmbientParticles";
import { BABY_LABEL, COUNTDOWN_TARGET_ISO, EVENT_DATE_LABEL } from "@/lib/eventConfig";
import { topNameSuggestions } from "@/lib/nameSuggestions";

const REVEAL_PREP_MS = 5 * 60 * 1000;
const VOTE_LABEL: Record<VoteChoice, string> = { nino: "Niño", nina: "Niña" };
const TEAM_LABEL: Record<VoteChoice, string> = { nino: "TEAM NIÑO", nina: "TEAM NIÑA" };

function displayParentNames(raw: string) {
  return raw.replace(/\s+y\s+/i, " & ").toUpperCase();
}

type Leader = "nino" | "nina" | "tie";

function leaderOf(ninoCount: number, ninaCount: number): Leader {
  if (ninoCount === ninaCount) return "tie";
  return ninoCount > ninaCount ? "nino" : "nina";
}

export function DashboardView({ initial }: { initial: VotesPayload }) {
  const { votes, settings } = useLiveVotes(initial);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  const {
    ninoCount,
    ninaCount,
    total,
    ninoPct,
    ninaPct,
    ninoRecent,
    ninaRecent,
    recentVoters,
    messages,
    topNino,
    topNina,
  } = useMemo(() => {
    const ninoCount = votes.filter((v) => v.vote === "nino").length;
    const ninaCount = votes.filter((v) => v.vote === "nina").length;
    const total = votes.length;
    const ninoPct = total ? Math.round((ninoCount / total) * 100) : 50;
    const ninaPct = total ? 100 - ninoPct : 50;
    const ninoRecent = votes.filter((v) => v.vote === "nino").slice(-5).reverse();
    const ninaRecent = votes.filter((v) => v.vote === "nina").slice(-5).reverse();
    const recentVoters = votes.slice(-4).reverse();
    const messages = votes
      .filter((v) => v.message)
      .slice(-16)
      .reverse();
    const topNino = topNameSuggestions(votes, "nino");
    const topNina = topNameSuggestions(votes, "nina");
    return {
      ninoCount,
      ninaCount,
      total,
      ninoPct,
      ninaPct,
      ninoRecent,
      ninaRecent,
      recentVoters,
      messages,
      topNino,
      topNina,
    };
  }, [votes]);

  const leader = leaderOf(ninoCount, ninaCount);
  const prevLeader = useRef<Leader>(leader);
  const prevCounts = useRef({ nino: ninoCount, nina: ninaCount });
  const [leaderBanner, setLeaderBanner] = useState<{ team: VoteChoice; type: "lead" | "tie" } | null>(null);
  useEffect(() => {
    const prevL = prevLeader.current;
    const prevC = prevCounts.current;
    prevLeader.current = leader;
    prevCounts.current = { nino: ninoCount, nina: ninaCount };
    if (leader === prevL) return;
    if (leader === "tie") {
      const tyingTeam: VoteChoice = ninoCount > prevC.nino ? "nino" : "nina";
      setLeaderBanner({ team: tyingTeam, type: "tie" });
    } else {
      setLeaderBanner({ team: leader, type: "lead" });
    }
    const id = setTimeout(() => setLeaderBanner(null), 3000);
    return () => clearTimeout(id);
  }, [leader, ninoCount, ninaCount]);

  const prevTotal = useRef(total);
  const [showMilestone, setShowMilestone] = useState(false);
  const [milestoneKey, setMilestoneKey] = useState(0);
  useEffect(() => {
    const prev = prevTotal.current;
    prevTotal.current = total;
    if (Math.floor(total / 10) === Math.floor(prev / 10)) return;
    setShowMilestone(true);
    setMilestoneKey((k) => k + 1);
    const id = setTimeout(() => setShowMilestone(false), 1500);
    return () => clearTimeout(id);
  }, [total]);

  const [revealPrepFrac, setRevealPrepFrac] = useState(0);
  useEffect(() => {
    function check() {
      const remaining = new Date(COUNTDOWN_TARGET_ISO).getTime() - Date.now();
      setRevealPrepFrac(remaining > 0 && remaining <= REVEAL_PREP_MS ? 1 - remaining / REVEAL_PREP_MS : 0);
    }
    check();
    const id = setInterval(check, 5000);
    return () => clearInterval(id);
  }, []);
  const revealPrep = revealPrepFrac > 0;

  const stateBanner = settings.reveal !== "none" ? null : revealPrep ? "La revelación está cerca." : null;

  const prevTotalForOrb = useRef(total);
  const [orbPulse, setOrbPulse] = useState(false);
  const [orbPulseKey, setOrbPulseKey] = useState(0);
  useEffect(() => {
    const prev = prevTotalForOrb.current;
    prevTotalForOrb.current = total;
    if (total <= prev) return;
    setOrbPulse(true);
    setOrbPulseKey((k) => k + 1);
    const id = setTimeout(() => setOrbPulse(false), 400);
    return () => clearTimeout(id);
  }, [total]);
  const orbGlow = orbPulse ? 1.9 : 1.35 + revealPrepFrac * 0.85;

  const [, setClockTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setClockTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, []);
  const lastVote = recentVoters[0] || null;

  const displayTotal = useCountUp(total, 300);

  const [tick, setTick] = useState(0);
  useEffect(() => {
    if (messages.length === 0) return;
    const id = setInterval(() => setTick((t) => t + 1), 5000);
    return () => clearInterval(id);
  }, [messages.length]);

  const pageSize = 2;
  const pageCount = Math.max(1, Math.ceil(messages.length / pageSize));
  const cyclePos = tick % 3;
  const showFeatured = messages.length > 0 && cyclePos === 2;
  const currentPage = (Math.floor(tick / 3) * 2 + cyclePos) % pageCount;
  const pageMessages = showFeatured ? [] : messages.slice(currentPage * pageSize, currentPage * pageSize + pageSize);
  const featured = showFeatured ? messages[Math.floor(tick / 3) % messages.length] : null;

  const revealPhase = useRevealPhase(settings.reveal);
  if (settings.reveal !== "none") {
    return <RevealScreen reveal={settings.reveal} phase={revealPhase} votes={votes} showFooter={false} />;
  }

  return (
    <div
      className="relative h-screen w-screen overflow-hidden flex flex-col"
      style={{
        background:
          "radial-gradient(circle at 8% -10%, rgba(142,205,247,.3), transparent 46%), radial-gradient(circle at 94% -8%, rgba(247,168,200,.28), transparent 48%), #faf6f0",
        padding: "clamp(18px,2.2vw,38px)",
      }}
    >
      <header className="grid grid-cols-3 items-start">
        <div className="font-extrabold tracking-[3px] text-[#6A4FC9] text-left" style={{ fontSize: "clamp(14px,1.6vw,22px)" }}>
          {displayParentNames(settings.parentNames)}
        </div>
        <div className="flex flex-col items-center">
          <div className="font-extrabold tracking-[4px] text-[#B9A7F7]" style={{ fontSize: "clamp(13px,1.4vw,20px)" }}>
            {BABY_LABEL}
          </div>
          <div className="font-extrabold tracking-[2px] text-[#a99fb6] mt-1" style={{ fontSize: "clamp(11px,1.1vw,15px)" }}>
            {EVENT_DATE_LABEL}
          </div>
        </div>
        <div className="text-right">
          <div className="inline-flex items-center gap-2 font-extrabold text-[#B14B7E]" style={{ fontSize: "clamp(11px,1.1vw,15px)" }}>
            <span className="w-[8px] h-[8px] rounded-full bg-[#F7A8C8] animate-gr-pulse" />
            EN VIVO
          </div>
          <div className="font-serif font-bold text-[#3a3349]" style={{ fontSize: "clamp(54px,8.1vw,103px)", lineHeight: 1 }}>
            {displayTotal}
          </div>
          <div className="font-extrabold tracking-[2px] text-[#a99fb6]" style={{ fontSize: "clamp(10px,1vw,14px)" }}>
            PARTICIPANTES
          </div>
          {lastVote && (
            <div className="mt-2">
              <div className="font-extrabold text-[#a99fb6]" style={{ fontSize: "clamp(9px,.9vw,12px)" }}>
                Último voto: <span className="text-[#3a3349]">{lastVote.name}</span> → {TEAM_LABEL[lastVote.vote]}
              </div>
              <div className="font-bold text-[#c4bcd0]" style={{ fontSize: "clamp(8px,.85vw,11px)" }}>
                {relativeTimeSeconds(lastVote.createdAt)}
              </div>
            </div>
          )}
        </div>
      </header>

      {stateBanner && (
        <div className="flex justify-center" style={{ marginTop: "clamp(6px,.8vh,12px)" }}>
          <div
            className="font-bold text-[#6A4FC9] bg-white rounded-full px-5 py-1.5"
            style={{ fontSize: "clamp(13px,1.4vw,18px)", boxShadow: "0 8px 20px -16px rgba(106,79,201,.5)" }}
          >
            {stateBanner}
          </div>
        </div>
      )}

      <div className="relative flex-1 min-h-0 flex items-center justify-center" style={{ margin: "clamp(8px,1.2vw,16px) 0" }}>
        {leaderBanner && (
          <div className="absolute inset-x-0 top-0 flex flex-col items-center animate-gr-slide-down" style={{ zIndex: 6 }}>
            <div
              className="font-extrabold tracking-[2px] text-white rounded-full px-6 py-2 whitespace-nowrap"
              style={{
                fontSize: "clamp(16px,1.6vw,22px)",
                background:
                  leaderBanner.type === "tie"
                    ? "linear-gradient(135deg,#b9a7f7,#6A4FC9)"
                    : leaderBanner.team === "nino"
                      ? "linear-gradient(135deg,#5fb6ee,#2C6E8F)"
                      : "linear-gradient(135deg,#ef84b1,#B14B7E)",
                boxShadow:
                  leaderBanner.type === "tie"
                    ? "0 14px 30px -10px rgba(0,0,0,.35), 0 0 34px 8px rgba(185,167,247,.55)"
                    : leaderBanner.team === "nino"
                      ? "0 14px 30px -10px rgba(0,0,0,.35), 0 0 34px 8px rgba(142,205,247,.55)"
                      : "0 14px 30px -10px rgba(0,0,0,.35), 0 0 34px 8px rgba(247,168,200,.55)",
              }}
            >
              {leaderBanner.type === "tie" ? "¡EMPATE!" : `${TEAM_LABEL[leaderBanner.team]} TOMA LA DELANTERA`}
            </div>
            {leaderBanner.type === "tie" && (
              <div
                className="font-bold text-[#6A4FC9] bg-white rounded-full px-4 py-1 mt-2"
                style={{ fontSize: "clamp(13px,1.2vw,16px)", boxShadow: "0 8px 20px -16px rgba(106,79,201,.5)" }}
              >
                La votación está empatada.
              </div>
            )}
          </div>
        )}

        {showMilestone && (
          <div className="absolute inset-0" style={{ zIndex: 4 }}>
            <Sparkles key={milestoneKey} seed={`milestone-${milestoneKey}`} />
          </div>
        )}

        <div className="flex items-center justify-center w-full" style={{ gap: "clamp(20px,4vw,72px)" }}>
          <TeamSide team="nino" count={ninoCount} recent={ninoRecent} align="right" color="#2C6E8F" />

          <div className="flex flex-col items-center" style={{ zIndex: 3 }}>
            <div className="relative animate-gr-orb-float-soft">
              <Halo size={420} gradient="radial-gradient(circle, rgba(180,160,235,.22) 0%, rgba(195,175,245,.1) 45%, transparent 72%)" />
              <Halo size={300} gradient="radial-gradient(circle, rgba(180,160,235,.45) 0%, rgba(195,175,245,.2) 45%, transparent 72%)" />
              {!revealPrep && <AmbientParticles count={10} />}
              <div key={orbPulseKey} className={`relative ${orbPulse ? "animate-gr-orb-pulse" : "animate-gr-orb-breathe"}`}>
                <Orb
                  variant="main"
                  size={180}
                  glow={orbGlow}
                  className="relative"
                  style={{ width: "clamp(90px,11vw,180px)", height: "clamp(90px,11vw,180px)" }}
                />
              </div>
            </div>
            <div className="font-serif font-bold text-[#6A4FC9] mt-2 relative" style={{ fontSize: "clamp(15px,1.6vw,22px)" }}>
              VS
            </div>
          </div>

          <TeamSide team="nina" count={ninaCount} recent={ninaRecent} align="left" color="#B14B7E" />
        </div>
      </div>

      <div className="relative" style={{ marginTop: "clamp(34px,4.6vh,54px)" }}>
        <div
          className="relative flex-1 rounded-full overflow-hidden flex bg-white"
          style={{
            height: "clamp(18px,2.2vw,24px)",
            boxShadow: "0 0 22px 5px rgba(106,79,201,.14), inset 0 1px 3px rgba(0,0,0,.05)",
          }}
        >
          <div
            className="h-full"
            style={{
              width: `${ninoPct}%`,
              background: "linear-gradient(90deg,#8ECDF7,#5fb6ee)",
              transition: "width .5s cubic-bezier(.4,0,.2,1)",
            }}
          />
          <div
            className="h-full"
            style={{
              width: `${ninaPct}%`,
              background: "linear-gradient(90deg,#ef84b1,#F7A8C8)",
              transition: "width .5s cubic-bezier(.4,0,.2,1)",
            }}
          />
        </div>
        <div
          key={`nino-${ninoPct}`}
          className="absolute font-extrabold text-[#2C6E8F] animate-gr-pop"
          style={{
            left: `calc(${ninoPct / 2}% - 20px)`,
            top: "clamp(-22px,-2.4vh,-18px)",
            transition: "left .5s cubic-bezier(.4,0,.2,1)",
            fontSize: "clamp(13px,1.4vw,18px)",
          }}
        >
          {ninoPct}%
        </div>
        <div
          key={`nina-${ninaPct}`}
          className="absolute font-extrabold text-[#B14B7E] animate-gr-pop"
          style={{
            right: `calc(${ninaPct / 2}% - 20px)`,
            top: "clamp(-22px,-2.4vh,-18px)",
            transition: "right .5s cubic-bezier(.4,0,.2,1)",
            fontSize: "clamp(13px,1.4vw,18px)",
          }}
        >
          {ninaPct}%
        </div>
      </div>

      <div
        className="flex overflow-hidden"
        style={{
          gap: "clamp(14px,1.6vw,26px)",
          marginTop: "clamp(14px,1.8vw,26px)",
          height: "clamp(180px,22vh,220px)",
          opacity: revealPrep ? 0.45 : 1,
          transition: "opacity 1.5s ease",
        }}
      >
        <div className="flex-1 min-w-0 flex flex-col">
          <div className="font-extrabold tracking-[2px] text-[#a99fb6] mb-2" style={{ fontSize: "clamp(10px,1vw,14px)" }}>
            ÚLTIMOS EN UNIRSE
          </div>
          <div className="flex flex-col gap-2 overflow-hidden">
            {recentVoters.map((v) => (
              <div
                key={v.id}
                className="bg-white rounded-2xl px-4 py-2 flex items-center gap-3 animate-gr-rise"
                style={{ boxShadow: "0 8px 20px -16px rgba(106,79,201,.5)", animationDuration: "300ms" }}
              >
                <Avatar name={v.name} vote={v.vote} photoUrl={v.photoUrl} size={26} />
                <span className="font-bold text-[#3a3349]" style={{ fontSize: "clamp(20px,1.4vw,22px)" }}>
                  {v.name} votó {VOTE_LABEL[v.vote]}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex-1 min-w-0 flex flex-col relative">
          <div className="font-extrabold tracking-[2px] text-[#a99fb6] mb-2" style={{ fontSize: "clamp(10px,1vw,14px)" }}>
            {showFeatured ? "MENSAJE DESTACADO" : "MENSAJES PARA LOS PAPÁS"}
          </div>
          {showFeatured && featured ? (
            <div
              key={featured.id}
              className="rounded-2xl px-5 py-4 flex-1 flex items-center gap-4 animate-gr-rise"
              style={{
                background: "linear-gradient(135deg,#f3eaff,#ffeaf3)",
                boxShadow: "0 8px 24px -14px rgba(106,79,201,.55)",
              }}
            >
              <Avatar name={featured.name} vote={featured.vote} photoUrl={featured.photoUrl} size={64} glow />
              <div className="min-w-0">
                <div className="font-serif font-bold text-[#3a3349]" style={{ fontSize: "clamp(20px,1.9vw,26px)" }}>
                  &ldquo;{featured.message}&rdquo;
                </div>
                <div className="font-extrabold mt-2" style={{ fontSize: "clamp(11px,1.1vw,15px)" }}>
                  <span className="text-[#a99fb6]">— {featured.name}</span>{" "}
                  <span style={{ color: featured.vote === "nino" ? "#2C6E8F" : "#B14B7E" }}>{TEAM_LABEL[featured.vote]}</span>
                </div>
              </div>
            </div>
          ) : pageMessages.length ? (
            <div className="flex-1 grid grid-cols-1 gap-2 overflow-hidden" key={currentPage}>
              {pageMessages.map((m) => (
                <div
                  key={m.id}
                  className="bg-white rounded-2xl px-5 py-3 flex items-center gap-3 animate-gr-rise"
                  style={{ boxShadow: "0 8px 20px -16px rgba(106,79,201,.5)" }}
                >
                  <Avatar name={m.name} vote={m.vote} photoUrl={m.photoUrl} size={34} />
                  <div className="min-w-0">
                    <div className="font-serif font-bold text-[#3a3349]" style={{ fontSize: "clamp(20px,1.5vw,22px)" }}>
                      &ldquo;{m.message}&rdquo;
                    </div>
                    <div className="font-extrabold text-[#a99fb6] mt-1" style={{ fontSize: "clamp(10px,1vw,13px)" }}>
                      — {m.name}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div
              className="flex-1 flex items-center justify-center text-[#c4bcd0] font-bold"
              style={{ fontSize: "clamp(12px,1.2vw,16px)" }}
            >
              Aún no hay mensajes
            </div>
          )}
        </div>
      </div>

      {(topNino.length > 0 || topNina.length > 0) && (
        <div
          className="flex justify-center"
          style={{ gap: "clamp(20px,3vw,48px)", marginTop: "clamp(10px,1.4vw,18px)", opacity: revealPrep ? 0.45 : 1, transition: "opacity 1.5s ease" }}
        >
          <NameSuggestions label="NOMBRES SUGERIDOS · NIÑO" color="#2C6E8F" items={topNino} />
          <NameSuggestions label="NOMBRES SUGERIDOS · NIÑA" color="#B14B7E" items={topNina} />
        </div>
      )}

      <div style={{ marginTop: "clamp(12px,1.6vw,22px)", opacity: revealPrep ? 0.45 : 1, transition: "opacity 1.5s ease" }}>
        <SocialCarousel votes={votes} />
      </div>

      {siteUrl && (
        <div
          className="absolute flex items-center gap-2 bg-white rounded-2xl px-3 py-2"
          style={{ right: "clamp(16px,2vw,32px)", bottom: "clamp(16px,2vw,32px)", boxShadow: "0 10px 30px -16px rgba(106,79,201,.5)" }}
        >
          <img
            src={`https://api.qrserver.com/v1/create-qr-code/?size=96x96&data=${encodeURIComponent(siteUrl)}`}
            alt="Código QR para participar"
            width={64}
            height={64}
            className="rounded-lg"
          />
          <span className="font-extrabold tracking-[1px] text-[#a99fb6]" style={{ fontSize: "clamp(11px,1.1vw,14px)", maxWidth: 90 }}>
            Escanea y participa
          </span>
        </div>
      )}
    </div>
  );
}

function NameSuggestions({
  label,
  color,
  items,
}: {
  label: string;
  color: string;
  items: { name: string; count: number }[];
}) {
  if (items.length === 0) return null;
  return (
    <div className="bg-white rounded-2xl px-5 py-3" style={{ boxShadow: "0 8px 20px -16px rgba(106,79,201,.5)" }}>
      <div className="font-extrabold tracking-[1.5px]" style={{ color, opacity: 0.7, fontSize: "clamp(9px,.9vw,11px)" }}>
        {label}
      </div>
      <div className="flex items-center gap-3 mt-1">
        {items.map((it) => (
          <div key={it.name} className="flex items-baseline gap-1">
            <span className="font-serif font-bold text-[#3a3349]" style={{ fontSize: "clamp(14px,1.5vw,19px)" }}>
              {it.name}
            </span>
            <span className="font-bold" style={{ color, opacity: 0.6, fontSize: "clamp(10px,1vw,13px)" }}>
              ×{it.count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function TeamSide({
  team,
  count,
  recent,
  align,
  color,
}: {
  team: VoteChoice;
  count: number;
  recent: Vote[];
  align: "left" | "right";
  color: string;
}) {
  const isLeft = align === "left";
  const visibleRecent = recent.slice(0, 4);
  return (
    <div className={`flex flex-col ${isLeft ? "items-start" : "items-end"}`} style={{ zIndex: 2 }}>
      <div className="font-black tracking-[2px]" style={{ color, fontSize: "clamp(12px,1.3vw,18px)" }}>
        {TEAM_LABEL[team]}
      </div>
      <div className="font-serif font-bold" style={{ color, fontSize: "clamp(120px,15vw,180px)", lineHeight: 0.9 }}>
        {count}
      </div>
      {visibleRecent.length > 0 && (
        <div className="mt-3">
          <div className="font-extrabold tracking-[1px]" style={{ color, opacity: 0.65, fontSize: "clamp(9px,.9vw,11px)" }}>
            Participantes recientes
          </div>
          <div className={`flex mt-1 ${isLeft ? "flex-row" : "flex-row-reverse"}`} style={{ gap: 10 }}>
            {visibleRecent.map((v, i) => (
              <div
                key={v.id}
                className="flex flex-col items-center animate-gr-fade-in"
                style={{ gap: 3, animationDelay: `${i * 0.12}s` }}
              >
                <Avatar name={v.name} vote={v.vote} photoUrl={v.photoUrl} size={30} />
                <div
                  className="font-bold truncate"
                  style={{ color, opacity: 0.75, fontSize: "clamp(8px,.85vw,10px)", maxWidth: 56 }}
                >
                  {v.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
