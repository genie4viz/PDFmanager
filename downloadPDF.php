<?php
	$url = 'https://dev.virtuele.us/downloadFile';
	$fields = array(
		'encryptedlocation' => urldecode('9zbBuFICm%252FLjHT4txpkJBd3YP6zsmILUfJCWpN7moOdDn%252BYzAyKvCG2P3WZS2%252FYnpnTHR0jB%252BHtGcKh6yvp33cnCoLOB3OXx3TMXjBIFbReSUjsVNHikT0297XvvYAdq5VFd1GQWX5JPbX1mQqUuOQ%253D%253D'),
		'filename' => 'S-107.pdf'
		
		);

	//open connection
	$ch = curl_init();
	$fields_string = http_build_query($fields);
	//set options 
	curl_setopt($ch, CURLOPT_HTTPHEADER, array("Content-type: multipart/form-data"));
	curl_setopt($ch, CURLOPT_URL,$url);
	curl_setopt($ch,CURLOPT_POST,count($fields));
	curl_setopt($ch,CURLOPT_POSTFIELDS,$fields);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

	//execute post
	$result = curl_exec($ch);

	$myfile = fopen("pdf/test.pdf", "w") or die("Unable to open file!");

	fwrite($myfile, $result);

	//close connection
	curl_close($ch);
?>