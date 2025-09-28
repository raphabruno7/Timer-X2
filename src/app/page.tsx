import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="text-center space-y-8 p-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            Timer X2
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Ambiente UI/UX moderno configurado com Tailwind CSS + ShadCN + Animações
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button size="lg" className="animate-pulse">
            Botão Primário
          </Button>
          <Button variant="secondary" size="lg">
            Botão Secundário
          </Button>
          <Button variant="outline" size="lg">
            Botão Outline
          </Button>
        </div>
        
        <div className="mt-12 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            Teste de Componentes
          </h2>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2 justify-center">
              <Button size="sm">Small</Button>
              <Button size="default">Default</Button>
              <Button size="lg">Large</Button>
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
              <Button variant="destructive">Destructive</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="link">Link</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
