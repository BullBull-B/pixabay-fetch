// Movie.js
import React, { useState, useEffect } from "react";
import "./Movie.css"; // Import CSS file

const Movie = () => {
  const [mediaType, setMediaType] = useState("photo"); // Default media type is photo
  const [media, setMedia] = useState([]);
  const [searchQuery, setSearchQuery] = useState("Nepal");
  const [currentImgIndex, setcurrentImgIndex] = useState(0);
  const [currentVidIndex, setcurrentVidIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false); // Track fullscreen mode
  const API_KEY = "27623692-b9295e8615d1ddce6d51b7506";
  const photoUrl = `https://pixabay.com/api/?key=${API_KEY}&q=${searchQuery}`;
  const videoUrl = `https://pixabay.com/api/videos/?key=${API_KEY}&q=${searchQuery}`;

  useEffect(() => {
    const fetchMedia = async () => {
      let url = mediaType === "photo" ? photoUrl : videoUrl;
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setMedia(data.hits);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchMedia();
  }, [searchQuery, mediaType, photoUrl, videoUrl]); // Only fetch when searchQuery or mediaType changes

  const handleSearchChange = (event) => {
    event.target.value.length === 0 ? setSearchQuery("") : setSearchQuery(event.target.value);
  };

  const handleMediaTypeChange = (type) => {
    setMediaType(type);
  };

  const handleNext = () => {
    if (mediaType === "photo") {
      setcurrentImgIndex((prevIndex) => (prevIndex + 1) % media.length);
    } else {
      setcurrentVidIndex((prevIndex) => (prevIndex + 1) % media.length);
    }
  };

  const handlePrev = () => {
    if (mediaType === "photo") {
      setcurrentImgIndex(
        (prevIndex) => (prevIndex - 1 + media.length) % media.length);
    } else {
      setcurrentVidIndex(
        (prevIndex) => (prevIndex - 1 + media.length) % media.length);
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen((prevIsFullscreen) => !prevIsFullscreen);
  };

  return (
    <div className="container">
      {!isFullscreen && (
        <div className="header">
          <h2>BULLBULL</h2>
          <input
            type="text"
            placeholder="Search photos or videos..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="search-bar"
          />
          <div className="buttons">
            <button
              className={mediaType === "photo" ? "active" : ""}
              onClick={() => handleMediaTypeChange("photo")}
            >
              Photos
            </button>
            <button
              className={mediaType === "video" ? "active" : ""}
              onClick={() => handleMediaTypeChange("video")}
            >
              Videos
            </button>
          </div>
        </div>
      )}
      <div className="media-viewer">
        {media.length > 0 ? (
          <div className="media-item">
            {mediaType === "photo" ? (
              <img
                src={media[currentImgIndex].largeImageURL}
                alt={media[currentImgIndex].tags}
                className={isFullscreen ? "enlarge-size" : "fit-size"}
                onClick={toggleFullscreen}
                style={{ cursor: "pointer" }}
              />
            ) : media[currentVidIndex] && media[currentVidIndex].videos &&
            media[currentVidIndex].videos.large ? (
              <video
                controls
                alt={media[currentVidIndex].tags}
                className={isFullscreen ? "enlarge-size" : "fit-size"}
                src={media[currentVidIndex].videos.large.url}
                type="video/mp4"
              />
            ) : (
              <div>No video available</div>
            )}
          </div>
        ) : mediaType === "photo" ? (
          <div>No Photo Available</div>
        ) : (
          <div>No Video Available</div>
        )}
      </div>
      {!isFullscreen && (
        <div className="navigation">
          <button onClick={handlePrev}>&#8592; Prev</button>
            <span>
                {media.length === 0 ? "0/0" 
                :  mediaType === "photo"
                ? `${currentImgIndex + 1}/${media.length}`
                : `${currentVidIndex + 1}/${media.length}`}
            </span>
          <button onClick={handleNext}>Next &#8594;</button>
        </div>
      )}
    </div>
  );
};

export default Movie;
