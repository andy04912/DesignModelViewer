import React, { useState, Suspense } from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import { OrbitControls, Stage } from '@react-three/drei';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

function Model({ url, visible }) {
  const gltf = useLoader(GLTFLoader, url);
  return <primitive object={gltf.scene} visible={visible} />;
}

function Loader() {
  return (
    <div style={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      color: '#fff',
      fontSize: '1.2rem'
    }}>
      Loading...
    </div>
  );
}

function App() {
  // Static configuration for models
  const models = [
    { name: '完整版實照', url: '/完整版實照.glb' },
    { name: '完整版白框', url: '/完整版白框.glb' }
  ];
  
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
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
      <Suspense fallback={<Loader />} />
    </div>
  );
}

export default App;
