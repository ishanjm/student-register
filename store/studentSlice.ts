import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { Student } from "@/lib/studentData";

interface StudentsState {
  students: Student[];
  selectedStudent: Student | null;
  loading: boolean;
  error: string | null;
}

const initialState: StudentsState = {
  students: [],
  selectedStudent: null,
  loading: false,
  error: null,
};

// Async thunks to communicate with backend Student API
export const fetchStudents = createAsyncThunk(
  "students/fetchStudents",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/students");
      return response.data.students as Student[];
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { error?: string } } };
      return rejectWithValue(
        axiosErr.response?.data?.error || "Failed to fetch students from API"
      );
    }
  }
);

export const createStudent = createAsyncThunk(
  "students/createStudent",
  async (newStudent: Student, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/students", newStudent);
      return response.data.student as Student;
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { error?: string } } };
      return rejectWithValue(
        axiosErr.response?.data?.error || "Failed to register student"
      );
    }
  }
);

export const updateStudentRecord = createAsyncThunk(
  "students/updateStudentRecord",
  async (student: Student, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `/api/students/${encodeURIComponent(student.id)}`,
        student
      );
      return response.data.student as Student;
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { error?: string } } };
      return rejectWithValue(
        axiosErr.response?.data?.error || "Failed to update student"
      );
    }
  }
);

export const removeStudent = createAsyncThunk(
  "students/removeStudent",
  async (id: string, { rejectWithValue }) => {
    try {
      await axios.delete(`/api/students/${encodeURIComponent(id)}`);
      return id;
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { error?: string } } };
      return rejectWithValue(
        axiosErr.response?.data?.error || "Failed to delete student"
      );
    }
  }
);

export const studentSlice = createSlice({
  name: "students",
  initialState,
  reducers: {
    setSelectedStudent: (state, action: PayloadAction<Student | null>) => {
      state.selectedStudent = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch
    builder.addCase(fetchStudents.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchStudents.fulfilled, (state, action) => {
      state.loading = false;
      state.students = action.payload;
    });
    builder.addCase(fetchStudents.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Create
    builder.addCase(createStudent.fulfilled, (state, action) => {
      state.students.unshift(action.payload);
    });

    // Update
    builder.addCase(updateStudentRecord.fulfilled, (state, action) => {
      const idx = state.students.findIndex((s) => s.id === action.payload.id);
      if (idx !== -1) {
        state.students[idx] = action.payload;
      }
      if (state.selectedStudent?.id === action.payload.id) {
        state.selectedStudent = action.payload;
      }
    });

    // Delete
    builder.addCase(removeStudent.fulfilled, (state, action) => {
      state.students = state.students.filter((s) => s.id !== action.payload);
    });
  },
});

export const { setSelectedStudent } = studentSlice.actions;
export default studentSlice.reducer;
