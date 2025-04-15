import React, { useState } from 'react';
import axios from 'axios';
import { Bot } from 'lucide-react';
import { Button } from './components/ui/Button';
import { Input } from './components/ui/Input';
import { Label } from './components/ui/Label';
import { Textarea } from './components/ui/Textarea';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from './components/ui/Card';
import { ScrollArea } from './components/ui/ScrollArea';

export default function App() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [instructions, setInstructions] = useState("");
  const [searchUrl, setSearchUrl] = useState("");
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  const addLog = (message) => {
    setLogs((prevLogs) => [
      ...prevLogs,
      `${new Date().toLocaleTimeString()}: ${message}`,
    ]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    addLog(`Tentativa de login com usuário: ${username} e email: ${email}`);

    try {
      const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:3001";
      await axios.post(`${apiUrl}/start`, {
        username,
        email,
        password,
        instructions,
        searchUrl,
      });
      addLog("Credenciais enviadas com sucesso!");
    } catch (error) {
      addLog(
        `Erro ao iniciar automação: ${
          error.response?.data.error || error.message
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-darkBg p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(0,149,255,0.1),rgba(0,149,255,0)_50%)]" />
        <div className="absolute w-full h-full animate-pulse">
          <div className="absolute inset-0 opacity-30 mix-blend-screen bg-[linear-gradient(45deg,transparent_40%,rgba(0,149,255,0.4)_70%,transparent_90%)] animate-[glow_4s_ease-in-out_infinite]" />
          <div className="absolute inset-0 opacity-30 mix-blend-screen bg-[linear-gradient(-45deg,transparent_40%,rgba(255,123,0,0.4)_70%,transparent_90%)] animate-[glow_4s_ease-in-out_infinite_1s]" />
        </div>
      </div>

      <div className="w-full max-w-4xl flex gap-6 flex-col lg:flex-row relative z-10">
        <Card className="flex-1 shadow-xl bg-cardBg backdrop-blur-sm border border-borderGray">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-textPrimary flex items-center gap-2">
              <Bot className="w-6 h-6" />
              Linkedin AI
            </CardTitle>
            <CardDescription className="text-textSecondary">
              Entre com suas credenciais para acessar o sistema.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-textSecondary">Nome de Usuário</Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-black/30 border-borderGray text-textPrimary"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-textSecondary">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-black/30 border-borderGray text-textPrimary"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-textSecondary">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-black/30 border-borderGray text-textPrimary"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="searchUrl" className="text-textSecondary">Link da Busca</Label>
                <Input
                  id="searchUrl"
                  type="url"
                  value={searchUrl}
                  onChange={(e) => setSearchUrl(e.target.value)}
                  className="bg-black/30 border-borderGray text-textPrimary"
                  placeholder="https://"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="instructions" className="text-textSecondary">Instruções para Assistente AI</Label>
                <Textarea
                  id="instructions"
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  className="bg-black/30 border-borderGray text-textPrimary"
                  placeholder="Digite suas instruções aqui..."
                  rows={3}
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                disabled={loading}
              >
                {loading ? "Carregando..." : "Iniciar"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="flex-1 shadow-xl bg-cardBg backdrop-blur-sm border border-borderGray">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-textPrimary">Logs do Sistema</CardTitle>
            <CardDescription className="text-textSecondary">
              Acompanhe as ações em tempo real.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] w-full rounded-md border border-borderGray bg-black/30 p-4">
              {logs.map((log, index) => (
                <p key={index} className="text-sm text-textSecondary mb-1">{log}</p>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}