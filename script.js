const bag={};
function addItem(name,price){if(!bag[name])bag[name]={price,qty:0};bag[name].qty++;renderCart();toast(name+' added to your bag');}
function renderCart(){const items=Object.entries(bag).filter(([n,v])=>v.qty>0);const count=items.reduce((s,[n,v])=>s+v.qty,0);const total=items.reduce((s,[n,v])=>s+v.price*v.qty,0);document.getElementById('cart-count').textContent='('+count+')';document.getElementById('cart-total').textContent='₹'+total;document.getElementById('cart-items').innerHTML=items.length?items.map(([name,v])=>`<div class="cart-row"><div><b>${name}</b><small>₹${v.price} each</small></div><div class="qty"><button onclick="changeQty('${name.replace(/'/g,"\\'")}',-1)">−</button><b>${v.qty}</b><button onclick="changeQty('${name.replace(/'/g,"\\'")}',1)">+</button></div></div>`).join(''):'<div class="empty">Your bag is waiting for something delicious.</div>';}
function changeQty(name,d){bag[name].qty+=d;if(bag[name].qty<=0)delete bag[name];renderCart();}
function openCart(){document.getElementById('cart').classList.add('open')}
function closeCart(){document.getElementById('cart').classList.remove('open')}
function demoCheckout(){toast('Demo mode — connect ordering at launch');}
let toastTimer;function toast(msg){const t=document.getElementById('toast');t.textContent=msg;t.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.classList.remove('show'),2200)}
document.querySelectorAll('.filter').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('.filter').forEach(b=>b.classList.remove('active'));btn.classList.add('active');document.querySelectorAll('.dish').forEach(card=>card.style.display=btn.dataset.filter==='all'||card.dataset.category===btn.dataset.filter?'':'none')}));

// Reveal key sections as they enter the viewport.
document.addEventListener('DOMContentLoaded', () => {
  const revealTargets = document.querySelectorAll(
    '.intro-art, .intro > div:last-child, .feature, .section-head, .dish, .ambience-photo, .ambience-copy, .quote blockquote, .visit > div'
  );

  revealTargets.forEach((element) => element.classList.add('reveal-on-scroll'));

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -35px 0px' });

    revealTargets.forEach((element) => revealObserver.observe(element));
  } else {
    revealTargets.forEach((element) => element.classList.add('is-visible'));
  }
});


// Cinematic opening: browser policy requires a user gesture before audible playback.
document.addEventListener('DOMContentLoaded', () => {
  const intro = document.getElementById('intro-screen');
  const video = document.getElementById('intro-video');
  const start = document.getElementById('intro-start');
  const skip = document.getElementById('intro-skip');
  const site = document.getElementById('site-content');
  const progress = document.getElementById('intro-progress-bar');

  if (!intro || !video || !site) return;
  document.body.classList.add('intro-lock');

  let entered = false;
  const revealSite = () => {
    if (entered) return;
    entered = true;
    intro.classList.add('intro-exit');
    site.classList.add('site-visible');
    document.body.classList.remove('intro-lock');
    video.pause();
    window.setTimeout(() => intro.remove(), 1000);
  };

  start?.addEventListener('click', async () => {
    video.muted = false;
    video.volume = 1;
    intro.classList.add('is-playing');
    start.disabled = true;
    start.textContent = 'NOW PLAYING · KAKA CAFE';
    try {
      await video.play();
    } catch (error) {
      // If audio playback is blocked, let the visitor tap the video itself.
      start.disabled = false;
      start.textContent = 'TAP TO PLAY INTRO';
      video.controls = true;
    }
  });

  skip?.addEventListener('click', revealSite);
  video.addEventListener('timeupdate', () => {
    if (video.duration && Number.isFinite(video.duration)) {
      progress.style.width = `${(video.currentTime / video.duration) * 100}%`;
    }
  });
  video.addEventListener('ended', revealSite);
});
