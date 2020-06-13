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

  function renderNoteNode(note) {
    return createElem({
      children: [
        createElem({
          children: [
            createElem({
              children: [],
              props: {
                className: "note__title",
                textContent: note.title,
              },
            }),
            createElem({
              children: [],
              props: {
                className: "note__text",
                textContent: note.text,
              },
            }),
          ],
          props: {
            className: "note__body",
          },
        }),
      ],
      props: {
        className: "note",
        "style.backgroundColor": note.backgroundColor,
      },
    });
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

function createElem({ element = "div", children = [], props = {} }) {
  const el = document.createElement(element);

  for (let [key, value] of Object.entries(props)) {
    el[key] = value;
  }

  if (children.length !== 0) {
    for (let i = 0; i < children.length; i++) {
      el.appendChild(children[i]);
    }
  }
  return el;
}
