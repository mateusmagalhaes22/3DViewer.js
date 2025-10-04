'use client';

import { useState } from 'react';

interface MaterialProperties {
  metalness: number;
  roughness: number;
  clearcoat: number;
  clearcoatRoughness: number;
  reflectivity: number;
  ior: number;
  transmission: number;
  thickness: number;
  opacity: number;
}

interface MaterialMenuProps {
  materialProperties: MaterialProperties;
  onPropertiesChange: (properties: MaterialProperties) => void;
}

const MaterialMenu = ({ materialProperties, onPropertiesChange }: MaterialMenuProps) => {
  const [showMenu, setShowMenu] = useState<boolean>(false);

  const updateProperty = (property: keyof MaterialProperties, value: number) => {
    const newProperties = {
      ...materialProperties,
      [property]: value
    };
    onPropertiesChange(newProperties);
  };

  const propertyConfig = [
    {
      key: 'opacity' as keyof MaterialProperties,
      label: 'Transparência',
      min: 0,
      max: 1,
      step: 0.01,
      color: '#3498db',
      description: 'Opacidade do material'
    },
    {
      key: 'metalness' as keyof MaterialProperties,
      label: 'Metalicidade',
      min: 0,
      max: 1,
      step: 0.01,
      color: '#95a5a6',
      description: 'Quão metálico é o material'
    },
    {
      key: 'roughness' as keyof MaterialProperties,
      label: 'Rugosidade',
      min: 0,
      max: 1,
      step: 0.01,
      color: '#e67e22',
      description: 'Rugosidade da superfície'
    },
    {
      key: 'reflectivity' as keyof MaterialProperties,
      label: 'Reflexividade',
      min: 0,
      max: 1,
      step: 0.01,
      color: '#f39c12',
      description: 'Capacidade de reflexão'
    },
    {
      key: 'clearcoat' as keyof MaterialProperties,
      label: 'Verniz',
      min: 0,
      max: 1,
      step: 0.01,
      color: '#9b59b6',
      description: 'Camada de verniz'
    },
    {
      key: 'clearcoatRoughness' as keyof MaterialProperties,
      label: 'Rugosidade Verniz',
      min: 0,
      max: 1,
      step: 0.01,
      color: '#8e44ad',
      description: 'Rugosidade do verniz'
    },
    {
      key: 'ior' as keyof MaterialProperties,
      label: 'Índice Refração',
      min: 1,
      max: 3,
      step: 0.01,
      color: '#2ecc71',
      description: 'Índice de refração'
    },
    {
      key: 'transmission' as keyof MaterialProperties,
      label: 'Transmissão',
      min: 0,
      max: 1,
      step: 0.01,
      color: '#1abc9c',
      description: 'Transparência do material'
    },
    {
      key: 'thickness' as keyof MaterialProperties,
      label: 'Espessura',
      min: 0,
      max: 5,
      step: 0.1,
      color: '#e74c3c',
      description: 'Espessura do material'
    }
  ];

  return (
    <>
      <button
        onClick={() => setShowMenu(!showMenu)}
        style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          zIndex: 1001,
          padding: '10px 15px',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '14px'
        }}
      >
        ⚙️
      </button>

      {showMenu && (
        <div style={{
          position: 'absolute',
          top: '0',
          left: '0',
          width: '250px',
          backgroundColor: 'rgba(255, 255, 255, 0.67)',
          backdropFilter: 'blur(10px)',
          padding: '20px',
          boxSizing: 'border-box',
          zIndex: 1000,
          overflowY: 'auto',
          borderRadius: '10px',
          boxShadow: '-5px 0 15px rgba(0, 0, 0, 0.1)',
          margin: '10px',
        }}>
          <h3 style={{ margin: '0 0 20px 0', color: '#333', fontSize: '18px', textAlign: 'right' }}>
            Propriedades
          </h3>
          
          <div>
            {propertyConfig.map((prop) => (
              <div key={prop.key} style={{ marginBottom: '20px' }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginBottom: '8px'
                }}>
                  <label style={{ 
                    color: prop.color, 
                    fontWeight: 'bold', 
                    fontSize: '13px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}>
                    {prop.label}
                  </label>
                  <input
                    type="number"
                    value={materialProperties[prop.key].toFixed(2)}
                    onChange={(e) => updateProperty(
                      prop.key, 
                      Math.max(prop.min, Math.min(prop.max, parseFloat(e.target.value) || prop.min))
                    )}
                    style={{
                      width: '60px',
                      padding: '3px 6px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '12px',
                      textAlign: 'center',
                      color: '#333'
                    }}
                    min={prop.min}
                    max={prop.max}
                    step={prop.step}
                  />
                </div>

                <input
                  type="range"
                  min={prop.min}
                  max={prop.max}
                  step={prop.step}
                  value={materialProperties[prop.key]}
                  onChange={(e) => updateProperty(prop.key, parseFloat(e.target.value))}
                  style={{
                    width: '100%',
                    accentColor: prop.color,
                    marginBottom: '5px'
                  }}
                />

                <div style={{ 
                  fontSize: '11px', 
                  color: '#888',
                  fontStyle: 'italic'
                }}>
                  {prop.description}
                </div>
              </div>
            ))}
          </div>

          <div style={{ 
            marginTop: '25px',
            paddingTop: '20px',
            borderTop: '1px solid #eee'
          }}>
            <h4 style={{ margin: '0 0 15px 0', color: '#666', fontSize: '14px', textAlign: 'center' }}>
              Presets de Material:
            </h4>
            <div style={{ 
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}>
              {[
                {
                  name: 'Plástico Padrão',
                  props: { metalness: 0.0, roughness: 0.2, clearcoat: 1.0, clearcoatRoughness: 0.1, reflectivity: 0.8, ior: 1.5, transmission: 0.0, thickness: 0.5, opacity: 1.0 }
                },
                {
                  name: 'Metal Polido',
                  props: { metalness: 1.0, roughness: 0.1, clearcoat: 0.0, clearcoatRoughness: 0.0, reflectivity: 1.0, ior: 1.5, transmission: 0.0, thickness: 0.5, opacity: 1.0 }
                },
                {
                  name: 'Vidro',
                  props: { metalness: 0.0, roughness: 0.0, clearcoat: 1.0, clearcoatRoughness: 0.0, reflectivity: 0.9, ior: 1.5, transmission: 0.95, thickness: 1.0, opacity: 0.1 }
                },
                {
                  name: 'Borracha',
                  props: { metalness: 0.0, roughness: 0.9, clearcoat: 0.0, clearcoatRoughness: 0.0, reflectivity: 0.1, ior: 1.5, transmission: 0.0, thickness: 0.5, opacity: 1.0 }
                }
              ].map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => onPropertiesChange(preset.props)}
                  style={{
                    padding: '8px 12px',
                    backgroundColor: '#f8f9fa',
                    border: '1px solid #dee2e6',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    color: '#495057',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#e9ecef';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#f8f9fa';
                  }}
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MaterialMenu;