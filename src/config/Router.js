import React from "react";
import {Route, Routes} from "react-router-dom";
import HomePage from '../pages/HomePage';

class NotFound extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        return (
            <div style={{ fontSize: "14px", color: "rgb(82 82 82)"}}>
                <h4>{"Sayfa bulunamadı."}</h4>
            </div>
        );
    }
}
const Pages = () => (
    <Routes>
        <Route path="/" exact element={<HomePage />} />
        <Route path="*" element={<NotFound />} />
    </Routes>
);

export { Pages };