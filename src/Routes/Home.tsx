import { useQuery } from "react-query";
import styled from "styled-components";
import { getMovies, IGetMoviesResult } from "../api";
import { makeImagePath } from "../untils";
import { AnimatePresence, motion, useViewportScroll } from "framer-motion";
import { useState } from "react";
import { useMatch, useNavigate } from "react-router-dom";

const Wrapper = styled.div`
  background-color: black;
  padding-bottom: 200px;
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Banner = styled.div<IBgPhotoProps>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  padding: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${props => props.bgPhoto});
  background-size: cover;
`;

const Title = styled.h2`
  font-size: 70px;
  margin-bottom: 25px;
  color: ${props => props.theme.white.lighter};
`;

const Overview = styled.p`
  font-size: 20px;
  width: 50%;
  color: ${props => props.theme.white.lighter};
`;

const Slider = styled.div`
  position: relative;
  top: -200px;
`;

const Row = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 5px;
  position: absolute;
  width: 100%;
`;

const Box = styled(motion.div) <IBgPhotoProps>`
  background-color: white;
  height: 200px;
  color: white;
  font-size: 66px;
  cursor: pointer;
  border-radius: 5px;
  background-size: center;
  background-position: bottom center;
  transform-origin: center center;
  background-image: url(${props => props.bgPhoto});

  &:first-child {
    transform-origin: center left;
  }

  &:last-child {
    transform-origin: center right;
  }
`;

const Info = styled(motion.div)`
  padding: 20px;
  opacity: 0;
  position: absolute;
  width: 100%;
  bottom: 0;
  background-color: ${props => props.theme.black.darker};

  h4 {
    text-align: center;
    font-size: 15px;
  }
`;

const BoxInfo = styled(motion.div)`
  position: absolute;
  width: 70vw;
  height: 60vh;
  left: 0;
  right: 0;
  margin: 0 auto;
  border-radius: 15px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  background-color: ${props => props.theme.black.lighter};
`;

const BoxInfoImg = styled(motion.img)`
  width: 101%;
  height: 60%;
  margin-top: -1px;
  background-size: cover;
  background-position: center center;
`;

const BoxInfoTitle = styled(motion.h3)`
  width: 100%;
  padding-left: 30px;
  text-align: left;
  font-size: 27px;
  position: relative;
  top: -55px;
  font-weight: 900;
  letter-spacing: 1.3px;
  color: ${props => props.theme.white.lighter};
`;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgb(0, 0, 0);
`;

const BoxOverview = styled.div`
  margin-top: -33px;
  padding: 20px;
  letter-spacing: .9px;
  font-weight: 100;
  background-color: inherit;
  color: ${props => props.theme.white.darker};
`;

const rowVariants = {
  hidden: {
    x: window.outerWidth + 500,
    opacity: 0
  },
  visible: {
    x: 0,
    opacity: 1
  },
  exit: {
    x: -window.outerWidth - 5,
    opacity: 0
  }
};

const boxVariants = {
  normal: {
    scale: 1
  },
  hover: {
    scale: [1, 0.9, 2.2, 2],
    y: -50,
    opacity: [1, 0.5, 0.9, 1],
    boxShadow: "0px 0px 30px 10px rgba(0, 0, 0, 1)",
    borderRadius: 0,
    zIndex: 99,
    transition: {
      type: "spring",
      delay: 0.2,
      duration: 0.5
    }
  }
};

const infoVariants = {
  hover: {
    opacity: 1,
    transition: {
      type: "spring",
      delay: 0.4,
      duration: 0.5
    }
  }
};

const overlayVariants = {
  initial: {
    opacity: 0
  },
  animate: {
    opacity: 0.8
  },
  exit: {
    opacity: 0
  }
};

interface IBgPhotoProps {
  bgPhoto: string;
}

const offset = 6;

function Home() {
  const navigate = useNavigate();
  const bigMovieMatch = useMatch("/movie/:movieId");
  const { scrollY } = useViewportScroll();
  const { isLoading: isMovieLoading, data: movieData } =
    useQuery<IGetMoviesResult>(["movies", "nowPlaying"], getMovies);

  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);

  const incraseIndex = () => {
    if (movieData) {
      if (leaving) return;
      toggleLeaving();
      const totalMovie = movieData.results.length - 1;
      const maxIndex = Math.floor(totalMovie / offset) - 1;
      setIndex(prev => (prev === maxIndex ? 0 : prev + 1));
    }
  };

  const toggleLeaving = () => setLeaving(prev => !prev);
  const onBoxClicked = (movieId: number) => {
    navigate(`/movie/${movieId}`);
  };

  const onOverlayClicked = () => navigate("/");
  const clickedMovie =
    bigMovieMatch?.params.movieId &&
    movieData?.results.find(
      movie => movie.id === +bigMovieMatch?.params.movieId
    );

  return (
    <Wrapper>
      {isMovieLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner
            onClick={incraseIndex}
            bgPhoto={makeImagePath(movieData?.results[0].backdrop_path) || ""}
          >
            <Title>{movieData?.results[0].title}</Title>
            <Overview>{movieData?.results[0].overview}</Overview>
          </Banner>
          <Slider>
            <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
              <Row
                key={index}
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{
                  type: "tween",
                  duration: 0.3
                }}
              >
                {movieData?.results
                  .slice(1)
                  .slice(offset * index, offset * index + offset)
                  .map(movie => (
                    <Box
                      layoutId={movie.id + ""}
                      onClick={() => onBoxClicked(movie.id)}
                      variants={boxVariants}
                      key={movie.id}
                      whileHover="hover"
                      initial="normal"
                      bgPhoto={makeImagePath(movie.backdrop_path, "w500")}
                      transition={{
                        type: "spring",
                        bounce: 0.2,
                        duration: 0.8
                      }}
                    >
                      <Info variants={infoVariants}>
                        <h4>{movie.title}</h4>
                      </Info>
                    </Box>
                  ))}
              </Row>
            </AnimatePresence>
          </Slider>
          <AnimatePresence>
            {bigMovieMatch ? (
              <>
                <Overlay
                  variants={overlayVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ type: "tween", duration: 0.2 }}
                  onClick={onOverlayClicked}
                />
                <BoxInfo
                  style={{
                    top: scrollY.get() + 70
                  }}
                  layoutId={bigMovieMatch.params.movieId}
                  transition={{
                    type: "spring",
                    bounce: 0.5,
                    duration: 0.4
                  }}
                >
                  {clickedMovie && (
                    <>
                      <BoxInfoImg
                        style={{
                          backgroundImage: `linear-gradient(transparent, black), url(${makeImagePath(
                            clickedMovie.backdrop_path
                          )})`
                        }}
                      />
                      <BoxInfoTitle>{clickedMovie.title}</BoxInfoTitle>
                      <BoxOverview>{clickedMovie.overview}</BoxOverview>
                    </>
                  )}
                </BoxInfo>
              </>
            ) : null}
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
}

export default Home;
