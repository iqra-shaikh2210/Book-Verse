import {Routes,Route,BrowserRouter} from "react-router";
import { useState } from "react";
import Navbar from "./components/Navbar"
import Books from "./pages/Books";
import BookDetails from "./pages/BookDetails";
import Home from "./pages/Home";
import Saved from "./pages/Saved";
function App(){
  const[savedBooks,setSavedBooks]=useState([]);
  return(
  <BrowserRouter>
  <Navbar/>
  <div>
      <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/Books"
      element={<Books
      savedBooks={savedBooks}
      setSavedBooks={setSavedBooks} 
      />
      }
      />
      <Route path="/BookDetails/:id" element={<BookDetails/>}/>
      <Route path="/Saved" element={<Saved
      savedBooks={savedBooks}
      setSavedBooks={setSavedBooks}
      />
      }
    />

      </Routes>
  </div>
  </BrowserRouter>
  );
}
export default App;