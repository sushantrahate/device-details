document.addEventListener('DOMContentLoaded', () => {
  // Debounce function to limit the number of times the details are updated
  function debounce(func, delay) {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), delay);
    };
  }

  // Function to get device type
  function getDeviceType() {
    const width = window.innerWidth;
    if (width <= 768) return 'Mobile';
    else if (width <= 1024) return 'Tablet';
    return 'Laptop/Desktop';
  }

  // Function to get operating system
  function getOS() {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    if (/windows phone/i.test(userAgent)) return 'Windows Phone';
    if (/android/i.test(userAgent)) return 'Android';
    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) return 'iOS';
    if (/Macintosh|Mac OS X/i.test(userAgent)) return 'MacOS';
    if (/Windows NT/i.test(userAgent)) return 'Windows';
    if (/Linux/i.test(userAgent)) return 'Linux';
    return 'Unknown OS';
  }

  // Function to get browser name
  function getBrowserName() {
    const userAgent = navigator.userAgent;
    if (userAgent.indexOf('Firefox') > -1) return 'Mozilla Firefox';
    if (userAgent.indexOf('Chrome') > -1) return 'Google Chrome';
    if (userAgent.indexOf('Safari') > -1 && userAgent.indexOf('Chrome') === -1)
      return 'Safari';
    if (userAgent.indexOf('Edge') > -1) return 'Microsoft Edge';
    if (userAgent.indexOf('Trident') > -1) return 'Internet Explorer';
    return 'Unknown Browser';
  }

  // Function to get device manufacturer
  function getDeviceInfo() {
    const userAgent = navigator.userAgent;
    if (/Samsung/i.test(userAgent)) return 'Samsung';
    if (/Huawei/i.test(userAgent)) return 'Huawei';
    if (/OnePlus/i.test(userAgent)) return 'OnePlus';
    if (/Xiaomi/i.test(userAgent)) return 'Xiaomi';
    if (/iPhone/i.test(userAgent)) return 'Apple';
    if (/Pixel/i.test(userAgent)) return 'Google Pixel';
    return 'Unknown Device';
  }

  // Function to get aspect ratio (simplified to common ratios)
  function getAspectRatio() {
    const width = document.documentElement.clientWidth;
    const height = document.documentElement.clientHeight;

    // Find GCD
    const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));
    const divisor = gcd(width, height);

    const simplifiedWidth = width / divisor;
    const simplifiedHeight = height / divisor;

    // Map simplified ratios to standard ones
    const standardRatios = {
      '4:3': [4, 3],
      '16:9': [16, 9],
      '21:9': [21, 9],
      '3:2': [3, 2],
      '5:4': [5, 4],
    };

    for (const [key, [w, h]] of Object.entries(standardRatios)) {
      if (Math.abs(simplifiedWidth / simplifiedHeight - w / h) < 0.1) {
        return key;
      }
    }

    return `${simplifiedWidth}:${simplifiedHeight}`;
  }

  // Function to get all details
  function getDeviceDetails(userName) {
    return {
      'User Name': userName || 'N/A',
      'Device Type': getDeviceType(),
      'Operating System': getOS(),
      Browser: getBrowserName(),
      Manufacturer: getDeviceInfo(),
      'Browser Resolution (px)': `${document.documentElement.clientWidth} x ${document.documentElement.clientHeight}`,
      'Aspect Ratio': getAspectRatio(),
      'Pixel Ratio': window.devicePixelRatio.toFixed(2),
    };
  }

  // Function to update device details
  function updateDeviceDetails() {
    const userName = document.getElementById('userName').value;
    const details = getDeviceDetails(userName);
    const detailsContainer = document.getElementById('detailsContainer');
    detailsContainer.innerHTML = Object.entries(details)
      .map(
        ([key, value]) =>
          `<div class="text-base"><span class="font-bold">${key}:</span> <span class="font-semibold">${value}</span></div>`
      )
      .join('');
  }

  // Function to capture the device details as an image
  function captureAsImage() {
    const detailsContainer = document.getElementById('deviceDetails');
    html2canvas(detailsContainer).then((canvas) => {
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = 'device-details.png';
      link.click();
    });
  }

  // Attach debounced update function to the input
  const debouncedUpdate = debounce(updateDeviceDetails, 500);
  document
    .getElementById('userName')
    .addEventListener('input', debouncedUpdate);

  // Update device details on window resize
  window.addEventListener('resize', debounce(updateDeviceDetails, 300));

  // Display device details on page load
  window.onload = updateDeviceDetails;

  // Add event listener to the download button
  document
    .getElementById('downloadBtn')
    .addEventListener('click', captureAsImage);
});
