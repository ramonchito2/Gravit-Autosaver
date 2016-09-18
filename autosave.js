idleTimer   = null;
idleState   = false;
idleWait    = 10000; // 10 seconds
saveTimer   = null;
saveTime    = 300000; // 5 minutes
timeStarted = false;
timetosave  = false;
changesmade = false;
savebutton  = $('.toolbar-button[data-action="file.save"] > button');

// Save button/Autosave reminder elements styles.
$('.toolbar-button[data-action="file.save"]').append(
	'<div class="autoSaveEnabled">Autosave Enabled</div><div class="pulsatingCircle"><span class="firstCircle"></span><span class="secondCircle"></span></div><style>.toolbar-button[data-action="file.save"]{position:relative}.toolbar-button[data-action="file.save"] button{z-index:1;position:relative}.pulsatingCircle{width:10px;height:10px;display:none;position:absolute;top:50%;left:50%;margin:-12px 0 0 -5px;transform:scale(3,3);-webkit-transform:scale(3,3);z-index:0}.toolbar-button[data-action="file.save"].reminder .pulsatingCircle{display:block}.firstCircle,.secondCircle{top:50%;left:50%;display:block;border-radius:50%;position:absolute;vertical-align:middle}.firstCircle{width:16px;height:16px;margin:-9px 0 0 -9px;border:1px solid #ccc;animation:2s pulseIn ease-in-out infinite;-webkit-animation:2s pulseIn ease-in-out infinite}.secondCircle{width:24px;height:24px;border:1px solid #ccc;margin:-13px 0 0 -13px;animation:2s pulseIn .5s ease-in-out infinite;-webkit-animation:2s pulseIn .5s ease-in-out infinite}@keyframes pulseIn{0%,100%{opacity:0;transform:scale(.2,.2)}50%{opacity:1;transform:scale(1,1)}}@-webkit-keyframes pulseIn{0%,100%{opacity:0;-webkit-transform:scale(.2,.2)}50%{opacity:1;-webkit-transform:scale(1,1)}}.autoSaveEnabled{position:fixed;top:45%;left:50%;z-index:99999999;background:rgba(27,134,27,.69);border:1px solid green;font-size:2em;padding:12px 24px;border-radius:4px;opacity:0;transform:translate(-50%,-50%);transition:all .3s ease}.autoSaveEnabled.enter{top:50%;opacity:1}</style>'
);

// Saves file if user is idle
needsSaving = function() {
	timetosave  = true; // boolean for save reminder
	console.log("Its time to save!");
	if( idleState == true ) {
 		saveFile();
	}
}

// Actually saves the file
saveFile = function() {
	timetosave = false;
	timeStarted = false;
	savebutton.parent('.toolbar-button').removeClass('reminder');
	savebutton.click();
	clearTimeout(saveTimer);
	console.log("savebutton clicked, savetimer reset");
}

// Autosave message
$('.autoSaveEnabled').css('opacity');
$('.autoSaveEnabled').addClass('enter');
setTimeout(function(){
	$('.autoSaveEnabled').removeClass('enter');
},2000 );

// When user is actively using the page
$('*').bind('mousemove keydown scroll', function () {

	// user no longer idle
	if( idleState == true ) {
		idleState = false;
		console.log("user is active");
	}

	// start save timer when file has been manipulated
	if( !savebutton.attr('disabled') && !timeStarted ) {
		timeStarted = true;
		saveTimer   = setTimeout(needsSaving,saveTime);
		console.log("save timer started");
	}

	// if user manually saved the file run function
	if( savebutton.attr('disabled') === 'disabled' && timetosave == true ) {
		saveFile();
	}

	// time to save, but user is still active
	if( timetosave == true ) {
		savebutton.parent('.toolbar-button').addClass('reminder');
	}

	// clear idleTimer
	clearTimeout(idleTimer);
	// ...and reset it when user is active
	idleTimer = setTimeout(function () {
	 	// user has become idle
		idleState = true;
		console.log("user is idle");
	 	if( timetosave == true ) {
	 		saveFile();
	 	}
	}, idleWait);
});