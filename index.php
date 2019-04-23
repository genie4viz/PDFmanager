<html>
<?php 
	// set cookie
	$loggedInUserCompanyId = (isset($_GET['LoggedInUserCompanyId'])) ? $_GET['LoggedInUserCompanyId'] : "";
	$loggedInUserId = (isset($_GET['LoggedInUserId'])) ? $_GET['LoggedInUserId'] : "";
	$projectId = (isset($_GET['projectId']))? $_GET['projectId']:"";
	$scenarioid = (isset($_GET['scenarioid'])) ? $_GET['scenarioid'] : "";
	header('Access-Control-Allow-Origin: *');
	header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
	setcookie("LoggedInUserCompanyId", 324);
	setcookie("LoggedInUserId", 2362);
	setcookie("projectid", 1891);	
	setcookie("scenarioid", 0);
?>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>Annotation</title>

    <link rel="stylesheet" type="text/css" href="style/style.css" />
    <link rel="stylesheet" type="text/css" href="style/viewer.css" />
    <link rel="stylesheet" type="text/css" href="style/colorpicker.css" />
</head>

<script type="text/javascript" src="js/library/jquery.min.js"></script>
<script type="text/javascript" src="js/library/fabric.min.js"></script>
<script type="text/javascript" src="js/library/pdf.js"></script>
<script type="text/javascript" src="js/library/pdf.worker.js"></script>
<script type="text/javascript" src="js/library/pdf_viewer.js"></script>

<script type="text/javascript" src="js/library/colorpicker.js"></script>
<script type="text/javascript" src="js/library/SimpleAjaxUploader.js"></script>
<script type="text/javascript" src="js/library/textlayerbuilder.js"></script>

<body>
	<div id="header">
		<ul>
			<li>&lt;</li>
			<li>&gt;</li>
			<li>
				<select id="pdf_list">
					<option value="exampe.pdf">Example.pdf</option>
				</select>
			</li>
			<li>
				<select id="page_lsit">
					<option value="page1">Page 1</option>
					<option value="page2">Page 2</option>
				</select>
			</li>			
			<input type='button' id='saveData' value='Save' />			
			<input type='button' id='loadData' value='Load' />
		</ul>
	</div>
	<div id="viewer"></div>
	<div id="popup_area">
		<div id="popup_text" class="popup">
			<textarea></textarea>
		</div>
		<div id="popup_picture" class="popup">
			<ul>
				<li id="btn_file_upload">
					Image from File
				</li>
				<!--li id="btn_insert_url">
					Image from URL
				</li-->
			</ul>
		</div>
		<div id="popup_attach" class="popup">
			<p id="btn_attach_upload">Upload a File</p>
			<object></object>
			<a href="#" id="attach_file"></a>
		</div>
		<div id="popup_url" class="popup">
			URL : <input type="text" id="txt_url" placeholder="http://www.google.com">
			<input type="button" id="btn_insert_img" value="Insert">
		</div>
		<div id="popup_scale" class="popup">
			<section>
				<span>Real Size : </span>
				<input type="text" id="txt_real_size">
			</section>
			<section>
				<label><input type="radio" name="radio_unit" checked="" value="in">Inch</label>
				<label><input type="radio" name="radio_unit" value="ft">Feet</label>
				<input type="button" id="btn_set" value="Set Size">
			</section>
		</div>
		<div id="popup_image" class="popup">
			<img src="#">
		</div>
	</div>
	<div id="context_menu">
		<ul>
			<li>Edit</li>
			<li>Copy</li>
			<li>Paste</li>
			<li>Delete</li>
			<li>Private</li>
		</ul>
	</div>
	<div id="menu_area">
		<dl>
			<dd>
				<img src="img/icon_hand.png">
				<p tool="select">Select</p>
			</dd>
			<dd class="expand">
				<img src="img/icon_pen.png">
				<p tool="draw">Draw</p>
				<ul id="size_list">
					<li mode="1">
						<div class="border_line"></div>
						<p>1px</p>
					</li>
					<li mode="2">
						<div class="border_line"></div>
						<p>2px</p>
					</li>
					<li mode="3">
						<div class="border_line"></div>
						<p>3px</p>
					</li>
					<li mode="4">
						<div class="border_line"></div>
						<p>4px</p>
					</li>
					<li mode="5">
						<div class="border_line"></div>
						<p>5px</p>
					</li>
				</ul>
			</dd>
			<dd>
				<img src="img/icon_box.png">
				<p tool="box">Cloud</p>
			</dd>
			<dd class="expand">
				<img src="img/icon_arrow.png">
				<p tool="arrow">Arrow</p>
				<ul id="arrow_list">
					<li mode="0">
						<img src="img/icon_arrow.png">
						<p tool="arrow">Arrow</p>
					</li>
					<li mode="1">
						<img src="img/icon_line.png">
						<p tool="line">Line</p>
					</li>
					<li mode="2">
						<img src="img/icon_double.png">
						<p tool="double">Arrow</p>
					</li>
				</ul>
			</dd>
			<dd>
				<img src="img/icon_text.png">
				<p tool="text">Text</p>
			</dd>
			<dd>
				<img src="img/icon_ruler.png">
				<p tool="measure">Measure</p>
			</dd>
      <dd>
        <img src="img/icon_pin.png">
        <p tool="comment">Comment</p>
      </dd>
			<dd>
				<img src="img/icon_mark.png">
				<p tool="highlight">Highlight</p>
			</dd>
      <dd>
        <img src="img/icon_attach.png">
        <p tool="highlight">Attach</p>
      </dd>	
			<dd>
				<img src="img/icon_picture.png">
				<p tool="image">Image</p>
			</dd>
			<dd class="expand">
				<h3 id="color_area"></h3>
				<p>Stroke</p>
			</dd>
			<dd class="expand" id="background_area">
				<h3 id="color_background"></h3>
				<p>Background</p>
			</dd>
			<dd id="font_area" class="expand">
				<h5>Arial</h5>
				<ul>
					<li>Arial</li>
					<li>Cursive</li>
					<li>Sans-serif</li>
				</ul>
			</dd>
			<dd id="font_style" class="expand">
				<h5>Normal</h5>
				<ul>
					<li>Normal</li>
					<li>Bold</li>
					<li>Italic</li>
				</ul>
			</dd>
			<dd id="font_size" class="expand">
				<h5>15</h5>
				<ul>
					<li>8</li>
					<li>9</li>
					<li>10</li>
					<li>11</li>
					<li>12</li>
					<li>13</li>
					<li>14</li>
					<li>15</li>
					<li>16</li>
					<li>17</li>
					<li>18</li>
					<li>19</li>
					<li>20</li>
					<li>25</li>
					<li>30</li>
				</ul>
			</dd>
		</dl>
	</div>
	<div id="menu_other">
		<dl>
			<dd>Filter</dd>
			<dd>History</dd>
		</dl>
	</div>
	<div id="tool_area">
		<dl>
			<dd><img src="img/icon_zoomin.png"></dd>
			<dd><img src="img/icon_zoomout.png"></dd>
		</dl>
	</div>
	<script type="text/javascript" src="js/mine/draw.js"></script>
	<script type="text/javascript" src="js/mine/pdf.js"></script>
	<script type="text/javascript" src="js/mine/main.js"></script>

</body>
