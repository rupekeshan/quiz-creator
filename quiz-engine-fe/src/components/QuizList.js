import {Button, Card, Col, Empty, Input, Layout, notification, Row, Tooltip,} from "antd";
import React, {useEffect, useState} from "react";
import QuizService from "../service/quizService";
import {useNavigate} from "react-router-dom";
import {CopyOutlined} from "@ant-design/icons";

const { Content } = Layout;

function QuizList() {
  const navigate = useNavigate();
  const [quizs, setQuizs] = useState([]);

  useEffect(() => {
    fetchQuiz();
  }, []);

  const fetchQuiz = () => {
    QuizService.list()
      .then((data) => {
        setQuizs(data.data.result);
      })
      .catch((e) => {
        notification.open({
          type: "error",
          message: e.data.message,
        });
      });
  };

  const deleteQuiz = (quizId) => {
    QuizService.deleteQuiz(quizId)
      .then((data) => {
        notification.open({
          type: "success",
          message: "Quiz deleted succcessfully",
        });
      })
      .catch((e) => {
        notification.open({
          type: "error",
          message: e.data.message,
        });
      })
      .finally(() => {
        fetchQuiz();
      });
  };

  const copyToClipboard = (val) => {
    navigator.clipboard.writeText(val);
    notification.open({
      type: "info",
      message: "Quiz id copied to clipboard",
    });
  };

  return (
    <Layout>
      <Content style={{ margin: "35px" }}>
        {quizs.length === 0 ? (
          <Empty style={{ margin: "150px 0" }}>
            <Button type="primary" onClick={() => navigate("/quiz/create")}>
              Create Quiz
            </Button>
          </Empty>
        ) : (
          quizs.map((quiz, index) => (
            <Card title={quiz.title} key={index} className="quiz-question">
              <p>
                <span className="fw-bold">No of Questions: </span>{" "}
                {quiz.questions}
              </p>
              <Row align="middle">
                <Col span={24}>
                  <span>ID: </span>
                  <Input style={{ width: "100px" }} value={quiz.quizId} />
                  <Tooltip title="copy id">
                    <Button
                      onClick={() => copyToClipboard(quiz.quizId)}
                      icon={<CopyOutlined />}
                    />
                  </Tooltip>
                </Col>
              </Row>
              <Row align="middle">
                <Col sm={20} xs={24}>
                  <span>Link: </span>
                  <Input
                    style={{ width: "250px" }}
                    value={"http://localhost:3001/quiz/" + quiz.quizId}
                  />
                  <Tooltip title="copy link">
                    <Button
                      onClick={() =>
                        copyToClipboard(
                          "http://localhost:3001/quiz/" + quiz.quizId
                        )
                      }
                      icon={<CopyOutlined />}
                    />
                  </Tooltip>
                </Col>
                <Col sm={4}>
                  <Button type="danger" onClick={() => deleteQuiz(quiz.quizId)}>
                    Delete Quiz
                  </Button>
                </Col>
              </Row>
            </Card>
          ))
        )}
      </Content>
    </Layout>
  );
}

export default QuizList;
