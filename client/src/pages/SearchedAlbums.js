import React, { useState, useEffect } from 'react';
import { Jumbotron, Container, Col, Form, Button, Card, CardColumns } from 'react-bootstrap';

import Auth from '../utils/auth';

{/*import { searchGoogleBooks } from '../utils/API'; */}

import { savedAlbumIds, getSavedAlbumIds } from '../utils/localStorage';

//Use the Apollo useMutation() Hook to execute the SAVE_Album mutation

import { SAVE_ALBUM } from '../utils/mutations';
import { useMutation } from '@apollo/react-hooks';

const SearchedAlbums = () => {
 
 {/*}   // create state for holding returned google api data
const [searchedBooks, setSearchedBooks] = useState([]); */}
 
 
  // create state for holding our search field data
  const [searchInput, setSearchInput] = useState('');

  // create state to hold saved albumId values
  const [savedAlbumIds, setSavedAlbumIds] = useState(getSavedAlbumIds());

  const [saveAlbum, { error }] = useMutation(SAVE_ALBUM)

  // set up useEffect hook to save `savedAlbumIds` list to localStorage on component unmount
  // learn more here: https://reactjs.org/docs/hooks-effect.html#effects-with-cleanup
  useEffect(() => {
    return () => saveAlbumIds(savedAlbumIds);
  });


  {/*}

  // create method to search for albums and set state on form submit


  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (!searchInput) {
      return false;
    }

    try {
      const response = await searchGoogleBooks(searchInput);

      if (!response.ok) {
        throw new Error('something went wrong!');
      }

      const { items } = await response.json();

      const bookData = items.map((book) => ({
        bookId: book.id,
        authors: book.volumeInfo.authors || ['No author to display'],
        title: book.volumeInfo.title,
        description: book.volumeInfo.description,
        image: book.volumeInfo.imageLinks?.thumbnail || '',
      }));

      setSearchedBooks(bookData);
      setSearchInput('');
    } catch (err) {
      console.error(err);
    }
  };
*/}

  // create function to handle saving an Album to our database
  const handleSaveAlbum = async (AlbumId) => {
    // find the album in `searchedAlbums` state by the matching id
    const AlbumToSave = searchedAlbums.find((album) => album.albumId === albumId);

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
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <Jumbotron fluid className='text-light bg-dark'>
        <Container>
          <h1>Bring Yout Top 3 Albums!</h1>
          <Form onSubmit={handleFormSubmit}>
            <Form.Row>
              <Col xs={12} md={8}>
                <Form.Control
                  name='searchInput'
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  type='text'
                  size='lg'
                  placeholder='Sample Album Name'
                />
              </Col>
              <Col xs={12} md={4}>
                <Button type='submit' variant='success' size='lg'>
                  Save
                </Button>
              </Col>
            </Form.Row>
          </Form>
        </Container>
      </Jumbotron>

{/* FROM HERE TO THE END NEEDS CRITICAL REVIEW AND CHANGES!!! */}

      <Container>
        <h2>
          {searchedAlbums.length
            ? `Viewing ${searchedAlbums.length} results:`
            : 'Enter an album to begin'}
        </h2>
        <CardColumns>
          {searchedAlbums.map((album) => {
            return (
              <Card key={album.albumId} border='dark'>
           {/*     {book.image ? (
                  <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' />
           ) : null} */}
                <Card.Body>
                  <Card.Title>{album.title}</Card.Title>
                  <p className='small'>Title: {album.title}</p>
           {/*       <Card.Text>{book.description}</Card.Text> */}
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