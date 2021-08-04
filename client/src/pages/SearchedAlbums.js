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

    try {
    const options = { variables: {title: searchInput } }
    
    const response = await saveAlbum(options);
    console.log(response.ok);

      // if (!response.ok) {
      //   throw new Error('something went wrong!');
      // }

    const { items } = await response.json();

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
    console.log(albumId);

    const albumToSave = searchedAlbums.find((album) => album.albumId === albumId);
    console.log(albumToSave)
    // get token
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      const { data }= await saveAlbum({
        variables: { input: albumToSave }
      });

      if (error) {
        throw new Error('Oops! Something bad happened!');
      }
      console.log("Album:", data)
      // if album successfully saves to user's account, save album id to state
      setSavedAlbumIds([...savedAlbumIds, albumToSave.albumId]);
    } 
    catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <Jumbotron fluid className='text-light bg-light'>
        <Container className="text-center"
          style={{backgroundColor: '#D5DBDB', borderColor: '#45A293', color: '#000000'}}>
          <h1>CASTAWAY ENTERTAINMENT</h1>
          <h2>Pack Your Top Albums!</h2>
          
          <Form  onSubmit={handleFormSubmit}>
            <Form.Row>
              <Col xs={12} md={12}>
                <Form.Control 
                  name='searchInput'
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  type='text'
                  size='lg'
                  placeholder='Abbey Road by The Beatles'
                />
                <br></br>
              </Col>
              <Col xs={12} md={12}>
                <Button type='submit' variant='success' size='lg'
                style={{backgroundColor: '#2acaea', borderColor: '#45A293', color: '#000000'}}>
                  Pack
                </Button>
              </Col>
            </Form.Row>
          </Form>
        </Container>
      </Jumbotron>


      <Container>
        <h2 className='text-center'>
          {searchedAlbums.length
            ? `Viewing ${searchedAlbums.length} results:`
            : 'Sign up or Sign In! Then pack some music to begin..'}
        </h2>
        <h2> You are headed on a trip, but you can only bring a tiny bit with you. Little do you know that soon you will be a castaway on a deserted island. Pack wisely - these are the only pieces of music you will be able to listen to via the island's magic technology.</h2>
        <CardColumns>
          {searchedAlbums.map((album) => {
            return (
              <Card key={album.albumId} border='dark'>
         
                <Card.Body>
                  <Card.Title>{album.title}</Card.Title>
                  <p className='small'>Title: {album.title}</p>

                  {Auth.loggedIn() && (
                    <Button
                      disabled={savedAlbumIds?.some((savedAlbumId) => savedAlbumId === album.albumId)}
                      className='btn-block btn-info'
                      onClick={() => handleSaveAlbum(album.albumId)}>
                      {savedAlbumIds?.some((savedAlbumId) => savedAlbumId === album.albumId)
                        ? 'This album has already been saved!'
                        : 'Save this album!'}
                    </Button>
                  )}
                </Card.Body>
              </Card>
            );
          })}
        </CardColumns>
      </Container>
    </>
  );
};
export default SearchedAlbums; 