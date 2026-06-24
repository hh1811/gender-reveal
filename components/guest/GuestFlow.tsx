"use client";

import { useEffect, useRef, useState } from "react";
import type { VoteChoice, VotesPayload } from "@/lib/types";
import { RegisterStep } from "./RegisterStep";
import { VoteStep } from "./VoteStep";
import { NamesStep } from "./NamesStep";
import { PhotoStep } from "./PhotoStep";
import { MessageStep } from "./MessageStep";
import { DoneStep } from "./DoneStep";

type Step = "register" | "vote" | "names" | "photo" | "message" | "done";

export function GuestFlow({}: { initialVotes: VotesPayload }) {
  const [step, setStep] = useState<Step>("register");
  const [name, setName] = useState("");
  const [selectedVote, setSelectedVote] = useState<VoteChoice | null>(null);
  const [message, setMessage] = useState("");
  const [nameNino, setNameNino] = useState("");
  const [nameNina, setNameNina] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  };

  const startCamera = async () => {
    setCameraError(false);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" }, audio: false });
      streamRef.current = stream;
      const v = videoRef.current;
      if (v) {
        v.srcObject = stream;
        try {
          await v.play();
        } catch {
          // autoplay can be rejected without a user gesture; the visible
          // "Tomar foto" button click that follows counts as one and lets
          // the browser retry playback, so don't surface this as an error.
        }
      }
    } catch {
      setCameraError(true);
    }
  };

  useEffect(() => {
    if (step === "photo" && !photo) {
      startCamera();
      return () => stopCamera();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  const capturePhoto = () => {
    const v = videoRef.current;
    if (!v) return;
    if (!v.videoWidth) {
      v.play().catch(() => {});
      return;
    }
    const size = Math.min(v.videoWidth, v.videoHeight);
    const c = document.createElement("canvas");
    c.width = c.height = 320;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    ctx.translate(320, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(v, (v.videoWidth - size) / 2, (v.videoHeight - size) / 2, size, size, 0, 0, 320, 320);
    const data = c.toDataURL("image/jpeg", 0.82);
    stopCamera();
    setPhoto(data);
  };

  const retakePhoto = () => {
    setPhoto(null);
    startCamera();
  };

  const onFile = (file: File) => {
    const r = new FileReader();
    r.onload = () => {
      setPhoto(r.result as string);
      setCameraError(false);
    };
    r.readAsDataURL(file);
  };

  const goVote = () => {
    if (name.trim()) setStep("vote");
  };
  const goNames = () => {
    if (selectedVote) setStep("names");
  };
  const goPhoto = () => {
    if (selectedVote) setStep("photo");
  };
  const goMessage = () => {
    if (selectedVote) setStep("message");
  };

  const backToRegister = () => setStep("register");
  const backToVote = () => setStep("vote");
  const backToNames = () => setStep("names");
  const backToPhoto = () => setStep("photo");

  const submitVote = async () => {
    if (!selectedVote || submitting) return;
    setSubmitting(true);
    try {
      await fetch("/api/votes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim() || "Invitado",
          vote: selectedVote,
          message: message.trim(),
          nameNino: nameNino.trim(),
          nameNina: nameNina.trim(),
          photo,
        }),
      });
      setStep("done");
    } finally {
      setSubmitting(false);
    }
  };

  const resetGuest = () => {
    stopCamera();
    setStep("register");
    setName("");
    setSelectedVote(null);
    setMessage("");
    setNameNino("");
    setNameNina("");
    setPhoto(null);
    setCameraError(false);
  };

  return (
    <div className="min-h-screen flex justify-center px-4 py-10">
      <div className="w-full max-w-[420px] flex flex-col">
        {step === "register" && <RegisterStep name={name} onNameChange={setName} onContinue={goVote} />}
        {step === "vote" && (
          <VoteStep
            selectedVote={selectedVote}
            onSelect={setSelectedVote}
            onContinue={goNames}
            onBack={backToRegister}
          />
        )}
        {step === "names" && (
          <NamesStep
            nameNino={nameNino}
            nameNina={nameNina}
            onNameNinoChange={setNameNino}
            onNameNinaChange={setNameNina}
            onContinue={goPhoto}
            onBack={backToVote}
          />
        )}
        {step === "photo" && (
          <PhotoStep
            photo={photo}
            cameraError={cameraError}
            videoRef={videoRef}
            onCapture={capturePhoto}
            onRetake={retakePhoto}
            onFile={onFile}
            onUsePhoto={goMessage}
            onSkip={goMessage}
            onBack={backToNames}
          />
        )}
        {step === "message" && (
          <MessageStep
            message={message}
            onMessageChange={setMessage}
            onSubmit={submitVote}
            onBack={backToPhoto}
          />
        )}
        {step === "done" && selectedVote && (
          <DoneStep vote={selectedVote} photo={photo} onVoteAgain={resetGuest} />
        )}
      </div>
    </div>
  );
}
