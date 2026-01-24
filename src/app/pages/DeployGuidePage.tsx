import { useState } from 'react';
import { Copy, Check, Terminal, ExternalLink, AlertCircle } from 'lucide-react';
import { copyToClipboard } from '../utils/clipboard';
import { toast, Toaster } from 'sonner';

export default function DeployGuidePage() {
  const [copiedStep, setCopiedStep] = useState<number | null>(null);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const projectId = 'pwlacumydrxvshklvttp';

  const copyToClipboardHandler = async (text: string, step: number) => {
    const success = await copyToClipboard(text);
    if (success) {
      setCopiedStep(step);
      toast.success('Copiado para a área de transferência!');
      setTimeout(() => setCopiedStep(null), 2000);
    } else {
      toast.error('Erro ao copiar. Selecione e copie manualmente.');
    }
  };

  const toggleStep = (step: number) => {
    const newCompleted = new Set(completedSteps);
    if (newCompleted.has(step)) {
      newCompleted.delete(step);
    } else {
      newCompleted.add(step);
    }
    setCompletedSteps(newCompleted);
  };

  const steps = [
    {
      number: 1,
      title: '🔧 Instalar Supabase CLI',
      description: 'Instale a ferramenta necessária para fazer deploy',
      commands: [
        {
          label: 'MacOS / Linux:',
          command: 'brew install supabase/tap/supabase',
          note: 'Precisa do Homebrew instalado'
        },
        {
          label: 'Windows:',
          command: 'scoop bucket add supabase https://github.com/supabase/scoop-bucket.git\nscoop install supabase',
          note: 'Precisa do Scoop instalado'
        },
        {
          label: 'Alternativa (NPM):',
          command: 'npm install -g supabase',
          note: 'Funciona em qualquer OS'
        }
      ],
      helpLink: 'https://supabase.com/docs/guides/cli/getting-started'
    },
    {
      number: 2,
      title: '🔐 Fazer Login no Supabase',
      description: 'Autentique-se na sua conta Supabase',
      commands: [
        {
          label: 'Execute:',
          command: 'supabase login',
          note: 'Vai abrir o navegador para login'
        }
      ]
    },
    {
      number: 3,
      title: '🔗 Conectar ao Projeto',
      description: 'Link o projeto local com o Supabase',
      commands: [
        {
          label: 'Execute:',
          command: `supabase link --project-ref ${projectId}`,
          note: 'Digite a senha do banco quando solicitado'
        }
      ]
    },
    {
      number: 4,
      title: '🚀 Deploy do Backend',
      description: 'Envie o código do servidor para produção',
      commands: [
        {
          label: 'Execute:',
          command: 'supabase functions deploy server --no-verify-jwt',
          note: 'Pode levar 1-2 minutos'
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
              <Terminal className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Deploy do Backend</h1>
              <p className="text-gray-600">Guia passo a passo para ativar o servidor</p>
            </div>
          </div>

          {/* Alert */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-yellow-900 mb-1">Por que fazer isso?</h3>
              <p className="text-sm text-yellow-800">
                Os erros "Failed to fetch" acontecem porque o backend ainda não foi deployado.
                Siga os passos abaixo para ativar o servidor e corrigir todos os erros!
              </p>
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Progresso</h2>
          <div className="flex items-center gap-2">
            {steps.map((step) => (
              <div key={step.number} className="flex-1">
                <div
                  className={`h-2 rounded-full transition-all ${
                    completedSteps.has(step.number)
                      ? 'bg-green-500'
                      : 'bg-gray-200'
                  }`}
                />
                <p className="text-xs text-gray-600 mt-1 text-center">
                  Passo {step.number}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-3 text-center">
            <p className="text-sm text-gray-600">
              {completedSteps.size} de {steps.length} completos
            </p>
          </div>
        </div>

        {/* Steps */}
        {steps.map((step) => (
          <div
            key={step.number}
            className={`bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-6 transition-all ${
              completedSteps.has(step.number)
                ? 'ring-2 ring-green-500'
                : ''
            }`}
          >
            {/* Step Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-4 flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                    completedSteps.has(step.number)
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {completedSteps.has(step.number) ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <span className="font-bold">{step.number}</span>
                  )}
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {step.title}
                  </h2>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </div>
              <button
                onClick={() => toggleStep(step.number)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  completedSteps.has(step.number)
                    ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {completedSteps.has(step.number) ? 'Desfazer' : 'Concluído'}
              </button>
            </div>

            {/* Commands */}
            <div className="space-y-4">
              {step.commands.map((cmd, idx) => (
                <div key={idx} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{cmd.label}</h3>
                    <button
                      onClick={() => copyToClipboardHandler(cmd.command, step.number * 10 + idx)}
                      className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      {copiedStep === step.number * 10 + idx ? (
                        <>
                          <Check className="w-4 h-4" />
                          Copiado!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          Copiar
                        </>
                      )}
                    </button>
                  </div>
                  <div className="bg-gray-900 rounded-lg p-3 font-mono text-sm text-green-400 overflow-x-auto">
                    <pre className="whitespace-pre-wrap break-all">{cmd.command}</pre>
                  </div>
                  {cmd.note && (
                    <p className="text-sm text-gray-600 mt-2 italic">💡 {cmd.note}</p>
                  )}
                </div>
              ))}
            </div>

            {/* Help Link */}
            {step.helpLink && (
              <a
                href={step.helpLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-4 text-blue-600 hover:text-blue-700 font-medium"
              >
                <ExternalLink className="w-4 h-4" />
                Ver documentação oficial
              </a>
            )}
          </div>
        ))}

        {/* Success Message */}
        {completedSteps.size === steps.length && (
          <div className="bg-green-50 border-2 border-green-500 rounded-2xl p-6 md:p-8 text-center">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-green-900 mb-2">
              🎉 Deploy Concluído!
            </h2>
            <p className="text-green-800 mb-6">
              Parabéns! Agora recarregue a página e os erros desaparecerão.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => window.location.href = '/dashboard'}
                className="w-full md:w-auto px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                Ir para o Dashboard
              </button>
              <button
                onClick={() => window.location.href = '/test-backend'}
                className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium ml-0 md:ml-3 mt-3 md:mt-0"
              >
                Testar Backend
              </button>
            </div>
          </div>
        )}

        {/* Quick Script Option */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl shadow-xl p-6 md:p-8 text-white">
          <h2 className="text-2xl font-bold mb-3">⚡ Opção Rápida: Script Automático</h2>
          <p className="mb-4 opacity-90">
            Se você já tem o Supabase CLI instalado, use nosso script automático que faz tudo de uma vez:
          </p>
          <div className="bg-white/10 backdrop-blur rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold">Execute no terminal:</h3>
              <button
                onClick={() => copyToClipboardHandler('chmod +x DEPLOY_AGORA.sh && ./DEPLOY_AGORA.sh', 999)}
                className="flex items-center gap-2 px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-sm"
              >
                {copiedStep === 999 ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copiado!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copiar
                  </>
                )}
              </button>
            </div>
            <div className="bg-gray-900 rounded-lg p-3 font-mono text-sm text-green-400">
              <pre>chmod +x DEPLOY_AGORA.sh && ./DEPLOY_AGORA.sh</pre>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-8 text-center">
          <button
            onClick={() => window.history.back()}
            className="text-gray-600 hover:text-gray-900 font-medium"
          >
            ← Voltar
          </button>
        </div>
      </div>
      <Toaster />
    </div>
  );
}