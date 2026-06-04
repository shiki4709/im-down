"use client";

import { useState, useCallback } from "react";
import { Companion } from "@/components/Companion";
import { CatCompanion } from "@/components/CatCompanion";
import { ShopView } from "@/components/ShopView";
import { OracleView } from "@/components/OracleView";
import { ShrineView } from "@/components/ShrineView";
import { TownMap } from "@/components/TownMap";

type Screen = "town" | "buddy" | "nori" | "shrine" | "fortune";

export default function Home() {
  const [screen, setScreen] = useState<Screen>("town");

  const handleEnterShop = useCallback(
    (shop: "buddy" | "nori" | "shrine" | "fortune") => {
      setScreen(shop);
    },
    []
  );

  if (screen === "buddy") {
    return (
      <ShopView
        apiEndpoint="/api/reframe"
        companion={(mood) => <Companion mood={mood} />}
        celebrateImage="/art/buddy-celebrate.png"
        idlePrompt="*nudges you gently*"
        inputPlaceholder="what's going on?"
        sendLabel="talk to buddy"
        loadingLabel="*tilts head...*"
        onBack={() => setScreen("town")}
      />
    );
  }

  if (screen === "nori") {
    return (
      <ShopView
        apiEndpoint="/api/nori"
        companion={(mood) => <CatCompanion mood={mood} />}
        celebrateImage="/art/nori-celebrate.png"
        idlePrompt="*looks up at you*"
        inputPlaceholder="who's bothering you?"
        sendLabel="talk to nori"
        loadingLabel="*slow blink...*"
        onBack={() => setScreen("town")}
      />
    );
  }

  if (screen === "shrine") {
    return <ShrineView onBack={() => setScreen("town")} />;
  }

  if (screen === "fortune") {
    return <OracleView onBack={() => setScreen("town")} />;
  }

  return <TownMap onEnterShop={handleEnterShop} />;
}
