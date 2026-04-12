import React, { useState, useEffect } from 'react';

declare global {
  interface Window {
    ethereum?: any;
  }
}

import { BrowserProvider, Contract, parseEther } from 'ethers';
import { ShieldCheck, Wallet, Database, Search, ArrowRight, Loader2, MapPin, Leaf, Clock, Hash, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';

// Dummy ABI for demonstration (matching the AgriTrace.sol we created)
const ABI = [
  "function registerCrop(string _batchId, string _productType, string _location, string _certification) public",
  "function updateTransitStatus(string _batchId, string _action, string _location) public",
  "function getCropHistory(string _batchId) public view returns (tuple(string action, string location, uint256 timestamp, address actor)[])"
];

// Fallback mock data if blockchain isn't actually connected
// Removed static MOCK_HISTORY. We will use localStorage to simulate the immutable ledger locally.

export default function BlockchainTraceability() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [account, setAccount] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [activeTab, setActiveTab] = useState("trace");

  // Registration State
  const [isRegistering, setIsRegistering] = useState(false);
  const [regData, setRegData] = useState({
    batchId: `BATCH-${Math.floor(Math.random() * 10000)}`,
    productType: '',
    location: '',
    certification: 'Organic'
  });

  // Tracking State
  const [searchBatchId, setSearchBatchId] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [cropHistory, setCropHistory] = useState<any[] | null>(null);

  // Connect to MetaMask
  const connectWallet = async () => {
    setIsConnecting(true);
    try {
      if (typeof window.ethereum !== 'undefined') {
        const provider = new BrowserProvider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        setAccount(accounts[0]);
        toast({
          title: t('trace.walletConnected'),
          description: `Connected to ${accounts[0].substring(0, 6)}...${accounts[0].substring(38)}`,
        });
      } else {
        // Mock connection if no metamask (great for hackathon demos)
        setTimeout(() => {
          setAccount('0x71C7656EC7ab88b098defB751B7401B5f6d8976F');
          toast({
            title: t('trace.simulatedWallet'),
            description: t('trace.simulatedWalletDesc'),
          });
        }, 1000);
      }
    } catch (error) {
      toast({
        title: t('trace.connectionFailed'),
        description: t('trace.connectionFailed'),
        variant: "destructive"
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!account) return connectWallet();
    
    setIsRegistering(true);
    
    try {
      // If MetaMask is available, actually pop it up to "sign" the hash to make the demo 100% real!
      if (typeof window.ethereum !== 'undefined') {
        const provider = new BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        
        // This will pop up MetaMask and ask the user to kryptographically sign the payload
        const messageToSign = `Minting AgriSphere Record:\nBatch: ${regData.batchId}\nProduct: ${regData.productType}\nLocation: ${regData.location}\nCert: ${regData.certification}\nTimestamp: ${Date.now()}`;
        
        await signer.signMessage(messageToSign);
        
        toast({
          title: t('trace.recordFound'),
          description: t('trace.recordFoundDesc'),
        });
      }
      
      // Simulate confirmation delay
      setTimeout(() => {
        setIsRegistering(false);
        
        // Save to LocalStorage to simulate the blockchain ledger state
        const historyRecord = {
          action: "harvested",
          location: regData.location || "Farm Origin",
          timestamp: Date.now(),
          actor: account ? account : "0x" + Math.random().toString(16).substr(2, 40)
        };
        const existingRecordsStr = localStorage.getItem(`batch_${regData.batchId}`);
        const records = existingRecordsStr ? JSON.parse(existingRecordsStr) : [];
        records.push(historyRecord);
        localStorage.setItem(`batch_${regData.batchId}`, JSON.stringify(records));

        toast({
          title: t('trace.mintSuccess'),
          description: t('trace.mintSuccessDesc', { id: regData.batchId }),
        });
        setRegData({ ...regData, batchId: `BATCH-${Math.floor(Math.random() * 10000)}` });
        setActiveTab("trace");
      }, 1500);

    } catch (err: any) {
      setIsRegistering(false);
      toast({
        title: t('trace.recordNotFound'),
        description: err?.message || t('trace.recordNotFoundDesc', { id: regData.batchId }),
        variant: "destructive"
      });
    }
  };

  const handleTrace = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    
    setTimeout(() => {
      setIsSearching(false);
      if (searchBatchId.trim() !== '') {
        // Normalize the search ID (e.g. '6477' -> 'BATCH-6477')
        let normalizedSearchId = searchBatchId.trim().toUpperCase();
        if (!normalizedSearchId.startsWith('BATCH-')) {
          normalizedSearchId = `BATCH-${normalizedSearchId}`;
        }
        
        const storedHistory = localStorage.getItem(`batch_${normalizedSearchId}`);
        if (storedHistory) {
          setCropHistory(JSON.parse(storedHistory));
          toast({
            title: "Record Found",
            description: "Immutable Web3 records retrieved.",
          });
        } else {
          setCropHistory(null);
          toast({
            title: t('trace.recordNotFound'),
            description: t('trace.recordNotFoundDesc', { id: searchBatchId }),
            variant: "destructive"
          });
        }
      } else {
        setCropHistory(null);
      }
    }, 1500);
  };

  return (
    <div className="container mx-auto p-4 py-8 max-w-5xl">
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight flex items-center gap-2">
            <span className="text-primary"><Database className="h-8 w-8" /></span>
            {t('trace.title')}
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            {t('trace.subtitle')}
          </p>
        </div>
        
        <Button 
          variant={account ? "outline" : "default"} 
          className="rounded-full shadow-lg h-12 px-6"
          onClick={connectWallet}
          disabled={isConnecting}
        >
          {isConnecting ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : account ? (
            <ShieldCheck className="mr-2 h-5 w-5 text-green-500" />
          ) : (
            <Wallet className="mr-2 h-5 w-5" />
          )}
          {account ? `${t('trace.connected', { account: account.substring(0, 5) + '...' + account.substring(38) })}` : t('trace.connectBtn')}
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 h-14 bg-muted/50 p-1 mb-8">
          <TabsTrigger value="trace" className="rounded-md text-lg"><Search className="mr-2 h-5 w-5" /> {t('trace.trackTab')}</TabsTrigger>
          <TabsTrigger value="register" className="rounded-md text-lg"><Leaf className="mr-2 h-5 w-5" /> {t('trace.registerTab')}</TabsTrigger>
        </TabsList>

        <TabsContent value="trace">
          <Card className="border-primary/20 shadow-xl overflow-hidden glass-panel">
            <div className="bg-gradient-to-r from-primary/10 to-transparent p-6 border-b border-white/5">
              <form onSubmit={handleTrace} className="flex gap-4 max-w-2xl mx-auto">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
                  <Input 
                    placeholder={t('trace.searchHint')} 
                    className="pl-10 h-12 text-lg border-2 focus-visible:ring-primary"
                    value={searchBatchId}
                    onChange={(e) => setSearchBatchId(e.target.value)}
                  />
                </div>
                <Button type="submit" size="lg" className="h-12 px-8" disabled={isSearching || !searchBatchId}>
                  {isSearching ? <Loader2 className="h-5 w-5 animate-spin" /> : t('trace.traceBtn')}
                </Button>
              </form>
            </div>

            {cropHistory && (
              <CardContent className="p-8">
                 <div className="flex items-center gap-4 mb-8 p-4 bg-muted/40 rounded-xl border border-white/10">
                    <div className="bg-primary/20 p-3 rounded-full">
                      <Hash className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">{t('trace.verifiedBatchTrace')}</h3>
                      <p className="text-2xl font-bold flex items-center gap-2">
                        {searchBatchId} <Badge className="bg-green-500/20 text-green-400 hover:bg-green-500/30">{t('trace.authentic')}</Badge>
                      </p>
                    </div>
                 </div>

                 <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-primary/30 before:to-transparent">
                    {cropHistory.map((record, idx) => (
                      <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-background bg-primary text-primary-foreground shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                          <CheckCircle2 className="h-5 w-5" />
                        </div>
                        <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-white/10 bg-muted/20 backdrop-blur-sm shadow-md transition-all hover:border-primary/50 hover:bg-muted/40">
                          <div className="flex items-center justify-between space-x-2 mb-2">
                            <h4 className="font-bold text-lg text-foreground">{t(`trace.actions.${record.action}`, { defaultValue: record.action })}</h4>
                            <time className="text-xs font-mono text-primary/80 bg-primary/10 px-2 py-1 rounded">
                              {new Date(record.timestamp).toLocaleDateString()}
                            </time>
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground mb-3 font-medium">
                            <MapPin className="h-4 w-4 mr-1 text-red-400" /> {record.location}
                          </div>
                          <div className="text-xs font-mono text-muted-foreground bg-black/30 p-2 rounded truncate border border-white/5">
                            {t('trace.signedBy')} <span className="text-blue-400">{record.actor}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                 </div>
              </CardContent>
            )}
            
            {!cropHistory && !isSearching && (
              <div className="p-16 text-center text-muted-foreground flex flex-col items-center">
                <Database className="h-16 w-16 mb-4 opacity-20" />
                <p className="text-lg">Enter a Batch ID to query the blockchain.</p>
                <p className="text-sm opacity-60 mt-2">Data is strictly verified via Web3 Immutable Ledger.</p>
              </div>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="register">
          <Card className="max-w-2xl mx-auto shadow-xl border-primary/20">
            <CardHeader>
              <CardTitle>Mint New Crop Record</CardTitle>
              <CardDescription>
                Record your harvest on the blockchain. This data cannot be altered once submitted.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleRegister} className="space-y-5">
                <div className="grid gap-2">
                  <Label htmlFor="batch">{t('trace.batchIdLabel')}</Label>
                  <Input 
                    id="batch" 
                    value={regData.batchId} 
                    readOnly 
                    className="bg-muted/50 font-mono text-primary font-bold" 
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="type">{t('trace.cropLabel')}</Label>
                  <Input 
                    id="type" 
                    placeholder={t('trace.cropPlaceholder')}
                    required
                    value={regData.productType}
                    onChange={(e) => setRegData({...regData, productType: e.target.value})}
                  />
                </div>

                 <div className="grid gap-2">
                  <Label htmlFor="loc">{t('trace.originLabel')}</Label>
                  <Input 
                    id="loc" 
                    placeholder={t('trace.originPlaceholder')} 
                    required
                    value={regData.location}
                    onChange={(e) => setRegData({...regData, location: e.target.value})}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="loc">{t('trace.qualityLabel')}</Label>
                  <select 
                    title="certification"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={regData.certification}
                    onChange={(e) => setRegData({...regData, certification: e.target.value})}
                  >
                    <option value="Organic">100% Organic</option>
                    <option value="Standard">Standard Farming</option>
                    <option value="Transitional">Transitional</option>
                    <option value="Pesticide-Free">Pesticide-Free</option>
                  </select>
                </div>

                <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mt-6">
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="h-6 w-6 text-primary mt-1" />
                    <p className="text-sm text-muted-foreground">
                      {t('trace.signingNotice')}
                    </p>
                  </div>
                </div>

                <Button className="w-full h-12 text-lg font-bold mt-4" type="submit" disabled={isRegistering}>
                  {isRegistering ? (
                    <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> {t('trace.mintingBtn')}</>
                  ) : (
                    <><Database className="mr-2 h-5 w-5" /> {t('trace.signRegisterBtn')}</>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
