function QuestionCard({ question }) {

  return (

    <div
      style={{
        border: "1px solid gray",
        padding: "20px",
        borderRadius: "10px",
        marginTop: "20px",
        whiteSpace: "pre-wrap"
      }}
    >

      <h2>Generated Questions</h2>

      <p>{question}</p>

    </div>

  );

}

export default QuestionCard;