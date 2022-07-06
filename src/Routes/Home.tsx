import { useQuery } from "react-query";
import { getMovies } from "../api";

function Home() {
  const { isLoading: isMovieLoading, data: movieData } = useQuery(["movies", "nowPlaying"], getMovies);

  return (
    <div
      style={{
        height: "200vh"
      }}
    ></div>
  );
}

export default Home;
