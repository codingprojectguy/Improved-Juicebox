const { useState } = React; // ignore this unusual import because we're not using Webpack

// This is a plain old React form with two fields.
const SignIn = (props) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = (evt) => {
    evt.preventDefault();
    // we call our parent component's signin function with our form data
    props.signIn({
      username,
      password,
    });
  };

  // standard React form logic here with local state
  return (
    <form onSubmit={onSubmit}>
      <input
        value={username}
        onChange={(evt) => setUsername(evt.target.value)}
        name="username"
      />
      <input
        value={password}
        onChange={(evt) => setPassword(evt.target.value)}
        name="password"
      />
      <button>Sign In</button>
    </form>
  );
};

// This looks different from what we're normally doing in class with Redux.
// Instead of Redux, we're keeping track of state in our top level component.
// Instead of RTK Query, we're using axios which makes fetches.
const App = () => {
  // auth is an object defined by our User Prisma model in the backend (it's just a user)
  const [auth, setAuth] = useState({});
  const [notes, setNotes] = useState([]);

  // This function is called by the sign in form when we sign in.
  // It takes a username and password.
  const signIn = async (credentials) => {
    // POST /api/auth means "sign me in"
    let { data } = await axios.post("/api/auth", credentials);
    // It returns a "token" which is proof that we are successfully logged in.
    attemptTokenLogin(data.token);
  };

  // This function is called to VERIFY that we are LOGGED IN and get our USER DATA.
  // It takes a "token" which we send to the backend.
  // The backend then decides if the token is valid proof that we should be logged in.
  const attemptTokenLogin = async (token) => {
    if (token) {
      // GET /api/auth means "verify that I'm logged in"
      // also, it returns an object with relevant user data
      const { data } = await axios.get(`/api/auth`, {
        headers: {
          authorization: token,
        },
      });
      // we put the user data returned into our auth state
      setAuth(data);
      // const { data: notes } =
      // means "save the data property as variable named notes"
      // (because we already have a variable named data)
      const { data: notes } = await axios.get(`/api/posts`, {
        headers: {
          authorization: token,
        },
      });
      setNotes(notes);
    }
  };

  if (!auth.id) {
    // not logged in: auth is empty object {}
    return <SignIn signIn={signIn} />;
  } else {
    // logged in: auth is user data
    return (
      <div>
        Welcome {auth.username}
        <button onClick={() => setAuth({})}>Logout</button>
        <p>My Posts:</p>
        <ul>
          {notes.map((note) => {
            return <li key={note.id}>{note.text}</li>;
          })}
        </ul>
      </div>
    );
  }
};

ReactDOM.render(<App />, document.querySelector("#root"));
