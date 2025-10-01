"use client";

import { useState, useCallback } from "react";
import { MandalaReward } from "@/components/ui/MandalaReward";
import { AnimatePresence } from "framer-motion";

interface RewardOptions {
  intensity?: 'low' | 'high';
  colors?: string[];
}

export function useReward() {
  const [showReward, setShowReward] = useState(false);
  const [rewardOptions, setRewardOptions] = useState<RewardOptions>({});

  const triggerReward = useCallback((options: RewardOptions = {}) => {
    setRewardOptions(options);
    setShowReward(true);
  }, []);

  const handleComplete = useCallback(() => {
    setShowReward(false);
  }, []);

  const RewardComponent = () => (
    <AnimatePresence>
      {showReward && (
        <MandalaReward 
          onComplete={handleComplete}
          intensity={rewardOptions.intensity}
          colors={rewardOptions.colors}
        />
      )}
    </AnimatePresence>
  );

  return {
    triggerReward,
    RewardComponent,
  };
}

