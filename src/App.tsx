import type { Component } from 'solid-js';
import { createSignal, onMount } from 'solid-js';
import styles from './App.module.css';
import { isValidEmail, storeEmailIfNew, downloadApp } from './supabase';

const App: Component = () => {
  const [email, setEmail] = createSignal('');
  const [isLoading, setIsLoading] = createSignal(false);
  const [message, setMessage] = createSignal('');
  const [isMobile, setIsMobile] = createSignal(false);
  
  const isEmailValid = () => isValidEmail(email());
  
  // Detect mobile device
  onMount(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
      const isSmallScreen = window.innerWidth <= 768;
      setIsMobile(isMobileDevice || isSmallScreen);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  });
  
  const handleEmailChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    setEmail(target.value);
    setMessage(''); // Clear any previous messages
  };
  
  const handleDownload = async () => {
    if (!isEmailValid()) {
      setMessage('Please enter a valid email address');
      return;
    }
    
    setIsLoading(true);
    setMessage('');
    
    try {
      const result = await storeEmailIfNew(email());
      
      if (result.success) {
        if (isMobile()) {
          // Mobile users: just collect email
          if (result.isNew) {
            setMessage('Thanks! We\'ll let you know when iOS drops.');
          } else {
            setMessage('You\'re already on the list. iOS coming soon!');
          }
        } else {
          // Desktop users: collect email and download
          if (result.isNew) {
            setMessage('Email saved! Starting download...');
          } else {
            setMessage('Welcome back! Starting download...');
          }
          
          // Start download immediately for desktop
          setTimeout(() => {
            downloadApp();
            setMessage(result.isNew ? 'Thanks for signing up!' : 'Download started!');
          }, 500);
        }
      } else {
        setMessage('Something went wrong. Please try again.');
      }
    } catch (error) {
      setMessage('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div class={styles.container}>
      <main class={styles.main}>
        <h1 class={styles.title}>
          Hey, this is <em class={styles.spill}>Spill</em>.
        </h1>
        
        <p class={styles.description}>
          One distraction-free space to spill your thoughts for a set time — brainstorm ideas, draft scripts, process 
          life, whatever. Plus dictation when your fingers can't keep up, and voice chat with your notes when you 
          need to think out loud.
        </p>
        
        <div class={styles.features}>
          <p>Open-source.</p>
          <p>Stays local.</p>
          <p class={styles.spillOut}><em>Spill</em> it out!</p>
        </div>
        
        <div class={styles.downloadSection}>
          <input 
            type="email" 
            placeholder="faraaz@pipedpiper.ai" 
            class={styles.emailInput}
            value={email()}
            onInput={handleEmailChange}
          />
          <button 
            class={`${styles.downloadButton} ${!isEmailValid() ? styles.disabled : ''}`}
            onClick={handleDownload}
            disabled={!isEmailValid() || isLoading()}
          >
            {isLoading() ? 'Saving...' : (isMobile() ? 'Notify Me' : 'Download')}
          </button>
        </div>
        
        {message() && (
          <p class={`${styles.message} ${message().includes('saved') || message().includes('Thanks') || message().includes('already on the list') || message().includes('Welcome back') || message().includes('Download started') ? styles.success : styles.error}`}>
            {message()}
          </p>
        )}
        
        {isMobile() ? (
          <div class={styles.mobileMessage}>
            <p class={styles.mobileText}>Hey there, mobile user.</p>
            <p class={styles.mobileSubtext}>
              Right now we're focused on nailing the macOS experience, but iOS is definitely coming. 
              Drop your email and you'll be first to know when we ship mobile.
            </p>
          </div>
        ) : (
          <p class={styles.macOnly}>( MacOS only )</p>
        )}
      </main>
      
      <footer class={styles.footer}>
        <div class={styles.footerLinks}>
          <a href="https://github.com/faraaz-baig/spill" target="_blank" rel="noopener noreferrer" class={styles.footerLink}>Source Code</a>
          <a href="#" class={styles.footerLink}>Join group chat</a>
        </div>
        <p class={styles.credit}>Built by <a href="https://faraazbaig.com" target="_blank" rel="noopener noreferrer" class={styles.creditLink}><strong>Faraaz</strong></a> & <a href="https://linkedin.com/in/vishruth-n" target="_blank" rel="noopener noreferrer" class={styles.creditLink}><strong>Vishruth</strong></a></p>
      </footer>
    </div>
  );
};

export default App;
