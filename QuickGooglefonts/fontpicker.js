//font by ID
async function setFontID(id) {
  try {
    // 1. Fetch the mapping file and wait for the response
    const response = await fetch('https://raw.githubusercontent.com/andy-and-terry/littleplugins/refs/heads/plugins-data/QuickGooglefonts/font_id.json');
    const fontList = await response.json();

    // 2. Find the array pair matching your ID
    const match = fontList.find(item => item[0] === id);
    
    // Exit if the ID isn't found in your JSON file
    if (!match) {
      alert(`Font ID "${id}" not found; please check your code`);
      return;
    }

    const cssFile = match[1]; // Extracts the CSS filename (e.g., "nuito.css")

    // 3. Skip if this exact stylesheet is already loaded
    if (document.querySelector(`link[href="${cssFile}"]`)) {
      return; 
    }

    // 4. Create the link element and append it to the head
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = cssFile;
    document.head.appendChild(link);
    
    console.log(`Success: ${cssFile}`);

  } catch (err) {
    // Catches network errors or broken JSON files
    alert("Font Error, this is nothing to do with you unless it's your internet. Error: ", err);
  }
}
//default font
function setFontDEFAULT() {
  document.body.style.fontFamily = "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
}
