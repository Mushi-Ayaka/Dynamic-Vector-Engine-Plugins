dvEngine.register({
  awake: (ctx) => {},
  start: (ctx) => {},
  
  update: (ctx) => {
    const { frame, root, props, utils, env } = ctx;
    
    // Referencias DOM (Optimización: Podrían capturarse en awake en un caso ideal)
    const container = root.getElementById('plugin-container');
    const line = root.getElementById('accent-line');
    const title = root.getElementById('title-text');
    const subtitle = root.getElementById('subtitle-text');
    const glow = root.getElementById('glow-bg');

    if (!container || !line || !title || !subtitle) return;

    // 1. Enlace de Datos Reactivos v3.4 (con fallback a campos predeterminados si faltan en preset)
    title.innerText = props.title || props.brandName || 'Ana García';
    subtitle.innerText = props.subtitle || props.brandSlogan || 'Directora';
    
    // Inyectar el Color de Marca desde el Preset al Entorno Global CSS del plugin
    container.style.setProperty('--accent', props.brandPrimaryColor || '#E44C30');

    // 2. Animación Parametrizada por el Entorno
    // Obtener la duración dinámica desde el plugin "motion" o usar 200 frames por defecto
    const totalFrames = (ctx.settings && ctx.settings.duration * ctx.settings.fps) || 200;

    // Animación de Entrada
    const lineProgress = utils.clamp(frame / 20, 0, 1);
    line.style.transform = `scaleX(${utils.easeOutCubic(lineProgress)})`;

    const titleT = utils.clamp((frame - 5) / 10, 0, 1);
    title.style.opacity = titleT.toString();
    title.style.transform = `translateY(${utils.lerp(20, 0, utils.easeOutCubic(titleT))}px)`;

    const subT = utils.clamp((frame - 10) / 10, 0, 1);
    subtitle.style.opacity = subT.toString();
    subtitle.style.transform = `translateY(${utils.lerp(20, 0, utils.easeOutCubic(subT))}px)`;

    // 3. Salida dinámica basada en el tiempo real
    const framesDeSalida = 15;
    const outT = utils.clamp((frame - (totalFrames - framesDeSalida)) / framesDeSalida, 0, 1);
    container.style.opacity = (1 - utils.easeOutCubic(outT)).toString();

    // 4. Optimización de Rendering con env.isExporting
    if (env.isExporting && glow) {
        // En algunos casos deshabilitar el filter/blur global mejora el tiempo de render 
        glow.style.backdropFilter = 'none';
        glow.style.background = 'rgba(0,0,0,0.8)'; // Fallback sólido oscuro
    }
  }
});