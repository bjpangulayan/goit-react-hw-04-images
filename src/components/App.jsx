import { useState, useEffect } from 'react';
import { Button } from './Button/Button';
import { ImageGallery } from './ImageGallery/ImageGallery';
import { Searchbar } from './Searchbar/Searchbar';

import { Loader } from './Loader/Loader';
import toast, { Toaster } from 'react-hot-toast';
import { getAPI } from '../pixabay-api';
import css from './App.module.css';

export const App = () => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isEnd, setIsEnd] = useState(false);


  useEffect(() => {
    if (search === '') return;
    
  
      (async () => {
          await fetchImages(search, page);
      })();

    return () => {};
    
  }, [search, page]);

  const fetchImages = async (search, page) => {
    try {
      // this.setState({ isLoading: true });
      setIsLoading(true);
      // fetch data from API
      const fetchedImages = await getAPI(search, page);

      const { hits, totalHits } = fetchedImages;
    
      console.log(hits, totalHits);
      // Display an error message if no match
      if (hits.length === 0) {
        toast.error(
          'Sorry, there are no images matching your search query. please try again.'
        );
        return;
      }
      // Display a success message when page is loaded
      if (page === 1) {
        toast.success(`Hooray! We found ${totalHits} images!`);
      }
      //  Check if all available images have been loaded
      if (page * 12 >= totalHits) {
        // this.setState({ isEnd: true });
        setIsEnd(true);
        toast("We're sorry, but you've reached the end of search results.", {
        });
      }
      //  Update the state with the new images
      // this.setState(prevState => ({
      //   images: [...prevState.images, ...hits],
      // }));
      setImages(prevState => [...prevState, ...hits]);
    } catch {
      // handle any errors that occur during the API request
      // this.setState({ isError: true });
      setIsError(true);
      // toast.error('Oops, something went wrong! Reload this page!');
    } finally {
      setIsLoading(false);
      //  Ensure loading state is reset once the API request completes
      // this.setState({ isLoading: false });
    }
  };

  const handleSubmit = e => {
    e.preventDefault();

    // const { search } = this.state;
    const newSearch = e.target.search.value.trim().toLowerCase();
     
    //  if new string is different from the current search string saved in state
  
    if (newSearch !== search) {
      //  this.setState({ search: newSearch, page: 1, images: [] });
      setSearch(newSearch);
      setPage(1);
      setImages([]);
    }
  };

  const handleClick = () => {
    // this.setState(prevState => ({ page: prevState.page + 1 }));
    setPage(prevState => prevState + 1);
  };
  
  return (
    <div className={css.app}>
      <Searchbar onSubmit={handleSubmit} />
      
      {images.length >= 1 && <ImageGallery photos={images} />}

      {images.length >= 2 && !isEnd && <Button onClick={handleClick} />}

      {isLoading && <Loader />}

      {isError && toast.error('Oops, something went wrong! Reload this page!')}

      <Toaster position="top-left" reverseOrder={false} />
    </div>
  );
};