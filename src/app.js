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
    notesSearch.value = "";
  }

  function clearNotes() {
    console.log(`{Clear notes}`);
    notesNode.textContent = "";
  }

  function displayNotes(notes) {
    console.log(`{Display notes}`, notes);
    notes.map((note) => renderNote(note));
  }

  function renderTNewNote() {
    const newNoteNode = document.querySelector("#js-new-note");
    console.log(`{Render NEW note}`);
    const note = {
      title: "",
      text: "",
      properties: {
        backgroundColor: "",
        backgroundImage: "",
      },
    };
    const newNode = new Note(note, noteMode.NEW, {
      search,
      newNoteNode,
      notesNode,
      clearSearch,
    }).render();
    newNoteNode.appendChild(newNode);
  }

  function renderNote(note) {
    console.log(`{Render note} =>`, note);
    const noteNode = new Note(note, noteMode.VIEW, { search }).render();
    notesNode.appendChild(noteNode);
    return notesNode;
  }

  function bindEvents() {
    notesSearch.addEventListener("keyup", doSearch);
  }

  function init() {
    bindEvents();
    renderTNewNote();
    search();
  }

  return {
    init,
    search,
  };
};
