// FilterSidebar.js

import React from 'react';

const FilterSidebar = ({ handleFilter }) => {
  return (
    <div className="filter-sidebar">
      <h3>Filter</h3>
      <button onClick={() => handleFilter('ascending')}>Price: Low to High</button>
      <button onClick={() => handleFilter('descending')}>Price: High to Low</button>
    </div>
  );
};

export default FilterSidebar;
