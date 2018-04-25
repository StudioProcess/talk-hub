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

let project = {
  exoplanets: [113, 112, 111, 110, 109, 108, 107, ],
  airplane_geometry: [106, 103, 102, 101, 98, 97, 96, 95, 94, 93, 90, 89, ],
  pillars: [91, 86, 73, 71, 70, 69, 48, 45, 40, 38, ],
  space_colonization: [77, 60, 57, 56, 55, 51, ],
  flash_flooding: [75, 74, 72, 50, 49, 47, 43, 39, ],
  universe: [85, 82, 81, 79, 68, 67, ],
  patterns: [64, 63, 62, 61, 44, 42, 41, ],
  
  other: [87, 88, 99, 100, 76, 104, 105, 37, 46, 59, 58, 66], // not used in presentation
};
let noproject; // posts without a project

// let unused_projects = { // not used in presentation
//   mak: [87, 88, 99, 100],
//   brupa: [76],
//   waves: [104, 105],
// };

let categories = {
  commercial: [37, 46, 58, 59, 66], // add all from project in init() // 76, 87, 88, 99, 100, 104, 105
  comm_used: [37, 38, 46, 48, 50, 59, 66, 67, 68, 76, 81, 85, 104, 105, 108],
  event_promo: [53, 54, 65, 78, 80, 83, 92, 114, 115, 116 ],
  other: [52, 84]
};

let categoryColors = {
  commercial: '#f59090',
  comm_used: '#ff3838',
  event_promo: '#594190',
  other: '#349a3f'
};

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

let projectColors = {
  exoplanets: '#2551a7',
  airplane_geometry: '#1a1f39',
  pillars: '#9ce0eb',
  space_colonization: '#689e86',
  flash_flooding: '#8b689e',
  universe: '#fd717a',
  patterns: '#f2d390',
  other: '#e8e8e8'
};

let hues = {
  year1: 200,
  year2: 10,
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
  
  // fill categories
  Object.keys(project).forEach(projectName => {
    categories.commercial = categories.commercial.concat(project[projectName]);
  });
  
  // load post data
  d = await fetch('posts.json').then(res => res.json());
  
  setGlobals();
  
  noproject = Array.from( Object.values(project).reduce((acc, grp) => {
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
  
  // else if (e.keyCode == 39) { focusNext(); } // right arrow
  // else if (e.keyCode == 37) { focusPrev(); } // left arrow
  else if (e.keyCode == 39) { nextState(); } // right arrow
  else if (e.keyCode == 37) { prevState(); } // left arrow
  
  else if (e.key == 'm' || e.key == 'M') { colorizeByMonth(); }
  else if (e.key == 'l' || e.key == 'L') { colorizeLastYear(); }
  else if (e.key == 'r' || e.key == 'R') { testState(); }
});

function resolveAfter(time) {
  return new Promise(resolve => {
    setTimeout(resolve, time);
  });
}

function invertNums(arr) {
  let out = [];
  for (let i=1; i<=n; i++) { if ( !arr.includes(i) ) out.push(i); }
  return out;
}
function allNums() { return invertNums([]); }
function numsFrom(num) {
  let out = [];
  for (let i=num; i<=n; i++) { out.push(i); }
  return out;
}
function dedupe(nums) { return Array.from(new Set(nums)); }
function getPost(i) { return $(`[data-num=${i}]`); }

// find group name for post number
function getGroup(i) {
  for (let projectName of Object.keys(project)) {
    if ( project[projectName].includes(i) ) return projectName;
  }
  return undefined;
}

function show(arr, time=transitionTime.showHide) { dedupe(arr).forEach(i => getPost(i).show(time)); }
function showAll() { show(allNums()); }
function hide(arr, time=transitionTime.showHide) { dedupe(arr).forEach(i => getPost(i).hide(time)); }

function dim(arr, time=transitionTime.dim) {
  dedupe(arr).forEach(i => getPost(i).css('transitionDuration', time+'ms').addClass('dim'));
  return resolveAfter(time);
}
function undim(arr, time=transitionTime.dim) { 
  dedupe(arr).forEach(i => getPost(i).css('transitionDuration', time+'ms').removeClass('dim'));
  return resolveAfter(time);
}
function undimAll(time=transitionTime.dim) { undim(allNums(), time); return resolveAfter(time); }

function highlight(arr, time=transitionTime.dim) { undim(arr, time); dim(invertNums(arr), time); return resolveAfter(time); }

function overlay(arr, color='#000', opacity=0.5, time=transitionTime.overlay) {
  let overlay;
  dedupe(arr).forEach(i => {
    overlay = getPost(i).find('.overlay');
    if (overlay.css('display') == 'none') overlay.css({'opacity':0, 'display':'flex'});
    overlay.stop().animate( {'backgroundColor':color, 'opacity':opacity}, time );
  });
  return overlay ? overlay.promise() : Promise.resolve(); // Resolves when animation finishes
}
function rmOverlay(arr, time=transitionTime.overlay) {
  let overlay;
  dedupe(arr).forEach(i => {
    overlay = getPost(i).find('.overlay');
    overlay.stop().fadeOut(time);
  });
  return overlay ? overlay.promise() : Promise.resolve();
}
function rmOverlayAll(time=transitionTime.overlay) { return rmOverlay(allNums(), time); }

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
  let promises = [];
  dedupe(nums).forEach(i => {
    let projectName = getGroup(i);
    let p = overlay([i], projectColors[projectName], colorizeOpacity);
    promises.push(p);
  });
  return Promise.all(promises);
}

function uncolorize(nums) {
  return rmOverlay(nums);
}

let focused = false; // some elements are focused or colorized
function colorizeProjects() {
  // overlay(noproject, '#fff', 0.9);
  let promises = [];
  let p = dim(noproject); promises.push(p);
  for (let projectName of Object.keys(project)) {
    // console.log(projectColors[projectName]);
    let q = undim(project[projectName]);
    let r = overlay(project[projectName], projectColors[projectName], colorizeOpacity);
    promises.push(q, r);
  }
  focused = true;
  return Promise.all(promises);
}

function uncolorizeAll() {
  let p = undimAll();
  let q = rmOverlayAll();
  focused = false;
  return Promise.all([p, q]);
}

function toggleColorize() {
  if (!focused) colorizeProjects();
  else uncolorizeAll();
}

let focusedGroup = -1;
let focusedState = 2; // 0..focus group with color, 1..focus group without color, 2..colorize none, 3..colorize all

function focusProject(grpNum, withColor = false) {
  let nums = dedupe( project[order[grpNum]] );
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
    focusProject(focusedGroup, true);
  } else if (focusedState == 1) {
    focusProject(focusedGroup, false);
  } else if (focusedState == 2) {
    uncolorizeAll();
  } else if (focusedState == 3) {
    colorizeProjects();
  }
}

function focusPrev() { focusNext(-1); }

let sorted = false;
function sort() {
  scramble(() => {
    let first = [];
    order.forEach((projectName, i) => {
      dedupe(project[projectName]).forEach(num => {
        getPost(num).css('order', i-order.length);
      });
      first = first.concat(project[projectName]);
    });
    dedupe(project['other']).forEach(num => {
      getPost(num).css('order', 0);
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
  Object.keys(project).forEach(projectName => {
    let href = 'appswitch://keynote?slide=' + keynoteSlides[projectName];
    project[projectName].forEach(num => {
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

function hsl(hue, sat=100, lig=50) { return `hsl(${hue}, ${sat}%, ${lig}%)`;}
function shade(shade, shades=10, hue=0, sat=100, narrow=20 ) {
  let lig = narrow + (shade/(shades-1))*(100-narrow*2);
  return hsl(hue, sat, lig);
}

function colorizeByMonth(nums = allNums()) {
  nums = dedupe(nums);
  let promises = [];
  let p = undim(nums); promises.push(p);
  nums.forEach(num => {
    let date = new Date(d[num].taken_at_timestamp * 1000);
    // console.log(num, date);
    // year 2 starts april 2017
    let month = date.getMonth()-3 + (date.getFullYear()-2017)*12; // so year2 has month >= 0
    // if (date.getFullYear() > 2017 || (date.getFullYear() == 2017 && date.getMonth() >= 3)) {
    let q;
    if (month >= 0) {
      // year 2
      // console.log(month);
      // overlay([num], hsl(hues.year2), colorizeOpacity);
      q = overlay([num], shade(month, 13, hues.year2), colorizeOpacity);
    } else {
      // year 1
      // console.log(month);
      // -month-1
      // overlay([num], hsl(hues.year1), colorizeOpacity);
      q = overlay([num], shade(month+18, 18, hues.year1), colorizeOpacity);
    }
    promises.push(q);
  });
  let r = uncolorize(invertNums(nums));
  promises.push(r);
  focused = true;
  return Promise.all(promises);
}

function colorizeLastYear() {
  let last = numsFrom(37);
  let p = colorizeByMonth(last);
  let q = dim(invertNums(last));
  
  return Promise.all([p, q]).then(() => {
    return rmOverlay(last);
  });
}

function colorizeCategories() {
  let promises = [];
  promises.push( uncolorizeAll() );
  let colored = [];
  Object.keys(categories).filter(c => c != 'comm_used').forEach(c => {
    let p = overlay(categories[c], categoryColors[c], colorizeOpacity);
    promises.push(p);
    colored = colored.concat(categories[c]);
  });
  promises.push( dim(invertNums(colored)) );
  return Promise.all(promises);
}

function colorizeCommercial() {
  let p = uncolorizeAll();
  let nums = categories['commercial'];
  let q = overlay(nums, categoryColors['commercial'], colorizeOpacity);
  let r = dim(invertNums(nums));
  
  return Promise.all([p, q, r]).then(() => {
    return rmOverlay(nums);
  });
}

function colorizeCommUsed() {
  let p = uncolorizeAll();
  // rmOverlay(categories['commercial']);
  let q = overlay(categories['comm_used'], categoryColors['comm_used'], colorizeOpacity);
  let r = dim(invertNums( categories['comm_used'].concat(categories['commercial']) ));
  return Promise.all([p, q, r]);
}

function randomFocus() {
  allNums().forEach(i => {
    overlay([i], '#ff0000', 0.95);
    if (Math.random() < 0.5) dim([i]); else undim([i]);
  });
}

function testState() {
  randomFocus();
  setState(state);
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
  window.colorizeCategories = colorizeCategories;
  window.colorizeCommercial = colorizeCommercial;
  window.colorizeCommUsed = colorizeCommUsed;
  
  window.focusProject = focusProject;
  
  window.sort = sort;
  window.unsort = unsort;
  
  window.setLinks = setLinks;
  window.unsetLinks = unsetLinks;
}

function logState() {
  console.log('state: ', state);
}

// This sets only focus/colorization (not size)
let state = 0;
let numStates = 7;
function setState(num) {
  switch (num) {
  
  case 0:
    uncolorizeAll().then(logState);
    break;
  
  case 1:
    colorizeByMonth().then(logState);
    break;
  
  case 2:
    colorizeLastYear().then(logState);
    break;
  
  case 3:
    colorizeCategories().then(logState);
    break;
  
  case 4:
    colorizeCommercial().then(logState);
    break;
  
  case 5:
    colorizeCommUsed().then(logState);
    break;
  
  case 6:
    colorizeProjects().then(logState);
    break;
        
  default:
    console.warn('unknown state');
    break;
  }
  
  console.log(" going to state " + state + "/" + (numStates-1));
}

function nextState(delta = 1) {
  state += delta;
  if (state >= numStates) {
    state %= numStates;
  } else if (state < 0) {
    state = state % numStates + numStates;
  }
  setState(state);
}

function prevState() {
  nextState(-1);
}
