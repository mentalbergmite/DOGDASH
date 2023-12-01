//https://dev.to/asimdahall/simple-search-form-in-react-using-hooks-42pg
import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import "./styles.css";

// dummy data to test our search on
const product = [
  { label: 'product 1', value: 1.99 },

   { label: 'product 2', value: 2.99 },

   {label: 'product 2', value: 3.99 },
];


const store = [
  "Restuarant 1",
  "Restuarant 2",
  "Restuarant 3",
  
];

const handleChange = (event) => {
  
  setValue(event.target.value);

};


export default function App () {
  // take a value from the user and save it to a state
  const [searchTerm, setSearchTerm] = useState("");
  const [value, setValue] = React.useState(0);
  const [searchResults, setSearchResults] = useState([]);
  //const [menu, setMenu] = useState("");;
  
  // at every occurance of the change event, sets the current value of the form to the state
  const handleChange = e => {
    setSearchTerm(e.target.value.toLowerCase());
  };
  useEffect(() => {
    
    const results = store.filter(store =>
      store.toLowerCase().includes(searchTerm)
    
    );
    
    setSearchResults(results);
  }, [searchTerm]);
  // ^ props.people along with searchTerm in dependency
  // rendering a search bar (input) and a list of items to search through
  return (
    <div className="App">
      <input
        type="text"
        placeholder="Search"
        value={searchTerm}
        onChange={handleChange}
      />
      <ul>
        {searchResults.map(item => (
          <li>{item} <Dropdown
          options={product}
   
          value={value}
   
          onChange={handleChange}
   
        />
        <li><button>Add to cart</button></li>
        </li>
        ))}
        
      </ul>
      
    </div>
  );
}
const Dropdown = ({ value, options, onChange }) => {

  return (
 
    <label>
 
      <select value={value} onChange={onChange}>
 
        {options.map((option) => (
 
          <option value={option.value}>{option.label} ${option.value}</option>
          
        ))}
 
      </select>
 
    </label>
 
  );
 
 };

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
