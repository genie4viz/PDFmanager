//load/save canvas data
var json_data = null;

jQuery(document).ready(function () {
  var initObj = new initEnv();

  initObj.init();
});

var initEnv = function () {
  var main = this;

  main.drawObj = null;
  main.pdfObj = null;
  main.is_draw = 0;
  main.selTool = 0;
  main.scale = 1.5;
  main.drawColor = "#ff0000"; // only for init / match with draw.js
  main.backColor = "#00ff00"; // only for init / match with draw.js  

  main.init = function () {
    main.initCSS();

    //-----------------------API Test-----------------------------------------//
    //main.getJsonMeta(companyid, projectid, scenarioid, "gs.pdf");
    //main.getUserInfo(companyid);
    //main.getComments(989);
    main.downloadPDF();
    //------------------------------------------------------------------------//

    setTimeout(() => {
      main.initPDF();
      main.initEvents();
      main.initUploader();
      main.initColors();
      main.initFonts();
      main.initSizes();
      window.addEventListener("resize", main.initCSS);
    }, 3000);
  };

  main.initPDF = function () {
    main.pdfObj = new classManagePDF();
    main.pdfObj.viewPDF(main.scale, 1, function (drawObj) {
      main.drawObj = drawObj;
      main.drawObj.parent = main;
    });
  };

  main.initCSS = function () {};
  main.downloadPDF = function () {
    $.post("downloadPDF.php", {}, function () {}).error(function () {});
  };
  main.saveJsonMeta = function (
    companyid,
    projectid,
    scenarioid,
    documentname,
    annotationsjson,
    uid
  ) {
    $.ajax({
      type: "POST",
      url: "https://dev.virtuele.us/bimspring/addAnnotations",
      data: {
        companyid: companyid,
        projectid: projectid,
        scenarioid: scenarioid,
        documentname: documentname,
        annotationsjson: annotationsjson,
        uid: uid
      },

      success: function (data) {
        console.log(data);
        if (data.status == "SUCCESS") {}
      },
      fail: function (data) {}
    });
  };
  main.getJsonMeta = function (companyid, projectid, scenarioid, documentname) {
    $.ajax({
      type: "POST",
      url: "https://dev.virtuele.us/bimspring/getAnnotations",
      data: {
        companyid: companyid,
        projectid: projectid,
        scenarioid: scenarioid,
        documentname: documentname
      },

      success: function (data) {
        console.log(data);
        if (data.status == "SUCCESS") {}
      },
      fail: function (data) {}
    });
  };
  main.getUserInfo = function (companyid) {
    $.ajax({
      type: "POST",
      url: "https://dev.virtuele.us/getUserInfo",
      data: {
        companyid: companyid
      },

      success: function (data) {
        console.log(data);
        if (data.status == "SUCCESS") {}
      },
      fail: function (data) {}
    });
  };
  main.getComments = function (companyid) {
    $.ajax({
      type: "POST",
      url: "https://dev.virtuele.us/bimspring/getAnnonationComments",
      data: {
        companyid: companyid
      },

      success: function (data) {
        console.log(data);
        if (data.status == "SUCCESS") {}
      },
      fail: function (data) {}
    });
  };
  main.initEvents = function () {
    // left_menu_click
    $("#menu_area dd").on("click", function (evt) {
      $("#viewer")
        .children(".page:nth-child(" + main.pdfObj.page_num + ")")
        .children(".page-container")
        .css({
          "z-index": "0"
        });

      evt.stopPropagation();

      if (!$(this).hasClass("expand")) $(".show").removeClass("show");

      if (!main.drawObj) return;

      if (
        $(this)
        .children("p")
        .attr("tool")
      ) {
        main.selTool = $(this)
          .children("p")
          .attr("tool");
      } else {
        return;
      }

      $("#menu_area .active").removeClass("active");
      $("#background_area").css("display", "none");
      $("#font_area").css("display", "none");
      $("#font_style").css("display", "none");
      $("#font_size").css("display", "none");

      $(this).addClass("active");

      switch ($(this).index()) {
        case 0:
          main.drawObj.shape = "select";
          main.drawObj.deselectCanvas();
          main.drawObj.canvas.isDrawingMode = false;

          main.drawObj.canvas.selection = true;
          main.drawObj.setSelectable(true);
          break;
        case 1:
          main.drawObj.canvas.isDrawingMode = true;
          main.drawObj.shape = null;
          main.drawObj.setSelectable(false);
          break;
        case 2:
          main.drawObj.canvas.isDrawingMode = false;
          main.drawObj.shape = "rect";
          main.drawObj.setSelectable(false);
          $("#background_area").css("display", "block");
          $("#font_area").css("display", "block");
          $("#font_style").css("display", "block");
          $("#font_size").css("display", "block");
          break;
        case 3:
          main.drawObj.canvas.isDrawingMode = false;
          main.drawObj.shape = "arrow";
          main.drawObj.setSelectable(false);
          break;
        case 4:
          $("#font_area").css("display", "block");
          $("#font_style").css("display", "block");
          $("#font_size").css("display", "block");

          main.drawObj.canvas.isDrawingMode = false;
          main.drawObj.shape = "text";
          main.drawObj.setSelectable(false);
          break;
        case 5:
          main.drawObj.canvas.isDrawingMode = false;
          main.drawObj.shape = "ruler";
          main.drawObj.setSelectable(false);
          break;
        case 6:
          $("#font_area").css("display", "block");
          $("#font_style").css("display", "block");
          $("#font_size").css("display", "block");
          $("#background_area").css("display", "block");

          main.drawObj.canvas.isDrawingMode = false;
          main.drawObj.shape = "comment";
          main.drawObj.setSelectable(false);
          break;
        case 7:
          main.drawObj.shape = "highlight";
          $("#viewer")
            .children(".page:nth-child(" + main.pdfObj.page_num + ")")
            .children(".page-container")
            .css({
              "z-index": "999"
            });
          break;
        case 8:
          $("#font_area").css("display", "block");
          $("#font_style").css("display", "block");
          $("#font_size").css("display", "block");
          $("#background_area").css("display", "block");

          main.drawObj.canvas.isDrawingMode = false;
          main.drawObj.shape = "attach";
          main.drawObj.setSelectable(false);
          break;
        case 9:
          main.drawObj.canvas.isDrawingMode = false;
          main.drawObj.shape = "picture";
          main.drawObj.setSelectable(false);
          break;
        case 10:
          $("#font_area").css("display", "block");
          $("#font_style").css("display", "block");
          $("#font_size").css("display", "block");
          break;
        case 11:
          $("#background_area").css("display", "block");
          break;
      }
    });

    $(".expand").on("click", function () {
      if (
        $(this)
        .children("ul")
        .hasClass("show")
      ) {
        $(this)
          .children("ul")
          .removeClass("show");
      } else {
        $(this)
          .children("ul")
          .addClass("show");
      }
    });

    $("#arrow_list li").on("click", function (evt) {
      var src = $(this)
        .children("img")
        .attr("src");
      var txt = $(this)
        .children("p")
        .html();
      var type = $(this).attr("mode");

      $(this)
        .parent()
        .parent()
        .children("img")
        .attr("src", src);
      $(this)
        .parent()
        .parent()
        .children("p")
        .html(txt);

      $("#arrow_list").removeClass("show");

      main.drawObj.arrowType = type;
      main.selTool = $(this)
        .children("p")
        .attr("tool");

      $(this)
        .parents("dd")
        .children("p")
        .attr("tool", main.selTool);
      evt.stopPropagation();
    });

    $("#comment_list li").on("click", function (evt) {
      var src = $(this)
        .children("img")
        .attr("src");
      var txt = $(this)
        .children("p")
        .html();
      var type = $(this).attr("mode");

      //$(this).parent().parent().children("img").attr('src', src);
      //$(this).parent().parent().children("p").html(txt);

      $("#comment_list").removeClass("show");

      main.selTool = $(this)
        .children("p")
        .attr("tool");
      $(this)
        .parents("dd")
        .children("p")
        .attr("tool", main.selTool);

      if (type == 0) {
        main.drawObj.shape = "comment";
      } else {
        main.drawObj.shape = "attach";
      }

      evt.stopPropagation();
    });

    $("#btn_insert_url").on("click", function () {
      main.showPopup("popup_url");
    });

    $("#btn_insert_img").on("click", function () {
      var filename = $("#txt_url").val();

      canvasZoom = main.canvas.getZoom();
      cPosX =
        ($("#popup_area").offset().left -
          $(".canvas-container").offset().left) /
        canvasZoom;
      cPosY =
        ($("#popup_area").offset().top - $(".canvas-container").offset().top) /
        canvasZoom;

      var param = {
        src: filename,
        selectable: true,
        isFront: 1,
        left: cPosX,
        top: cPosY
      };

      main.drawObj.addImage(param);
      main.hidePopup();
    });
    // show_popupmenu
    $(document).on("contextmenu", function (evt) {
      $("#context_menu").css("top", evt.pageY + "px");
      $("#context_menu").css("left", evt.pageX + "px");
      $("#context_menu").css("display", "none");
      $("#context_menu").fadeIn();

      $("#context_menu").removeClass("disabled");

      if (!main.drawObj.canvas.getActiveObject()) {
        $("#context_menu").addClass("disabled");
      }

      if (main.drawObj.clipboard) {
        $("#context_menu li:nth-child(3)").addClass("enabled");
        $("#context_menu li:nth-child(3)").removeClass("disabled");
      } else {
        $("#context_menu li:nth-child(3)").removeClass("enabled");
        $("#context_menu li:nth-child(3)").addClass("disabled");
      }

      $("#context_menu li:nth-child(1)").removeClass("disabled");
      if (main.drawObj.canvas.getActiveObject()) {
        switch (main.drawObj.canvas.getActiveObject().type_of) {
          case "path":
          case "arrow":
          case "ruler_group":
            $("#context_menu li:nth-child(1)").addClass("disabled");
            break;
        }
      }

      evt.stopPropagation();
      evt.preventDefault();
    });

    $("#context_menu li").on("click", function (evt) {
      if ($(this).hasClass("disabled")) return;

      switch ($(this).index()) {
        case 0:
          var obj = main.drawObj.canvas.getActiveObject();

          canvasZoom = main.drawObj.canvas.getZoom();
          hPosX = $(".canvas-container").offset().left + obj.left * canvasZoom;
          hPosY = $(".canvas-container").offset().top + obj.top * canvasZoom;
          //	alert(obj);
          switch (obj.type_of) {
            case "text":
              main.drawObj.drawObj = obj;
              main.drawObj.drawObj.enterEditing();
              break;
            case "rect":
              break;
            case "comment":
              main.drawObj.drawObj = obj;
              hWidth = main.drawObj.drawObj._objects[0].width * canvasZoom;
              hHeight = main.drawObj.drawObj._objects[0].height * canvasZoom;

              $("#popup_text textarea").val(
                main.drawObj.drawObj._objects[1].text
              );
              main.drawObj.drawObj._objects[1].text = "";
              $("#popup_text textarea").css({
                "font-size": main.drawObj.fontSize * canvasZoom
              });
              $("#popup_text textarea").css({
                padding: 5 / canvasZoom + "px"
              });
              $("#popup_text textarea").css({
                "font-family": main.drawObj.fontFamily
              });
              if (main.drawObj.fontStyle == "Bold") {
                $("#popup_text textarea").css({
                  "font-style": "normal"
                });
                $("#popup_text textarea").css({
                  "font-weight": main.drawObj.fontStyle
                });
              } else {
                $("#popup_text textarea").css({
                  "font-style": main.drawObj.fontStyle
                });
                $("#popup_text textarea").css({
                  "font-weight": "normal"
                });
              }

              $("#popup_text textarea").css({
                color: main.drawObj.drawColor
              });

              $("#popup_area").css("left", hPosX + "px");
              $("#popup_area").css("top", hPosY + "px");
              $("#popup_text textarea").focus();
              $("#popup_text textarea").css("width", hWidth + "px");
              $("#popup_text textarea").css("height", hHeight + "px");

              var resizeObj = main.drawObj.drawObj._objects[0];

              $("#popup_text textarea").mouseup(function () {
                canvasZoom = main.drawObj.canvas.getZoom();
                width = $(this).width() + 10; // think the padding (3px)
                height = $(this).height() + 10; // think the padding (3px)
                resizeObj.width = width / canvasZoom;
                resizeObj.height = height / canvasZoom;
                main.drawObj.canvas.renderAll();
              });

              main.showPopup("popup_text");
              break;
          }
          main.drawObj.canvas.deactivateAll();
          main.drawObj.canvas.renderAll();
          break;
        case 1:
          main.drawObj.copy();
          break;
        case 2:
          zoom = main.drawObj.canvas.getZoom();
          xPos =
            $("#context_menu").offset().left -
            $(".canvas-container").offset().left;
          yPos =
            $("#context_menu").offset().top -
            $(".canvas-container").offset().top;
          main.drawObj.paste(xPos / zoom, yPos / zoom);
          break;
        case 3:
          main.drawObj.delete();
          main.hidePopup();
          break;
        case 4:
          break;
      }

      $("#context_menu").css("display", "none");
    });

    $("#viewer").on("mouseup", ".page-container", function (evt) {
      main.highlight();
      main.clearSelection();
      evt.preventDefault();
    });

    $("#btn_set").on("click", function () {
      var total_in = $("#txt_real_size").val();

      if (
        $("#popup_scale")
        .find(":checked")
        .val() == "ft"
      ) {
        total_in = $("#txt_real_size").val() * 12;
      }

      main.drawObj.rulerScale = total_in / main.drawObj.line_dist;
      main.drawObj.unit = "in";
      main.drawObj.drawObj._objects[1].set({
        text: "Length : " +
          main.drawObj.rulerLabel(
            main.drawObj.line_dist,
            main.drawObj.rulerScale
          )
      });
      main.drawObj.canvas.renderAll();
      main.hidePopup();
    });

    $("#tool_area dd").on("click", function () {
      var index = $(this).index();

      if (index == 1) {
        main.scale -= 0.1;
      } else {
        main.scale += 0.1;
      }
      var page = main.pdfObj.curr_page;
      var viewport = page.getViewport(main.scale);
      var context = main.pdfObj.curr_context;

      context.viewport = viewport;
      page.render(context);
      main.drawObj.canvas.setZoom(main.scale);
      main.drawObj.canvas.renderAll();
      main.reposEdit();
    });
  };

  main.reposEdit = function () {
    if (
      $("#popup_area").css("display") == "block" &&
      $("#popup_area")
      .find("#popup_text")
      .hasClass("active") &&
      main.drawObj.drawObj
    ) {
      canvasZoom = main.drawObj.canvas.getZoom();
      hPosX =
        $(".canvas-container").offset().left +
        main.drawObj.drawObj.left * canvasZoom;
      hPosY =
        $(".canvas-container").offset().top +
        main.drawObj.drawObj.top * canvasZoom;
      hWidth = main.drawObj.drawObj._objects[0].width * canvasZoom;
      hHeight = main.drawObj.drawObj._objects[0].height * canvasZoom;

      $("#popup_text textarea").css({
        "font-size": main.drawObj.fontSize * canvasZoom
      });
      $("#popup_text textarea").css({
        padding: 5 * canvasZoom + "px"
      });
      $("#popup_text textarea").css({
        "font-family": main.drawObj.fontFamily
      });
      if (main.drawObj.fontStyle == "Bold") {
        $("#popup_text textarea").css({
          "font-style": "normal"
        });
        $("#popup_text textarea").css({
          "font-weight": main.drawObj.fontStyle
        });
      } else {
        $("#popup_text textarea").css({
          "font-style": main.drawObj.fontStyle
        });
        $("#popup_text textarea").css({
          "font-weight": "normal"
        });
      }

      $("#popup_text textarea").css({
        color: main.drawObj.drawColor
      });

      $("#popup_area").css("left", hPosX + "px");
      $("#popup_area").css("top", hPosY + "px");
      $("#popup_text textarea").focus();
      $("#popup_text textarea").css("width", hWidth + "px");
      $("#popup_text textarea").css("height", hHeight + "px");
    }
  };

  main.highlight = function () {
    // console.clear();
    var range = window.getSelection().getRangeAt(0),
      parent = range.commonAncestorContainer,
      start = range.startContainer,
      end = range.endContainer;
    var startDOM =
      start.parentElement == parent ? start.nextSibling : start.parentElement;
    var currentDOM = startDOM.nextElementSibling;
    var endDOM = end.parentElement == parent ? end : end.parentElement;
    //Process Start Element
    main.highlightText(startDOM, "START", range.startOffset);
    while (currentDOM != endDOM && currentDOM != null) {
      main.highlightText(currentDOM);
      currentDOM = currentDOM.nextElementSibling;
    }
    //Process End Element
    main.highlightText(endDOM, "END", range.endOffset);
  };

  main.highlightText = function (elem, offsetType, idx) {
    if (elem.nodeType == 3) {
      var span = document.createElement("span");
      span.setAttribute("class", "highlight");
      var origText = elem.textContent,
        text,
        prevText,
        nextText;
      if (offsetType == "START") {
        text = origText.substring(idx);
        prevText = origText.substring(0, idx);
      } else if (offsetType == "END") {
        text = origText.substring(0, idx);
        nextText = origText.substring(idx);
      } else {
        text = origText;
      }
      span.textContent = text;

      var parent = elem.parentElement;
      parent.replaceChild(span, elem);
      if (prevText) {
        var prevDOM = document.createTextNode(prevText);
        parent.insertBefore(prevDOM, span);
      }
      if (nextText) {
        var nextDOM = document.createTextNode(nextText);
        //parent.appendChild(nextDOM);
        parent.insertBefore(nextDOM, span.nextSibling);
        //parent.insertBefore(span, nextDOM);
      }
      return;
    }
    var childCount = elem.childNodes.length;

    for (var i = 0; i < childCount; i++) {
      if (offsetType == "START" && i == 0)
        main.highlightText(elem.childNodes[i], "START", idx);
      else if (offsetType == "END" && i == childCount - 1)
        main.highlightText(elem.childNodes[i], "END", idx);
      else main.highlightText(elem.childNodes[i]);
    }
  };

  main.clearSelection = function () {
    if (window.getSelection) {
      window.getSelection().removeAllRanges();
    } else if (document.selection) {
      document.selection.empty();
    }
  };

  main.initUploader = function () {
    var btn = document.getElementById("btn_file_upload");
    var uploader = new ss.SimpleUpload({
      button: btn,
      url: "php/file_upload.php",
      name: "uploadfile",
      multipart: true,
      hoverClass: "hover",
      focusClass: "focus",
      responseType: "json",

      onComplete: function (filename, response) {
        cPosX =
          ($("#popup_area").offset().left -
            $(".canvas-container").offset().left) /
          canvasZoom;
        cPosY =
          ($("#popup_area").offset().top -
            $(".canvas-container").offset().top) /
          canvasZoom;

        var param = {
          src: "tmp/" + filename,
          selectable: true,
          isFront: 1,
          left: cPosX,
          top: cPosY
        };

        main.drawObj.drawObj.src = "tmp/" + filename;
        $("#popup_image img").attr("src", "tmp/" + filename);
        $("#popup_image img").css("width", "320px");
        $("#popup_image img").css("height", "240px");
        main.hidePopup();
        main.showPopup("popup_image");
      },
      onError: function () {
        console.log("error");
      }
    });

    var btn1 = document.getElementById("btn_attach_upload");
    var uploader1 = new ss.SimpleUpload({
      button: btn1,
      url: "php/file_upload.php",
      name: "uploadfile",
      multipart: true,
      hoverClass: "hover",
      focusClass: "focus",
      responseType: "json",

      onComplete: function (filename, response) {
        $("#popup_attach object").attr("data", "tmp/" + filename);

        $("#attach_file").attr("href", "tmp/" + filename);
        $("#attach_file").html("File : " + filename);

        main.drawObj.drawObj.src = "tmp/" + filename;
        main.drawObj.drawObj.file = filename;
        // $("#popup_image img").attr("src", "tmp/" + filename);

        // main.hidePopup();
        // main.showPopup("popup_image");
      },
      onError: function () {
        console.log("error");
      }
    });
  };

  main.initColors = function () {
    $("#color_area").css("background-color", main.drawColor);
    $("#color_background").css("background-color", main.backColor);

    $("#color_area")
      .parent()
      .ColorPicker({
        onChange: function (color, hex) {
          $("#color_area").css("background-color", "#" + hex);
          $("#popup_text textarea").css({
            color: "#" + hex
          });

          main.drawObj.drawColor = "#" + hex;
          main.drawObj.canvas.freeDrawingBrush.color = main.drawObj.drawColor;
          if (main.drawObj.drawObj) {
            _setForeColor(main.drawObj.drawObj);
          }
          if (main.drawObj.selectObj) {
            _setForeColor(main.drawObj.selectObj);
          }

          main.drawObj.canvas.renderAll();

          function _setForeColor(obj) {
            if (obj._objects) {
              obj._objects.forEach(element => {
                __setForeColor(element);
              });
            } else {
              __setForeColor(obj);
            }

            function __setForeColor(obj) {
              if (obj.type) {
                switch (obj.type) {
                  case "text":
                    obj.set("fill", main.drawObj.drawColor);
                    break;
                  case "path":
                    obj.set("stroke", main.drawObj.drawColor);
                    break;
                }
              }
            }
          }
        }
      })
      .ColorPickerSetColor(main.drawColor);

    $("#color_background")
      .parent()
      .ColorPicker({
        onChange: function (color, hex) {
          $("#color_background").css("background-color", "#" + hex);
          main.drawObj.backColor = "#" + hex;
          if (main.drawObj.drawObj) {
            _setBackColor(main.drawObj.drawObj);
          }
          if (main.drawObj.selectObj) {
            _setBackColor(main.drawObj.selectObj);
          }
          main.drawObj.canvas.renderAll();

          function _setBackColor(obj) {
            if (obj._objects) {
              obj._objects.forEach(element => {
                __setBackColor(element);
              });
            } else {
              __setBackColor(obj);
            }

            function __setBackColor(obj) {
              if (obj.type) {
                switch (obj.type) {
                  case "background":
                    obj.set("fill", main.drawObj.backColor);
                    break;
                  case "bg_stroke":
                    obj.set("stroke", main.drawObj.backColor);
                    break;
                }
              }
            }
          }
        }
      })
      .ColorPickerSetColor(main.backColor);
  };
  main.showPopup = function (id) {
    $("#popup_area").css("display", "block");
    $("#popup_area")
      .find(".active")
      .removeClass("active");
    $("#popup_area")
      .find("#" + id)
      .addClass("active");
  };

  main.hidePopup = function () {
    $("#popup_area").css("display", "none");
    $("#popup_area")
      .find(".active")
      .removeClass("active");
  };

  main.initSizes = function () {
    var length = $("#size_list").children("li").length * 50;

    $("#size_list").css("width", length + "px");
    $("#size_list")
      .find(".border_line")
      .each(function () {
        var size = $(this)
          .parent()
          .attr("mode");

        $(this).css("height", size + "px");
        $(this).css("margin-top", 19 - size + "px");
      });

    $("#size_list")
      .children("li")
      .on("click", function () {
        main.drawObj.drawSize = $(this).attr("mode");
        main.drawObj.canvas.freeDrawingBrush.width = main.drawObj.drawSize;
      });
  };

  main.initFonts = function () {
    var font_arr = ["Arial Black", "Cursive", "Sans-serif"];
    var font_html = "";
    var height = $("#font_area li").length * 35;

    for (var i = 0; i < font_arr.length; i++) {
      font_html += "<li>" + font_arr[i] + "</li>";
    }

    $("#font_area ul").html(font_html);
    $("#font_area ul").css("height", height + "px");

    $("#font_area li").on("click", function () {
      $("#font_area h5").html($(this).html());
      main.drawObj.fontFamily = $(this).html();
      $("#popup_text textarea").css({
        "font-family": $(this).html()
      });

      if (main.drawObj.drawObj) {
        _setFontFamily(main.drawObj.drawObj);
      }
      if (main.drawObj.selectObj) {
        _setFontFamily(main.drawObj.selectObj);
      }

      function _setFontFamily(obj) {
        if (obj._objects) {
          obj._objects.forEach(element => {
            __setFontFamily(element);
          });
        } else {
          __setFontFamily(obj);
        }

        main.drawObj.canvas.renderAll();

        function __setFontFamily(obj) {
          if (obj.type) {
            switch (obj.type) {
              case "text":
                obj.fontFamily = main.drawObj.fontFamily;
                break;
            }
          }
        }
      }
    });

    $("#font_style li").on("click", function () {
      $("#font_style h5").html($(this).html());
      main.drawObj.fontStyle = $(this).html();

      if (main.drawObj.fontStyle == "Bold") {
        $("#popup_text textarea").css({
          "font-style": "normal"
        });
        $("#popup_text textarea").css({
          "font-weight": main.drawObj.fontStyle
        });
      } else {
        $("#popup_text textarea").css({
          "font-style": main.drawObj.fontStyle
        });
        $("#popup_text textarea").css({
          "font-weight": "normal"
        });
      }
      if (main.drawObj.drawObj) {
        _setFontStyle(main.drawObj.drawObj);
      }
      if (main.drawObj.selectObj) {
        _setFontStyle(main.drawObj.selectObj);
      }

      function _setFontStyle(obj) {
        if (obj._objects) {
          obj._objects.forEach(element => {
            __setFontStyle(element);
          });
        } else {
          __setFontStyle(obj);
        }

        main.drawObj.canvas.renderAll();

        function __setFontStyle(obj) {
          if (obj.type) {
            switch (obj.type) {
              case "text":
                obj.fontStyle = main.drawObj.fontStyle;
                break;
            }
          }
        }
      }
    });

    $("#font_size li").on("click", function () {
      $("#font_size h5").html($(this).html());
      main.drawObj.fontSize = $(this).html();
      $("#popup_text textarea").css({
        "font-size": main.drawObj.fontSize
      });

      if (main.drawObj.drawObj) {
        _setFontSize(main.drawObj.drawObj);
      }
      if (main.drawObj.selectObj) {
        _setFontSize(main.drawObj.selectObj);
      }

      function _setFontSize(obj) {
        if (obj._objects) {
          obj._objects.forEach(element => {
            __setFontSize(element);
          });
        } else {
          __setFontSize(obj);
        }

        main.drawObj.canvas.renderAll();

        function __setFontSize(obj) {
          if (obj.type) {
            switch (obj.type) {
              case "text":
                obj.fontSize = main.drawObj.fontSize;
                break;
            }
          }
        }
      }
    });
    $('#saveData').on('click', () => {      
      json_data = JSON.stringify(main.drawObj.canvas.toJSON());
      main.drawObj.canvas.clear();      
      localStorage.setItem('SaveJSON', json_data);
    })
    $('#loadData').on('click', () => {
      var json = localStorage.getItem('SaveJSON');      
      var canvas = main.drawObj.canvas;      
      canvas.loadFromJSON(JSON.parse(json), canvas.renderAll.bind(canvas), function (o, object) {        
      });
    });
  };
};