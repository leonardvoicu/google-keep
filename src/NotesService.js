const NotesService = (() => {
  const api = "http://localhost:3000/notes";
  const headers = {
    "Content-Type": "application/json",
  };

  const getAll = (word) => {
    let newApi = api;
    const querySort = "_sort=id&_order=DESC";
    if (!!word) {
      newApi += `?q=${word}&${querySort}`;
    } else {
      newApi += `?${querySort}`;
    }
    return fetch(newApi).then((res) => res.json());
  };

  const getNote = (id) => {
    return fetch(`${api}/${id}`).then((res) => res.json());
  };

  const createNote = (note) => {
    return fetch(`${api}`, {
      method: "POST",
      headers,
      body: JSON.stringify(note),
    });
  };

  const updateNote = (note) => {
    return fetch(`${api}/${note.id}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify(note),
    });
  };

  const deleteNote = (id) => {
    return fetch(`${api}/${id}`, {
      method: "DELETE",
    });
  };

  return {
    getAll,
    get: getNote,
    create: createNote,
    update: updateNote,
    delete: deleteNote,
  };
})();
