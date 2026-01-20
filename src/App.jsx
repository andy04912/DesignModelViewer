import React, { useState, Suspense, useEffect } from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import { OrbitControls, Stage } from '@react-three/drei';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

// --- Progress Store ---
// A simple event emitter store to track loading progress without re-rendering the whole App
const loadingStore = {
  progress: {}, // { url: { loaded: 0, total: 0 } }
  listeners: [],
  update(url, loaded, total) {
    this.progress[url] = { loaded, total };
    this.notify();
  },
  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  },
  notify() {
    let totalLoaded = 0;
    let totalSize = 0;
    Object.values(this.progress).forEach(p => {
      totalLoaded += p.loaded;
      totalSize += p.total;
    });
    this.listeners.forEach(l => l({ totalLoaded, totalSize }));
  }
};

// --- Components ---

function CustomLoader() {
  const [status, setStatus] = useState({ totalLoaded: 0, totalSize: 0 });
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const unsub = loadingStore.subscribe((newStatus) => {
      setStatus(newStatus);
    });
    return unsub;
  }, []);

  // Auto-hide when fully loaded (with a small buffer/delay check could be added here, 
  // but for simplicity we hide when totalSize > 0 and loaded >= total)
  useEffect(() => {
    if (status.totalSize > 0 && status.totalLoaded >= status.totalSize) {
      // Small timeout to let user see 100%
      const timer = setTimeout(() => setVisible(false), 500);
      return () => clearTimeout(timer);
    } else if (status.totalSize > 0) {
      setVisible(true);
    }
  }, [status]);

  if (!visible) return null;

  const percent = status.totalSize > 0 
    ? Math.min(100, (status.totalLoaded / status.totalSize) * 100).toFixed(1) 
    : 0;
  
  const toMB = (bytes) => (bytes / (1024 * 1024)).toFixed(2);

  return (
    <div style={{
      position: 'absolute',
      top: 0, left: 0, width: '100%', height: '100%',
      background: '#1a1a1a',
      zIndex: 100,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      color: 'white',
      fontFamily: 'Inter, sans-serif',
      transition: 'opacity 0.5s ease',
      opacity: visible ? 1 : 0,
      pointerEvents: visible ? 'auto' : 'none'
    }}>
      <div style={{ fontSize: '2rem', marginBottom: '20px', fontWeight: 'bold' }}>
        {percent}%
      </div>
      
      {/* Progress Bar Container */}
      <div style={{ 
        width: '300px', 
        height: '4px', 
        background: '#333', 
        borderRadius: '2px',
        overflow: 'hidden',
        marginBottom: '10px'
      }}>
        {/* Progress Bar Fill */}
        <div style={{
          width: `${percent}%`,
          height: '100%',
          background: '#646cff',
          transition: 'width 0.1s linear'
        }} />
      </div>

      <div style={{ fontSize: '0.9rem', color: '#888' }}>
        {toMB(status.totalLoaded)} MB / {toMB(status.totalSize)} MB
      </div>
    </div>
  );
}

function Model({ url, visible }) {
  const gltf = useLoader(
    GLTFLoader, 
    url, 
    (loader) => {
      // Setup (if we needed draco, we'd add it here, but it's removed now)
    },
    (xhr) => {
      // On Progress
      if (xhr.total > 0) {
        loadingStore.update(url, xhr.loaded, xhr.total);
      }
    }
  );
  return <primitive object={gltf.scene} visible={visible} />;
}

// --- Main App ---

function App() {
  // Static configuration for models
  const models = [
    { name: '完整版實照', url: '/完整版實照.glb' },
    { name: '完整版白框', url: '/完整版白框.glb' }
  ];
  
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      {/* Custom Byte-based Loader */}
      <CustomLoader />

      {/* UI Controls */}
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        zIndex: 10,
        display: 'flex',
        gap: '10px',
        flexDirection: 'column'
      }}>
        <div style={{
          display: 'flex',
          gap: '5px',
          background: 'rgba(0,0,0,0.5)',
          padding: '10px',
          borderRadius: '8px'
        }}>
          {models.map((model, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              style={{
                padding: '8px 16px',
                background: activeIndex === index ? '#646cff' : '#444',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                transition: 'background 0.3s'
              }}
            >
              {model.name}
            </button>
          ))}
        </div>
      </div>

      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <Suspense fallback={null}>
          <Stage environment="city" intensity={0.6} adjustCamera={true}>
            {models.map((model, index) => (
              <Model 
                key={model.url} 
                url={model.url} 
                visible={index === activeIndex} 
              />
            ))}
          </Stage>
          <OrbitControls makeDefault />
        </Suspense>
      </Canvas>
    </div>
  );
}

export default App;
