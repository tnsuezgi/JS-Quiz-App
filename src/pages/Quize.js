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
                        .map((option, index) => `${String.fromCharCode(65 + index)} | ${option}`); // A, B, C, D ekle
                    return {
                        question: capitalizeFirstLetter(question.title) + " -> " + capitalizeFirstLetter(question.body),
                        options,
                        answer: ""
                    };
                });
                setQuestions(parsedQuestions);
            } catch (error) {
                console.error("Veriler alınırken bir hata oluştu:", error);
            }
        };

        fetchQuestions();
    }, []);

    useEffect(() => {
        console.log("Questions: ", questions)
    }, [questions]);

    useEffect(() => {
        console.log("answers: ", answers)
    }, [answers]);

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
                answer: "Cevap verilmedi"
            },
        ]);
        setTimer(30);
        setIsClickable(false);
        setCurrentIndex((prev) => prev + 1);
    };

    const handleAnswer = (selectedOption) => {
        console.log("selectedOption", selectedOption)
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
                    <div className={"col-8 my-5"}>
                        <table className="table">
                            <thead>
                            <tr>
                                <th className={"text-start"} style={{width: "100px"}}>Soru</th>
                                <th className={"text-start"}>İçerik</th>
                                <th className={"text-start"}>Cevap</th>
                            </tr>
                            </thead>
                            <tbody>
                            {answers.map((ans, index) => (
                                index < 10 &&
                                <tr key={index}>
                                    <td className={"text-start color-spec text-bold"}>Soru {index+1}</td>
                                    <td className={"text-start"}>{ans.question}</td>
                                    <td className={`text-start ${
                                        !ans[index]
                                            ? "pending"
                                            : ans[index]?.answer !== "Cevap verilmedi"
                                                ? "answered"
                                                : "pending"
                                    }`}>{ans.answer}</td>
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
            <div className="container d-flex flex-column flex-md-row my-3 justify-content-center">
                <div className={"col-12 col-md-6 p-3"}>
                    <div className="question-area ">
                        <h4 className={"text-start text-bold color-spec"}>Soru {currentIndex + 1}:</h4>
                        <h5 className={"text-start text-500 my-3 my-md-0"}>{questions[currentIndex]?.question}</h5>
                    </div>
                    <div className="options d-flex flex-column ">
                        {questions[currentIndex]?.options.map((option, index) => (
                            <button
                                key={index}
                                className="btn answer-button m-2 text-start"
                                onClick={() => handleAnswer(option)}
                                disabled={!isClickable}
                                style={{opacity: !isClickable ? 0.4 : 1}}
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                </div>
                <div className={"col-12 col-md-3 d-flex flex-column align-items-center "}>
                    <div className={"d-flex flex-column box-shadow justify-content-center timer-area"}>
                        <div className={"timer-cycle"}></div>
                        <p className={"text-center text-bold"}>
                            0:{timer}
                        </p>
                        <span>Kalan Süre</span>
                    </div>
                    <div className="question-status mt-4 box-shadow">
                        <h5 className="text-center font-size-18">Quiz Soru Listesi</h5>
                        <ul className="list-unstyled">
                            {questions.map((_, index) => (
                                <li
                                    key={index}
                                    className={`status-item my-2`}
                                >
                                    <span>Quiz Sorusu {index + 1}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Quiz;
