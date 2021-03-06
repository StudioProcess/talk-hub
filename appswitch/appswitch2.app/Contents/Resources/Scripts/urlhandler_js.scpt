JsOsaDAS1.001.00bplist00�Vscript_	�var currentApp = Application.currentApplication();
currentApp.includeStandardAdditions = true;

function alert(str) {
	currentApp.displayDialog( JSON.stringify(str) );
	//currentApp.displayDialog( str );
}

// Note: js property names are camel cased from docs
// Note: to get properties of an apple script object, call the property as a function
// Note: logs show up in the log window of script editor
function log(str) {
	console.log( JSON.stringify(str) );
	//console.log( str );
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
	// for testing hardcode an incoming url here:
	//url_str = "appswitch://keynote?slideTag=mytag";
	
	let url = parseURL(url_str);
	//alert(url);
	
	let appname = url.path;
	let app = Application(appname);
	
	if (appname.toLowerCase() == 'keynote') {
		let doc = app.documents[0];
		let slide;
		if (url.query['slide'] !== undefined) { // this should be named slideNumber
			let slideNo = parseInt(url.query['slide']);
			//alert(slideNo);
			slide = doc.slides.whose({skipped:false})[slideNo-1];
		} else if (url.query['slideTag'] !== undefined) {
			let slideTag = url.query['slideTag'];
			slide = doc.slides.whose({ presenterNotes: {_contains: '#' + slideTag} })[0];
			//log(slide.slideNumber());
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
	
}                              	� jscr  ��ޭ