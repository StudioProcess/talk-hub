import fs from 'fs';
import request from 'request-promise-native';
import cheerio from 'cheerio';

// this script takes a instagram index html page as input
// it finds all posts links and gets the individual post info
// the post data is output to posts.json

const html_file = './posts.html';
const link_selector = '.v1Nh3 a';
const DEBUG = 0;

(async function main() {
  
  // let html = await request('https://www.instagram.com/process.studio/');
  // let $ = cheerio.load(html);
  // let scripts = $('script');
  // // console.dir(scripts.length);
  // let stext = scripts.eq(2).html();
  // stext = stext.replace('window._sharedData = ', '');
  // stext = stext.substring(0, stext.length-1);
  // // console.log(stext);
  // let data = JSON.parse(stext);
  // let profile = data.entry_data.ProfilePage[0];
  // let media = profile.graphql.user.edge_owner_to_timeline_media; // 116
  // console.log(media); // 116
  // // Just gives the first 10 posts! --> rest will only be loaded on scrolling
  
  
  
  let html = fs.readFileSync(html_file, 'utf8');
  let $ = cheerio.load(html);
  let $links = $(link_selector);
  
  
  let links = [];
  
  $links.each((i, el) => {
    let href = $(el).attr('href');
    links.push(href);
  });
  console.log(links);
  console.log(`Found ${links.length} links`);
  // return;
  
  if (DEBUG) {
    links = links.slice(0, 2); // limit for testing
  }
  
  let res = await Promise.all(links.map(request));
  let posts = res.reduce((acc, res, i) => {
    let $ = cheerio.load(res);
    let scripts = $('body script');

    let stext = scripts.eq(0).html();
    // console.log(scripts);
    stext = stext.replace('window._sharedData = ', '');
    stext = stext.substring(0, stext.length-1);
    let data = JSON.parse(stext);
    let post = data.entry_data.PostPage[0].graphql.shortcode_media;
    acc[links.length-i] = post;
    return acc;
  }, {});
  
  // console.log(posts);
  let out = JSON.stringify(posts, null, 2);
  fs.writeFileSync('posts.json', out);
  console.log(`extracted ${Object.keys(posts).length} posts`);
})();
