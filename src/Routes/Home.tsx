import { useQuery } from "react-query";
import styled from "styled-components";
import { getMovies, IGetMoviesResult } from "../api";
import { makeImagePath } from "../untils";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

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

const Box = styled(motion.div)<IBgPhotoProps>`
  background-color: white;
  height: 200px;
  color: red;
  font-size: 66px;
  cursor: pointer;
  border-radius: 5px;
  background-size: center;
  background-position: center center;
  background-image: url(${props => props.bgPhoto});

  &:first-child {
    transform-origin: center left;
  }

  &:last-child {
    transform-origin: center right;
  }
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
    scale: 1,
    opacity: 0
  },
  hover: {
    scale: [1, 0.9, 2.2, 2],
    y: -50,
    opacity: [1, 0.5, 0.9, 1],
    boxShadow: "0px 0px 30px 10px rgba(0, 0, 0, 1)",
    transition: {
      delay: 0.3
    }
  }
};

interface IBgPhotoProps {
  bgPhoto: string;
}

const offset = 6;

function Home() {
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

  return (
    <Wrapper>
      {isMovieLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner
            bgPhoto={makeImagePath(movieData?.results[0].backdrop_path) || ""}
          >
            <Title>{movieData?.results[0].title}</Title>
            <Overview>{movieData?.results[0].overview}</Overview>
          </Banner>
          <Slider onClick={incraseIndex}>
            <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
              <Row
                key={index}
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{
                  type: "tween",
                  duration: 0.5
                }}
              >
                {movieData?.results
                  .slice(1)
                  .slice(offset * index, offset * index + offset)
                  .map(item => (
                    <Box
                      variants={boxVariants}
                      key={item.id}
                      whileHover="hover"
                      initial="normal"
                      bgPhoto={makeImagePath(item.backdrop_path, "w500")}
                    />
                  ))}
              </Row>
            </AnimatePresence>
          </Slider>
        </>
      )}
    </Wrapper>
  );
}

export default Home;
