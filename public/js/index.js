function onScanSuccess(decodedText, decodedResult) {
  // Handle on success condition with the decoded text or result.
  // console.log(`Scan result: ${decodedText}`, decodedResult);
  if (decodedResult) {
    // const src = document.querySelector(".qr__code-image").src;
    // socket.emit("result", {
    //   decodedResult,
    //   src,
    // });
    socket.emit("result", decodedResult);
  }
}

function onScanError(errorMessage) {
  // handle on error condition, with error message
}

var html5QrcodeScanner = new Html5QrcodeScanner("reader", {
  fps: 10,
  qrbox: 250,
});
html5QrcodeScanner.render(onScanSuccess, onScanError);
