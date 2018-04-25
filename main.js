let transitionTime = {
  showHide: 600,
  overlay: 1000,
  dim: 1000,
  resize: 1200,
  chrome: 1200,
  scramble: 1000,
};

let colorizeOpacity = 0.85;
let followerCount = 1617;

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
let order = [ 'exoplanets', 'airplane_geometry', 'pillars', 'space_colonization', 'flash_flooding', 'universe', 'patterns' ];

let keynoteSlides = {
  exoplanets: 4,
  airplane_geometry: 18,
  pillars: 34,
  space_colonization: 53,
  flash_flooding: 62,
  universe: 78,
  patterns: 87,
};

let colors = {
  exoplanets: '#2551a7',
  airplane_geometry: '#1a1f39',
  pillars: '#9ce0eb',
  space_colonization: '#689e86',
  flash_flooding: '#787878',
  universe: '#fd717a',
  patterns: '#f2d390',
};

let p, n; // posts + number of posts
let d; // post data (hash indexed by post num);


async function init() {
  // Add styles
  $('body').prepend(`
    <style>
      .post-num {
        position:absolute; bottom:0; right:0; background:black; color:white; padding:16px; font-size:32px; display:none;
        transform-origin: bottom right;
      }
      ._lxd52 { transform-origin: top right; } /* overlay symbols */
      .overlay { 
        position:absolute; top:0; left:0; width:100%; height:100%; background-color:#000; opacity:0.3; display:none;
        pointer-events:none;
      }
      .post { transition: filter 0.5s; }
      .post a { display:block; pointer-events:none; }
      .post.dim { filter: grayscale(100%) blur(5px) opacity(10%); }
      .post-container[style] { flex-direction:row !important; flex-wrap:wrap; justify-content:space-between; }
      .post { margin:0; margin-bottom:2.994652406%; flex-shrink:0; flex-grow:0; width:31.3368984%; }
      .post.filler { order:9999; }
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
  
  // load post data
  d = await fetch('posts.json').then(res => res.json());
  console.log(d);
  
  setGlobals();
  
  nogroup = Array.from( Object.values(groups).reduce((acc, grp) => {
    // console.log(grp);
    grp.forEach( n => acc.delete(n) );
    return acc;
  }, new Set(allNums())) );
  
  setLinks();
  
  setFollowerCount();
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
  
  else if (e.key == '0' || e.key == '3') { resizeAll(1); }
  else if (e.key == '1') { resizeAll(0.24); }
  else if (e.key == '2') { resizeAll(0.48); }
  
  else if (e.key == 's' || e.key == 'S') { toggleSort(); }
  
  else if (e.keyCode == 39) { focusNext(); } // right arrow
  else if (e.keyCode == 37) { focusPrev(); } // left arrow
  
});

function invertNums(arr) {
  let out = [];
  for (let i=1; i<=n; i++) { if ( !arr.includes(i) ) out.push(i); }
  return out;
}
function allNums() { return invertNums([]); }
function getPost(i) { return $(`[data-num=${i}]`); }

// find group name for post number
function getGroup(i) {
  for (let groupName of Object.keys(groups)) {
    if ( groups[groupName].includes(i) ) return groupName;
  }
  return undefined;
}

function show(arr, time=transitionTime.showHide) { arr.forEach(i => getPost(i).show(time)); }
function showAll() { show(allNums()); }
function hide(arr, time=transitionTime.showHide) { arr.forEach(i => getPost(i).hide(time)); }

function dim(arr, time=transitionTime.dim) { arr.forEach(i => getPost(i).css('transitionDuration', time+'ms').addClass('dim')); }
function undim(arr, time=transitionTime.dim) { arr.forEach(i => getPost(i).css('transitionDuration', time+'ms').removeClass('dim')); }
function undimAll(time=transitionTime.dim) { undim(allNums(), time); }

function highlight(arr) { undim(arr); dim(invertNums(arr)); }

function overlay(arr, color='#000', opacity=0.5, time=transitionTime.overlay) { 
  arr.forEach(i => {
    let overlay = getPost(i).find('.overlay');
    if (overlay.css('display') == 'none') overlay.css({'opacity':0, 'display':'flex'});
    overlay.animate( {'backgroundColor':color, 'opacity':opacity}, time );
  }); 
}
function rmOverlay(arr, time=transitionTime.overlay) {
  arr.forEach(i => {
    getPost(i).find('.overlay').fadeOut(time);
  }); 
}
function rmOverlayAll() { rmOverlay(allNums()); }

function resizeAll(size=1, time=transitionTime.resize) {
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
  // console.log(html);
  $('.post-container').append( html );
  $('.post').stop().animate({
    width: w/row_width*100 + '%',
    marginBottom: m/row_width*100 + '%'
  }, time);
  $('.post-num, ._lxd52').css({'transform': `scale(${size})`});
  
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
  // console.log(time);
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

// Add color overlay according to group membership
function colorize(nums) {
  nums.forEach(i => {
    let groupName = getGroup(i);
    overlay([i], colors[groupName], colorizeOpacity);
  });
}

function uncolorize(nums) {
  rmOverlay(nums);
}

let focused = false; // some elements are focused or colorized
function colorizeGroups() {
  // overlay(nogroup, '#fff', 0.9);
  dim(nogroup);
  for (let groupName of Object.keys(groups)) {
    // console.log(colors[groupName]);
    undim(groups[groupName]);
    overlay(groups[groupName], colors[groupName], colorizeOpacity);
  }
  focused = true;
}

function uncolorizeGroups() {
  rmOverlayAll();
  undimAll();
  focused = false;
}

function toggleColorize() {
  if (!focused) colorizeGroups();
  else uncolorizeGroups();
}

let focusedGroup = -1;
let focusedState = 2; // 0..focus group with color, 1..focus group without color, 2..colorize none, 3..colorize all

function focusGroup(grpNum, withColor = false) {
  let nums = groups[order[grpNum]];
  let others = invertNums(nums);
  undim(nums);
  if (withColor) colorize(nums); else uncolorize(nums);
  dim(others);
  uncolorize(others);
  focused = true;
  focusedGroup = grpNum;
}

function focusNext(stateOffset = 1) {
  // change state
  focusedState += stateOffset;
  if (focusedState >= 4) {
    focusedGroup++;
    if (focusedGroup >= order.length) focusedGroup %= order.length;
    focusedState %= 4;
  } else if (focusedState < 0) {
    focusedGroup--;
    if (focusedGroup < 0) focusedGroup = focusedGroup % order.length + order.length;
    focusedState = focusedState % 4 + 4;
  }
  
  console.log(focusedGroup, focusedState);
  
  if (focusedState == 0) {
    focusGroup(focusedGroup, true);
  } else if (focusedState == 1) {
    focusGroup(focusedGroup, false);
  } else if (focusedState == 2) {
    uncolorizeGroups();
  } else if (focusedState == 3) {
    colorizeGroups();
  }
}

function focusPrev() { focusNext(-1); }


let sorted = false;
function sort() {
  scramble(() => {
    order.forEach((groupName, i) => {
      groups[groupName].forEach(num => {
        getPost(num).css('order', i-order.length);
      });
    });
  });
  sorted = true;
}

function unsort() {
  scramble(() => {
    $('.post').css('order',0);
  });
  sorted = false;
}

function toggleSort() {
  if (!sorted) sort();
  else unsort();
}

function scramble(cb, time=transitionTime.scramble) {
  let fps = 30;
  let int = 1000/fps;
  let total = Math.floor(time/int);
  let i = 0;
  
  let x = setInterval(() => {
    $('.post').each((i, el) => {
      let rnd = Math.floor(Math.random()*n);
      // console.log(el, rnd);
      $(el).css( 'order', rnd );
    });
    if (i++ >= total) {
      clearInterval(x);
      if (cb) cb();
    }
  }, int);
}

// set links to keynote
function setLinks() {
  $('.post a').css('pointerEvents', 'none'); // deactivate all links
  // set group links
  Object.keys(groups).forEach(groupName => {
    let href = 'appswitch://keynote?slide=' + keynoteSlides[groupName];
    groups[groupName].forEach(num => {
      let a = getPost(num).find('a');
      a.attr('data-href-orig', a.attr('href'));
      a.attr('href', href);
      a.css('pointerEvents', 'auto'); // activate link
    });
  });
}

function unsetLinks() {
  $('.post a').each((i, el) => {
    let a = $(el);
    a.css('pointerEvents', ''); // return to default state
    let href = a.attr('data-href-orig');
    if (href) a.attr('href', href);
  });
}

function setFollowerCount() {
  let num = followerCount.toLocaleString('en');
  $('.follower-count').attr('title', num).text(num);
  
  let $meta = $('meta[name=description]');
  let desc = $meta.attr('content').replace('1,596', num);
  $meta.attr('content', desc);
  $('meta[property="og:description"]').attr('content', desc);
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
  
  window.colorize = colorize;
  window.uncolorize = uncolorize;
  
  window.focusGroup = focusGroup;
  
  window.sort = sort;
  window.unsort = unsort;
  
  window.setLinks = setLinks;
  window.unsetLinks = unsetLinks;
}
