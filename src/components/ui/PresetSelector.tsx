"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { useTimerStore } from "@/store/useTimerStore";
import { ChevronDown, Plus, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

type Categoria = "breathwork" | "foco" | "criatividade" | "neural" | "sound" | "binaural";

const categoriaConfig: Record<Categoria, { icon: string; color: string; label: string }> = {
  breathwork: { icon: "🌬️", color: "#00C2FF", label: "Breathwork" },
  foco: { icon: "💡", color: "#FFD700", label: "Foco" },
  criatividade: { icon: "🎨", color: "#9B59B6", label: "Criatividade" },
  neural: { icon: "⚡", color: "#2ECC71", label: "Neural" },
  sound: { icon: "🔔", color: "#FF6B6B", label: "Sound Healing" },
  binaural: { icon: "🎧", color: "#00D4FF", label: "Binaural" },
};

export function PresetSelector() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [newPresetName, setNewPresetName] = useState("");
  const [newPresetMinutes, setNewPresetMinutes] = useState("25");
  const [newPresetCategory, setNewPresetCategory] = useState<Categoria>("foco");

  const { presetName, setMinutes, setPreset } = useTimerStore();
  const presets = useQuery(api.presets.listar);
  const topPresets = useQuery(api.presets.topUsados);
  const createQuick = useMutation(api.presets.createQuick);
  const registrarUsoPreset = useMutation(api.presets.use);

  const filteredPresets = presets?.filter((preset) =>
    preset.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const presetsByCategory = filteredPresets?.reduce((acc, preset) => {
    const cat = preset.categoria || "foco";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(preset);
    return acc;
  }, {} as Record<string, typeof filteredPresets>);

  const handleSelectPreset = async (presetId: Id<"presets">, nome: string, minutos: number) => {
    setMinutes(minutos);
    setPreset(nome, presetId);
    setDropdownOpen(false);
    
    // Registrar uso
    try {
      await registrarUsoPreset({ id: presetId });
    } catch (error) {
      console.error("Erro ao registrar uso:", error);
    }
  };

  const handleCreatePreset = async () => {
    const minutes = parseInt(newPresetMinutes);
    if (!newPresetName || !minutes || minutes < 1 || minutes > 180) {
      toast.error("Nome e minutos (1-180) são obrigatórios");
      return;
    }

    try {
      await createQuick({
        name: newPresetName,
        minutes,
        category: newPresetCategory,
      });
      
      toast.success(`Preset "${newPresetName}" criado!`);
      setDialogOpen(false);
      setNewPresetName("");
      setNewPresetMinutes("25");
      setNewPresetCategory("foco");
    } catch (error) {
      console.error("Erro ao criar preset:", error);
      toast.error("Erro ao criar preset");
    }
  };

  return (
    <>
      <div className="flex items-center gap-2 justify-center">
        {/* Chip de Preset */}
        <motion.button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="rounded-full bg-emerald-950/60 text-emerald-300 px-4 py-2 text-sm flex items-center gap-2 hover:bg-emerald-900/60 transition-colors border border-emerald-500/20"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          aria-label="Selecionar preset"
        >
          <span className="font-light tracking-wide">Preset: {presetName}</span>
          <ChevronDown className="w-4 h-4" />
        </motion.button>

        {/* Botão Adicionar */}
        <motion.button
          onClick={() => setDialogOpen(true)}
          className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-full w-8 h-8 flex items-center justify-center transition-colors shadow-[0_0_10px_rgba(46,204,113,0.4)]"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Criar novo preset"
        >
          <Plus className="w-4 h-4" />
        </motion.button>
      </div>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {dropdownOpen && (
          <>
            {/* Overlay */}
            <motion.div
              className="fixed inset-0 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDropdownOpen(false)}
            />

            {/* Dropdown Content */}
            <motion.div
              className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-96 max-w-[90vw] bg-[#1A1A1A] border-2 border-emerald-700/30 rounded-2xl shadow-2xl z-50 max-h-[70vh] overflow-hidden"
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              {/* Search */}
              <div className="p-4 border-b border-emerald-700/20">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400/50" />
                  <Input
                    placeholder="Buscar presets..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-emerald-900/20 border-emerald-700/30 text-[#F9F9F9] placeholder:text-[#F9F9F9]/40 focus:ring-emerald-500/50"
                    autoFocus
                  />
                </div>
              </div>

              {/* Presets List */}
              <div className="overflow-y-auto max-h-[55vh] p-2">
                {/* Top 3 Usados */}
                {topPresets && topPresets.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs text-emerald-400/70 px-3 py-2 font-light tracking-wide">
                      Recentes
                    </p>
                    <div className="space-y-1">
                      {topPresets.map((preset, index) => (
                        <motion.button
                          key={preset._id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 10 }}
                          transition={{ 
                            delay: index * 0.04,
                            duration: 0.25,
                            ease: "easeOut"
                          }}
                          whileHover={{ 
                            scale: 1.02, 
                            x: 4,
                            transition: { duration: 0.15 }
                          }}
                          onClick={() => handleSelectPreset(preset._id, preset.nome, preset.minutos)}
                          className="w-full flex items-center justify-between p-3 hover:bg-emerald-900/30 rounded-xl transition-colors text-left group"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-lg">
                              {categoriaConfig[preset.categoria || "foco"].icon}
                            </span>
                            <div>
                              <p className="text-sm font-light text-[#F9F9F9] group-hover:text-emerald-300 transition-colors">
                                {preset.nome}
                              </p>
                              <p className="text-xs text-[#F9F9F9]/50">
                                {preset.minutos} min
                              </p>
                            </div>
                          </div>
                          {preset.uses && preset.uses > 0 && (
                            <span className="text-xs text-emerald-400/70 font-light">
                              {preset.uses}× usado
                            </span>
                          )}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Presets por Categoria */}
                {presetsByCategory && Object.entries(presetsByCategory).map(([categoria, catPresets]) => (
                  <div key={categoria} className="mb-4">
                    <p className="text-xs px-3 py-2 font-light tracking-wide flex items-center gap-2"
                       style={{ color: categoriaConfig[categoria as Categoria].color }}>
                      <span>{categoriaConfig[categoria as Categoria].icon}</span>
                      {categoriaConfig[categoria as Categoria].label}
                    </p>
                    <div className="space-y-1">
                      {catPresets.map((preset, index) => (
                        <motion.button
                          key={preset._id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 10 }}
                          transition={{ 
                            delay: (topPresets?.length || 0) * 0.04 + index * 0.04,
                            duration: 0.25,
                            ease: "easeOut"
                          }}
                          whileHover={{ 
                            scale: 1.02, 
                            x: 4,
                            transition: { duration: 0.15 }
                          }}
                          onClick={() => handleSelectPreset(preset._id, preset.nome, preset.minutos)}
                          className="w-full flex items-center justify-between p-3 hover:bg-emerald-900/30 rounded-xl transition-colors text-left group"
                        >
                          <div>
                            <p className="text-sm font-light text-[#F9F9F9] group-hover:text-emerald-300 transition-colors">
                              {preset.nome}
                            </p>
                            <p className="text-xs text-[#F9F9F9]/50">
                              {preset.minutos} min
                            </p>
                          </div>
                          {preset.uses && preset.uses > 0 && (
                            <span className="text-xs text-emerald-400/70 font-light">
                              {preset.uses}×
                            </span>
                          )}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                ))}

                {/* Estado Vazio */}
                {filteredPresets && filteredPresets.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-sm text-[#F9F9F9]/50 font-light">
                      Nenhum preset encontrado
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Dialog Criar Preset */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-[#1A1A1A] border-2 border-emerald-700/30 text-[#F9F9F9]">
          <DialogHeader>
            <DialogTitle className="text-xl font-light text-emerald-300 tracking-wide">
              Criar Novo Preset
            </DialogTitle>
            <DialogDescription className="text-sm text-[#F9F9F9]/60 font-light">
              Personalize seu tempo de foco
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm text-[#F9F9F9]/70 font-light mb-2 block">
                Nome do Preset
              </label>
              <Input
                placeholder="Ex: Foco Profundo"
                value={newPresetName}
                onChange={(e) => setNewPresetName(e.target.value)}
                maxLength={30}
                className="bg-emerald-900/20 border-emerald-700/30 text-[#F9F9F9] placeholder:text-[#F9F9F9]/40"
              />
            </div>

            <div>
              <label className="text-sm text-[#F9F9F9]/70 font-light mb-2 block">
                Minutos (1-180)
              </label>
              <Input
                type="number"
                min="1"
                max="180"
                placeholder="25"
                value={newPresetMinutes}
                onChange={(e) => setNewPresetMinutes(e.target.value)}
                className="bg-emerald-900/20 border-emerald-700/30 text-[#F9F9F9]"
              />
            </div>

            <div>
              <label className="text-sm text-[#F9F9F9]/70 font-light mb-2 block">
                Categoria
              </label>
              <Select value={newPresetCategory} onValueChange={(value) => setNewPresetCategory(value as Categoria)}>
                <SelectTrigger className="bg-emerald-900/20 border-emerald-700/30 text-[#F9F9F9]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#1C1C1C] border-emerald-700/30">
                  {Object.entries(categoriaConfig).map(([key, config]) => (
                    <SelectItem
                      key={key}
                      value={key}
                      className="text-[#F9F9F9] focus:bg-emerald-900/30 focus:text-emerald-300"
                    >
                      <span className="flex items-center gap-2">
                        {config.icon} {config.label}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              className="border-emerald-700/30 text-[#F9F9F9] hover:bg-emerald-900/20"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleCreatePreset}
              className="bg-emerald-700 hover:bg-emerald-600 text-white"
            >
              Criar Preset
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
