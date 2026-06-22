"use client";

import { useEffect, useRef, useState } from "react";
import type { VoteChoice } from "@/lib/types";
import { RegisterStep } from "./RegisterStep";
import { VoteStep } from "./VoteStep";
import { PhotoStep } from "./PhotoStep";
import { MessageStep } from "./MessageStep";
import { DoneStep } from "./DoneStep";

type Step = "register" | "vote" | "photo" | "message" | "done";

export function GuestFlow() {
  const [step, setStep] = useState<Step>("register");
  const [name, setName] = useState("");
  const [selectedVote, setSelectedVote] = useState<VoteChoice | null>(null);
  const [message, setMessage] = useState("");
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
      if (videoRef.current) videoRef.current.srcObject = stream;
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
    if (!v || !v.videoWidth) return;
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
  const goPhoto = () => {
    if (selectedVote) setStep("photo");
  };
  const goMessage = () => {
    if (selectedVote) setStep("message");
  };

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
    setPhoto(null);
    setCameraError(false);
  };

  return (
    <div className="min-h-screen flex justify-center px-4 py-10">
      <div className="w-full max-w-[420px] flex flex-col">
        {step === "register" && <RegisterStep name={name} onNameChange={setName} onContinue={goVote} />}
        {step === "vote" && (
          <VoteStep name={name} selectedVote={selectedVote} onSelect={setSelectedVote} onContinue={goPhoto} />
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
          />
        )}
        {step === "message" && (
          <MessageStep
            message={message}
            onMessageChange={setMessage}
            onSubmit={submitVote}
            onBack={() => setStep("vote")}
          />
        )}
        {step === "done" && selectedVote && (
          <DoneStep name={name.trim() || "Invitado"} vote={selectedVote} photo={photo} onVoteAgain={resetGuest} />
        )}
      </div>
    </div>
  );
}
