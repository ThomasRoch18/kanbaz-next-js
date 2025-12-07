import axios from "axios";
const axiosWithCredentials = axios.create({ withCredentials: true });
const HTTP_SERVER = process.env.NEXT_PUBLIC_HTTP_SERVER;
const COURSES_API = `${HTTP_SERVER}/api/courses`;
const USERS_API = `${HTTP_SERVER}/api/users`;
const MODULES_API = `${HTTP_SERVER}/api/modules`;
const ASSIGNMENTS_API = `${HTTP_SERVER}/api/assignments`;
const ENROLLMENTS_API = `${HTTP_SERVER}/api/enrollments`;
const QUIZZES_API = `${HTTP_SERVER}/api/quizzes`;
const ATTEMPTS_API = `${HTTP_SERVER}/api/attempts`;

export const fetchAllCourses = async () => {
  const { data } = await axios.get(COURSES_API);
  return data;
};
export const findMyCourses = async () => {
  const { data } = await axiosWithCredentials.get(`${USERS_API}/current/courses`);
  return data;
};
export const createCourse = async (course: any) => {
  const { data } = await axiosWithCredentials.post(`${USERS_API}/current/courses`, course);
  return data;
};
export const deleteCourse = async (id: string) => {
  const { data } = await axios.delete(`${COURSES_API}/${id}`);
  return data;
};
export const updateCourse = async (course: any) => {
  const { data } = await axios.put(`${COURSES_API}/${course._id}`, course);
  return data;
};
export const findModulesForCourse = async (courseId: string) => {
  const response = await axios
    .get(`${COURSES_API}/${courseId}/modules`);
  return response.data;
};
export const createModuleForCourse = async (courseId: string, module: any) => {
  const response = await axios.post(
    `${COURSES_API}/${courseId}/modules`,
    module
  );
  return response.data;
};
export const deleteModule = async (courseId: string, moduleId: string) => {
 const response = await axios.delete(`${COURSES_API}/${courseId}/modules/${moduleId}`);
 return response.data;
};
export const updateModule = async (courseId: string, module: any) => {
  const { data } = await axios.put(`${COURSES_API}/${courseId}/modules/${module._id}`, module);
  return data;
};

export const findAssignmentsForCourse = async (courseId: string) => {
  const response = await axios
    .get(`${COURSES_API}/${courseId}/assignments`);
  return response.data;
};
export const createAssignmentForCourse = async (courseId: string, assignment: any) => {
  const response = await axios.post(
    `${COURSES_API}/${courseId}/assignments`,
    assignment
  );
  return response.data;
};
export const deleteAssignment = async (assignmentId: string) => {
 const response = await axios.delete(`${ASSIGNMENTS_API}/${assignmentId}`);
 return response.data;
};
export const updateAssignment = async (assignment: any) => {
  const { data } = await axios.put(`${ASSIGNMENTS_API}/${assignment._id}`, assignment);
  return data;
};

export const enrollUser = async (userId: string, courseId: string) => {
  const response = await axiosWithCredentials.post(`${ENROLLMENTS_API}/current/${courseId}`);
  return response.data;
}

export const unEnrollUser = async (userId: string, courseId: string) => {
  const response = await axiosWithCredentials.delete(`${ENROLLMENTS_API}/current/${courseId}`);
  return response.data;
}

export const fetchAllEnrollments = async () => {
  const { data } = await axios.get(`${ENROLLMENTS_API}`);
  return data;
}
export const findUsersForCourse = async (courseId: string) => {
 const response = await axios.get(`${COURSES_API}/${courseId}/users`);
 return response.data;
};

// Quizzes
export const fetchAllQuizzes = async () => {
  const { data } = await axios.get(`${QUIZZES_API}/fetch`);
  return data;
}

export const findQuizzesForCourse = async (courseId: string) => {
  const { data } = await axios.get(`${QUIZZES_API}/course/${courseId}`);
  return data;
};

export const findQuizById = async (quizId: string) => {
  const { data } = await axios.get(`${QUIZZES_API}/${quizId}`);
  return data;
};

export const createQuiz = async (quiz: any) => {
  const { data } = await axios.post(QUIZZES_API, quiz);
  return data;
};

export const updateQuiz = async (quizId: string, quiz: any) => {
  const { data } = await axios.put(`${QUIZZES_API}/${quizId}`, quiz);
  return data;
};

export const deleteQuiz = async (quizId: string) => {
  const { data } = await axios.delete(`${QUIZZES_API}/${quizId}`);
  return data;
};

export const createQuizQuestion = async (quizId: string, question: any) => {
  const { data } = await axios.post(
    `${QUIZZES_API}/${quizId}/questions`,
    question
  );
  return data;
};

export const updateQuizQuestion = async (
  quizId: string,
  questionId: string,
  question: any
) => {
  const { data } = await axios.put(
    `${QUIZZES_API}/${quizId}/questions/${questionId}`,
    question
  );
  return data;
};

export const deleteQuizQuestion = async (quizId: string, questionId: string) => {
  const { data } = await axios.delete(
    `${QUIZZES_API}/${quizId}/questions/${questionId}`
  );
  return data;
};

export const createQuizQuestionAnswer = async (
  quizId: string,
  questionId: string,
  answer: any
) => {
  const { data } = await axios.post(
    `${QUIZZES_API}/${quizId}/questions/${questionId}/answers`,
    answer
  );
  return data;
};

export const updateQuizQuestionAnswer = async (
  quizId: string,
  questionId: string,
  answerId: string,
  answer: any
) => {
  const { data } = await axios.put(
    `${QUIZZES_API}/${quizId}/questions/${questionId}/answers/${answerId}`,
    answer
  );
  return data;
};

export const deleteQuizQuestionAnswer = async (
  quizId: string,
  questionId: string,
  answerId: string
) => {
  const { data } = await axios.delete(
    `${QUIZZES_API}/${quizId}/questions/${questionId}/answers/${answerId}`
  );
  return data;
};

export const createAttempt = async (attempt: any) => {
  const { data } = await axios.post(ATTEMPTS_API, attempt);
  return data;
};

export const findAttemptForUser = async (userId: string, quizId: string) => {
  const { data } = await axios.get(
    `${ATTEMPTS_API}/user/${userId}/quiz/${quizId}`
  );
  return data;
};

export const updateAttempt = async (attemptId: string, attempt: any) => {
  const { data } = await axios.put(
    `${ATTEMPTS_API}/${attemptId}`,
    attempt
  );
  return data;
};

export const publishQuiz = async (quizId: string) => {
  const { data } = await axios.put(`${QUIZZES_API}/${quizId}/publish`);
  return data; 
}

export const unpublishQuiz = async (quizId: string) => {
  const { data } = await axios.put(`${QUIZZES_API}/${quizId}/unpublish`);
  return data; 
}