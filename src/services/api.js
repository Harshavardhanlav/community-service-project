const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

async function request(path, options = {}) {
  try {
    const response = await fetch(`${BASE_URL}${path}`, {
      headers: {
        "Content-Type": "application/json",
      },
      ...options,
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data?.message || "Server error");
    }
    return data;
  } catch (error) {
    throw new Error(error.message || "Network error");
  }
}

export async function getDashboardSummary() {
  return request("/dashboard/summary");
}

export async function getTodayAttendanceSummary() {
  return request("/attendance/today-summary");
}

export async function getTeachers() {
  return request("/teachers");
}

export async function createTeacher(teacherData) {
  return request("/teachers/create-teacher", {
    method: "POST",
    body: JSON.stringify(teacherData),
  });
}

export async function getNotices() {
  return request("/notices");
}
export async function deleteTask(id) {

   const response = await fetch(
      `http://localhost:5000/tasks/${id}`,
      {
         method: "DELETE"
      }
   );

   return response.json();

}
export async function deleteNotice(id) {

   const response = await fetch(
      `http://localhost:5000/notices/${id}`,
      {
         method: "DELETE"
      }
   );

   return response.json();

}
export async function updateNotice(id, noticeData) {

   const response = await fetch(
      `http://localhost:5000/notices/${id}`,
      {
         method: "PUT",
         headers: {
            "Content-Type": "application/json"
         },
         body: JSON.stringify(noticeData)
      }
   );

   return response.json();

}
export async function createNotice(noticeData) {
  return request("/notices/create-notice", {
    method: "POST",
    body: JSON.stringify(noticeData),
  });
}
export async function deleteCalendarDate(id) {

   const response = await fetch(
      `http://localhost:5000/calendar/${id}`,
      {
         method:"DELETE"
      }
   );

   return response.json();

}
export async function getCalendarDates() {
  return request("/calendar");
}

export async function createCalendarDate(calendarData) {
  return request("/calendar/add-date", {
    method: "POST",
    body: JSON.stringify(calendarData),
  });
}
export async function deleteTeacher(id) {

   const response = await fetch(
      `http://localhost:5000/teachers/${id}`,
      {
         method: "DELETE",
      }
   );

   const data = await response.json();

   if (!response.ok) {
      throw new Error(data.message);
   }

   return data;
}
export async function updateCalendarDate(id, calendarData) {
  return request(`/calendar/update/${id}`, {
    method: "PUT",
    body: JSON.stringify(calendarData),
  });
}

export async function getTasks() {
  return request("/tasks");
}

export async function createTask(taskData) {
  return request("/tasks/create-task", {
    method: "POST",
    body: JSON.stringify(taskData),
  });
}

export async function getAttendanceRecords() {
  return request("/attendance");
}

export async function getTeacherAttendanceReport(teacherId, month, year) {
  return request(`/attendance/report/${teacherId}?month=${month}&year=${year}`);
}

export async function getActivityLogs() {
  const [teachers, notices, tasks, attendance] = await Promise.all([
    getTeachers(),
    getNotices(),
    getTasks(),
    getAttendanceRecords(),
  ]);

  const teacherLogs = teachers.map((teacher) => ({
    id: teacher._id || teacher.teacherID,
    type: "Teacher Added",
    title: teacher.fullName,
    description: `Teacher ID ${teacher.teacherID} added`,
    date: teacher.createdAt || new Date().toISOString(),
  }));

  const noticeLogs = notices.map((notice) => ({
    id: notice._id,
    type: "Notice Created",
    title: notice.title,
    description: `Priority ${notice.priority}`,
    date: notice.createdAt || new Date().toISOString(),
  }));

  const taskLogs = tasks.map((task) => ({
    id: task._id,
    type: "Task Assigned",
    title: task.title,
    description: `Assigned to ${task.assignedTo}`,
    date: task.createdAt || new Date().toISOString(),
  }));

  const attendanceLogs = attendance.map((record) => ({
    id: record._id,
    type: "Attendance Marked",
    title: record.teacherId,
    description: `Status ${record.status}`,
    date: record.attendanceDate || record.createdAt || new Date().toISOString(),
  }));

  return [...teacherLogs, ...noticeLogs, ...taskLogs, ...attendanceLogs].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );
}
