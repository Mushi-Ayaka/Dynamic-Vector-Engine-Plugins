// [v4.1.5] Lower Third Basic — Frame-Math determinista, DOM cacheado en awake
dvEngine.register({
  awake: (ctx) => {
    ctx.refs.container = ctx.root.getElementById('plugin-container');
    ctx.refs.line      = ctx.root.getElementById('accent-line');
    ctx.refs.title     = ctx.root.getElementById('title-text');
    ctx.refs.subtitle  = ctx.root.getElementById('subtitle-text');
    ctx.refs.glow      = ctx.root.getElementById('glow-bg');
  },

  update: (ctx) => {
    const { frame, refs, props, utils, env, timeline } = ctx;
    const { container, line, title, subtitle, glow } = refs;
    if (!container || !line || !title || !subtitle) return;

    // 1. Datos Reactivos
    title.innerText    = props.title    || 'Ana García';
    subtitle.innerText = props.subtitle || 'Directora de Producto';
    container.style.setProperty('--accent', props.brandPrimaryColor || '#E44C30');

    // 2. Animación de Entrada via introProgress
    const ip = utils.clamp(timeline.introProgress, 0, 1);

    // Línea de acento: escala desde la izquierda
    line.style.transform = `scaleX(${utils.easeOutCubic(ip)})`;

    // Título: desliza desde abajo con retraso leve
    const titleP = utils.clamp((ip - 0.1) / 0.9, 0, 1);
    title.style.opacity   = titleP.toString();
    title.style.transform = `translateY(${utils.lerp(25, 0, utils.easeOutCubic(titleP))}px)`;

    // Subtítulo: aparece después del título
    const subP = utils.clamp((ip - 0.25) / 0.75, 0, 1);
    subtitle.style.opacity   = subP.toString();
    subtitle.style.transform = `translateY(${utils.lerp(20, 0, utils.easeOutCubic(subP))}px)`;

    // 3. Salida via outroProgress
    if (timeline.isOutro) {
      const op = utils.clamp(timeline.outroProgress, 0, 1);
      container.style.opacity   = (1 - utils.easeInOutCubic(op)).toString();
      container.style.transform = `translateX(${utils.lerp(0, -30, utils.easeInOutCubic(op))}px)`;
    } else {
      container.style.opacity = '1';
    }

    // 4. Optimización para exportación
    if (env.isExporting && glow) {
      glow.style.backdropFilter = 'none';
      glow.style.background     = 'rgba(0,0,0,0.75)';
    }
  }
});