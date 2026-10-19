(() => {
  const hdr = document.getElementById('hdr');
  const menu = document.getElementById('menu');
  const burger = document.getElementById('burger');
  const trailer = document.getElementById('trailer');
  let scrolled = false, menuOpen = false;

  const paint = () => hdr.classList.toggle('solid', scrolled || menuOpen);
  const setMenu = open => {
    menuOpen = open;
    menu.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open);
    paint();
  };
  const setTrailer = open => trailer.classList.toggle('open', open);

  window.addEventListener('scroll', () => { scrolled = window.scrollY > 40; paint(); }, { passive: true });
  burger.addEventListener('click', () => setMenu(!menuOpen));
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));
  window.addEventListener('resize', () => { if (window.innerWidth >= 820 && menuOpen) setMenu(false); });

  document.getElementById('openTrailer').addEventListener('click', () => setTrailer(true));
  document.getElementById('closeTrailer').addEventListener('click', () => setTrailer(false));
  trailer.addEventListener('click', e => { if (e.target === trailer) setTrailer(false); });
  window.addEventListener('keydown', e => { if (e.key === 'Escape') { setTrailer(false); setMenu(false); } });

  // Running camcorder timecode on the hero
  const tc = document.getElementById('timecode');
  let secs = 2 * 3600 + 47 * 60 + 19;
  const pad = n => String(n).padStart(2, '0');
  setInterval(() => {
    secs++;
    tc.textContent = `NIGHT 01 · ${pad(Math.floor(secs / 3600) % 24)}:${pad(Math.floor(secs / 60) % 60)}:${pad(secs % 60)}`;
  }, 1000);

  // Camcorder tape glitch: short bursts of torn slices and chroma split at random intervals, per headline
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const rand = (min, max) => min + Math.random() * (max - min);
    document.querySelectorAll('.glitch').forEach(glitch => {
      const slice = (k) => {
        const top = rand(0, 85);
        glitch.style.setProperty(`--${k}-top`, `${top}%`);
        glitch.style.setProperty(`--${k}-bot`, `${Math.max(0, 100 - top - rand(4, 22))}%`);
        glitch.style.setProperty(`--${k}-dx`, `${rand(-18, 18)}px`);
      };
      const frame = (left) => {
        slice('a'); slice('b');
        glitch.style.setProperty('--dx', `${rand(-6, 6)}px`);
        glitch.style.setProperty('--skew', `${rand(-4, 4)}deg`);
        glitch.style.setProperty('--split', `${rand(3, 12)}px`);
        if (left > 0) setTimeout(() => frame(left - 1), rand(40, 90));
        else { glitch.classList.remove('is-glitching'); setTimeout(burst, rand(1800, 5200)); }
      };
      const burst = () => { glitch.classList.add('is-glitching'); frame(Math.round(rand(3, 9))); };
      setTimeout(burst, rand(800, 2400));
    });
  }

  // Character cards: open the case file when its polaroid is hovered, close it once the pointer leaves the card
  const castGrid = document.querySelector('.cast-grid');
  if (castGrid && matchMedia('(hover: hover)').matches) {
    castGrid.classList.add('js-reveal');
    castGrid.querySelectorAll('.file').forEach(file => {
      file.querySelector('.polaroid').addEventListener('mouseenter', () => file.classList.add('is-open'));
      file.addEventListener('mouseleave', () => file.classList.remove('is-open'));
    });
  }

  scrolled = window.scrollY > 40; paint();
})();
