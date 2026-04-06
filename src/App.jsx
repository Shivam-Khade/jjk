import { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Loader from './components/Loader';
import SukunaTimeline from './components/SukunaTimeline';
import ConvoSection from './components/ConvoSection';
import DomainSection from './components/DomainSection';

function App() {
  const [loading, setLoading] = useState(true);
  const [appVisible, setAppVisible] = useState(false);
  const [domainVisible, setDomainVisible] = useState(false);

  // Always scroll to top on reload so the hero doesn't get shifted under the nav
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    
    if (window.location.hash) {
      window.history.replaceState(null, '', window.location.pathname);
    }
    
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      {loading && <Loader onReveal={() => setAppVisible(true)} onComplete={() => setLoading(false)} />}
      
      <div 
        style={{ 
          pointerEvents: appVisible ? 'auto' : 'none',
        }}
      >
        <Navbar />

        <main>
          {/* Panel 1 — Hero (sticky, Timeline slides over it) */}
          <div className="stacked-panel" style={{ zIndex: 1, background: '#000' }}>
            <Hero />
          </div>

          {/* Panel 2 — Timeline (scrollable, NOT sticky — too tall for sticky) */}
          <div id="timeline" style={{ position: 'relative', zIndex: 2, background: '#050005' }}>
            <SukunaTimeline />
          </div>

          {/* Panel 3 / 4 — Convo swapped with Domain Expansion directly */}
          {!domainVisible ? (
            <div className="stacked-panel" style={{ zIndex: 5, background: 'transparent', marginTop: '-100vh' }}>
              <ConvoSection onComplete={() => setDomainVisible(true)} />
            </div>
          ) : (
            <div id="domain-container" style={{ position: 'relative', zIndex: 10, background: '#000', marginTop: '-100vh' }}>
              <DomainSection key="domain-manifest" visible={domainVisible} />
            </div>
          )}
        </main>
      </div>
    </>
  );
}

export default App;
