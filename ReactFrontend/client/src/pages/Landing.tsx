import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sparkles, AudioWaveform, Target, BarChart3, Github, Twitter, Mail } from "lucide-react";
import { motion } from "framer-motion";
import heroImage from "@assets/generated_images/AI_audio_waveform_hero_image_c37d8efd.png";

export default function Landing() {
  const features = [
    {
      icon: Sparkles,
      title: "Real-time Detection",
      description: "Instantly analyze audio files and detect emotions in real-time with our advanced AI model."
    },
    {
      icon: AudioWaveform,
      title: "Multiple Formats",
      description: "Support for WAV, MP3, OGG, and FLAC audio formats for maximum compatibility."
    },
    {
      icon: Target,
      title: "High Accuracy",
      description: "State-of-the-art deep learning model trained on diverse datasets for precise emotion recognition."
    },
    {
      icon: BarChart3,
      title: "Visual Confidence",
      description: "Beautiful visualizations showing confidence scores for each detected emotion."
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        {/* Animated Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-chart-2/20 animate-pulse" style={{ animationDuration: '20s' }} />
        
        {/* Hero Image with Overlay */}
        <div className="absolute inset-0 opacity-40">
          <img 
            src={heroImage} 
            alt="AI Neural Network Visualization" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
        </div>

        <div className="container relative z-10 mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <div className="mb-8 inline-flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-primary to-chart-2 p-1">
              <div className="flex h-full w-full items-center justify-center rounded-full bg-background">
                <AudioWaveform className="h-12 w-12 text-primary" />
              </div>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-heading font-bold mb-6 bg-gradient-to-r from-primary via-chart-2 to-primary bg-clip-text text-transparent">
              Audio Emotion Recognition System
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              AI-powered system that analyzes audio files to detect emotions using deep learning
            </p>

            <Link href="/upload">
              <Button 
                size="lg" 
                className="text-lg px-12 py-6 rounded-full bg-gradient-to-r from-primary to-chart-2 hover:scale-105 transition-transform shadow-lg"
                data-testid="button-try-now"
              >
                Try it Now
                <Sparkles className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-card/50">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-heading font-bold mb-4">
              Powerful Features
            </h2>
            <p className="text-muted-foreground text-lg">
              Everything you need for accurate emotion detection
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="p-8 h-full hover-elevate" data-testid={`card-feature-${index}`}>
                  <div className="flex flex-col items-center text-center gap-4">
                    <div className="p-4 rounded-full bg-gradient-to-br from-primary/20 to-chart-2/20">
                      <feature.icon className="h-12 w-12 text-primary" />
                    </div>
                    <h3 className="text-xl font-heading font-semibold">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-heading font-bold mb-6">
                State-of-the-Art Technology
              </h2>
              <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                Our deep learning model is trained on thousands of audio samples to accurately identify seven distinct emotions:Valence, Energy, Tension, Anger, Fear, Happy, Sad, Tender.
              </p>
              
              <div className="space-y-4">
                <Card className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="text-4xl font-heading font-bold text-primary">75%</div>
                    <div>
                      <div className="font-semibold">Accuracy Rate</div>
                      <div className="text-sm text-muted-foreground">On validation dataset</div>
                    </div>
                  </div>
                </Card>
                
                <Card className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="text-4xl font-heading font-bold text-chart-2">8</div>
                    <div>
                      <div className="font-semibold">Emotion Types</div>
                      <div className="text-sm text-muted-foreground">Comprehensive coverage</div>
                    </div>
                  </div>
                </Card>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Card className="p-8">
                <h3 className="text-2xl font-heading font-semibold mb-6">Supported Formats</h3>
                <div className="grid grid-cols-2 gap-4">
                  {['.WAV', '.MP3', '.OGG', '.FLAC'].map((format) => (
                    <div key={format} className="flex items-center gap-2 p-4 rounded-md bg-muted/50">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                      <span className="font-mono font-semibold">{format}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 border-t border-border bg-card/30">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-12">
            <div>
              <h3 className="font-heading font-bold text-xl mb-4 bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent">
                Audio Emotion AI
              </h3>
              <p className="text-muted-foreground">
                Advanced emotion recognition powered by deep learning and artificial intelligence.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/">
                    <a className="text-muted-foreground hover:text-foreground transition-colors">
                      Home
                    </a>
                  </Link>
                </li>
               
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <div className="flex gap-4">
                <Button variant="ghost" size="icon" className="hover-elevate" data-testid="button-social-github">
                  <Github className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="hover-elevate" data-testid="button-social-twitter">
                  <Twitter className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="hover-elevate" data-testid="button-social-email">
                  <Mail className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-border text-center text-sm text-muted-foreground">
            <p>© 2025 Audio Emotion Recognition System.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
