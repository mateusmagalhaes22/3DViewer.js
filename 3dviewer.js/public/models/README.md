# Como usar seus próprios modelos 3D

## Formatos suportados e recomendações:

### 1. **GLB/GLTF (Recomendado)**
- **Vantagens**: Padrão da indústria, suporta animações, materiais PBR, texturas
- **Uso**: Ideal para modelos complexos com materiais avançados
- **Exportação**: Blender, 3ds Max, Maya, Cinema 4D

### 2. **FBX**
- **Vantagens**: Muito usado em pipelines profissionais
- **Uso**: Bom para modelos com animações complexas
- **Exportação**: Autodesk Maya, 3ds Max, Blender

### 3. **OBJ**
- **Vantagens**: Simples, amplamente suportado
- **Limitações**: Não suporta animações ou materiais complexos
- **Uso**: Ideal para modelos estáticos simples

## Como usar seus modelos:

### Opção 1: Modelos locais
1. Coloque seu arquivo 3D na pasta `public/models/`
2. No ThreeViewer.tsx, altere a linha:
```javascript
const modelUrl = '/models/seu-modelo.glb';
```

### Opção 2: Modelos online
Use URLs diretas:
```javascript
const modelUrl = 'https://exemplo.com/modelo.glb';
```

## Loaders disponíveis no Three.js:

- `GLTFLoader` - Para arquivos .gltf/.glb
- `FBXLoader` - Para arquivos .fbx
- `OBJLoader` - Para arquivos .obj
- `STLLoader` - Para arquivos .stl
- `PLYLoader` - Para arquivos .ply

## Exemplo de troca de loader:

```javascript
// Para arquivos FBX
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
const loader = new FBXLoader();

// Para arquivos OBJ
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
const loader = new OBJLoader();
```

## Onde encontrar modelos 3D gratuitos:

- **Sketchfab** (sketchfab.com) - Muitos modelos gratuitos
- **Free3D** (free3d.com)
- **TurboSquid** (turbosquid.com) - Tem seção gratuita
- **OpenGameArt** (opengameart.org)
- **Three.js Examples** (threejs.org/examples) - Modelos de teste

## Dicas de otimização:

1. **Tamanho do arquivo**: Mantenha abaixo de 10MB quando possível
2. **Resolução de texturas**: Use 1024x1024 ou 2048x2048 no máximo
3. **Contagem de polígonos**: Para web, mantenha abaixo de 100k triângulos
4. **Formato GLB**: É comprimido e carrega mais rápido que GLTF