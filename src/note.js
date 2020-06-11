const noteMode = {
  NEW: "new",
  EDIT: "edit",
  VIEW: "view",
};

class Note {
  constructor(note, type = noteMode.VIEW, props = {}) {
    this.note = note;
    this.type = type;
    this.props = props;
    this.container = createEl("div", ["note"]);
  }

  createContainerNode() {
    this.container.style.backgroundColor =
      colors[this.note.properties.backgroundColor];

    return this.container;
  }

  createTitleNode() {
    const titleNode = createEl("div", ["note__title"]);
    titleNode.textContent = this.note.title;
    return titleNode;
  }

  createTextNode() {
    const textNode = createEl("div", ["note__text"]);
    textNode.textContent = this.note.text;
    return textNode;
  }

  createTitleNodeNew() {
    const titleNode = createEl("input", ["new-note__title"]);
    titleNode.placeholder = "Title";
    titleNode.textContent = this.note.text;
    titleNode.addEventListener(
      "change",
      (e) => (this.note.title = e.currentTarget.value)
    );
    return titleNode;
  }

  createTextNodeNew() {
    const textNode = createEl("textarea", ["new-note__text"]);
    textNode.placeholder = "Take a note...";
    textNode.textContent = this.note.text;
    textNode.addEventListener("keydown", autoHeight);
    textNode.addEventListener(
      "change",
      (e) => (this.note.text = e.currentTarget.value)
    );
    return textNode;
  }

  createImageNode() {
    const imageContainerNode = createEl("div", ["note__image"]);

    const imageNode = createEl("img");
    imageNode.src = this.note.properties.backgroundImage;

    const imageDeleteNode = createEl("span", [
      "note__image__delete",
      "fa",
      "fa-trash",
    ]);
    imageDeleteNode.addEventListener("click", () => {
      this.note.properties.backgroundImage = "";
      this.updateNote();
    });

    imageContainerNode.appendChild(imageDeleteNode);
    imageContainerNode.appendChild(imageNode);

    return imageContainerNode;
  }

  createBodyNode() {
    const bodyNode = createEl("div", ["note__body"]);

    if (this.type === noteMode.NEW) {
      const tileNode = this.createTitleNodeNew();
      const textNode = this.createTextNodeNew();

      bodyNode.appendChild(tileNode);
      bodyNode.appendChild(textNode);
    } else {
      const titleNode = this.createTitleNode();
      const textNode = this.createTextNode();

      bodyNode.appendChild(titleNode);
      bodyNode.appendChild(textNode);
    }

    return bodyNode;
  }

  createFooterNode() {
    const footerNode = createEl("div", ["note__footer"]);

    if (this.type === noteMode.VIEW) {
      const imageUploadNode = this.createImageUploadNode();
      footerNode.appendChild(imageUploadNode);
    }

    const colorsNode = this.createColorsNode();
    footerNode.appendChild(colorsNode);

    if (this.type === noteMode.VIEW) {
      const deleteNode = this.createDeleteNode();
      footerNode.appendChild(deleteNode);
    }

    return footerNode;
  }

  createImageUploadNode() {
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
        this.note.properties.backgroundImage = imgReader.result;
        this.updateNote();
      };
    });
    imageUploadNode.addEventListener("click", () => {
      imageFileInput.click();
    });
    return imageUploadNode;
  }

  onClickColor(color) {
    this.note.properties.backgroundColor = color;
    if (this.type === noteMode.NEW) {
      this.container.style.backgroundColor =
        colors[this.note.properties.backgroundColor];
      return;
    } else {
      this.updateNote();
    }
  }

  createColorsBox() {
    const colorBox = createEl("div", ["note__colors_box"]);
    for (let [key, value] of Object.entries(colors)) {
      const isSelected = this.note.properties.backgroundColor === key;
      const colorNode = createEl("div", ["note__colors_box__color"]);
      isSelected && colorNode.classList.add("selected");
      colorNode.title = key;
      colorNode.style.backgroundColor = value;
      colorBox.appendChild(colorNode);
      colorNode.addEventListener("click", () => this.onClickColor(key));
    }
    return colorBox;
  }

  createColorsNode() {
    const colorsNode = createEl("span", ["note__colors-container"]);

    const colorBoxNode = this.createColorsBox();
    colorsNode.appendChild(colorBoxNode);

    const colorIconNode = createEl("span", ["note__colors", "fa", "fa-circle"]);
    colorsNode.appendChild(colorIconNode);

    return colorsNode;
  }

  createDeleteNode() {
    const deleteNode = createEl("span", ["note__delete", "fa", "fa-trash"]);
    deleteNode.addEventListener("click", () => this.deleteNote());
    return deleteNode;
  }

  addNewNote() {
    if (!this.note.title.length || !this.note.text.length) {
      console.warn("{Note - addNewNote}: Empty Title and/or text");
      return;
    }

    NotesService.create(this.note).then((res) => {
      if (!res.ok) {
        console.log("{Note - createNote} - Error: ", res);
        return;
      }
      console.log("{Note - createNote} - Success", res);
      this.props.clearSearch();
      // this.resetForm();
      this.props.search();
    });
  }

  updateNote() {
    NotesService.update(this.note).then((res) => {
      if (!res.ok) {
        console.log("{Note - updateNote} - Error: ", res);
        return;
      }
      this.props.search();
      console.log("{Note - updateNote} - Success");
      return res;
    });
  }

  deleteNote() {
    NotesService.delete(this.note.id).then((res) => {
      if (!res.ok) {
        console.log("{Note - deleteNote} - Error: ", res);
        return;
      }
      console.log("{Note - deleteNote} - Success");
      this.props.search();
      return res;
    });
  }

  resetForm() {}

  prepareToAddItem() {
    const buddyNode = document.querySelector("body");
    buddyNode.addEventListener("click", (e) => {
      if (
        this.props.newNoteNode.contains(e.target) ||
        this.props.notesNode.contains(e.target)
      ) {
        return;
      }
      this.addNewNote();
    });
  }

  render() {
    console.log("{Start rendering note}");
    const noteContainer = this.createContainerNode();

    if (!!this.note.properties.backgroundImage) {
      const noteImageNode = this.createImageNode();
      noteContainer.appendChild(noteImageNode);
    }

    const noteBodyNode = this.createBodyNode();
    noteContainer.appendChild(noteBodyNode);

    const noteFooterNode = this.createFooterNode();
    noteContainer.appendChild(noteFooterNode);

    if (this.type === noteMode.NEW) {
      this.prepareToAddItem();
    }
    console.log("{End rendering note}");
    console.log("--------------------------------------------------");
    return noteContainer;
  }
}
