let groups = {
  exoplanets: [113, 112, 111, 110, 109, 108, 107, ],
  airplane_geometry: [106, 103, 102, 101, 98, 97, 96, 95, 94, 93, 90, 89, ],
  pillars: [91, 86, 73, 71, 70, 69, 48, 45, 40, 38, ],
  space_colonization: [77, 60, 57, 56, 55, 51, ],
  flash_flooding: [75, 74, 72, 50, 49, 47, 43, 39, ],
  universe: [85, 82, 81, 79, 68, 67, ],
  patterns: [64, 63, 62, 61, 44, 42, 41, ]
};
let nogroup; // posts without a group

// Newest to oldest
let colorOrder = [ 'exoplanets', 'airplane_geometry', 'pillars', 'space_colonization', 'flash_flooding', 'universe', 'patterns' ];


let sat = 90;
let lit = 50;

Math.seedrandom(2);
let colors = colorOrder.reduce((acc, val, idx) => {
  let hue = Math.random() * 360;
  acc[val] = `hsl(${hue.toFixed(2)}, ${sat}%, ${lit}%)`;
  return acc;
}, []);


let showHideTime = 600;
let overlayTime = 600;
let resizeTime = 1200;

let transitionTime = {
  chrome: 1200
};


let p, n; // posts + number of posts


function init() {
  // Add styles
  $('body').prepend(`
    <style>
      .post-num {
        position:absolute; bottom:0; right:0; background:black; color:white; padding:16px; font-size:32px; display:none;
      }
      .overlay { 
        position:absolute; top:0; left:0; width:100%; height:100%; background-color:#000; opacity:0.3; display:none;
      }
      .post { transition: filter 0.5s; }
      .post.dim { filter: grayscale(100%) blur(5px) opacity(10%); }
      .post-container[style] { flex-direction:row !important; flex-wrap:wrap; justify-content:space-between; }
      .post { margin:0; margin-bottom:2.994652406%; flex-shrink:0; flex-grow:0; width:31.3368984%; }
      body, html { background-color:#fafafa; }
    </style>
  `);
  
  // post elements
  p = $('._mck9w').addClass('post').unwrap();
  n = p.length;
  console.log(n + ' posts'); // output number of posts
  
  // Add post number data attribute (oldest = 1)
  p.attr('data-num', (i) => {
    return n - i;
  });
  p.css('position', 'relative');
  
  // overlay div
  p.append('<div class="overlay"></div>');
  
  // post number div
  p.append((i) => {
    return '<div class="post-num">' + (n-i) + '</div>';
  });
  
  setGlobals();
  
  nogroup = Array.from( Object.values(groups).reduce((acc, grp) => {
    console.log(grp);
    grp.forEach( n => acc.delete(n) );
    return acc;
  }, new Set(allNums())) );
}

$( () => init() ); // run initalization on page load


// Keyboard handler
$(document).on('keydown', (e) => {
  if (e.key == 'n' || e.key == 'N') { // show hide post numbering
    let shown = $('.post-num').eq(0).is(":visible");
    if (!shown) $('.post-num').fadeIn(100);
    else $('.post-num').fadeOut(100);
  } 
  
  else if (e.keyCode == 9) { // TAB .. toggle chrome
    toggleChrome();
    e.preventDefault();
  }
  
  else if (e.key == 'f' || e.key == 'F') { // f .. fullscreen
    if (!document.webkitFullscreenElement) {
      document.querySelector('html').webkitRequestFullscreen();
    } else { document.webkitExitFullscreen(); }
  }
  
  else if (e.key == 'c' || e.key == 'C') { toggleColorize(); }
  
  else if (e.key == '0') { resizeAll(1); }
  else if (e.key == '1') { resizeAll(0.24); }
  else if (e.key == '2') { resizeAll(0.48); }
  
});

function invertNums(arr) {
  let out = [];
  for (let i=1; i<=n; i++) { if ( !arr.includes(i) ) out.push(i); }
  return out;
}
function allNums() { return invertNums([]); }
function getPost(i) { return $(`[data-num=${i}]`); }

function show(arr, time=showHideTime) { arr.forEach(i => getPost(i).show(time)); }
function showAll() { show(allNums()); }
function hide(arr, time=showHideTime) { arr.forEach(i => getPost(i).hide(time)); }

function dim(arr) { arr.forEach(i => getPost(i).addClass('dim')); }
function undim(arr) { arr.forEach(i => getPost(i).removeClass('dim')); }
function undimAll() { undim(allNums()); }

function highlight(arr) { undim(arr); dim(invertNums(arr)); }

function overlay(arr, color='#000', opacity=0.5, time=overlayTime) { 
  arr.forEach(i => {
    let overlay = getPost(i).find('.overlay');
    if (overlay.css('display') == 'none') overlay.css({'opacity':0, 'display':'flex'});
    overlay.animate( {'backgroundColor':color, 'opacity':opacity}, time );
  }); 
}
function rmOverlay(arr, time=overlayTime) {
  arr.forEach(i => {
    getPost(i).find('.overlay').fadeOut(time);
  }); 
}
function rmOverlayAll() { rmOverlay(allNums()); }

function resizeAll(size=1, time=resizeTime) {
  // calc sizing (size=1: 293/935 total, 28 margin)
  let row_width = 935;
  let w = 293 * size; // post width in px
  let per_row = Math.floor(935/w); // how many per row ?
  let m = (row_width - per_row*w) / (per_row-1); // margin in px
  let n_last = n % per_row; // number of posts in last row
  let n_filler = per_row - n_last;
  // console.log(n_last, n_filler);
  $('.post.filler').remove();
  let html = '<div class="post filler"></div>'.repeat(n_filler);
  console.log(html);
  $('.post-container').append( html );
  $('.post').stop().animate({
    width: w/row_width*100 + '%',
    marginBottom: m/row_width*100 + '%'
  }, resizeTime);
  // $('.post').css({
  //   width: w/row_width*100 + '%',
  //   marginBottom: m/row_width*100 + '%'
  // });
}

let chromeVisible = true;

function hideChrome(time=transitionTime.chrome) {
  // header, overlay buttons (video, multiple pics), footer, account info
  $('nav._68u16, ._lxd52, footer, header._mainc').stop()
    .css('pointerEvents', 'none')
    .animate( {opacity:0}, time/3*2, () => {
      $('body').stop().animate({'marginTop': -290}, time/3);
    });
  chromeVisible = false;
}

function showChrome(time=transitionTime.chrome) {
  console.log(time);
  $('body').stop().animate( {'marginTop': 0}, time/3, () => {
    // header, overlay buttons (video, multiple pics), footer, account info
    $('nav._68u16, ._lxd52, footer, header._mainc').stop()
      .animate({opacity:1}, time/3*2)
      .css('pointerEvents', 'auto');
  });
  chromeVisible = true;
}

function toggleChrome(time=transitionTime.chrome) {
  if (chromeVisible) { hideChrome(time); }
  else { showChrome(time); }
}

let groupsColorized = false;
function colorizeGroups() {
  // overlay(nogroup, '#fff', 0.9);
  dim(nogroup);
  for (let groupName of Object.keys(groups)) {
    console.log(colors[groupName]);
    overlay(groups[groupName], colors[groupName], 0.7);
  }
  groupsColorized = true;
}

function uncolorizeGroups() {
  rmOverlayAll();
  undimAll();
  groupsColorized = false;
}

function toggleColorize() {
  if (!groupsColorized) colorizeGroups();
  else uncolorizeGroups();
}


// Add functions to global scope for testing
function setGlobals() {
  window.invertNums = invertNums;
  window.allNums = allNums;
  window.getPost = getPost;
  
  window.show = show;
  window.showAll = showAll;
  window.hide = hide;
  window.dim = dim;
  window.undim = undim;
  window.undimAll = undimAll;
  window.highlight = highlight;
  window.overlay = overlay;
  window.rmOverlay = rmOverlay;
  window.rmOverlayAll = rmOverlayAll;
  window.resizeAll = resizeAll;
  window.hideChrome = hideChrome;
  window.showChrome = showChrome;
  window.toggleChrome = toggleChrome;
}
