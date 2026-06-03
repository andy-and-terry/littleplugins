const BASE = 'https://andy-and-terry.github.io/littleplugins/QuickGooglefonts/';

async function setFontID(id) {
  try {
    const response = await fetch(BASE + 'font_id.json');
    const fontList = await response.json();

    const match = fontList.find(item => item[0] === id);
    if (!match) {
      alert(`Font ID "${id}" not found; please check your code`);
      return;
    }

    const cssFile = BASE + match[1];

    if (document.querySelector(`link[href="${cssFile}"]`)) return;

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = cssFile;
    document.head.appendChild(link);

    console.log(`Success: ${cssFile}`);

  } catch (err) {
    console.error("Font Error:", err);
    alert("Font Error: " + err.message);
  }
}

function setFontDEFAULT() {
  document.body.style.fontFamily = "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
}
