import gql from 'graphql-tag';

export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
        email
        albumCount
        savedAlbums {
          albumId
          title
        }
      }
    }
  }
`;

export const ADD_USER = gql`
  mutation addUser($username: String!, $email: String!, $password: String!) {
    addUser(username: $username, email: $email, password: $password) {
      token
      user {
        _id
        username
        email
        albumCount
        savedAlbums {
          albumId
          title
        }
      }
    }
  }
`;

export const SAVE_ALBUM = gql`
  mutation saveAlbum($title: String!, $albumId: String!) {
    saveAlbum(title: $title, albumId: $albumId ) {
      _id
      username
      email
      albumCount
      savedAlbums {
        _id
        albumId
        title
      }
    }
  }
`;


// Create Update mutation //

export const UPDATE_ALBUM = gql`
  mutation updateAlbum($title: String!, $albumId: String!) {
    updateAlbum(title: $title, albumId: $albumId ) {
      _id
      username
      email
      albumCount
      savedAlbums {
        albumId
        title
      }
    }
  }
`;



export const REMOVE_ALBUM = gql`
  mutation removeAlbum($albumId: String!) {
    removeAlbum(albumId: $albumId) {
      _id
      username
      email
      albumCount
      savedAlbums {
        albumId
        title
      }
    }
  }
`;