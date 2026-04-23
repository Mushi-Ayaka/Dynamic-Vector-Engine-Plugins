const fs = require('fs');
const path = require('path');

const registryPath = 'c:/Users/Josue B/Desktop/Josue B/Documents/Jonatan Baron/Proyectos/Dynamic-Vector-Engine-Plugins/registry.json';
const registry = JSON.parse(fs.readFileSync(registryPath, 'utf8'));

const debugPlugin = {
  "id": "infra-diagnostic",
  "name": "🚨 DIAGNÓSTICO DE INFRAESTRUCTURA",
  "description": "Plugin ultra-simple para verificar si el motor puede renderizar color y texto sin capas complejas.",
  "version": "1.0.0",
  "author": "Antigravity Debugger",
  "updatedAt": new Date().toISOString(),
  "files": {
    "manifest": {
      "id": "infra-diagnostic",
      "name": "🚨 DIAGNÓSTICO DE INFRAESTRUCTURA",
      "description": "Plugin para descartar errores de renderizado.",
      "version": "1.0.0",
      "author": "Antigravity",
      "presets": ["motion"],
      "schema": [
        {
          "id": "testText",
          "type": "string",
          "label": "Texto de Test",
          "defaultValue": "INFRAESTRUCTURA OK"
        }
      ]
    },
    "html": "<div id=\"diag-root\" style=\"width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background-color: #ff0000; color: white; font-family: sans-serif;\">\n  <h1 id=\"diag-text\" style=\"font-size: 120px; border: 10px solid white; padding: 40px;\">ESPERANDO JS...</h1>\n</div>",
    "css": "",
    "js": "dvEngine.register({\n    awake: (ctx) => {\n        console.log('[DIAG] Awake fired');\n        ctx.refs.text = ctx.root.getElementById('diag-text');\n    },\n    update: (ctx) => {\n        if (ctx.refs.text) {\n            ctx.refs.text.innerText = ctx.props.testText || 'JS WORKING';\n            ctx.refs.text.style.transform = `rotate(${ctx.frame % 360}deg)`;\n        }\n    }\n});"
  }
};

// Insertar al principio para visibilidad rápida
registry.plugins.unshift(debugPlugin);

fs.writeFileSync(registryPath, JSON.stringify(registry, null, 2));
console.log('✅ Plugin de diagnóstico inyectado correctamente en el registro.');
