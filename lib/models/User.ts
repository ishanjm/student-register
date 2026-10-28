import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../db";

export interface UserAttributes {
  id: number;
  name: string;
  email: string;
  passwordHash: string;
  role: "admin" | "user";
  status: "approved" | "pending" | "rejected";
  refreshToken?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export type UserCreationAttributes = Optional<
  UserAttributes,
  "id" | "role" | "status" | "refreshToken" | "createdAt" | "updatedAt"
>;

export class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  declare id: number;
  declare name: string;
  declare email: string;
  declare passwordHash: string;
  declare role: "admin" | "user";
  declare status: "approved" | "pending" | "rejected";
  declare refreshToken: string | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
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
      validate: {
        isEmail: true,
      },
    },
    passwordHash: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("admin", "user"),
      allowNull: false,
      defaultValue: "user",
    },
    status: {
      type: DataTypes.ENUM("approved", "pending", "rejected"),
      allowNull: false,
      defaultValue: "pending",
    },
    refreshToken: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "users",
    timestamps: true,
  }
);

let initialized = false;
export async function initUserModel() {
  if (!initialized) {
    try {
      await sequelize.authenticate();
      await User.sync({ alter: true });
      initialized = true;
    } catch (error) {
      console.warn("Database connection/sync error:", error);
    }
  }
  return User;
}
