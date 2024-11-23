import React from 'react';
import Quize from './Quize';
function HomePage() {
    return (
        <div className={"App"}>
            <h1 className="text-center mt-4 font-size-22">Quiz Uygulaması</h1>
            <Quize />
        </div>
    )
}

export default HomePage;