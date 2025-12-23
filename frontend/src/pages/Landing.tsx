import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  FolderKanban, 
  CheckCircle2,
  BarChart3, 
  Shield,
  Sparkles,
  UserPlus,
  FolderPlus,
  ListTodo,
  TrendingUp,
  Mail,
  Lock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';

const Landing: React.FC = () => {
  const features = [
    {
      icon: FolderKanban,
      title: 'Project Management',
      description: 'Create and organize projects easily with intuitive tools designed for productivity.',
    },
    {
      icon: CheckCircle2,
      title: 'Task Tracking',
      description: 'Add, complete, and delete tasks. Stay on top of your work with clear task lists.',
    },
    {
      icon: BarChart3,
      title: 'Progress Overview',
      description: 'Visual progress with smart indicators. See exactly where you stand at a glance.',
    },
    {
      icon: Shield,
      title: 'Secure Access',
      description: 'Authentication with protected access. Your data stays safe and private.',
    },
  ];

  const steps = [
    {
      icon: UserPlus,
      number: '01',
      title: 'Create an Account',
      description: 'Sign up in seconds with your email',
    },
    {
      icon: FolderPlus,
      number: '02',
      title: 'Create a Project',
      description: 'Organize your work into projects',
    },
    {
      icon: ListTodo,
      number: '03',
      title: 'Add Tasks',
      description: 'Break down work into manageable tasks',
    },
    {
      icon: TrendingUp,
      number: '04',
      title: 'Track Progress',
      description: 'Monitor completion and stay productive',
    },
  ];

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 lg:pt-44 lg:pb-36">
        {/* Animated gradient background */}
        <div className="absolute inset-0 gradient-hero" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,_hsl(234_89%_60%_/_0.4),_transparent)]" />
        
        {/* Floating light orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 right-1/3 w-48 h-48 bg-accent/30 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }} />
        
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8 animate-fade-in backdrop-blur-sm">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Streamline Your Workflow</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-primary-foreground leading-tight mb-6 animate-slide-up">
              Manage Your Projects.
              <span className="block mt-2">Stay Productive.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-primary-foreground/70 max-w-2xl mx-auto mb-12 animate-slide-up" style={{ animationDelay: '0.1s' }}>
              A simple and efficient platform to manage projects, tasks, and progress in one place.
              Turn chaos into clarity.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <Link to="/signup">
                <Button variant="hero" size="xl" className="group shadow-glow">
                  Get Started
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/signin">
                <Button variant="heroOutline" size="xl">
                  Sign In
                </Button>
              </Link>
            </div>
            
            <p className="text-sm text-primary-foreground/50 mt-8 animate-fade-in" style={{ animationDelay: '0.3s' }}>
              No credit card required • Free to use • Start in seconds
            </p>
          </div>
        </div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* Features Section */}
      <section className="py-24 lg:py-32 bg-background relative">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-block text-sm font-semibold text-primary uppercase tracking-wider mb-4">
              Features
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
              Everything You Need to Succeed
            </h2>
            <p className="text-lg text-muted-foreground">
              Powerful features designed to help you manage projects efficiently and achieve your goals.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {features.map((feature, index) => (
              <div 
                key={feature.title}
                className="group p-8 rounded-2xl bg-card border border-border hover:border-primary/30 shadow-card hover:shadow-xl transition-all duration-500 hover:-translate-y-2 animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center mb-6 group-hover:scale-110 group-hover:shadow-glow transition-all duration-300">
                  <feature.icon className="h-7 w-7 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-card-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 lg:py-32 bg-muted/50 relative overflow-hidden">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_hsl(234_89%_60%_/_0.03)_1px,_transparent_1px)] bg-[size:24px_24px]" />
        
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-block text-sm font-semibold text-primary uppercase tracking-wider mb-4">
              How It Works
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
              Get Started in 4 Simple Steps
            </h2>
            <p className="text-lg text-muted-foreground">
              From sign up to productivity in minutes. Here's how easy it is.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {/* Connection line */}
            <div className="hidden lg:block absolute top-16 left-[12%] right-[12%] h-0.5 bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20" />
            
            {steps.map((step, index) => (
              <div 
                key={step.title}
                className="relative flex flex-col items-center text-center animate-slide-up"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <div className="relative mb-6">
                  <div className="w-20 h-20 rounded-2xl bg-card border-2 border-primary/20 flex items-center justify-center shadow-lg group hover:border-primary/50 transition-all duration-300">
                    <step.icon className="h-8 w-8 text-primary" />
                  </div>
                  <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full gradient-primary text-primary-foreground text-sm font-bold flex items-center justify-center shadow-lg">
                    {step.number.split('')[1]}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {step.title}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 lg:py-32 relative overflow-hidden">
        {/* Inverted gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-[hsl(270_80%_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,_hsl(0_0%_100%_/_0.1),_transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,_hsl(0_0%_100%_/_0.1),_transparent_50%)]" />
        
        {/* Animated shapes */}
        <div className="absolute top-10 left-10 w-32 h-32 border border-primary-foreground/10 rounded-full animate-pulse" />
        <div className="absolute bottom-10 right-10 w-48 h-48 border border-primary-foreground/10 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/4 w-24 h-24 border border-primary-foreground/10 rounded-2xl rotate-45 animate-pulse" style={{ animationDelay: '0.5s' }} />
        
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <Sparkles className="h-12 w-12 text-primary-foreground/80 mx-auto mb-6 animate-pulse" />
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-6">
              Start Managing Your Projects Today
            </h2>
            <p className="text-xl text-primary-foreground/80 mb-10 max-w-xl mx-auto">
              Join thousands of productive teams already using TaskFlow to deliver projects on time.
            </p>
            <Link to="/signup">
              <Button 
                size="xl" 
                className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 group"
              >
                Get Started Free
                <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 bg-sidebar border-t border-sidebar-border relative overflow-hidden">
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-sidebar to-transparent opacity-50" />
        
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {/* Brand */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg gradient-primary">
                  <Sparkles className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold text-sidebar-foreground">TaskFlow</span>
              </div>
              <p className="text-sidebar-foreground/60 max-w-sm">
                A simple and efficient platform to manage projects, tasks, and progress in one place.
              </p>
            </div>
            
            {/* Links */}
            <div>
              <h4 className="font-semibold text-sidebar-foreground mb-4">Product</h4>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-sidebar-foreground/60 hover:text-primary transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sidebar-foreground/60 hover:text-primary transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sidebar-foreground/60 hover:text-primary transition-colors">
                    About
                  </a>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-sidebar-foreground mb-4">Legal</h4>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-sidebar-foreground/60 hover:text-primary transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sidebar-foreground/60 hover:text-primary transition-colors">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sidebar-foreground/60 hover:text-primary transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
          </div>
          
          {/* Bottom bar */}
          <div className="pt-8 border-t border-sidebar-border flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-sidebar-foreground/60">
              © {new Date().getFullYear()} TaskFlow. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-sidebar-foreground/60 hover:text-primary transition-colors">
                <Mail className="h-5 w-5" />
              </a>
              <a href="#" className="text-sidebar-foreground/60 hover:text-primary transition-colors">
                <Lock className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
