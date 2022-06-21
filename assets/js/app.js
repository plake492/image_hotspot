const initApp = () => {
  const imgWrapper = document.querySelector('.img-container');
  const dragArea = document.querySelector('.droparea');
  const fileInput = document.querySelector('.file-input');
  const overlay = document.querySelector('.overlay');
  const readout = document.querySelector('.readout');

  let coords = [];
  let dotId = 1;

  let imagePresent = false;

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
      xEl.innerHTML = `X Percentage: <span class="highlight">${x}</span>`;

      const yEl = document.createElement('div');
      yEl.innerHTML = `Y Percentage: <span  class="highlight">${y}</span>`;

      const closeEl = document.createElement('button');
      closeEl.classList.add('readout__remove');
      closeEl.innerHTML = '&#215;';
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
    imgEl.classList.add('generated-img');
    imgEl.src = src;
    imgWrapper.appendChild(imgEl);
  };

  const updateImage = (src) => {
    const targetImgEl = document.querySelector('.generated-img');
    targetImgEl.src = src;
    coords = [];
    gerateHotSpot();
  };

  const handleDrop = (e, type) => {
    let src;

    if (type === 'drop') {
      const dt = e.target?.files || e.dataTransfer;
      console.log('dt ==>', dt);
      const [file] = dt.files;
      src = URL.createObjectURL(file);
    } else {
      const [file] = e.target.files;
      if (file) {
        src = URL.createObjectURL(file);
      }
    }

    if (imagePresent) {
      return updateImage(src);
    }
    generatePreveiwImage(src);
    imagePresent = true;
  };

  const activeState = (e) => {
    e.target.style.backgroundColor = '#a4a4a4';
  };
  const inactiveState = (e) => {
    e.target.removeAttribute('style');
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

  dragArea.addEventListener('drop', (e) => handleDrop(e, 'drop'));
  fileInput.addEventListener('change', (e) => handleDrop(e, 'upload'));
};

document.addEventListener('DOMContentLoaded', initApp);
