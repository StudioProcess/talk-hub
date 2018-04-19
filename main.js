'use strict';

$(() => {
  
  // post elements
  let p = $('._mck9w');
  p.addClass('post');
  let n = p.length;
  console.log(n + ' posts'); // output number of posts
  
  // Add post number (Oldest = 1)
  p.attr('data-num', (i) => {
    return n - i;
  });
  
  p.css('position', 'relative');
  p.append((i) => {
    return '<div class="post-num" style="position:absolute; bottom:0; right:0; background:black; color:white; padding:0.33rem; display:none;">' + (n-i) + '</div>';
  });
  
  $(document).on('keydown', (e) => {
    if (e.key == 'n') { // show hide post numbering
      let shown = $('.post-num').eq(0).is(":visible");
      if (!shown) $('.post-num').show();
      else $('.post-num').hide();
    }
  });
  
  let showHideTime = 300;
  
  function get(i) { return $(`[data-num=${i}]`); }
  function show(arr) { arr.forEach(i => get(i).show(showHideTime)); }
  function hide(arr) { arr.forEach(i => get(i).hide(showHideTime)); }
  
  function highlight(arr) {
    
  }
  
  function dim(arr) {
    
  }
  
});
