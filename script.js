// ---- CUSTOM CURSOR ----
const cur = document.getElementById('cursor');
const trail = document.getElementById('cursor-trail');
let mx=0,my=0,tx=0,ty=0;
document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;cur.style.left=mx+'px';cur.style.top=my+'px';});
function animateTrail(){tx+=(mx-tx)*0.1;ty+=(my-ty)*0.1;trail.style.left=tx+'px';trail.style.top=ty+'px';requestAnimationFrame(animateTrail);}
animateTrail();
document.querySelectorAll('a,button,.project-card,.skill-card,.contact-info-card,.timeline-card').forEach(el=>{
  el.addEventListener('mouseenter',()=>{cur.classList.add('expanded');trail.classList.add('expanded');});
  el.addEventListener('mouseleave',()=>{cur.classList.remove('expanded');trail.classList.remove('expanded');});
});

// ---- BG CANVAS PARTICLES ----
const cv=document.getElementById('bg-canvas');
const cx=cv.getContext('2d');
function resize(){cv.width=window.innerWidth;cv.height=window.innerHeight;}
resize();window.addEventListener('resize',resize);
const pts=[];
for(let i=0;i<120;i++)pts.push({
  x:Math.random()*window.innerWidth,y:Math.random()*window.innerHeight,
  vx:(Math.random()-0.5)*0.3,vy:(Math.random()-0.5)*0.3,
  r:Math.random()*1.8+0.4,
  a:Math.random()*0.4+0.1,
});
function drawParticles(){
  cx.clearRect(0,0,cv.width,cv.height);
  pts.forEach(p=>{
    p.x+=p.vx;p.y+=p.vy;
    if(p.x<0)p.x=cv.width;if(p.x>cv.width)p.x=0;
    if(p.y<0)p.y=cv.height;if(p.y>cv.height)p.y=0;
    cx.beginPath();cx.arc(p.x,p.y,p.r,0,Math.PI*2);
    cx.fillStyle=`rgba(155,93,229,${p.a})`;cx.fill();
  });
  pts.forEach((p,i)=>{
    for(let j=i+1;j<pts.length;j++){
      const d=Math.hypot(p.x-pts[j].x,p.y-pts[j].y);
      if(d<120){cx.beginPath();cx.moveTo(p.x,p.y);cx.lineTo(pts[j].x,pts[j].y);
        cx.strokeStyle=`rgba(155,93,229,${0.12*(1-d/120)})`;cx.lineWidth=0.5;cx.stroke();}
    }
  });
  requestAnimationFrame(drawParticles);
}
drawParticles();

// ---- TYPEWRITER ----
const words=['Frontend Dev','UI Builder','Code Artist','Web Creator'];
let wi=0,ci=0,deleting=false;
const tw=document.getElementById('typewriter-target');
function typeLoop(){
  const w=words[wi];
  tw.textContent=deleting?w.substring(0,ci-1):w.substring(0,ci+1);
  ci=deleting?ci-1:ci+1;
  if(!deleting&&ci===w.length){setTimeout(()=>{deleting=true;typeLoop();},1600);return;}
  if(deleting&&ci===0){deleting=false;wi=(wi+1)%words.length;}
  setTimeout(typeLoop,deleting?50:90);
}
setTimeout(typeLoop,800);

// ---- NAVBAR SCROLL ----
const nav=document.getElementById('navbar');
window.addEventListener('scroll',()=>{
  nav.classList.toggle('scrolled',window.scrollY>50);
  document.getElementById('btt').classList.toggle('show',window.scrollY>600);
});

// ---- SMOOTH NAV ----
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click',e=>{
    e.preventDefault();
    const t=document.querySelector(a.getAttribute('href'));
    if(t)t.scrollIntoView({behavior:'smooth',block:'start'});
    document.getElementById('mobileMenu').classList.remove('open');
    document.getElementById('hamburger').classList.remove('open');
  });
});

// ---- ACTIVE NAV ----
const sections=document.querySelectorAll('section[id]');
const navAs=document.querySelectorAll('.nav-links a');
window.addEventListener('scroll',()=>{
  let cur='';
  sections.forEach(s=>{if(s.getBoundingClientRect().top<120)cur=s.id;});
  navAs.forEach(a=>{a.classList.toggle('active',a.getAttribute('href')==='#'+cur);});
},{passive:true});

// ---- HAMBURGER ----
document.getElementById('hamburger').addEventListener('click',function(){
  this.classList.toggle('open');
  document.getElementById('mobileMenu').classList.toggle('open');
});
document.querySelectorAll('.mob-link').forEach(a=>a.addEventListener('click',()=>{
  document.getElementById('mobileMenu').classList.remove('open');
  document.getElementById('hamburger').classList.remove('open');
}));

// ---- ACCORDION ----
document.querySelectorAll('.accordion-head').forEach(head=>{
  head.addEventListener('click',()=>{
    const item=head.parentElement;
    const body=item.querySelector('.accordion-body');
    const inner=item.querySelector('.accordion-body-inner');
    const isOpen=item.classList.contains('open');
    document.querySelectorAll('.accordion-item').forEach(i=>{
      i.classList.remove('open');
      i.querySelector('.accordion-body').style.maxHeight='0';
    });
    if(!isOpen){item.classList.add('open');body.style.maxHeight=inner.offsetHeight+32+'px';}
  });
});

// ---- SKILLS FILTER ----
document.querySelectorAll('.skills-categories button').forEach(btn=>{
  btn.addEventListener('click',function(){
    document.querySelectorAll('.skills-categories button').forEach(b=>b.classList.remove('active'));
    this.classList.add('active');
    const cat=this.dataset.cat;
    document.querySelectorAll('.skill-card').forEach(card=>{
      const show=cat==='all'||card.dataset.cat===cat;
      card.style.display=show?'block':'none';
    });
    if(window.AOS) AOS.refresh();
  });
});

// ---- PROJECT FILTER ----
document.querySelectorAll('.filter-btn').forEach(btn=>{
  btn.addEventListener('click',function(){
    document.querySelectorAll('.filter-btn').forEach(b=>b.classList.remove('active'));
    this.classList.add('active');
    const f=this.dataset.filter;
    document.querySelectorAll('.project-card').forEach(card=>{
      const tags=card.dataset.tags||'';
      card.style.opacity=f==='all'||tags.includes(f)?'1':'0.25';
      card.style.transform=f==='all'||tags.includes(f)?'none':'scale(0.97)';
    });
  });
});

// ---- INTERSECTION OBSERVER ----
const io=new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      e.target.classList.add('visible');
      // animate progress bars
      e.target.querySelectorAll('.progress-fill').forEach(bar=>{
        bar.style.width=bar.dataset.p+'%';
      });
      // animate counters
      e.target.querySelectorAll('[data-count]').forEach(el=>{
        const target=+el.dataset.count;
        let n=0;const step=Math.ceil(target/40);
        const t=setInterval(()=>{n+=step;if(n>=target){n=target;clearInterval(t);}el.textContent=n;},35);
      });
    }
  });
},{threshold:0.12});
document.querySelectorAll('.reveal,.skill-card,.project-card,.timeline-item').forEach(el=>io.observe(el));
// also observe progress bars
document.querySelectorAll('.skills-grid').forEach(el=>io.observe(el));

// ---- 3D TILT ON PROJECT CARDS ----
document.querySelectorAll('.project-card').forEach(card=>{
  card.addEventListener('mousemove',e=>{
    const r=card.getBoundingClientRect();
    const x=(e.clientX-r.left)/r.width-0.5;
    const y=(e.clientY-r.top)/r.height-0.5;
    card.style.transform=`perspective(800px) rotateY(${x*8}deg) rotateX(${-y*8}deg) translateY(-6px)`;
  });
  card.addEventListener('mouseleave',()=>{card.style.transform='';});
});

// ---- CONTACT FORM ----
document.getElementById('cForm').addEventListener('submit',e=>{
  e.preventDefault();
  document.getElementById('cForm').style.display='none';
  document.getElementById('formSuccess').style.display='block';
});

// ---- BACK TO TOP ----
document.getElementById('btt').addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));

// ---- MAGNETIC BUTTONS ----
document.querySelectorAll('.btn-primary,.btn-ghost').forEach(btn=>{
  btn.addEventListener('mousemove',e=>{
    const r=btn.getBoundingClientRect();
    const x=(e.clientX-r.left-r.width/2)*0.2;
    const y=(e.clientY-r.top-r.height/2)*0.2;
    btn.style.transform=`translate(${x}px,${y}px) translateY(-3px)`;
  });
  btn.addEventListener('mouseleave',()=>btn.style.transform='');
});

if(window.AOS){
  document.querySelectorAll('.skill-card').forEach(card=>card.setAttribute('data-aos','fade-up'));
  AOS.init({duration:650,once:true,mirror:false});
}
