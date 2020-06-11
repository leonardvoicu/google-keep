function createEl(element, classes = []) {
  const el = document.createElement(element);
  if (classes.length) {
    classes.forEach((cls) => {
      el.classList.add(cls);
    });
  }
  return el;
}

const encodeImageFileAsURL = (element) => {
  const file = element.files[0];
  const reader = new FileReader();
  reader.readAsDataURL(file);
  return reader;
};

function autoHeight(e) {
  const el = e.currentTarget;
  setTimeout(function () {
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, 0);
}
