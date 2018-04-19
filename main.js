'use strict';

$(() => {
  
  $('body').prepend(`
    <style>
      .post-num {
        position:absolute; bottom:0; right:0; background:black; color:white; padding:0.33rem; display:none;
      }
      .overlay { 
        position:absolute; top:0; left:0; width:100%; height:100%; background-color:rgba(0,0,0,0.3); display:none;
      }
      .post { transition: filter 0.5s; }
      .post.dim { filter: grayscale(100%) blur(5px) opacity(10%); }
      
    </style>
  `);
  
  // post elements
  let p = $('._mck9w');
  p.addClass('post');
  let n = p.length;
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
  
  $(document).on('keydown', (e) => {
    if (e.key == 'n') { // show hide post numbering
      let shown = $('.post-num').eq(0).is(":visible");
      if (!shown) $('.post-num').show();
      else $('.post-num').hide();
    }
  });
  
  let showHideTime = 300;
  
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
  
  function highlight(arr) { undim(arr); dim(invertNums(arr));  }
  
  
  // add functions to global scope for testing
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
});
