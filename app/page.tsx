import Link from "next/link";
import { ArrowRight, Shield, TrendingUp, Wallet, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-brand-blue to-emerald flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-xl">InvestPro</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Features
            </Link>
            <Link href={ROUTES.PROJECTS} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Projects
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild>
              <Link href={ROUTES.LOGIN}>Sign In</Link>
            </Button>
            <Button variant="gradient" asChild>
              <Link href={ROUTES.REGISTER}>Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      <section className="container mx-auto px-4 py-24 text-center">
        <div className="mx-auto max-w-4xl animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
            Invest in the{" "}
            <span className="gradient-text">Future</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Premium investment platform with crypto support, project marketplace,
            and real-time portfolio analytics. Built for modern investors.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="gradient" size="lg" asChild>
              <Link href={ROUTES.REGISTER}>
                Start Investing <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href={ROUTES.PROJECTS}>Browse Projects</Link>
            </Button>
          </div>
        </div>
      </section>

      <section id="features" className="container mx-auto px-4 py-24">
        <h2 className="text-3xl font-bold text-center mb-16">Why InvestPro?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: TrendingUp,
              title: "Smart Investments",
              description: "Access curated investment projects with transparent ROI and risk metrics.",
            },
            {
              icon: Wallet,
              title: "Multi-Asset Wallet",
              description: "Deposit via card or crypto. Support for BTC, ETH, USDT, and USDC.",
            },
            {
              icon: Shield,
              title: "Bank-Grade Security",
              description: "2FA, KYC verification, and JWT authentication keep your assets safe.",
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="glass-card p-8 hover:border-primary/30 transition-all duration-300 animate-slide-up"
            >
              <div className="mb-4 rounded-xl bg-primary/10 p-3 w-fit">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 py-24">
        <div className="glass-card p-12 text-center">
          <Zap className="h-12 w-12 text-emerald mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4">Ready to grow your portfolio?</h2>
          <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
            Join thousands of investors already using InvestPro to build wealth.
          </p>
          <Button variant="gradient" size="lg" asChild>
            <Link href={ROUTES.REGISTER}>Create Free Account</Link>
          </Button>
        </div>
      </section>

      <footer className="border-t border-border/50 py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} InvestPro. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
