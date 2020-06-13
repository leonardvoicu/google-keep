const App = () => {
  const notesSearch = document.querySelector("#js-notes-search");
  const notesNode = document.querySelector("#notes");

  function doSearch(e) {
    const searchValue = e.target.value;
    console.log(`{DoSearch searchValue} => ${searchValue}`);
    search(searchValue);
  }

  function search(word) {
    NotesService.getAll(word).then((res) => {
      console.log(`{Search notes} =>`, res);
      clearNotes();
      displayNotes(res);
    });
  }

  function clearSearch() {
    console.log("{Clear search}");
    notesSearch.value = "";
  }

  function clearNotes() {
    console.log(`{Clear notes}`);
    notesNode.textContent = "";
  }

  function displayNotes(notes) {
    console.log(`{Display notes}`, notes);
    notes.map(renderNote);
  }

  function renderNote(note) {
    console.log(`{Render note} =>`, note);
    const noteNode = renderNoteNode(note);
    notesNode.appendChild(noteNode);
    return notesNode;
  }

  function createContainerNode(bkgColor) {
    const container = createEl("div", ["note"]);
    container.style.backgroundColor = colors[bkgColor];

    return container;
  }
  function createImageNode(note) {
    const imageContainerNode = createEl("div", ["note__image"]);

    const imageNode = createEl("img");
    imageNode.src = note.properties.backgroundImage;

    const imageDeleteNode = createEl("span", [
      "note__image__delete",
      "fa",
      "fa-trash",
    ]);
    imageDeleteNode.addEventListener("click", () => {
      const newNote = { ...note, properties: { backgroundImage: "" } };
      updateNote(newNote);
    });

    imageContainerNode.appendChild(imageDeleteNode);
    imageContainerNode.appendChild(imageNode);

    return imageContainerNode;
  }

  function createBodyNode({ title, text }) {
    const bodyNode = createEl("div", ["note__body"]);

    const titleNode = createTitleNode(title);
    const textNode = createTextNode(text);

    bodyNode.appendChild(titleNode);
    bodyNode.appendChild(textNode);

    return bodyNode;
  }

  function createTitleNode(title) {
    const titleNode = createEl("div", ["note__title"]);
    titleNode.textContent = title;
    return titleNode;
  }

  function createTextNode(text) {
    const textNode = createEl("div", ["note__text"]);
    textNode.textContent = text;
    return textNode;
  }

  function createFooterNode(note) {
    const footerNode = createEl("div", ["note__footer"]);

    const imageUploadNode = createImageUploadNode(note);
    footerNode.appendChild(imageUploadNode);

    const colorsNode = createColorsNode(note);
    footerNode.appendChild(colorsNode);

    const deleteNode = createDeleteNode(note.id);
    footerNode.appendChild(deleteNode);

    return footerNode;
  }

  function createImageUploadNode(note) {
    const imageUploadNode = createEl("span", [
      "note__delete",
      "fa",
      "fa-image",
    ]);
    const imageFileInput = createEl("input");
    imageFileInput.type = "file";
    imageFileInput.accept = "image/*";

    imageFileInput.addEventListener("input", (e) => {
      const imgReader = encodeImageFileAsURL(e.currentTarget);
      imgReader.onloadend = () => {
        const newNote = {
          ...note,
          properties: { ...note.properties, backgroundImage: imgReader.result },
        };
        updateNote(newNote);
      };
    });
    imageUploadNode.addEventListener("click", () => {
      imageFileInput.click();
    });
    return imageUploadNode;
  }

  function createColorsNode(note) {
    const colorsNode = createEl("span", ["note__colors-container"]);

    const colorBoxNode = createColorsBox(note);
    colorsNode.appendChild(colorBoxNode);

    const colorIconNode = createEl("span", ["note__colors", "fa", "fa-circle"]);
    colorsNode.appendChild(colorIconNode);

    return colorsNode;
  }

  function createColorsBox(note) {
    const colorBox = createEl("div", ["note__colors_box"]);
    for (let [key, value] of Object.entries(colors)) {
      const isSelected = note.properties.backgroundColor === key;
      const colorNode = createEl("div", ["note__colors_box__color"]);
      isSelected && colorNode.classList.add("selected");
      colorNode.title = key;
      colorNode.style.backgroundColor = value;
      colorBox.appendChild(colorNode);
      const newNote = {
        ...note,
        properties: { ...note.properties, backgroundColor: key },
      };
      colorNode.addEventListener("click", () => {
        updateNote(newNote);
      });
    }
    return colorBox;
  }

  function createDeleteNode(id) {
    const deleteNode = createEl("span", ["note__delete", "fa", "fa-trash"]);
    deleteNode.addEventListener("click", () => deleteNote(id));
    return deleteNode;
  }

  function renderNoteNode(note) {
    console.log("{Start rendering note}");
    const noteContainer = createContainerNode(note);

    if (!!note.properties.backgroundImage) {
      const noteImageNode = createImageNode(note);
      noteContainer.appendChild(noteImageNode);
    }

    const noteBodyNode = createBodyNode(note);
    noteContainer.appendChild(noteBodyNode);

    const noteFooterNode = createFooterNode(note);
    noteContainer.appendChild(noteFooterNode);

    console.log("{End rendering note}");
    console.log("--------------------------------------------------");
    return noteContainer;
  }

  function updateNote(note) {
    NotesService.update(note).then((res) => {
      if (!res.ok) {
        console.log("{Note - updateNote} - Error: ", res);
        return;
      }
      clearSearch();
      search();
      console.log("{Note - updateNote} - Success");
      return res;
    });
  }

  function deleteNote(id) {
    NotesService.delete(id).then((res) => {
      if (!res.ok) {
        console.log("{Note - deleteNote} - Error: ", res);
        return;
      }
      console.log("{Note - deleteNote} - Success");
      search();
      return res;
    });
  }

  function bindEvents() {
    console.log("{Let's bind some events}");
    notesSearch.addEventListener("keyup", doSearch);
  }

  function init() {
    console.log("{Init app}");
    bindEvents();
    search();
  }

  return {
    init,
  };
};

// @TODO: Solve the bug from colorbox(Right now you can't update the color of note)
// Continue on this approach
