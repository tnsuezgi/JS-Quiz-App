/**
 * @author Tansu Ezgi FİDAN
 * @since 21.11.2024
 * @description BAYKAR TEKNOLOJİ Değerlendirme Projesi
 */

import React from "react";
import {BrowserRouter as Router} from 'react-router-dom';
import {Pages} from "./config/Router";

function App(){
  return (
      <Router >
          <Pages/>
      </Router>
  );
}
export default App;