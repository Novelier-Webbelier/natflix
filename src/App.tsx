import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./Routes/Home";
import Tv from "./Routes/Tv";
import Search from "./Routes/Search";
import Header from "./Components/Header";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/tv" element={<Tv />} />
        <Route path="/search" element={<Search />} />
        <Route path="/" element={<Home />} />
        <Route path="movie/:id" element={<Home />} />
        <Route path="/*" element={<h1>Not Found</h1>} />
      </Routes>
    </Router>
  );
}

export default App;
