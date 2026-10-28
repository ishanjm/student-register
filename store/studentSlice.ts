import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Student, INITIAL_STUDENTS } from "@/lib/studentData";

interface StudentsState {
  students: Student[];
  selectedStudent: Student | null;
}

const getInitialState = (): StudentsState => {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("edupulse_students");
    if (saved) {
      try {
        return {
          students: JSON.parse(saved),
          selectedStudent: null,
        };
      } catch (e) {
        console.error("Failed to parse cached students:", e);
      }
    }
  }
  return {
    students: INITIAL_STUDENTS,
    selectedStudent: null,
  };
};

export const studentSlice = createSlice({
  name: "students",
  initialState: getInitialState(),
  reducers: {
    addStudent: (state, action: PayloadAction<Student>) => {
      state.students.unshift(action.payload);
      if (typeof window !== "undefined") {
        localStorage.setItem("edupulse_students", JSON.stringify(state.students));
      }
    },
    updateStudent: (state, action: PayloadAction<Student>) => {
      const index = state.students.findIndex((s) => s.id === action.payload.id);
      if (index !== -1) {
        state.students[index] = action.payload;
        if (typeof window !== "undefined") {
          localStorage.setItem("edupulse_students", JSON.stringify(state.students));
        }
      }
      if (state.selectedStudent?.id === action.payload.id) {
        state.selectedStudent = action.payload;
      }
    },
    deleteStudent: (state, action: PayloadAction<string>) => {
      state.students = state.students.filter((s) => s.id !== action.payload);
      if (typeof window !== "undefined") {
        localStorage.setItem("edupulse_students", JSON.stringify(state.students));
      }
    },
    setSelectedStudent: (state, action: PayloadAction<Student | null>) => {
      state.selectedStudent = action.payload;
    },
  },
});

export const { addStudent, updateStudent, deleteStudent, setSelectedStudent } = studentSlice.actions;
export default studentSlice.reducer;
