'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import ColorMenu from './ColorMenu';
import MaterialMenu from './MaterialMenu';

const ThreeViewer = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animationIdRef = useRef<number | null>(null);
  const modelRef = useRef<THREE.Object3D | null>(null);
  const materialRef = useRef<THREE.MeshPhysicalMaterial | null>(null);
  const [loadingStatus, setLoadingStatus] = useState<string>('Initializing...');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedColor, setSelectedColor] = useState<string>('#4a90e2');
  
  const [materialProperties, setMaterialProperties] = useState({
    metalness: 0.0,
    roughness: 0.2,
    clearcoat: 1.0,
    clearcoatRoughness: 0.1,
    reflectivity: 0.8,
    ior: 1.5,
    transmission: 0.0,
    thickness: 0.5,
    opacity: 1.0
  });

  const isDragging = useRef(false);
  const previousMouse = useRef({ x: 0, y: 0 });
  const rotationSpeed = 0.005;
  const zoomSpeed = 0.1;

  const changeColor = (newColor: string) => {
    setSelectedColor(newColor);
    if (materialRef.current) {
      materialRef.current.color.set(new THREE.Color(newColor));
    }
  };

  const changeMaterialProperties = (newProperties: typeof materialProperties) => {
    setMaterialProperties(newProperties);
    if (materialRef.current) {
      materialRef.current.metalness = newProperties.metalness;
      materialRef.current.roughness = newProperties.roughness;
      materialRef.current.clearcoat = newProperties.clearcoat;
      materialRef.current.clearcoatRoughness = newProperties.clearcoatRoughness;
      materialRef.current.reflectivity = newProperties.reflectivity;
      materialRef.current.ior = newProperties.ior;
      materialRef.current.transmission = newProperties.transmission;
      materialRef.current.thickness = newProperties.thickness;
      materialRef.current.opacity = newProperties.opacity;
      
      const isTransparent = newProperties.opacity < 1.0 || newProperties.transmission > 0.0;
      materialRef.current.transparent = isTransparent;
      materialRef.current.depthWrite = !isTransparent;
      
      if (modelRef.current) {
        modelRef.current.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.renderOrder = isTransparent ? 1 : 0;
          }
        });
      }
      
      materialRef.current.needsUpdate = true;
    }
  };

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffe6ce);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.001,
      1000
    );
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      powerPreference: "high-performance" 
    });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.shadowMap.autoUpdate = true;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    
    renderer.sortObjects = true;
    rendererRef.current = renderer;
    mountRef.current.appendChild(renderer.domElement);

    const handleMouseDown = (event: MouseEvent) => {
      isDragging.current = true;
      previousMouse.current = { x: event.clientX, y: event.clientY };
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (!isDragging.current || !modelRef.current) return;

      const deltaX = event.clientX - previousMouse.current.x;
      const deltaY = event.clientY - previousMouse.current.y;

      modelRef.current.rotation.y += deltaX * rotationSpeed;
      
      modelRef.current.rotation.x += deltaY * rotationSpeed;

      previousMouse.current = { x: event.clientX, y: event.clientY };
    };    const handleMouseUp = () => {
      isDragging.current = false;
    };

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();
      
      const zoomDelta = event.deltaY * zoomSpeed * 0.001;
      camera.position.z = Math.max(0.001, Math.min(50, camera.position.z + zoomDelta));
    };

    renderer.domElement.addEventListener('mousedown', handleMouseDown);
    renderer.domElement.addEventListener('mousemove', handleMouseMove);
    renderer.domElement.addEventListener('mouseup', handleMouseUp);
    renderer.domElement.addEventListener('wheel', handleWheel);

    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 10, 5);
    directionalLight.castShadow = true;

    directionalLight.shadow.mapSize.width = 4096;
    directionalLight.shadow.mapSize.height = 4096;
    directionalLight.shadow.camera.near = 0.1;
    directionalLight.shadow.camera.far = 50;
    directionalLight.shadow.camera.left = -10;
    directionalLight.shadow.camera.right = 10;
    directionalLight.shadow.camera.top = 10;
    directionalLight.shadow.camera.bottom = -10;
    directionalLight.shadow.bias = -0.0001;
    directionalLight.shadow.normalBias = 0.02;
    directionalLight.shadow.radius = 4;
    scene.add(directionalLight);

    const groundGeometry = new THREE.PlaneGeometry(20, 20);
    const groundMaterial = new THREE.ShadowMaterial({ 
      opacity: 0.3,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -2;
    ground.receiveShadow = true;
    ground.renderOrder = -1;
    scene.add(ground);

    const fillLight = new THREE.DirectionalLight(0xffffff, 0.3);
    fillLight.position.set(-5, 5, -5);
    scene.add(fillLight);

    const loader = new GLTFLoader();

    const modelUrl = '/saint benedict medal.gltf';
    
    setLoadingStatus('Loading 3D model...');
    
    loader.load(
      modelUrl,
      (gltf) => {
        const model = gltf.scene;
        
        const plasticMaterial = new THREE.MeshPhysicalMaterial({
          color: new THREE.Color(selectedColor),
          metalness: materialProperties.metalness,
          roughness: materialProperties.roughness,
          clearcoat: materialProperties.clearcoat,
          clearcoatRoughness: materialProperties.clearcoatRoughness,
          reflectivity: materialProperties.reflectivity,
          ior: materialProperties.ior,
          transmission: materialProperties.transmission,
          thickness: materialProperties.thickness,
          opacity: materialProperties.opacity,
          transparent: materialProperties.opacity < 1.0 || materialProperties.transmission > 0.0,
          side: THREE.DoubleSide,
          alphaTest: 0.001,
          depthWrite: materialProperties.opacity >= 1.0 && materialProperties.transmission === 0.0, // Controlar depth writing
        });
        
        materialRef.current = plasticMaterial;

        model.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            child.material = plasticMaterial;
            
            if (child.geometry) {
              child.geometry.computeVertexNormals();
            }
            
            const isTransparent = materialProperties.opacity < 1.0 || materialProperties.transmission > 0.0;
            child.renderOrder = isTransparent ? 1 : 0;
          }
        });
        
        model.scale.setScalar(1);
        model.position.set(0, 0, 0);
        
        model.rotation.x = -Math.PI / 2;
        model.rotation.y = 0;
        model.rotation.z = 0;
        
        const modelGroup = new THREE.Group();
        modelGroup.add(model);
        
        scene.add(modelGroup);
        modelRef.current = modelGroup;
        setIsLoading(false);
        setLoadingStatus('Model loaded successfully!');
        
        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3()).length();
        const center = box.getCenter(new THREE.Vector3());
        
        model.position.sub(center);
        
        camera.position.set(0, 0, size * 2);
        camera.lookAt(0, 0, 0);
      },
      (progress) => {
        const percentComplete = (progress.loaded / progress.total) * 100;
        setLoadingStatus(`Loading: ${Math.round(percentComplete)}%`);
      },

      (error) => {
        console.error('Error loading 3D model:', error);
        setLoadingStatus('Error loading model. Using fallback cube...');
        
        const geometry = new THREE.BoxGeometry(2, 2, 2);
        const material = new THREE.MeshLambertMaterial({ color: 0x6c5ce7 });
        const cube = new THREE.Mesh(geometry, material);
        cube.castShadow = true;
        cube.receiveShadow = true;
        scene.add(cube);
        
        setIsLoading(false);
      }
    );

    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);
      
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!mountRef.current || !rendererRef.current) return;
      
      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;
      
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      
      rendererRef.current.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      
      if (rendererRef.current) {
        rendererRef.current.domElement.removeEventListener('mousedown', handleMouseDown);
        rendererRef.current.domElement.removeEventListener('mousemove', handleMouseMove);
        rendererRef.current.domElement.removeEventListener('mouseup', handleMouseUp);
        rendererRef.current.domElement.removeEventListener('wheel', handleWheel);
      }
      
      if (rendererRef.current && mountRef.current) {
        mountRef.current.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      }
      
      if (sceneRef.current) {
        sceneRef.current.clear();
      }
    };
  }, []);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', minHeight: '90vh' }}>
      <ColorMenu 
        selectedColor={selectedColor} 
        onColorChange={changeColor} 
      />
      
      <MaterialMenu 
        materialProperties={materialProperties} 
        onPropertiesChange={changeMaterialProperties} 
      />

      <div 
        ref={mountRef} 
        style={{ 
          width: '100%', 
          height: '100%',
          minHeight: '90vh',
          borderRadius: '10px',
          overflow: 'hidden'
        }} 
      />
      {isLoading && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          color: 'white',
          padding: '20px',
          borderRadius: '10px',
          textAlign: 'center',
          zIndex: 1000
        }}>
          <div>{loadingStatus}</div>
          <div style={{ marginTop: '10px', fontSize: '12px', opacity: '0.8' }}>
            Loading 3D model...
          </div>
        </div>
      )}
    </div>
  );
};

export default ThreeViewer;