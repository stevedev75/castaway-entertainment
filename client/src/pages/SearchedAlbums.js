import React, { useState, useEffect } from 'react';
import { Jumbotron, Container, Col, Form, Button, Card, CardColumns } from 'react-bootstrap';
import { saveAlbumIds, getSavedAlbumIds } from '../utils/localStorage';
import { SAVE_ALBUM } from '../utils/mutations';
import { useMutation } from '@apollo/react-hooks';


import Auth from '../utils/auth';

//Use the Apollo useMutation() Hook to execute the SAVE_ALBUM mutation

const SearchedAlbums = () => {
  const [searchedAlbums, setSearchedAlbums] = useState([]);

  // create state for holding our search field data
  const [searchInput, setSearchInput] = useState('');

  // create state to hold saved albumId values
  const [savedAlbumIds, setSavedAlbumIds] = useState(getSavedAlbumIds());

  const [saveAlbum, { error }] = useMutation(SAVE_ALBUM)


  useEffect(() => {
    return () => saveAlbumIds(savedAlbumIds);
  });


  const handleFormSubmit = async (event) => {
    event.preventDefault();


    if (!searchInput) {
      return false;
    }

let figure = Math.floor((Math.random()*10000000)+1)
    
try {
      const options = { variables: { title: searchInput, albumId: figure.toString() } }
  

      const response = await saveAlbum(options);



      // if (!response.ok) {
      //   throw new Error('something went wrong!');
      // }

      const items = response.data.saveAlbum.savedAlbums;

      const albumData = items.map((album) => ({
        albumId: album.id,
        title: album.title
      }));

      setSearchedAlbums(albumData);
      setSearchInput('');
    } catch (err) {
      console.error(err);
    }
  };






  // create function to handle saving an Album to our database
  const handleSaveAlbum = async (albumId) => {
    // find the album in `searchedAlbums` state by the matching id
    

    const albumToSave = searchedAlbums.find((album) => album.albumId === albumId);
    
    // get token
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      const { data } = await saveAlbum({
        variables: { input: albumToSave }
      });

      if (error) {
        throw new Error('Oops! Something bad happened!');
      }
      
      // if album successfully saves to user's account, save album id to state
      setSavedAlbumIds([...savedAlbumIds, albumToSave.albumId]);
    }
    catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <Jumbotron fluid className='text-light bg-'
     style={{ backgroundColor: '#2acaea', borderColor: '#7FB3D5', color: '#99999' }} >
        <Container className="text-center"
          style={{ backgroundColor: '#2acaea', borderColor: '#7FB3D5', color: '#99999' }}>
       
          <h1>CASTAWAY ENTERTAINMENT</h1>
          <h2>Pack Your Top Music!</h2>

          <Form onSubmit={handleFormSubmit}>
            <Form.Row >
              <Col className ="col-6 mx-auto "xs={12} md={3} >
              <Form.Control 
                 
                  name='searchInput'
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  type='text'
                  size='lg'
                  className='text-center'
                  placeholder='Abbey Road'
                />
                <br></br>
              </Col>
              <Col xs={12} md={12}>
                <Button type='submit' variant='success' size='lg'
                  style={{ backgroundColor: '#2acaea', borderColor: '#000000', color: '#000000' }}>
                  Pack
                </Button>
              </Col>
            </Form.Row>
          </Form>
        </Container>
      </Jumbotron>


      <Container>       
       
        <h2 className='text-center backgroundColor-tan'>
          {searchedAlbums.length

            ? `You've packed ${searchedAlbums.length} ${searchedAlbums.length === 1 ? 'selection of music' : 'selections of music'}.`
            : "Sign Up or Sign In! Then pack some music to begin. You are headed on a trip, but you can only bring a tiny bit. Little do you know that soon you'll be cast away to a desert. Pack wisely - this is the only music you'll be able to listen to while you're stranded."}
        </h2>

        {/* <CardColumns>

          {searchedAlbums.map((album) => {
            return (
              <Card key={album.albumId} border='dark'>
         
                <Card.Body>
                  <Card.Title>{album.title}</Card.Title>

                  {Auth.loggedIn() && (
                    <Button
                      disabled={savedAlbumIds?.some((savedAlbumId) => savedAlbumId === album.albumId)}
                      className='btn-block btn-info'
                      onClick={() => handleSaveAlbum(album.albumId)}>
                      {savedAlbumIds?.some((savedAlbumId) => savedAlbumId === album.albumId)
                        ? 'This music has already been packed!'
                        : 'Pack this album!'}
                    </Button>
                  )}
                </Card.Body>
              </Card>
            );
          })}
        </CardColumns> */}
      </Container>
    </>
  );
};
export default SearchedAlbums;