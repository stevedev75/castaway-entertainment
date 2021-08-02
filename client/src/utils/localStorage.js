export const getSavedAlbumIds = () => {
  const savedAlbumIds = localStorage.getItem('saved_albums')
    ? JSON.parse(localStorage.getItem('saved_albums'))
    : [];

  return savedAlbumIds;
};

export const saveAlbumIds = (albumIdArr) => {
  if (albumIdArr.length) {
    localStorage.setItem('saved_album', JSON.stringify(albumIdArr));
  } else {
    localStorage.removeItem('saved_albums');
  }
};

export const removeAlbumId = (albumId) => {
  const savedAlbumIds = localStorage.getItem('saved_albums')
    ? JSON.parse(localStorage.getItem('saved_albums'))
    : null;

  if (!savedAlbumIds) {
    return false;
  }

  const updatedSavedAlbumIds = savedAlbumIds?.filter((savedAlbumId) => savedAlbumId !== albumId);
  localStorage.setItem('saved_albums', JSON.stringify(updatedSavedAlbumIds));

  return true;
};
