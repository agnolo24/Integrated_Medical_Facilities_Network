# Components

In React, components are the fundamental building blocks of the application. 
They encapsulate elements of the user interface (UI) and can manage their own state and behavior. 
Components allow you to break down the UI into smaller, reusable pieces, making your code more maintainable and easier to manage.

Types of Components in React

React primarily has two types of components:

Function Components
Class Components

1. Function Components

Function components are the most common type of React component. 
They are simply JavaScript functions that accept props as an argument and return React elements.

2. Class Components

Class components are ES6 classes that extend from React.Component. 
They can have their own state and lifecycle methods, allowing more complex functionality.


# Examples

## Function

    // src/LoginForm.js
    import React from 'react';

    function LoginForm() {
      return (
        <div>
          <h2>Login</h2>
          <form>
            <div>
              <label htmlFor="username">Username</label>
              <input type="text" id="username" name="username" placeholder="Enter your username" />
            </div>
            <div>
              <label htmlFor="password">Password</label>
              <input type="password" id="password" name="password" placeholder="Enter your password" />
            </div>
            <button type="submit">Login</button>
          </form>
        </div>
      );
    }

  export default LoginForm;

----

  // src/App.js
  import React from 'react';
  import './App.css';
  import LoginForm from './LoginForm';

  function App() {
    return (
      <div className="App">
        <LoginForm />
      </div>
    );
  }

  export default App;



## Class Component


  // src/LoginForm.js
  import React, { Component } from 'react';

  class LoginForm extends Component {
    render() {
      return (
        <div>
          <h2>Login</h2>
          <form>
            <div>
              <label htmlFor="username">Username</label>
              <input type="text" id="username" name="username" placeholder="Enter your username" />
            </div>
            <div>
              <label htmlFor="password">Password</label>
              <input type="password" id="password" name="password" placeholder="Enter your password" />
            </div>
            <button type="submit">Login</button>
          </form>
        </div>
      );
    }
  }

  export default LoginForm;

----

# How to import CSS

  import './LoginForm.css';

----

# State

In React, state refers to a built-in object that allows components to store and manage data that can change over time.

  // src/Subscribe.js
  import React, { Component } from 'react';

  class Subscribe extends Component {
    constructor() {
      super();
      this.state = {
        message: 'Welcome! Please subscribe to our newsletter.'
      };
    }

    handleSubscribe = () => {
      this.setState({
        message: 'Thank you for subscribing us!'
      });
    };

    render() {
      return (
        <div>
          <h2>{this.state.message}</h2>
          <button onClick={this.handleSubscribe}>Subscribe</button>
        </div>
      );
    }
  }

  export default Subscribe;

## Example program of count

  import React, { Component } from 'react';

  class Counter extends Component {
    constructor() {
      super();
      this.state = {
        count: 0
      };
    }

    incrementCount = () => {
      this.setState({ count: this.state.count + 1 });
    };

    render() {
      return (
        <div>
          <h2>Count: {this.state.count}</h2>
          <button onClick={this.incrementCount}>Increment</button>
        </div>
      );
    }
  }

  export default Counter;


# Conditional rendering

Conditional rendering in React allows you to render different elements or components based on certain conditions.

  // src/UserGreeting.js
  import React, { Component } from 'react';

  class UserGreeting extends Component {
    constructor() {
      super();
      this.state = {
        isLoggedIn: false
      };
    }

    toggleLogin = () => {
      this.setState({
        isLoggedIn: !this.state.isLoggedIn
      });
    };

    render() {
      return (
        <div>
          {this.state.isLoggedIn ? (
            <h2>Welcome back!</h2>
          ) : (
            <h2>Please log in.</h2>
          )}
          <button onClick={this.toggleLogin}>
            {this.state.isLoggedIn ? 'Logout' : 'Login'}
          </button>
        </div>
      );
    }
  }

  export default UserGreeting;

# Using if statement

  // src/Greeting.js
  import React, { Component } from 'react';

  class Greeting extends Component {
    constructor() {
      super();
      this.state = {
        currentHour: new Date().getHours() 
      };
    }

    render() {
      let message;

      if (this.state.currentHour < 12) {
        message = "Good morning!";
      } else if (this.state.currentHour < 18) {
        message = "Good afternoon!";
      } else {
        message = "Good evening!";
      }

      return (
        <div>
          <h2>{message}</h2>
        </div>
      );
    }
  }

  export default Greeting;

# List rendering

List rendering is a common pattern in React where you iterate over an array of items and render each item as a component or element.

  // src/NameList.js
  import React, { Component } from 'react';

  class NameList extends Component {
    constructor() {
      super();
      this.state = {
        names: ["Alice", "Bob", "Charlie", "David", "Eve"]
      };
    }

    render() {
      return (
        <div>
          <h2>Names List</h2>
          <ul>
            {this.state.names.map((name, index) => (
              <li key={index}>{name}</li>
            ))}
          </ul>
        </div>
      );
    }
  }

  export default NameList;


# Rendering a list of objects

  // src/PersonList.js
  import React, { Component } from 'react';

  class PersonList extends Component {
    constructor() {
      super();
      this.state = {
        people: [
          { id: 1, name: "Alice", age: 25 },
          { id: 2, name: "Bob", age: 30 },
          { id: 3, name: "Charlie", age: 35 },
          { id: 4, name: "David", age: 40 },
          { id: 5, name: "Eve", age: 45 }
        ]
      };
    }

    render() {
      return (
        <div>
          <h2>People List</h2>
          <ul>
            {this.state.people.map((person) => (
              <li key={person.id}>
                {person.name} - Age: {person.age}
              </li>
            ))}
          </ul>
        </div>
      );
    }
  }

  export default PersonList;

------------------------------------------------------------------------------------------------------------------------------

# FORM Manage
  // src/ContactForm.js
  import React, { Component } from 'react';

  class ContactForm extends Component {
    constructor() {
      super();
      this.state = {
        username: '',
        contact: '',
        message: ''
      };
    }

    handleChange = (event) => {
      this.setState({
        [event.target.name]: event.target.value
      });
    };

    handleSubmit = (event) => {
      event.preventDefault();
      const { username, contact, message } = this.state;
      alert(`Username: ${username}\nContact: ${contact}\nMessage: ${message}`);
    };

    render() {
      return (
        <div>
          <h2>Contact Form</h2>
          <form onSubmit={this.handleSubmit}>
            <div>
              <label>Username:</label>
              <input
                type="text"
                name="username"
                value={this.state.username}
                onChange={this.handleChange}
              />
            </div>
            <div>
              <label>Contact:</label>
              <input
                type="text"
                name="contact"
                value={this.state.contact}
                onChange={this.handleChange}
              />
            </div>
            <div>
              <label>Message:</label>
              <textarea
                name="message"
                value={this.state.message}
                onChange={this.handleChange}
              />
            </div>
            <button type="submit">Submit</button>
          </form>
        </div>
      );
    }
  }

  export default ContactForm;





1. State Management:

The component's state holds the values of the form fields: username, contact, and message.

2. Handling Input Changes:

The handleChange method is called every time a user types into an input field. 
This method updates the corresponding state property using setState. 
The [event.target.name]: event.target.value syntax dynamically sets the state property based on the name attribute of the input field.

3. Handling Form Submission:

The handleSubmit method is called when the form is submitted. 
It prevents the default form submission behavior using event.preventDefault() and then displays the form values using alert.

4. Rendering the Form:

The form fields (username, contact, and message) are rendered with controlled inputs, meaning their values are tied to the component's state.

5. Displaying the Values:
When the user submits the form, the entered values are displayed in an alert box.
-----------------------------------------------------------------------------------------------------------------------------------
## Example

import React, { Component } from 'react';

class ContactForm extends Component {
  constructor() {
    super();
    this.state = {
      username: '',
      contact: '',
      message: '',
      submitted: false, // New state to track if the form is submitted
      submittedData: {}  // New state to store the submitted data
    };
  }

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    const { username, contact, message } = this.state;
    this.setState({
      submitted: true,
      submittedData: { username, contact, message }
    });
  };

  render() {
    const { username, contact, message, submitted, submittedData } = this.state;

    return (
      <div>
        <h2>Contact Form</h2>
        <form onSubmit={this.handleSubmit}>
          <div>
            <label>Username:</label>
            <input
              type="text"
              name="username"
              value={username}
              onChange={this.handleChange}
            />
          </div>
          <div>
            <label>Contact:</label>
            <input
              type="text"
              name="contact"
              value={contact}
              onChange={this.handleChange}
            />
          </div>
          <div>
            <label>Message:</label>
            <textarea
              name="message"
              value={message}
              onChange={this.handleChange}
            />
          </div>
          <button type="submit">Submit</button>
        </form>

        {submitted && (
          <div style={{ marginTop: '20px' }}>
            <h3>Submitted Details:</h3>
            <p><strong>Username:</strong> {submittedData.username}</p>
            <p><strong>Contact:</strong> {submittedData.contact}</p>
            <p><strong>Message:</strong> {submittedData.message}</p>
          </div>
        )}
      </div>
    );
  }
}

export default ContactForm;





# What Is a Component Lifecycle?

Every React component (especially Class Components) goes through a series of phases:

It is created and added (mounted) to the DOM.

It may update when data or props change.

It is removed (unmounted) when no longer needed.

React gives us lifecycle methods (class) or hooks (function) to run code at each stage.


# The Three Main Phases
1️⃣ Mounting Phase – Component Creation

This phase happens when a component is first inserted into the DOM.

Method / Hook	Purpose
constructor()	      Initialize state or bind functions.
render()	          Returns the JSX that appears on screen.
componentDidMount()	Runs after the component is displayed — used for fetching data, starting timers, etc.
#example
componentDidMount() {
  console.log("Component is now mounted!");
}
#example

useEffect(() => {
  console.log("Component mounted!");
}, []);


2️⃣ Updating Phase – Component Changes

This happens whenever props or state change, and the component re-renders.

Method / Hook	        		Purpose
render()	            		Called again to update the UI.
componentDidUpdate(prevProps, prevState)	Runs after update — good for reacting to data changes.
Hook Equivalent: useEffect(() => { … }, [dependency])	

Example:

  componentDidUpdate(prevProps, prevState) {
    console.log("Component updated!");
  }


or

  useEffect(() => {
    console.log("State changed!");
  }, [someState]);

3️⃣ Unmounting Phase – Component Removal

This phase occurs when the component is deleted from the DOM.

Method / Hook         	Purpose
componentWillUnmount()	Cleanup — remove listeners, stop timers, cancel network requests.
Hook Equivalent: return () => { … } inside useEffect	

Example:

  componentWillUnmount() {
    console.log("Component is removed!");
  }


or

  useEffect(() => {
    return () => console.log("Component unmounted!");
  }, []);





# Using useState


  //src/counter.js


  import React, { useState } from "react";

  export default function Counter() {
    // declare state
    const [count, setCount] = useState(0);

    // setCount schedules an update -> component re-renders with new count
    const increment = () => setCount(count + 1);
    const decrement = () => setCount(count - 1);
    const reset     = () => setCount(0);

    return (
      <div>
        <h3>Count: {count}</h3>
        <button onClick={increment}>+1</button>
        <button onClick={decrement}>-1</button>
        <button onClick={reset}>Reset</button>
      </div>
    );
  }

## Another example(QuantitySelector)

  import React, { useState } from "react";

  export default function QuantitySelector({ min = 0, max = 10 }) {
    const [qty, setQty] = useState(1);

    const inc = () => setQty(q => Math.min(max, q + 1));
    const dec = () => setQty(q => Math.max(min, q - 1));
    const reset = () => setQty(1);

    return (
      <div style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
        <button onClick={dec} disabled={qty <= min}>−</button>
        <span style={{ minWidth: 24, textAlign: "center" }}>{qty}</span>
        <button onClick={inc} disabled={qty >= max}>+</button>
        <button onClick={reset}>Reset</button>
      </div>
    );
  }





-----------------------

# Using useEffect

  import React, { useState, useEffect } from 'react';

  function DataFetcher() {
    const [data, setData] = useState([]);  // State to hold fetched data
    const [loading, setLoading] = useState(true);  // State to manage loading status

    useEffect(() => {
      // Function to fetch data from an API
      const fetchData = async () => {
        try {
          const response = await fetch('https://jsonplaceholder.typicode.com/posts');
          const result = await response.json();
          setData(result);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching data:', error);
          setLoading(false);
        }
      };

      fetchData();  // Call the fetch function

      // Cleanup (optional, for example, to abort a fetch request)
      return () => {
        console.log('Cleanup if needed');
      };
    }, []);  // Empty dependency array means this useEffect runs only once after the first render

    return (
      <div>
        <h2>Data List</h2>
        {loading ? (
          <p>Loading data...</p>
        ) : (
          <ul>
            {data.map(item => (
              <li key={item.id}>{item.title}</li>
            ))}
          </ul>
        )}
      </div>
    );
  }

  export default DataFetcher;






## 2nd DataFetcher

  import React, { useState, useEffect } from "react";

  function DataFetcher() {
    const [data, setData] = useState([]);       // fetched products
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await fetch("https://fakestoreapi.com/products");
          const result = await response.json();

          setData(result);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching data:", error);
          setLoading(false);
        }
      };

      fetchData();

      return () => {
        console.log("Cleanup if needed");
      };
    }, []);

    return (
      <div>
        <h2>Product List</h2>

        {loading ? (
          <p>Loading data...</p>
        ) : (
          <ul>
            {data.map((item) => (
              <li key={item.id}>
                {item.title} - ${item.price}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }

  export default DataFetcher;

## using user effect with api key


  import React, { useEffect, useState } from "react";

  export default function TmdbPopular() {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
      const controller = new AbortController();

      async function fetchPopular() {
        try {
          setLoading(true);
          setError("");

          const res = await fetch(
            "https://api.themoviedb.org/3/movie/popular?language=en-US&page=1",
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
                Accept: "application/json",
              },
              signal: controller.signal,
            }
          );

          if (!res.ok) {
            throw new Error(`TMDB error: ${res.status} ${res.statusText}`);
          }

          const json = await res.json();
          setMovies(json.results || []);
        } catch (err) {
          if (err.name !== "AbortError") {
            setError(err.message || "Something went wrong");
          }
        } finally {
          setLoading(false);
        }
      }

      fetchPopular();

      // cleanup: abort fetch if component unmounts
      return () => controller.abort();
    }, []);

    if (loading) return <p>Loading movies...</p>;
    if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

    return (
      <div>
        <h2>TMDB Popular Movies</h2>

        <ul style={{ listStyle: "none", padding: 0 }}>
          {movies.map((m) => (
            <li key={m.id} style={{ display: "flex", gap: 12, marginBottom: 14 }}>
              {m.poster_path ? (
                <img
                  src={`https://image.tmdb.org/t/p/w500${m.poster_path}`}
                  alt={m.title}
                  width="90"
                />
              ) : (
                <div style={{ width: 90 }}>No poster</div>
              )}

              <div>
                <div style={{ fontWeight: "bold" }}>{m.title}</div>
                <div>⭐ {m.vote_average}</div>
                <div style={{ maxWidth: 600 }}>{m.overview}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  };

----------------
# Router
## installing react-router-dom
  npm install react-router-dom

## Example
###  // src/components/Home.js

  import React from 'react';

  function Home() {
    return (
      <div>
        <h2>Home Page</h2>
        <p>Welcome to the Home page!</p>
      </div>
    );
  }

  export default Home;


### // src/components/About.js

  import React from 'react';

  function About() {
    return (
      <div>
        <h2>About Page</h2>
        <p>This is the About page.</p>
      </div>
    );
  }

  export default About;


### // src/components/Contact.js


  import React from 'react';

  function Contact() {
    return (
      <div>
        <h2>Contact Page</h2>
        <p>Get in touch with us!</p>
      </div>
    );
  }

  export default Contact;


### // src/App.js

  import React from 'react';
  import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
  import Home from './components/Home';
  import About from './components/About';
  import Contact from './components/Contact';

  function App() {
    return (
      <Router>
        <div>
          <nav>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/about">About</Link>
              </li>
              <li>
                <Link to="/contact">Contact</Link>
              </li>
            </ul>
          </nav>

          {/* Define the routes */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </div>
      </Router>
    );
  }

  export default App;

------



# React frontend (form + API call)

## installing axios
  npm i axios

## PatientRegister.jsx

  import { useState } from "react";
  import axios from "axios";

  const API = "http://127.0.0.1:8000/api/patients/register/";

  export default function PatientRegister() {
    const [form, setForm] = useState({
      name: "",
      gender: "Male",
      age: "",
      contact: "",
      email: "",
      password: "",
    });

    const onChange = (e) =>
      setForm({ ...form, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
      e.preventDefault();
      try {
        const payload = { ...form, age: Number(form.age) };
        const res = await axios.post(API, payload);
        alert(res.data.message + "\nPatient ID: " + res.data.patient_id);
        setForm({
          name: "",
          gender: "Male",
          age: "",
          contact: "",
          email: "",
          password: "",
        });
      } catch (err) {
        alert(err?.response?.data?.error || "Error");
      }
    };

    return (
      <div style={{ maxWidth: 500, margin: "40px auto" }}>
        <h2>Patient Registration</h2>
        <form onSubmit={onSubmit} style={{ display: "grid", gap: 10 }}>
          <input name="name" value={form.name} onChange={onChange} placeholder="Name" />
          <select name="gender" value={form.gender} onChange={onChange}>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
          <input name="age" value={form.age} onChange={onChange} placeholder="Age" />
          <input name="contact" value={form.contact} onChange={onChange} placeholder="Contact" />
          <input name="email" value={form.email} onChange={onChange} placeholder="Email" />
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={onChange}
            placeholder="Password"
          />
          <button type="submit">Register</button>
        </form>
      </div>
    );
  }



## App.jsx

import PatientRegister from "./PatientRegister";
export default function App() {
  return <PatientRegister />;
}

