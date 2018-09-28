JsOsaDAS1.001.00bplist00�Vscript_var currentApp = Application.currentApplication();
currentApp.includeStandardAdditions = true;

function alert(str) {
	currentApp.displayDialog( JSON.stringify(str) );
}

function parseURL(url) {
	let pos_scheme_end = url.indexOf("://") > -1 ? url.indexOf("://") : 0;
	let pos_path = url.indexOf("://") > -1 ? url.indexOf("://")+3 : 0;
	let pos_questionmark = url.indexOf("?") > -1 ? url.indexOf("?") : url.length;
	
	let query_string = url.substring(pos_questionmark, url.length);
	let query_parts = query_string.substring(1).split('&');
	let query = query_parts.reduce((acc, part) => {
		let x = part.split("=");
		let left = x[0];
		let right = x.length > 1 ? x[1] : "";
		acc[left] = right;
		return acc;
	}, {});
	
	return {
		scheme: url.substring(0, pos_scheme_end),
		path: url.substring(pos_path, pos_questionmark),
		query_string,
		query
	}
}

// args is an array of parameters from the calling script
// args[0] is the url
function run(args) {
	
	let url_str = decodeURI(args[0]);
	//alert(url_str);
	
	let url = parseURL(url_str);
	//alert(url);
	
	let appname = url.path;
	let app = Application(appname);
	
	if (appname.toLowerCase() == 'keynote') {
		let doc = app.documents[0];
		let slide;
		if (url.query['slide'] !== undefined) {
			let slideNo = parseInt(url.query['slide']);
			slide = doc.slides.whose({skipped:false})[slideNo-1];
		}
		if (slide) {
			doc.currentSlide = slide;
			app.activate();
			app.start(doc, {from: slide});
		} else {
			app.activate();
			app.start(doc);
		}
	}
	else if (appname.toLowerCase() == 'chrome') {
		app.activate();
		//app.windows[0].index = 0;
		//currentApp.doShellScript("open -a Google\\ Chrome");
	}
	else if (appname.toLowerCase() == 'space') {
		Application('System Events').keyCode(124, {using: 'control down'});
	}
	else {
		app.activate();
	}
	
}                              .jscr  ��ޭ