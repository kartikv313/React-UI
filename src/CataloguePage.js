import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";

const CatalogueManager = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [chartData, setChartData] = useState({});

  useEffect(() => {
    fetch("https://fakestoreapi.com/products")
      .then((response) => response.json())
      .then((data) => setProducts(data))
      .catch((error) => console.error(error));

    fetch("https://fakestoreapi.com/products/categories")
      .then((response) => response.json())
      .then((data) => setCategories(data))
      .catch((error) => console.error(error));
  }, []);

  useEffect(() => {
    if (selectedCategory === "") {
      setChartData({});
      return;
    }

    const filteredProducts = products.filter(
      (product) => product.category === selectedCategory
    );
    const data = {
      labels: [selectedCategory, "Other"],
      datasets: [
        {
          data: [filteredProducts.length, products.length - filteredProducts.length],
          backgroundColor: ["#36A2EB", "#FF6384"],
          hoverBackgroundColor: ["#36A2EB", "#FF6384"],
        },
      ],
    };
    setChartData(data);
  }, [products, selectedCategory]);

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  return (
    <div>
      <h2>Catalogue Management</h2>
      <div>
        <label htmlFor="category">Filter by category:</label>
        <select id="category" value={selectedCategory} onChange={handleCategoryChange}>
          <option value="">All</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>
      <div>
        <h3>Product List</h3>
        {products
          .filter((product) =>
            selectedCategory === "" ? true : product.category === selectedCategory
          )
          .map((product) => (
            <div key={product.id}>
              <h4>{product.title}</h4>
              {product.description.length > 150 ? (
                <>
                  <p>{product.description.substring(0, 150)}...</p>
                  <button
                    onClick={() => {
                      alert(product.description);
                    }}
                  >
                    Read More
                  </button>
                </>
              ) : (
                <p>{product.description}</p>
              )}
            </div>
          ))}
      </div>
      {selectedCategory !== "" && (
        <div>
          <h3>Product Category Analysis</h3>
          <Pie data={chartData} />
        </div>
      )}
    </div>
  );
};

export default CatalogueManager;
