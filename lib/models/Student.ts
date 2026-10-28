import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../db";
import { INITIAL_STUDENTS } from "../studentData";

export interface StudentAttributes {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  course: string;
  year: string;
  status: "Active" | "Pending" | "Suspended" | "Graduated";
  enrolledDate: string;
  gpa: number;
  dateOfBirth?: string;
  address?: string;
  emergencyContact?: string;
  guardianName?: string;
  bio?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export type StudentCreationAttributes = Optional<
  StudentAttributes,
  | "avatar"
  | "course"
  | "gpa"
  | "dateOfBirth"
  | "address"
  | "emergencyContact"
  | "guardianName"
  | "bio"
  | "createdAt"
  | "updatedAt"
>;

export class StudentModel
  extends Model<StudentAttributes, StudentCreationAttributes>
  implements StudentAttributes
{
  declare id: string;
  declare name: string;
  declare email: string;
  declare phone: string;
  declare avatar: string;
  declare course: string;
  declare year: string;
  declare status: "Active" | "Pending" | "Suspended" | "Graduated";
  declare enrolledDate: string;
  declare gpa: number;
  declare dateOfBirth?: string;
  declare address?: string;
  declare emergencyContact?: string;
  declare guardianName?: string;
  declare bio?: string;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

StudentModel.init(
  {
    id: {
      type: DataTypes.STRING(64),
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(128),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(128),
      allowNull: false,
      unique: true,
    },
    phone: {
      type: DataTypes.STRING(64),
      allowNull: false,
    },
    avatar: {
      type: DataTypes.STRING(512),
      allowNull: false,
      defaultValue:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    },
    course: {
      type: DataTypes.STRING(128),
      allowNull: false,
      defaultValue: "General Studies",
    },
    year: {
      type: DataTypes.STRING(32),
      allowNull: false,
      defaultValue: "Year 1",
    },
    status: {
      type: DataTypes.ENUM("Active", "Pending", "Suspended", "Graduated"),
      allowNull: false,
      defaultValue: "Active",
    },
    enrolledDate: {
      type: DataTypes.STRING(32),
      allowNull: false,
    },
    gpa: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 3.5,
    },
    dateOfBirth: {
      type: DataTypes.STRING(32),
      allowNull: true,
    },
    address: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    emergencyContact: {
      type: DataTypes.STRING(64),
      allowNull: true,
    },
    guardianName: {
      type: DataTypes.STRING(128),
      allowNull: true,
    },
    bio: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "students",
    timestamps: true,
  }
);

let studentDbInitialized = false;

export async function initStudentModel() {
  if (!studentDbInitialized) {
    try {
      await sequelize.authenticate();
      await StudentModel.sync({ alter: true });

      // Check if table is empty. If no data, seed with INITIAL_STUDENTS
      const count = await StudentModel.count();
      if (count === 0) {
        console.log("No student records found in database. Seeding initial dummy students...");
        await StudentModel.bulkCreate(INITIAL_STUDENTS);
      }

      studentDbInitialized = true;
    } catch (error) {
      console.warn("StudentModel database sync/seed error:", error);
    }
  }
  return StudentModel;
}
