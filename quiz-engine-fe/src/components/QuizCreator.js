import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Checkbox,
  Col,
  Divider,
  Input,
  Layout,
  notification,
  Radio,
  Row,
  Switch,
  Tooltip,
  Typography,
} from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import QuizService from "../service/quizService";
import { useNavigate } from "react-router-dom";

function QuizCreator() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [titleError, setTitleError] = useState("");
  const [questions, setQuestions] = useState([
    {
      question: "",
      options: [
        {
          text: "",
          correct: false,
        },
        {
          text: "",
          correct: false,
        },
      ],
      multi: false,
    },
  ]);

  const [error, setError] = useState([
    {
      message: "",
      radioMessage: "",
      options: [{ message: "" }, { message: "" }],
    },
  ]);

  const addQuestion = () => {
    let newQuestion = {
      question: "",
      options: [
        {
          text: "",
          correct: false,
        },
        {
          text: "",
          correct: false,
        },
      ],
      multi: false,
    };
    if (questions.length >= 10) {
      notification.open({
        type: "error",
        message: "Maximum 10 Questions",
      });
      return;
    }
    const newError = {
      message: "",
      radioMessage: "",
      options: [{ message: "" }, { message: "" }],
    };
    setError([...error, newError]);
    setQuestions([...questions, newQuestion]);
  };

  const deleteQuestion = (index) => {
    if (questions.length === 1) {
      notification.open({
        type: "warning",
        message: "Minimum 1 Question required",
      });
      return;
    }
    let _questions = questions;
    _questions.splice(index, 1);
    const newEr = [...error];
    newEr.splice(index, 1);
    setError(newEr);
    setQuestions([..._questions]);
  };

  const publishQuiz = () => {
    resetError();
    if (!validateError()) {
      return;
    }
    QuizService.add({ title, questions })
      .then((data) => {
        notification.open({
          type: "success",
          message: data.data.message,
        });
        navigate("/quiz/list");
      })
      .catch((e) => {
        if (e.response.data.message) {
          notification.open({
            type: "error",
            message: e.response.data.message,
          });
        }
      });
  };

  function resetError() {
    const newEr = [...error];

    for (let i = 0; i < newEr.length; i++) {
      const q = newEr[i];
      newEr[i].message = "";
      newEr[i].radioMessage = "";
      for (let j = 0; j < q.options.length; j++) {
        const o = q.options[j];
        newEr[i].options[j].message = "";
      }
    }
    setError(newEr);
    setTitleError("");
  }

  function validateError() {
    let valid = true;
    if (!title.length) {
      setTitleError("Title is Required");
      valid = false;
    }
    const newEr = [...error];
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.question.length) {
        newEr[i].message = "Question Text is required";
        valid = false;
      }
      let pro = false;
      for (let j = 0; j < q.options.length; j++) {
        const o = q.options[j];
        if (o.correct) {
          pro = true;
        }
        if (!o.text.length) {
          newEr[i].options[j].message = "Option Text is required";
          valid = false;
        }
      }
      if (!pro) {
        newEr[i].radioMessage = "Answer is required";
        valid = false;
      }
    }
    return valid;
  }

  const onTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const addOption = (index) => {
    const newQu = [...questions];
    newQu[index].options.push({
      text: "",
      correct: false,
    });
    newQu[index].options = newQu[index].options.map((i) => {
      return { ...i, correct: false };
    });
    const newEr = [...error];
    newEr[index].options.push({
      message: "",
    });
    setError(newEr);
    setQuestions(newQu);
  };

  const deleteOption = (index, oindex) => {
    const newQu = [...questions];
    newQu[index].options.splice(oindex, 1);
    newQu[index].options = newQu[index].options.map((i) => {
      return { ...i, correct: false };
    });
    const newEr = [...error];
    newEr[index].options.splice(oindex, 1);
    setError(newEr);
    setQuestions(newQu);
  };

  const onQuestionTextChange = (event, index) => {
    const newQu = [...questions];
    newQu[index].question = event.target.value;
    setQuestions(newQu);
  };

  const onOptionTextChange = (event, index, oindex) => {
    const newQu = [...questions];
    newQu[index].options[oindex].text = event.target.value;
    setQuestions(newQu);
  };

  const onOptionRadioChange = (event, index) => {
    const newQu = [...questions];

    if (Array.isArray(event)) {
      for (let i = 0; i < newQu[index].options.length; i++) {
        newQu[index].options[i].correct = event.indexOf(i) !== -1;
      }
    } else {
      newQu[index].options = newQu[index].options.map((i) => {
        return { ...i, correct: false };
      });
      newQu[index].options[event.target.value].correct = true;
    }
    setQuestions(newQu);
  };

  const onMultiChange = (value, index) => {
    const newQu = [...questions];
    newQu[index].options = newQu[index].options.map((i) => {
      return { ...i, correct: false };
    });
    newQu[index].multi = value;
    setQuestions(newQu);
  };

  function getCurrentRadioValue(option) {
    const i = option.indexOf(option.find((i) => i.correct));
    return i == -1 ? undefined : i;
  }
  function getCurrentMultiValue(option) {
    const o = option.filter((i) => i.correct).map((i) => option.indexOf(i));
    return o.length ? o : undefined;
  }

  return (
    <Layout className="quiz-wrapper">
      <div
        style={{
          backgroundColor: "white",
          padding: "10px 25px",
          marginBottom: "25px",
        }}
      >
        <div className="d-flex align-items-center justify-content-between mb-2">
          <Typography.Title level={3}>Create Quiz</Typography.Title>
          <Button type="danger" onClick={publishQuiz}>
            Save & Publish
          </Button>
        </div>

        <Card className="quiz-question">
          <Row className="align-items-center">
            <Col xs={24}>
              <Input
                status={titleError.length ? "error" : ""}
                placeholder="Please enter the quiz title"
                onChange={onTitleChange}
                maxLength={50}
                value={title}
              ></Input>
              <div className="d-block invalid-feedback">{titleError}</div>
            </Col>
          </Row>
        </Card>
        {questions.map((question, index) => (
          <Card key={index} className="quiz-question">
            <Row align="middle" className="justify-content-between mb-2">
              <div className="d-flex align-items-center">
                <Switch
                  onChange={(e) => onMultiChange(e, index)}
                  size="small"
                  checked={question.multi}
                />
                &nbsp;
                <label className="col-form-label">Multiple Choice</label>
              </div>
              <Tooltip title="Delete Question">
                <Button
                  onClick={() => deleteQuestion(index)}
                  type="danger"
                  shape="circle"
                  icon={<DeleteOutlined />}
                ></Button>
              </Tooltip>
            </Row>
            <Row align="middle">
              <span>{index + 1 + ". "}&nbsp; </span>

              <Input.TextArea
                status={error[index].message.length ? "error" : ""}
                placeholder="Please enter the question"
                value={question.question}
                maxLength={500}
                onChange={(e) => onQuestionTextChange(e, index)}
              ></Input.TextArea>
              <div className="d-block invalid-feedback">
                {error[index].message}
              </div>
            </Row>
            <Divider />
            {!question.multi && (
              <>
                <Radio.Group
                  size="large"
                  onChange={(e) => onOptionRadioChange(e, index)}
                  value={getCurrentRadioValue(question.options)}
                >
                  {question.options.map((option, oindex) => (
                    <Row
                      className="margin-15 flex-nowrap"
                      key={oindex}
                      align="middle"
                    >
                      <Radio
                        className="align-items-center"
                        checked={option.correct}
                        value={oindex}
                      >
                        <Input.TextArea
                          status={
                            error[index].options[oindex].message.length
                              ? "error"
                              : ""
                          }
                          value={option.text}
                          onChange={(v) => onOptionTextChange(v, index, oindex)}
                          placeholder="Please enter the answer"
                          maxLength={200}
                        ></Input.TextArea>
                        <div className="d-block invalid-feedback">
                          {error[index].options[oindex].message}
                        </div>
                      </Radio>
                      {question.options.length > 2 && (
                        <Tooltip title="Delete Option">
                          <Button
                            onClick={() => deleteOption(index, oindex)}
                            type="danger"
                            shape="circle"
                            icon={<DeleteOutlined />}
                          ></Button>
                        </Tooltip>
                      )}
                    </Row>
                  ))}
                </Radio.Group>
                <div className="d-block invalid-feedback">{error[index].radioMessage}</div>
                {question.options.length < 5 && (
                  <Divider style={{ borderTopColor: "rgb(0 0 0 / 58%)" }}>
                    <Tooltip title="Add option">
                      <Button
                        onClick={() => addOption(index)}
                        type="dashed"
                        shape="round"
                      >
                        <div className="d-flex align-items-baseline">
                          <PlusOutlined />
                          &nbsp; <span>Option</span>
                        </div>
                      </Button>
                    </Tooltip>
                  </Divider>
                )}
              </>
            )}
            {question.multi && (
              <>
                <Checkbox.Group
                  size="large"
                  onChange={(e) => onOptionRadioChange(e, index)}
                  value={getCurrentMultiValue(question.options)}
                >
                  {question.options.map((option, oindex) => (
                    <Row
                      className="margin-15  flex-nowrap"
                      key={oindex}
                      align="middle"
                    >
                      <Checkbox
                        className="align-items-center"
                        checked={option.correct}
                        value={oindex}
                      >
                        <Input.TextArea
                          status={
                            error[index].options[oindex].message.length
                              ? "error"
                              : ""
                          }
                          value={option.text}
                          onChange={(v) => onOptionTextChange(v, index, oindex)}
                          placeholder="Please enter the answer"
                          maxLength={200}
                        ></Input.TextArea>
                        <div className="d-block invalid-feedback">
                          {error[index].options[oindex].message}
                        </div>
                      </Checkbox>
                      {question.options.length > 2 && (
                        <Tooltip title="Delete option">
                          <Button
                            onClick={() => deleteOption(index, oindex)}
                            type="danger"
                            shape="circle"
                            icon={<DeleteOutlined />}
                          ></Button>
                        </Tooltip>
                      )}
                    </Row>
                  ))}
                </Checkbox.Group>
                <div className="d-block invalid-feedback">{error[index].radioMessage}</div>
                {question.options.length < 5 && (
                  <Divider style={{ borderTopColor: "rgb(0 0 0 / 58%)" }}>
                    <Tooltip title="Add option">
                      <Button
                        onClick={() => addOption(index)}
                        type="dashed"
                        shape="round"
                      >
                        <div className="d-flex align-items-baseline">
                          <PlusOutlined />
                          &nbsp; <span>Option</span>
                        </div>
                      </Button>
                    </Tooltip>
                  </Divider>
                )}
              </>
            )}
          </Card>
        ))}
        <Row className="justify-content-center">
          <Button
            disabled={questions.length >= 10}
            onClick={addQuestion}
            type="primary"
            shape="round"
          >
            <div className="d-flex align-items-baseline">
              <PlusOutlined />
              &nbsp; <span>Question</span>
            </div>
          </Button>
        </Row>
      </div>
    </Layout>
  );
}

export default QuizCreator;
