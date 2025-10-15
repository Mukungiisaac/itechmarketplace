import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Smartphone, Download } from "lucide-react";

const Install = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === "accepted") {
      setDeferredPrompt(null);
      setIsInstallable(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Smartphone className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">Install iTechMarketplace</CardTitle>
            <CardDescription>
              Get quick access to homes, products, and services right from your home screen
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {isInstallable ? (
              <div className="text-center space-y-4">
                <p className="text-muted-foreground">
                  Click the button below to install the app on your device
                </p>
                <Button onClick={handleInstallClick} size="lg" className="w-full">
                  <Download className="mr-2 h-5 w-5" />
                  Install App
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  To install this app on your device:
                </p>
                <div className="space-y-3 text-sm">
                  <div className="p-4 bg-muted rounded-lg">
                    <h3 className="font-semibold mb-2">On iPhone/iPad:</h3>
                    <ol className="list-decimal list-inside space-y-1">
                      <li>Tap the Share button in Safari</li>
                      <li>Scroll down and tap "Add to Home Screen"</li>
                      <li>Tap "Add" to confirm</li>
                    </ol>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <h3 className="font-semibold mb-2">On Android:</h3>
                    <ol className="list-decimal list-inside space-y-1">
                      <li>Tap the menu button (three dots) in Chrome</li>
                      <li>Tap "Add to Home screen"</li>
                      <li>Tap "Add" to confirm</li>
                    </ol>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default Install;