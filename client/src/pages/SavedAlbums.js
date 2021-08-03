import React from 'react';
import { Jumbotron, Container, CardColumns, Card, Button } from 'react-bootstrap';
import Auth from '../utils/auth';
import { removeAlbumId } from '../utils/localStorage';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { REMOVE_ALBUM } from '../utils/mutations';
import { GET_ME } from '../utils/queries';

const SavedAlbums = () => {

  const {loading, data} = useQuery(GET_ME);
  const userData = data?.me || {};

  const [removeAlbum, { error }] = useMutation(REMOVE_ALBUM);

  // create function that accepts the album's mongo _id value as param and deletes the album from the database
  const handleDeleteAlbum = async (albumId) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      await removeAlbum({
        variables: { albumId }
      });

      if (error) {
        throw new Error('Oops! Something bad happened!');
      }
      // upon success, remove album's id from localStorage
      removeAlbumId(albumId);
    } catch (err) {
      console.error(err);
    }
  };

  // if data isn't here yet, say so
  if (loading) {
    return <h2>LOADING...</h2>;
  }

  return (
    <>
        <Jumbotron fluid className='text-light bg-dark'className="text-center">
        <Container>
          <h1>Viewing saved albums!</h1>
        </Container>
      </Jumbotron>
      <Container>
        <h2 className="text-center">
          {userData.savedAlbums.length
            ? `Viewing ${userData.savedAlbums.length} saved ${userData.savedAlbums.length === 1 ? 'album' : 'albums'}:`
            : 'You have no saved albums!'}
        </h2>
        <CardColumns>
          {userData.savedAlbums.map((album) => {
            return (
              <Card key={album.albumId} border='dark'>
       
                <Card.Body>
                  <Card.Title>{album.title}</Card.Title>
                  <p className='small'>Albums: {album.title}</p>
       
                  <Button className='btn-block btn-danger' onClick={() => handleDeleteAlbum(album.albumId)}>
                    Delete this album!
                  </Button>
                </Card.Body>
              </Card>
            );
          })}
        </CardColumns>
      </Container>
    </>
  );
};

export default SavedAlbums;