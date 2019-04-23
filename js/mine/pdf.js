var classManagePDF = function() {
  var main = this;

  main.scale = 1;
  main.page_num = 1;
  main.curr_page = null;
  main.curr_pdfurl = "pdf/test.pdf";

  main.init = function() {
    var ca = document.cookie.split(";");
    var companyid = 0;
    var projectid = 0;
    var scenarioid = 0;
    var uid = 0;
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i].split("=");
      switch (c[0]) {
        case "LoggedInUserCompanyId":
          companyid = c[1];
          break;
        case "projectid":
          projectid = c[1];
          break;
        case "scenarioid":
          scenarioid = c[1];
          break;
        case "LoggedInUserId":
          uid = c[1];
          break;
      }
	}
	
	//main.getJsonMeta(companyid, projectid, scenarioid, "gs.pdf");
	//main.getUserInfo(companyid);
	//main.getComments(989);

    PDFJS.workerSrc = "js/library/pdf.worker.js";
  };

 
  main.viewPDF = function(scale, page_no, callback) {
    main.scale = scale;
    main.page_num = page_no;

    PDFJS.getDocument(main.curr_pdfurl)
      .then(function(pdf) {
        return pdf.getPage(page_no);
      })
      .then(function(page) {
        var viewport = page.getViewport(main.scale);
        var html =
          '<div class="page"><canvas id="canvas_pdf_' +
          page_no +
          '" class="canvas_pdf"></canvas>';
        html +=
          '<canvas id="canvas_fabric_' +
          page_no +
          '" class="canvas_fabric"></canvas></div>';

        $("#viewer").append(html);

        var canvas = document.getElementById("canvas_pdf_" + page_no);
        var context = canvas.getContext("2d");

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        main.obj_draw = new classDraw(
          main.scale,
          "canvas_fabric_" + page_no,
          viewport.width,
          viewport.height
        );
        callback(main.obj_draw);

        var renderContext = {
          canvasContext: context,
          viewport: viewport
        };

        main.curr_page = page;
        main.curr_viewport = viewport;
        main.curr_context = renderContext;

        // Render PDF page
        page.render(renderContext);
        main.viewText(page, viewport, context);
      });
  };

  main.viewText = function(page, viewport, context) {
    var pageContainer = document.createElement("div");

    pageContainer.classList.add("page-container");
    pageContainer.style.width = viewport.width + "px";
    pageContainer.style.height = viewport.height + "px";

    $("#viewer")
      .children(":nth-child(" + main.page_num + ")")
      .css({ width: viewport.width + "px", height: viewport.height + "px" });
    $("#viewer")
      .children(":nth-child(" + main.page_num + ")")
      .get(0)
      .appendChild(pageContainer);

    page.getTextContent().then(function(textContent) {
      textContent.items.forEach(function(textItem) {
        var tx = PDFJS.Util.transform(
          PDFJS.Util.transform(viewport.transform, textItem.transform),
          [1, 0, 0, -1, 0, 0]
        );

        var style = textContent.styles[textItem.fontName];
        var fontSize = Math.sqrt(tx[2] * tx[2] + tx[3] * tx[3]);

        if (style.ascent) {
          tx[5] -= fontSize * style.ascent;
        } else if (style.descent) {
          tx[5] -= fontSize * (1 + style.descent);
        } else {
          tx[5] -= fontSize / 2;
        }

        // adjust for rendered width
        if (textItem.width > 0) {
          context.font = tx[0] + "px " + style.fontFamily;

          var width = context.measureText(textItem.str).width;

          if (width > 0) {
            tx[0] = (textItem.width * viewport.scale) / width;
          }
        }

        var item = document.createElement("span");

        item.textContent = textItem.str;
        item.style.fontFamily = style.fontFamily;
        //item.style.transform = 'matrix(' + tx.join(',') + ')';
        item.style.fontSize = fontSize + "px";
        item.style.transform = "scaleX(" + tx[0] + ")";
        item.style.left = tx[4] + "px";
        item.style.top = tx[5] + "px";

        pageContainer.appendChild(item);
      });
    });
  };

  main.init();
};
