import { useEffect, useState } from "react";

function App() {
  const [menu, setMenu] = useState([]);

  useEffect(() => {
    fetch("http://localhost/fastfood-website/backend/getMenu.php")
      .then((res) => res.json())
      .then((data) => setMenu(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <h1>🍔 Fast Food Menu</h1>
      <ul>
        {menu.map((item) => (
          <li key={item.id}>
            {item.name} — ${item.price}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
