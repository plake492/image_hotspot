const initApp = () => {
  const imgWrapper = document.querySelector('.img-container');
  const dragArea = document.querySelector('.droparea');
  const overlay = document.querySelector('.overlay');
  const readout = document.querySelector('.readout');

  let coords = [];
  let dotId = 1;

  const removeDot = (e) => {
    const elId = e.target.dataset.id;
    coords = coords.filter(({ id }) => id !== parseInt(elId));
    console.log('coords ==>', coords);
    console.log('elId ==>', elId);
    gerateHotSpot();
  };

  const gerateHotSpot = () => {
    readout.innerHTML = '';
    overlay.innerHTML = '';

    coords.forEach(({ x, y, id }, i) => {
      const dotEl = document.createElement('div');
      dotEl.classList.add('dot');
      dotEl.style.left = x + '%';
      dotEl.style.top = y + '%';
      dotEl.textContent = i + 1;

      overlay.appendChild(dotEl);

      const el = document.createElement('div');
      el.classList.add('readout__item');

      const titleEl = document.createElement('div');
      titleEl.textContent = 'Dot #' + (i + 1);

      const xEl = document.createElement('div');
      xEl.textContent = 'X Percentage: ' + x;

      const yEl = document.createElement('div');
      yEl.textContent = 'Y Percentage: ' + y;

      const closeEl = document.createElement('button');
      closeEl.classList.add('readout__remove');
      closeEl.textContent = 'X';
      closeEl.dataset.id = id;
      closeEl.addEventListener('click', removeDot);

      el.appendChild(titleEl);
      el.appendChild(xEl);
      el.appendChild(yEl);
      el.appendChild(closeEl);

      readout.appendChild(el);
    });
  };

  const getImagePosition = (e) => {
    const xPos = e.clientX;
    const yPos = e.clientY;
    const rect = e.target.getBoundingClientRect();

    const pxPosX = Math.abs(xPos - rect.left);
    const pxPosY = Math.abs(yPos - rect.top);

    const percentageX = ((pxPosX / rect.width) * 100).toFixed(3);
    const percentageY = ((pxPosY / rect.height) * 100).toFixed(3);

    const coord = { id: dotId, x: percentageX, y: percentageY };
    coords.push(coord);
    gerateHotSpot();

    dotId++;
  };

  const generatePreveiwImage = (src) => {
    const imgEl = document.createElement('img');
    imgEl.src = src;
    imgWrapper.appendChild(imgEl);
  };

  const handleDrop = (e) => {
    const dt = e.dataTransfer;
    const [file] = dt.files;
    const src = URL.createObjectURL(file);

    localStorage.setItem('src', src);
    generatePreveiwImage(src);
  };

  const activeState = (e) => {
    e.target.style.borderColor = 'green';
  };
  const inactiveState = (e) => {
    e.target.style.borderColor = '#020202';
  };
  const prevents = (e) => e.preventDefault();

  imgWrapper.addEventListener('click', getImagePosition);

  ['dragenter', 'dragover', 'dragleave', 'drop'].forEach((event) =>
    dragArea.addEventListener(event, prevents)
  );

  ['dragenter', 'dragover'].forEach((event) =>
    dragArea.addEventListener(event, activeState)
  );

  ['dragleave', 'drop'].forEach((event) =>
    dragArea.addEventListener(event, inactiveState)
  );

  dragArea.addEventListener('drop', handleDrop);
};

document.addEventListener('DOMContentLoaded', initApp);
