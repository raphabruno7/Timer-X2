"use client";

interface MandalaRewardProps {
  visible: boolean;
}

export function MandalaReward({ visible }: MandalaRewardProps) {
  if (!visible) return null;

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 transition-opacity duration-[2000ms] ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="relative w-64 h-64">
        {/* Círculo central com gradiente verde→amarelo */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#2ECC71] to-[#FFD700] shadow-lg shadow-[#2ECC71]/50" />
        </div>

        {/* Container dos 6 círculos girando */}
        <div className="absolute inset-0 animate-spin" style={{ animationDuration: '8s' }}>
          {[...Array(6)].map((_, i) => {
            const angle = (i * 360) / 6;
            const x = 50 + Math.cos((angle * Math.PI) / 180) * 40;
            const y = 50 + Math.sin((angle * Math.PI) / 180) * 40;
            
            return (
              <div
                key={i}
                className="absolute w-8 h-8 rounded-full bg-[#2ECC71] opacity-70 shadow-md"
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                  transform: 'translate(-50%, -50%)',
                }}
              />
            );
          })}
        </div>

        {/* Texto central */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl mb-2">✨</div>
            <p className="text-xl font-bold text-white">Parabéns!</p>
          </div>
        </div>
      </div>
    </div>
  );
}

