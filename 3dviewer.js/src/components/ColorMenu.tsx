'use client';

import { useState, useEffect } from 'react';

interface ColorOption {
  color: string;
}

interface ColorMenuProps {
  selectedColor: string;
  onColorChange: (color: string) => void;
}

interface RGBColor {
  r: number;
  g: number;
  b: number;
}

const ColorMenu = ({ selectedColor, onColorChange }: ColorMenuProps) => {
  const [showMenu, setShowMenu] = useState<boolean>(false);

  const hexToRgb = (hex: string): RGBColor => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
  };

  const [rgbColor, setRgbColor] = useState<RGBColor>(() => hexToRgb(selectedColor));

  const rgbToHex = (r: number, g: number, b: number): string => {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  };

  useEffect(() => {
    const newRgb = hexToRgb(selectedColor);
    setRgbColor(newRgb);
  }, [selectedColor]);

  const updateColorFromRGB = (newRgb: RGBColor) => {
    setRgbColor(newRgb);
    const hexColor = rgbToHex(newRgb.r, newRgb.g, newRgb.b);
    onColorChange(hexColor);
  };

  const predefinedColors: ColorOption[] = [
    { color: '#4a90e2' },
    { color: '#e74c3c' },
    { color: '#2ecc71' },
    { color: '#f39c12' },
    { color: '#9b59b6' },
    { color: '#e91e63' },
    { color: '#f1c40f' },
    { color: '#95a5a6' },
    { color: '#2c3e50' },
    { color: '#ecf0f1' },
  ];

  return (
    <>
      <button
        onClick={() => setShowMenu(!showMenu)}
        style={{
          position: 'absolute',
          top: '20px',
          right: '30px',
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
        🎨
      </button>

      {showMenu && (
        <div style={{
          position: 'absolute',
          top: '0',
          right: '0',
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
          <h3 style={{ margin: '0 0 20px 0', color: '#333', fontSize: '18px' }}>
            Cor do Objeto
          </h3>
          
          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ margin: '0 0 15px 0', color: '#666', fontSize: '14px'}}>
              Cores Predefinidas:
            </h4>
            <div style={{ 
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '10px',
              padding: '0 10px'
            }}>
              {predefinedColors.map((colorOption) => (
                <button
                  key={colorOption.color}
                  onClick={() => onColorChange(colorOption.color)}
                  style={{
                    width: '60px',
                    height: '60px',
                    backgroundColor: colorOption.color,
                    border: selectedColor === colorOption.color ? '3px solid #333' : '1px solid #ddd',
                    borderRadius: '50%',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: selectedColor === colorOption.color 
                      ? '0 4px 12px rgba(0, 0, 0, 0.3)' 
                      : '0 2px 6px rgba(0, 0, 0, 0.1)',
                    transform: selectedColor === colorOption.color ? 'scale(1.1)' : 'scale(1)',
                  }}
                />
              ))}
            </div>
          </div>

          <div>
            <h4 style={{ margin: '0 0 15px 0', color: '#666', fontSize: '14px' }}>
              Cor Personalizada:
            </h4>
            
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              marginBottom: '20px'
            }}>
              <div style={{
                width: '80px',
                height: '80px',
                backgroundColor: selectedColor,
                borderRadius: '50%',
                border: '3px solid #ddd',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative'
              }}>
                <div style={{
                  position: 'absolute',
                  bottom: '-25px',
                  fontSize: '11px',
                  color: '#666',
                  fontWeight: 'bold',
                  backgroundColor: 'white',
                  padding: '2px 6px',
                  borderRadius: '3px',
                  border: '1px solid #ddd'
                }}>
                  {selectedColor.toUpperCase()}
                </div>
              </div>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <div style={{ marginBottom: '12px' }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginBottom: '5px'
                }}>
                  <label style={{ color: '#e74c3c', fontWeight: 'bold', fontSize: '12px' }}>
                    R
                  </label>
                  <input
                    type="number"
                    value={rgbColor.r.toString()}
                    onChange={(e) => updateColorFromRGB({
                      ...rgbColor,
                      r: Math.max(0, Math.min(255, parseInt(e.target.value) || 0))
                    })}
                    style={{
                      width: '50px',
                      padding: '2px 4px',
                      border: '1px solid #ddd',
                      borderRadius: '3px',
                      fontSize: '12px',
                      color: '#333'
                    }}
                    min="0"
                    max="255"
                  />
                </div>
                <input
                  type="range"
                  min="0"
                  max="255"
                  value={rgbColor.r}
                  onChange={(e) => updateColorFromRGB({
                    ...rgbColor,
                    r: parseInt(e.target.value)
                  })}
                  style={{
                    width: '100%',
                    accentColor: '#e74c3c'
                  }}
                />
              </div>

              <div style={{ marginBottom: '12px' }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginBottom: '5px'
                }}>
                  <label style={{ color: '#2ecc71', fontWeight: 'bold', fontSize: '12px' }}>
                    G
                  </label>
                  <input
                    type="number"
                    value={rgbColor.g.toString()}
                    onChange={(e) => updateColorFromRGB({
                      ...rgbColor,
                      g: Math.max(0, Math.min(255, parseInt(e.target.value) || 0))
                    })}
                    style={{
                      width: '50px',
                      padding: '2px 4px',
                      border: '1px solid #ddd',
                      borderRadius: '3px',
                      fontSize: '12px',
                      color: '#333'
                    }}
                    min="0"
                    max="255"
                  />
                </div>
                <input
                  type="range"
                  min="0"
                  max="255"
                  value={rgbColor.g}
                  onChange={(e) => updateColorFromRGB({
                    ...rgbColor,
                    g: parseInt(e.target.value)
                  })}
                  style={{
                    width: '100%',
                    accentColor: '#2ecc71'
                  }}
                />
              </div>

              <div style={{ marginBottom: '12px' }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginBottom: '5px'
                }}>
                  <label style={{ color: '#3498db', fontWeight: 'bold', fontSize: '12px' }}>
                    B
                  </label>
                  <input
                    type="number"
                    value={rgbColor.b.toString()}
                    onChange={(e) => updateColorFromRGB({
                      ...rgbColor,
                      b: Math.max(0, Math.min(255, parseInt(e.target.value) || 0))
                    })}
                    style={{
                      width: '50px',
                      padding: '2px 4px',
                      border: '1px solid #ddd',
                      borderRadius: '3px',
                      fontSize: '12px',
                      color: '#333'
                    }}
                    min="0"
                    max="255"
                  />
                </div>
                <input
                  type="range"
                  min="0"
                  max="255"
                  value={rgbColor.b}
                  onChange={(e) => updateColorFromRGB({
                    ...rgbColor,
                    b: parseInt(e.target.value)
                  })}
                  style={{
                    width: '100%',
                    accentColor: '#3498db'
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ColorMenu;