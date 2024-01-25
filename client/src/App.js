import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink } from '@apollo/client';
import "./App.css";

const httpLink = createHttpLink({
  uri: "/graphql"
});

const client = new ApolloClient({
  uri: 'https://flyby-router-demo.herokuapp.com/',
  cache: new InMemoryCache(),
});

function App() {
  return <div className="App">hello</div>;
}

export default App;







