import React, { useState, useEffect } from "react";

const Quiz = () => {
    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [timer, setTimer] = useState(30);
    const [isClickable, setIsClickable] = useState(false);
    const [answers, setAnswers] = useState([]);

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const quizeQuestions = await fetch("https://jsonplaceholder.typicode.com/posts");
                const data = await quizeQuestions.json();
                const parsedQuestions = data.slice(0, 10).map((question) => {
                    const options = question.body
                        .split("\n")
                        .slice(0, 4)
                        .map((option, index) => `${String.fromCharCode(65 + index)}) ${option}`); // A, B, C, D ekle
                    return {
                        question: capitalizeFirstLetter(question.title) + " -> " + capitalizeFirstLetter(question.title),
                        options,
                        correctAnswer: options[0], // Doğru şık (örnek olarak ilk şık seçildi)
                    };
                });
                setQuestions(parsedQuestions);
            } catch (error) {
                console.error("Veriler alınırken bir hata oluştu:", error);
            }
        };

        fetchQuestions();
    }, []);

    // Zamanlayıcı
    useEffect(() => {
        if (timer === 0) {
            handleNextQuestion();
        } else if (timer === 20) {
            setIsClickable(true); // İlk 10 saniye sonra tıklama aktif
        }
        const countdown = setInterval(() => setTimer((prev) => prev - 1), 1000);
        return () => clearInterval(countdown);
    }, [timer]);

    const handleNextQuestion = () => {
        setAnswers((prev) => [
            ...prev,
            {
                question: questions[currentIndex]?.question,
                answer: "No Answer",
            },
        ]);
        setTimer(30);
        setIsClickable(false);
        setCurrentIndex((prev) => prev + 1);
    };

    const handleAnswer = (selectedOption) => {
        if (isClickable) {
            setAnswers((prev) => [
                ...prev,
                {
                    question: questions[currentIndex]?.question,
                    answer: selectedOption,
                },
            ]);
            setTimer(30);
            setIsClickable(false);
            setCurrentIndex((prev) => prev + 1);
        }
    };

    const capitalizeFirstLetter = (sentence) => {
        if (!sentence) return ''; // Eğer boşsa, boş döndür
        return sentence.charAt(0).toUpperCase() + sentence.slice(1);
    };

    if (currentIndex >= questions.length) {
        return (
            <div className={"row d-flex flex-column align-items-center"}>
                <div className="container d-flex flex-column align-items-center justify-content-center mb-5">
                    <div className={"col-6 my-5"}>
                        <h3>Quiz Sonuçları:</h3>
                        <table className="table">
                            <thead>
                            <tr>
                                <th>Soru</th>
                                <th>Cevap</th>
                            </tr>
                            </thead>
                            <tbody>
                            {answers.map((ans, index) => (
                                <tr key={index}>
                                    <td>{ans.question}</td>
                                    <td>{ans.answer}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={"row d-flex flex-column align-items-center"}>
            <div className="container d-flex flex-column align-items-center my-5">
                <div className={"col-9 col-md-6"}>
                    <div className="question-area">
                        <h4 className={"text-start text-bold"}>Soru {currentIndex + 1}:</h4>
                        <p className={"text-start"}>{questions[currentIndex]?.question}</p>
                    </div>
                    <div className="options d-flex flex-column ">
                    {questions[currentIndex]?.options.map((option, index) => (
                            <button
                                key={index}
                                className="btn btn-primary m-2 answ-button"
                                onClick={() => handleAnswer(option)}
                                disabled={!isClickable}
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                    <p className={"text-center my-5"}><span className={"text-bold"}>Kalan Süre:</span> {timer} saniye</p>
                </div>
            </div>
        </div>
    );
};

export default Quiz;
