//***************************************************************************************//
//
//	FabricJS Object Drawing file
//
//***************************************************************************************//

var classDraw = function (scale, canv_id, width, height) {
	var main = this;

	main.canvasID = canv_id;
	main.canvWidth = width;
	main.canvHeight = height;
	main.canvas = null;

	main.isDrawing = 0;
	main.shape = null;
	main.drawObj = null;
	main.drawRectText = null;
	main.drawSize = 1;
	main.drawColor = "#ff0000";
	main.backColor = "#00ff00";
	main.sPos = {
		x: 0,
		y: 0
	};
	main.startPosition = {
		x: 0,
		y: 0
	};
	main.endPosition = {
		x: 0,
		y: 0
	};
	main.arrowSize = 10;

	main.textWidth = 200;
	main.textHeight = 150;

	main.arrowType = 0;
	main.scale = scale;
	main.rulerScale = false;
	main.unit = "";
	main.parent = null;

	main.fontSize = 15;
	main.fontFamily = "Arial Black";
	main.fontStyle = "Normal";

	main.init = function () {
		main.canvasCSS();
		main.initFabric();
		main.initEvent();
	}

	main.canvasCSS = function () {
		$("#" + main.canvasID).attr("width", main.canvWidth);
		$("#" + main.canvasID).attr("height", main.canvHeight);
		$("#" + main.canvasID).css("width", main.canvWidth);
		$("#" + main.canvasID).css("height", main.canvHeight);

		if (main.canvas) {
			main.canvas.setWidth(main.canvWidth);
			main.canvas.setHeight(main.canvHeight);
			main.canvas.renderAll();
			main.canvas.calcOffset();
		}

	}

	main.initFabric = function () {
		main.canvas = new fabric.Canvas(main.canvasID,{
			preserveObjectStacking: true
		});
		main.canvas.setZoom(main.scale);
		main.canvas.renderAll();
	}

	main.initEvent = function () {
		main.canvas.on("mouse:down", function (evt) {
			var left = evt.e.offsetX / main.parent.scale;
			var top = evt.e.offsetY / main.parent.scale;

			main.canvas.freeDrawingBrush.color = main.drawColor;
			evt.e.stopPropagation();

			if (evt.target)
				main.onObjectSelected();

			if (main.is_select) {
				main.is_select = 0;
				return;
			}

			main.deselectCanvas();

			if (!main.shape)
				return;

			main.isDrawing = 1;
			main.canvas.selection = false;
			main.sPos = {
				x: left,
				y: top
			};

			switch (main.shape) {
				case "rect":
					{
						// var textInRect = new fabric.IText("Input text here", {
						// 	fontFamily: main.fontFamily,
						// 	fontStyle: main.fontStyle,
						// 	fontSize: main.fontSize,
						// 	fill: main.drawColor
						// });
						main.drawObj = new fabric.Rect({
							type_of: main.shape,
							width: 20,
							height: 20,
							fill: "transparent",
							stroke: main.backColor,
							left: left,
							top: top,
							hasBorders: true
						});

						// main.drawObj = new fabric.Group([rect, textInRect],
						// 	{	
						// 		type_of: main.shape,
						// 		left: left,
						// 		top: top
						// 	});						
						main.canvas.add(main.drawObj);
					}
					break;
				case "arrow":
					{
						var arrow_path = "";
						if (main.arrowType == 1) {
							arrow_path = "M 0 0 L 1 0 z";
						} else if (main.arrowType == 2) {
							arrow_path = "M 0 -" + main.arrowSize + " L " + main.arrowSize + " 0 L 0 " + main.arrowSize + " z";
							// arrow_path += "L -" + main.arrowSize + " 0 L 0 -" + main.arrowSize + " M -" + main.arrowSize + "0 L " + main.arrowSize + " 0 z";
						} else {
							arrow_path = "M 0 -" + main.arrowSize + " L " + main.arrowSize + " 0 L 0 " + main.arrowSize + " z";
							// var arrow_path 	= "M 0 -10 L 0 10 M 0 0 L " + line_dist + " 0 M 0 0 L 5 -3 M 0 0 L 5 3 M " + line_dist + " 0 L " + (line_dist - 5) + " -3 M " + line_dist + " 0 L " + (line_dist - 5) + " 3 M " + line_dist + " -10 L " + line_dist + " 10 z";
						}

						var path_obj = new fabric.Path(arrow_path, {
							type: "path",
							left: 0,
							top: 0,
							stroke: main.drawColor,
							fill: false,
							strokeWidth: 1
						});

						main.drawObj = new fabric.Group([path_obj], {
							type_of: main.shape,
							left: left,
							top: top,
							height: 20,
							originY: "center",
							angle: 0,
							selectable: false,
							lockScalingY: true,
						});
						main.canvas.add(main.drawObj);
					}
					break;
				case "text":
					{
						main.drawObj = new fabric.IText("Input Text Here", {
							type_of: main.shape,
							type: "text",
							fontFamily: main.fontFamily,
							fontSize: main.fontSize,
							fontStyle: main.fontStyle,
							fill: main.drawColor,
							left: left,
							top: top
						});
						main.canvas.add(main.drawObj);
					}
					break;
				case "comment":
					{
						bg = new fabric.Rect({
							type: "background",
							width: main.textWidth,
							height: main.textHeight,
							fill: main.backColor,
							stroke: "black",
							strokeWidth: 1,
							selectable: false,
							hasBorders: true,
						});
						text = new fabric.Textbox("", {
							type: "text",
							fontFamily: main.fontFamily,
							fontSize: main.fontSize,
							fontStyle: main.fontStyle,
							fill: main.drawColor,
							selectable: false,
							breakWords: true
						});

						main.drawObj = new fabric.Group([bg, text], {
							type_of: main.shape,
							left: left,
							top: top,
							lockScalingY: true,
							selectable: false,
						});
						main.canvas.add(main.drawObj);
					}
					break;
				case "ruler":
					{
						var arrow_path = "M 0 -7 L 0 7 z";
						var ruler_line = null;
						var ruler_text = null;

						ruler_line = new fabric.Path(arrow_path, {
							type: "path",
							left: 0,
							top: 0,
							stroke: main.drawColor,
							fill: false,
							strokeWidth: 1
						});

						ruler_text = new fabric.Text("Length : 0m", {
							type: 'text',
							left: 0,
							top: -10,
							fill: main.drawColor,
							fontSize: 13,
							fontFamily: "arial"
						});

						main.drawObj = new fabric.Group([ruler_line, ruler_text], {
							type_of: main.shape,
							left: left,
							top: top,
							height: 20,
							originY: "center",
							angle: 0,
							lockScalingY: true,
							selectable: false,
						});

						main.canvas.add(main.drawObj);
					}
					break;
				case "picture":
					{
						main.drawObj = new fabric.Circle({
							radius: 10,
							strokeWidth: 1,
							left: left,
							top: top,
							fill: main.backColor,
							stroke: 'blue',
							originX: 'center',
							originY: 'center',
							type: 'picture',
							selectable: false,
							hasControls: false
						});

						main.canvas.add(main.drawObj);

						canvasZoom = main.canvas.getZoom();
						hPosX = $('.canvas-container').offset().left + main.drawObj.left * canvasZoom;
						hPosY = $('.canvas-container').offset().top + main.drawObj.top * canvasZoom;

						$("#popup_area").css("left", hPosX + "px");
						$("#popup_area").css("top", hPosY + "px");
						main.showPopup("popup_picture");
					}

					break;
				case "attach":
					{
						main.drawObj = new fabric.Rect({
							width: 15,
							height: 15,
							strokeWidth: 1,
							left: left,
							top: top,
							fill: main.backColor,
							stroke: 'blue',
							originX: 'center',
							originY: 'center',
							type: 'attach',
							selectable: false,
							hasControls: false
						});

						main.canvas.add(main.drawObj);

						canvasZoom = main.canvas.getZoom();
						hPosX = $('.canvas-container').offset().left + main.drawObj.left * canvasZoom;
						hPosY = $('.canvas-container').offset().top + main.drawObj.top * canvasZoom;

						$("#popup_area").css("left", hPosX + "px");
						$("#popup_area").css("top", hPosY + "px");

						$("#popup_attach object").removeAttr("data");
						$("#popup_attach a").attr("href", "#");
						$("#popup_attach a").html("");
						main.showPopup("popup_attach");
					}
					break;
			}
		});

		main.canvas.on("mouse:move", function (evt) {
			if (!main.isDrawing)
				return;

			if (!main.drawObj)
				return;

			var left = evt.e.offsetX / main.parent.scale;
			var top = evt.e.offsetY / main.parent.scale;

			var distance = Math.sqrt((left - main.sPos.x) * (left - main.sPos.x) + (top - main.sPos.y) * (top - main.sPos.y));
			var arrow_angle = Math.PI / 4;
			var radius = Math.sqrt(2 * main.arrowSize * main.arrowSize);

			switch (main.shape) {
				case "rect":
					{
						main.drawObj.left = Math.min(left, main.sPos.x);
						main.drawObj.top = Math.min(top, main.sPos.y);

						main.drawObj.width = Math.abs(left - main.sPos.x);
						main.drawObj.height = Math.abs(top - main.sPos.y);
					}
					break;
				case "arrow":
					{
						var angle = Math.atan2(top - main.sPos.y, left - main.sPos.x);
						var arrow_path = "M 0 0 L " + distance + " 0 M " + (distance - main.arrowSize) + " -" + main.arrowSize + " ";
						arrow_path += "L " + distance + " 0 L " + (distance - main.arrowSize) + " " + main.arrowSize;

						if (main.arrowType == 1) {
							arrow_path = "M 0 0 L " + distance + " 0";
						} else if (main.arrowType == 2) {
							arrow_path = "M " + main.arrowSize + " -" + main.arrowSize + " ";
							arrow_path += "L 0 0 L " + main.arrowSize + " " + main.arrowSize + " ";
							arrow_path += "M 0 0 L " + distance + " 0 ";
							arrow_path += "M " + (distance - main.arrowSize) + " -" + main.arrowSize + " ";
							arrow_path += "L " + distance + " 0 L " + (distance - main.arrowSize) + " " + main.arrowSize;
						}

						var pointArr = main.pathToPointArr(arrow_path);
						var left = main.drawObj.left - distance / 2;

						main.drawObj._objects[0].set({
							path: pointArr,
							left: distance / (-2)
						});
						main.drawObj._objects[0].setCoords();
						main.drawObj.set({
							angle: angle / Math.PI * 180,
							width: distance
						});
					}
					break;
				case "ruler":
					{
						var line_dist = Math.sqrt(Math.pow(left - main.drawObj.get("left"), 2) + Math.pow(top - main.drawObj.get("top"), 2));

						var line_angle = Math.atan2(top - main.drawObj.get("top"), left - main.drawObj.get("left")) / Math.PI * 180;

						var arrow_path = "M 0 -10 L 0 10 M 0 0 L " + line_dist + " 0 M 0 0 L 5 -3 M 0 0 L 5 3 M " + line_dist + " 0 L " + (line_dist - 5) + " -3 M " + line_dist + " 0 L " + (line_dist - 5) + " 3 M " + line_dist + " -10 L " + line_dist + " 10 z";
						var pointArr = main.pathToPointArr(arrow_path);

						var text_width = 0;
						var text_left = 0;

						main.drawObj._objects[0].set({
							path: pointArr,
							left: line_dist / (-2)
						});
						main.drawObj._objects[0].setCoords();



						if (main.rulerScale) {
							main.rulerLabel(line_dist, main.rulerScale);
							main.drawObj._objects[1].set({
								text: "Length : " + main.rulerLabel(line_dist, main.rulerScale)
							});
						} else {
							main.drawObj._objects[1].set({
								text: "Length : " + main.rulerLabel(Math.round(line_dist * 100) / 100, 1)
							});
						}
						text_width = main.drawObj._objects[1].width;
						text_left = 0 - text_width / 2;

						main.line_dist = line_dist;
						main.drawObj.set({
							angle: line_angle,
							width: line_dist,
							noMove: 0
						});
					}
					break;
			}

			main.drawObj.setCoords();
			main.canvas.renderAll();
		});

		main.canvas.on("mouse:up", function (evt) {
			main.isDrawing = 0;

			evt.e.stopPropagation();
			var left = evt.e.offsetX / main.parent.scale;
			var top = evt.e.offsetY / main.parent.scale;
			switch (main.shape) {
				case "rect":
					{
						var l = main.drawObj.left,
							t = main.drawObj.top,
							g_w = main.drawObj.width,
							g_h = main.drawObj.height;

						main.canvas.remove(main.drawObj);
						var rect = new fabric.Rect({
							left:0,
							top: 0,
							width: g_w,
							height: g_h,
							fill: "transparent",
							stroke: main.backColor,
							hasBorders: true
						});
						var textInRect = new fabric.IText("Input text here", {
							left:0,
							top: 0,
							width: g_w,
							height: g_h,
							fontFamily: main.fontFamily,
							fontStyle: main.fontStyle,
							fontSize: main.fontSize,
							fill: main.drawColor,
							selectable: false
						});
						main.drawObj = new fabric.Group([rect, textInRect],
						{	
							type_of: 'rect',
							left: l,
							top: t
						});				
						main.canvas.add(main.drawObj);
					}					
					break;
				case "text":
					break;
				case "comment":
					{
						main.drawObj.setControlsVisibility({
							mt: false, // middle top disable
							mb: false, // midle bottom
							ml: false, // middle left
							mr: false, // middle right
						});
						canvasZoom = main.canvas.getZoom();
						hPosX = $('.canvas-container').offset().left + main.drawObj.left * canvasZoom;
						hPosY = $('.canvas-container').offset().top + main.drawObj.top * canvasZoom;
						hWidth = main.drawObj._objects[0].width * canvasZoom;
						hHeight = main.drawObj._objects[0].height * canvasZoom;

						$("#popup_text textarea").css({
							"font-size": main.fontSize * canvasZoom
						});
						$("#popup_text textarea").css({
							"padding": 5 * canvasZoom + "px"
						});
						$("#popup_text textarea").css({
							"font-family": main.fontFamily
						});
						if (main.fontStyle == "Bold") {
							$("#popup_text textarea").css({
								"font-style": "normal"
							});
							$("#popup_text textarea").css({
								"font-weight": main.fontStyle
							});
						} else {
							$("#popup_text textarea").css({
								"font-style": main.fontStyle
							});
							$("#popup_text textarea").css({
								"font-weight": "normal"
							});
						}

						$("#popup_text textarea").css({
							"color": main.drawColor
						});

						$("#popup_area").css("left", hPosX + "px");
						$("#popup_area").css("top", hPosY + "px");
						$("#popup_text textarea").focus();
						$("#popup_text textarea").css("width", hWidth + "px");
						$("#popup_text textarea").css("height", hHeight + "px");

						var resizeObj = main.drawObj._objects[0];

						$("#popup_text textarea").mouseup(function () {
							canvasZoom = main.canvas.getZoom();
							width = $(this).width(); // think the padding (3px)
							height = $(this).height(); // think the padding (3px)
							resizeObj.width = width / canvasZoom + 10;
							resizeObj.height = height / canvasZoom + 10;
							main.canvas.renderAll();
						});

						main.showPopup("popup_text");
					}
					break;
				case "ruler":
					{
						if (main.line_dist < 0.1) {
							main.canvas.remove(main.drawObj);
							return;
						}

						if (!main.rulerScale) {
							canvasZoom = main.canvas.getZoom();
							hPosX = $('.canvas-container').offset().left + main.drawObj.left * canvasZoom;
							hPosY = $('.canvas-container').offset().top + main.drawObj.top * canvasZoom;

							$("#popup_area").css("left", hPosX + "px");
							$("#popup_area").css("top", hPosY + "px");
							main.showPopup("popup_scale");
						}
					}
					break;
			}
		});
		main.canvas.on({
			'object:scaling': function (e) {				
				var obj = e.target,
					w = obj.width * obj.scaleX,
					h = obj.height * obj.scaleY,
					s = obj.strokeWidth;
				
				if (obj.type_of == "rect") { //only group rect
					obj.set({
						type_of: 'rect',
						height: h,
						width: w,
						strokeWidth: s
					});
				}
			}
		});
		main.canvas.on({'object:modified': function (e) {
				console.log('abc')
				var group = e.target,
					l = group.left,
					t = group.top,
					g_w = group.width,
					g_h = group.height;					
				
				if(group.type_of == "rect"){
					var ff = group._objects[1].fontFamily,
						fs = group._objects[1].fontSize,
						fst = group._objects[1].fontStyle;
					
					main.canvas.remove(group);
					var rect = new fabric.Rect({
						left: 0,
						top: 0,
						width: g_w,
						height: g_h,
						fill: "transparent",
						stroke: main.backColor,
						hasBorders: true
					});
					var textInRect = new fabric.IText(group._objects[1].text, {
						left:0,
						top: 0,
						width: g_w,
						height: g_h,
						fontFamily: ff,
						fontStyle: fst,
						fontSize: fs,
						fill: main.drawColor,
						selectable: false
					});
					main.drawObj = new fabric.Group([rect, textInRect],
					{	
						type_of: 'rect',
						left: l,
						top: t
					});				
					main.canvas.add(main.drawObj);
				}				
			}			
		});		
	}

	main.rulerLabel = function (pixel, rulerScale) {
		var inches = Math.round(pixel * rulerScale * 100) / 100;
		var feet = Math.floor(inches / 12);
		var in_int = Math.floor(inches - feet * 12);
		var in_dec = Math.round((inches - feet * 12 - in_int) * 100);
		var fract = main.reduce(in_dec, 100);

		return feet + " ft " + in_int + " " + fract[0] + "/" + fract[1] + "In";
	}

	main.reduce = function (numerator, denominator) {
		var gcd = function gcd(a, b) {
			return b ? gcd(b, a % b) : a;
		};

		gcd = gcd(numerator, denominator);
		return [numerator / gcd, denominator / gcd];
	}

	main.onObjectSelected = function () {
		main.is_select = 1;
		main.hidePopup();

		if (main.canvas.getActiveObject()) {
			var obj = main.canvas.getActiveObject();
			var left = obj.left;
			var top = obj.top;

			switch (obj.type_of) {
				case "rect":
					
					break;
				case "picture":
					$("#popup_image img").attr("src", obj.src)
					$("#popup_area").css("left", left + "px");
					$("#popup_area").css("top", top + "px");

					main.showPopup("popup_image");
					break;
				case "attach":
					$("#popup_area").css("left", left + "px");
					$("#popup_area").css("top", top + "px");

					$("#popup_attach object").attr('data', obj.src);
					$("#attach_file").attr("href", obj.src);
					$("#attach_file").html("File : " + obj.file);

					main.showPopup("popup_attach");
					break;
			}

			main.showProperty();
		}
	}

	main.setSelectable = function (option) {
		main.canvas.forEachObject(function (object) {
			object.selectable = option;
		});
	}

	main.showProperty = function () {
		if (main.canvas.getActiveObject()) {
			main.selectObj = main.canvas.getActiveObject();
			main.hideProperty();
			switch (main.selectObj.type_of) {
				case "rect":
					$("#font_area").css("display", "block");
					$("#font_style").css("display", "block");
					$("#font_size").css("display", "block");
					$("#background_area").css("display", "block");
					break;
				case "text":
					$("#font_area").css("display", "block");
					$("#font_style").css("display", "block");
					$("#font_size").css("display", "block");
					break;
				case "comment":
					$("#background_area").css("display", "block");
					$("#font_area").css("display", "block");
					$("#font_style").css("display", "block");
					$("#font_size").css("display", "block");
					break;
			}
		}
	}

	main.hideProperty = function () {
		$("#font_area").css("display", "none");
		$("#font_style").css("display", "none");
		$("#font_size").css("display", "none");
		$("#background_area").css("display", "none");
	}

	main.deselectCanvas = function () {
		$("#context_menu").css("display", "none")
		$(".show").removeClass("show");
		$("#popup_text textarea").unbind("mouseup");

		delete main.selectObj;
		main.hidePopup();

		if (!main.drawObj) {
			// main.hideProperty();
			return;
		}

		switch (main.drawObj.type_of) {
			case "select":
				main.hidePopup();
				break;
			case "rect":
				break;
			case "text":
				break;
			case "comment":
				var text = $("#popup_text textarea").val();
				$("#popup_text textarea").val("");

				text_obj = main.drawObj._objects[1];
				text_obj.text = text;
				main.setCoords(main.drawObj);

				break;
			case "picture":

				break;
		}
		main.canvas.renderAll();
		main.drawObj = null;
	}

	main.setCoords = function (obj) {
		if (!obj._objects || !obj._objects[0]) {
			return;
		}

		width = obj._objects[0].width;
		height = obj._objects[0].height;

		if (obj._objects[1]) {
			obj._objects[1].width = width - 10;
			obj._objects[1].left = -(width / 2) + 5;
			obj._objects[1].top = -(height / 2) + 5;
		}

		obj._objects[0].left = -(width / 2);
		obj._objects[0].top = -(height / 2);

		obj.width = width;
		obj.height = height;

		obj.setCoords();
	}

	main.pathToPointArr = function (path_str) {
		var pArr = path_str.split(" ");
		var rArr = [];
		var tArr = [];
		var ind = 0;

		for (var i = 0; i < pArr.length; i++) {
			if (i % 3 == 0) {
				tArr[0] = pArr[i];
			}

			if (i % 3 == 1) {
				tArr[1] = pArr[i] * 1;
			}

			if (i % 3 == 2) {
				tArr[2] = pArr[i] * 1;
				rArr.push(tArr);
				tArr = [];
			}
		}

		rArr.push(tArr);

		return rArr;
	}

	main.addImage = function (param, callback) {
		if (main.pattern)
			main.canvas.remove(main.pattern);

		var imgObj = fabric.Image.fromURL(param.src, function (img) {
			var scale = Math.min(main.canvWidth / img.width, main.canvHeight / img.height);
			var width = param.width ? param.width : img.width;
			var height = param.height ? param.height : img.height;
			var select = param.selectable;
			var left = param.left ? param.left : 0;
			var top = param.top ? param.top : 0;

			if (param.autofit) {
				width = img.width * scale;
				height = img.height * scale;
			}

			var object = img.set({
				top: top,
				left: left,
				width: width,
				height: height,
				selectable: select,
				angle: 0
			});

			main.pattern = object;
			main.canvas.add(object);

			// if(param.isFront)
			object.bringToFront();

			if (callback)
				callback(img.width, img.height);

			main.canvas.renderAll();
		});
	}

	main.addText = function (param) {
		var selectable = false;

		if (main.parent.selTool == "select")
			selectable = true;

		var object = new fabric.Textbox(param.text, {
			type: "text",
			left: param.x,
			top: param.y,
			width: param.width,
			height: param.height,
			fill: param.color,
			fontFamily: param.fontFamily,
			selectable: selectable,
			fontSize: main.fontSize,
			fontStyle: main.fontStyle,
			breakWords: true
		});

		return object;
	}
	main.addRect = function (param) {
		var selectable = false;

		var object = new fabric.Rect({
			left: param.x,
			top: param.y,
			width: param.width,
			height: param.height,
			borderColor: main.drawColor,
			selectable: false
		});

		return object;
	}
	main.copy = function () {
		var active = main.canvas.getActiveObject();

		if (!active)
			return;

		main.clipboard = active;
	}

	main.paste = function (x, y) {
		if (!main.clipboard)
			return;

		switch (main.clipboard.type_of) {
			case "rect":
				var cloned_text, cloned_rect, cloned = main.clipboard;
				cloned_text = fabric.IText.fromObject(cloned._objects[1].toObject());				
				cloned_text.type = 'text';
				cloned_rect = cloned._objects[0].clone();
				cloned_rect.type = 'rect';

				var copied = new fabric.Group([cloned_rect, cloned_text], {
					left: x,
					top: y,
					type_of: main.clipboard.type_of
				});				
				main.canvas.add(copied);
				cloned.setCoords();
				break;
			case "text":
				var cloned = main.clipboard;
				var copied = fabric.IText.fromObject(cloned.toObject());
				copied.left = x;
				copied.top = y;
				copied.type_of = 'text';
				main.canvas.add(copied);
				copied.setCoords();
				break;
			case "comment":
				var bg = main.clipboard._objects[0, 0].clone();
				bg.left = x;
				bg.top = y;

				var txt = main.clipboard._objects[0, 1].clone();
				txt.left = x + 5;
				txt.top = y + 5;

				var copied = new fabric.Group([bg, txt], {
					left: bg.left,
					top: bg.top,
					type: main.clipboard.type_of
				});
				main.canvas.add(copied);
				copied.setCoords();
				break;
		}				
		main.canvas.renderAll();
	}

	main.clone = function (obj) {
		if (obj === null || typeof (obj) !== 'object')
			return obj;

		var copy = obj.constructor();

		for (var attr in obj) {
			if (obj.hasOwnProperty(attr)) {
				copy[attr] = main.clone(obj[attr]);
			}
		}

		return copy;
	}

	main.delete = function () {
		var active = main.canvas.getActiveObject();

		if (!active)
			return;

		main.canvas.remove(active);
		main.canvas.renderAll();
	}

	main.showPopup = function (id) {
		$("#popup_area").css("display", "block");
		$("#popup_area").find(".active").removeClass("active");
		$("#popup_area").find("#" + id).addClass("active");
	}

	main.hidePopup = function () {
		$("#popup_area").css("display", "none");
		$("#popup_area").find(".active").removeClass("active");
	}

	main.init();
};

fabric.Textbox.prototype._wrapLine = function (ctx, text, lineIndex) {
	// 	var lineWidth = 0,
	// 		lines = [],
	// 		line = '',
	// 		words = text.split(' '),
	// 		word = '',
	// 		letter = '',
	// 		offset = 0,
	// 		infix = ' ',
	// 		wordWidth = 0,
	// 		infixWidth = 0,
	// 		letterWidth = 0,
	// 		largestWordWidth = 0;

	// 	for (var i = 0; i < words.length; i++) {
	// 		word = words[i];
	// 		wordWidth = this._measureText(ctx, word, lineIndex, offset);
	// 		lineWidth += infixWidth;

	// 		// Break Words if wordWidth is greater than textbox width
	// 		if (this.breakWords && wordWidth > this.width) {
	// 			line += infix;
	// 			var wordLetters = word.split('');
	// 			while (wordLetters.length) {
	// 				letterWidth = this._getWidthOfChar(ctx, wordLetters[0], lineIndex, offset);
	// 				if (lineWidth + letterWidth > this.width) {
	// 					lines.push(line);
	// 					line = '';
	// 					lineWidth = 0;
	// 				}
	// 				line += wordLetters.shift();
	// 				offset++;
	// 				lineWidth += letterWidth;
	// 			}
	// 			word = '';
	// 		} else {
	// 			lineWidth += wordWidth;
	// 		}

	// 		if (lineWidth >= this.width && line !== '') {
	// 			lines.push(line);
	// 			line = '';
	// 			lineWidth = wordWidth;
	// 		}

	// 		if (line !== '' || i === 1) {
	// 			line += infix;
	// 		}
	// 		line += word;
	// 		offset += word.length;
	// 		infixWidth = this._measureText(ctx, infix, lineIndex, offset);
	// 		offset++;

	// 		// keep track of largest word
	// 		if (wordWidth > largestWordWidth && !this.breakWords) {
	// 			largestWordWidth = wordWidth;
	// 		}
	// 	}

	// 	i && lines.push(line);

	// 	if (largestWordWidth > this.dynamicMinWidth) {
	// 		this.dynamicMinWidth = largestWordWidth;
	// 	}

	// 	return lines;
};

//customized Bordered TextBox
fabric.BorderTextBox = fabric.util.createClass(fabric.Textbox, {
	type: 'bordertextbox',
	initialize: function (element, options) {
		options = options || {};
		this.callSuper('initialize', element, options);
		this.set('width', options.width || '');
		this.set('height', options.height || '');
		this.width = options.width;
		this.height = options.height;
		this.set('fill', options.fill);
	},
	_render: function (ctx) {
		var w = this.width,
			h = this.height,
			x = -this.width / 2,
			y = -this.height / 2;

		ctx.beginPath();
		ctx.moveTo(x, y);
		ctx.lineTo(x + w, y);
		ctx.lineTo(x + w, y + h);
		ctx.lineTo(x, y + h);
		ctx.lineTo(x, y);
		ctx.closePath();
		ctx.fill = this.textColor;
		ctx.font = this.fontSize + " " + this.fontFamily;
		var stroke = ctx.strokeStyle;
		ctx.strokeStyle = this.borderColor;
		ctx.stroke();
		ctx.strokeStyle = stroke;

		// ctx.strokeStyle = stroke;
		// ctx.fontSize = this.fontSize;		
		// ctx.width = this.width;
		ctx.height = this.height;
		ctx.fontFamily = this.fontFamily;
	}
});
var groupDblClick = function (obj, handler) {
    return function () {
        if (obj.clicked) handler(obj);
        else {
            obj.clicked = true;
            setTimeout(function () {
                obj.clicked = false;
            }, 500);
        }
    };
};