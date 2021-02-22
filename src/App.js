import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router } from "react-router-dom";
import 'antd/dist/antd.css';
import MyRoute from './MyRoute';

const App = () => {
  return (
    <Router>
      <MyRoute />
    </Router>
  );
}

export default App;
