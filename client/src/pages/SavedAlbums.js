import React from 'react';
import { Jumbotron, Container, CardColumns, Card, Button } from 'react-bootstrap';
import Auth from '../utils/auth';
import { removeAlbumId } from '../utils/localStorage';
import { updateAlbum} from '../utils/localStorage';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { REMOVE_ALBUM } from '../utils/mutations';
import { UPDATE_ALBUM } from '../utils/mutations';
import { GET_ME } from '../utils/queries';

const SavedAlbums = () => {

  const { loading, data } = useQuery(GET_ME);
  const userData = data?.me || {};

  const [removeAlbum, { error }] = useMutation(REMOVE_ALBUM);
  const [updateAlbum] = useMutation(UPDATE_ALBUM);

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



  // Create Update Code HERE//

  const handleUpdateAlbum = async (title) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      await updateAlbum({
        variables: { title }
      });

      if (error) {
        throw new Error('Oops! Something bad happened!');
      }
      // upon success, update album's title in localStorage
      updateAlbum(title);
    } catch (err) {
      console.error(err);
    }
  };

  // if data isn't here yet, say so
  if (loading) {
    return <h2>LOADING...</h2>;
  }
  //____________________________________________________//
  return (
    <>
      <Jumbotron fluid className='text-light bg-dark text-center'
        style={{ backgroundColor: '#2acaea', borderColor: '#45A293', color: '#000000' }}>
        <Container>
          <h1>Here's What You've Got!</h1>
        </Container>
      </Jumbotron>
      <Container>
        <h2 className="text-center">
          {userData.savedAlbums.length
            ? `Viewing ${userData.savedAlbums.length} packed ${userData.savedAlbums.length === 1 ? 'selection of music' : 'selections of music'}:`
            : 'You have no packed music!'}
        </h2>
        <br></br>
        <CardColumns>
          {userData.savedAlbums.map((album) => {
            return (
              <Card key={album.albumId} border='dark'>

                <Card.Body>
                  <Card.Title className="text-center">{album.title}</Card.Title>

                  <Button className='btn-block btn-danger' onClick={() => handleDeleteAlbum(album.albumId)}>
                    Delete this music!
                  </Button>

                  <Button className='btn-block' onClick={() => handleUpdateAlbum(album.title)}>
                    Update this music!
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