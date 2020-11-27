var xhr = new XMLHttpRequest();
xhr.open('POST', '<url from your API Gateway>/<stage>/<resource name>');
xhr.onreadystatechange = function(event) {
  console.log(event.target);
}
xhr.send();