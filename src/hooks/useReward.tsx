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

  const RewardComponent = () => {
    // Converter intensidade de string para number
    const intensityValue = rewardOptions.intensity === 'high' ? 1.5 
      : rewardOptions.intensity === 'low' ? 0.7 
      : undefined;

    return (
      <AnimatePresence>
        {showReward && (
          <MandalaReward 
            visible={showReward}
            intensity={intensityValue}
          />
        )}
      </AnimatePresence>
    );
  };

  return {
    triggerReward,
    RewardComponent,
    isRewardActive: showReward,
  };
}

