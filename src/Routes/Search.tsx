import { useLocation } from "react-router-dom";

function Search() {
  const keyword = new URLSearchParams(useLocation().search).get("keyword");
  console.log(keyword);

  return <h1>Search</h1>;
}

export default Search;
