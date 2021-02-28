defineM("deltapi-code-editor",function(e,a,b){
	a.regExtension({
        name: "deltapi-code-editor",
        events: {
            beforeAppLoad: function() {
                a.Core.addFilter("prepareComponent", function(c, d) {
					var h = jQuery(c);
					var btn = '<span class="mbr-btn mbr-btn-default mbr-icon-code deltapi-code-editor-editbutton" data-tooltipster="bottom" title="Edit Code"></span><style>.deltapi-code-editor-editbutton:hover { background-color: #42a5f5 !important; }</style>';
					if (h.find(".component-params").length)
						h.find(".component-params").before(btn);
					else if (h.find(".component-remove").length)
						h.find(".component-remove").before(btn);
					c = h.prop("outerHTML");
					h.remove();
					return c;
				});
			},
			deltapicodeeditor: function() {
				setTimeout(function(){ $(window).trigger('resize'); }, 500);
			},
            load: function() {			
				var dir = a.getAddonDir("deltapi-code-editor");
				var separator = " | ";
				var acepath= dir+"/ace/ace.js";
				a.$body.append('\n<script src="'+acepath+'"></script>\n');
				if (!$("#deltapi-code-editor").length) {
					a.$body.append([
						'<div id="deltapi-code-editor">',
//						'  <div>',
						'    <div class="row deltapi-code-editor-row">',
						'      <div class="col-lg-8 deltapi-code-editor-col">',
						'        <div class="deltapi-code-editor-header"><h4>HTML</h4></div>',
						'        <button class="btn btn-primary button_edit_customhtml" data-tooltipster="top" title="Edit customHTML"><span class="mbr-icon-code"></span></button>',
						'        <button class="btn btn-primary button_edit_slider" data-tooltipster="top" title="Edit Slider"><span class="mbr-icon-camera"></span></button>',
						'        <button class="btn btn-primary button_edit_gallery" data-tooltipster="top" title="Edit Gallery"><span class="mbr-icon-camera"></span></button>',
						'        <button class="btn btn-primary button_edit_block" data-tooltipster="top" title="Edit Block"><span class="mbr-icon-edit"></span></button>',separator,
						'        <button class="btn btn-primary button_edit_setting" data-tooltipster="top" title="more settings"><span class="mbr-icon-info"></span></button>',
						'        <button class="btn btn-primary button_editor_help" data-tooltipster="top" title="Help Edit"><span class="mbr-icon-question"></span></button>',
						'        <button class="btn btn-success button_edit_project" data-tooltipster="top" title="Edit Project"><span class="mbr-icon-bookmark"></span></button>',
						'        <button class="btn btn-primary button_save_editor" data-tooltipster="top" title="Save Editor Settings"><span class="mbr-icon-save"></span></button>',
						'		<pre id="code1" style="overflow: auto;" contenteditable="true">',a.escapeHtml("<div>Code1</div>"),'</pre>',
						'      </div>',
						'      <div class="col-lg-4 deltapi-code-editor-col">',
						'        <div class="deltapi-code-editor-header"><h4>LESS</h4></div>',
						'        <button class="btn btn-primary button_editor_help" data-tooltipster="top" title="Help Edit"><span class="mbr-icon-question"></span></button>',
						'        <button class="btn btn-primary button_edit_css" data-tooltipster="top" title="View CSS"><span class="mbr-icon-info"></span></button>',
						'        <button class="btn btn-primary button_edit_less" data-tooltipster="top" title="Edit LESS"><span class="mbr-icon-star"></span></button>',
						'        <button class="btn btn-primary button_save_editor" data-tooltipster="top" title="Save Editor Settings"><span class="mbr-icon-save"></span></button>',
						'		<pre id="code2" style="overflow: auto;" contenteditable="true">',a.escapeHtml("<div>Code2</div>"),'</pre>',
						'      </div>',
						'    </div>',
//						'  </div>',
						'  <button class="deltapi-code-editor-save btn btn-fab btn-raised btn-primary" data-tooltipster="top" title="Save"><i class="mbr-icon-save"></i></button>',
						'  <button class="deltapi-code-editor-cancel btn btn-fab btn-raised btn-material-red" data-tooltipster="top" title="Cancel"><i class="mbr-icon-trash"></i></button>',
						'</div>'
					].join("\n"));
				}
				var editorOptions;
				$(".button_save_editor").on("click",function(){
					editorOptions = editor1.getOptions();
					Bridge.saveLocalFile(a.getAddonDir("deltapi-code-editor")+"/editor1.json", JSON.stringify(editorOptions,undefined,2));
					editorOptions = editor2.getOptions();
					Bridge.saveLocalFile(a.getAddonDir("deltapi-code-editor")+"/editor2.json", JSON.stringify(editorOptions,undefined,2));					
				});
				$(".button_edit_css").on("click",function(){
					$(".deltapi-code-editor-header:last").html("<h4>CSS</h4>");
					editor2.setOption("mode","ace/mode/css");
					editor2.session.setValue(a.Core.getComponentStyles(curr, !0).css);
				});
				$(".button_edit_less").on("click",function(){
					$(".deltapi-code-editor-header:last").html("<h4>LESS</h4>");
					editor2.setOption("mode","ace/mode/less");
					editor2.session.setValue(json2css(curr._styles));
				});
				$(".button_edit_project").on("click",function(){
					$(".deltapi-code-editor-header:first").html("<h4>Project Data</h4>");
					$(".deltapi-code-editor-header:last").html("<h4>Project Settings</h4>");
					editor1.setOption("mode","ace/mode/json");
					editor2.setOption("mode","ace/mode/json");
					try{
						editor1.session.setValue(JSON.stringify(a.Core.resultJSON, undefined, 2));
					}catch(err){
						a.alertDlg(err.name + ' with message : ' +err.message + '<br>DO NOT SAVE edited project !!!');
						var cache = [];
						var prop = JSON.stringify(a.Core.resultJSON, function(key, value) {
							if (typeof value === 'object' && value !== null) {
								if (cache.indexOf(value) !== -1) {
									// Circular reference found, discard key
									return;
								}
								// Store value in our collection
								cache.push(value);
							}
							return value;
						}, 2);
						cache = null; // Enable garbage collection
						editor1.session.setValue(prop);
						$(".deltapi-code-editor-save").hide();
					}
					editor2.session.setValue(JSON.stringify(a.projectSettings, undefined, 2));

				});
				$(".button_edit_block").on("click",function(){
					$(".deltapi-code-editor-header:first").html("<h4>Block object</h4>");
					editor1.setOption("mode","ace/mode/json");
					try{
					editor1.session.setValue(JSON.stringify(curr, undefined, 2));
					}catch(err){
						a.alertDlg(err.name + ' with message : ' +err.message + '<br>DO NOT SAVE edited block !!!');
						var cache = [];
						var prop = JSON.stringify(curr, function(key, value) {
							if (typeof value === 'object' && value !== null) {
								if (cache.indexOf(value) !== -1) {
									// Circular reference found, discard key
									return;
								}
								// Store value in our collection
								cache.push(value);
							}
							return value;
						}, 2);
						cache = null; // Enable garbage collection
						editor1.session.setValue(prop);
						$(".deltapi-code-editor-save").hide();
					}
					
				});
				$(".button_edit_customhtml").on("click",function(){
					$(".deltapi-code-editor-header:first").html("<h4>HTML</h4>");
					$(".deltapi-code-editor-header:last").html("<h4>LESS</h4>");					if(curr._params.slides){$(".button_edit_slider").show()}else{$(".button_edit_slider").hide()}
					if(curr._params.gallery){$(".button_edit_gallery").show()}else{$(".button_edit_gallery").hide()}
					editor1.setOption("mode","ace/mode/html");
					editor2.setOption("mode","ace/mode/less");
					editor1.session.setValue(curr._customHTML);
					editor2.session.setValue(json2css(curr._styles));
					$(".deltapi-code-editor-save").show();
					
				});
				$(".button_edit_slider").on("click",function(){
					$(".deltapi-code-editor-header:first").html("<h4>Slider</h4>");
					editor1.setOption("mode","ace/mode/json");
					editor1.session.setValue(JSON.stringify(curr._params.slides, undefined, 2));
					
				});
				$(".button_edit_gallery").on("click",function(){
					$(".deltapi-code-editor-header:first").html("<h4>Gallery</h4>");
					editor1.setOption("mode","ace/mode/json");
					editor1.session.setValue(JSON.stringify(curr._params.gallery, undefined, 2));					

					});				
				$(".button_editor_help").on("click", function(c) {
				
					a.showDialog({
						title: "Ace Shortcuts",
						className: "help-modal",
						body: [
							'<form class="page-settings-form"><div class="form-group clearfix"><div class="col-md-12">',
							'<div>',
							'   openCommandPallete : F1<br>',
							'	showSettingsMenu : Ctrl-,<br>',
							'	fold : Alt-L|Ctrl-F1<br>',
							'	unfold : Alt-Shift-L|Ctrl-Shift-F1<br>',
							'	toggleFoldWidget : F2<br>',
							'	toggleParentFoldWidget : Alt-F2<br>',
							'	findnext : Ctrl-K<br>',
							'	findprevious : Ctrl-Shift-K<br>',
							'	findAll : Ctrl-Alt-K<br>',
							'</div>',
							'</div>',
							'</div></form>'
						].join("\n"),
						buttons: [{
							label: "close",
							default: !0,
							callback: function() {
								jQuery(".help-modal").remove()
							}
						}]
					})
				});
				$(".button_edit_setting").on("click",function(){
					a.showDialog({
						title: "Edit additional settings of selected Block",
						className: "set-modal",
						body: [
						'<form class="page-settings-form"><div class="form-group clearfix"><div class="col-md-12">',
						'<label style="margin-bottom: 15px">Block name : ',curr._name,'</label><br>',
						'</div><div class="col-md-6">',
						'<label style="margin-bottom: 15px">Block cid : </label>',
						'<input type="text" class="form-control" id="blockCid" value="',curr._cid,'"><br>',
						'</div><div class="col-md-6">',
						'<label style="margin-bottom: 15px">Block anchor : </label>',
						'<input type="text" class="form-control" id="blockAnchor" value="',curr._anchor,'"><br>',
						'</div></div></form>'
						].join("\n"),
						buttons: [{
							label: "save",
							default: !0,
							callback: function() {
								try {
								curr._cid = $('#blockCid').val();
								curr._anchor = $('#blockAnchor').val();
								a.runSaveProject(function() {
									a.loadRecentProject(function(){
										var currentPage = a.Core.currentPage;
										$("a[data-page='"+currentPage+"']").trigger("click")
									});
								});
								}catch(err){
									a.alertDlg(err.name + ' with message : ' +err.message);
								}
							}
						},
							{
							label: "close",
							default: !0,
							callback: function() {
								$(".set-modal").remove();
								a.$body.off("click", ".set-modal")
							}
						}
						]
					});
				});
				
				a.$template.on("click", ".deltapi-code-editor-editbutton", function(c) {
					editor1 = ace.edit("code1");
					editor2 = ace.edit("code2");
					$(".deltapi-code-editor-save").show();
					Bridge.getLocalJSON(a.getAddonDir("deltapi-code-editor")+"/editor1.json", function(b) {
						editor1.setOptions(b);
					});
					Bridge.getLocalJSON(a.getAddonDir("deltapi-code-editor")+"/editor2.json", function(b) {
						editor2.setOptions(b);
					});
					compIndex = [];
					for (index in a.Core.resultJSON[a.Core.currentPage].components){
						var comp = a.Core.resultJSON[a.Core.currentPage].components[index];
						if (comp._once == "menu")
							compIndex.unshift(index);
						else
							compIndex.push(index);
					}
					a.$template.find('.deltapi-code-editor-editbutton').each(function(index, obj) {
						if (c.target == obj) {
							curr = a.Core.resultJSON[a.Core.currentPage].components[ compIndex[index] ];
						}
					});
					if (curr === null) {
						a.alertDlg("An error occured while opening the Code Editor.");
						return false;
					}
					if (!curr._customHTML) {
						a.alertDlg("Sorry, this block can't be edited with the Code Editor.");
						return false;
					}					


					$(".deltapi-code-editor-header:first").html("<h4>HTML</h4>");
					$(".deltapi-code-editor-header:last").html("<h4>LESS</h4>");
					if(curr._params.slides){$(".button_edit_slider").show()}else{$(".button_edit_slider").hide()}
					if(curr._params.gallery){$(".button_edit_gallery").show()}else{$(".button_edit_gallery").hide()}

					editor1.session.setValue(curr._customHTML);					
					editor2.session.setValue(json2css(curr._styles));
			
					a.hideComponentParams();
					$("#deltapi-code-editor").height("100%");
					a.fire('deltapicodeeditor');
					
				});
				$(window).resize(function() {
					if (a.$body.find("#deltapi-code-editor").height() != "0") {
						a.$body.find(".deltapi-code-editor-col").height("100%");
						editor1.resize();
						editor2.resize();
					}
				});

				a.$body.on("click", ".deltapi-code-editor-save", function(b) {
					switch($(".deltapi-code-editor-header:first").text()) {
						case "HTML":
							curr._customHTML = editor1.getValue();
						break;
						case "Block object":
							curr = JSON.parse(editor1.getValue());
						break;
						case "Project Data":
							a.Core.resultJSON = JSON.parse(editor1.getValue());
						break;
						case "Slider":
							curr._params.slides = JSON.parse(editor1.getValue());
						break;
						case "Gallery":
							curr._params.gallery = JSON.parse(editor1.getValue());
						break;							
						default:
							a.alertDlg("Nothing to save !");
					}
					switch($(".deltapi-code-editor-header:last").text()) {
						case "LESS":
							try {
								mbrApp.objectifyCSS( editor2.getValue() ).then(
									function(styles) {
										curr._styles = styles;
										saveEditedProject();
										return true;
									},
									function(a) {
										mbrApp.alertDlg("The LESS contains syntax errors.");
										return false;
									}
								);
							}
							catch(err){
								mbrApp.alertDlg(err.name + ': ' + err.message);
							}
						break;
						case "Project Settings":
							try {
								a.projectSettings = JSON.parse(editor2.getValue());
								saveEditedProject();
							}
							catch(e) {
								a.alertDlg("The project settings doesn't appear to be in proper JSON format.");
							break;
							}
						break;
						default:
							//a.alertDlg("Nothing to save !");
					}
					
				});
				
				function saveEditedProject() {
					var currentPage = mbrApp.Core.currentPage;
					mbrApp.runSaveProject(function() {
						mbrApp.loadRecentProject(function(){
							$("a[data-page='" + currentPage + "']").trigger("click")
						});
						a.alertDlg("project saved !");
					});

					// Make the editor disappear
					$("#deltapi-code-editor").height("0");
					curr = null;
				}
				
				a.$body.on("click", ".deltapi-code-editor-cancel", function(b) {
					$("#deltapi-code-editor").height("0");
					curr = null;
				});

            }
        }
    })
},
["jQuery","mbrApp","TR()"]);