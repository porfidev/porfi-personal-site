let lastScroll = window.scrollY;
const threshold = 20;
const menu = document.querySelector('.float-menu');

const onScroll = () => {
  const currentScroll = window.scrollY;
  const diff = currentScroll - lastScroll;

  if(Math.abs(diff) < threshold) {
    return;
  }

  if(!menu) {
    return;
  }

  menu.classList.toggle('float-menu--hide', diff > 0);
  menu.classList.toggle('float-menu--show', diff < 0);

  lastScroll = currentScroll;
}

window.addEventListener('scroll', onScroll, { passive: true })
