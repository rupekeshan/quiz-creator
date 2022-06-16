import http from "../http-common";

const QuizService = {
  add(data) {
    return http.post("/api/quiz/add", data);
  },

  list() {
    return http.get("/api/quiz/list");
  },

  deleteQuiz(id) {
    return http.delete("/api/quiz/delete/" + id);
  },

  view(id) {
    return http.get("/api/quiz/get/" + id);
  },

  check(data) {
    return http.post("/api/quiz/check/", data);
  },
};

export default QuizService;
