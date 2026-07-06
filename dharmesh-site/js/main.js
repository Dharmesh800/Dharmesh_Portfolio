// Dharmesh K Edits — interactions

// Mobile menu
const menuBtn = document.getElementById('menuBtn');
const navLinks = document.getElementById('navLinks');
if (menuBtn && navLinks) {
  menuBtn.addEventListener('click', () => navLinks.classList.toggle('open'));
}

// Video gradients
const gradients = [
  'linear-gradient(135deg,#1a1a2e,#16213e 50%,#ff6b00)',
  'linear-gradient(135deg,#2d1810,#4a1c1c 50%,#ff6b00)',
  'linear-gradient(135deg,#0f1f3a,#1a3a5c 50%,#ff8c42)',
  'linear-gradient(135deg,#1a0f2e,#2d1a4a 50%,#ff6b00)',
  'linear-gradient(135deg,#2e1a0f,#4a2a1a 50%,#ff9933)',
  'linear-gradient(135deg,#0f2e1a,#1a4a2d 50%,#ff6b00)',
  'linear-gradient(135deg,#2e0f1a,#4a1a2d 50%,#ff6b00)',
  'linear-gradient(135deg,#1a1a1a,#2d2d2d 50%,#ff6b00)',
];

function videoCardHTML(cat, title, i) {
  const g = gradients[i % gradients.length];
  return `<div class="video-card" data-cat="${cat.toLowerCase()}">
    <div class="bg" style="background:${g}"></div>
    <div class="overlay"></div>
    <div class="play">▶</div>
    <div class="meta"><div class="cat">${cat}</div><div class="title">${title}</div></div>
  </div>`;
}

// Home featured grid
const homeGrid = document.getElementById('videoGrid');
if (homeGrid) {
  const featured = [
    ['Hotels','Luxury Resort Brand Film'],
    ['Music','Indie Music Video — "Sunset"'],
    ['Commercials','Product Launch Ad'],
    ['Restaurants','Fine Dining Story'],
    ['Podcasts','Long-Form Interview Cut'],
    ['Reels','Fashion Reel Series'],
  ];
  homeGrid.innerHTML = featured.map((f,i)=>videoCardHTML(f[0],f[1],i)).join('');
}

// Portfolio grid + filter
const portfolioGrid = document.getElementById('portfolioGrid');
if (portfolioGrid) {
  const projects = [
    ['hotels','Hotels','Taj Palace — Brand Reel'],
    ['hotels','Hotels','Marwar Retreat Film'],
    ['restaurants','Restaurants','Kaya Bistro Story'],
    ['restaurants','Restaurants','Street Food Series'],
    ['podcasts','Podcasts','Founders Podcast E12'],
    ['podcasts','Podcasts','Culture Talk Highlights'],
    ['commercials','Commercials','SkinCare Product Launch'],
    ['commercials','Commercials','Auto Brand TVC'],
    ['music','Music Videos','"Sunset" — Music Video'],
    ['music','Music Videos','Live Session Cut'],
    ['reels','Reels','Fashion Reel Pack'],
    ['reels','Reels','Fitness Coach Shorts'],
    ['docs','Documentaries','Artisans of Jodhpur'],
    ['docs','Documentaries','Desert Voices — Short Doc'],
  ];
  portfolioGrid.innerHTML = projects.map((p,i)=>videoCardHTML(p[1],p[2],i).replace('data-cat="'+p[1].toLowerCase()+'"','data-cat="'+p[0]+'"')).join('');

  const chips = document.querySelectorAll('#filters .chip');
  chips.forEach(c => c.addEventListener('click', () => {
    chips.forEach(x=>x.classList.remove('active'));
    c.classList.add('active');
    const f = c.dataset.filter;
    portfolioGrid.querySelectorAll('.video-card').forEach(card => {
      card.style.display = (f==='all' || card.dataset.cat===f) ? '' : 'none';
    });
  }));
}

// Contact form
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    document.getElementById('formStatus').textContent = '✓ Thanks! I\'ll reply within 24 hours.';
    form.reset();
  });
}
