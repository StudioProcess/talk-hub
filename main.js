let short = 0; // do short version? use order_short var to select projects
let followerCount = 4471;

let transitionTime = {
  showHide: 600,
  overlay: 1000,
  dim: 1000,
  resize: 2500,
  chrome: 1200,
  scramble: 1000,
};

let colorizeOpacity = 0.85;

let project = {
  interference: [113, 112, 111, 110, 109, 108, 107, 122, 123, 131, 136, 137, 138, 140, 141, 149, 152, 153, 160, 162, 163, 164, 182 ],
  airplane_geometry: [106, 103, 102, 101, 98, 97, 96, 95, 94, 93, 90, 89, 117, 124, 135, 142, 155, 157, 161, 179, 183 ],
  pillars: [91, 86, 73, 71, 70, 69, 48, 45, 40, 38, ],
  space_colonization: [77, 60, 57, 56, 55, 51, 126, 127, 159 ],
  flash_flooding: [75, 74, 72, 50, 49, 47, 43, 39, 121, 134, ],
  universe: [85, 82, 81, 79, 68, 67, ],
  patterns: [64, 63, 62, 61, 44, 42, 41, ],
  bubble_layout: [146,147,150,154,156,],
  uncanny_values: [166,167,168],
  rescaling_distances: [172,173,175],

  // not used in presentation – but shows up as "part of some project, rather than event/promo"
  other: [87, 88, 99, 100, 76, 104, 105, 37, 46, 59, 58, 66, 52, 84, 119, 125, 128, 129, 130, 132, 133, 139, 151, 176, 177, 184 ],
};
let noproject; // posts without a project

// let unused_projects = { // not used in presentation
//   mak: [87, 88, 99, 100],
//   brupa: [76],
//   waves: [104, 105],
// };

let categories = {
  commercial: [], // add all from project in init()
  comm_used: [37, 38, 46, 48, 50, 59, 66, 67, 68, 76, 81, 85, 104, 105, 108, 117, 119, 125, 128, 130, 139, 147, 150, 151, 166, 167, 168, 173, 175, 177], // actually used by the customer
  event_promo: [53, 54, 65, 78, 80, 83, 92, 114, 115, 116, 118, 120, 143, 144, 145, 148, 158, 165, 169, 170, 171, 174, 178, 180, 181, 185 ],
  other: []
};

let categoryColors = {
  commercial: '#f59090',
  comm_used: '#ff3838',
  event_promo: '#0562b9',
  other: '#349a3f'
};

// Newest to oldest
let order = [ 'rescaling_distances', 'flash_flooding', 'universe', 'bubble_layout', 'pillars', 'interference', 'airplane_geometry', 'uncanny_values', ]; // Forward 2019
// let order = [ 'universe', 'flash_flooding', 'pillars', 'interference', 'airplane_geometry',  'space_colonization', 'patterns' ]; // EDCH Munich
// let order = [ 'universe', 'airplane_geometry', 'pillars',  'space_colonization', 'flash_flooding', 'interference', 'patterns' ]; // NDU
// let order = [ 'flash_flooding', 'interference', 'airplane_geometry', 'pillars', 'space_colonization', 'universe', 'patterns' ]; // Creative Prism
// let order_short = [ 'airplane_geometry', 'flash_flooding', 'patterns' ]; // Forward Festival 2018
// let order_short = [ 'universe', 'flash_flooding', 'interference',   ]; // On Data and Design
let order_short = [ 'universe', 'flash_flooding', 'pillars', 'interference' ]; // EDCH Munich

// let keynoteSlides = { rescaling_distances: 0, flash_flooding: 20, universe: 5, vdw: 0, pillars: 38, interference: 60, airplane_geometry: 79, uncanny_values: 0, space_colonization: 97, patterns: 107 };

let projectColors = {
  rescaling_distances: '#C8F2FE',
  flash_flooding: '#4FB69C',
  universe: '#ff0000',
  bubble_layout: '#eb6d2f',
  pillars: '#4ED9FF',
  interference: '#2551a7',
  airplane_geometry: '#EF6BA0',
  uncanny_values: '#FEDF53',
  
  space_colonization: '#ada77e',
  patterns: '#afe76e',
  other: '#e8e8e8',
};

let hues = {
  year1: 200,
  year2: 10,
};

let p, n; // posts + number of posts
let d; // post data (hash indexed by post num);


async function init() {
  // load post html
  let post_html = await fetch('posts.html').then(res => res.text());
  $('#insert_posts').append(post_html);

  // Add styles
  $('body').prepend(`
    <style>
      .post-num {
        position:absolute; bottom:0; right:0; background:black; color:white; padding:16px; font-size:32px; display:none;
        transform-origin: bottom right;
      }
      .u7YqG { transform-origin: top right; } /* overlay symbols */
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
      .kM-aa canvas[style] {
        top: -4px !important;
        left: -4px !important;
        width: 83px !important;
        height: 83px !important;
        border: 1px solid #e6e6e6;
        border-radius: 50%;
      }
      .RR-M-.h5uC0 canvas {
        background-image: url('./index_files/ring.png');
        background-size: 100%;
      }
    </style>
  `);

  // post elements
  p = $('.v1Nh3').addClass('post').unwrap();

  $('.post img').attr('srcset', ''); // remove srcset attribute (external image links)
  // change image links to local
  $('.post img').each((idx, el) => {
    let src = $(el).attr('src');
    let filename = src.replace(/^.*[/]/, '');
    $(el).attr('src', './index_files/' + filename);
  });

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
  setPostCount();

  setupProjects();
}

$( () => init() ); // run initalization on page load


function setupProjects() {
  if (short) { order = order_short; }

  for ( let projName of  Object.keys(project).filter(n => n != 'other') ) {
    if (!order.includes(projName)) {
      project['other'] = project['other'].concat( project[projName] );
      delete project[projName];
    }
  }

  console.log(order, project);
}


// Keyboard handler
$(document).on('keydown', (e) => {
  if (e.key == 'n' || e.key == 'N' || e.keyCode == 32) { // N, SPACE .. show hide post numbering
    let shown = $('.post-num').eq(0).is(":visible");
    if (!shown) $('.post-num').fadeIn(100);
    else $('.post-num').fadeOut(100);
    e.preventDefault();
  }

  else if (e.keyCode == 9 || e.keyCode == 13) { // TAB, ENTER .. toggle chrome
    toggleChrome();
    e.preventDefault();
  }

  else if (e.key == 'f' || e.key == 'F') { // F .. fullscreen
    if (!document.webkitFullscreenElement) {
      document.querySelector('html').webkitRequestFullscreen();
    }
    // else { document.webkitExitFullscreen(); }
  }

  else if (e.key == 'c' || e.key == 'C') { toggleColorize(); }

  else if (e.key == '0' || e.key == '3') { resizeAll(1); }
  else if (e.key == '1') { resizeAll(0.23); }
  else if (e.key == '2') { resizeAll(0.48); }

  else if (e.key == 's' || e.key == 'S') { toggleSort(); }

  // else if (e.keyCode == 39) { focusNext(); } // right arrow
  // else if (e.keyCode == 37) { focusPrev(); } // left arrow
  else if (e.keyCode == 39) { nextState(); } // right arrow
  else if (e.keyCode == 37) { prevState(); } // left arrow

  else if (e.keyCode == 40) { nextSize(); e.preventDefault(); } // down arrow
  else if (e.keyCode == 38) { prevSize(); e.preventDefault(); } // up arrow

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
function subtract(fromArray, these) {
  return fromArray.filter(x => !these.includes(x));
}

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
  // .u7YqG .. Video button
  $('.post-num, .u7YqG').css({'transform': `scale(${size})`});

  // $('.post').css({
  //   width: w/row_width*100 + '%',
  //   marginBottom: m/row_width*100 + '%'
  // });
}


let currentSize = 0; // 0..normal, 1..medium, 2..small
let numSizes = 3;
function setSize(size) {
  if (size >= numSizes) {
    size %= numSizes;
  } else if (size < 0) {
    size = size % numSizes + numSizes;
  }
  switch (size) {
  case 0: resizeAll(1); break;
  case 1: resizeAll(0.24); break;
  case 2: resizeAll(0.48); break;
  }
  currentSize = size;
  console.log('size: ' + currentSize);
}

function nextSize(delta = 1) {
  setSize(currentSize + delta);
}
function prevSize() { nextSize(-1); }


let chromeVisible = true;
function hideChrome(time=transitionTime.chrome) {
  // header, overlay buttons (video, multiple pics), footer, account info
  $('nav, header, footer, ._4bSq7, .fx7hk').stop()
    .css('pointerEvents', 'none')
    .animate( {opacity:0}, time/3*2, () => {
      $('body').stop().animate({'marginTop': -535}, time/1.5);
    });
  chromeVisible = false;
}

function showChrome(time=transitionTime.chrome) {
  // console.log(time);
  $('body').stop().animate( {'marginTop': 0}, time/1.5, () => {
    // header, overlay buttons (video, multiple pics), footer, account info
    $('nav, header, footer, ._4bSq7, .fx7hk').stop()
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

let focusedProject = -1;
// let focusedState = 2; // 0..focus group with color, 1..focus group without color, 2..colorize none, 3..colorize all

function colorizeProject(projNum, withColor = false) {
  let nums = dedupe( project[order[projNum]] );
  let others = invertNums(nums);
  let p = [];
  p.push( undim(nums) );
  if (withColor) {
    p.push( colorize(nums) );
  } else {
    p.push( uncolorize(nums) );
  }
  p.push( dim(others) );
  p.push( uncolorize(others) );
  focused = true;
  focusedProject = projNum;
  return Promise.all(p);
}

function focusProject(projNum, withIntro = true) {
  let numProjects = order.length;
  focusedProject = projNum;
  if (focusedProject >= numProjects) {
    focusedProject %= numProjects;
  } else if (focusedProject < 0) {
    focusedProject = focusedProject % numProjects + numProjects;
  }

  // intro
  let intro = Promise.resolve();
  if (withIntro) {
    // intro = uncolorizeAll().then(colorizeProjects);
    intro = colorizeProjects();
  }
  // focus`
  return intro.then( () => colorizeProject(projNum, true) )
    .then( () => colorizeProject(projNum, false) );
}

function focusNext(delta = 1) {
  return focusProject(focusedProject+delta);
}

function focusPrev() { // eslint-disable-line no-unused-vars
  return focusNext(-1);
}

// function focusNext(stateOffset = 1) {
//   // change state
//   focusedState += stateOffset;
//   if (focusedState >= 4) {
//     focusedGroup++;
//     if (focusedGroup >= order.length) focusedGroup %= order.length;
//     focusedState %= 4;
//   } else if (focusedState < 0) {
//     focusedGroup--;
//     if (focusedGroup < 0) focusedGroup = focusedGroup % order.length + order.length;
//     focusedState = focusedState % 4 + 4;
//   }
//
//   console.log(focusedGroup, focusedState);
//
//   if (focusedState == 0) {
//     focusProject(focusedGroup, true);
//   } else if (focusedState == 1) {
//     focusProject(focusedGroup, false);
//   } else if (focusedState == 2) {
//     uncolorizeAll();
//   } else if (focusedState == 3) {
//     colorizeProjects();
//   }
// }

// function focusPrev() { focusNext(-1); }

let sorted = false;
function sort() {
  sorted = true;
  return scramble().then(() => {
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
}

function unsort() {
  sorted = false;
  return scramble().then(() => {
    $('.post').css('order',0);
  });
}

function toggleSort() {
  return !sorted ? sort() : unsort();
}

function scramble(time=transitionTime.scramble) {
  let fps = 30;
  let int = 1000/fps;
  let total = Math.floor(time/int);
  let i = 0;

  return new Promise(resolve => {
    let x = setInterval(() => {
      $('.post').each((i, el) => {
        let rnd = Math.floor(Math.random()*n);
        // console.log(el, rnd);
        $(el).css( 'order', rnd );
      });
      if (i++ >= total) {
        clearInterval(x);
        resolve();
      }
    }, int);
  });
}

// set links to keynote
function setLinks() {
  $('.post a').css('pointerEvents', 'none'); // deactivate all links
  // set group links
  Object.keys(project).forEach(projectName => {
    if (projectName == 'other') return;
    // let href = 'appswitch://keynote?slide=' + keynoteSlides[projectName];
    let href = 'appswitch://keynote?slideTag=' + projectName;
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
  let desc = $meta.attr('content').replace('3,944', num);
  $meta.attr('content', desc);
  $('meta[property="og:description"]').attr('content', desc);
}

function setPostCount() {
  let num = n;
  $('.post-count').attr('title', num).text(num);

  let $meta = $('meta[name=description]');
  let desc = $meta.attr('content').replace('146', num);
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

  // so year2+ has month >= 0, year1 has month < 0
  function computeMonth(num) {
    let date = new Date(d[num].taken_at_timestamp * 1000);
    // console.log(num, date);
    // year 2 starts april 2017
    return date.getMonth()-3 + (date.getFullYear()-2017)*12;
  }

  let months = nums.map(computeMonth), monthMin = Math.min(...months), monthMax = Math.max(...months);
  // console.log(monthMin, monthMax);

  nums.forEach(num => {
    let month = computeMonth(num);
    let q;
    if (month >= 0) {
      // year 2
      // console.log('year2', month);
      q = overlay([num], shade(month, monthMax+1, hues.year2), colorizeOpacity);
    } else {
      // year 1
      // console.log('year 1', month);
      q = overlay([num], shade(month-monthMin, -monthMin, hues.year1), colorizeOpacity);
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

function showCommBSides() {
  let commbsides =   subtract( categories['commercial'], categories['comm_used'] );
  let p = uncolorizeAll();
  let r = dim(invertNums(commbsides));
  return Promise.all([p, r]);
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
  window.showCommBSides = showCommBSides;

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
let pstate = 0; // eslint-disable-line no-unused-vars

let caseStates = 9;
function setState(num) {
  let numStates = caseStates + order.length;
  if (num >= numStates) {
    num %= numStates;
  } else if (num < 0) {
    num = num % numStates + numStates;
  }
  pstate = state;
  state = num;

  let proj;
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
    showCommBSides().then(logState);
    break;

  case 7: // unsorted
    Promise.all([
      colorizeProjects(),
      sorted ? unsort() : Promise.resolve()
    ]).then(logState);
    break;

  case 8: // sorted
    Promise.all([
      colorizeProjects(),
      !sorted ? sort() : Promise.resolve()
    ]).then(logState);
    break;

  default:
    // check for project focus
    proj = num - caseStates; //
    console.log("proj ", proj);
    if (proj >= 0 && proj < order.length) {
      let withIntro = proj > 0;
      focusProject(proj, withIntro).then(logState);
    } else {
      console.warn('unknown state: ' + num);
    }
    break;
  }
  console.log(" going to state " + state + "/" + (numStates-1));
}

function nextState(delta = 1) {
  setState(state+delta);
}

function prevState() {
  nextState(-1);
}
