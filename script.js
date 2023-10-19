document.addEventListener('DOMContentLoaded', function () {
  const fileInput = document.getElementById('fileInput');
  const treeContainer = document.getElementById('treeContainer');

  fileInput.addEventListener('change', function (event) {
    const selectedFile = event.target.files[0];
    if (selectedFile && selectedFile.type === 'application/json') {
      const reader = new FileReader();
      reader.onload = function (event) {
        const fileContents = event.target.result;

        try {
          JSON.parse(fileContents);

          while (treeContainer.firstChild) {
            treeContainer.removeChild(treeContainer.firstChild);
          }

          displayJsonText(selectedFile, treeContainer);

        } catch (error) {
          alert('Please select a valid JSON file!');
          while (treeContainer.firstChild) {
            treeContainer.removeChild(treeContainer.firstChild);
          }
          return
        }
      };

      reader.readAsText(selectedFile);
    } else {
      alert('Please select a JSON file!');
    }
  });

  async function displayJsonText(file, container) {
    const textDecoder = new TextDecoder();
    const chunkSize = 1024 * 1024 * 5; // 5MB

    let offset = 0;
    while (offset < file.size) {
      const blob = file.slice(offset, offset + chunkSize);

      const chunkBuffer = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.readAsArrayBuffer(blob);
      });

      const chunkText = textDecoder.decode(new Uint8Array(chunkBuffer));
      displayTreeText(chunkText, container);

      offset += chunkSize;
    }
  }

  function displayTreeText(jsonText, container) {
    const lines = jsonText.split('\n');
    const ul = document.createElement('ul');
    lines.forEach((line) => {
      const p = document.createElement('p');
      p.textContent = line;
      p.style.paddingLeft = line.match(/^\s*/)[0].length * 10 + "px"
      ul.appendChild(p);
    });
    container.appendChild(ul);
  }
});
