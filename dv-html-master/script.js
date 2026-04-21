dvEngine.register({
  awake: (ctx) => {
    ctx._el = {
      root: ctx.root.getElementById('master-root'),
      style: ctx.root.getElementById('master-dynamic-style'),
      pane: ctx.root.getElementById('master-render-pane')
    };
    
    if (ctx._el.root) {
        ctx._el.root.style.width = '1920px';
        ctx._el.root.style.height = '1080px';
        ctx._el.root.style.position = 'absolute';
    }
    
    if (ctx._el.pane) {
        ctx._el.pane.style.width = '100%';
        ctx._el.pane.style.height = '100%';
    }
    
    ctx._lastHtml = "";
    ctx._lastCss = "";
  },
  
  update: (ctx) => {
    const { props, _el } = ctx;
    if (!_el.pane || !_el.style) return;

    // Inyectar CSS dinámico (solo si cambia para optimizar)
    const currentCss = props.cssCode || '';
    if (ctx._lastCss !== currentCss) {
        _el.style.textContent = currentCss;
        ctx._lastCss = currentCss;
    }

    // Inyectar HTML dinámico
    const currentHtml = props.htmlCode || '';
    if (ctx._lastHtml !== currentHtml) {
        _el.pane.innerHTML = currentHtml;
        ctx._lastHtml = currentHtml;
    }
    
    // Inyectar color de acento de presets
    const headerColor = props.brandPrimaryColor || '#E44C30';
    if (_el.root) {
        _el.root.style.setProperty('--accent', headerColor);
    }
  }
});
