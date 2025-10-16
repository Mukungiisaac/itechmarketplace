const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Floating bubbles */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '0s', animationDuration: '8s' }} />
      <div className="absolute top-40 right-20 w-40 h-40 bg-accent/15 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s', animationDuration: '10s' }} />
      <div className="absolute bottom-32 left-1/4 w-48 h-48 bg-primary/8 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s', animationDuration: '12s' }} />
      <div className="absolute top-1/3 right-1/4 w-36 h-36 bg-accent/12 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s', animationDuration: '9s' }} />
      <div className="absolute bottom-20 right-10 w-44 h-44 bg-primary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s', animationDuration: '11s' }} />
      
      {/* Additional smaller bubbles */}
      <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-accent/8 rounded-full blur-2xl animate-float" style={{ animationDelay: '4s', animationDuration: '7s' }} />
      <div className="absolute bottom-1/3 right-1/3 w-28 h-28 bg-primary/12 rounded-full blur-2xl animate-float" style={{ animationDelay: '2.5s', animationDuration: '13s' }} />
      
      {/* Gradient orbs */}
      <div className="absolute top-10 right-1/2 w-56 h-56 bg-gradient-to-r from-primary/5 to-accent/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s' }} />
      <div className="absolute bottom-10 left-1/2 w-64 h-64 bg-gradient-to-l from-accent/8 to-primary/8 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s' }} />
    </div>
  );
};

export default AnimatedBackground;
