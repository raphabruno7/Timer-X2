"use client";

import { useState, useCallback } from "react";
import { MandalaReward } from "@/components/ui/MandalaReward";
import { AnimatePresence } from "framer-motion";

export function useReward() {
  const [showReward, setShowReward] = useState(false);

  const triggerReward = useCallback(() => {
    setShowReward(true);
  }, []);

  const handleComplete = useCallback(() => {
    setShowReward(false);
  }, []);

  const RewardComponent = () => (
    <AnimatePresence>
      {showReward && <MandalaReward onComplete={handleComplete} />}
    </AnimatePresence>
  );

  return {
    triggerReward,
    RewardComponent,
  };
}

